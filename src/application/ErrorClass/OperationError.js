class OperationError extends Error {
  constructor(message) {
    super(message);
    this.name = "OperationError";
  }
}

module.exports = OperationError;
