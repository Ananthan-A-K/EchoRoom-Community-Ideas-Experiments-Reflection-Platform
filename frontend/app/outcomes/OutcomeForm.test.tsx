import { describe, it, expect, vi } from "vitest";
import { 
  validateOutcomeForm,
  OUTCOME_NOTES_MAX_LENGTH 
} from "@/lib/validation";

describe("Outcome Recording Form Validation", () => {
  describe("Result Field Validation", () => {
    it("accepts 'Success' as valid result", () => {
      const result = validateOutcomeForm("Success", "");
      expect(result.valid).toBe(true);
    });

    it("accepts 'Mixed' as valid result", () => {
      const result = validateOutcomeForm("Mixed", "");
      expect(result.valid).toBe(true);
    });

    it("accepts 'Failed' as valid result", () => {
      const result = validateOutcomeForm("Failed", "");
      expect(result.valid).toBe(true);
    });

    it("shows error for empty result", () => {
      const result = validateOutcomeForm("", "");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Result");
      expect(result.error).toContain("required");
    });

    it("shows error for whitespace-only result", () => {
      const result = validateOutcomeForm("   ", "");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Result");
    });

    it("shows error for invalid result value", () => {
      const result = validateOutcomeForm("Invalid", "");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Success, Mixed, or Failed");
    });

    it("shows error for case-sensitive invalid values", () => {
      expect(validateOutcomeForm("success", "").valid).toBe(false);
      expect(validateOutcomeForm("SUCCESS", "").valid).toBe(false);
      expect(validateOutcomeForm("mixed", "").valid).toBe(false);
      expect(validateOutcomeForm("failed", "").valid).toBe(false);
    });

    it("rejects similar but invalid values", () => {
      expect(validateOutcomeForm("Pass", "").valid).toBe(false);
      expect(validateOutcomeForm("Win", "").valid).toBe(false);
      expect(validateOutcomeForm("Partial", "").valid).toBe(false);
      expect(validateOutcomeForm("Loss", "").valid).toBe(false);
      expect(validateOutcomeForm("Complete", "").valid).toBe(false);
      expect(validateOutcomeForm("Incomplete", "").valid).toBe(false);
    });
  });

  describe("Notes Field Validation", () => {
    it("accepts empty notes (optional field)", () => {
      const result = validateOutcomeForm("Success", "");
      expect(result.valid).toBe(true);
    });

    it("accepts null notes", () => {
      const result = validateOutcomeForm("Success", null as any);
      expect(result.valid).toBe(true);
    });

    it("accepts undefined notes", () => {
      const result = validateOutcomeForm("Success", undefined);
      expect(result.valid).toBe(true);
    });

    it("accepts valid notes", () => {
      const result = validateOutcomeForm("Success", "The experiment exceeded expectations!");
      expect(result.valid).toBe(true);
    });

    it(`accepts notes at exactly ${OUTCOME_NOTES_MAX_LENGTH} characters`, () => {
      const notes = "a".repeat(OUTCOME_NOTES_MAX_LENGTH);
      const result = validateOutcomeForm("Success", notes);
      expect(result.valid).toBe(true);
    });

    it(`shows error for notes exceeding ${OUTCOME_NOTES_MAX_LENGTH} characters`, () => {
      const longNotes = "a".repeat(OUTCOME_NOTES_MAX_LENGTH + 1);
      const result = validateOutcomeForm("Success", longNotes);
      expect(result.valid).toBe(false);
      expect(result.error).toContain(String(OUTCOME_NOTES_MAX_LENGTH));
    });

    it("accepts notes with special characters", () => {
      const notes = "Notes with special chars: @#$%^&*() and emoji 🚀";
      const result = validateOutcomeForm("Success", notes);
      expect(result.valid).toBe(true);
    });

    it("accepts notes with markdown formatting", () => {
      const notes = `
        ## Detailed Notes
        
        **Key metrics:**
        - Conversion rate: 15%
        - User satisfaction: 4.5/5
        
        _Observations:_
        Users loved the new feature!
      `;
      const result = validateOutcomeForm("Success", notes);
      expect(result.valid).toBe(true);
    });

    it("accepts notes with multiple paragraphs", () => {
      const notes = `
        First paragraph with initial observations.

        Second paragraph with detailed analysis.

        Third paragraph with conclusions.
      `;
      const result = validateOutcomeForm("Success", notes);
      expect(result.valid).toBe(true);
    });
  });

  describe("Complete Form Validation", () => {
    it("validates complete form with all fields", () => {
      const result = validateOutcomeForm(
        "Success",
        "Detailed notes about the successful outcome"
      );
      expect(result.valid).toBe(true);
    });

    it("validates form with only required fields", () => {
      const result = validateOutcomeForm("Mixed", "");
      expect(result.valid).toBe(true);
    });

    it("fails when result is missing", () => {
      const result = validateOutcomeForm("", "Valid notes");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Result");
    });

    it("validates despite very long notes (within limit)", () => {
      const notes = "Detailed note. ".repeat(50); // Well within limit
      const result = validateOutcomeForm("Failed", notes);
      expect(result.valid).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("handles notes with only whitespace", () => {
      const result = validateOutcomeForm("Success", "     ");
      expect(result.valid).toBe(true); // Whitespace-only is still valid for optional field
    });

    it("handles notes with only newlines", () => {
      const result = validateOutcomeForm("Success", "\n\n\n");
      expect(result.valid).toBe(true);
    });

    it("handles notes with unicode characters", () => {
      const notes = "日本語 notes and العربية text with 🎉 emojis";
      const result = validateOutcomeForm("Success", notes);
      expect(result.valid).toBe(true);
    });

    it("handles notes with HTML-like content", () => {
      const notes = "<script>alert('xss')</script> but sanitized";
      const result = validateOutcomeForm("Success", notes);
      expect(result.valid).toBe(true);
    });

    it("handles notes with code snippets", () => {
      const notes = `
        Code results:
        \`\`\`javascript
        const conversionRate = 0.15;
        console.log('Success!');
        \`\`\`
      `;
      const result = validateOutcomeForm("Success", notes);
      expect(result.valid).toBe(true);
    });

    it("handles result with surrounding whitespace", () => {
      const result = validateOutcomeForm("  Success  ", "Notes");
      expect(result.valid).toBe(false); // Exact match required
    });

    it("rejects numeric result values", () => {
      expect(validateOutcomeForm(1 as any, "").valid).toBe(false);
      expect(validateOutcomeForm(0 as any, "").valid).toBe(false);
    });

    it("rejects boolean result values", () => {
      expect(validateOutcomeForm(true as any, "").valid).toBe(false);
      expect(validateOutcomeForm(false as any, "").valid).toBe(false);
    });
  });

  describe("Boundary Testing", () => {
    it(`accepts notes at limit - 1 (${OUTCOME_NOTES_MAX_LENGTH - 1} chars)`, () => {
      const notes = "x".repeat(OUTCOME_NOTES_MAX_LENGTH - 1);
      const result = validateOutcomeForm("Success", notes);
      expect(result.valid).toBe(true);
    });

    it(`accepts notes at limit (${OUTCOME_NOTES_MAX_LENGTH} chars)`, () => {
      const notes = "x".repeat(OUTCOME_NOTES_MAX_LENGTH);
      const result = validateOutcomeForm("Success", notes);
      expect(result.valid).toBe(true);
    });

    it(`rejects notes at limit + 1 (${OUTCOME_NOTES_MAX_LENGTH + 1} chars)`, () => {
      const notes = "x".repeat(OUTCOME_NOTES_MAX_LENGTH + 1);
      const result = validateOutcomeForm("Success", notes);
      expect(result.valid).toBe(false);
    });

    it("rejects result with one character different", () => {
      expect(validateOutcomeForm("Succes", "").valid).toBe(false);
      expect(validateOutcomeForm("Mixe", "").valid).toBe(false);
      expect(validateOutcomeForm("Fail", "").valid).toBe(false);
    });
  });

  describe("Prevent Empty Submissions", () => {
    it("prevents submission with empty result", () => {
      const isValid = validateOutcomeForm("", "").valid;
      expect(isValid).toBe(false);
    });

    it("prevents submission with null result", () => {
      const isValid = validateOutcomeForm(null as any, "").valid;
      expect(isValid).toBe(false);
    });

    it("prevents submission with undefined result", () => {
      const isValid = validateOutcomeForm(undefined, "").valid;
      expect(isValid).toBe(false);
    });

    it("prevents submission with whitespace-only result", () => {
      const isValid = validateOutcomeForm("   ", "").valid;
      expect(isValid).toBe(false);
    });

    it("allows submission with valid result and empty notes", () => {
      const isValid = validateOutcomeForm("Success", "").valid;
      expect(isValid).toBe(true);
    });

    it("allows submission with valid result and null notes", () => {
      const isValid = validateOutcomeForm("Mixed", null as any).valid;
      expect(isValid).toBe(true);
    });
  });

  describe("Form Submission State", () => {
    describe("Submit Button State", () => {
      it("should be disabled when result is empty", () => {
        const isValid = validateOutcomeForm("", "Valid notes").valid;
        expect(isValid).toBe(false);
      });

      it("should be disabled when result is invalid", () => {
        const isValid = validateOutcomeForm("InvalidResult", "Notes").valid;
        expect(isValid).toBe(false);
      });

      it("should be enabled when result is valid (Success)", () => {
        const isValid = validateOutcomeForm("Success", "").valid;
        expect(isValid).toBe(true);
      });

      it("should be enabled when result is valid (Mixed)", () => {
        const isValid = validateOutcomeForm("Mixed", "Some notes").valid;
        expect(isValid).toBe(true);
      });

      it("should be enabled when result is valid (Failed)", () => {
        const isValid = validateOutcomeForm("Failed", "").valid;
        expect(isValid).toBe(true);
      });

      it("should be disabled when notes exceed maximum length", () => {
        const longNotes = "x".repeat(OUTCOME_NOTES_MAX_LENGTH + 1);
        const isValid = validateOutcomeForm("Success", longNotes).valid;
        expect(isValid).toBe(false);
      });
    });

    describe("API Call Triggering", () => {
      const mockApiCall = vi.fn();

      beforeEach(() => {
        mockApiCall.mockClear();
      });

      it("should trigger API call when form is valid with Success", () => {
        const formData = { result: "Success", notes: "Great results!" };
        const isValid = validateOutcomeForm(formData.result, formData.notes).valid;

        if (isValid) {
          mockApiCall(formData);
        }

        expect(mockApiCall).toHaveBeenCalledWith(formData);
      });

      it("should trigger API call when form is valid with Mixed", () => {
        const formData = { result: "Mixed", notes: "Partial success" };
        const isValid = validateOutcomeForm(formData.result, formData.notes).valid;

        if (isValid) {
          mockApiCall(formData);
        }

        expect(mockApiCall).toHaveBeenCalledWith(formData);
      });

      it("should trigger API call when form is valid with Failed", () => {
        const formData = { result: "Failed", notes: "Did not work" };
        const isValid = validateOutcomeForm(formData.result, formData.notes).valid;

        if (isValid) {
          mockApiCall(formData);
        }

        expect(mockApiCall).toHaveBeenCalledWith(formData);
      });

      it("should NOT trigger API call when result is empty", () => {
        const formData = { result: "", notes: "Notes" };
        const isValid = validateOutcomeForm(formData.result, formData.notes).valid;

        if (isValid) {
          mockApiCall(formData);
        }

        expect(mockApiCall).not.toHaveBeenCalled();
      });

      it("should NOT trigger API call when result is invalid", () => {
        const formData = { result: "Unknown", notes: "Notes" };
        const isValid = validateOutcomeForm(formData.result, formData.notes).valid;

        if (isValid) {
          mockApiCall(formData);
        }

        expect(mockApiCall).not.toHaveBeenCalled();
      });

      it("should NOT trigger API call when notes are too long", () => {
        const formData = { 
          result: "Success", 
          notes: "x".repeat(OUTCOME_NOTES_MAX_LENGTH + 1) 
        };
        const isValid = validateOutcomeForm(formData.result, formData.notes).valid;

        if (isValid) {
          mockApiCall(formData);
        }

        expect(mockApiCall).not.toHaveBeenCalled();
      });
    });
  });

  describe("Real-world Scenarios", () => {
    it("accepts detailed success outcome", () => {
      const result = validateOutcomeForm(
        "Success",
        `Experiment exceeded all expectations!
        
        Metrics:
        - 25% increase in conversions
        - 40% reduction in bounce rate
        - User satisfaction score: 4.8/5
        
        Recommendation: Implement this change permanently.`
      );
      expect(result.valid).toBe(true);
    });

    it("accepts mixed outcome with learnings", () => {
      const result = validateOutcomeForm(
        "Mixed",
        `Partial success observed.
        
        Positive outcomes:
        - Desktop users responded well (+12%)
        
        Negative outcomes:
        - Mobile users showed no change
        
        Conclusion: Need to optimize for mobile separately.`
      );
      expect(result.valid).toBe(true);
    });

    it("accepts failed outcome with insights", () => {
      const result = validateOutcomeForm(
        "Failed",
        `The experiment did not achieve statistical significance.
        
        Possible reasons:
        1. Sample size was too small
        2. Test duration was insufficient
        3. The change was too subtle
        
        Next steps: Redesign experiment with more substantial changes.`
      );
      expect(result.valid).toBe(true);
    });

    it("accepts minimal valid outcome", () => {
      const result = validateOutcomeForm("Success", "");
      expect(result.valid).toBe(true);
    });

    it("rejects incomplete outcome form", () => {
      const result = validateOutcomeForm("", "Forgot to select result");
      expect(result.valid).toBe(false);
    });
  });
});
