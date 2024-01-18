import G4F from "./src/G4F";

(async() => {
    const GPT = new G4F();
    const messages = [
        { role: "system", content: "You are a poetic bot, incredibly talented." },
        { role: "user", content: "What is this?" },
        { role: "assistant", content: "Just a very talented poetic bot!" },
        { role: "user", content: "Let's see, write a single paragraph-long poem for me." },
    ];

    const text = await GPT.chatCompletion(messages, { 
        provider: GPT.providers.ChatBase, // Provider selected
        debug: true, // Debug mode
        proxy: "", // Add some proxy
        output: (text) => { // Edit the text response
            return text + " 💕🌹";
        },
        retry: {
            /*
            Execute the fetch operation consecutively three times until 
            it finishes, or the condition function indicates true.
            */
            times: 3,
            condition: (text) => { // Check the text response
                const words = text.split(" ");
                return words.length > 10;
            }
        }
    });

    console.log(text);
})();