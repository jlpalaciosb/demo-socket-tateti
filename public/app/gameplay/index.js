
const lineasGanadores = [
    [[1, 1], [2, 1], [3, 1]],
    [[1, 2], [2, 2], [3, 2]],
    [[1, 3], [2, 3], [3, 3]],
    [[1, 1], [1, 2], [1, 3]],
    [[2, 1], [2, 2], [2, 3]],
    [[3, 1], [3, 2], [3, 3]],
    [[1, 1], [2, 2], [3, 3]],
    [[3, 1], [2, 2], [1, 3]],
];

let gameFin = false;

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

/**
 * Lista de jugadas
 * @type {Array}
 */
var jugadas = JSON.parse(
    document.getElementById('ini-jugadas').getAttribute('data-jugadas')
);

function getPlayerX() {
    return document.getElementById('playerX').textContent.trim();
}

function getPlayerO() {
    return document.getElementById('playerO').textContent.trim();
}

function getMyMark() {
    if (getUser().username == getPlayerX()) {
        return 'X';
    } else if (getUser().username == getPlayerO()) {
        return 'O';
    } else {
        return '';
    }
}

// returns: 'X' | 'O' | ''
function getCellMark(x, y) {
    let j = jugadas.filter(jug => jug.x == x && jug.y == y);
    if (j[0]) return j[0].mark;
    else return '';
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
    console.log('clickCell', x, y);
    const myMark = getMyMark();
    const cellMark = getCellMark(x, y);
    if (myMark) {
        if (cellMark === '') {
            if (!gameFin) {
                if (isMyTurn()) {
                    socket.emit("jugada", {
                        content: { x, y },
                        to: getRoomId(),
                    });
                    markCell(x, y, myMark);
                    jugadas.push({ x, y, mark: myMark });
                    checkGameFin();
                } else {
                    addToast('info', 'Espera tu turno.');
                }
            } else {
                console.log('partida ya terminada');
            }
        } else {
            console.log('celda ya marcada');
        }
    } else {
        addToast('info', 'Eres espectador.');
    }
}

function checkGameFin() {
    let markWin = false;
    let playerWin = false;
    let lineaWin = false;
    lineasGanadores.forEach(linea => {
        let win = false;
        let m = getCellMark(linea[0][0], linea[0][1]);
        if (m && getCellMark(linea[1][0], linea[1][1]) == m && getCellMark(linea[2][0], linea[2][1]) == m) {
            win = true;
            lineaWin = linea;
            markWin = m;
            playerWin = markWin == 'X' ? getPlayerX() : getPlayerO();
        }
    });
    if (markWin) {
        if (playerWin == getUser().username) {
            addToast('success', 'Has ganado!');
        } else {
            addToast('info', playerWin + ' ha ganado.');
        }
        lineaWin.forEach(celda => {
            el = document.getElementById(`cell-${celda[0]}-${celda[1]}`);
            el.classList.add('bg-success');
        });
    }
    if (markWin || jugadas.length == 9) {
        gameFin = true;
        if (!markWin && jugadas.length == 9) {
            addToast('info', 'Partida empatada.');
        }
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
    checkGameFin();
});

jugadas.forEach(jugada => {
    markCell(jugada.x, jugada.y, jugada.mark);
});
checkGameFin();
