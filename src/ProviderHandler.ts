import { IOptions } from "./interfaces/IOptions"
import { Signale } from 'signale';
import { IMessage } from "./interfaces/IMessage";
import { runLog, stringToStream } from "./util/util";
import { providers, models } from './ProviderList';

const model_log = new Signale({ interactive: true, scope: 'model' });
const provider_log = new Signale({ interactive: true, scope: 'provider' });
const fetch_log = new Signale({ interactive: true, scope: 'fetch' });
const output_log = new Signale({ interactive: true, scope: 'output' });

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
        let { debug, model, provider, stream, retry, output, chunkSize } = options || {};        
        if (!provider) provider = this.getProviderFromList(debug, model); 
        else if (debug) runLog(provider_log.success, `Provider found: ${provider.name}`, true)

        if (debug) runLog(model_log.success, `Using the model: ${model || provider.default_model}`, true);

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
        if (debug) runLog(provider_log.await, `Fetching data from the provider: ${provider.name}`);
        const text = await provider.createAsyncGenerator(messages, options);
        if (debug) runLog(provider_log.success, `Data was successfully fetched from the ${provider.name} provider`, true);            
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
            if (debug) runLog(fetch_log.await, `[${flag+1}/${retry.times}] - Retry #${flag+1}`)

            const NoStreamOptions = { ...options };            
            NoStreamOptions.stream = false;
            
            responseText = await provider.createAsyncGenerator(messages, NoStreamOptions);            
            conditionResult = await Promise.resolve(this.attemptOperation(retry.condition, responseText));
            flag++;

            stayInLoop = retry && retry.condition && !(conditionResult || flag == retry.times); 
            
            if (debug) {
                if (conditionResult) runLog(fetch_log.success, `[${flag}/${retry.times}] - Retry #${flag}`, !stayInLoop);
                else runLog(fetch_log.error, `[${flag}/${retry.times}] - Retry #${flag}`, !stayInLoop);
            }
        } while(stayInLoop);

        return responseText;
    }    

    async runOutput(text:string, messages:Array<IMessage>, options:any, provider:any) {
        const { debug, output } = options || {};        
        if (!text || text.length == 0) text = await this.getText(messages, options, provider);        
        if (debug) runLog(output_log.await, `Running the output function...`);
        text = await Promise.resolve(output(text));
        if (debug) runLog(output_log.success, `Output function runtime finalized.`, true);
        return text;
    }
    
    getProviderFromList(debug?: boolean, model?: string) {
        if (debug) runLog(provider_log.await, "Picking a provider from the working list...");

        let providerWorking = this.lookForProvider(model);        

        if (!providerWorking) {
            if (debug) runLog(provider_log.error, "Provider not found.");
            throw Error("Provider not found");
        }

        if (debug) {
            runLog(provider_log.success, `Provider found: ${providerWorking.name}`, true);
        }

        return providerWorking;
    }

    lookForProvider(model?: string) {
        let providerWorking;
        
        for(const provider of Object.values(this.providersList)) {
            if (!model && provider.working) {
                providerWorking = provider;
                break;
            } 
            
            if (model && models[provider.name].includes(model)) {
                if (provider.working) {
                    providerWorking = provider;
                    break;
                }
            }
        }

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
