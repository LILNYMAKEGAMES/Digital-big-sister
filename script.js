const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");

function addMessage(message, sender) {
    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message");

    if (sender === "user") {
        messageDiv.classList.add("user-message");
    } else {
        messageDiv.classList.add("sister-message");
    }

    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const message = userInput.value.trim();

    if (message === "") {
        return;
    }

    addMessage(message, "user");
    userInput.value = "";

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        if (data.reply) {
            addMessage(data.reply, "sister");
        } else {
            addMessage(
                "I'm having a little trouble connecting right now. Try again in a moment. 💕",
                "sister"
            );
        }

    } catch (error) {
        console.error(error);

        addMessage(
            "Oops! I couldn't connect right now. Let's try again. 💕",
            "sister"
        );
    }
}

sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

