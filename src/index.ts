import app from './app'
import { Logger } from './helpers/Logger';

const port = process.env.PORT || 3000

const server = app.express.listen(port, (err: Error) => {
  if (err) {
    return console.log(err)
  }
})

// Graceful shutdown
process.on('SIGTERM', () => {
  Logger.info('SIGTERM signal received');
  gracefulShutdown();
});

process.on('SIGINT', () => {
  Logger.info('SIGINT signal received');
  gracefulShutdown();
});

function gracefulShutdown() {
  Logger.info('Closing http and socket servers.');
  server.close(() => {
    Logger.success('Http server closed.');

    app.sockets.close(() => {
      Logger.success('Socket server closed');
      process.exit(0);
    })
  });
}
