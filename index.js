const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

// enable or disable the clustering
const blnEnable = true;
// enable or disable the loging
const blnLog = true;

/*
The server part
*/
function startServer() {
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end(`process ${process.pid} says hello!`);
    })
    .listen(8000);
}

// logging
function log(message) {
  if (blnLog) {
    console.log(message);
  }
}

/*
Clustering
*/
if (blnEnable) {
  if (cluster.isMaster) {
    log(`Starting  ${numCPUs} servers`);

    // make clusters
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    // log the message on new prosess
    cluster.on('online', (worker) => {
      log(`Worker ${worker.process.pid} is online`);
    });

    // start a new fork if it dies
    cluster.on('exit', (worker, code, signal) => {
      log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
      log('Starting a new worker');
      cluster.fork();
    });
  } else {
    startServer();
  }
} else {
  startServer();
}
