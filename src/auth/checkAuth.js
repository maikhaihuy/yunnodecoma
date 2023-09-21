'use strict'

const { Header } = require('../constants');
const { ForbiddenError } = require('../core/error.response');
const { findById } = require('../services/apiKey.service');

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[Header.API_KEY]?.toString();

    if (!key) {
      throw new ForbiddenError();
    }

    // check object key
    const objKey = await findById(key);
    if(!objKey) {
      throw new ForbiddenError();
    }
    req.objKey = objKey;

    return next();
  } catch(error) {

  }
}

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      throw new ForbiddenError('Permission denied');
    }

    console.log(`permissions::`, req.objKey.permissions);
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      throw new ForbiddenError('Permission denied');
    }
    
    return next();
  }
}

module.exports = {
  apiKey,
  permission
}