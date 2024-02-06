import CompletionHandler from "./handlers/ChatCompletionHandler";
import TranslateHandler from "./handlers/TranslationHandler";
import OptionsHandler from "./OptionsHandler";
import { IMessage } from "./interfaces/IMessage";
import { IChatCompletionOptions } from "./interfaces/IChatCompletionOptions";
import { ITranslationOptions } from "./interfaces/ITranslationOptions";
import { providers } from "./Providers/ProviderList";

class G4F {
    private completionHandler: CompletionHandler;
    private translateHandler: TranslateHandler;
    public providers: typeof providers;

    constructor() {
        this.completionHandler = new CompletionHandler();
        this.translateHandler = new TranslateHandler();
        this.providers = providers;
    }

    /**
     * Complete messages for the chat.
     * @param {Array} messages - The input messages for the chat.
     * @param {Object} options - Options for chat generation (optional).
     * @throws {Error} - Throw an error if the options are invalid or the provider fails at any point
     * @returns {Promise} - Promise that resolves with the chat generation result.
     */
    async chatCompletion(messages: IMessage[], options?: IChatCompletionOptions): Promise<any> {
        if (options) OptionsHandler.checkChatCompletionOptions(options);
        return await this.completionHandler.generateCompletion(messages, options);
    }

    /**
     * Translate text to a target language.
     * @param {Object} options - Options for translation.
     * @throws {Error} - Throw an error if the options are invalid or the provider fails at any point
     * @returns {Promise} - Promise that resolves with the translation result.
     */
    async translation(options: ITranslationOptions) {
        if (options) OptionsHandler.checkTranslationOptions(options);
        return await this.translateHandler.generateTranslation(options);   
    }
}

export default G4F;