'use strict';

const JWT = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');
const { Header } = require('../constants');

const createTokenPair = async(payload, publicKey, privateKey) => {
  try {
    // access token
    const accessToken = await  JWT.sign(payload, publicKey, {
      expiresIn: '2 days'
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days'
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (!!err) {
        console.error(`error verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    })

    return { accessToken, refreshToken };
  } catch(error) {
    console.error(error);
  }
}

/*
  1 - Check userId from header request
  2 - Verify refresh token if had
  3 - Verify access token
  */
const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[Header.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError('Invalid request');
  }
  const keyStore = await findByUserId(userId);
  if(!keyStore) {
    throw new NotFoundError('Not found keyStore');
  }

console.log(`keyStore::`, keyStore);

  const refreshToken = req.headers[Header.REFRESH_TOKEN];
  if (!!refreshToken) {
    try {
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId) {
        throw new AuthFailureError('Invalid userId');
      }

      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;

      return next();
    } catch(error) {
      throw error;
    }
  }

  const accessToken = req.headers[Header.AUTHORIZATION];
  if (!!accessToken) {
    try {
      const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
      if (userId !== decodeUser.userId) {
        throw new AuthFailureError('Invalid userId');
      }
      req.keyStore = keyStore;
  
      return next();
    } catch(error) {
      throw error;
    }
  }

  throw new AuthFailureError('Invalid request');
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
}

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT
}