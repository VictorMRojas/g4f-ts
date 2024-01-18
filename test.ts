import G4F from "./src/G4F";

(async() => {
    const GPT = new G4F();
    const messages = [
        { role: "user", content: "¡Hola!, soy Victor." }
    ];

    const text = await GPT.chatCompletion(messages, 
    { 
        debug: true,    
        output: (text) => {
            return text;
        },
        retry: { 
            times: 3, 
            condition: (text) => { 
                if (text.includes("Victor")) return true;
                return false;
            }
        }    
    });

    console.log(text);
})();