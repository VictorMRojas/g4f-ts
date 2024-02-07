import G4F from "./src/G4F";
import { chunkProcessor } from "./src/util/stream";

describe('Chat Completion examples', () => {
    test('Basic Usage', async() => {
        const g4f = new G4F();
        const messages = [
            { role: "user", content: "Hi, what's up?"}
        ];
        const text = await g4f.chatCompletion(messages);
        expect(typeof text).toBe("string");
    });
    
    test('Give your instructions', async() => {
        const g4f = new G4F();
        const messages = [
            { role: "system", content: "You're an expert bot in poetry."},
            { role: "user", content: "Hi, write me something."}
        ];
        const text = await g4f.chatCompletion(messages);
        expect(typeof text).toBe("string");
    })

    test('Follow up on the conversation context', async() => {
        const g4f = new G4F();
        const messages = [
            { role: "system", content: "You're a math teacher."},
            { role: "user", content: "How much is 2 plus 2?" },
            { role: "assistant", content: "2 plus 2 equals 4." },
            { role: "user", content: "You're really good at math!" },
            { role: "assistant", content: "Thank you! I'm glad I could help you with your math question." },
            { role: "user", content: "What was the first question I asked you?" }
        ];
        
        const text = await g4f.chatCompletion(messages);
        expect(typeof text).toBe("string");
    });

    test('Basic options', async() => {
        const g4f = new G4F();
        const messages = [
            { role: "user", content: "Hi, what's up?"}
        ];
        const options = {
            provider: g4f.providers.GPT,
            model: "gpt-3.5-turbo",
            proxy: ""
        };
        
        const text = await g4f.chatCompletion(messages, options);	
        expect(typeof text).toBe("string");
    });

    test('Advanced options', async() => {
        const g4f = new G4F();
        const messages = [
            { role: "system", content: "You're an expert bot in poetry."},
            { role: "user", content: "Let's see, write a single paragraph-long poem for me." },
        ];
        const options = {
            model: "gpt-4",
            retry: {
                times: 3,
                condition: (text) => {
                    const words = text.split(" ");
                    return words.length > 10;
                }
            },
            output: (text) => {
                return text + " 💕🌹";
            }
        };
        
        const text = await g4f.chatCompletion(messages, options);	
        expect(typeof text).toBe("string");
    });

    test('Basic streaming usage', async() => {
        const g4f = new G4F();
        const messages = [
            { role: "system", content: "You're an expert bot in poetry."},
            { role: "user", content: "Let's see, write a single paragraph-long poem for me." },
        ];
        const options = {
            provider: g4f.providers.ChatBase,
            stream: true
        };
        
        (async() => {
            const response = await g4f.chatCompletion(messages, options);	
            expect(typeof response).toBe("object");
            expect(typeof response.name).toBe("string");
            expect(typeof response.data).toBe("object");

            let res = "";
            for await (const text of chunkProcessor(response)) {
                res += text;                
            }
            expect(typeof res).toBe("string");
        })();
    });

    test('How to handle streamable data.', async() => {
        const g4f = new G4F();
        const messages = [
            { role: "system", content: "You're an expert bot in poetry."},
            { role: "user", content: "Let's see, write a single paragraph-long poem for me." },
        ];
        const options = {
            provider: g4f.providers.ChatBase,
            stream: true
        };
        
        const response = await g4f.chatCompletion(messages, options);
        expect(typeof response).toBe("object");
        expect(typeof response.name).toBe("string");
        expect(typeof response.data).toBe("object");

        let res = "";
        for await (const text of chunkProcessor(response)) {
            res += text;                
        }
        expect(typeof res).toBe("string");
    });

    
    test('Stream on postprocessing', async() => {
        const g4f = new G4F();
        const messages = [
            { role: "system", content: "You're an expert bot in poetry."},
            { role: "user", content: "Let's see, write a single paragraph-long poem for me." },
        ];
        const options = {
            provider: g4f.providers.ChatBase,
            stream: true,
            chunkSize: 15,
            retry: {
                times: 3,
                condition: (text) => {
                    const words = text.split(" ");
                    return words.length > 10;
                }
            },
            output: (text) => {
                return text + " 💕🌹";
            }
        };
        
        const response = await g4f.chatCompletion(messages, options);
        expect(typeof response).toBe("object");
        expect(typeof response.name).toBe("string");
        expect(typeof response.data).toBe("object");

        let res = "";
        for await (const text of chunkProcessor(response)) {
            res += text;                
        }
        expect(typeof res).toBe("string");        
    });
});

describe('Translation examples', () => { 
    test('Usage', async() => {
        const g4f = new G4F();
        const options = {
            text: "Hello World",
            source: "en",
            target: "ko"
        };
        
        const text = await g4f.translation(options);
        expect(typeof text).toBe("object")
        expect(typeof text.translation.result).toBe("string")
    });
})