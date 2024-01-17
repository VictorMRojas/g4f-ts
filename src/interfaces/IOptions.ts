export interface IOptions {
    debug?: boolean;
    provider?: any;
    retry?: { condition?: (text: string) => boolean, times?: number };
    output?: (text: string) => string;
    proxy?: string;
}