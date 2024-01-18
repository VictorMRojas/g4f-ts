import { IOptions } from "./interfaces/IOptions"
import {Signale} from 'signale';
import ChatBase from "./Provider/ChatBase";

const retry_log = new Signale({interactive: true, scope: 'interactive'});
const provider_log = new Signale({interactive: true, scope: 'interactive'});

interface Providers {
    [key: string]: ChatBase;
}
const providers: Providers = {
    ChatBase: new ChatBase()
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
     * @returns {Promise<string>} - Promise that resolves with the chat generation result.
     */
    async generateCompletion(messages: Array<any>, options?: IOptions): Promise<string> {
        let { debug, provider, retry, output, proxy } = options || {};        
        if (!provider) provider = this.getProviderFromList(); 
        
        let responseText: string = "", conditionResult: boolean = false;
        let flag = 0;

        do {
            if (retry) retry_log.await(`[%d/${retry.times}] - Retry #${flag+1}`, flag+1);
            responseText = await provider.createAsyncGenerator(messages, proxy);
            if (retry && retry.condition) {
                conditionResult = await Promise.resolve(this.attemptOperation(retry.condition, responseText)); 
                if(conditionResult) retry_log.success(`[%d/${retry.times}] - Retry #${flag+1}`, flag+1);
                else retry_log.error(`[%d/${retry.times}] - Retry #${flag+1}`, flag+1);
            }
            flag++;
        } while(
            retry ? ( // If a retry option is provided, we need to validate the retry condition within the loop                
                (retry.condition && !conditionResult) &&
                !(flag == retry.times)
            ) : (false) // If there is no retry option, we have already initialized responseText, so we can exit the do-while loop
        );

        if (output) responseText = output(responseText);        
        return responseText!;
    }
    
    getProviderFromList() {
        provider_log.await("Picking a provider from the working list...");

        let providerWorking
        for(const provider of Object.values(this.providersList)) {
            if (provider.working) {                
                providerWorking = provider;                 
            } 
        }

        if (!providerWorking) {
            provider_log.error("Provider not found.");
            throw Error("Provider not found");
        }

        provider_log.success("Provider found successfully.");
        return providerWorking;
    }

    async attemptOperation(condition: Function, text: string) {
        try {
            if (!condition(text)) return false; 
            return true;
        } catch {
            return false;
        }
    };
}

export { providers, ProviderHandler as default };
