import axios from 'axios';
import { IImageGenerationProviderOptions } from '../../interfaces/IImageGenerationProviderOptions';

class ProdiaStableDiffusionXL {
    name: string;
    type: string;
    url: string;
    default_options: IImageGenerationProviderOptions;
    need_slice_text: boolean;
    working: boolean;

    constructor() {
        this.name = "ProdiaStableDiffusionXL",
        this.type = "ImageGeneration";
        this.url = "https://nexra.aryahcr.cc/api/image/complements";
        this.default_options = {
            negativePrompt: "",
            model: "sd_xl_base_1.0.safetensors [be9edd61]",
            width: 1024,
            height: 1024,
            samplingMethod: "DPM++ 2M Karras",
            samplingSteps: 25,
            cfgScale: 7
        }
        this.need_slice_text = false;
        this.working = false;
    }

    /**
     * Generate an image with a determinate style.
     * @param {string} prompt - Prompt that indicates what kind of image to generate.
     * @param {IImageGenerationProviderOptions} options - Provider Option's necessary to generate an image.
     * @returns {Promise} - Promise that resolves with the image result.
     * @throws {Error} - Throws an error if fetching data fails.
     */
    async fetchData(prompt: string, options?:IImageGenerationProviderOptions): Promise<object> {
        const headers = { 'Content-Type': 'application/json' }
        
        const data = {
            prompt,
            model: "prodia-stablediffusion-xl",
            data: {
                prompt_negative: options?.negativePrompt || this.default_options.negativePrompt,
                model: options?.model || this.default_options.model,
                width: options?.width || this.default_options.width,
                height: options?.height || this.default_options.height,
                sampling_method: options?.samplingMethod || this.default_options.samplingMethod,
                sampling_steps: options?.samplingSteps || this.default_options.samplingSteps,
                cfg_scale: options?.cfgScale || this.default_options.cfgScale
            }
        }

        return axios.post(this.url, data, { headers: headers })
        .then(async response => {
            return this.handleResponse(response.data);       
        }).catch((e) => {
            if (e.message.startsWith("Invalid response.")) throw new Error(e.message);
            throw new Error("Failed to fetch data. Please try again later.");
        });
    }

    handleResponse(text:any) {
        text = text.substring(text.indexOf('{'), text.length);
        let img = JSON.parse(text);
        img = img.images[0].split(';base64,').pop();
        return img;
    }
}

export default ProdiaStableDiffusionXL;