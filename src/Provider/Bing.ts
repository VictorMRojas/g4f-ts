import axios from 'axios';
import { IMessage } from '../interfaces/IMessage';
import { createProxyConfig } from '../util/util';
import { handleStream } from '../util/stream';

class Bing {
    name: string;
    url: string;
    supports_gpt_4_turbo: boolean;
    supports_message_history: boolean;
    working: boolean;

    constructor() {
        this.name = "Bing",
        this.url = "https://nexra.aryahcr.cc/api/chat/complements";
        this.supports_gpt_4_turbo = true;
        this.supports_message_history = true;
        this.working = true;
    }

    /**
     * Asynchronously generates a chat response based on input messages.
     * @param {Array} messages - An array of messages for the chat.
     * @param {string} proxy - Optional proxy string for additional configuration.
     * @returns {Promise<object>} - A promise that resolves with the generated chat result as a object
     * @throws {Error} - Throws an error if fetching data fails.
     */
    async createAsyncGenerator(messages:IMessage[], stream:boolean, proxy?:string): Promise<object> {
        const headers = {
            'Content-Type': 'application/json'
        }
          
        const data = {
            messages,
            "conversation_style": "Balanced",
            "markdown": false,
            "stream": stream || false,
            "model": "Bing"
        };
        
        return axios.post(this.url, data, {
            headers: headers, proxy: createProxyConfig(proxy),
            responseType: stream ? 'stream' : 'text'
        }).then(async response => {
            return handleStream({ data: response.data, name: this.name }, stream, this.handleResponse);       
        }).catch((e) => {
            if (e.message.startsWith("Invalid response.")) throw new Error(e.message);
            throw new Error("Failed to fetch data. Please try again later.");          
        });
    }

    handleResponse(text:string) {
        if (typeof text !== "string")
            throw new Error("Invalid response. Please try again later.");
        if (text.includes(`"finish":true`))
            return "";
        
        let match = text.match(/"message":"(.*?)","original":/);
        let content = match ? match[1] : null;
        return content;
    }
}

export default Bing;