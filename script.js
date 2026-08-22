const userInput = document.getElementById("userInput");
console.log("Digital Big Sister scripts loaded");
const sendButton = document.getElementById("sendButton");
const photoButton = document.getElementById("photoButton");
const photoInput = document.getElementById("photoInput");
 console.log("SCRIPTS.JS LOADED");
let conversationHistory = [];
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

    conversationHistory.push({
        role: "user",
        content: message
    });

    addMessage(message, "user");
    userInput.value = "";

    const typingDiv = showTyping();

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message,
                history: conversationHistory
            })
        });

        const data = await response.json();

        typingDiv.remove();

        if (data.reply) {
            addMessage(data.reply, "sister");
        } else {
            addMessage(
                "I'm having a little trouble connecting right now. Try again in a moment. 💕",
                "sister"
            );
        }
    } catch (error) {
        typingDiv.remove();
        console.error(error);

        addMessage(
            "Oops! I couldn't connect right now. Let's try again. 💕",
            "sister"
        );
    }
}
function showTyping() {
    const typingDiv = document.createElement("div");

    typingDiv.classList.add("typing-indicator");

    typingDiv.innerHTML = `
        <span>•</span>
        <span>•</span>
        <span>•</span>
    `;

    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return typingDiv;
}



 sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

photoButton.addEventListener("click", () => {
    addMessage("Okayyy girl i see you, what do you need help with?", "sister");

    const outfitChoices = document.createElement("div");
    outfitChoices.classList.add("outfit-choices");

    outfitChoices.innerHTML = `
        <button class="outfit-choice" data-prompt="What can I wear with this?">💕 What can I wear with this?</button>
        <button class="outfit-choice" data-prompt="Help me build an outfit">✨ Help me build an outfit</button>
        <button class="outfit-choice" data-prompt="Where can I find this?">🛍️ Where can I find this?</button>
    `;

    chatMessages.appendChild(outfitChoices);

    const choices = outfitChoices.querySelectorAll(".outfit-choice");

   choices.forEach((choice) => {
    choice.addEventListener("click", () => {
        const prompt = choice.dataset.prompt;

        if (prompt === "Where can I find this?") {
            userInput.value = "Where can I find this? ";
        } else {
            userInput.value = prompt + " ";
        }

        userInput.focus();
    });
});

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];

    if (!file) {
        return;
    }

    const photoWchoicesfrapper = document.createElement("div");
    photoWrapper.classList.add("user-message");

    const image = document.createElement("img");
    image.src = URL.createObjectURL(file);
    image.classList.add("chat-photo");

    photoWrapper.appendChild(image);
    chatMessages.appendChild(photoWrapper);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});



