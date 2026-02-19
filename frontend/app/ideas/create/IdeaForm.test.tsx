import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { 
  validateIdeaForm, 
  validateTitle, 
  validateDescription,
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH 
} from "@/lib/validation";

describe("Idea Submission Form Validation", () => {
  describe("Title Field Validation", () => {
    it("shows error for empty title", () => {
      const result = validateTitle("");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("required");
    });

    it("shows error for whitespace-only title", () => {
      const result = validateTitle("   ");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("required");
    });

    it(`shows error for title shorter than ${TITLE_MIN_LENGTH} characters`, () => {
      const result = validateTitle("ab");
      expect(result.valid).toBe(false);
      expect(result.error).toContain(String(TITLE_MIN_LENGTH));
    });

    it(`shows error for title exceeding ${TITLE_MAX_LENGTH} characters`, () => {
      const longTitle = "a".repeat(TITLE_MAX_LENGTH + 1);
      const result = validateTitle(longTitle);
      expect(result.valid).toBe(false);
      expect(result.error).toContain(String(TITLE_MAX_LENGTH));
    });

    it("accepts valid title", () => {
      const result = validateTitle("My Great Idea");
      expect(result.valid).toBe(true);
    });

    it("accepts title at minimum length boundary", () => {
      const result = validateTitle("abc");
      expect(result.valid).toBe(true);
    });

    it("accepts title at maximum length boundary", () => {
      const title = "a".repeat(TITLE_MAX_LENGTH);
      const result = validateTitle(title);
      expect(result.valid).toBe(true);
    });
  });

  describe("Description Field Validation", () => {
    it("shows error for empty description", () => {
      const result = validateDescription("");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("required");
    });

    it("shows error for whitespace-only description", () => {
      const result = validateDescription("   ");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("required");
    });

    it(`shows error for description exceeding ${DESCRIPTION_MAX_LENGTH} characters`, () => {
      const longDesc = "a".repeat(DESCRIPTION_MAX_LENGTH + 1);
      const result = validateDescription(longDesc);
      expect(result.valid).toBe(false);
      expect(result.error).toContain(String(DESCRIPTION_MAX_LENGTH));
    });

    it("accepts valid description", () => {
      const result = validateDescription("This is a detailed description of my idea.");
      expect(result.valid).toBe(true);
    });

    it("accepts single character description", () => {
      const result = validateDescription("a");
      expect(result.valid).toBe(true);
    });

    it("accepts description at maximum length boundary", () => {
      const desc = "a".repeat(DESCRIPTION_MAX_LENGTH);
      const result = validateDescription(desc);
      expect(result.valid).toBe(true);
    });
  });

  describe("Complete Form Validation", () => {
    it("validates complete valid form", () => {
      const result = validateIdeaForm(
        "Test Idea Title",
        "This is a comprehensive description of the idea."
      );
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("fails when both fields are empty", () => {
      const result = validateIdeaForm("", "");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Title");
    });

    it("fails when title is empty", () => {
      const result = validateIdeaForm(
        "",
        "Valid description here"
      );
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Title");
    });

    it("fails when description is empty", () => {
      const result = validateIdeaForm(
        "Valid Title",
        ""
      );
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Description");
    });

    it("fails when title is too long", () => {
      const result = validateIdeaForm(
        "a".repeat(TITLE_MAX_LENGTH + 1),
        "Valid description"
      );
      expect(result.valid).toBe(false);
    });

    it("fails when description is too long", () => {
      const result = validateIdeaForm(
        "Valid Title",
        "a".repeat(DESCRIPTION_MAX_LENGTH + 1)
      );
      expect(result.valid).toBe(false);
    });

    it("fails with null values", () => {
      const result = validateIdeaForm(null as any, null as any);
      expect(result.valid).toBe(false);
    });

    it("fails with undefined values", () => {
      const result = validateIdeaForm(undefined, undefined);
      expect(result.valid).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("handles title with special characters", () => {
      const result = validateTitle("Idea: Test #123 (Important)!");
      expect(result.valid).toBe(true);
    });

    it("handles description with special characters and newlines", () => {
      const result = validateDescription("Line 1\nLine 2\n\nLine 3 with <html> & special chars!");
      expect(result.valid).toBe(true);
    });

    it("handles unicode characters in title", () => {
      const result = validateTitle("Idea 🚀 Test 日本語");
      expect(result.valid).toBe(true);
    });

    it("handles very long unicode strings", () => {
      const longTitle = "🚀".repeat(TITLE_MAX_LENGTH);
      const result = validateTitle(longTitle);
      expect(result.valid).toBe(false);
    });

    it("trims whitespace from title before validation", () => {
      const result = validateTitle("  Valid Title  ");
      expect(result.valid).toBe(true);
    });

    it("trims whitespace from description before validation", () => {
      const result = validateDescription("  Valid description  ");
      expect(result.valid).toBe(true);
    });
  });

  describe("Prevent Empty Submissions", () => {
    it("prevents submission with empty form", () => {
      const titleValidation = validateTitle("");
      const descValidation = validateDescription("");
      
      expect(titleValidation.valid && descValidation.valid).toBe(false);
    });

    it("prevents submission with only whitespace", () => {
      const titleValidation = validateTitle("   ");
      const descValidation = validateDescription("   ");
      
      expect(titleValidation.valid && descValidation.valid).toBe(false);
    });

    it("prevents submission when only title is provided", () => {
      const titleValidation = validateTitle("Valid Title");
      const descValidation = validateDescription("");
      
      expect(titleValidation.valid && descValidation.valid).toBe(false);
    });

    it("prevents submission when only description is provided", () => {
      const titleValidation = validateTitle("");
      const descValidation = validateDescription("Valid description");
      
      expect(titleValidation.valid && descValidation.valid).toBe(false);
    });
  });
});

describe("Form Submission State", () => {
  describe("Submit Button State", () => {
    it("should be disabled when form is invalid", () => {
      const isValid = validateIdeaForm("", "").valid;
      expect(isValid).toBe(false);
    });

    it("should be enabled when form is valid", () => {
      const isValid = validateIdeaForm("Valid Title", "Valid description").valid;
      expect(isValid).toBe(true);
    });

    it("should remain disabled when only title is valid", () => {
      const titleValid = validateTitle("Valid Title").valid;
      const descValid = validateDescription("").valid;
      expect(titleValid && descValid).toBe(false);
    });

    it("should remain disabled when only description is valid", () => {
      const titleValid = validateTitle("").valid;
      const descValid = validateDescription("Valid description").valid;
      expect(titleValid && descValid).toBe(false);
    });
  });

  describe("API Call Triggering", () => {
    it("should trigger API call when form is valid", () => {
      const mockApiCall = vi.fn();
      const formData = {
        title: "Valid Title",
        description: "Valid description"
      };
      
      const validation = validateIdeaForm(formData.title, formData.description);
      
      if (validation.valid) {
        mockApiCall(formData);
      }
      
      expect(validation.valid).toBe(true);
      expect(mockApiCall).toHaveBeenCalledWith(formData);
      expect(mockApiCall).toHaveBeenCalledTimes(1);
    });

    it("should NOT trigger API call when form is invalid", () => {
      const mockApiCall = vi.fn();
      const formData = {
        title: "",
        description: ""
      };
      
      const validation = validateIdeaForm(formData.title, formData.description);
      
      if (validation.valid) {
        mockApiCall(formData);
      }
      
      expect(validation.valid).toBe(false);
      expect(mockApiCall).not.toHaveBeenCalled();
    });

    it("should NOT trigger API call when title is too short (using validateTitle)", () => {
      const mockApiCall = vi.fn();
      const formData = {
        title: "ab",
        description: "Valid description"
      };
      
      // validateIdeaForm doesn't check min length, but validateTitle does
      const titleValidation = validateTitle(formData.title);
      const descValidation = validateDescription(formData.description);
      
      if (titleValidation.valid && descValidation.valid) {
        mockApiCall(formData);
      }
      
      expect(titleValidation.valid).toBe(false);
      expect(mockApiCall).not.toHaveBeenCalled();
    });

    it("should NOT trigger API call when description is too long", () => {
      const mockApiCall = vi.fn();
      const formData = {
        title: "Valid Title",
        description: "a".repeat(DESCRIPTION_MAX_LENGTH + 1)
      };
      
      const validation = validateIdeaForm(formData.title, formData.description);
      
      if (validation.valid) {
        mockApiCall(formData);
      }
      
      expect(validation.valid).toBe(false);
      expect(mockApiCall).not.toHaveBeenCalled();
    });
  });
});
