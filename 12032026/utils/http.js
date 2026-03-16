function sendNotFound(res, entity) {
  return res.status(404).json({ error: `${entity} not found` });
}

function sendValidationError(res, message) {
  return res.status(400).json({ error: message });
}

module.exports = {
  sendNotFound,
  sendValidationError,
};