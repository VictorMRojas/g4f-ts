import { providers } from '../Providers/ProviderList'

export function handleStream(response:any, stream:boolean, responseFunc:any) {
    if (!stream) return responseFunc(response.data);
    return response;
}

export async function* chunkProcessor(response:any) {
    let previousText = "";
    let text = "";
    let sliceText = null;
    const isPostprocessing = response.name == "post_process";
    let provider = isPostprocessing ? null : providers[response.name];
    for await (const chunk of response.data) {
      text = chunk.toString("utf-8");
      if (provider) text = provider.handleResponse(text);      
      if (!text) continue;
      if (previousText == text) continue;
      if (provider && provider.need_slice_text) sliceText = text.slice(previousText.length);
      
      previousText = text;
      if (text && text.length != 0)
        yield sliceText || text;
    }
}