const buttonRegister = document.getElementById('button-register');
const buttonSesion = document.getElementById('button-sesion');
const posts = document.getElementById('posts');
const principal = document.getElementById('wrapper');
const contenido = document.getElementById('contenido');
const btnFacebook = document.getElementById("facebook");
const btnGoogle = document.getElementById('google');
const registro = document.getElementById('registro');
const sesion = document.getElementById('sesion');
const formRegistro = document.getElementById('form-registro');
const formSesion = document.getElementById('form-sesion');

observer();

buttonRegister.addEventListener('click', (e) => {
    register();
});
btnFacebook.addEventListener('click', () => {
    initFacebook()
});
btnGoogle.addEventListener('click', () => {
    initGoogle()
})
registro.addEventListener('click', () => {
    formSesion.style.display = "none";
    formRegistro.style.display = "block";
    registro.classList.remove("inactive");
    registro.classList.add("active");
    sesion.classList.remove("active");
    sesion.classList.add("inactive");
})
sesion.addEventListener('click', () => {
    formSesion.style.display = "block";
    formRegistro.style.display = "none";
    sesion.classList.remove("inactive");
    sesion.classList.add("active");
    registro.classList.remove("active");
    registro.classList.add("inactive");
})
buttonSesion.addEventListener('click', () => {
    ingreso();
})

document.getElementById('forgot-passw').addEventListener('click', () => {
    recoverPass();
})


document.getElementById('cerrar-sesion').addEventListener('click', () => {
    cerrar();
})

let contador = 1;
document.getElementById('menu').addEventListener('click', () => {

    if (contador == 1) {
        document.getElementById('contenido').style.display = "block";
        contador = 0;
    } else {
        contador = 1;
        document.getElementById('contenido').style.display = "none";
    }
})

