
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

var appGameplay = new Vue({
    el: '#appGameplay',
    data: {
        jugadas: JSON.parse(
            document.getElementById('ini-jugadas').getAttribute('data-jugadas')
        ),
        gameFin: false,
    },
    computed: {
        isTurnoX: function () {
            return !this.gameFin && this.jugadas.length % 2 == 0;
        },
        isTurnoO: function () {
            return !this.gameFin && this.jugadas.length % 2 == 1;
        },
    },
    methods: {
        getJugadas: function() {
            fetch('/api/games/'+getRoomId())
                .then(response => response.status == 200
                    ? response.json()
                    : Promise.reject(response)
                ).then(data => {
                    this.jugadas = data.jugadas;
                    this.marcarJugadas();
                }).catch(error => {
                    console.error(error);
                });
        },
        marcarJugadas: function () {
            for (let x = 1; x <= 3; x++) {
                for (let y = 1; y <= 3; y++) {
                    let mark = '';
                    let jug = this.jugadas.filter(j => j.x == x && j.y == y);
                    if (jug.length > 0) mark = jug[0].mark;
                    markCell(x, y, mark);
                }
            }
            checkGameFin();
        },
    },
});

function getRoomId() {
    return location.pathname.split('/').toReversed()[0];
}

var socket = io('', { autoConnect: false });
socket.auth = {
    tipoSocket: 'gameplay',
    username: getUser().username,
    roomId: getRoomId(),
}
socket.connect();

socket.onAny((event, ...args) => {
    console.log(event, args);
});

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
    let j = appGameplay.jugadas.filter(jug => jug.x == x && jug.y == y);
    if (j[0]) return j[0].mark;
    else return '';
}

function isMyTurn() {
    if (appGameplay.jugadas.length % 2 == 0 && getMyMark() == 'X') {
        return true;
    } else if (appGameplay.jugadas.length % 2 == 1 && getMyMark() == 'O') {
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
            if (!appGameplay.gameFin) {
                if (isMyTurn()) {
                    socket.emit("jugada", {
                        content: { x, y },
                        to: getRoomId(),
                    });
                    markCell(x, y, myMark);
                    appGameplay.jugadas = [...appGameplay.jugadas, { x, y, mark: myMark }];
                    checkGameFin();
                } else {
                    if (appGameplay.jugadas.length > 0) {
                        addToast('info', 'Ya jugaste, espera tu turno.');
                    } else {
                        addToast('info', 'Espera tu turno.');
                    }
                }
            } else {
                addToast('info', 'Partida terminada.');
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
            el.classList.add('cell-win');
        });
    }
    if (markWin || appGameplay.jugadas.length == 9) {
        appGameplay.gameFin = true;
        if (!markWin && appGameplay.jugadas.length == 9) {
            addToast('info', 'Partida empatada.');
        }
    } else {
        appGameplay.gameFin = false;
    }
}

function markCell(x, y, mark) {
    const el1 = document.getElementById(`cell-${x}-${y}`);
    const el2 = el1.querySelector('span');
    if (mark == 'X') {
        el2.innerHTML = '<i class="bi-x-lg"></i>'
    } else if (mark == 'O') {
        el2.innerHTML = '<i class="bi-circle"></i>'
    } else {
        el2.innerHTML = '';
    }
    el2.classList.add('cell-mark-1');
}

socket.on('jugada', (jugada) => {
    console.log('jugada', jugada);
    markCell(jugada.content.x, jugada.content.y, jugada.mark);
    appGameplay.jugadas = [...appGameplay.jugadas, {
        x: jugada.content.x,
        y: jugada.content.y,
        mark: jugada.mark
    }];
    checkGameFin();
});

appGameplay.marcarJugadas();

socket.on("connect", () => {
    console.log('socket conectado o reconectado');
    appGameplay.getJugadas();
});
