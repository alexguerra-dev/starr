vorpal
    .command('write image test', 'Tests writing an image from a url')
    .action(function (args, callback) {
        this.log('Writing image...')
        downloadImage(
            'https://tmp.starryai.com/api/67749/ef4152f9-5ea5-4bf3-9853-6446f90f2e7c.jpg',
            'images/test.jpg',
        )
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
    .command('write image test', 'Tests writing an image from a url')
    .action(function (args, callback) {
        this.log('Writing image...')
        downloadImage(
            'https://tmp.starryai.com/api/67749/ef4152f9-5ea5-4bf3-9853-6446f90f2e7c.jpg',
            'images/test.jpg',
        )
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
    .command('whoami', 'Outputs the current user.')
    .action(function (args, callback) {
        this.log(`You are ${process.env.USER}`)
        this.log(`Your key is ${process.env.KEY}`)
        callback()
    })

vorpal
    .command('hello', 'Outputs "Hello, world!".')
    .action(function (args, callback) {
        console.log('Hello, world!')
        callback()
    })

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
