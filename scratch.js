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
