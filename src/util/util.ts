import { Readable } from 'stream';
import { AxiosProxyConfig } from 'axios';
import { models } from '../Providers/ProviderList';
import ChatCompletionHandler from '../handlers/ChatCompletionHandler';
import TranslationHandler from '../handlers/TranslationHandler';
import ImageGenerationHandler from '../handlers/ImageGenerationHandler';

export function runLog(logger:any, msg:string, reset?:boolean) {
    logger(msg)
    if (reset) console.log(); // This resets the logger for the next scope.
}

export function createProxyConfig(proxy: string | undefined): AxiosProxyConfig | undefined {
    if (!proxy || proxy.length == 0) return undefined;

    const [host, port] = proxy.split(':');
    if (!host || !port) return undefined;
    return {
        host,
        port: parseInt(port, 10),
    };
}

export function generateRandomId(max: number): string {
    return Math.random().toString(36).substring(0, max);
};

export function stringToStream(text:string, chunkSize:number) {
    let offset = 0;
  
    return new Readable({
        read(size:any) {
            const chunk = text.slice(offset, offset + chunkSize);
            offset += chunkSize;
            if (chunk.length > 0) {
                this.push(chunk);
            } else {
                this.push(size ? null : null);
            }
        }
    });
}

export function getProviderFromList(
    providersList:ChatCompletionHandler["providersList"] | TranslationHandler["providersList"] | ImageGenerationHandler["providersList"],
    logger?:any, options?:any) {
    if (options?.debug) runLog(logger.await, "Picking a provider from the working list...");

    let providerWorking = lookForProvider(providersList, options);        

    if (!providerWorking) {
        if (options?.debug) runLog(logger.error, "Provider not found.");
        throw Error("Provider not found");
    }

    if (options?.debug) {
        runLog(logger.success, `Provider found: ${providerWorking.name}`, true);
    }

    return providerWorking;
}

function lookForProvider(
    providersList:ChatCompletionHandler["providersList"] | TranslationHandler["providersList"] | ImageGenerationHandler["providersList"], 
    options?: any
    )
{

    let providerWorking;
    for(const provider of Object.values(providersList)) {
        if (!options?.model && provider && provider.working) {
            providerWorking = provider;
            break;
        } 
        
        if (options?.model && models[provider.name].includes(options?.model)) {
            if (provider.working) {
                providerWorking = provider;
                break;
            }
        }
    }
    return providerWorking;
}