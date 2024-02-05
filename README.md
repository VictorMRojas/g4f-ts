# G4F
GPT4FREE is a package that simplifies interaction with various Artificial Intelligence models, eliminating the need for an API Key or any other authorization method to access these chat completions and image generation models.

This package can be used in both Typescript and CommonJS/ModuleJS environments.

### Installation

Using npm:

`npm install g4f`

Using yarn:

`yarn add g4f`

## 🎯  Examples

## ⚙️ Basic Usage

## Simple fetch
It will capture the messages and the context, and any provider will respond with a string.
```js
const { G4F } = require("g4f");
const GPT = new G4F();
const messages = [
	{ role: "user", content: "Hi, what's up?"}
];
GPT.chatCompletion(messages).then(console.log);
// Hello! I'm here to help you with anything you need. What can I do for you today? 😊
```
**Note:** The conversation needs to include at least one message with the role **user** to provide a proper answer.

## Give your instructions
You can provide your own instructions for the conversation before it starts using the **system** role.
```js
const { G4F } = require("g4f");
const GPT = new G4F();
const messages = [
	{ role: "system", content: "You're an expert bot in poetry."},
	{ role: "user", content: "Hi, write me something."}
];
GPT.chatCompletion(messages).then(console.log);
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

## Follow up on the conversation context
```js
const { G4F } = require("g4f");
const GPT = new G4F();
const messages = [
	{ role: "system", content: "You're a math teacher."},
	{ role: "user", content: "How much is 2 plus 2?" },
    { role: "assistant", content: "2 plus 2 equals 4." },
    { role: "user", content: "You're really good at math!" },
    { role: "assistant", content: "Thank you! I'm glad I could help you with your math question." },
    { role: "user", content: "What was the first question I asked you?" }
];

GPT.chatCompletion(messages).then(console.log);
// The first question you asked me was "How much is 2 plus 2?".
```
**Note:** GPT responses use the **assistant** role and an appropriate conversation structure alternates between the user and the assistant, as seen in the previous example.

## ✏️ RESUME: Conversation roles

| Role | Description                    |
| ------------- | ------------------------------ |
| `system`      | Used for providing instructions and context prior to the conversation.       |
| `user`   | Used to identify user messages     |
| `assistant`   | Used to identify GPT messages     |

## ⚙️ Add configurable options

##  Basic options
You can select any provider, debug mode and a proxy URL if you want.
```js
const { G4F } = require("g4f");
const GPT = new G4F();
const messages = [
	{ role: "user", content: "Hi, what's up?"}
];
const options = {
	provider: GPT.providers.ChatBase,
	debug: true, 
	proxy: ""
};

(async() => {
	const text = await GPT.chatCompletion(messages, options);	
	console.log(text);
})();
/*
[provider] » √  success   Provider found: ChatBase
[provider] » √  success   Data fetched succesfully for the ChatBase provider

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
**Note:** You can specify the provider, debug, and proxy options according to your needs; they are entirely optional.

##  Advanced options
You can force an expected response using retry, and manipulate the final response using output.
```js
const { G4F } = require("g4f");
const GPT = new G4F();
const messages = [
	{ role: "system", content: "You're an expert bot in poetry."},
    { role: "user", content: "Let's see, write a single paragraph-long poem for me." },
];
const options = {
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
	const text = await GPT.chatCompletion(messages, options);	
	console.log(text);
})();
/* 
[provider] » √  success   Provider found: GPT
[fetch] » √  success   [1/3] - Retry #1
[output] » √  success   Output function runtime finalized.

I'll try to create that.
Is what you asked me to say
I hope it brings you joy
And your heart it does employ 💕🌹
*/
```
**Note:** Retry will execute the fetch operation consecutively N times until it finishes, or the condition function indicates true. The output function only edits the final response.

## What is the difference between basic options and advanced options?
If you decide to use the retry, output option, or both, keep in mind that these options involve preprocessing before delivering the ultimate response. The impact on performance and response times may vary depending on the functions you employ.

## ⚙️ Streaming
When using the stream option, the chatCompletion function will return an object with the streamable data and the name of the provider.

##  Basic usage
```js
const { G4F } = require("g4f");
const GPT = new G4F();
const messages = [
	{ role: "system", content: "You're an expert bot in poetry."},
    { role: "user", content: "Let's see, write a single paragraph-long poem for me." },
];
const options = {
    provider: GPT.providers.ChatBase,
    stream: true
};

(async() => {
	const response = await GPT.chatCompletion(messages, options);	
	console.log(response);
})();
/*
{ 
    data: <ref *1> BrotliDecompress { ... }, 
    name: "ChatBase" 
}
*/
```

## So, how you should handle the streamable data?
I **highly recommend** you to use the integrated chunkProcessor function so that you don't have to format each chunk into a single string format response.
```js
const { G4F, chunkProcessor } = require("g4f");
const GPT = new G4F();
const messages = [
	{ role: "system", content: "You're an expert bot in poetry."},
    { role: "user", content: "Let's see, write a single paragraph-long poem for me." },
];
const options = {
    provider: GPT.providers.ChatBase,
    stream: true
};

(async() => {
	const response = await GPT.chatCompletion(messages, options);	
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

##  Stream on postprocessing
When employing retry, output option, or both, you have the flexibility to select the size of each streamed chunk.
```js
const { G4F, chunkProcessor } = require("g4f");
const GPT = new G4F();
const messages = [
	{ role: "system", content: "You're an expert bot in poetry."},
    { role: "user", content: "Let's see, write a single paragraph-long poem for me." },
];
const options = {
    provider: GPT.providers.ChatBase,
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
	const response = await GPT.chatCompletion(messages, options);	
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

## ✏️ RESUME: Configurable Options
| Option        | Type                          | Description                    |
| ------------- | ------------------------------ | -------------------------------- |
| `provider`    | G4F.providers.any | Choose the provider to use for chat completions.      |
| `model`       | G4F.models.any | Choose the model to use by a provider that supports it |
| `debug`       | boolean | Enable or disable debug mode.     |
| `proxy`       | string | Specify a proxy as a URL with a string in the host:port format.     |
|  `retry`      | object | Execute the fetch operation N times in a row until it finishes or the callback function returns true. |
| `retry.times` | number | Specify the number of times the fetch operation will execute as a limit. |
| `retry.condition` | function: boolean | Callback function that receives a string as the text for each instance the fetch operation is running. This function should return a boolean. |
| `output`      | function: string | Callback function that receives a string as the final text response so you can edit it. This function executes after the retry fetch operations. This function should return a string. |
| `stream` | boolean | Determine if the data should be streamed in parts or not. |
| `chunkSize` | number | Determine the size of chunks streamed. This only works if the stream option is true and if using retry or condition. |

## 📚 Models
| Model                  | Providers that support it                   |
| ---------------------- | ------------------------------------------- |
| gpt-4                  | `G4F.provider.GPT`, `G4F.provider.Bing`     |
| gpt-4-0613             | `G4F.provider.GPT`                          |
| gpt-4-32k              | `G4F.provider.GPT`                          |
| gpt-4-0314             | `G4F.provider.GPT`                          |
| gpt-4-32k-0314         | `G4F.provider.GPT`                          |
| gpt-3.5-turbo          | `G4F.provider.GPT`, `G4F.provider.ChatBase` |
| gpt-3.5-turbo-16k      | `G4F.provider.GPT`                          |
| gpt-3.5-turbo-0613     | `G4F.provider.GPT`                          |
| gpt-3.5-turbo-16k-0613 | `G4F.provider.GPT`                          |
| gpt-3.5-turbo-0301     | `G4F.provider.GPT`                          |
| text-davinci-003       | `G4F.provider.GPT`                          |
| text-davinci-002       | `G4F.provider.GPT`                          |
| code-davinci-002       | `G4F.provider.GPT`                          |
| gpt-3                  | `G4F.provider.GPT`                          |
| text-curie-001         | `G4F.provider.GPT`                          |
| text-babbage-001       | `G4F.provider.GPT`                          |
| text-ada-001           | `G4F.provider.GPT`                          |
| davinci                | `G4F.provider.GPT`                          |
| curie                  | `G4F.provider.GPT`                          |
| babbage                | `G4F.provider.GPT`                          |
| ada                    | `G4F.provider.GPT`                          |
| babbage-002            | `G4F.provider.GPT`                          |
| davinci-002            | `G4F.provider.GPT`                          |

<br></br>
## 🚀 Providers 
| Website | Provider | GPT-3.5 | GPT-4 | Stream | Status | Auth |
| ------  | -------  | ------- | ----- | ------ | ------ | ---- |
| [GPT](https://chatgpt.ai) | `g4f.Provider.GPT` | ✔️ | ✔️ | ❌ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
| [www.chatbase.co](https://www.chatbase.co) | `GPT.Provider.ChatBase` | ✔️ | ❌ | ✔️ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
| [bing.com](https://bing.com/chat) | `g4f.Provider.Bing` | ❌ | ✔️ | ✔️ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ❌ |

<br></br>
## 📰 TODO
- [ ] Add stream support to providers that don't have it natively
- [ ] Implement WEB-UI
- [ ] Implement more providers
	- [ ] Stable-diffusion
	- [ ] Pixart
	- [ ] DALLE-E
	- [ ] Prodia
	- [ ] Emi
	- [ ] AI Chat
	- [ ] Translate