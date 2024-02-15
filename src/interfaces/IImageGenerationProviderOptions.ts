export interface IImageGenerationProviderOptions {
    model?: string; // Prodia ProdiaStableDiffusion ProdiaStableDiffusion-XL
    negativePrompt?: string; // Pixart PixartLCM Prodia ProdiaStableDiffusion ProdiaStableDiffusionXL
    imageStyle?: string; // Pixart PixartLCM 
    height?: number; // Pixart PixartLCM ProdiaStableDiffusion ProdiaStableDiffusionXL
    width?: number; // Pixart PixartLCM ProdiaStableDiffusion ProdiaStableDiffusionXL
    samplingSteps?: number; // Prodia ProdiaStableDiffusion ProdiaStableDiffusionXL
    samplingMethod?: string; // Pixart Prodia ProdiaStableDiffusion ProdiaStableDiffusionXL
    cfgScale?: number; // Prodia ProdiaStableDiffusion ProdiaStableDiffusionXL
    dpmGuidanceScale?: number; // Pixart
    dpmInferenceSteps?: number; // Pixart
    saGuidanceScale?: number; // Pixart
    saInferenceSteps?: number; // Pixart
    lcmInferenceSteps?: number; // PixartLCM
    useGpu?: boolean; // Dalle2
    promptImprovement?: boolean; // Dalle2
}