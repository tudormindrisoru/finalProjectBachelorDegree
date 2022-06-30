const { EventEmitter } = require("events");
const Stream = new EventEmitter();

class Sse {
  constructor() {}

  static async configureSse(res) {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-control": "no-cache",
      Connection: "keep-alive",
    });

    Stream.on("push", function (event, data) {
      res.write(
        "event: " +
          String(event) +
          "\n" +
          "data: " +
          JSON.stringify(data) +
          "\n\n"
      );
    });
  }

  static async emitEvent(message) {
    Stream.emit("push", "message", { msg: JSON.stringify(message) });
  }
}

module.exports = Sse;
