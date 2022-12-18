function statusValidation(req) {
  const { status } = req.body;
  if (ONLINE_STATUSES.indexOf(status) === -1) {
    return { success: false, error: ERRORS.INVALID_PAYLOAD };
  }
  return { success: true };
}

module.exports = {
  statusValidation,
};
