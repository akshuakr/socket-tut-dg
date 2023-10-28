const ws = require("ws");

const server = new ws.Server({ port: "3000" });

server.on("connection", (socket) => {
    console.log("Socket Started");
    socket.on("message", (message) => {
        console.log(message);
        const result = message.toString("ascii");
        console.log(result);
        socket.send(`${message}`);
    });
});
