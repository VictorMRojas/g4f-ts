import axios from 'axios';
import { IMessage } from '../../interfaces/IMessage';
import { createProxyConfig } from '../../util/util';
import { handleStream } from '../../util/stream';

class Geek {
    name: string;
    url: string;
    supports_gpt_4_turbo: boolean;
    supports_message_history: boolean;
    need_slice_text: boolean;
    working: boolean;

    constructor() {
        this.name = "Geek",
        this.url = "https://chat.geekgpt.org";        
        this.supports_gpt_4_turbo = true;
        this.supports_message_history = true;
        this.need_slice_text = true;
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

        const model = "gpt-4";

        const headers = {
            'authority': 'ai.fakeopen.com',
            'accept': '*/*',
            'accept-language': 'en,fr-FR;q=0.9,fr;q=0.8,es-ES;q=0.7,es;q=0.6,en-US;q=0.5,am;q=0.4,de;q=0.3',
            'authorization': 'Bearer pk-this-is-a-real-free-pool-token-for-everyone',
            'content-type': 'application/json',
            'origin': 'https://chat.geekgpt.org',
            'referer': 'https://chat.geekgpt.org/',
            'sec-ch-ua': '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
          };
          
          const data = {
            'messages': messages,
            'model': model || "gpt-3.5-turbo",
            'temperature': 0,
            'presence_penalty': 0,
            'top_p': 0,
            'frequency_penalty':0,
            'stream': stream || false,
        };
        
        return axios.post("https://ai.fakeopen.com/v1/chat/completions", data, {
            headers: headers, proxy: createProxyConfig(proxy),
            responseType: stream ? 'stream' : 'text'
        }).then(async response => {
                  return handleStream({ data: response.data, name: this.name }, stream, this.handleResponse);       
        }).catch((e) => {
                console.log(e);
            if (e.message.startsWith("Invalid response.")) throw new Error(e.message);
            throw new Error("Failed to fetch data. Please try again later.");          
        });
    }

    handleResponse(text:string) {
        console.log(text);
        const jsonObject = JSON.parse(text);
        const lastChoice = jsonObject.choices[jsonObject.choices.length - 1].message.content;
        return lastChoice;
      }
}

export default Geek;