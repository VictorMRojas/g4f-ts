import axios, { AxiosResponse } from 'axios';
import { IMessage } from '../interfaces/IMessage';
import { createProxyConfig, generateRandomId } from '../util/util';
import { handleStream } from '../util/stream';

class ChatBase {
    name: string;
    url: string;
    supports_gpt_35_turbo: boolean;
    supports_message_history: boolean;
    wrong_responses: Array<string>;
    working: boolean;

    constructor() {
        this.name = "ChatBase";
        this.url = "https://www.chatbase.co";
        this.supports_gpt_35_turbo = true;
        this.supports_message_history = true;
        this.wrong_responses = ["support@chatbase.co"];
        this.working = true;
    }

    /**
     * Asynchronously generates a chat response based on input messages.
     * @param {Array} messages - An array of messages for the chat.
     * @param {string} proxy - Optional proxy string for additional configuration.
     * @returns {Promise<string>} - A promise that resolves with the generated chat result as a string.
     * @throws {Error} - Throws an error if fetching data fails.
     */
    async createAsyncGenerator(messages:IMessage[], stream:boolean, proxy?:string): Promise<object> {
        const chat_id: string = 'z2c2HSfKnCTh5J4650V0I';

        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
            "Accept": "*/*",
            "Accept-language": "en,fr-FR;q=0.9,fr;q=0.8,es-ES;q=0.7,es;q=0.6,en-US;q=0.5,am;q=0.4,de;q=0.3",
            "Origin": this.url,
            "Referer": `${this.url}/`,
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
        };

        const defaultSystemMessage = { // Necessary to avoid issues when fetching, especially with cloned messages objects.
            role: "system",
            content: `You're an OpenAI assistant". [${generateRandomId(5)}]`,
        };
        messages.unshift(defaultSystemMessage);

        const data = {
            "messages": messages,
            "captchaCode": "hadsa",
            "chatId": chat_id,
            "conversationId": `kcXpqEnqUie3dnJlsRi_O-${chat_id}`
        };

        return axios.post("https://www.chatbase.co/api/fe/chat", data, { 
            headers: headers, proxy: createProxyConfig(proxy),
            responseType: stream ? 'stream' : 'text'
        }).then((response:AxiosResponse) => {         
            return handleStream({ data: response.data, name: this.name }, stream, this.handleResponse);       
        }).catch((e) => {
            if (e.message.startsWith("Invalid response.")) throw new Error(e.message);
            throw new Error("Failed to fetch data. Please try again later.");          
        });
    }

    handleResponse(text:any) {
        return text;
    }
}

export default ChatBase;