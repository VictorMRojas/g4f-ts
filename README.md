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
    retry: {	
	/*
	Execute the fetch operation consecutively three times until 
	it finishes, or the condition function indicates true.
	*/
        times:  3,
        condition: (text) => { // Check the text response
            const  words  =  text.split(" ");
            return  words.length  >  10;
        }
    }
});

console.log(text);
/*
In the realm of words, where verses dance and rhyme,
I shall craft a poem, a moment frozen in time.
With ink as my brush, I paint a vivid scene,
Where dreams and emotions intertwine, serene.
Through lines and stanzas, I'll weave a tale,
Of love, of loss, of hope that will never fail.
So close your eyes, and let your heart unfurl,
As I conjure a poem, a gift for your soul to swirl. 💕🌹
*/

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