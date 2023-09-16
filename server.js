const app = require("./src/app");

const PORT = 3132;

const server = app.listen(PORT, () => {
  console.log(`WSV learning nodejs start with port ${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => console.log('Exit Server Express'))
})