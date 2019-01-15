import app from './app'

const port = process.env.PORT || 3000

const server = app.express.listen(port, (err: Error) => {
  if (err) {
    return console.log(err)
  }
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  gracefulShutdown();
});

process.on('SIGINT', () => {
  console.info('SIGINT signal received.');
  gracefulShutdown();
});

function gracefulShutdown() {
  console.log('Closing http and socket servers.');
  server.close(() => {
    console.log('Http server closed.');

    app.sockets.close(() => {
      console.log('Socket server closed');
      process.exit(0);
    })
  });
}
