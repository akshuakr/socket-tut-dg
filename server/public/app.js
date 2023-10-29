const socket = io("ws://localhost:3500");

const msgInput = document.querySelector("#message");
const nameInput = document.querySelector("#name");
const chatRoom = document.querySelector("#room");

const activity = document.querySelector(".activity");
const userList = document.querySelector(".user-list");
const roomList = document.querySelector(".room-list");
const chatDisplay = document.querySelector(".chat-display");

msgInput.focus();

const sendMessage = (e) => {
    e.preventDefault();
    if (nameInput.value && msgInput.value && chatRoom.value) {
        socket.emit("message", {
            name: nameInput.value,
            text: msgInput.value,
        });
        msgInput.value = "";
    }
    msgInput.focus();
};

const enterRoom = (e) => {
    e.preventDefault();
    if (nameInput.value && chatRoom.value) {
        socket.emit("enterRoom", {
            name: nameInput.value,
            room: chatRoom.value,
        });
    }
};

document.querySelector("form-msg").addEventListener("submit", sendMessage);
document.querySelector("form-join").addEventListener("submit", enterRoom);

msgInput.addEventListener("keypress", () => {
    socket.emit("activity", nameInput.value);
});

socket.on("message", (data) => {
    activity.textContent = ``;

    const { name, text, time } = data;

    const li = document.createElement("li");
    li.className = "post";
    if (name === nameInput.value) {
        li.className = "post post--left";
    }
    if (name !== nameInput.value && name !== "Admin") {
        li.className = "post post--right";
    }
    if (name !== "Admin") {
        li.innerHTML = `<div class="post__header ${
            name === nameInput.value ? "post__header--user" : "post__header--reply"
        }">
        <span class="post__header--name">${name}</span>
        <span class="post__header--time">${time}</span>
        </div>
        <div class = "post__text">${text}</div>`;
    }
    document.querySelector("ul").appendChild(li);
});

let activityTimer;

socket.on("activity", (name) => {
    activity.textContent = `${name} is typing...`;

    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
        activity.textContent = "";
    }, 1500);
});
