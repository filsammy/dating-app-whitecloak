module.exports = (message, status = 500, code = "SERVER_ERROR", details = null) => {
  const err = new Error(message);
  err.status = status;
  err.code = code;
  err.details = details;
  return err;
};
