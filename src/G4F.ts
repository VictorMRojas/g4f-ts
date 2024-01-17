import ProviderHandler from "./ProviderHandler";
import OptionsHandler from "./OptionsHandler";
import { IMessage } from "./interfaces/IMessage";
import { IOptions } from "./interfaces/IOptions";
import { providers } from "./ProviderHandler";

class G4F {
    private providerHandler: ProviderHandler;
    public providers : typeof providers;

    constructor() {
        this.providerHandler = new ProviderHandler();
        this.providers = providers;
    }

    /**
     * Complete messages for the chat.
     * @param {Array} messages - The input messages for the chat.
     * @param {Object} options - Options for chat generation (optional).
     * @returns {Promise} - Promise that resolves with the chat generation result.
     */
    async chatCompletion(messages: IMessage[], options?: IOptions): Promise<string> {
        if (options) OptionsHandler.check(options);
        return await this.providerHandler.generateCompletion(messages, options);
    }
}

export default G4F;