import GPT from "./ChatCompletion/GPT";
import ChatBase from "./ChatCompletion/ChatBase";
import Bing from "./ChatCompletion/Bing";
import TranslateAI from "./Translation/TranslateAI";
import Pixart from "./ImageGeneration/Pixart";
import PixartLCM from "./ImageGeneration/PixartLCM";
import Emi from "./ImageGeneration/Emi";
import Dalle from "./ImageGeneration/Dalle";
import DalleMini from "./ImageGeneration/DalleMini";
import Dalle2 from "./ImageGeneration/Dalle2";
import Prodia from "./ImageGeneration/Prodia";
import ProdiaStableDiffusion from "./ImageGeneration/ProdiaStableDiffusion";
import ProdiaStableDiffusionXL from "./ImageGeneration/ProdiaStableDiffusionXL";
import StableDiffusionLite from "./ImageGeneration/StableDiffusionLite";
import StableDiffusionPlus from "./ImageGeneration/StableDiffusionPlus";

interface Providers {
    [key: string]: GPT | ChatBase | Bing | TranslateAI | Pixart | PixartLCM | Emi | Dalle | DalleMini | Dalle2 | Prodia | ProdiaStableDiffusion | ProdiaStableDiffusionXL | StableDiffusionLite | StableDiffusionPlus;
}

const providers: Providers = {
    GPT: new GPT(),
    ChatBase: new ChatBase(),
    Bing: new Bing(),
    TranslateAI: new TranslateAI(),
    Pixart: new Pixart(),
    PixartLCM: new PixartLCM(),
    Emi: new Emi(),
    Dalle: new Dalle(),
    DalleMini: new DalleMini(),
    Dalle2: new Dalle2(),
    Prodia: new Prodia(),
    ProdiaStableDiffusion: new ProdiaStableDiffusion(),
    ProdiaStableDiffusionXL: new ProdiaStableDiffusionXL(),
    StableDiffusionLite: new StableDiffusionLite(),
    StableDiffusionPlus: new StableDiffusionPlus()
};

const models: { [key in keyof Providers]: string[] } = {
    GPT: [
        "gpt-4",
        "gpt-4-0613",
        "gpt-4-32k",
        "gpt-4-0314",
        "gpt-4-32k-0314",
        "gpt-3.5-turbo",
        "gpt-3.5-turbo-16k",
        "gpt-3.5-turbo-0613",
        "gpt-3.5-turbo-16k-0613",
        "gpt-3.5-turbo-0301",
        "text-davinci-003",
        "text-davinci-002",
        "code-davinci-002",
        "gpt-3",
        "text-curie-001",
        "text-babbage-001",
        "text-ada-001",
        "davinci",
        "curie",
        "babbage",
        "ada",
        "babbage-002",
        "davinci-002"
    ],
    ChatBase: ["gpt-3.5-turbo"],
    Bing: ["gpt-4"],
    Prodia: [
        "3Guofeng3_v34.safetensors [50f420de]",
        "absolutereality_V16.safetensors [37db0fc3]",
        "absolutereality_v181.safetensors [3d9d4d2b]",
        "amIReal_V41.safetensors [0a8a2e61]",
        "analog-diffusion-1.0.ckpt [9ca13f02]",
        "anythingv3_0-pruned.ckpt [2700c435]",
        "anything-v4.5-pruned.ckpt [65745d25]",
        "anythingV5_PrtRE.safetensors [893e49b9]",
        "AOM3A3_orangemixs.safetensors [9600da17]",
        "blazing_drive_v10g.safetensors [ca1c1eab]",
        "cetusMix_Version35.safetensors [de2f2560]",
        "childrensStories_v13D.safetensors [9dfaabcb]",
        "childrensStories_v1SemiReal.safetensors [a1c56dbb]",
        "childrensStories_v1ToonAnime.safetensors [2ec7b88b]",
        "Counterfeit_v30.safetensors [9e2a8f19]",
        "cuteyukimixAdorable_midchapter3.safetensors [04bdffe6]",
        "cyberrealistic_v33.safetensors [82b0d085]",
        "dalcefo_v4.safetensors [425952fe]",
        "deliberate_v2.safetensors [10ec4b29]",
        "deliberate_v3.safetensors [afd9d2d4]",
        "dreamlike-anime-1.0.safetensors [4520e090]",
        "dreamlike-diffusion-1.0.safetensors [5c9fd6e0]",
        "dreamlike-photoreal-2.0.safetensors [fdcf65e7]",
        "dreamshaper_6BakedVae.safetensors [114c8abb]",
        "dreamshaper_7.safetensors [5cf5ae06]",
        "dreamshaper_8.safetensors [9d40847d]",
        "edgeOfRealism_eorV20.safetensors [3ed5de15]",
        "EimisAnimeDiffusion_V1.ckpt [4f828a15]",
        "elldreths-vivid-mix.safetensors [342d9d26]",
        "epicrealism_naturalSinRC1VAE.safetensors [90a4c676]",
        "ICantBelieveItsNotPhotography_seco.safetensors [4e7a3dfd]",
        "juggernaut_aftermath.safetensors [5e20c455]",
        "lofi_v4.safetensors [ccc204d6]",
        "lyriel_v16.safetensors [68fceea2]",
        "majicmixRealistic_v4.safetensors [29d0de58]",
        "mechamix_v10.safetensors [ee685731]",
        "meinamix_meinaV9.safetensors [2ec66ab0]",
        "meinamix_meinaV11.safetensors [b56ce717]",
        "neverendingDream_v122.safetensors [f964ceeb]",
        "openjourney_V4.ckpt [ca2f377f]",
        "pastelMixStylizedAnime_pruned_fp16.safetensors [793a26e8]",
        "portraitplus_V1.0.safetensors [1400e684]",
        "protogenx34.safetensors [5896f8d5]",
        "Realistic_Vision_V1.4-pruned-fp16.safetensors [8d21810b]",
        "Realistic_Vision_V2.0.safetensors [79587710]",
        "Realistic_Vision_V4.0.safetensors [29a7afaa]",
        "Realistic_Vision_V5.0.safetensors [614d1063]",
        "redshift_diffusion-V10.safetensors [1400e684]",
        "revAnimated_v122.safetensors [3f4fefd9]",
        "rundiffusionFX25D_v10.safetensors [cd12b0ee]",
        "rundiffusionFX_v10.safetensors [cd4e694d]",
        "sdv1_4.ckpt [7460a6fa]",
        "shoninsBeautiful_v10.safetensors [25d8c546]",
        "theallys-mix-ii-churned.safetensors [5d9225a4]",
        "timeless-1.0.ckpt [7c4971d4]",
        "toonyou_beta6.safetensors [980f6b15]"
    ],
    ProdiaStableDiffusionXL: [
        "sd_xl_base_1.0.safetensors [be9edd61]",
        "dreamshaperXL10_alpha2.safetensors [c8afe2ef]",
        "dynavisionXL_0411.safetensors [c39cc051]",
        "juggernautXL_v45.safetensors [e75f5471]",
        "realismEngineSDXL_v10.safetensors [af771c3f]"
    ]
};
models.ProdiaStableDiffusion = [
    ...models.Prodia, 
    "v1-5-pruned-emaonly.safetensors [d7049739]", 
    "v1-5-inpainting.safetensors [21c7ab71]"
];

const imageStyles: { [key in keyof Providers]: string[] } = { 
    Pixart: [
        "(No style)", 
        "Cinematic", 
        "Photographic", 
        "Anime", 
        "Manga", 
        "Digital Art", 
        "Pixel art", 
        "Fantasy art", 
        "Neonpunk", 
        "3D Model"
    ]
};
imageStyles.PixartLCM = [ ...imageStyles.Pixart ];

const samplerMethods: { [key in keyof Providers]: string[] } = { 
    Pixart: [
        "DPM-Solver", 
        "SA-Solver"
    ],
    Prodia: [
        "Euler",
        "Euler a",
        "Heun",
        "DPM++ 2M Karras",
        "DPM++ SDE Karras",
        "DDIM"
    ],
    ProdiaStableDiffusionXL: [
        "Euler",
        "Euler a",
        "LMS",
        "Heun",
        "DPM2",
        "DPM2 a",
        "DPM++ 2S a",
        "DPM++ 2M",
        "DPM++ SDE",
        "DPM fast",
        "DPM adaptive",
        "LMS Karras",
        "DPM2 Karras",
        "DPM2 a Karras",
        "DPM++ 2S a Karras",
        "DPM++ 2M Karras",
        "DPM++ SDE Karras",        
    ]
};
samplerMethods.ProdiaStableDiffusion = [ 
    ...samplerMethods.ProdiaStableDiffusionXL, 
    "DDIM",
    "PLMS"
]

export { providers, models, imageStyles, samplerMethods };
export type { Providers };