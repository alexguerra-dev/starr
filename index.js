const vorpal = require('vorpal')()

vorpal.command('foo', 'Outputs "bar".').action(function (args, callback) {
    this.log('bar')
    callback()
})

vorpal
    .command('whoami', 'Outputs the current user.')
    .action(function (args, callback) {
        this.log('Alex')
        callback()
    })

vorpal.delimiter('star>>>').show()
