import axios from 'axios';
import { ITranslationOptions } from '../../interfaces/ITranslationOptions';
import { supported_langs } from '../../assets/translate_supported_langs'

class TranslateAI {
    name: string;
    type: string;
    url: string;
    supported_langs: string[];
    need_slice_text: boolean;
    working: boolean;

    constructor() {
        this.name = "TranslateAI",
        this.type = "Translation";
        this.url = "https://nexra.aryahcr.cc/api/translate/";
        this.supported_langs = supported_langs;
        this.need_slice_text = false;        
        this.working = true;
    }

    /**
     * Translates text to a target language.
     * @param {Options} options - Options for translation (optional).
     * @returns {Promise<object>} - Promise that resolves with the translation result.
     * @throws {Error} - Throws an error if fetching data fails.
     */
    async fetchData(options:ITranslationOptions): Promise<object> {
        const headers = {
            'Content-Type': 'application/json'
        }            

        const data = {
            text: options.text,
            source: options.source,
            target: options.target
        };
        
        return axios.post(this.url, data, { headers: headers })
        .then(async response => {
            return this.handleResponse(response.data);       
        }).catch((e) => {
            if (e.message.startsWith("Invalid response.")) throw new Error(e.message);
            throw new Error("Failed to fetch data. Please try again later.");
        });
    }

    handleResponse(data:any) {
        if (!data) throw new Error("Invalid response.");        
        return { source: data.source, target: data.target, translation: data.translate };
    }
}

export default TranslateAI;