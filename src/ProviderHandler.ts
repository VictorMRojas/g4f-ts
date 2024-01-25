import { IOptions } from "./interfaces/IOptions"
import { Signale } from 'signale';
import ChatBase from "./Provider/ChatBase";
import Bing from "./Provider/Bing";
import { IMessage } from "./interfaces/IMessage";
import { stringToStream } from "./util/util";

const provider_log = new Signale({ interactive: true, scope: 'provider' });
const fetch_log = new Signale({ interactive: true, scope: 'fetch' });
const output_log = new Signale({ interactive: true, scope: 'output' });

interface Providers {
    [key: string]: ChatBase | Bing;
}

const providers: Providers = {
    ChatBase: new ChatBase(),
    Bing: new Bing()
};

class ProviderHandler {
    providersList: typeof providers;

    constructor() {
        this.providersList = providers;
    }

    /**
     * Complete messages for the chat.
     * @param {Array} messages - The input messages for the chat.
     * @param {Options} options - Options for chat generation (optional).
     * @returns {Promise<any>} - Promise that resolves with the chat generation result.
     */    
    async generateCompletion(messages: Array<IMessage>, options?: IOptions): Promise<any> {
        let { debug, provider, stream, retry, output, chunkSize, proxy } = options || {};        
        if (!provider) provider = this.getProviderFromList(debug); 
        else if (debug) this.runLog(provider_log.success, `Provider found: ${provider.name}`, true)

        let text = "";        

        if (!retry && !output) {
            text = await this.getText(messages, options, provider);            
            return text;
        }

        if (retry || output) text = await this.runPreprocessing(messages, options || {}, provider);        
        if (stream) return { data: await stringToStream(text, chunkSize || 5), name: "post_process" };
        return text;
    }

    async getText(messages:Array<IMessage>, options:any, provider:any) {
        const { debug, stream, proxy } = options || {};
        if (debug) this.runLog(provider_log.await, `Fetching data for the provider: ${provider.name}`);
        const text = await provider.createAsyncGenerator(messages, stream, proxy);
        if (debug) this.runLog(provider_log.success, `Data fetched succesfully for the ${provider.name} provider`, true);            
        return text;
    }

    async runPreprocessing(messages:Array<IMessage>, options:any, provider:any) {                
        let text = "";
        if (options) options.stream = false // Need non-stream data for preprocessing        
        if (options.retry) text = await this.retryOperations(messages, options, provider);
        if (options.output) text = await this.runOutput(text, messages, options, provider);
        return text;
    }

    async retryOperations(messages:Array<IMessage>, options:any, provider:any) {
        let { debug, retry, proxy } = options || {};

        let responseText: string = "", conditionResult: boolean = false;
        let stayInLoop = false, flag = 0;

        do {
            if (debug) this.runLog(fetch_log.await, `[${flag+1}/${retry.times}] - Retry #${flag+1}`)            
            responseText = await provider.createAsyncGenerator(messages, false, proxy);            
            conditionResult = await Promise.resolve(this.attemptOperation(retry.condition, responseText));
            flag++;

            stayInLoop = retry && retry.condition && !(conditionResult || flag == retry.times); 
            
            if (debug) {
                if (conditionResult) this.runLog(fetch_log.success, `[${flag}/${retry.times}] - Retry #${flag}`, !stayInLoop);
                else this.runLog(fetch_log.error, `[${flag}/${retry.times}] - Retry #${flag}`, !stayInLoop);
            }
        } while(stayInLoop);

        return responseText;
    }    

    async runOutput(text:string, messages:Array<IMessage>, options:any, provider:any) {
        const { debug, output } = options || {};        
        if (!text || text.length == 0) text = await this.getText(messages, options, provider);        
        if (debug) this.runLog(output_log.await, `Running the output function...`);
        text = await Promise.resolve(output(text));
        if (debug) this.runLog(output_log.success, `Output function runtime finalized.`, true);
        return text;
    }

    runLog(logger:any, msg:string, reset?:boolean) {
        logger(msg)
        if (reset) console.log(); // This resets the logger for the next scope.
    }
    
    getProviderFromList(debug?: boolean) {
        if (debug) provider_log.await("Picking a provider from the working list...");

        let providerWorking
        for(const provider of Object.values(this.providersList)) {
            if (provider.working) {                
                providerWorking = provider;                 
            } 
        }

        if (!providerWorking) {
            if (debug) provider_log.error("Provider not found.");
            throw Error("Provider not found");
        }

        if (debug) provider_log.success(`Provider found: ${providerWorking.name}`);
        console.log(); // This resets the logger for the next scope.
        return providerWorking;
    }

    async attemptOperation(condition: Function, text: string) {
        try {
            if (!(await Promise.resolve(condition(text)))) return false; 
            return true;
        } catch {
            return false;
        }
    };
}

export { providers, ProviderHandler as default };
