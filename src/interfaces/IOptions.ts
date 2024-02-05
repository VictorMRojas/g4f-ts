export interface IOptions {
    debug?: boolean;
    model?: string;
    markdown?: boolean;
    provider?: any;
    stream?: boolean;
    retry?: { condition?: (text: string) => boolean, times?: number };
    output?: (text: string) => string;
    chunkSize?: number;
    proxy?: string;
}