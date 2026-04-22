function sendResponseFormat(response, statusCode, message, data = null, error = null, filter = null, pagination = null) {
  let result = {
    success: statusCode < 400,
    message,
    data,
  };

  if (filter !== null) {
    result['filter'] = filter;
  }

  if (pagination !== null) {
    result['pagination'] = pagination;
  }

  if (error !== null) {
    result['error'] = error;
  }

  response.status(statusCode).json(result);
}

export { sendResponseFormat };
