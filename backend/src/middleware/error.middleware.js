const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status =
    err.name === "MulterError"
      ? err.code === "LIMIT_FILE_SIZE"
        ? 413
        : 400
      : err.statusCode || err.status || 500;
  res.status(status).json({
    message: err.message || "Something went wrong",
  });
};

module.exports = errorHandler;
