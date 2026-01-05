class ErrorHander extends Error {    //Error class is present in JS By deafult
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);  //a method already present in Error Class
  }
}

module.exports = ErrorHander;
