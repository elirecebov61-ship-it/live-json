const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PROTO_PATH = path.join(__dirname, 'protobuf/betting.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const bettingProto = grpc.loadPackageDefinition(packageDefinition).betting;

const bettingService = {
  GetOdds: (call, callback) => {
    const { team1, team2 } = call.request;
    const odds = calculateLiveOdds(team1, team2);
    callback(null, { odds, matchId: `\( {team1}- \){team2}` });
  }
};

function calculateLiveOdds(team1, team2) {
  const pythonProcess = require('child_process').spawn('python3', ['python/live_odds.py', team1, team2]);
  let data = '';
  pythonProcess.stdout.on('data', chunk => data += chunk);
  return new Promise(resolve => {
    pythonProcess.stdout.on('end', () => resolve(JSON.parse(data)));
  });
}

server.listen(process.env.PORT || 3000, () => console.log('✅ Railway service ready'));
io.on('connection', socket => console.log('🔥 Canlı maç izleyici bağlandı'));

// GRPC endpoint
const grpcServer = new grpc.Server();
grpcServer.addService(bettingProto.BettingService, bettingService);
grpcServer.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('✅ gRPC server started on 50051');
});
