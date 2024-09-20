const bwipjs = require('bwip-js')
const { error } = require('console')
const fs = require('fs')
const path = require('path')

const generarCodBarras = async (codigo, rutaPng) => {
    try {
        await bwipjs.toBuffer({
            bcid: 'code128',
            text: { codigo },
            scale: 3,
            height: 10,
            includetext: true,
            textxalign: 'center'
        }, (error, png) => {
            if (error) {
                throw error
            }

            fs.writeFileSync(rutaPng, png)
        })
        console.log(`Creado y guardado en ${ rutaPng }`);
    } catch (err) { 
        console.error(`Error al generar codigo de barras: ${err}`)
    }
}

module.exports = generarCodBarras