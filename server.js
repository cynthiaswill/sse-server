import express from "express";
import cors from "cors";
import SseChannel from "sse-channel";
import os from "os";

const app = express();
app.use(cors());

const PORT = 8000;

// Set up a new channel. Most of these options have sane defaults,
// feel free to look at lib/sse-channel.js for all available options
var sysInfoChannel = new SseChannel({
  retryTimeout: 250,
  historySize: 300,
  pingInterval: 15000,
  cors: { origins: ["*"] },
  jsonEncode: true,
});

app.get("/", (req, res) => {
  console.log("client connected");
  res.setHeader("Content-Type", "application/json");
  sysInfoChannel.addClient(req, res);

  res.on("close", () => {
    console.log("Client closed connection");
    res.end();
  });
});

// Set up an interval that broadcasts system info every 250ms
var sysInfoCounter = 0;
setInterval(function broadcastSysInfo() {
  sysInfoChannel.send({
    id: sysInfoCounter++,
    data: {
      freemem: os.freemem(),
      loadavg: os.loadavg(),
    },
  });
}, 2000);

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
