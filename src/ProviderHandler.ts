import { IOptions } from "./interfaces/IOptions"
import {Signale} from 'signale';
import ChatBase from "./Provider/ChatBase";

const fetch_log = new Signale({ interactive: true, scope: 'fetch' });
const provider_log = new Signale({ interactive: true, scope: 'provider' });
const output_log = new Signale({ interactive: true, scope: 'output' });

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
        if (!provider) provider = this.getProviderFromList(debug); 
        else {
            provider_log.success(`Provider found: ${provider.name}`);
            console.log(); // This resets the logger for the next scope.
        }

        let responseText: string = "", conditionResult: boolean = false;
        let flag = 0;

        if (debug && !retry) fetch_log.await(`Fetching data for the provider: ${provider.name}`);

        do {
            if (retry && debug) fetch_log.await(`[%d/${retry.times}] - Retry #${flag+1}`, flag+1);
            responseText = await provider.createAsyncGenerator(messages, proxy);
            if (retry && retry.condition) {
                conditionResult = await Promise.resolve(this.attemptOperation(retry.condition, responseText)); 
                if (debug) {
                    if(conditionResult) fetch_log.success(`[%d/${retry.times}] - Retry #${flag+1}`, flag+1);
                    else fetch_log.error(`[%d/${retry.times}] - Retry #${flag+1}`, flag+1);
                }
            }
            flag++;
        } while(
            retry ? ( // If a retry option is provided, we need to validate the retry condition within the loop                
                (retry.condition && !conditionResult) &&
                !(flag == retry.times)
            ) : (false) // If there is no retry option, we have already initialized responseText, so we can exit the do-while loop
        );

        if (debug && !retry) fetch_log.success(`Data fetched succesfully for the ${provider.name} provider`);
        console.log(); // This resets the logger for the next scope.

        if (output) {
            if (debug) output_log.await(`Running the output function...`);        
            responseText = await Promise.resolve(output(responseText));
            if (debug) output_log.success(`Output function runtime finalized.`);
        } 

        return responseText!;
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
