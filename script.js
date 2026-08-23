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

   messageDiv.innerHTML = message.replace(/\n/g, "<br>");
    
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
    addMessage(
        "Okayyy girl i see you, what do you need help with?",
        "sister"
    );

    const outfitChoices = document.createElement("div");
    outfitChoices.classList.add("outfit-choices");

    outfitChoices.innerHTML = `
        <button class="outfit-choice" data-prompt="What can I wear with this?">
            💕 What can I wear with this?
        </button>

        <button class="outfit-choice" data-prompt="Help me build an outfit">
            ✨ Help me build an outfit
        </button>

        <button class="outfit-choice" data-prompt="Where can I find this?">
            🛍️ Where can I find this?
        </button>
    `;

    chatMessages.appendChild(outfitChoices);

    const choices = outfitChoices.querySelectorAll(".outfit-choice");

    choices.forEach((choice) => {
        choice.addEventListener("click", () => {
            const prompt = choice.dataset.prompt;

            if (prompt === "Where can I find this?") {
                showOutfitSearchBox();
                return;
            }

            if (prompt === "What can I wear with this?") {
                showWhatToWearBox();
                return;
            }

            if (prompt === "Help me build an outfit") {
                showBuildOutfitBox();
                return;
            }

            userInput.value = prompt + " ";
            userInput.focus();
        });
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
});


// =====================================
// WHERE CAN I FIND THIS?
// =====================================

function showOutfitSearchBox() {
    const searchBox = document.createElement("div");
    searchBox.classList.add("outfit-search-box");

    searchBox.innerHTML = `
        <p>What are we looking for??</p>

        <input
            type="text"
            class="outfit-search-input"
            placeholder="Example: pink jeans"
        >

        <button class="outfit-search-button">
            Search 💕
        </button>
    `;

    chatMessages.appendChild(searchBox);

    const input = searchBox.querySelector(".outfit-search-input");
    const button = searchBox.querySelector(".outfit-search-button");

    button.addEventListener("click", () => {
        const query = input.value.trim();

        if (!query) {
            return;
        }

        addMessage(query, "user");
        searchBox.remove();

        addMessage(
            `I got you sis, lookin for ${query} right now`,
            "sister"
        );
        conversationHistory.push({
    role: "user",
    content: `What can I wear with ${query}?`
});

        searchOutfits(query);
    });

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            button.click();
        }
    });

    input.focus();

    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// =====================================
// WHAT CAN I WEAR WITH THIS?
// =====================================

function showWhatToWearBox() {
    const outfitBox = document.createElement("div");
    outfitBox.classList.add("outfit-search-box");

    outfitBox.innerHTML = `
        <p>What are we stylin sis?</p>

        <input
            type="text"
            class="outfit-search-input"
            placeholder="Example: pink jeans"
        >

        <button class="outfit-search-button">
            Style it ✨
        </button>
    `;

    chatMessages.appendChild(outfitBox);

    const input = outfitBox.querySelector(".outfit-search-input");
    const button = outfitBox.querySelector(".outfit-search-button");

    button.addEventListener("click", async () => {
        const query = input.value.trim();

        if (!query) {
            return;
        }

        addMessage(query, "user");
        outfitBox.remove();

        addMessage(
            `Okkk sis, let's style those ${query} 👀`,
            "sister"
        );

        const typingDiv = showTyping();

        try {
            const response = await fetch("/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: `What can I wear with ${query}? Give me a cute, age-appropriate outfit idea.`,
                    history: conversationHistory
                })
            });

            const data = await response.json();

typingDiv.remove();

if (data.reply) {
    addMessage(data.reply, "sister");

    conversationHistory.push({
        role: "assistant",
        content: data.reply
    });
} else {
    addMessage(
        "Hmm, I couldn't come up with an outfit right now. Try again! 💕",
        "sister"
    );
}

        } catch (error) {
            typingDiv.remove();

            console.error("Styling error:", error);

            addMessage(
                "Girl, something went wrong while styling that. 😭 Try again!",
                "sister"
            );
        }
    });

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            button.click();
        }
    });

    input.focus();

    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// =====================================
// HELP ME BUILD AN OUTFIT
// =====================================

function showBuildOutfitBox() {
    const outfitBox = document.createElement("div");
    outfitBox.classList.add("outfit-search-box");

    outfitBox.innerHTML = `
        <p>Okay sis, what's the vibe?</p>

        <input
            type="text"
            class="outfit-search-input"
            placeholder="Example: casual school fit"
        >

        <button class="outfit-search-button">
            Build it 💕
        </button>
    `;

    chatMessages.appendChild(outfitBox);

    const input = outfitBox.querySelector(".outfit-search-input");
    const button = outfitBox.querySelector(".outfit-search-button");

    button.addEventListener("click", async () => {
        const query = input.value.trim();

        if (!query) {
            return;
        }

        addMessage(query, "user");
        outfitBox.remove();

        addMessage(
            `Okayyy sis, let's build a ${query} 👀`,
            "sister"
        );

        const typingDiv = showTyping();

        try {
            const response = await fetch("/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: `Help me build a cute, age-appropriate ${query}. Give me a top, bottom, shoes, and a couple accessory ideas.`,
                    history: conversationHistory
                })
            });

            const data = await response.json();

            typingDiv.remove();

            if (data.reply) {
                addMessage(data.reply, "sister");
            } else {
                addMessage(
                    "Hmm, I couldn't build that outfit right now. Try again! 💕",
                    "sister"
                );
            }

        } catch (error) {
            typingDiv.remove();

            console.error("Outfit builder error:", error);

            addMessage(
                "Girl, something went wrong building that outfit. 😭 Try again!",
                "sister"
            );
        }
    });

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            button.click();
        }
    });

    input.focus();

    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// =====================================
// CLOTHING SEARCH
// =====================================

async function searchOutfits(query) {
    try {
        const response = await fetch("/outfit-search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: query
            })
        });

        const data = await response.json();

        if (!response.ok || !data.results?.products) {
            addMessage(
                "Hmm girl, I couldn't find those clothes right now. Try describing them a different way. 💕",
                "sister"
            );
            return;
        }

        showOutfitResults(data.results.products);

    } catch (error) {
        console.error("Outfit search error:", error);

        addMessage(
            "Girl, something went wrong while I was looking for those clothes. 😭 Try again!",
            "sister"
        );
    }
}


// =====================================
// PRODUCT RESULTS
// =====================================

function showOutfitResults(products) {
    const resultsDiv = document.createElement("div");
    resultsDiv.classList.add("outfit-results");

    const productsToShow = products.slice(0, 3);

    productsToShow.forEach((product) => {
        const card = document.createElement("div");
        card.classList.add("outfit-card");

        const image =
            product.images?.find(img => img.is_main_image)?.url ||
            product.images?.[0]?.url;

        const brand = product.brands?.[0]?.name || "";
        const offer = product.offers?.[0];

        card.innerHTML = `
            ${
                image
                    ? `<img
                        src="${image}"
                        class="outfit-product-image"
                        alt="${product.title}"
                    >`
                    : ""
            }

            <div class="outfit-product-info">
                <h3>${product.title}</h3>

                ${
                    brand
                        ? `<p>${brand}</p>`
                        : ""
                }

                ${
                    offer?.price
                        ? `<strong>$${offer.price.price}</strong>`
                        : ""
                }

                ${
                    offer?.url
                        ? `<a
                            href="${offer.url}"
                            target="_blank"
                            rel="noopener noreferrer"
                           >
                            View item
                           </a>`
                        : ""
                }
            </div>
        `;

        resultsDiv.appendChild(card);
    });

    chatMessages.appendChild(resultsDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

