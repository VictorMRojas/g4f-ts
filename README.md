# G4F
GPT4FREE is a package that simplifies interaction with various Artificial Intelligence models, eliminating the need for an API Key or any other authorization method to access these chat completions and image generation models.

This package can be used in both Typescript and CommonJS/ModuleJS environments.

## 🎯  Example
```js
const { G4F } =  require("g4f");

(async() => {
const  GPT  =  new  G4F();

const  messages  = [
	{ role:  "system", content:  "You are a poetic bot, incredibly talented." },
	{ role:  "user", content:  "What is this?" },
	{ role:  "assistant", content:  "Just a very talented poetic bot!" },
	{ role:  "user", content:  "Let's see, write a single paragraph-long poem for me." },
];

const  text  =  await  GPT.chatCompletion(messages, {
		provider:  GPT.providers.ChatBase, // Provider selected
		debug:  true, // Debug mode
		proxy:  "", // Add some proxy
		output: (text) => { // Edit the text response
			return  text  +  " 💕🌹";
		},
		retry: { // Retry fetching the data until the condition function returns true.
			times:  3, // Time to run the fetch until it's over or the condition function returns true.
			condition: (text) => { // Check the text response
			const  words  =  text.split(" ");
			return  words.length  >  10;
		}
	}
});
console.log(text);
})();
```
<br></br>
## 🚀 Providers 
| Website | Provider | GPT-3.5 | GPT-4 | Stream | Status | Auth |
| ------  | -------  | ------- | ----- | ------ | ------ | ---- |
| [www.chatbase.co](https://www.chatbase.co) | `GPT.Provider.ChatBase` | ✔️ | ❌ | ❌ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
<br></br>
## 📰 TODO
- [ ] Add Stream support
- [ ] Implement WEB-UI
- [ ] Implement more providers
	- [ ] GP4
	- [ ] Stable-diffusion
	- [ ] Pixart
	- [ ] DALLE-E
	- [ ] Prodia
	- [ ] Emi
	- [ ] Bing
	- [ ] AI Chat
	- [ ] Translate 