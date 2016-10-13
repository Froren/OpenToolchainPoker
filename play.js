var tournament = require('./test/tournament')
    , MachinePoker = require('./machine-poker')
    , ChallBot = require('./players/challengerBot')
    , challenger = MachinePoker.seats.JsLocal.create(ChallBot);

var amqpUrl = process.env.amqpUrl;

/*
    If the table is being run for the pipeline,
    add a narrator and run the tournament once.
*/
if (!amqpUrl) {
    var table = tournament.createTable(challenger, {hands:200});
    table.addObserver(MachinePoker.observers.narrator);
    table.start();

} else {

    /*
        Otherwise, connect to the rabbitmq instance for publishing the results
    */
    var _channel, _conn;
    var amqp = require('amqplib/callback_api');

    amqp.connect(amqpUrl, function(err, conn) {
        conn.createChannel(function(err, channel) {

            channel.assertExchange('msg', 'fanout', {durable: false});
            _channel = channel;
            _conn = conn;
        });
    });

    var returned = 1;
    var timestamp = (new Date()).toISOString();
    var playersResult = [];

    var tournamentObjects = [];

    //Run the tournament 5 times
    var multiplier = process.env.multiplier || 5;
    for (var i = 0; i < multiplier; i++) {

        tournamentObjects[i] = tournament.createTable(challenger, {hands:200});
        tournamentObjects[i].start();
        tournamentObjects[i].on('tournamentComplete', parseResults);
    }

    function parseResults(results) {

        //Filter out the chip totals at end of game
        var formattedPlayers = results.map(function(o) {
            return {name: o.name, chips: o.chips};
        });

        //Sort the players
        formattedPlayers.sort(function(a, b) {
            return b.chips - a.chips;
        });

        playersResult.push(formattedPlayers);
        returned++;

        if (returned > multiplier) {

            var totals = {};

            /*
                Calculate totals from all the games

                [
                    [{name, chips}, {name, chips}, .. ] ..
                ]
            */
            for(var i = 0; i < playersResult.length; i++) {
                for(var j = 0; j < playersResult[i].length; j++){

                    if (totals[playersResult[i][j].name] === undefined) {
                        totals[playersResult[i][j].name] = 0;
                    } else {
                        totals[playersResult[i][j].name] += playersResult[i][j].chips;
                    }
                }
            }

            //Need totals to be sortable, but it's an object
            var totalsArray = [];

            for(var bot in totals) {
                totalsArray.push({name: bot, chips: totals[bot]});
            }

            totalsArray.sort(function(a, b) {
                return b.chips - a.chips;
            });

            //After the final result, publish and close the connection
            var gameObject = {
                timestamp: timestamp,
                totals: totalsArray,
                players: playersResult
            };

            function publish() {

                if (_channel) {
                    _channel.publish('msg', '', new Buffer(JSON.stringify(gameObject)));

                    _channel.close(function(err) {
                        _conn.close();
                    });
                } else {
                    setTimeout(function(){ publish(); }, 2000);
                }
            }

            publish();
        }
    };
}