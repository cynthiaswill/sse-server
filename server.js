import express from "express";
import cors from "cors";
import SseChannel from "sse-channel";
import { events_data } from "./events.js";
import os from "os";

const app = express();
app.use(cors());

const PORT = 8000;

var sysInfoChannel = new SseChannel({
  retryTimeout: 250,
  historySize: 300,
  pingInterval: 15000,
  cors: { origins: ["*"] },
  jsonEncode: true,
});

app.get("/", (req, res) => {
  console.log("** client connected ** \n");
  res.setHeader("Content-Type", "application/json");
  sysInfoChannel.addClient(req, res);

  res.on("close", () => {
    console.log(
      "-- Client dropped connection... Saving disconnection TimeStap to DB... \n"
    );
    // record disconnections to DB
    res.end();
  });
});

var sysInfoCounter = 0;

// setInterval(function () {
//   sysInfoChannel.send({
//     data: `Time passed since first connection: ${sysInfoCounter++} s ...`,
//   });
// }, 1000);

function broadcastSysInfo() {
  sysInfoChannel.send(
    { data: events_data[Math.floor(Math.random() * events_data.length)] }

    // {
    //   id: sysInfoCounter++,
    //   data: {
    //     freemem: os.freemem(),
    //     loadavg: os.loadavg(),
    //   },
    // }
  );
  setTimeout(broadcastSysInfo, Math.random() * 5000);
}

broadcastSysInfo();

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
