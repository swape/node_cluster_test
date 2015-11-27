var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;

// enable or disable the clustering
var blnEnable = true;
// enable or disable the loging
var blnLog = true;

/*

Clustering

*/
if(blnEnable){
  if (cluster.isMaster) {
    log('Starting  ' + numCPUs + ' servers');

      // make clusters
      for (var i = 0; i < numCPUs; i++) {
          cluster.fork();
      }

      // log the message on new prosess
      cluster.on('online', function(worker) {
        log('Worker ' + worker.process.pid + ' is online');
      });

      // start a new fork if it dies
      cluster.on('exit', function(worker, code, signal) {
        log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        log('Starting a new worker');
        cluster.fork();
      });

  } else {
      startserver();
  }
}else{
  startserver();
}

/*

The server part

*/
function startserver(){
  http.createServer(function(req, res) {
      res.writeHead(200);
      res.end('process ' + process.pid + ' says hello!');
  }).listen(8000);
}

// loging
function log(message){
  if(blnLog){
    console.log(message);
  }
}
