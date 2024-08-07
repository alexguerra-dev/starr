require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { readFile, writeFile, appendFile } = require('fs').promises

const vorpal = require('vorpal')()
const axios = require('axios')

const utils = require('./utils')

// Data structures to hold the data from the API.
let creations = []
let userData = {}

vorpal
    .command('hello', 'Outputs hello world.')
    .action(function (args, callback) {
        const options = {
            method: 'GET',
            url: 'https://api.starryai.com/creations/',
            headers: {
                accept: 'application/json',
                'X-API-Key': process.env.KEY,
            },
        }

        axios
            .request(options)
            .then((response) => {
                console.log('hi ')
                console.log(response.data)
                creations = response.data
            })
            .catch((error) => {
                console.error(error)
            })

        console.log('This is the value of the creations', creations)

        callback()
    })

// Commands for the CLI
vorpal
    .command('creations [operation]')
    .description('Operations on creations list, update, display.')
    .option('-n, --number', 'The number of creations.')
    .option('-a, --active', 'Output all active creations.')
    .option('-l, --long', 'Outputs the long version of the creations.')
    .option('-j, --json', 'Output as JSON.')
    .option('-o, --output <file>', 'Output to a file.')
    .action(function (args, callback) {
        const options = {
            method: 'GET',
            url: 'https://api.starryai.com/creations/',
            headers: {
                accept: 'application/json',
                'X-API-Key': process.env.KEY,
            },
        }

        axios
            .request(options)
            .then((response) => {
                creations = response.data
            })
            .catch((error) => {
                console.error(error)
            })

        if (args.options.json) {
            this.log(creations)
        } else if (args.options.output) {
        } else if (args.options.active) {
            const activeCreations = creations.filter(
                (creation) => creation.expired === false,
            )
            this.log('Active Creations:\n')
            this.log(
                activeCreations.map((creation) => {
                    this.log(creation.id, ': ', creation.prompt)
                }),
            )
        } else {
            this.log(creations)
        }

        // this.log(creations)

        callback()
        // this.log(creations)
        // const activeCreations = creations.filter(
        //     (creation) => creation.expired === false,
        // )

        // this.log('Active Creations:\n')

        // this.log(
        //     activeCreations.map((creation) => {
        //         this.log(creation.id, ': ', creation.prompt)
        //     }),
        // )

        // if (args.operation === 'list') {
        //     if (args.options.active) {
        //         const activeCreations = creations.filter(
        //             (creation) => creation.expired === false,
        //         )

        //         this.log(
        //             activeCreations.map((creation) => {
        //                 this.log(creation.id, creation.prompt)
        //             }),
        //         )
        //     } else {
        //         creations.map((creation) => {
        //             this.log(creation.id, ' --- ', creation.prompt)
        //         })
        //     }
        // } else if (args.operation === 'update') {
        //     updateCreations()
        // } else if (args.operation === 'display') {
        //     this.log(creations)
        // } else {
        //     const activeCreations = creations.filter(
        //         (creation) => creation.expired === false,
        //     )

        //     this.log('Active Creations:\n')

        //     this.log(
        //         activeCreations.map((creation) => {
        //             this.log(creation.id, ': ', creation.prompt)
        //         }),
        //     )
        // }
        // callback()
    })

vorpal
    .command('creation <id> [operation]')
    .option('-j, --json', 'Output as JSON.')
    .description('Things todo with a creation. Get, download, etc.')
    .action(function (args, callback) {
        const creation = creations.find((creation) => creation.id === args.id)
        this.log(args.options.output)
        if (creation) {
            if (args.operation === 'download') {
                utils.downloadAllImagesFromObject(creation)
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
    .command('payload <operation> [values]')
    .option('-p, --prompt <prompt>', 'The prompt.')
    .option('-n, --negativePrompt <negativePrompt>', 'The negative prompt.')
    .option('-m, --model <model>', 'The model.')
    .option('-a, --aspectRatio', 'The aspect ratio.')
    .option('-h, --highResolution', 'The high resolution.')
    .option('-i, --images', 'The number of images.')
    .option('-s, --steps', 'The number of steps.')
    .description('Sets the payload for the creation. Reset, view, etc.')
    .action(function (args, callback) {
        this.log(args)

        if (args.operation === 'reset') {
            payload = {
                prompt: 'pregnant woman in a bikini',
                negativePrompt: '',
                model: 'lyra',
                aspectRatio: '5:4',
                highResolution: false,
                images: 1,
                steps: 20,
            }
        } else if (args.operation === 'set') {
            if (args.options.prompt) {
                payload.prompt = args.options.prompt
            } else if (args.options.negativePrompt) {
                payload.negativePrompt = args.options.negativePrompt
            } else if (args.options.model) {
                payload.model = args.options.model
            } else if (args.options.aspectRatio) {
                payload.aspectRatio = args.options.aspectRatio
            } else if (args.options.highResolution) {
                payload.highResolution = args.options.highResolution
            } else if (args.options.images) {
                payload.images = args.options.images
            } else if (args.options.steps) {
                payload.steps = args.options.steps
            } else {
                this.log('No option provided.')
            }
        } else {
            this.log('Hi this should show things')
            this.log('This is the value of the prompt ' + payload.prompt)
            this.log(payload)
        }

        callback()
    })

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

// Functions that run on startup
utils.updateUserData(userData)
getCreations()

// Start the CLI
vorpal.delimiter('⭐ >>>').show()

function getCreations(creations) {
    const options = {
        method: 'GET',
        url: 'https://api.starryai.com/creations/',
        headers: {
            accept: 'application/json',
            'X-API-Key': process.env.KEY,
        },
    }

    let creationsArray = []

    console.log('Fetching creations...')
    console.log('Value of the creations object:', creations)

    try {
        creationsArray = axios
            .request(options)
            .then((response) => {
                creations = response.data
            })
            .catch((error) => {
                console.error(error)
            })
    } catch (error) {
        console.error('Error fetching data:', error)
    }

    return creationsArray
}
