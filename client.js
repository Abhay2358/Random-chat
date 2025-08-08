const socket = io();
let currentRoom = null;

const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const nextBtn = document.getElementById("nextBtn");
const messagesDiv = document.getElementById("messages");

sendBtn.onclick = () => {
    const message = messageInput.value;
    if (message && currentRoom) {
        socket.emit("message", { room: currentRoom, message });
        addMessage(`You: ${message}`);
        messageInput.value = "";
    }
};

nextBtn.onclick = () => {
    location.reload(); // Reconnect and start new chat
};

socket.on("chat-start", ({ room }) => {
    currentRoom = room;
    addMessage("Connected to a stranger!");
});

socket.on("message", ({ message }) => {
    addMessage(`Stranger: ${message}`);
});

function addMessage(msg) {
    const div = document.createElement("div");
    div.textContent = msg;
    messagesDiv.appendChild(div);
}
