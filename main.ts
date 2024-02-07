import G4F from "./src/G4F";

(async() => {
    const g4f = new G4F();
    const options = {
        text: "Hello World",
        source: "en",
        target: "ko"
    };
    
    const text = await g4f.translation(options);
    console.log(text);
})();