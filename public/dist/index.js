// index script frontend

function borrarCookie(nombre) {
    document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}

function logout() {
    borrarCookie('sessionid');
    location.reload();
}
