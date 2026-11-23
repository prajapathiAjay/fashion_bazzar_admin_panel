// A JWT has 3 parts separated by dots: header.payload.signature.
// The payload is base64url-encoded JSON and includes `exp` (expiry time in seconds).
// We only READ it here to know when to log out; the backend still checks the signature.

export function getTokenExpiry(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(base64));
    return typeof exp === "number" ? exp * 1000 : null; // milliseconds
  } catch {
    return null; // not a readable JWT -> let the backend decide (it will answer 401)
  }
}

// true when the token has an expiry time and it has passed
export function isTokenExpired(token) {
  const expiry = getTokenExpiry(token);
  return expiry !== null && expiry <= Date.now();
}
