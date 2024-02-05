import fs from "fs";

const url = 'https://nexra.aryahcr.cc/api/image/complements';

const data = `{
    "prompt": "Un paisaje urbano bañado por el atardecer, donde los tonos cálidos del sol se reflejan en los edificios modernos y en el cielo naranja y morado. En primer plano, hay un grupo de amigos reunidos en un tejado, riendo y disfrutando del momento. Sus expresiones reflejan alegría y complicidad mientras se abrazan y se señalan algo en el horizonte. La escena está envuelta en un aura nostálgica y emotiva que transmite la belleza de la amistad y la calidez del ocaso en una ciudad futurista con toques de estilo anime.",
    "model": "pixart-a",
    "data": {
        "prompt_negative": "",
        "sampler": "DPM-Solver",
        "image_style": "Anime",
        "width": 1024,
        "height": 1024,
        "dpm_guidance_scale": 4.5,
        "dpm_inference_steps": 14,
        "sa_guidance_scale": 3,
        "sa_inference_steps": 25
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