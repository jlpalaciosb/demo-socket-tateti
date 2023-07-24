// index script frontend

function borrarCookie(nombre) {
    document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}

function getUser() {
    return {
        username: document.querySelector('.username').textContent.trim(),
    };
}

function logout() {
    borrarCookie('sessionid');
    location.reload();
}

/**
 * @param {String} tipo ''|info|success|warning|danger
 * @param {String} text 
 * @param {Object} opciones 
 */
function addToast(tipo, texto, opciones = {}) {
    let fondo = 'linear-gradient(to right, #00b09b, #96c93d)'; // default
    if (tipo == 'info') {
        fondo = 'linear-gradient(to right, #17a2b8, #20c997)';
    } else if (tipo == 'success') {
        fondo = 'linear-gradient(to right, #28a745, #32cd32)';
    } else if (tipo == 'warning') {
        fondo = 'linear-gradient(to right, #ffc107, #ffdd57)';
    } else if (tipo == 'danger') {
        fondo = 'linear-gradient(to right, #ff0000, #dc3545)';
    }
    Toastify({
        text: texto,
        duration: 3000,
        newWindow: true,
        close: false,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: fondo,
        },
        onClick: function () { }, // Callback after click
        ...opciones
    }).showToast();
}
