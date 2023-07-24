
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

// data jugadas [{x,y,mark}]
var jugadas = [];

function getMyMark() {
    if (getUser().username == document.getElementById('playerX').textContent.trim()) {
        return 'X';
    } else if (getUser().username == document.getElementById('playerO').textContent.trim()) {
        return 'O';
    } else {
        return '';
    }
}

// returns: 'X' | 'O' | ''
function getCellMark(x, y) {
    return document.getElementById(`cell-${x}-${y}`).textContent.trim();
}

function isMyTurn() {
    if (jugadas.length % 2 == 0 && getMyMark() == 'X') {
        return true;
    } else if (jugadas.length % 2 == 1 && getMyMark() == 'O') {
        return true;
    } else {
        return false;
    }
}

function clickCell(x, y) {
    const myMark = getMyMark();
    const cellMark = getCellMark(x, y);
    if (myMark) {
        if (cellMark === '') {
            if (isMyTurn()) {
                console.log('clickCell', x, y);
                socket.emit("jugada", {
                    content: { x, y },
                    to: getRoomId(),
                });
                markCell(x, y, myMark);
                jugadas.push({ x, y, mark: myMark });
            } else {
                addToast('info', 'No es tu turno.');
            }
        } else {
            console.log('celda ya marcada');
        }
    } else {
        addToast('info', 'Eres espectador.');
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
    jugadas.push({
        x: jugada.content.x,
        y: jugada.content.y,
        mark: jugada.mark
    });
});
