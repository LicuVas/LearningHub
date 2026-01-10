#!/usr/bin/env python3
"""
LearningHub to OneCompiler Sync Script

Converts local HTML files to OneCompiler-compatible format and provides
instructions/clipboard content for manual upload.

Since OneCompiler doesn't have a public API, this script:
1. Reads local HTML files
2. Rewrites internal links to use OneCompiler URLs (from config)
3. Outputs ready-to-paste content
4. Opens OneCompiler in browser for manual paste

Usage:
    python sync_to_onecompiler.py                    # Sync all pending
    python sync_to_onecompiler.py --file hub/index.html  # Sync specific file
    python sync_to_onecompiler.py --list             # List files to sync
"""

import os
import re
import sys
import json
import webbrowser
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, Optional

# Configuration
LEARNINGHUB_DIR = Path(r"C:\AI\Projects\LearningHub")
SYNC_DIR = LEARNINGHUB_DIR / "sync"
CONFIG_FILE = SYNC_DIR / "onecompiler_config.json"
CHANGES_FILE = SYNC_DIR / "pending_changes.json"
OUTPUT_DIR = SYNC_DIR / "onecompiler_ready"

ONECOMPILER_NEW_HTML = "https://onecompiler.com/html"


def load_config() -> Dict:
    """Load OneCompiler configuration."""
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"pages": {}, "link_mappings": {"mappings": {}}}


def save_config(config: Dict):
    """Save OneCompiler configuration."""
    config["meta"]["updated"] = datetime.now().strftime("%Y-%m-%d")
    with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2)


def rewrite_links(html_content: str, source_file: str, config: Dict) -> str:
    """Rewrite local links to OneCompiler URLs."""
    mappings = config.get("link_mappings", {}).get("mappings", {})

    if not mappings:
        # No mappings yet - add placeholder comments
        html_content = html_content.replace(
            '</head>',
            '<!-- TODO: Update links after creating all OneCompiler pages -->\n</head>'
        )
        return html_content

    # Calculate base path for relative link resolution
    source_path = Path(source_file)
    source_dir = source_path.parent

    def replace_href(match):
        quote_char = match.group(1)
        href = match.group(2)

        # Skip external links, anchors, and javascript
        if href.startswith(('http://', 'https://', '#', 'javascript:', 'mailto:')):
            return match.group(0)

        # Resolve relative path to get lookup key
        try:
            if href.startswith('../'):
                # Navigate up from source directory
                resolved = (LEARNINGHUB_DIR / source_dir / href).resolve()
                rel_to_hub = resolved.relative_to(LEARNINGHUB_DIR)
                lookup_key = str(rel_to_hub).replace('\\', '/')
            else:
                # Relative to source directory
                resolved = (LEARNINGHUB_DIR / source_dir / href).resolve()
                rel_to_hub = resolved.relative_to(LEARNINGHUB_DIR)
                lookup_key = str(rel_to_hub).replace('\\', '/')
        except (ValueError, OSError):
            # Path resolution failed, keep original
            return match.group(0)

        # Look up in mappings
        if lookup_key in mappings:
            return f'href={quote_char}{mappings[lookup_key]}{quote_char}'

        return match.group(0)

    # Replace href attributes - capture quote and href separately
    html_content = re.sub(r'href=(["\'])([^"\']+)\1', replace_href, html_content)

    return html_content


def prepare_for_onecompiler(html_content: str) -> str:
    """Prepare HTML content for OneCompiler (any necessary adjustments)."""
    # OneCompiler runs HTML directly, minimal changes needed

    # Ensure proper doctype
    if not html_content.strip().lower().startswith('<!doctype'):
        html_content = '<!DOCTYPE html>\n' + html_content

    return html_content


def process_file(file_path: str, config: Dict) -> str:
    """Process a single file for OneCompiler."""
    full_path = LEARNINGHUB_DIR / file_path

    if not full_path.exists():
        raise FileNotFoundError(f"File not found: {full_path}")

    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Rewrite links
    content = rewrite_links(content, file_path, config)

    # Prepare for OneCompiler
    content = prepare_for_onecompiler(content)

    return content


def copy_to_clipboard(text: str):
    """Copy text to clipboard (Windows) with proper UTF-8 support."""
    try:
        # Use PowerShell for proper Unicode support
        import subprocess
        # PowerShell Set-Clipboard handles Unicode correctly
        process = subprocess.Popen(
            ['powershell', '-Command', 'Set-Clipboard -Value $input'],
            stdin=subprocess.PIPE,
            encoding='utf-8'
        )
        process.communicate(text)
        return process.returncode == 0
    except Exception:
        # Fallback: try pyperclip if available
        try:
            import pyperclip
            pyperclip.copy(text)
            return True
        except ImportError:
            return False


def sync_file(file_path: str, config: Dict, open_browser: bool = True):
    """Sync a single file to OneCompiler."""
    print(f"\nProcessing: {file_path}")
    print("-" * 50)

    try:
        content = process_file(file_path, config)

        # Save to output directory
        OUTPUT_DIR.mkdir(exist_ok=True)
        output_file = OUTPUT_DIR / file_path.replace('/', '_').replace('\\', '_')
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Saved to: {output_file}")

        # Copy to clipboard
        if copy_to_clipboard(content):
            print("Content copied to clipboard!")
        else:
            print("Could not copy to clipboard - please copy from the output file")

        # Check if page exists
        page_config = config.get("pages", {}).get(file_path, {})
        onecompiler_id = page_config.get("onecompiler_id")

        if onecompiler_id:
            url = f"https://onecompiler.com/html/{onecompiler_id}"
            print(f"\nExisting page: {url}")
            print("Paste the content to update it")
        else:
            url = ONECOMPILER_NEW_HTML
            print(f"\nNo existing page - creating new")
            print("After saving, update the onecompiler_id in config!")

        if open_browser:
            print(f"Opening: {url}")
            webbrowser.open(url)

        return True

    except Exception as e:
        print(f"Error: {e}")
        return False


def list_files_to_sync(config: Dict):
    """List all files that need syncing."""
    print("Files configured for OneCompiler sync:")
    print("-" * 60)

    for file_path, page_config in config.get("pages", {}).items():
        status = page_config.get("status", "unknown")
        oc_id = page_config.get("onecompiler_id", "not set")
        last_sync = page_config.get("last_synced", "never")

        status_icon = {
            "pending_create": "[NEW]",
            "synced": "[OK]",
            "modified": "[MOD]"
        }.get(status, "[?]")

        print(f"{status_icon} {file_path}")
        print(f"      ID: {oc_id or 'not set'} | Last sync: {last_sync}")
        print()


def register_onecompiler_id(file_path: str, onecompiler_id: str):
    """Register the OneCompiler ID for a file after creation."""
    config = load_config()

    if file_path not in config["pages"]:
        config["pages"][file_path] = {}

    config["pages"][file_path]["onecompiler_id"] = onecompiler_id
    config["pages"][file_path]["status"] = "synced"
    config["pages"][file_path]["last_synced"] = datetime.now().isoformat()

    # Also add to link mappings
    onecompiler_url = f"https://onecompiler.com/html/{onecompiler_id}"
    config["link_mappings"]["mappings"][file_path] = onecompiler_url

    save_config(config)
    print(f"Registered: {file_path} -> {onecompiler_url}")


def sync_all_pending(config: Dict):
    """Sync all files marked as pending."""
    pending_files = [
        path for path, cfg in config.get("pages", {}).items()
        if cfg.get("status") in ["pending_create", "modified"]
    ]

    if not pending_files:
        print("No files pending sync!")
        return

    print(f"Files to sync: {len(pending_files)}")
    print("Will process one at a time. After each:")
    print("1. Paste content into OneCompiler")
    print("2. Save and copy the URL ID")
    print("3. Run: python sync_to_onecompiler.py --register <file> <id>")
    print()

    for i, file_path in enumerate(pending_files, 1):
        print(f"\n[{i}/{len(pending_files)}] {file_path}")
        input("Press Enter to process this file...")
        sync_file(file_path, config)

        new_id = input("Enter the OneCompiler ID (or press Enter to skip): ").strip()
        if new_id:
            register_onecompiler_id(file_path, new_id)


def main():
    parser = argparse.ArgumentParser(description="Sync LearningHub to OneCompiler")
    parser.add_argument("--file", help="Specific file to sync")
    parser.add_argument("--list", action="store_true", help="List files to sync")
    parser.add_argument("--all", action="store_true", help="Sync all pending files")
    parser.add_argument("--register", nargs=2, metavar=("FILE", "ID"),
                        help="Register OneCompiler ID for a file")
    parser.add_argument("--no-browser", action="store_true",
                        help="Don't open browser")

    args = parser.parse_args()
    config = load_config()

    if args.list:
        list_files_to_sync(config)
    elif args.register:
        register_onecompiler_id(args.register[0], args.register[1])
    elif args.file:
        sync_file(args.file, config, open_browser=not args.no_browser)
    elif args.all:
        sync_all_pending(config)
    else:
        # Default: show status and prompt
        list_files_to_sync(config)
        print("\nUse --file <path> to sync a specific file")
        print("Use --all to sync all pending files")


if __name__ == "__main__":
    main()
