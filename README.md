# G4F
GPT4FREE is a package that simplifies interaction with various Artificial Intelligence models, eliminating the need for an API Key or any other authorization method to access these chat completions and image generation models.

This package can be used in both Typescript and CommonJS/ModuleJS environments.

## 📚 Table of Contents
- [🛠️ Installation](#installation)
    + [Using NPM](#using-npm)
    + [Using yarn](#using-yarn)
- [🎯 Examples](#examples)
    + [📤 Chat completion](#chat-completion)    
        - [⚙️ Basic usage](#basic-usage)
            + [Simple fetch](#simple-fetch)
            + [Give your instructions](#give-your-instructions)
            + [Follow up on the conversation context](#follow-up-on-the-conversation-context)
        - [✏️ RESUME: Conversation roles](#resume-conversation-roles)
        - [🔩 Add configurable options](#add-configurable-options)
            + [Basic Options](#basic-options)
            + [Advanced Options](#advanced-options)
            + [What's the difference?](#whats-the-difference)
        - [📝 Streaming](#streaming)
            + [Basic usage](#basic-streaming-usage)
            + [How to handle streamable data?](#how-to-handle-streamable-data)
            + [Stream on postprocessing](#stream-on-postprocessing)
        - [✏️ RESUME: Configurable options](#resume-configurable-options)
        - [🚀 Chat completion providers](#chat-completion-providers)
        - [📚 Chat completion models](#models)
    + [📡 Translation](#translation)
        - [Usage](#translation-usage)
        - [Options](#translation-options)
        - [Languages supported](#translation-langs)
    + [📷 Image Generation (BETA)](#image-generation)
        - [Cartoon style example](#cartoon-style-example)  
        - [Paint style example](#paint-style-example)
        - [Realistic style example](#realistic-style-example)
        - [✏️ RESUME: Image generation options](#image-generation-options)
        - [✏️ RESUME: Image generation provider options](#image-generation-provider-options)
        - [🤖 Image generation models](#image-generation-models)
        - [🎨 Image generation styles](#image-generation-styles)
        - [✒️ Image generation sampling methods](#image-generation-sampling-methods)
        - [🧮 Number type options](#image-generation-number-type-options)
        - [🖼️ Image generation providers](#list-providers-image-generation)
        - [⚠️ Advice](#image-generation-advice)        
+ [🤝 Contribute](#contribute)

<a id="installation"></a>
## 🛠️ Installation

<a id="using-npm"></a>
### Using npm:

`npm install g4f`

<a id="using-yarn"></a>
### Using yarn:

`yarn add g4f`

<br>

<a id="examples"></a>
# 🎯 Examples

<a id="chat-completion"></a>
## 📤 Chat completion
With the chatCompletion function, you will be able to obtain a textual response to a conversation with some context, using providers and models designed for this task. In addition, you will be able to manipulate the answer before converting it to a stream or force the AI to give you a certain answer by generating several retries.

<a id="basic-usage"></a>
## ⚙️ Basic usage

<a id="simple-fetch"></a>

## Simple fetch
It will capture the messages and the context, and any provider will respond with a string.
```js
const { G4F } = require("g4f");
const g4f = new G4F();
const messages = [
    { role: "user", content: "Hi, what's up?"}
];
g4f.chatCompletion(messages).then(console.log);
// Hello! I'm here to help you with anything you need. What can I do for you today? 😊
```
**Note:** The conversation needs to include at least one message with the role **user** to provide a proper answer.

<a id="give-your-instructions"></a>

## Give your instructions
You can provide your own instructions for the conversation before it starts using the **system** role.
```js
const { G4F } = require("g4f");
const g4f = new G4F();
const messages = [
    { role: "system", content: "You're an expert bot in poetry."},
    { role: "user", content: "Hi, write me something."}
];
g4f.chatCompletion(messages).then(console.log);
/*
Sure, I can write you a poem. Here is a short one: 
The Wind:
The wind is a curious thing,
It can make you dance and sing,
It can make you feel alive,
And help you thrive.
...
*/
```
<a id="follow-up-on-the-conversation-context"></a>

## Follow up on the conversation context
```js
const { G4F } = require("g4f");
const g4f = new G4F();
const messages = [
    { role: "system", content: "You're a math teacher."},
    { role: "user", content: "How much is 2 plus 2?" },
    { role: "assistant", content: "2 plus 2 equals 4." },
    { role: "user", content: "You're really good at math!" },
    { role: "assistant", content: "Thank you! I'm glad I could help you with your math question." },
    { role: "user", content: "What was the first question I asked you?" }
];

g4f.chatCompletion(messages).then(console.log);
// The first question you asked me was "How much is 2 plus 2?".
```
**Note:** AI responses use the **assistant** role and an appropriate conversation structure alternates between the user and the assistant, as seen in the previous example.

<a id="resume-conversation-roles"></a>

## ✏️ RESUME: Conversation roles

| Role          | Description                                                            |
| ------------- | ---------------------------------------------------------------------- |
| `system`      | Used for providing instructions and context prior to the conversation. |
| `user`        | Used to identify user messages                                         |
| `assistant`   | Used to identify AI messages                                           |

<a id="add-configurable-options"></a>

## 🔩 Add configurable options

<a id="basic-options"></a>

## Basic options
You can select any provider, model, debug mode and a proxy URL if you want.
```js
const { G4F } = require("g4f");
const g4f = new G4F();
const messages = [
    { role: "user", content: "Hi, what's up?"}
];
const options = {
    provider: g4f.providers.GPT,
    model: "gpt-3.5-turbo",
    debug: true,
    proxy: ""
};

(async() => {
	const text = await g4f.chatCompletion(messages, options);	
	console.log(text);
})();
/*
[provider] » √  success   Provider found: GPT
[model] » √  success   Using the model: gpt-3.5-turbo
[provider] » √  success   Data was successfully fetched from the GPT provider

In the realm of words, where verses dance and rhyme,
I shall craft a poem, a moment frozen in time.
With ink as my brush, I paint a vivid scene,
Where dreams and emotions intertwine, serene.
Through lines and stanzas, I'll weave a tale,
Of love, of loss, of hope that will never fail.
So close your eyes, and let your heart unfurl,
As I conjure a poem, a gift for your soul to swirl. 💕🌹
*/
```
**Note:** You can specify the provider, model, debug, and proxy options according to your needs; they are entirely optional.

<a id="advanced-options"></a>

##  Advanced options
You can force an expected response using retry, and manipulate the final response using output.
```js
const { G4F } = require("g4f");
const g4f = new G4F();
const messages = [
    { role: "system", content: "You're an expert bot in poetry."},
    { role: "user", content: "Let's see, write a single paragraph-long poem for me." },
];
const options = {
    model: "gpt-4",
    debug: true,
	retry: {
        times: 3,
        condition: (text) => {
            const words = text.split(" ");
            return words.length > 10;
        }
    },
    output: (text) => {
        return text + " 💕🌹";
    }
};

(async() => {
    const text = await g4f.chatCompletion(messages, options);	
    console.log(text);
})();
/* 
[provider] » √  success   Provider found: GPT
[model] » √  success   Using the model: gpt-4
[fetch] » √  success   [1/3] - Retry #1
[output] » √  success   Output function runtime finalized.

I'll try to create that.
Is what you asked me to say
I hope it brings you joy
And your heart it does employ 💕🌹
*/
```
**Note:** Retry will execute the fetch operation consecutively N times until it finishes, or the condition function indicates true. The output function only edits the final response.

<a id="whats-the-difference"></a>

## What is the difference between basic options and advanced options?
If you decide to use the retry, output option, or both, keep in mind that these options involve preprocessing before delivering the ultimate response. The impact on performance and response times may vary depending on the functions you employ.

<a id="streaming"></a>

## 📝 Streaming
When using the stream option, the chatCompletion function will return an object with the streamable data and the name of the provider.

<a id="basic-streaming-usage"></a>

##  Basic usage
```js
const { G4F } = require("g4f");
const g4f = new G4F();
const messages = [
    { role: "system", content: "You're an expert bot in poetry."},
    { role: "user", content: "Let's see, write a single paragraph-long poem for me." },
];
const options = {
    provider: g4f.providers.ChatBase,
    stream: true
};

(async() => {
    const response = await g4f.chatCompletion(messages, options);	
    console.log(response);
})();
/*
{ 
    data: <ref *1> BrotliDecompress { ... }, 
    name: "ChatBase" 
}
*/
```

<a id="how-to-handle-streamable-data"></a>

## So, how you should handle the streamable data?
I **highly recommend** you to use the integrated chunkProcessor function so that you don't have to format each chunk into a single string format response.
```js
const { G4F, chunkProcessor } = require("g4f");
const g4f = new G4F();
const messages = [
    { role: "system", content: "You're an expert bot in poetry."},
    { role: "user", content: "Let's see, write a single paragraph-long poem for me." },
];
const options = {
    provider: g4f.providers.ChatBase,
    stream: true
};

(async() => {
    const response = await g4f.chatCompletion(messages, options);
    let text = "";
    for await (const chunk of chunkProcessor(response)) {
        text += chunk;
    }
    console.log(text);
})();
/* 
I'll try to create that.
To keep your worries at bay.
A smile on your face,
And a heart full of grace.
*/
```

<a id="stream-on-postprocessing"></a>

##  Stream on postprocessing
When employing retry, output option, or both, you have the flexibility to select the size of each streamed chunk.
```js
const { G4F, chunkProcessor } = require("g4f");
const g4f = new G4F();
const messages = [
    { role: "system", content: "You're an expert bot in poetry."},
    { role: "user", content: "Let's see, write a single paragraph-long poem for me." },
];
const options = {
    provider: g4f.providers.Bing,
    stream: true,
    chunkSize: 15,
    retry: {
        times: 3,
        condition: (text) => {
            const words = text.split(" ");
            return words.length > 10;
        }
    },
    output: (text) => {
        return text + " 💕🌹";
    }
};

(async() => {
    const response = await g4f.chatCompletion(messages, options);
    for await (const chunk of chunkProcessor(response)) {
        console.log(chunk);    
    }
})();
/*
I'll try to cre
ate that. 
  Is what you a
sked me to say
n    I hope it
brings you joy
n    And makes
your heart feel
 gay 💕🌹
*/
```
**Note:** The chunkSize feature is effective only when the stream option is activated along with the retry/output option.

<a id="resume-configurable-options"></a>

## ✏️ RESUME: Configurable options
| Option        | Type                          | Description                    |
| ------------- | ------------------------------ | -------------------------------- |
| `provider`    | g4f.providers.any | Choose the provider to use for chat completions.      |
| `model`       | string | Choose the model to use by a provider that supports it |
| `debug`       | boolean | Enable or disable debug mode.     |
| `proxy`       | string | Specify a proxy as a URL with a string in the host:port format.     |
|  `retry`      | object | Execute the fetch operation N times in a row until it finishes or the callback function returns true. |
| `retry.times` | number | Specify the number of times the fetch operation will execute as a limit. |
| `retry.condition` | function: boolean | Callback function that receives a string as the text for each instance the fetch operation is running. This function should return a boolean. |
| `output`      | function: string | Callback function that receives a string as the final text response so you can edit it. This function executes after the retry fetch operations. This function should return a string. |
| `stream` | boolean | Determine if the data should be streamed in parts or not. |
| `chunkSize` | number | Determine the size of chunks streamed. This only works if the stream option is true and if using retry or condition. |

<a id="chat-completion-providers"></a>

## 🚀 Chat completion providers 
| Website | Provider | GPT-3.5 | GPT-4 | Stream | Status |
| ------  | -------  | ------- | ----- | ------ | ------ |
| [GPT.ai](https://chatgpt.ai) | `g4f.providers.GPT` | ✔️ | ✔️ | ❌ | ![Active](https://img.shields.io/badge/Active-brightgreen) |
| [chatbase.co](https://www.chatbase.co) | `g4f.providers.ChatBase` | ✔️ | ❌ | ✔️ | ![Active](https://img.shields.io/badge/Active-brightgreen) |
| [bing.com](https://bing.com/chat) | `g4f.providers.Bing` | ❌ | ✔️ | ✔️ | ![Active](https://img.shields.io/badge/Inactive-red) |

<a id="models"></a>

## 📚 Chat completion models
| Model                  | Providers that support it                   |
| ---------------------- | ------------------------------------------- |
| gpt-4                  | `g4f.providers.GPT`, `g4f.providers.Bing`     |
| gpt-4-0613             | `g4f.providers.GPT`                          |
| gpt-4-32k              | `g4f.providers.GPT`                          |
| gpt-4-0314             | `g4f.providers.GPT`                          |
| gpt-4-32k-0314         | `g4f.providers.GPT`                          |
| gpt-3.5-turbo          | `g4f.providers.GPT`, `g4f.providers.ChatBase` |
| gpt-3.5-turbo-16k      | `g4f.providers.GPT`                          |
| gpt-3.5-turbo-0613     | `g4f.providers.GPT`                          |
| gpt-3.5-turbo-16k-0613 | `g4f.providers.GPT`                          |
| gpt-3.5-turbo-0301     | `g4f.providers.GPT`                          |
| text-davinci-003       | `g4f.providers.GPT`                          |
| text-davinci-002       | `g4f.providers.GPT`                          |
| code-davinci-002       | `g4f.providers.GPT`                          |
| gpt-3                  | `g4f.providers.GPT`                          |
| text-curie-001         | `g4f.providers.GPT`                          |
| text-babbage-001       | `g4f.providers.GPT`                          |
| text-ada-001           | `g4f.providers.GPT`                          |
| davinci                | `g4f.providers.GPT`                          |
| curie                  | `g4f.providers.GPT`                          |
| babbage                | `g4f.providers.GPT`                          |
| ada                    | `g4f.providers.GPT`                          |
| babbage-002            | `g4f.providers.GPT`                          |
| davinci-002            | `g4f.providers.GPT`                          |

<br><br>
<a id="translation"></a>

# 📡 Translation
With the translation function, you can convert a text to a target language using AI.

<a id="translation-usage"></a>

## Usage
```js
const { G4F } = require("g4f");

const g4f = new G4F();
const options = {
    text: "Hello World",
    source: "en",
    target: "ko"
};

(async() => {
    const text = await g4f.translation(options);
    console.log(text);
})();
/* 
{
  source: { code: 'en', lang: 'English' },
  target: { code: 'ko', lang: '한국어' },
  translation: { parts: [ [Object] ], result: '안녕하세요 세계' }
}
*/
```
**Note:** You need to identify the language source ID and included it by your own, in the future
this will be solved with AI, and you wouldn't need to specify it.

<a id="translation-options"></a>

## ✏️ RESUME: Translation options
| Option         | Type              | Required | Description                                  |
| -------------- | ----------------- | -------- | -------------------------------------------- |
| `provider`     | g4f.providers.any |    ❌    | Choose the provider to use for translations. |
| `debug`        | boolean           |    ❌    | Enable or disable debug mode.                |
| `text`         | string            |    ✔️    | Specify the text to translate                |
| `source`       | string            |    ✔️    | Specify the source text language.            |
| `target`       | string            |    ✔️    | Specify the target language to translate.    |

<a id="translation-langs"></a>

## 🌏 Languages available
| Provider    | Status                                                     | Languages supported        |
| ----------- | ---------------------------------------------------------- | -------------------------- |
| `g4f.providers.TranslateAI` | ![Active](https://img.shields.io/badge/Active-brightgreen) | https://rentry.co/3qi3wqnr |

<br><br>
<a id="image-generation"></a>

# 📷 Image generation (BETA)
With the imageGeneration function, you will be able to generate images from a text input and optional parameters that will provide you with millions of combinations to stylize each of the images.

<a id="cartoon-style-example"></a>
<br>

## Cartoon style example
```js
const { G4F } = require("g4f");
const fs = require("fs");

const g4f = new G4F();
(async() => {
    const base64Image = await g4f.imageGeneration("A squirrel", { 
        debug: true,
        provider: g4f.providers.Emi
    });	
    fs.writeFile('image.jpg', base64Image, { encoding: 'base64' }, function(err) {
      if (err) return console.error('Error writing the file: ', err);
      console.log('The image has been successfully saved as image.jpg.');
    });
})();
```
![An squirrel cartoon style from the Emi provider](https://i.imgur.com/6tdGNys.jpeg)

<a id="paint-style-example"></a>
<br>

## Paint style example
```js
const { G4F } = require("g4f");
const fs = require("fs");

const g4f = new G4F();
(async() => {
    const base64Image = await g4f.imageGeneration("A village", { 
        debug: true,
        provider: g4f.providers.Pixart,
        providerOptions: {
            height: 512,
            width: 512,
            samplingMethod: "SA-Solver"
        }
    });	
    fs.writeFile('image.jpg', base64Image, { encoding: 'base64' }, function(err) {
      if (err) return console.error('Error writing the file: ', err);
      console.log('The image has been successfully saved as image.jpg.');
    });
})();
```
![A village paint from the Pixart provider](https://i.imgur.com/pNor1oU.jpg)

<a id="realistic-style-example"></a>
<br>

## Realistic style example
```js
const { G4F } = require("g4f");
const fs = require("fs");

const g4f = new G4F();
(async() => {
    const base64Image = await g4f.imageGeneration("A colorfull photo of a young lady", { 
        debug: true,
        provider: g4f.providers.Prodia,
        providerOptions: {
            model: "ICantBelieveItsNotPhotography_seco.safetensors [4e7a3dfd]",
            samplingSteps: 15,
            cfgScale: 30
        }
    });	
    fs.writeFile('image.jpg', base64Image, { encoding: 'base64' }, function(err) {
      if (err) return console.error('Error writing the file: ', err);
      console.log('The image has been successfully saved as image.jpg.');
    });
})();
```
![A photo of a young lady in realistic style from the Prodia provider](https://i.imgur.com/Kc3qRiA.png)

<a id="image-generation-options"></a>

## ✏️ RESUME: Image generation options
| Option          | Type              | Description                                       |
| --------------- | ----------------- | ------------------------------------------------- |
| debug           | boolean           | Enable or disable debug mode.                     |
| provider        | g4f.providers.any | Choose the provider to use for image generations. |
| providerOptions | object            | Use provider options supported by any provider    |

**Note:** The value of providerOptions should be an object containing instructions for image generation, such as the base model, image style, sampling methods, among others. **Not all providers support the same instructions, so refer to the following list.**

<a id="image-generation-provider-options"></a>

## ✏️ RESUME: Image generation provider options
| Option            | Type    | Description | Limits | Providers that support it                         |
| ---------------   | ------- | ------ | ---- |------------------------------------------------- |
| model             | string  | Choose a model as a base for generation. | [🤖 Check lists](#image-generation-models) |`Prodia`, `ProdiaStableDiffusion`, `ProdiaStableDiffusionXL` |
| negativePrompt    | string  | Indicate the provider of what not to do. | None | `Pixart`, `PixartLCM`, `Prodia`, `ProdiaStableDiffusion`, `ProdiaStableDiffusionXL` |
| imageStyle        | string  | Specify the draw style.  | [🎨 Check lists](#image-generation-styles) | `Pixart`, `PixartLCM` |
| height            | number  | Specify the image height. | [🧮 Check lists](#image-generation-number-type-options) |`Pixart`, `PixartLCM`, `ProdiaStableDiffusion`, `ProdiaStableDiffusionXL` |
| width             | number  | Specify the image width. | [🧮 Check lists](#image-generation-number-type-options) | `Pixart`, `PixartLCM`, `ProdiaStableDiffusion`, `ProdiaStableDiffusionXL` |
| samplingSteps     | number  | Specify the number of iterations. A higher number results in more quality. | [🧮 Check lists](#image-generation-number-type-options) | `Prodia`, `ProdiaStableDiffusion`, `ProdiaStableDiffusionXL` |
| samplingMethod    | string  | Choose a sampling method to control the diversity, quality, and coherence of images. | [✒️ Check lists](#image-generation-sampling-methods) | `Pixart`, `Prodia`, `ProdiaStableDiffusion`, `ProdiaStableDiffusionXL` |
| cfgScale          | number  | Specify the Classifier-Free Guidance to control how closely the generated image adheres to the given text prompt. | [🧮 Check lists](#image-generation-number-type-options) | `Pixart` `Prodia`, `ProdiaStableDiffusion`, `ProdiaStableDiffusionXL` |
| dpmInferenceSteps | number  | Specify the DPM Inference Steps for refining object detection accuracy  | [🧮 Check lists](#image-generation-number-type-options) | `Pixart` |
| saGuidanceScale   | number  | Specify the Style-Aware Guidance Scale for fine-tuning style and composition | [🧮 Check lists](#image-generation-number-type-options) | `Pixart` |
| saInferenceSteps  | number  | Specify the Style-Aware Inference Steps for refining or adjusting the generated image during style transfer or style-based image synthesis. |  [🧮 Check lists](#image-generation-number-type-options) | `Pixart` |
| lcmInferenceSteps | number  | Specify the LCM Inference Steps for enhancing the generation of images with AI by leveraging latent consistency models | [🧮 Check lists](#image-generation-number-type-options) | `PixartLCM` |
| useGpu            | boolean | Determine whether to use the GPU for generation | None | `Dalle2` |
| promptImprovement | boolean | Determine whether the prompt should be enhanced using AI. |None | `Dalle2` |

<a id="image-generation-models"></a>

## 🤖 Image generation models
| Provider                                 | Models supported           |
| ---------------------------------------- | -------------------------- |
| `Prodia`                   | https://rentry.co/b6i53fnm |
| `ProdiaStableDiffusion`    | https://rentry.co/pfwmx6y5 |
| `ProdiaStableDiffusionXL`  | https://rentry.co/wfhsk8sv |

<a id="image-generation-styles"></a>

## 🎨 Image generation styles
| Provider  | Image styles supported     |
| --------- | -------------------------- |
| `Pixart`    | https://rentry.co/hcggg36n |
| `PixartLCM` | https://rentry.co/gzxa3wv2 |

<a id="image-generation-sampling-methods"></a>

## ✒️ Image generation sampling methods
| Provider                               | Sampling methods supported |
| -------------------------------------- | -------------------------- |
| `Pixart`                  | https://rentry.co/x7i8gko9 |
| `Prodia`                  | https://rentry.co/8bwtqeh9 |
| `ProdiaStableDiffusion`   | https://rentry.co/iyrkxmzr |
| `ProdiaStableDiffusionXL` | https://rentry.co/p2ad6y3f |

<a id="image-generation-number-type-options"></a>

## 🧮 Number type options
| Provider                                | Number type options and values supported |
| --------------------------------------- | ---------------- |
| `Pixart`                  | <table><tr>    <th>Option</th>    <th style="text-align: center;">Default</th>    <th style="text-align: center;">Min</th>    <th style="text-align: center;">Max</th></tr><tr>    <td>height</td>    <td style="text-align: center;">1024</td>    <td style="text-align: center;">256</td>    <td style="text-align: center;">2048</td></tr><tr>    <td>width</td>    <td style="text-align: center;">1024</td>    <td style="text-align: center;">256</td>    <td style="text-align: center;">2048</td></tr><tr>    <td>dpmInferenceSteps</td>    <td style="text-align: center;">14</td>    <td style="text-align: center;">5</td>    <td style="text-align: center;">40</td></tr><tr>    <td>saGuidanceScale</td>    <td style="text-align: center;">3</td>    <td style="text-align: center;">1</td>    <td style="text-align: center;">10</td></tr><tr>    <td>saInferenceSteps</td>    <td style="text-align: center;">25</td>    <td style="text-align: center;">10</td>    <td style="text-align: center;">40</td></tr> <tr>    <td>cfgScale</td>    <td style="text-align: center;">4.5</td>    <td style="text-align: center;">1</td>    <td style="text-align: center;">10</td></tr></table> |
| `PixartLCM`               | <table><tr>    <th>Option</th>    <th style="text-align: center;">Default</th>    <th style="text-align: center;">Min</th>    <th style="text-align: center;">Max</th></tr><tr>    <td>height</td>    <td style="text-align: center;">1024</td>    <td style="text-align: center;">256</td>    <td style="text-align: center;">2048</td></tr><tr>    <td>width</td>    <td style="text-align: center;">1024</td>    <td style="text-align: center;">256</td>    <td style="text-align: center;">2048</td></tr><tr>    <td>lcmInferenceSteps</td>    <td style="text-align: center;">9</td>    <td style="text-align: center;">1</td>    <td style="text-align: center;">30</td></tr></table> |
| `Prodia`                  | <table><tr>    <th>Option</th>    <th style="text-align: center;">Default</th>    <th style="text-align: center;">Min</th>    <th style="text-align: center;">Max</th></tr><tr>    <td>samplingSteps</td>    <td style="text-align: center;">7</td>    <td style="text-align: center;">0</td>    <td style="text-align: center;">20</td></tr><tr>    <td>cfgScale</td>    <td style="text-align: center;">25</td>    <td style="text-align: center;">1</td>    <td style="text-align: center;">30</td></tr></table> |
| `ProdiaStableDiffusion`   | <table><tr>    <th>Option</th>    <th style="text-align: center;">Default</th>    <th style="text-align: center;">Min</th>    <th style="text-align: center;">Max</th></tr><tr>    <td>height</td>    <td style="text-align: center;">512</td>    <td style="text-align: center;">50</td>    <td style="text-align: center;">1024</td></tr><tr>    <td>width</td>    <td style="text-align: center;">512</td>    <td style="text-align: center;">50</td>    <td style="text-align: center;">1024</td></tr><tr>    <td>samplingSteps</td>    <td style="text-align: center;">25</td>    <td style="text-align: center;">1</td>    <td style="text-align: center;">30</td></tr><tr>    <td>cfgScale</td>    <td style="text-align: center;">7</td>    <td style="text-align: center;">1</td>    <td style="text-align: center;">20</td></tr></table> |
| `ProdiaStableDiffusionXL` | <table><tr>    <th>Option</th>    <th style="text-align: center;">Default</th>    <th style="text-align: center;">Min</th>    <th style="text-align: center;">Max</th></tr><tr>    <td>height</td>    <td style="text-align: center;">1024</td>    <td style="text-align: center;">512</td>    <td style="text-align: center;">1536</td></tr><tr>    <td>width</td>    <td style="text-align: center;">1024</td>    <td style="text-align: center;">512</td>    <td style="text-align: center;">1536</td></tr><tr>    <td>samplingSteps</td>    <td style="text-align: center;">25</td>    <td style="text-align: center;">1</td>    <td style="text-align: center;">30</td></tr><tr>    <td>cfgScale</td>    <td style="text-align: center;">7</td>    <td style="text-align: center;">1</td>    <td style="text-align: center;">20</td></tr></table> |

<a id="list-providers-image-generation"></a>

## 🖼️ Image generation providers
| Provider                               | Status   | Default style |
| -------------------------------------- | :------: | ------------- |
| `Pixart`                  | ![Active](https://img.shields.io/badge/Active-brightgreen) | Realistic with a touch of exaggeration, characterized by detailed textures, vibrant colors, and enhanced features. | 
| `PixartLCM`               | ![Active](https://img.shields.io/badge/Active-brightgreen) | Exhibits a detailed and vibrant use of color, creating a visually rich and textured representation. It’s a blend of realism with a touch of artistic interpretation. |
| `Emi`                     | ![Active](https://img.shields.io/badge/Active-brightgreen) | Characterized by a colorful and whimsical animation, reminiscent of a children’s storybook illustration. |
| `Dalle`                   | ![Active](https://img.shields.io/badge/Active-brightgreen) | Realistic, capturing intricate details and textures to depict a lifelike representation. |
| `DalleMini`               | ![Active](https://img.shields.io/badge/Active-brightgreen) | Leans towards the abstract, with a digital artistry touch that emphasizes detailed textures and vibrant colors. It captures the essence of the subject through the use of shape, color, and form rather than attempting to represent it accurately. |
| `Dalle2`                  | ![Active](https://img.shields.io/badge/Active-brightgreen) | Characterized by its semi-realism, with a focus on fine details, vivid colors, and natural lighting. |
| `Prodia`                  | ![Active](https://img.shields.io/badge/Active-brightgreen) | Can be described as “photorealistic”. This term refers to artwork that is extremely detailed and lifelike, closely resembling a high-resolution photograph. |
| `ProdiaStableDiffusion`   | ![Active](https://img.shields.io/badge/Active-brightgreen) | Photorealistic, capturing intricate details and textures to mimic the appearance of a real-life scene. |
| `ProdiaStableDiffusionXL` | ![Active](https://img.shields.io/badge/Active-brightgreen) | Semi-realistic, meticulously incorporating fine details and textures to emulate the semblance of a real-world scenario. |

<a id="image-generation-advice"></a>

# ⚠️ Advice
It's important to review the possibilities that each provider offers within their limitations, in order to access more detailed creations. However, it's possible that at some point you might combine options that are not supported by the provider you're using at that moment. In such cases the image generation won't stop; instead (and as long as you're using the debug option), you'll receive a warning alerting you to the error.

<a id="contribute"></a>

# 🤝 Contribute
If you want to add your touch to this project, you can do so by contributing directly to the [GitHub](https://github.com/VictorMRojas/g4f-ts). Also, if you ever encounter an error that prevents you from using any functionality of the project, [be the first to report it](https://github.com/VictorMRojas/g4f-ts/issues), and that will help this community that seeks to access AI for free!