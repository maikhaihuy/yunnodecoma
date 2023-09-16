'use strict';

const { mongoose } = require("mongoose");
const os = require('os');
const process = require('process');
const _SECOND = 5000;

// count connect
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Nunmber of connections::${numConnection}`);
}

// check overload
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // Example maximum number of connections based on number of cores
    const maxConections = numCores * 5;

    console.log(`Active connections:: ${numConnection}`);
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConections) {
      console.log(`Connection overload detected!`);
    }

  }, _SECOND); // monitor every 5 seconds
};

module.exports = {
  countConnect,
  checkOverload
}