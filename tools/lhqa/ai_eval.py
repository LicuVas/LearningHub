"""AI Evaluation interface for LHQA.

Supports three modes:
- "deferred": Generates evaluation prompts, saves to file for batch review
- "api": Calls LLM API directly (requires ANTHROPIC_API_KEY or OPENAI_API_KEY)
- "heuristic": Pattern-based evaluation, no API needed
"""

import json
import os
from pathlib import Path
from typing import Optional
from .models import CheckResult

REPORTS_DIR = Path(__file__).resolve().parent / "reports"


class AIEvaluator:
    """Handles AI-powered quality checks."""

    def __init__(self, mode: str = "deferred"):
        self.mode = mode  # "deferred" or "api"
        self.pending_evaluations = []

    def evaluate(self, check_id: str, check_name: str, prompt: str,
                 severity: str = "major", fix_hint: str = "") -> CheckResult:
        """Request an AI evaluation for a quality check.

        In deferred mode: returns a pending CheckResult with the prompt stored.
        In API mode: calls the LLM and returns a definitive result.
        """
        if self.mode == "deferred":
            self.pending_evaluations.append({
                "check_id": check_id,
                "check_name": check_name,
                "prompt": prompt,
                "severity": severity,
            })
            return CheckResult(
                check_id=check_id,
                check_name=check_name,
                passed=None,
                details="AI evaluation pending",
                severity=severity,
                fix_suggestion=fix_hint,
                ai_prompt=prompt,
            )

        if self.mode == "api":
            return self._call_api(check_id, check_name, prompt, severity, fix_hint)

        if self.mode == "heuristic":
            from .heuristic_eval import evaluate_heuristic
            return evaluate_heuristic(check_id, check_name, prompt, severity, fix_hint)

        raise ValueError(f"Unknown AI evaluator mode: {self.mode}")

    def _call_api(self, check_id: str, check_name: str, prompt: str,
                  severity: str, fix_hint: str) -> CheckResult:
        """Call LLM API for evaluation."""
        try:
            import anthropic
            client = anthropic.Anthropic()
            response = client.messages.create(
                model="claude-sonnet-4-5-20250929",
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}],
                system="You are a curriculum quality evaluator for a Romanian ICT education platform (grades 5-8). "
                       "Evaluate the content and respond in this exact JSON format: "
                       '{"passed": true/false, "reasoning": "brief explanation", "issues": ["issue1", "issue2"]}',
            )
            result_text = response.content[0].text
            result = json.loads(result_text)
            return CheckResult(
                check_id=check_id,
                check_name=check_name,
                passed=result.get("passed", False),
                details=result.get("reasoning", "No reasoning provided"),
                severity=severity,
                fix_suggestion="; ".join(result.get("issues", [])) or fix_hint,
            )
        except ImportError:
            return CheckResult(
                check_id=check_id,
                check_name=check_name,
                passed=None,
                details="anthropic package not installed. Run: pip install anthropic",
                severity=severity,
                ai_prompt=prompt,
            )
        except Exception as e:
            return CheckResult(
                check_id=check_id,
                check_name=check_name,
                passed=None,
                details=f"API call failed: {e}",
                severity=severity,
                ai_prompt=prompt,
            )

    def save_pending(self, lesson_code: str) -> Optional[Path]:
        """Save pending AI evaluations to a JSON file for batch processing."""
        if not self.pending_evaluations:
            return None
        REPORTS_DIR.mkdir(parents=True, exist_ok=True)
        output = REPORTS_DIR / f"{lesson_code}_ai_eval_tasks.json"
        with open(output, "w", encoding="utf-8") as f:
            json.dump(self.pending_evaluations, f, ensure_ascii=False, indent=2)
        return output

    def get_pending_count(self) -> int:
        return len(self.pending_evaluations)
