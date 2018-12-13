require('./assets/styles/main.scss');

const io = require('socket.io-client');

const {Elm} = require('./elm/Main.elm');
const app = Elm.Main.init({
    node: document.getElementById('elm-node')
});

app.ports.createSocket.subscribe(() => {
    const socket = io('http://localhost:8081');

    socket.on('server:new_entry', (entry) => {
        console.log('Entry received', entry);
        app.ports.newEntry.send(entry);
    });
});
