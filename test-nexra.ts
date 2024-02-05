const axios = require('axios');

axios.post('https://nexra.aryahcr.cc/api/chat/gpt', {
    messages: [
        {
            role: "assistant",
            content: "¡Hola! ¿Cómo estás hoy?"
        },
        {
            role: "user",
            content: "Hola, mi nombre es Yandri"
        },
        {
            role: "assistant",
            content: "¡Hola, Yandri! ¿Cómo estás hoy?"
        }
    ],
    prompt: "¿Puedes repetir mi nombre?",
    model: "GPT-4",
    markdown: false
}, {
    headers: {
        'Content-Type': 'application/json'
    }
}).then(response => {
    let err:any = null;
    let result:any = null;

    if((typeof response.data).toString().toLowerCase() === "Object".toLowerCase()){
        if(response.data.code != undefined && response.data.code != null && response.data.code === 200 && response.data.status != undefined && response.data.status != null && response.data.status === true){
            result = response.data;
            err = null;
        } else {
            result = null;
            err = response.data;
        }
    } else {
        let js:any = null;
        let count:any = -1;
        for(let i = 0; i < response.data.length; i++){
            if(count <= -1){
                if(response.data[i] === "{"){
                    count = i;
                }
            } else {
                break;
            }
        }

        if(count <= -1){
            err = {
                "code": 500,
                "status": false,
                "error": "INTERNAL_SERVER_ERROR",
                "message": "general (unknown) error"
            };
            result = null;
        } else {
            try {
                js = response.data.slice(count);
                js = JSON.parse(js);
                if(js != undefined && js != null && js.code != undefined && js.code != null && js.code === 200 && js.status != undefined && js.status != null && js.status === true){
                    result = js;
                    err = null;
                } else {
                    err = js;
                    result = null;
                }
            } catch(e){
                err = {
                    "code": 500,
                    "status": false,
                    "error": "INTERNAL_SERVER_ERROR",
                    "message": "general (unknown) error"
                };
                result = null;
            }
        }
    }

    if(result === null && err != null){
        console.log(err);
    } else {
        console.log(result);
    }
}).catch(error => {
    console.error('Error:', error);
});