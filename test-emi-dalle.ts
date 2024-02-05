import fs from "fs";

const url = 'https://nexra.aryahcr.cc/api/image/complements';

//"model": "dalle"
const data = `{
    "prompt": "Una ardilla con una metralleta",
    "model": "emi"
}`;
(async() => {    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data,
    });

    const text:any = await response.text();
    const matchs = text.match(/\{(.*?)\}/);

    let img = JSON.parse(matchs[0]);
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