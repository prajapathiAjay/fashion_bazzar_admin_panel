// Form rules for the admin panel. Same patterns the backend checks (settings.controller.js,
// user.controller.js), so the admin sees the problem before saving. The backend still checks everything.

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// digits, spaces, +, - and brackets, starting with + or a digit
export const PHONE_PATTERN = /^[+\d][\d\s()-]*$/;

// Each returns a message, or "" when the value is fine
export const checkEmail = (value, { optional = false } = {}) => {
  const v = String(value ?? "").trim();
  if (!v) return optional ? "" : "Enter an email";
  return EMAIL_PATTERN.test(v) ? "" : "Enter a valid email, like name@example.com";
};

export const checkPhone = (value, { optional = false } = {}) => {
  const v = String(value ?? "").trim();
  if (!v) return optional ? "" : "Enter a phone number";
  if (!PHONE_PATTERN.test(v)) return "Phone can only have digits, spaces, +, - and brackets";
  return v.replace(/\D/g, "").length < 10 ? "Phone number needs at least 10 digits" : "";
};
