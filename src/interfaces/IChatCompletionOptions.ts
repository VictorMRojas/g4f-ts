export interface IChatCompletionOptions {
    debug?: boolean;
    model?: string;
    provider?: any;
    stream?: boolean;
    retry?: { condition?: (text: string) => boolean, times?: number };
    output?: ( text: string ) => string;
    conversationStyle?: string;
    markdown?: boolean;
    chunkSize?: number;
    proxy?: string;
}