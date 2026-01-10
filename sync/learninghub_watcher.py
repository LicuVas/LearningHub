#!/usr/bin/env python3
"""
LearningHub File Watcher Daemon

Monitors the LearningHub folder for changes and notifies when sync is needed.
Runs as a background process/service.

Usage:
    python learninghub_watcher.py          # Start watcher
    python learninghub_watcher.py --status # Check status
    python learninghub_watcher.py --stop   # Stop watcher
"""

import os
import sys
import json
import time
import hashlib
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, Set

# Configuration
LEARNINGHUB_DIR = Path(r"C:\AI\Projects\LearningHub")
SYNC_DIR = LEARNINGHUB_DIR / "sync"
CONFIG_FILE = SYNC_DIR / "onecompiler_config.json"
STATE_FILE = SYNC_DIR / "watcher_state.json"
CHANGES_FILE = SYNC_DIR / "pending_changes.json"
PID_FILE = SYNC_DIR / "watcher.pid"

# Watch these file patterns
WATCH_PATTERNS = ["*.html", "*.css", "*.js", "*.json"]
IGNORE_DIRS = ["sync", ".git", "__pycache__", "node_modules"]

# Check interval in seconds
CHECK_INTERVAL = 30


def get_file_hash(filepath: Path) -> str:
    """Calculate MD5 hash of file content."""
    try:
        with open(filepath, 'rb') as f:
            return hashlib.md5(f.read()).hexdigest()
    except Exception:
        return ""


def get_tracked_files() -> Dict[str, str]:
    """Get all trackable files and their hashes."""
    files = {}

    for pattern in WATCH_PATTERNS:
        for filepath in LEARNINGHUB_DIR.rglob(pattern):
            # Skip ignored directories
            if any(ignored in filepath.parts for ignored in IGNORE_DIRS):
                continue

            rel_path = str(filepath.relative_to(LEARNINGHUB_DIR))
            files[rel_path] = get_file_hash(filepath)

    return files


def load_state() -> Dict:
    """Load previous state from file."""
    if STATE_FILE.exists():
        try:
            with open(STATE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            pass
    return {"file_hashes": {}, "last_check": None}


def save_state(state: Dict):
    """Save current state to file."""
    SYNC_DIR.mkdir(exist_ok=True)
    with open(STATE_FILE, 'w', encoding='utf-8') as f:
        json.dump(state, f, indent=2, default=str)


def load_pending_changes() -> Dict:
    """Load pending changes list."""
    if CHANGES_FILE.exists():
        try:
            with open(CHANGES_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            pass
    return {"changes": [], "last_updated": None}


def save_pending_changes(changes: Dict):
    """Save pending changes list."""
    changes["last_updated"] = datetime.now().isoformat()
    with open(CHANGES_FILE, 'w', encoding='utf-8') as f:
        json.dump(changes, f, indent=2)


def detect_changes(old_hashes: Dict[str, str], new_hashes: Dict[str, str]) -> Dict:
    """Detect file changes between two states."""
    changes = {
        "added": [],
        "modified": [],
        "deleted": []
    }

    old_files = set(old_hashes.keys())
    new_files = set(new_hashes.keys())

    # New files
    for f in new_files - old_files:
        changes["added"].append(f)

    # Deleted files
    for f in old_files - new_files:
        changes["deleted"].append(f)

    # Modified files
    for f in old_files & new_files:
        if old_hashes[f] != new_hashes[f]:
            changes["modified"].append(f)

    return changes


def notify_changes(changes: Dict):
    """Notify user about changes (console + save to file)."""
    total = len(changes["added"]) + len(changes["modified"]) + len(changes["deleted"])

    if total == 0:
        return

    print(f"\n{'='*50}")
    print(f"[{datetime.now().strftime('%H:%M:%S')}] LearningHub Changes Detected!")
    print(f"{'='*50}")

    if changes["added"]:
        print(f"\n+ ADDED ({len(changes['added'])}):")
        for f in changes["added"]:
            print(f"  + {f}")

    if changes["modified"]:
        print(f"\n~ MODIFIED ({len(changes['modified'])}):")
        for f in changes["modified"]:
            print(f"  ~ {f}")

    if changes["deleted"]:
        print(f"\n- DELETED ({len(changes['deleted'])}):")
        for f in changes["deleted"]:
            print(f"  - {f}")

    print(f"\n>>> Run 'python sync_to_onecompiler.py' to sync these changes")
    print(f"{'='*50}\n")

    # Also update pending changes file
    pending = load_pending_changes()
    timestamp = datetime.now().isoformat()

    for f in changes["added"]:
        pending["changes"].append({"file": f, "type": "added", "detected": timestamp})
    for f in changes["modified"]:
        pending["changes"].append({"file": f, "type": "modified", "detected": timestamp})
    for f in changes["deleted"]:
        pending["changes"].append({"file": f, "type": "deleted", "detected": timestamp})

    save_pending_changes(pending)


def run_watcher():
    """Main watcher loop."""
    print(f"LearningHub Watcher Started")
    print(f"Monitoring: {LEARNINGHUB_DIR}")
    print(f"Check interval: {CHECK_INTERVAL} seconds")
    print(f"Press Ctrl+C to stop\n")

    # Save PID
    SYNC_DIR.mkdir(exist_ok=True)
    with open(PID_FILE, 'w') as f:
        f.write(str(os.getpid()))

    # Initial state
    state = load_state()

    if not state["file_hashes"]:
        print("First run - indexing files...")
        state["file_hashes"] = get_tracked_files()
        save_state(state)
        print(f"Indexed {len(state['file_hashes'])} files")

    try:
        while True:
            time.sleep(CHECK_INTERVAL)

            # Get current state
            current_hashes = get_tracked_files()

            # Detect changes
            changes = detect_changes(state["file_hashes"], current_hashes)

            # Notify if changes found
            if any(changes.values()):
                notify_changes(changes)
                state["file_hashes"] = current_hashes
                state["last_check"] = datetime.now().isoformat()
                save_state(state)

    except KeyboardInterrupt:
        print("\nWatcher stopped")
        if PID_FILE.exists():
            PID_FILE.unlink()


def show_status():
    """Show current watcher status."""
    print("LearningHub Watcher Status")
    print("-" * 40)

    # Check if running
    if PID_FILE.exists():
        with open(PID_FILE, 'r') as f:
            pid = f.read().strip()
        print(f"Status: RUNNING (PID: {pid})")
    else:
        print("Status: NOT RUNNING")

    # Show state
    state = load_state()
    if state["last_check"]:
        print(f"Last check: {state['last_check']}")
    print(f"Tracked files: {len(state.get('file_hashes', {}))}")

    # Show pending changes
    pending = load_pending_changes()
    if pending["changes"]:
        print(f"\nPending changes: {len(pending['changes'])}")
        for change in pending["changes"][-5:]:  # Show last 5
            print(f"  [{change['type']}] {change['file']}")
        if len(pending["changes"]) > 5:
            print(f"  ... and {len(pending['changes']) - 5} more")


def stop_watcher():
    """Stop the watcher process."""
    if PID_FILE.exists():
        with open(PID_FILE, 'r') as f:
            pid = int(f.read().strip())

        try:
            import signal
            os.kill(pid, signal.SIGTERM)
            print(f"Sent stop signal to watcher (PID: {pid})")
            PID_FILE.unlink()
        except ProcessLookupError:
            print("Watcher process not found, cleaning up...")
            PID_FILE.unlink()
        except Exception as e:
            print(f"Error stopping watcher: {e}")
    else:
        print("Watcher is not running")


def clear_pending():
    """Clear pending changes after sync."""
    if CHANGES_FILE.exists():
        CHANGES_FILE.unlink()
        print("Pending changes cleared")


def main():
    parser = argparse.ArgumentParser(description="LearningHub File Watcher")
    parser.add_argument("--status", action="store_true", help="Show watcher status")
    parser.add_argument("--stop", action="store_true", help="Stop the watcher")
    parser.add_argument("--clear", action="store_true", help="Clear pending changes")
    parser.add_argument("--reindex", action="store_true", help="Reindex all files")

    args = parser.parse_args()

    if args.status:
        show_status()
    elif args.stop:
        stop_watcher()
    elif args.clear:
        clear_pending()
    elif args.reindex:
        state = {"file_hashes": get_tracked_files(), "last_check": datetime.now().isoformat()}
        save_state(state)
        print(f"Reindexed {len(state['file_hashes'])} files")
    else:
        run_watcher()


if __name__ == "__main__":
    main()
