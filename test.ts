import G4F from "./src/G4F";
import { chunkProcessor } from "./src/util/stream";

(async() => {
    const GPT = new G4F();
    const messages = [
        { role: "system", content: "You're an expert bot in poetry."},
        { role: "user", content: "Let's see, write a single paragraph-long poem for me." },
    ];
    const options = {
        model: "gpt-4",
        debug: true,
        retry: {
            times: 3,
            condition: (text:any) => {
                const words = text.split(" ");
                return words.length > 10;
            }
        },
        output: (text:any) => {
            return text + " 💕🌹";
        }
    };

    const text = await GPT.chatCompletion(messages, options);	
    console.log(text);

    /*
    for await(const item of chunkProcessor(text)) {
        console.log(item);
        console.log("\n");
    };
    */    
})();