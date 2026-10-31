const logger = (req, res, next) => {
  const method = req.method;
  const url = req.originalUrl;
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const statusCode = res.statusCode;
    console.log(`[${timestamp}] ${method} ${url} - ${statusCode}`);
  });

  next();
};

export default logger;
