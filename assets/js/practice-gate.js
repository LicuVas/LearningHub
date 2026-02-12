/**
 * Practice Gate - Hides practice section until test completion
 * =============================================================
 * Auto-hides .practice-section on pages with goToStep navigation.
 * Reveals it after the test is completed (result-pass appears).
 *
 * Usage: <script src="../../assets/js/practice-gate.js"></script>
 * Place AFTER the main lesson script block.
 */
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        // Only act on pages with step-based navigation
        var hasSteps = document.getElementById('goal') || document.getElementById('step-goal');
        if (!hasSteps) return;

        var practiceSection = document.querySelector('.practice-section');
        if (!practiceSection) return;

        // Hide practice section initially
        practiceSection.style.display = 'none';

        // Method 1: Monitor for test result via MutationObserver
        var testResult = document.getElementById('test-result');
        if (testResult) {
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' || mutation.type === 'attributes') {
                        // Check if test passed
                        var passBox = testResult.querySelector('.result-pass');
                        if (passBox || testResult.querySelector('.result-box')) {
                            practiceSection.style.display = 'block';
                            // Smooth reveal
                            practiceSection.style.opacity = '0';
                            practiceSection.style.transition = 'opacity 0.3s ease';
                            setTimeout(function() {
                                practiceSection.style.opacity = '1';
                            }, 50);
                        }
                    }
                });
            });

            observer.observe(testResult, {
                childList: true,
                subtree: true,
                attributes: true
            });
        }

        // Method 2: Hook into checkAllAnswers if it exists
        if (typeof window.checkAllAnswers === 'function') {
            var originalCheck = window.checkAllAnswers;
            window.checkAllAnswers = function() {
                originalCheck.apply(this, arguments);
                // Show practice after any test attempt
                setTimeout(function() {
                    if (testResult && testResult.style.display !== 'none') {
                        practiceSection.style.display = 'block';
                    }
                }, 100);
            };
        }

        // Method 3: If navigated to 'complete' step, always show practice
        if (typeof window.goToStep === 'function') {
            var originalGoToStep = window.goToStep;
            window.goToStep = function(step) {
                originalGoToStep.apply(this, arguments);
                if (step === 'complete') {
                    practiceSection.style.display = 'block';
                }
            };
        }
    });
})();
