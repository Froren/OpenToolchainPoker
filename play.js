var tournament = require('./test/tournament')
    , MachinePoker = require('./machine-poker')
    , ChallBot = require('./players/challengerBot')
    , challenger = MachinePoker.seats.JsLocal.create(ChallBot);

var table = tournament.createTable(challenger, {hands:100});
table.addObserver(MachinePoker.observers.narrator);
table.start();

var _channel, _conn;
var amqp = require('amqplib/callback_api');
var amqpUrl = process.env.amqpUrl;

if (amqpUrl) {
    amqp.connect(amqpUrl, function(err, conn) {
        conn.createChannel(function(err, channel) {

            channel.assertExchange('msg', 'fanout', {durable: false});
            _channel = channel;
            _conn = conn;
        });
    });

    table.on('tournamentComplete', function (players) {

        if (_channel) {
            _channel.publish('msg', '', new Buffer(JSON.stringify(players)));

            _channel.close(function(err) {
                _conn.close();
            });
        }
    });
}
