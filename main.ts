import G4F from "./src/G4F";
import fs from "fs";

const g4f = new G4F();
(async() => {
    const base64Image = await g4f.imageGeneration("A village", { 
        provider: g4f.providers.Pixart,
        providerOptions: {
            imageStyle: 'Manga',
            height: 1200,
            width: 1200
        }
    });	
    fs.writeFile('image.jpg', base64Image, { encoding: 'base64' }, function(err) {
      if (err) {
          console.error('Error al escribir el archivo:', err);
      } else {
          console.log('La imagen se ha guardado correctamente en image.png');
      }
    });
})();