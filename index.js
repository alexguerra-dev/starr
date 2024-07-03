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
let userData = {}

vorpal
    .command('creations <operation>')
    .description('Operations on creations list, update, display.')
    .option('-n, --number', 'The number of creations.')
    .option('-a, --active', 'Output all active creations.')
    .option('-l, --long', 'Outputs the long version of the creations.')
    .option('-j, --json', 'Output as JSON.')
    .option('-o, --output <file>', 'Output to a file.')
    .action(function (args, callback) {
        updateCreations()

        if (args.operation === 'list') {
            if (args.options.active) {
                const activeCreations = creations.filter(
                    (creation) => creation.expired === false,
                )

                this.log(
                    activeCreations.map((creation) => {
                        this.log(creation.id, creation.prompt)
                    }),
                )
            } else {
                creations.map((creation) => {
                    this.log(creation.id, ' --- ', creation.prompt)
                })
            }
        } else if (args.operation === 'update') {
            updateCreations()
        } else if (args.operation === 'display') {
            this.log(creations)
        }
        callback()
    })

vorpal
    .command('creation <id> [operation]')
    .option('-j, --json', 'Output as JSON.')
    .description('Thigs todo with a creation. Get, download, etc.')
    .action(function (args, callback) {
        const creation = creations.find((creation) => creation.id === args.id)
        this.log(args.options.output)
        if (creation) {
            if (args.operation === 'download') {
                downloadAllImagesFromObject(creation)
            }

            if (args.options.json) {
                this.log(creation)
            } else {
                this.log(creation.id, ' --- ', creation.prompt)
            }
        } else {
            this.log('No creation with that id.')
        }
        callback()
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
    .option('-b, --balance', 'Get the user balance.')
    .option('-e, --email', 'Get the user email.')
    .option('-i, --id', 'Get the user id.')
    .option('-k, --key', 'Get the user key.')
    .action(function (args, callback) {
        const options = {
            method: 'GET',
            url: 'https://api.starryai.com/user/',
            headers: {
                accept: 'application/json',
                'X-API-Key': 'rsC1AH67RQgB8VEw6yz_qvzrcBB58g',
            },
        }

        const userData = axios
            .request(options)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error
            })

        if (args.options.balance) {
            userData.then((data) => {
                this.log(data.balance)
            })
        } else if (args.options.email) {
            userData.then((data) => {
                this.log(data.email)
            })
        } else if (args.options.id) {
            userData.then((data) => {
                this.log(data.id)
            })
        } else if (args.options.key) {
            this.log(process.env.KEY)
        } else {
            userData.then((data) => {
                this.log(data)
            })
        }
        callback()
    })

updateUserData()

updateCreations()

vorpal.delimiter('⭐ >>>').show()

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

function updateUserData() {
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
            userData = response.data
        })
        .catch((error) => {
            console.error(error)
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
