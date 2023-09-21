'use strict'

const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShope = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
}

class AccessService {

  static handlerRefreshToken = async ({keyStore, user, refreshToken}) => {
    const { userId, email } = user;
    if (!!keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError('Something went wrong! Pls relogin');
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError('Shop not registered!');
    }

    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new AuthFailureError('Shop not registered!');
    }

    const tokens = await createTokenPair({userId, email}, keyStore.publicKey, keyStore.privateKey);

    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken
      }
    });

    return {
      user,
      tokens
    }
  }

  static logout = async(keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  }

  /*
    1 - Check email in dbs
    2 - Check matching password
    3 - create AT + RT and save
    4 - get data return login
   */
  static login = async({email, password, refreshToken = null}) => {
    const foundShop = await findByEmail({email});
    if (!foundShop) {
      throw new BadRequestError('Shop not registered.');
    }

    const match = bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError('Authentication error');
    }

    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    const { _id: userId } = foundShop;
    const tokens = await createTokenPair({userId: foundShop._id, email }, publicKey, privateKey);

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey, publicKey, userId
    });

    return {
      shop: getInfoData({fields: ['_id', 'name', 'email'], object: foundShop}),
      tokens
    }
  }

  static signUp = async ({ name, email, password }) => {
    // step1: check email exists?
    const holderShop = await shopModel.findOne({email}).lean();

    if (!!holderShop) {
      throw new BadRequestError('Email was registered!');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name, email, password: passwordHash, roles: [RoleShope.SHOP]
    });
    if (!newShop) {
      return null;
    }

    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');
    const keyStore = await KeyTokenService.createKeyToken({
      userId: newShop._id,
      publicKey,
      privateKey
    });
    if (!keyStore) {
      throw new BadRequestError('Email was registered!');
    }

    // create token pair
    const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
    
    return {
      shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
      tokens
    }
  }
}

module.exports = AccessService;