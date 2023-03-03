import SseChannel from "sse-channel";

export const newChannel = new SseChannel({ cors: { origins: ["*"] }, jsonEncode: true });
const counter = 0;

setInterval(() => {
  const date = new Date().toLocaleString();
  console.log(date);
  newChannel.send({
    id: counter++,
    data: {
      date,
    },
  });
}, 1000);
