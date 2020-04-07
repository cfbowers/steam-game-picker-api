const { createUser, updateUser } = require('../services/userServices');


const read    = async (req) => req.user; 
const destroy = async (req) => req.user.remove(); 
const create  = (req) => createUser(req.body); 
const update  = (req) => updateUser(req.user, req.body); 


module.exports = { create, read, update, destroy }; 