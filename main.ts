import G4F from "./src/G4F";

(async() => {
    const g4f = new G4F();
        const messages = [
            { role: "user", content: "Hi, what's up?"}
        ];
        const options = {
            provider: g4f.providers.GPT,
            model: "gpt-4",
            debug: true
        };
        
        const text = await g4f.chatCompletion(messages, options);	
        console.log(text)
})();