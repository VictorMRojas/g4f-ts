import { Signale } from 'signale';
import { imageStyles, models, providers, samplerMethods} from '../Providers/ProviderList';
import { getProviderFromList, runLog } from "../util/util";
import { IImageGenerationOptions } from "../interfaces/IImageGenerationOptions";
import { IImageGenerationProviderOptions } from "../interfaces/IImageGenerationProviderOptions";

const provider_log = new Signale({ interactive: true, scope: 'provider' });
const options_log = new Signale({ interactive: true, scope: 'options' });

class ImageGenerationHandler {
    providersList: typeof providers;

    constructor() {
        this.providersList = Object.fromEntries(
            Object.entries(providers)
                .filter(([_, provider]: [string, any]) => provider.type === "ImageGeneration")
            );
    }

    /**
     * Generate an image with a determinate style.
     * @param {string} prompt - Prompt that indicates what kind of image to generate.
     * @param {IImageGenerationOptions} options - Provider Option's necessary to generate an image.
     * @returns {Promise} - Promise that resolves with the image result.
     */
    async imageGeneration(prompt: string, options?: IImageGenerationOptions): Promise<any> { 
        let { debug, provider } = options || {};
        if (!provider) provider = getProviderFromList(this.providersList, provider_log, { model: undefined, debug }); 
        else if (debug) runLog(provider_log.success, `Provider found: ${provider.name}`, true)

        if (debug && options && options.providerOptions) {
            this.notifyOptionsUnused(provider, options.providerOptions);
            if (options.providerOptions.model || options.providerOptions.imageStyle || options.providerOptions.samplingMethod) {
                options.providerOptions = this.checkProviderOptionsList(provider, options.providerOptions);
            }
        }
        if (!options) options = provider.default_options;

        if (debug) runLog(provider_log.await, `Fetching data from the provider: ${provider.name}`);
        const data = await provider.fetchData(prompt, options?.providerOptions);
        if (debug) runLog(provider_log.success, `Data was successfully fetched from the "${provider.name}" provider`, true);            
        
        return data;
    }

    notifyOptionsUnused(provider: any, providerOptions: IImageGenerationProviderOptions) {
        const validImageGenerationProviderOptions = [
            "model", // Prodia Prodia-StableDiffusion Prodia-StableDiffusion-XL
            "negativePrompt", // Pixart-A Pixart-LCM Prodia Prodia-StableDiffusion Prodia-StableDiffusion-XL
            "imageStyle", // Pixart-A Pixart-LCM 
            "height", // Pixart-A Pixart-LCM Prodia-StableDiffusion Prodia-StableDiffusion-XL
            "width", // Pixart-A Pixart-LCM Prodia-StableDiffusion Prodia-StableDiffusion-XL
            "samplingSteps", // Prodia Prodia-StableDiffusion Prodia-StableDiffusion-XL
            "samplingMethod", // Pixart-A Prodia Prodia-StableDiffusion Prodia-StableDiffusion-XL
            "cfgScale", // Prodia Prodia-StableDiffusion Prodia-StableDiffusion-XL
            "dpmGuidanceScale", // Pixart-A
            "dpmInferenceSteps", // Pixart-A
            "saGuidanceScale", // Pixart-A
            "saInferenceSteps", // Pixart-A
            "lcmInferenceSteps", // Pixart-LCM
            "useGpu", // Dalle2
            "promptImprovement" // Dalle2
        ]

        for (const providerOption of Object.keys(providerOptions)) {
            if (!validImageGenerationProviderOptions.includes(providerOption)) continue;
      
            if (!Object.keys(provider.default_options).includes(providerOption))
              runLog(options_log.warn, `The "${providerOption}" option you used isn't supported by the "${provider.name}" provider, so it's being ignored.`, true);      
          }
    }

    checkProviderOptionsList(provider: any, providerOptions: IImageGenerationProviderOptions) {
        if (provider.default_options?.model && providerOptions.model) {
            providerOptions.model = providerOptions.model.trim();
            if (!models[provider.name].includes(providerOptions.model))
                runLog(options_log.warn, `The "model" value you used it's not supported by the "${provider.name}" provider, so the default provider model "${provider.default_options?.model}" is being used instead.`, true);
        }

        if (provider.default_options?.imageStyle && providerOptions.imageStyle) { 
            providerOptions.imageStyle = providerOptions.imageStyle.trim();
            if (!imageStyles[provider.name].includes(providerOptions.imageStyle))
                runLog(options_log.warn, `The "imageStyle" value you used it's not supported by the "${provider.name}" provider, so the default provider image style "${provider.default_options?.imageStyle}" is being used instead.`, true);
        }

        if (provider.default_options?.samplingMethod && providerOptions.samplingMethod) {
            providerOptions.samplingMethod = providerOptions.samplingMethod.trim();
            if (!samplerMethods[provider.name].includes(providerOptions.samplingMethod)) 
                runLog(options_log.warn, `The "samplingMethod" value you used it's not supported by the "${provider.name}" provider, so the default provider sampling method "${provider.default_options?.samplingMethod}" is being used instead.`, true);
        }

        return providerOptions;
    }
}

export { ImageGenerationHandler as default }