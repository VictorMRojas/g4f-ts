import { IImageGenerationProviderOptions } from "./IImageGenerationProviderOptions";

export interface IImageGenerationOptions {
    debug?: boolean;
    provider?: any;
    providerOptions?: IImageGenerationProviderOptions
}