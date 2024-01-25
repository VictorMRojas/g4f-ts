# G4F
GPT4FREE is a package that simplifies interaction with various Artificial Intelligence models, eliminating the need for an API Key or any other authorization method to access these chat completions and image generation models.

This package can be used in both Typescript and CommonJS/ModuleJS environments.

### Installation

Using npm:

`npm install g4f`

Using yarn:

`yarn add g4f`

## 🎯  Examples

### :tw-1f432: Basic Usage

#### Simple fetch
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

#### Give your instructions
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

#### Follow up on the conversation context
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

## :tw-270f: RESUME: Conversation roles

| Role | Description                    |
| ------------- | ------------------------------ |
| `system`      | Used for providing instructions and context prior to the conversation.       |
| `user`   | Used to identify user messages     |
| `assistant`   | Used to identify GPT messages     |

### :tw-1f432: Add configurable options

####  Basic options
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

####  Advanced options
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
[provider] » √  success   Provider found: Bing
[fetch] » √  success   [1/3] - Retry #1
[output] » √  success   Output function runtime finalized.

I'll try to create that.
Is what you asked me to say
I hope it brings you joy
And your heart it does employ 💕🌹
*/
```
**Note:** Retry will execute the fetch operation consecutively three times until it finishes, or the condition function indicates true. The output function only edits the final response.

### What is the differencie between basic options and advanced options?
If you decide to use the retry, output option, or both, keep in mind that these options involve preprocessing before delivering the ultimate response. The impact on performance and response times may vary depending on the functions you employ.

## :tw-270f: RESUME: Options
| Option | Type | Description                    |
| ------------- |------------------------------ |------------------------------ |
| `provider`    | G4F.providers.any | Choose the provider to use for chat completions.      |
| `debug`       | boolean | Enable or disable debug mode.     |
| `proxy`        | string | Specify a proxy as a URL with a string in the host:port format.     |
|  `retry`        | object | Execute the fetch operation N times in a row until it finishes or the callback function returns true. |
| `retry.times` | number | Specify the number of times the fetch operation will execute as a limit. |
| `retry.condition` | function: boolean | Callback function that receives a string as the text for each instance the fetch operation is running. This function should return a boolean. |
| `output`      | function: string | Callback function that receives a string as the final text response so you can edit it. This function executes after the retry fetch operations. This function should return a string. |
| `stream` | boolean | Determine if the data should be streamed in parts or not. |
| `chunkSize` | number | Determine the size of chunks streamed. This only works if the stream option is true and if using retry or condition. |