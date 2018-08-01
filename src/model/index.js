// "no-unused-vars": "off",
//     "no-use-before-define": "off",
//         "no-undef": "off"
/* global firebase */
window.getDataUserSessionActiveLogin = () => { // observer()
  firebase.auth().onAuthStateChanged((user) => {
  if (user) {  
    console.log(user);
     (firebase.database().ref('users/' + user.uid).once('value', (snapshot) =>  {
      const isNewUser =   snapshot.val().isNewUser;
      console.log(isNewUser);
      if(!isNewUser) {
        window.directionalUrl('../src/view/wall.html');
      } 
    }));    
        // window.directionalUrl('../src/view/wall.html');
  
    }
  });
};
window.renderModalEmailVerified = (containerModal, titulo, texto) => {
  containerModal.innerHTML =
    `
	        <div id="modal-welcome" class="modal">
            <div class="modal-content">
            <div class="modal-header">
                <span id="close-modal-welcome"  class="close">&times;</span>
                <h2> ${titulo} </h2>
             </div>
           <p class="welcomeUser">${texto}</p>
             <div class="modal-body">
             </div>
            
        </div>
    </div>`, document.getElementById('close-modal-welcome').addEventListener('click', () => containerModal.innerHTML = '');
};
/* *******************************************REGISTRO ORDINARIO DEL USUARIO****************************** */
window.registerUserFirebase = (email, password, name, errorName, errorEmail, errorPassword) => {
  // register()
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((result) => {     
      createUserInBd(result, name);
      window.renderModalEmailVerified(document.getElementById('container-modal'), 'REGISTRO', 'Verifique su correo para iniciar sesion.');
      errorName.innerHTML = '';
      errorEmail.innerHTML = '';
      errorPassword.innerHTML = '';
      document.getElementById('form-registro').reset();
    }).catch(() => {
      window.renderModalEmailVerified(document.getElementById('container-modal'), 'REGISTRO', 'Esta direccion electronica, se encuentra registrada ');
      document.getElementById('form-registro').reset();
    });
};
/* ***********************************************************Envia correo de confirmación****************************************************************************/
window.sendEmailVerification = () => {
  var actionCodeSettings = {
    url: 'https://jossielinn.github.io/lim-2018-05-bc-core-am-socialnetwork/src/view/wall.html',
    handleCodeInApp: false
  };
  const user = firebase.auth().currentUser;
  user.sendEmailVerification(actionCodeSettings).then(() => {
  }).catch(() => {
    // console.log( error);
  });
};

/* *******************************FUNCIÓN QUE INVOCA A TODAS LAS VALIDACIONES ANTERIORES******************* */

window.validatorFormRegister = (email, password, name) => {
  const msjErrorName = document.getElementById('msj-error-name');
  const msjErrorEmail = document.getElementById('msj-error-email');
  const msjErrorPassword = document.getElementById('msj-error-password');
  msjErrorName.innerHTML = '';
  msjErrorEmail.innerHTML = '';
  msjErrorPassword.innerHTML = '';
  const validatedPassword = window.validatorPassword(password);
  const validatedEmail = window.validatorEmail(email);
  const validateNameUser = window.validatorNameUser(name);
  if (validatedPassword && validatedEmail && validateNameUser) {
    window.registerUserFirebase(email, password, name, msjErrorName, msjErrorEmail, msjErrorPassword);
    return true;
  } else if (!validateNameUser) {
    msjErrorName.innerHTML = '<em>El nombre de usuario debería tener más de 8 dígitos y solo puede contener letras, números y espacios en blanco</em>';
    return false;
  } else if (!validatedEmail) {
    msjErrorEmail.innerHTML = '<em>Correo invalido</em>';
    return false;
  } else if (!validatedPassword) {
    msjErrorPassword.innerHTML = '<em>La contraseña debe tener más de 8 dígitos y solo puede contener letras y números</em></em>';
    return false;
  }
};
/* *************************************************Registro de datos en BD****************************************************************************/

const createUserInBd = (objectUser, name) => {
  if (!objectUser.user.displayName) {
    firebase.database().ref('users/' + objectUser.user.uid).set({
      userId: objectUser.user.uid,
      userName: name,
      userEmail: objectUser.user.email,
      isNewUser: objectUser.additionalUserInfo.isNewUser,
      providerId: objectUser.additionalUserInfo.providerId,
      emailVerified: false
    }), window.sendEmailVerification();
  } else {
    firebase.database().ref('users/' + objectUser.user.uid).set({
      userId: objectUser.user.uid,
      userName: objectUser.user.displayName,
      userEmail: objectUser.user.email,
      isNewUser: objectUser.additionalUserInfo.isNewUser,
      userPhotoUrl: objectUser.user.photoURL,
      providerId: objectUser.additionalUserInfo.providerId,
      emailVerified: false
    }).then(()=>{
      (firebase.database().ref('/users/' + objectUser.user.uid).once('value', (snapshot) => {
        const displayName = snapshot.val().userName;
        console.log(displayName);
        if(displayName) {
          window.directionalUrl('../src/view/wall.html');
        }
       }) 
    )});     
  }
  return objectUser;
};



/* *********************************************Registro con Facebook******************************** */
window.registerUserFacebook = () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider).then((result) => {
    if (result.additionalUserInfo.isNewUser) {
      createUserInBd(result, name);
    } else {
      window.directionalUrl('../src/view/wall.html');
    }
  }).catch((error) => {
    alert(error);
  });
};
/* ****************************************Registro con Gmail******************************* */
window.registerUserGmail = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then((result) => {
    console.log(result);
    if (result.additionalUserInfo.isNewUser) {
      createUserInBd(result, name);
    } else {
      window.directionalUrl('../src/view/wall.html');
    }
  }).catch((error) => {
    alert('error', error);
  });
};


window.initSessionFirebase = (emailLogin, passwordLogin) => {
  firebase.auth().signInWithEmailAndPassword(emailLogin.value, passwordLogin.value).then(() => {
    document.getElementById('form-sesion').reset();
    document.getElementById('div-label-msj-error-password-login').innerHTML = '';
  }).catch(() => {
    document.getElementById('div-label-msj-error-password-login').innerHTML = '<em>Asegurate que el correo y contraseña sean correctos.</em>';
  });
};

/*Recuperar contraseña */
window.recoverPassword = () => {
  const emailAddress = document.getElementById('email-session').value;
  firebase.auth().sendPasswordResetEmail(emailAddress)
    .then(() => {
      window.renderModalEmailVerified(document.getElementById('container-modal'), 'RECUPERAR CONTRASEÑA', 'Se ha enviado un correo a su cuenta. SIGA LOS PASOS');

    }).catch(() => {
      window.renderModalEmailVerified(document.getElementById('container-modal'), 'RECUPERAR CONTRASEÑA', 'No se encuentra en nuestros registros.');

    });
};