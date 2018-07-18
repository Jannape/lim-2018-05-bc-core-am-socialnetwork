
/*********************************************Observar y detectar si hay un usuario registrado**********************************************/
const nuevaPagina = (url) => {
    window.location = (url);
}


const observer = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {

            console.log('usuario existente');
            console.log(user.emailVerified);
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
        } else {
            console.log('no existente usuario activo');
        }
    });
};
//*************************************************funcion de registro de usuarios************************************************/
const register = () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email, password);
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((result) => {
            verificar();
            console.log(result);
            userProfile(result);
        }).catch(function (error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode, errorMessage);
            errorCode = 'La dirección de correo electrónico está mal formada.';
            errorMessage = 'La contraseña debe tener una longitud de 6 caracteres o más .';
            document.getElementById("msjValidation1").style.display = "block"; document.getElementById("msjValidation1").innerHTML = errorMessage;

            document.getElementById("msjValidation2").style.display = "block"; document.getElementById("msjValidation2").innerHTML = errorCode;
        });
}

/***********************************************************Mostrando interfaz de Facebook a travez de Popup*********************************/
const initFacebook = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
        console.log(result);
        principal.style.display = "none";
        userProfile(result);
    }).catch(function (error) {
        console.log(error);
    })
}
/************************************************************Mostrando interfaz de Google a travez de Popup********************************/

const initGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
        console.log(result);
        userProfile(result);
    }).catch(function (error) {
        console.log(error);
    })
}
/************************************************************Enviar correo de confirmación****************************************************************************/
const verificar = () => {
    var actionCodeSettings = {
        url: 'https://jossielinn.github.io/Red-Social/src/VISTA/interfaz.html',// + firebase.auth().currentUser.email
        handleCodeInApp: false
    };
    const user = firebase.auth().currentUser;
    console.log(user);
    user.sendEmailVerification(actionCodeSettings).then(() => {
        console.log('enviando correo');
    }).catch(function (error) {
        console.log(error);
    });
};
/************************************************************Cerrar cesión****************************************************************************/
const cerrar = () => {
    firebase.auth().signOut()
        .then(() => {
            console.log('saliendo');
            contenido.style.display = "none";
            principal.style.display = "flex";
        })
        .catch((error) => {
            console.log(error);
        });
};
/************************************************************Bienvenida *************************************************************************/
const userProfile = (objectUser) => {
    if (objectUser.additionalUserInfo.isNewUser != false) {
        contenido.innerHTML = `<p>Bienvenida!</p><br><button onclick = "cerrar()" id="btn-cerrar-sesion">Cerrar sesion</button>`;
    } else {
        contenido.style.display = "none";
        console.log('usuario antiguo');
    }

}


const recoverPass = () => {
    const auth = firebase.auth();
    const emailAddress = document.getElementById('correo-sesion').value;

    auth.sendPasswordResetEmail(emailAddress)
        .then((result) => {
            alert('SE HA ENVIADO UN CORREO A SU CUENTA. SIGA LOS PASOS');
        }).catch(function (error) {
            console.log(error);
        })
}

/* Forgot Password
document.getElementById("forgotPassw").addEventListener("click", () => {
    var auth = firebase.auth();
var emailAddress = "user@example.com";
auth.sendPasswordResetEmail(emailAddress).then(function() {
  // Email sent.
}).catch(function(error) {
  // An error happened.
});
})*/

const ingreso = () => {
    const emailLogin = document.getElementById('correo-sesion').value;
    const passwordLogin = document.getElementById('password-sesion').value;
    firebase.auth().signInWithEmailAndPassword(emailLogin, passwordLogin).then(() => {
        nuevaPagina("interfaz.html");
    }).catch(function (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
    });
};
