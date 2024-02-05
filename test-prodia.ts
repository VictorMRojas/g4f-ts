import fs from "fs";

const url = 'https://nexra.aryahcr.cc/api/image/complements';

const data = `{
    "prompt": "Amigos reunidos alrededor de una fogata en un bosque ancestral. Risas, historias y un cielo estrellado pintan un momento de conexión inolvidable bajo las sombras de las montañas.",
    "model": "prodia",
    "data": {
        "model": "absolutereality_V16.safetensors [37db0fc3]",
        "steps": 25,
        "cfg_scale": 7,
        "sampler": "DPM++ 2M Karras",
        "negative_prompt": ""
    }
}`;
(async() => {    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data,
    });

    let text:any = await response.text();
    text = text.substring(text.indexOf('{'), text.length);

    let img = JSON.parse(text);
    img = img.images[0];

    const base64Image = img.split(';base64,').pop();
    fs.writeFile('imagen.jpg', base64Image, { encoding: 'base64' }, function(err) {
      if (err) {
          console.error('Error al escribir el archivo:', err);
      } else {
          console.log('La imagen se ha guardado correctamente en imagen.jpg');
      }      
  });
})();