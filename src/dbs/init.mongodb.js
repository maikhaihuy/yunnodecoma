'use strict';

const mongoose = require('mongoose');
const {db: {host, name, port}} = require('../configs/config.mogodb');
// const connectString = `mongodb://${host}:${port}/${name}`;
const connectString = `mongodb://localhost:27017/shopDEV`;
const { countConnect } = require('../helpers/check.connect')

console.log(`connectionString:`, connectString);

class Database {
  constructor() {
    this.connect();
  }

  connect(type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', {color: true});
    }

    mongoose.connect(connectString).then(_ => console.log('Connected Mongodb Success PRO', countConnect()))
    .catch(err => console.log(`Error Connect PRO!`, err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;