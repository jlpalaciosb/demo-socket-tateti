var socket = io('', { autoConnect: false });
socket.auth = {
    tipoSocket: 'pairing',
    username: getUser().username,
}
socket.connect();

socket.onAny((event, ...args) => {
    console.log(event, args);
});

const onClickEmparejar = () => {
    socket.emit("peticion", {});
    document.getElementById('loading-emparejar').classList.remove('d-none');
    addToast('info', 'Esperando oponente...');
}

socket.on('newGame', (newGame) => {
    const myUsername = getUser().username;
    if (newGame.playerX == myUsername || newGame.playerO == myUsername) {
        window.location = '/play/' + newGame.roomId;
    }
});
