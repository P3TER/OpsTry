const bwipjs = require('bwip-js');
const fs = require('fs').promises;
const path = require('path');

const generarCodBarras = async (codigo, rutaPng) => {
    try {
        const dir = path.dirname(rutaPng);
        await fs.mkdir(dir, { recursive: true });

        const png = await bwipjs.toBuffer({
            bcid: 'code128',
            text: codigo,
            scale: 3,
            height: 10,
            includetext: true,
            textxalign: 'center'
        });

        await fs.writeFile(rutaPng, png);
        console.log(`Código de barras creado y guardado en ${rutaPng}`);
    } catch (err) {
        console.error(`Error al generar código de barras: ${err}`);
        throw err;
    }
};

module.exports = generarCodBarras;