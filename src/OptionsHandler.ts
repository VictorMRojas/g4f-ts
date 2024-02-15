import { providers } from "./Providers/ProviderList";
import { IChatCompletionOptions } from "./interfaces/IChatCompletionOptions";
import { ITranslationOptions } from "./interfaces/ITranslationOptions";
import { models } from "./Providers/ProviderList";
import { IImageGenerationOptions } from "./interfaces/IImageGenerationOptions";

class OptionsHandler {
    /**
     * Checks the validity of options for chat generation.
     * @param {Object} options - Options for chat generation.
     * @throws {Error} - Throws an error if options are invalid.
     * @returns {boolean} - Returns true if options are valid.
     */
    static checkChatCompletionOptions(options?: IChatCompletionOptions): boolean {
        if (typeof options !== 'object') throw new Error("Options must be a valid object.");
        if (options.provider && !Object.keys(providers).some(key => options.provider instanceof providers[key].constructor)) throw new Error("Provider option must be valid. Try { provider: (new G4F()).providers.GPT, ... }");
        if (options.provider && options.provider.type != "ChatCompletion") throw new Error("The provider type should be 'ChatCompletion'")
        if (options.provider && options.model && !models[options.provider.name].some(model => model == options.model)) throw new Error("You need to include a model that is compatible with the selected provider.");
        if (options.retry && typeof options.retry != "object") throw new Error("Retry option must be a object.");
        if (options.retry) {
            if (!options.retry.times) throw new Error("Times option must be provided.");
            if (isNaN(options.retry.times)) throw new Error("Times option must be an integer.");
            if (options.retry.condition) {
                if (typeof options.retry.condition !== 'function') throw new Error("Retry condition option must be a function.");
                if (typeof options.retry.condition("") !== 'boolean') throw new Error("Retry condition option must be a function returning a boolean.");                
            }
            if (!options.retry.condition && options.retry.times) throw new Error("Retry condition must be provided if times option is specified.");
        }
        if (options.output) {
            if (typeof options.output !== 'function') throw new Error("Output option must be a function.");        
            if (typeof options.output("") !== 'string') throw new Error("Output option option must be a function returning a string.");
        }
        return true;
    }

    /**
     * Checks the validity of options for translation.
     * @param {Options} options - Options for translation.
     * @throws {Error} - Throws an error if options are invalid.
     * @returns {boolean} - Returns true if options are valid.
     */
    static checkTranslationOptions(options: ITranslationOptions): boolean {
        if (typeof options !== 'object') throw new Error("Options must be a valid object.");
        if (options.provider && !Object.keys(providers).some(key => options.provider instanceof providers[key].constructor)) throw new Error("Provider option must be valid. Try { provider: (new G4F()).providers.Translate, ... }");
        if (options.provider && options.provider.type != "Translation") throw new Error("The provider type should be 'Translation'")
        if (!options.text || options.text && options.text.trim().length == 0) throw new Error("You need to include a text for the translation.");        
        return true;
    }

    /**
     * Checks the validity of options for image generation.
     * @param {Options} options - Options for image generation.
     * @throws {Error} - Throws an error if options are invalid.
     * @returns {boolean} - Returns true if options are valid.
     */
    static checkImageGenerationOptions(options: IImageGenerationOptions): boolean {
        if (typeof options !== 'object') throw new Error("Options must be a valid object.");
        if (options.provider && !Object.keys(providers).some(key => options.provider instanceof providers[key].constructor)) throw new Error("Provider option must be valid. Try { provider: (new G4F()).providers.Emi, ... }");
        if (options.provider && options.provider.type != "ImageGeneration") throw new Error("The provider type should be 'ImageGeneration'");
        if (options.providerOptions) {
            if (typeof options.providerOptions !== 'object') throw new Error("Provider options must be a valid object.");
            for(const item of ["model", "negativePrompt", "imageStyle", "samplingMethod"] as const) 
                if (options.providerOptions[item] && typeof options.providerOptions[item] !== "string") throw new Error(`The provider option "${item}" must be a string.`);
            for(const item of ["height", "width", "samplingSteps", "cfgScale", "dpmGuidanceScale", "dpmInferenceSteps", "saGuidanceScale", "saInferenceSteps", "lcmInferenceSteps"] as const) 
                if (options.providerOptions[item] && typeof options.providerOptions[item] !== "number") throw new Error(`The provider option "${item}" must be an integer.`);            
            for(const item of ["useGpu", "promptImprovement"] as const) 
                if (options.providerOptions[item] && typeof options.providerOptions[item] !== "boolean") throw new Error(`The provider option "${item}" must be a boolean.`);            
        }
        return true;
    }
}

export default OptionsHandler;