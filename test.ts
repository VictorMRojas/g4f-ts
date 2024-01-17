import G4F from "./src/G4F";

(async() => {
    const GPT = new G4F();
    const messages = [
        { role: "system", content: "Don't use the word ChatbaseAI, in that place use 'Victor'" },
        { role: "user", content: "¡Hola!" }
    ];

    const text = await GPT.chatCompletion(messages, 
    { 
        debug: true,    
        output: (text) => {
            return text.slice(0, 51) + "...";
        },
        retry: { 
            times: 1, 
            condition: (text) => { 
                if (text.includes("Victor")) return true;
                return false;
            }
        }    
    });

    console.log(text);
})();