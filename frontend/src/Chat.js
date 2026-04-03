import React, { useEffect, useState } from "react";

function Chat({ socket, username, room }) {

const [currentMessage, setCurrentMessage] = useState("");
const [messageList, setMessageList] = useState([]);

const sendMessage = async () => {

if (currentMessage !== "") {

const messageData = {
room: room,
author: username,
message: currentMessage,
time:
new Date(Date.now()).getHours() +
":" +
new Date(Date.now()).getMinutes(),
};

await socket.emit("send_message", messageData);

setMessageList((list) => [...list, messageData]);

setCurrentMessage("");
}
};

// Receive Messages
useEffect(() => {

socket.on("receive_message", (data) => {
setMessageList((list) => [...list, data]);
});

socket.on("previous_messages", (messages) => {
setMessageList(messages);
});

}, [socket]);

return (
<div className="chat-window">

<div className="chat-header">
<p>Live Chat</p>
</div>

<div className="chat-body">

{messageList.map((messageContent, index) => {
return (
<div key={index}>

<p>
<strong>{messageContent.author}</strong> :{" "}
{messageContent.message}
</p>

<p style={{fontSize:"10px"}}>
{messageContent.time}
</p>

</div>
);
})}

</div>

<div className="chat-footer">

<input
type="text"
value={currentMessage}
placeholder="Type message..."
onChange={(event) => {
setCurrentMessage(event.target.value);
}}
onKeyPress={(event) => {
event.key === "Enter" && sendMessage();
}}
/>

<button onClick={sendMessage}>
Send
</button>

</div>

</div>
);
}

export default Chat;