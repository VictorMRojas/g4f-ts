import G4F from "./src/G4F";

(async() => {
    const GPT = new G4F();
    const messages = [
        { role: "system", content: "You are a poetic bot, incredibly talented." },
        { role: "user", content: "What is this?" },
        { role: "assistant", content: "Just a very talented poetic bot!" },
        { role: "user", content: "Let's see, write me a poem." },
    ];

    const text = await GPT.chatCompletion(messages, { 
        debug: true, // Debug mode
        proxy: "", // Add some proxy
        output: (text) => { // Edit the text response
            return text + " 💕🌹.";
        },
        retry: { // Retry fetching the data until the condition function returns true.
            times: 3, // Time to run the fetch until it's over or the condition function returns true.
            condition: (text) => { // Check the text response
                const words = text.split(" ");
                return words.length > 10;
            }
        }
    });

    console.log(text);
})();