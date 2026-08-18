const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const PORT = 3000;

const client = new OpenAI({
    apiKey: process.env.FEATHERLESS_API_KEY,
    baseURL: "https://api.featherless.ai/v1"
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

app.get("/", (req, res) => {
    res.json({
        message: "Digital Big Sister server is running 🌸"
    });
});

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await client.chat.completions.create({
            model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
            messages: [
                {
                    role: "user",
                    content: userMessage
                }
            ]
        });

        res.json({
            reply: response.choices[0].message.content
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Something went wrong while talking to the AI."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Digital Big Sister server running on port ${PORT}`);
});


