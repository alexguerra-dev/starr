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

let creations = {}



async function downloadImage(url, filename) {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    // const path = path.join(__dirname, filename)
    console.log(path)
    fs.writeFile(filename, response.data, (err) => {
        if (err) throw err
        console.log('Image downloaded successfully!')
    })
}

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
    .command('creations')
    .option('-n, --number', 'The number of creations.')
    .option('-j, --json', 'Output as JSON.')
    .option('-o, --output <file>', 'Output to a file.')
    .option('-a, --all', 'Output all creations.')
    .option('-l, --latest', 'Output the latest creation.')
    .option('-w, --alive', 'Output the creations that are alive.')
    .description("Gets the user's creations.")
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

        if (args.options.number) {
            axios
                .request(options)
                .then(function (response) {
                    creations = response.data
                    console.log(creations.length)
                })
                .catch(function (error) {
                    console.error(error)
                })
        } else {
            axios
                .request(options)
                .then(function (response) {
                    creations = response.data
                    console.log(creations)
                    callback()
                })
                .catch(function (error) {
                    console.error(error)
                    callback()
                })
        }
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

vorpal.command('foo', 'Outputs "bar".').action(function (args, callback) {
    this.log('bar')
    callback()
})

vorpal
    .command('whoami', 'Outputs the current user.')
    .action(function (args, callback) {
        this.log(process.env.KEY)
        this.log(process.env.USER)
        callback()
    })

vorpal
    .command('write image test', 'Tests writing an image from a url')
    .action(function (args, callback) {
        this.log('Writing image...')
        downloadImage(
            'https://tmp.starryai.com/api/67749/ef4152f9-5ea5-4bf3-9853-6446f90f2e7c.jpg',
            `${}.jpg`,
        )
    })

vorpal.delimiter('star>>>').show()
