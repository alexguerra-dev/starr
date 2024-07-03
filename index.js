require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { readFile, writeFile, appendFile } = require('fs').promises

const vorpal = require('vorpal')()
const axios = require('axios')

let prompt = 'pregnant woman in a bikini'
let negativePrompt = ''
let model = 'lyra'
let aspectRatio = '5:4'
let highResolution = false
let images = 1
let seed = 0
let steps = 20
let initialImageUrl = ''
let initialImageEncoded = ''
let initialImageMode = 'color'
let initialImageStrength = 50

let creations = []

const testCreationObject = {
    id: 67752,
    status: 'completed',
    prompt: 'pregnant woman in a nightgown doing the splits',
    negativePrompt: null,
    width: 768,
    height: 768,
    highResolution: false,
    seed: 1136683571,
    steps: 20,
    model: 'anime_vintage',
    initialImage: null,
    initialImageMode: null,
    initialImageStrength: null,
    createdAt: '2024-07-03T17:23:30',
    updatedAt: '2024-07-03T10:23:46',
    images: [
        {
            id: 1,
            url: 'https://tmp.starryai.com/api/67752/b2ca4271-8083-467f-869c-898e8ce92ddc.jpg',
        },
        {
            id: 2,
            url: 'https://tmp.starryai.com/api/67752/4682e701-bfe5-4cb6-8ff3-89035e87409a.jpg',
        },
    ],
    expired: false,
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

async function downloadAllImagesFromObject(creation) {
    creation.images.forEach(async (image) => {
        const response = await axios.get(image.url, {
            responseType: 'arraybuffer',
        })
        fs.writeFile(
            `images/${creation.id}-${image.id}.jpg`,
            response.data,
            (err) => {
                if (err) throw err
                console.log('Image downloaded successfully!')
            },
        )
    })
}

function updateCreations() {
    const options = {
        method: 'GET',
        url: 'https://api.starryai.com/creations/',
        headers: {
            accept: 'application/json',
            'X-API-Key': process.env.KEY,
        },
    }
    return axios
        .request(options)
        .then((response) => {
            creations = response.data
        })
        .catch((error) => {
            console.error(error)
        })
}

vorpal
    .command('creations <operation>')
    .description('Operations on creations')
    .action(function (args, callback) {
        if (args.operation === 'list') {
            updateCreations()
            creations.map((creation) => {
                this.log(creation.id, creation.prompt)
            })
        } else if (args.operation === 'update') {
            updateCreations()
        } else if (args.operation === 'display') {
            console.log(creations)
        }
        callback()
    })

vorpal
    .command('download image from id [id]', 'Downloads an image from an id.')
    .action(function (args, callback) {
        const id = 67751

        downloadAllImagesFromObject(testCreationObject)
    })

vorpal
    .command(
        'download image from object test',
        'Downloads an image from an object',
    )
    .action(function (args, callback) {
        downloadAllImagesFromObject(testCreationObject)
    })

vorpal
    .command('filter expired', 'Filters out expired creations.')
    .action(function (args, callback) {
        const self = this
        const options = {
            method: 'GET',
            url: 'https://api.starryai.com/creations/',
            headers: {
                accept: 'application/json',
                'X-API-Key': 'rsC1AH67RQgB8VEw6yz_qvzrcBB58g',
            },
        }

        axios
            .request(options)
            .then(function (response) {
                creations = response.data
                const filteredCreations = creations.filter(
                    (creation) => creation.expired === false,
                )
                console.log(filteredCreations)
                callback()
            })
            .catch(function (error) {
                console.error(error)
                callback()
            })
    })

vorpal
    .command(
        'show alive pretty',
        'Shows the alive creations in a pretty format.',
    )
    .action(function (args, callback) {
        const self = this
        const options = {
            method: 'GET',
            url: 'https://api.starryai.com/creations/',
            headers: {
                accept: 'application/json',
                'X-API-Key': 'rsC1AH67RQgB8VEw6yz_qvzrcBB58g',
            },
        }
        axios
            .request(options)
            .then(function (response) {
                creations = response.data
                const filteredCreations = creations.filter(
                    (creation) => creation.expired === false,
                )

                const prettyObject = filteredCreations.map(function (creation) {
                    return {
                        id: creation.id,
                        prompt: creation.prompt,
                    }
                })
                console.log(prettyObject)
                callback()
            })
            .catch(function (error) {
                console.error(error)
                callback()
            })
    })

vorpal
    .command('get creations', "Gets the user's creations.")
    .action(function (args, callback) {
        const self = this
        const options = {
            method: 'GET',
            url: 'https://api.starryai.com/creations/',
            headers: {
                accept: 'application/json',
                'X-API-Key': 'rsC1AH67RQgB8VEw6yz_qvzrcBB58g',
            },
        }

        axios
            .request(options)
            .then(function (response) {
                console.log(response.data)
                creations = response.data
            })
            .catch(function (error) {
                console.error(error)
            })
    })

vorpal
    .command('view payload', "Outputs the current user's payload.")
    .action(function (args, callback) {
        const payload = {
            prompt: prompt,
            negativePrompt: negativePrompt,
            model: model,
            aspectRatio: aspectRatio,
            highResolution: highResolution,
            images: images,
            steps: steps,
        }
        this.log(payload)
        callback()
    })

vorpal
    .command('write payload <prompt>', "Writes the user's payload.")
    .action(function (args, callback) {})

vorpal
    .command(
        'generate image',
        'Generates an image. Guides you through the process.',
    )
    .action(function (args, callback) {
        const self = this

        return this.prompt(
            {
                type: 'input',
                name: 'prompt',
                message: 'what do you want to generate an image of?',
            },
            function (result) {
                self.log(result)
            },
        )
    })

vorpal
    .command('hello', 'Outputs "Hello, world!".')
    .action(function (args, callback) {
        console.log('Hello, world!')
        callback()
    })

vorpal
    .command('write <filename> <content>', 'Writes content to a file.')
    .action(async function (args, callback) {
        try {
            await writeFile(args.filename, args.content)
            console.log(`Wrote ${args.content} to ${args.filename}`)
        } catch (error) {
            console.log('There was an error...')
            console.log(error)
        }
        callback()
    })

vorpal
    .command('prompt <prompt>', 'Sets the prompt.')
    .action(function (args, callback) {
        prompt = args.prompt
        callback()
    })

vorpal
    .command('user', 'Gets the current user data.')
    .action(function (args, callback) {
        const options = {
            method: 'GET',
            url: 'https://api.starryai.com/user/',
            headers: {
                accept: 'application/json',
                'X-API-Key': 'rsC1AH67RQgB8VEw6yz_qvzrcBB58g',
            },
        }

        axios
            .request(options)
            .then((response) => {
                console.log('User data:', response.data)
                callback()
            })
            .catch((error) => {
                console.log('There was an error...')
                console.log(error)
                callback()
            })
    })

vorpal
    .command('whoami', 'Outputs the current user.')
    .action(function (args, callback) {
        this.log(`You are ${process.env.USER}`)
        this.log(`Your key is ${process.env.KEY}`)
        callback()
    })

vorpal
    .command('balance', "Gets the user's balance.")
    .action(function (args, callback) {
        const options = {
            method: 'GET',
            url: 'https://api.starryai.com/user/',
            headers: {
                accept: 'application/json',
                'X-API-Key': process.env.KEY,
            },
        }

        axios
            .request(options)
            .then((response) => {
                console.log('Balance:', response.data.balance)
                callback()
            })
            .catch((error) => {
                console.log('There was an error...')
                console.log(error)
                callback()
            })
    })

vorpal
    .command('write image test', 'Tests writing an image from a url')
    .action(function (args, callback) {
        this.log('Writing image...')
        downloadImage(
            'https://tmp.starryai.com/api/67749/ef4152f9-5ea5-4bf3-9853-6446f90f2e7c.jpg',
            'images/test.jpg',
        )
    })

vorpal.delimiter('star>>>').show()
