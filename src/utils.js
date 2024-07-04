require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { readFile, writeFile, appendFile } = require('fs').promises

const axios = require('axios')

async function downloadImage(url, filename) {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    // const path = path.join(__dirname, filename)
    console.log(path)
    fs.writeFile(filename, response.data, (err) => {
        if (err) throw err
        console.log('Image downloaded successfully!')
    })
}

let seed = 0

let initialImageUrl = ''
let initialImageEncoded = ''
let initialImageMode = 'color'
let initialImageStrength = 50

const aspectRatios = [
    'square',
    'landscape',
    'smallPortrait',
    'portrait',
    'wide',
]

const models = [
    'lyra',
    'hydra',
    'fantasy',
    'portrait',
    'inpunk',
    'abstractWorld',
    'anime',
    'argo',
    'cinematic',
    'photography',
    'scifi',
    'detailedIllustration',
    '3dIllustration',
    'flatIllustration',
    'realvisxl',
    'stylevisionxl',
    'animaginexl',
    'anime_2',
    'anime_stylized',
    'anime_vintage',
    'pixelart',
]
let payload = {
    prompt: 'pregnant woman in a bikini',
    negativePrompt: '',
    model: 'lyra',
    aspectRatio: '5:4',
    highResolution: false,
    images: 1,
    steps: 20,
}

const templatePayload = {
    prompt: 'pregnant woman in underwear',
    negativePrompt: 'ugly',
    model: models[4],
    aspectRatio: aspectRatios[3],
    highResolution: false,
    images: 1,
    steps: 20,
}
module.exports = {
    downloadImage,
    aspectRatios,
    models,
    templatePayload,
}
