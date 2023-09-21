'use strict'

const keytokenModel = require("../models/keytoken.model");
const { Types } = require('mongoose');

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken}) => {
    try {
      // level 0
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey
      // });

      // return tokens ? tokens.publicKey : null; 

      // level > 0
      const filter = { user: userId };
      const update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken };
      const options = { upsert: true, new: true };

      const tokens = await keytokenModel.findOneAndUpdate(filter, update, options);

      return tokens ? tokens.publicKey : null;
    } catch(error) {
      console.log(error);
      return error;
    }
  }

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({user: new Types.ObjectId(userId)});
  }

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne({_id:  new Types.ObjectId(id)});
  }

  static findByrefreshTokensUsed = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
  }

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken });
  }

  static deleteKeyById = async (userId) => {
    return await keytokenModel.deleteOne({user: new Types.ObjectId(userId)});
  }
}

module.exports = KeyTokenService;