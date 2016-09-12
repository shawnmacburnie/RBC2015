import express from 'express';
import HTTP from 'http';
import bodyParser from 'body-parser';
import SocketIO from 'socket.io';
import yahooFinance from 'yahoo-finance';

const app = express();
const http = HTTP.Server(app);
const io = SocketIO(http);

app.use(bodyParser.json());
app.use(express.static('target'));

//Defines a route at localhost:3000/
app.get('/', function(req,res) {
    res.sendFile(__dirname + '/target/index.html');
});

app.get('/api/snapshot', function(req,res) {
    const { symbol } = req.query;
    yahooFinance.snapshot({
        symbol,
        fields: ['s', 'n', 'd1', 'l1', 'y', 'r']
    }, function(err, snapshot) {
        res.send(snapshot);
    });
});
app.get('/api/history', function(req,res) {
    const { symbol, from, to } = req.params;
    yahooFinance.historical({symbol,from,to}, function(err, quotes) {
        res.send(quotes);
    });
});


// Socket connection for real-time
io.on('connection', function(socket){
    socket.on('postSnapYahoo', function(symbol){
        yahooFinance.snapshot({
            symbol,
            fields: ['s', 'n', 'd1', 'l1', 'y', 'r']
        }, function(err, snapshot) {
            io.emit('newYahoo', snapshot);
        });
    });

    socket.on('postHistYahoo', function(query){
        yahooFinance.historical(query, function(err, quotes) {
            io.emit('newYahoo', quotes);
        });
    });
});

// Sets port of server to listen to.
http.listen(3000, function() {
    console.log('Listening on port: 3000');
});
