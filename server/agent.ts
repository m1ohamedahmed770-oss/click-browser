/**
 * Agent Security System
 * Manages safe browser control with security restrictions
 */

// Blocked patterns for security
const BLOCKED_PATTERNS = {
  // Financial/Payment related
  visa: /visa|credit\s*card|debit\s*card|payment\s*method|billing\s*address/i,
  banking: /bank\s*account|account\s*number|routing\s*number|swift\s*code/i,
  crypto: /wallet|private\s*key|seed\s*phrase|crypto|bitcoin|ethereum/i,

  // Personal data
  ssn: /ssn|social\s*security|tax\s*id|passport|driver.*license/i,
  personal: /phone\s*number|home\s*address|date\s*of\s*birth|mother.*maiden/i,

  // Authentication
  password: /password|pin|secret|token|api.*key|auth.*code/i,
  oauth: /oauth|login|signin|authentication|2fa|two.*factor/i,

  // Medical/Health
  health: /medical|health\s*record|prescription|diagnosis|patient\s*id/i,

  // Legal/Government
  legal: /court\s*record|arrest|criminal|lawsuit|legal\s*document/i,
};

// Blocked domains/URLs
const BLOCKED_DOMAINS = [
  "paypal.com",
  "stripe.com",
  "square.com",
  "amazon.com/account",
  "google.com/account",
  "facebook.com/settings",
  "twitter.com/settings",
  "linkedin.com/settings",
  "banking",
  "creditcard",
  "cryptocurrency",
];

// Allowed safe actions
const ALLOWED_ACTIONS = [
  "navigate",
  "search",
  "read_content",
  "click_element",
  "fill_form",
  "scroll",
  "take_screenshot",
  "extract_text",
];

/**
 * Security Check for Task
 * Validates if a task is safe to execute
 */
export function validateTaskSecurity(task: string): {
  safe: boolean;
  reason?: string;
} {
  // Check against blocked patterns
  for (const [category, pattern] of Object.entries(BLOCKED_PATTERNS)) {
    if (pattern.test(task)) {
      return {
        safe: false,
        reason: `Task contains restricted content: ${category}`,
      };
    }
  }

  // Check against blocked domains
  for (const domain of BLOCKED_DOMAINS) {
    if (task.toLowerCase().includes(domain)) {
      return {
        safe: false,
        reason: `Access to ${domain} is restricted for security`,
      };
    }
  }

  return { safe: true };
}

/**
 * Sanitize Task
 * Removes or redacts sensitive information from task description
 */
export function sanitizeTask(task: string): string {
  let sanitized = task;

  // Redact potential sensitive data
  sanitized = sanitized.replace(/\d{3}-\d{2}-\d{4}/g, "***-**-****"); // SSN
  sanitized = sanitized.replace(
    /\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/g,
    "****-****-****-****"
  ); // Credit card
  sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[email]"); // Email
  sanitized = sanitized.replace(/\b\d{10}\b/g, "[phone]"); // Phone number

  return sanitized;
}

/**
 * Browser Control Restrictions
 * Defines what the agent can and cannot do
 */
export const BROWSER_RESTRICTIONS = {
  // Cannot access these APIs
  restrictedAPIs: [
    "localStorage",
    "sessionStorage",
    "cookies",
    "geolocation",
    "camera",
    "microphone",
    "clipboard",
  ],

  // Cannot navigate to these
  restrictedURLs: BLOCKED_DOMAINS,

  // Cannot perform these actions
  restrictedActions: [
    "delete_data",
    "modify_settings",
    "install_extension",
    "access_file_system",
    "execute_script",
    "modify_dom_permanently",
  ],

  // Can only perform these actions
  allowedActions: ALLOWED_ACTIONS,
};

/**
 * Task Execution Context
 * Provides safe context for task execution
 */
export interface TaskExecutionContext {
  taskId: string;
  task: string;
  userId: string;
  timestamp: Date;
  sandbox: boolean;
  restrictions: typeof BROWSER_RESTRICTIONS;
  maxDuration: number; // milliseconds
  maxRetries: number;
}

/**
 * Create Safe Execution Context
 */
export function createExecutionContext(
  taskId: string,
  task: string,
  userId: string
): TaskExecutionContext {
  return {
    taskId,
    task,
    userId,
    timestamp: new Date(),
    sandbox: true,
    restrictions: BROWSER_RESTRICTIONS,
    maxDuration: 30000, // 30 seconds
    maxRetries: 3,
  };
}

/**
 * Log Security Event
 * For audit trail and monitoring
 */
export interface SecurityEvent {
  type: "blocked" | "allowed" | "warning" | "error";
  taskId: string;
  userId: string;
  action: string;
  reason?: string;
  timestamp: Date;
}

export function logSecurityEvent(event: SecurityEvent): void {
  const logEntry = {
    ...event,
    timestamp: event.timestamp.toISOString(),
  };

  console.log("[SECURITY]", JSON.stringify(logEntry));

  // In production, this would be sent to a logging service
  // await sendToLoggingService(logEntry);
}
