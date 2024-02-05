import axios from 'axios';
import { IMessage } from '../interfaces/IMessage';
import { createProxyConfig } from '../util/util';
import { handleStream } from '../util/stream';
import { IOptions } from '../interfaces/IOptions';

class GPT {
    name: string;
    url: string;
    default_model: string;
    supports_message_history: boolean;
    need_slice_text: boolean;
    working: boolean;

    constructor() {
        this.name = "GPT",
        this.default_model = "gpt-4",
        this.url = "https://nexra.aryahcr.cc/api/chat/gpt";        
        this.supports_message_history = true;
        this.need_slice_text = true;
        this.working = true;
    }

    /**
     * Asynchronously generates a chat response based on input messages.
     * @param {Array} messages - An array of messages for the chat.
     * @param {IOptions} options - Options for chat generation (optional).
     * @returns {Promise<object>} - A promise that resolves with the generated chat result as a object
     * @throws {Error} - Throws an error if fetching data fails.
     */
    async createAsyncGenerator(messages:IMessage[], options:IOptions): Promise<object> {
        const headers = {
            'Content-Type': 'application/json'
        }
          
        const data = {
            messages,
            "prompt": messages[messages.length - 1].content,
            model: options.model || "gpt-4",
            markdown: false
        };
        
        return axios.post(this.url, data, {
            headers: headers, proxy: createProxyConfig(options.proxy),
            responseType: options.stream ? 'stream' : 'text'
        }).then(async response => {
            return handleStream({ data: response.data, name: this.name }, options.stream || false, this.handleResponse);       
        }).catch((e) => {
            if (e.message.startsWith("Invalid response.")) throw new Error(e.message);
            throw new Error("Failed to fetch data. Please try again later.");
        });
    }

    handleResponse(text:string) {
        const obj = JSON.parse(text);
        if (!obj || !obj.gpt) throw new Error("Invalid response.");
        return obj.gpt;
    }
}

export default GPT;