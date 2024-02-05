export interface IOptions {
    debug?: boolean;
    model?: string;
    provider?: any;
    stream?: boolean;
    retry?: { condition?: (text: string) => boolean, times?: number };
    output?: (text: string) => string;
    chunkSize?: number;
    proxy?: string;
}