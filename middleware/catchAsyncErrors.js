//exclusively for async error---basically hume baar baar try catch fior async await nahi likhna padega


module.exports = (theFunc) => (req, res, next) => {
  Promise.resolve(theFunc(req, res, next)).catch(next);
};
