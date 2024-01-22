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
     * @returns {Promise<string>} - A promise that resolves with the generated chat result as a string.
     * @throws {Error} - Throws an error if fetching data fails.
     */
    async createAsyncGenerator(messages:IMessage[], stream:boolean, proxy?:string): Promise<string> {
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
            return handleStream(response.data, stream, this.handleResponse);       
        });
    }

    handleResponse(text:string) {
        const regEXP = /\{([^}]+)\}/;
        let matchs : RegExpMatchArray | null= text.match(regEXP);
        if (matchs && matchs[0]) {
            const outputString = matchs[0].replace(/\[\^[^\]]+\^\]\([^)]+\)/g, '');
            return (JSON.parse(outputString).message).trim();    
        }

        throw new Error("Invalid response. Please try again later.");
    }
}

export default Bing;