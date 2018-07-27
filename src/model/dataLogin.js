/************************************************************Envia correo de confirmación****************************************************************************/
const sendEmailVerification = () => {
    var actionCodeSettings = {
        url: 'http://127.0.0.1:8887/src/view/muro.html',
        handleCodeInApp: false
    };
    const user = firebase.auth().currentUser;
    console.log(user);
    user.sendEmailVerification(actionCodeSettings).then(() => {
        console.log('enviando correo');
    }).catch((error) => {
        console.log(error);
    });
};
///********************************************FUNCIONES DE VALIDACIÓN*******************************/
const validatorNameUser = (name) => {
    if ((/^([A-Za-z0-9\s]{8,})+$/g.test(name))) {
        return true
    } else {
        return false
    }
}
const validatorEmail = (email) => {
    console.log('validando email', email);
    if (/^([a-zA-Z0-9._-]{3,})+@([a-zA-Z0-9.-]{5,})+\.([a-zA-Z]{2,})+$/.test(email)) {
        return true;
    } else {
        return false;
    }
}


const validatorPassword = (password) => {
    console.log('validando contraseña', password);
    if (/^([A-Za-z0-9]{8,})+$/g.test(password)) {
        return true;
    } else {
        return false;
    }
}
// ********************************FUNCIÓN QUE INVOCA A TODAS LAS VALIDACIONES ANTERIORES********************//

const validatorEmailAndPassword = (email, password, name) => {
    const msjErrorName = document.getElementById('divLabelMsjErrorName');
    const msjErrorEmail = document.getElementById('divLabelMsjErrorEmail');
    const msjErrorPassword = document.getElementById('divLabelMsjErrorPassword');
    msjErrorName.innerHTML = '';
    msjErrorEmail.innerHTML = '';
    msjErrorPassword.innerHTML = '';
    const validatedPassword = validatorPassword(password);
    const validatedEmail = validatorEmail(email);
    const validateNameUser = validatorNameUser(name);
    if (validatedPassword && validatorEmail && validateNameUser) {
        console.log('email, nombre y contraseña OK');
    const msjErrorPassword = document.getElementById('divLabelMsjErrorPassword');
        registerUserUsual(email, password, name, msjErrorName, msjErrorEmail, msjErrorPassword);
        return true;
    } else if (!validateNameUser) {
        msjErrorName.innerHTML = `<em>el nombre de usuario debería tener más de 8 dígitos y solo puede contener letras, números y espacios en blanco</em>`
        return false;
    } else if (!validatedEmail) {
        msjErrorEmail.innerHTML =`<em>Email invalid</em>`
        return false;
    } else if (!validatedPassword) {
        msjErrorPassword.innerHTML = `<em>la conytraseña debe tener más de 8 dígitos y solo puede contener letras y números</em></em>`;
        return false;
    } 
}
/************************************************MUESTRA MENSAJE DE BIENVENIDA****************************/
viewMessageWelcomeUser = (objectUser) => { //userProfile()
    if (objectUser.additionalUserInfo.isNewUser != false) {
        // contenido.innerHTML = `<p>Bienvenida!</p><br><button onclick = "cerrar()" id="btn-cerrar-sesion">Cerrar sesion</button>`;
        alert('Bienvenido,oh, nos visitas por primera vez');
        console.log(objectUser.additionalUserInfo);
        alert(objectUser.additionalUserInfo.profile.name);
    } else {
        contenido.style.display = "none";
        alert('Bienvenido, hola denuevo');
        console.log(objectUser.additionalUserInfo);
        alert(objectUser.additionalUserInfo.profile.name);
    }
}

//********************************************REGISTRO ORDINARIO DEL USUARIO*******************************/
const registerUserUsual = (email, password, name, errorName, errorEmail, errorPassword) => { //register()
    console.log(email, password);
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((result) => {
            sendEmailVerification()
            createUser(result, name);
            errorName.innerHTML ='';
            errorEmail.innerHTML ='';
            errorPassword.innerHTML =''; 
            document.getElementById('form-registro').reset();
        }).catch(function (error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode, errorMessage);
            errorCode = 'La dirección de correo electrónico ya está registrada';
            errorMessage = 'La contraseña debe tener una longitud de 6 caracteres o más .';
            // document.getElementById("msjValidation1").style.display = "block"; document.getElementById("msjValidation1").innerHTML = errorMessage;

            // document.getElementById("msjValidation2").style.display = "block"; document.getElementById("msjValidation2").innerHTML = errorCode;
        });
}
/**********************************************Registro con Facebook*********************************/
const registerUserFacebook = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
        if (result.additionalUserInfo.isNewUser){
            createUser(result, name);
        }else{
            directionalUrl('../src/view/muro.html')
        }
        
    }).catch(function (error) {
        console.log(error);
    })
}
/*****************************************Registro con Gmail********************************/
const registerUserGmail = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
        if (result.additionalUserInfo.isNewUser) {
            createUser(result, name);
        }else{
            alert('condicional');
            directionalUrl('../src/view/muro.html')
        } 
    }).catch(function (error) {
        console.log(error);
    });
};
const  initSessionFirebase = (emailLogin,passwordLogin) => { 
    // console.log(emailLogin, passwordLogin);
    firebase.auth().signInWithEmailAndPassword(emailLogin.value, passwordLogin.value).then((result) => { 
        document.getElementById('form-sesion').reset();
        document.getElementById('div-label-msj-error-password-login').innerHTML = ''; 
        console.log(result);
        alert(result);
        // console.log(emailLogin, passwordLogin);
    }).catch((error) =>{emailLogin,passwordLogin
        console.log(emailLogin, passwordLogin);
        // const msjErrorPasswordLogin = document.getElementById('div-label-msj-error-password-login');
        document.getElementById('div-label-msj-error-password-login').innerHTML = '<em>Asegurate que el correo y contraseña sean correctos.</em>' 
    });
};
