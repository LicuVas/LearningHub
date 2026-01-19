/**
 * LearningHub PoW Validator
 * =========================
 * Field validation rules for checkpoint forms.
 *
 * @version 1.0.0
 */

const PowValidator = {
    /**
     * Validate a field value against rules
     * @param {any} value - The field value
     * @param {Object} rules - Validation rules
     * @returns {Object} - { valid: boolean, errors: string[] }
     */
    validate(value, rules) {
        const errors = [];
        const strValue = String(value || '').trim();

        // Required check
        if (rules.required && !strValue) {
            errors.push('Acest câmp este obligatoriu');
            return { valid: false, errors };
        }

        // Skip other validations if empty and not required
        if (!strValue && !rules.required) {
            return { valid: true, errors: [] };
        }

        // Minimum characters
        if (rules.minChars && strValue.length < rules.minChars) {
            errors.push(`Minim ${rules.minChars} caractere (ai ${strValue.length})`);
        }

        // Minimum words
        if (rules.minWords) {
            const wordCount = strValue.split(/\s+/).filter(w => w.length > 0).length;
            if (wordCount < rules.minWords) {
                errors.push(`Minim ${rules.minWords} cuvinte (ai ${wordCount})`);
            }
        }

        // Must include any (at least one keyword)
        if (rules.mustIncludeAny && Array.isArray(rules.mustIncludeAny)) {
            const lowerValue = strValue.toLowerCase();
            const found = rules.mustIncludeAny.some(word =>
                lowerValue.includes(word.toLowerCase())
            );
            if (!found) {
                errors.push(`Trebuie să menționezi cel puțin unul din: ${rules.mustIncludeAny.join(', ')}`);
            }
        }

        // Must include all (all keywords required)
        if (rules.mustIncludeAll && Array.isArray(rules.mustIncludeAll)) {
            const lowerValue = strValue.toLowerCase();
            const missing = rules.mustIncludeAll.filter(word =>
                !lowerValue.includes(word.toLowerCase())
            );
            if (missing.length > 0) {
                errors.push(`Lipsesc cuvintele: ${missing.join(', ')}`);
            }
        }

        // Regex pattern
        if (rules.regex) {
            try {
                const pattern = new RegExp(rules.regex, 'i');
                if (!pattern.test(strValue)) {
                    errors.push(rules.regexMessage || 'Format invalid');
                }
            } catch (e) {
                console.warn('[PowValidator] Invalid regex:', rules.regex);
            }
        }

        // URL pattern (for Scratch links etc.)
        if (rules.urlPattern) {
            if (!this.isValidUrl(strValue, rules.urlPattern)) {
                errors.push(`Link invalid. Trebuie să fie de pe: ${rules.urlPattern}`);
            }
        }

        // Type-specific validations
        if (rules.type === 'url' && strValue) {
            if (!this.isValidUrl(strValue)) {
                errors.push('URL invalid');
            }
        }

        if (rules.type === 'email' && strValue) {
            if (!this.isValidEmail(strValue)) {
                errors.push('Email invalid');
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    },

    /**
     * Validate URL (optionally matching a domain pattern)
     */
    isValidUrl(value, domainPattern = null) {
        try {
            const url = new URL(value);
            if (domainPattern) {
                return url.hostname.includes(domainPattern);
            }
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Validate email
     */
    isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },

    /**
     * Validate all fields in a form
     * @param {Object} values - { fieldName: value }
     * @param {Array} fields - Field definitions with rules
     * @returns {Object} - { valid: boolean, fieldErrors: { fieldName: string[] } }
     */
    validateAll(values, fields) {
        const fieldErrors = {};
        let allValid = true;

        for (const field of fields) {
            const value = values[field.name];
            const rules = {
                required: field.required !== false,
                minChars: field.minChars,
                minWords: field.minWords,
                mustIncludeAny: field.mustIncludeAny,
                mustIncludeAll: field.mustIncludeAll,
                regex: field.regex,
                regexMessage: field.regexMessage,
                urlPattern: field.urlPattern,
                type: field.type
            };

            // Handle optional fields
            if (field.optional === true) {
                rules.required = false;
            }

            const result = this.validate(value, rules);
            if (!result.valid) {
                fieldErrors[field.name] = result.errors;
                allValid = false;
            }
        }

        return { valid: allValid, fieldErrors };
    },

    /**
     * Get default validation rules for common field types
     */
    getDefaultRules(type) {
        const defaults = {
            whatLearned: {
                minChars: 30,
                required: true
            },
            whatCreated: {
                minChars: 20,
                required: true
            },
            scratchUrl: {
                type: 'url',
                urlPattern: 'scratch.mit.edu',
                required: false
            },
            projectUrl: {
                type: 'url',
                required: true
            },
            explanation: {
                minChars: 20,
                required: true
            }
        };

        return defaults[type] || {};
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PowValidator;
}
