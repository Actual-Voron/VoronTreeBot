const { Client } = require('discord.js-selfbot-v13');

const client = new Client({
    intents: ['GUILDS', 'GUILD_MESSAGES'],
    checkUpdate: false
});

var currentWaterer = null;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    client.guilds.cache.get('267810707574226964').channels.cache.get('1086810299174240266').messages.fetch('1086810413523542047').then(message => {
        var embed = message.embeds[0];

        if(!embed) return console.log('No embed found');

        // get waterer **Thanks <@829105364234403870> for watering the tree!**\n or Last watered by: <@829105364234403870> 
        var thanksWaterer = embed.description.includes('Thanks ') ? embed.description.split('Thanks ') : [];
        var lastWaterer = embed.description.includes('Last watered by: ') ? embed.description.split('Last watered by: ') : [];

        // console.log(thanksWaterer, lastWaterer)

        if(thanksWaterer[1]) {
            // get only the numbers in <@ id >
            var watererId = thanksWaterer[1].split(' for')[0].split('<@')[1].split('>')[0];
            // get only the id
            console.log('📢', 'Found current waterer: ' + watererId, '("' + thanksWaterer[1].split('\n')[0] + '")')
        } else if(lastWaterer[1]) {
            var watererId = lastWaterer[1].split('\n')[0].split('<@')[1].split('>')[0];
            currentWaterer = watererId;
            console.log('📢', 'Found current waterer: ' + watererId, '("' + lastWaterer[1].split('\n')[0] + '")')
        }

        // check if plant can pick apples message.components[0].components.filter(c => c.emoji.name == '🧺');
        if(message.components[0].components.filter(c => c.emoji.name == '🧺').length > 0) {
            console.log('🍎', 'Apples are available!')
            applesAvailable = true;
        } else {
            console.log('🍎', 'No apples available')
            applesAvailable = false;
        }

        if(embed.description.includes("**Ready to be watered!**")) {
            console.log('ready to water')
            // waterPlant(message);
        } else {
            // console.log(message)
            var time = embed.description.split('come back ')[1].split('.')[0];

            // get only numbers
            var numbers = time.match(/\d+/g).map(Number);

            // time is in epoch time, convert to date
            var date = new Date(numbers[0] * 1000);

            // show how long until it is time to water
            console.log('🌧️', 'Watering at ' + date.toLocaleTimeString());
        }
    })
})

function waterPlant(message) {
    if(currentWaterer == client.user.id) return console.log('already watered plant', currentWaterer, client.user.id);

    message.components[0].components.filter(c => c.emoji.name == '💧').forEach((e) => {
        // var time = 100 miliseconds to 500 miliseconds
        var time = Math.floor(Math.random() * 500) + 100;
        console.log('💦', 'Watering in ' + time + 'ms')

        setTimeout(() => {
            try {
                e.click(message).then(() => {
                    console.log('💧', 'Clicked water button, waiting for response')
                }).catch(err => {
                    console.log(err)
                });
            } catch(err) {
                console.log(err)
            }
        }, time);
    });
}

var isAppleCatching = false;
var applesAvailable = false;

function catchApples(message) {
    console.log('already catching apples', isAppleCatching, applesAvailable);
    // if we are already catching apples, stop
    if(isAppleCatching == true && applesAvailable == true) return console.log('!already catching apples', isAppleCatching, applesAvailable);
    isAppleCatching = true;
    console.log('🌳', 'Starting to catch apples...')

    // set a random timeout from 1-2 seconds to catch per apples
    // console.log(message.components)
    var apples = message.components[0].components.filter(c => c.emoji.name == '🧺');

    console.log('🍎', 'Found ' + apples.length + ' apples')

    if(apples.length == 0) return isAppleCatching = false;
    
    function performTask() {
        var time = Math.floor(Math.random() * 500) + 250;
        console.log('🍎', 'Catching in ' + time + 'ms')
        
        try {
            // if there are no more apples, stop
            if(apples.length == 0) return isAppleCatching = false;
            // if we are not catching apples, stop
            if(applesAvailable == false) {
                isAppleCatching = false
                console.log('🍎', 'No more apples available')
                clearInterval(appleInterval)
            } else {
                // get a random apple
                var apple = apples[Math.floor(Math.random() * apples.length)]

                apple.click(message).then(() => {
                    console.log('🍎', 'Clicked Apple! (' + apples.length + ' left)')
                    setTimeout(performTask, time);
                }).catch(err => {
                    console.log(err)
                    isAppleCatching = false;
                    apples = [];
                });
            }
        } catch(err) {
            console.log(err)
            isAppleCatching = false;
            apples = [];
        }
    }

    performTask();
}

client.on('messageUpdate', (oldMessage, newMessage) => {
    // if it is the message we are looking for
    if(newMessage.id == '1086810413523542047') {
        var embed = newMessage.embeds[0];

        if(!embed) return console.log('❌', 'No embed found!');

        // get waterer **Thanks <@829105364234403870> for watering the tree!**\n or Last watered by: <@829105364234403870> 
        var thanksWaterer = embed.description.includes('Thanks ') ? embed.description.split('Thanks ') : [];
        var lastWaterer = embed.description.includes('Last watered by: ') ? embed.description.split('Last watered by: ') : [];

        // console.log(thanksWaterer, lastWaterer)

        if(thanksWaterer[1]) {
            // get only the numbers in <@ id >
            var watererId = thanksWaterer[1].split(' for')[0].split('<@')[1].split('>')[0];
            // get only the id
            console.log('📢', 'Found current waterer: ' + watererId, '("' + thanksWaterer[1].split('\n')[0] + '")')
        } else if(lastWaterer[1]) {
            var watererId = lastWaterer[1].split('\n')[0].split('<@')[1].split('>')[0];
            currentWaterer = watererId;
            console.log('📢', 'Found current waterer: ' + watererId, '("' + lastWaterer[1].split('\n')[0] + '")')
        }

        // check if plant can pick apples message.components[0].components.filter(c => c.emoji.name == '🧺');
        if(newMessage.components[0].components.filter(c => c.emoji.name == '🧺').length > 0) {
            console.log('🍎', 'Apples are available!')
            applesAvailable = true;
        } else {
            console.log('🍎', 'No apples available')
            applesAvailable = false;
        }

        if(embed.description.includes("**Ready to be watered!**")) {
            console.log('🌧️', 'Ready to water!')
            waterPlant(newMessage);
        } else {
            // console.log(newMessage)
            var time = embed.description.split('come back ')[1].split('.')[0];

            // get only numbers
            var numbers = time.match(/\d+/g).map(Number);

            // time is in epoch time, convert to date
            var date = new Date(numbers[0] * 1000);

            // show how long until it is time to water
            console.log('🌧️', 'Watering at ' + date.toLocaleTimeString());

            catchApples(newMessage);
        }
    }
})

client.login('NDAwMDIzNTY0NzA4ODcyMTky.GLTBwb.DhhWUY2Z2FBRTk5RHExZTc3QlNvdjN5Z2hEeDM5bkRPVms5VlhoUjhlN09RLXdGakF0UnBjWklSWjFrN0pjZkpCR3hUX3hHSXozcFU5LUJY')
