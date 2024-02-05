import G4F from "./src/G4F";
import { chunkProcessor } from "./src/util/stream";

(async() => {
    const GPT = new G4F();
    const messages = [
        { role: "system", content: "You are a poetic bot, incredibly talented." },
        { role: "user", content: "What is this?" },
        { role: "assistant", content: "Just a very talented poetic bot!" },
        { role: "user", content: "Let's see, write a single paragraph-long poem for me." },
    ];

    const text = await GPT.chatCompletion(messages, { 
        provider: GPT.providers.GPT, // Provider selected
        //model: "gpt-3.5-turbo",
        debug: true, // Debug mode
        proxy: "", // Add some proxy
        
        output: (text) => { // Edit the text response
            return text + " 💕🌹";
        },
        retry: {
            times: 3,
            condition: (text) => { // Check the text response
                const words = text.split(" ");
                return words.length > 10;
            }
        }
        
    });

    console.log(text)

    /*
    for await(const item of chunkProcessor(text)) {
        console.log(item);
        console.log("\n");
    };
    */    
})();