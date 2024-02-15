import CompletionHandler from "./handlers/ChatCompletionHandler";
import TranslationHandler from "./handlers/TranslationHandler";
import ImageGenerationHandler from "./handlers/ImageGenerationHandler";
import OptionsHandler from "./OptionsHandler";
import { IMessage } from "./interfaces/IMessage";
import { IChatCompletionOptions } from "./interfaces/IChatCompletionOptions";
import { ITranslationOptions } from "./interfaces/ITranslationOptions";
import { IImageGenerationOptions } from "./interfaces/IImageGenerationOptions";
import { providers } from "./Providers/ProviderList";

class G4F {
    private completionHandler: CompletionHandler;
    private translationHandler: TranslationHandler;
    private imageGenerationHandler: ImageGenerationHandler;
    public providers: typeof providers;

    constructor() {
        this.completionHandler = new CompletionHandler();
        this.translationHandler = new TranslationHandler();
        this.imageGenerationHandler = new ImageGenerationHandler();
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
    async translation(options: ITranslationOptions): Promise<any> {
        if (options) OptionsHandler.checkTranslationOptions(options);
        return await this.translationHandler.generateTranslation(options);   
    }

    /**
     * Generate an image with a determinate style.
     * @param {string} prompt - Prompt that indicates what kind of image to generate.
     * @param {IImageGenerationOptions} options - Provider Option's necessary to generate an image.
     * @returns {Promise} - Promise that resolves with the image result.
     */
    async imageGeneration(prompt: string, options?: IImageGenerationOptions): Promise<any> {
        if (options) OptionsHandler.checkImageGenerationOptions(options);
        return await this.imageGenerationHandler.imageGeneration(prompt, options);
    }
}

export default G4F;