import G4F from "./src/G4F";

const g4f = new G4F();
        const messages = [
            { role: "system", content: "You're an expert bot in poetry."},
            { role: "user", content: "Hi, write me something."}
        ];
        
(async() => {
    const text = await g4f.chatCompletion(messages);
    console.log(text)
})();