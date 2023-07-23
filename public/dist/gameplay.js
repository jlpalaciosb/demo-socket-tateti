
function getRoomId() {
    return location.pathname.split('/').toReversed()[0];
}

var socket = io('', { autoConnect: false });
socket.auth = getUser();
socket.auth.roomId = getRoomId();
socket.connect();

socket.onAny((event, ...args) => {
    console.log(event, args);
});

function clickCell(x, y) {
    const myMark = document.querySelector('input[name=myMark]').value;
    if (myMark) {
        console.log('clickCell', x, y);
        socket.emit("jugada", {
            content: { x, y },
            to: getRoomId(),
        });
        markCell(x, y, myMark);
    }
}

function markCell(x, y, mark) {
    const el1 = document.getElementById(`cell-${x}-${y}`);
    const el2 = el1.querySelector('span');
    el2.textContent = mark;
}

socket.on('jugada', (jugada) => {
    console.log('jugada', jugada);
    markCell(jugada.content.x, jugada.content.y, jugada.mark);
});
