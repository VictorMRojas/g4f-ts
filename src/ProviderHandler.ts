import { Debugger } from "./Debugger";
import { IOptions } from "./interfaces/IOptions"
import ChatBase from "./Provider/ChatBase";


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
            responseText = await provider.createAsyncGenerator(messages, proxy);
            if (retry && retry.condition) conditionResult = await Promise.resolve(this.attemptOperation(retry.condition, responseText));
            flag++;

            if (debug) Debugger.log(`retryTime: ${flag}, conditionResult: ${conditionResult}`);
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
        let providerWorking
        for(const provider of Object.values(this.providersList)) {
            if (provider.working) providerWorking = provider; 
        }
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
