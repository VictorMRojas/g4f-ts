export interface IOptions {
    debug?: boolean;
    provider?: any;
    stream?: boolean;
    retry?: { condition?: (text: string) => boolean, times?: number };
    output?: (text: string) => string;
    chunkSize?: number;
    proxy?: string;
}