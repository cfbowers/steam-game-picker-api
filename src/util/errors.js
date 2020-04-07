const error = (status, message) => ({ error: { status, message } }); 

const badRequest   = (message = 'wrong/bad data provided')            => error(400, message);
const unauthorized = (message = 'you shall not pass!')                => error(401, message);
const notFound     = (message = 'unable to find requested resource')  => error(404, message);
const generalError = (message = 'bad coding is most likely to blame') => error(500, message);


module.exports = { badRequest, unauthorized, notFound, generalError };