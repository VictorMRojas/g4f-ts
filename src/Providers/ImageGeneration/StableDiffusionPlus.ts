import axios from 'axios';
import { IImageGenerationProviderOptions } from '../../interfaces/IImageGenerationProviderOptions';

class StableDiffusionPlus {
    name: string;
    type: string;
    url: string;
    default_options: IImageGenerationProviderOptions;
    need_slice_text: boolean;
    working: boolean;

    constructor() {
        this.name = "StableDiffusionPlus",
        this.type = "ImageGeneration";
        this.url = "https://nexra.aryahcr.cc/api/image/complements";
        this.default_options = {
            negativePrompt: "",
            saGuidanceScale: 9,
        }
        this.need_slice_text = false;
        this.working = true;
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
            model: "stablediffusion-2.1",
            data: {
                prompt_negative: options?.negativePrompt || this.default_options.negativePrompt,
                guidance_scale: options?.saGuidanceScale || this.default_options.saGuidanceScale
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

export default StableDiffusionPlus;