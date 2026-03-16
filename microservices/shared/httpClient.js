async function callJson(url, options = {}) {
  const response = await fetch(url, options);

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof body === "string" ? body : body.error || "Request failed";
    const error = new Error(message);
    error.status = response.status;
    error.payload = body;
    throw error;
  }

  return body;
}

module.exports = { callJson };
