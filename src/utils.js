require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { readFile, writeFile, appendFile } = require('fs').promises

const vorpal = require('vorpal')()
const axios = require('axios')

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

async function updateUserData(userData) {
    const options = {
        method: 'GET',
        url: 'https://api.starryai.com/user/',
        headers: {
            accept: 'application/json',
            'X-API-Key': process.env.KEY,
        },
    }

    try {
        let response = await axios
            .request(options)
            .then((response) => {
                userData = response.data
            })
            .catch((error) => {
                console.error(error)
            })
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

async function downloadAllImagesFromObject(creation) {
    creation.images.forEach(async (image) => {
        const response = await axios.get(image.url, {
            responseType: 'arraybuffer',
        })
        fs.writeFile(
            `data/images/${creation.id}-${image.id}.jpg`,
            response.data,
            (err) => {
                if (err) throw err
                console.log('Image downloaded successfully!')
            },
        )
    })
}

async function downloadImage(url, filename) {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    // const path = path.join(__dirname, filename)
    console.log(path)
    fs.writeFile(filename, response.data, (err) => {
        if (err) throw err
        console.log('Image downloaded successfully!')
    })
}

module.exports = {
    downloadImage,
    aspectRatios,
    models,
    updateUserData,
    downloadAllImagesFromObject,
}
