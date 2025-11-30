import { describe, expect, it } from "vitest";
import {
  validateTaskSecurity,
  sanitizeTask,
  createExecutionContext,
  BROWSER_RESTRICTIONS,
} from "./agent";

describe("Agent Security System", () => {
  describe("validateTaskSecurity", () => {
    it("should block tasks containing visa/credit card information", () => {
      const result = validateTaskSecurity("Add my visa card to the account");
      expect(result.safe).toBe(false);
      expect(result.reason).toContain("restricted content");
    });

    it("should block tasks containing banking information", () => {
      const result = validateTaskSecurity("Transfer money from my bank account");
      expect(result.safe).toBe(false);
      expect(result.reason).toContain("restricted content");
    });

    it("should block tasks containing SSN", () => {
      const result = validateTaskSecurity("My SSN is 123-45-6789");
      expect(result.safe).toBe(false);
      expect(result.reason).toContain("restricted content");
    });

    it("should block tasks containing password information", () => {
      const result = validateTaskSecurity("Change my password to newpass123");
      expect(result.safe).toBe(false);
      expect(result.reason).toContain("restricted content");
    });

    it("should block tasks containing personal data", () => {
      const result = validateTaskSecurity("My phone number is 555-1234");
      expect(result.safe).toBe(false);
      expect(result.reason).toContain("restricted content");
    });

    it("should block access to blocked domains", () => {
      const result = validateTaskSecurity("Go to paypal.com and login");
      expect(result.safe).toBe(false);
      expect(result.reason).toContain("restricted");
    });

    it("should allow safe tasks", () => {
      const result = validateTaskSecurity("Search for weather information");
      expect(result.safe).toBe(true);
    });

    it("should allow navigation to public websites", () => {
      const result = validateTaskSecurity("Visit google.com and search for news");
      expect(result.safe).toBe(true);
    });
  });

  describe("sanitizeTask", () => {
    it("should redact SSN patterns", () => {
      const task = "My SSN is 123-45-6789";
      const sanitized = sanitizeTask(task);
      expect(sanitized).toContain("***-**-****");
      expect(sanitized).not.toContain("123-45-6789");
    });

    it("should redact credit card patterns", () => {
      const task = "My card is 1234-5678-9012-3456";
      const sanitized = sanitizeTask(task);
      expect(sanitized).toContain("****-****-****-****");
      expect(sanitized).not.toContain("1234-5678-9012-3456");
    });

    it("should redact email addresses", () => {
      const task = "Email me at test@example.com";
      const sanitized = sanitizeTask(task);
      expect(sanitized).toContain("[email]");
      expect(sanitized).not.toContain("test@example.com");
    });

    it("should redact phone numbers", () => {
      const task = "Call me at 5551234567";
      const sanitized = sanitizeTask(task);
      expect(sanitized).toContain("[phone]");
      expect(sanitized).not.toContain("5551234567");
    });

    it("should preserve safe content", () => {
      const task = "Search for information about climate change";
      const sanitized = sanitizeTask(task);
      expect(sanitized).toBe(task);
    });
  });

  describe("createExecutionContext", () => {
    it("should create a valid execution context", () => {
      const context = createExecutionContext("task-123", "Search for news", "user-456");

      expect(context.taskId).toBe("task-123");
      expect(context.task).toBe("Search for news");
      expect(context.userId).toBe("user-456");
      expect(context.sandbox).toBe(true);
      expect(context.maxDuration).toBe(30000);
      expect(context.maxRetries).toBe(3);
    });

    it("should include browser restrictions in context", () => {
      const context = createExecutionContext("task-123", "Search for news", "user-456");

      expect(context.restrictions).toBeDefined();
      expect(context.restrictions.restrictedAPIs).toContain("localStorage");
      expect(context.restrictions.restrictedAPIs).toContain("cookies");
      expect(context.restrictions.allowedActions).toContain("navigate");
      expect(context.restrictions.allowedActions).toContain("read_content");
    });

    it("should set sandbox flag to true", () => {
      const context = createExecutionContext("task-123", "Test task", "user-456");
      expect(context.sandbox).toBe(true);
    });
  });

  describe("BROWSER_RESTRICTIONS", () => {
    it("should have restricted APIs defined", () => {
      expect(BROWSER_RESTRICTIONS.restrictedAPIs).toContain("localStorage");
      expect(BROWSER_RESTRICTIONS.restrictedAPIs).toContain("sessionStorage");
      expect(BROWSER_RESTRICTIONS.restrictedAPIs).toContain("cookies");
      expect(BROWSER_RESTRICTIONS.restrictedAPIs).toContain("geolocation");
    });

    it("should have restricted actions defined", () => {
      expect(BROWSER_RESTRICTIONS.restrictedActions).toContain("delete_data");
      expect(BROWSER_RESTRICTIONS.restrictedActions).toContain("modify_settings");
      expect(BROWSER_RESTRICTIONS.restrictedActions).toContain("install_extension");
    });

    it("should have allowed actions defined", () => {
      expect(BROWSER_RESTRICTIONS.allowedActions).toContain("navigate");
      expect(BROWSER_RESTRICTIONS.allowedActions).toContain("search");
      expect(BROWSER_RESTRICTIONS.allowedActions).toContain("read_content");
      expect(BROWSER_RESTRICTIONS.allowedActions).toContain("take_screenshot");
    });

    it("should have restricted URLs defined", () => {
      expect(BROWSER_RESTRICTIONS.restrictedURLs).toContain("paypal.com");
      expect(BROWSER_RESTRICTIONS.restrictedURLs).toContain("stripe.com");
    });
  });
});
