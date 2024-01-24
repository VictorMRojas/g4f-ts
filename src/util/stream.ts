import { providers } from '../ProviderHandler'

export function handleStream(response:any, stream:boolean, responseFunc:any) {
    if (!stream) return responseFunc(response.data);
    return response;
}

export async function* chunkProcessor(stream:any, name:string) {
    let previousText = "";
    let text = "";
    let parts_text = null;
    const isPostprocessing = name == "post_process";
    let provider = isPostprocessing ? null : providers[name];
    for await (const chunk of stream) {
      text = chunk.toString("utf-8");

      if (provider) text = provider.handleResponse(text);
      if (!text) continue;
      if (previousText == text) continue;
      if (name == "Bing") parts_text = text.slice(previousText.length);
      
      previousText = text;
      if (text && text.length != 0)
        yield parts_text || text;
    }
}