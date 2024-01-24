import { providers } from '../ProviderHandler'

export function handleStream(response:any, stream:boolean, responseFunc:any) {
    if (!stream) return responseFunc(response.data);
    return response;
}

export async function* chunkProcessor(stream:any, name:string) {
    let previousText = "";
    let text = "";
    const provider = providers[name];
    for await (const chunk of stream) {
        if (name == "ChatBase") text += chunk.toString("utf-8");     
        else text = chunk.toString("utf-8");            

        text = provider.handleResponse(text);
        
        if (previousText == text) continue; 
        previousText = text;
        
        if (text && text.length != 0) yield text;
    }
}