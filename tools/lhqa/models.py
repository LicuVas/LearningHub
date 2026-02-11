"""Data models for LHQA evaluation results."""

from dataclasses import dataclass, field
from typing import List, Optional
from datetime import datetime


@dataclass
class CheckResult:
    """Result of a single quality check."""
    check_id: str               # "1.1", "3.5", etc.
    check_name: str             # Human-readable name
    passed: Optional[bool]      # None = AI evaluation pending
    details: str                # Explanation of result
    severity: str = "major"     # "critical", "major", "minor"
    fix_suggestion: str = ""    # Actionable fix
    ai_prompt: str = ""         # If passed=None, the evaluation prompt


@dataclass
class PassResult:
    """Result of one evaluation pass (contains multiple checks)."""
    pass_number: int
    pass_name: str
    checks: List[CheckResult] = field(default_factory=list)

    @property
    def evaluated_checks(self) -> List[CheckResult]:
        return [c for c in self.checks if c.passed is not None]

    @property
    def passed_checks(self) -> List[CheckResult]:
        return [c for c in self.checks if c.passed is True]

    @property
    def failed_checks(self) -> List[CheckResult]:
        return [c for c in self.checks if c.passed is False]

    @property
    def pending_checks(self) -> List[CheckResult]:
        return [c for c in self.checks if c.passed is None]

    @property
    def score(self) -> tuple:
        """Returns (passed, evaluated, pending)."""
        return len(self.passed_checks), len(self.evaluated_checks), len(self.pending_checks)

    @property
    def score_str(self) -> str:
        p, e, pend = self.score
        s = f"{p}/{e}"
        if pend:
            s += f" (+{pend} pending AI)"
        return s

    @property
    def all_passed(self) -> bool:
        return len(self.failed_checks) == 0 and len(self.pending_checks) == 0


@dataclass
class LessonReport:
    """Full quality report for a single lesson."""
    lesson_code: str
    lesson_title: str = ""
    passes: List[PassResult] = field(default_factory=list)
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())

    @property
    def total_checks(self) -> int:
        return sum(len(p.checks) for p in self.passes)

    @property
    def total_passed(self) -> int:
        return sum(len(p.passed_checks) for p in self.passes)

    @property
    def total_failed(self) -> int:
        return sum(len(p.failed_checks) for p in self.passes)

    @property
    def total_pending(self) -> int:
        return sum(len(p.pending_checks) for p in self.passes)

    @property
    def verdict(self) -> str:
        if self.total_failed > 0:
            critical = sum(
                1 for p in self.passes for c in p.failed_checks
                if c.severity == "critical"
            )
            if critical > 0:
                return "FAILED"
            return "NEEDS_WORK"
        if self.total_pending > 0:
            return "PARTIAL_PASS"
        if self.total_passed == self.total_checks:
            return "CERTIFIED"
        return "UNKNOWN"


@dataclass
class ModuleReport:
    """Quality report for a module (collection of lessons + coherence)."""
    grade: str
    module: int
    module_name: str = ""
    lessons: List[LessonReport] = field(default_factory=list)
    coherence_pass: Optional[PassResult] = None

    @property
    def certified_count(self) -> int:
        return sum(1 for l in self.lessons if l.verdict == "CERTIFIED")

    @property
    def summary(self) -> str:
        total = len(self.lessons)
        certified = self.certified_count
        return f"{certified}/{total} lessons certified"
