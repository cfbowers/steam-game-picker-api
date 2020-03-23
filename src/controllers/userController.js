const success = require('../util/helpers/jSendData').success;
const User = require('../data/models/user');


exports.create = (req, res, next) => {
  createUser(req.body)
    .then((result) => res.send(success(result)))
    .catch((err) => next(err));
};


async function createUser(params) {
  const user = new User(params);
  const token = await user.generateAuthToken();
  await user.save();
  return { user, token };
}
