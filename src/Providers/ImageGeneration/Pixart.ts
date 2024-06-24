import axios from 'axios';
import { IImageGenerationProviderOptions } from '../../interfaces/IImageGenerationProviderOptions';

class Pixart {
    name: string;
    type: string;
    url: string;
    default_options: IImageGenerationProviderOptions;
    need_slice_text: boolean;
    working: boolean;

    constructor() {
        this.name = "Pixart",
        this.type = "ImageGeneration";
        this.url = "https://nexra.aryahcr.cc/api/image/complements";
        this.default_options = {
            negativePrompt: "",
            imageStyle: "(No style)",
            width: 1024,
            height: 1024,
            samplingMethod: "DPM-Solver",            
            cfgScale: 4.5,
            dpmInferenceSteps: 14,
            saGuidanceScale: 3,
            saInferenceSteps: 25
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
            model: "pixart-a",
            data: {
                prompt_negative: options?.negativePrompt || this.default_options.negativePrompt,
                image_style: options?.imageStyle || this.default_options.imageStyle,
                width: options?.width || this.default_options.width,
                height: options?.height || this.default_options.height,
                sampler: options?.samplingMethod || this.default_options.samplingMethod,
                dpm_guidance_scale: options?.cfgScale || this.default_options.cfgScale,
                dpm_inference_steps: options?.dpmInferenceSteps || this.default_options.dpmInferenceSteps,
                sa_guidance_scale: options?.saGuidanceScale || this.default_options.saGuidanceScale,
                sa_inference_steps: options?.saInferenceSteps || this.default_options.saInferenceSteps
            }
        }

        return axios.post("https://nexra.aryahcr.cc/api/image/complements", data, { headers: headers })
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

export default Pixart;