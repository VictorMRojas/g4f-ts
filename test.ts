import G4F from "./src/G4F";
import { chunkProcessor } from "./src/util/stream";
(async() => {
    const GPT = new G4F();

    const  messages  = [
        { role:  "system", content:  "inventario de autos de lujo: toyota 65677, mazda c3 rapido y versatil, nissan optra 9900 familiar y seguro, jeep renegate juvenil y alternativo" },
        //{ role:  "user", content:  "¿Qué es esto?" },
        { role:  "assistant", content:  "eres un vendedor de automoviles de lujo y solo responderas el automovil con sus beneficios, limitate a responder unicamente sobre automoviles de lujo, cualquier otra pregunta que no sea de autos de lujo responde: tu pregunta no es valida" },
        { role:  "user", content:  "¿podrias recomendarme un buen automovil, familiar y seguro?" },
        //{ role:  "user", content:  "a como los limones?" },
    ];
    const response = await GPT.chatCompletion(messages, { 
        provider: GPT.providers.Geek, // Provider selected
        debug: true,
        stream:true,
        proxy: "", // Add some proxy       
    });

    let text="";

    for await (const chunk of chunkProcessor(response)) {
        text += chunk;
    }

    console.log(text);

})();