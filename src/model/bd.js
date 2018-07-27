//Initialize Firebase
let config = {
  apiKey: "AIzaSyCGQvJrcWt8bQ7wB3A2AXqkHqld-NYAVJw",
  authDomain: "social-network-967b3.firebaseapp.com",
  databaseURL: "https://social-network-967b3.firebaseio.com",
  projectId: "social-network-967b3",
  storageBucket: "social-network-967b3.appspot.com",
  messagingSenderId: "25029310975"
};
firebase.initializeApp(config);
const dataBase = firebase.database();
/**************************************************************************************************************** */
const directionalUrl = (url) => {
  window.location = (url);
}
//********************datos del usuario con  sesion activa ************************************ */
const getDataUserSessionActive = () => { //observer()
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      render(containerModalWelcome);
    } else {
      alert('no existente usuario activo');
    }
  });
};
const getDataUserSessionActiveLogin = () => { //observer()
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      if (user.emailVerified) {
        directionalUrl('../src/view/muro.html')
      } else {
        modalView('Inicio Sesion', 'Por favor verifica tu correo registrado para acceder', 'Aceptar', 'Cerrar');
      }
    } else {
      alert('no existente usuario activo');
    }
  });
};
const getDataUserRegisterFirebase = (user) => {
  let ObjUserCurrent = {};
  if (user != null) {
    const ObjUserCurrent = {
      name: user.displayName,
      email: user.email,
      photoUrl: user.photoURL,
      emailVerified: user.emailVerified,
      uid: user.uid
    };
    return ObjUserCurrent;
  }
};
const getDataUserRegisterWithFacebookOrGmail = (user) => {
  let ObjUserCurrent = {};
  if (user != null) {
    user.providerData.forEach(function (user) {
      ObjUserCurrent = {
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        uid: user.uid
      };
      return ObjUserCurrent;
    });
  }
};
const getDataCurrentUser = () => {
  let user = firebase.auth().currentUser;
  if (user) {
    let objUserFire = getDataUserRegisterFirebase(user);
    let objUserFacGmail = getDataUserRegisterWithFacebookOrGmail(user);
  } else {
    alert('usuario no logeado');
  }
}
//*****************************************Create / Edite/ Remove  de los Post*****************************************************************+/
const validateContentOfpublications = (descriptionPostValue) => {
  if (/^(?!\s)/.test(descriptionPostValue) && /^([A-Za-z0-9\s]{1,})/g.test(descriptionPostValue)) {
    return true;
  } else {
    return false;
  };
};
const createPost = (descriptionPost, privacity) => {
  const validatepublications = validateContentOfpublications(descriptionPost.value)
  if (validatepublications) {
      const userId = firebase.auth().currentUser.uid;
      (firebase.database().ref('/users/' + userId).once('value', (snapshot) => {
        const displayName = snapshot.val().userName;
        alert('soy la funcion que creará el Post');
        let refPost = (firebase.database().ref().child('POST'));
        refPost.push({
          userId: firebase.auth().currentUser.uid,
          autor: displayName,
          description: descriptionPost.value,
          privacity: privacity.value,
          likesCount: 0,
        }).then(() => {
          descriptionPost.value = "";
          privacity.innerHTML = `<option value="PUBLICO">PUBLICO 🌎 </option>
          <option value="PRIVADO">PRIVADO 🔒</option>`;
          // mostrarPost();
        });
      }));
    
  } else {
    alert('Escriba su opinion');
    descriptionPost.placelholder = "Escribe un mensaje";
  }

}
 

/**************************************************likes***********************************************************/

const createLike =  () => {
    console.log('create like');
  const postId =event.target.getAttribute("data-like");
  console.log(postId);
  const uid = (firebase.auth().currentUser.uid);
  let postRef = firebase.database().ref('POST/' + postId );
  console.log(postRef);
  postRef.transaction((post) => {
      console.log(post);
    if (post) {
      if (post.likes && post.likes[uid]) {
          console.log();
        post.likesCount--;
        post.likes[uid] = null;
      } else {
        post.likesCount++;
        if (!post.likes) {
            console.log('funciona');
          post.likes = {};
        }
        post.likes[uid] = true;
      }
    }
    return post;
  });
};

/**************************************************Registro de datos en BD****************************************************************************/
const createLike = () => {
  const postId = event.target.getAttribute("data-like");
  const uid = (firebase.auth().currentUser.uid);
  let postRef = firebase.database().ref('POST/' + postId);
  postRef.transaction((post) => {
    if (post) {
      if (post.likes && post.likes[uid]) {
        post.likesCount--;
        post.likes[uid] = null;
      } else {
        post.likesCount++;
        if (!post.likes) {
          post.likes = {};
        }
        post.likes[uid] = true;
      }
    }
    return post;
  });
};

const createUser = (objectUser, name) => {
  if (!objectUser.user.displayName) {
    firebase.database().ref('users/' + objectUser.user.uid).set({
      userId: objectUser.user.uid,
      userName: name,
      userEmail: objectUser.user.email,
      isNewUser: objectUser.additionalUserInfo.isNewUser,
      providerId: objectUser.additionalUserInfo.providerId,
      emailVerified: objectUser.user.emailVerified
    });
  } else {
    firebase.database().ref('users/' + objectUser.user.uid).set({
      userId: objectUser.user.uid,
      userName: objectUser.user.displayName,
      userEmail: objectUser.user.email,
      isNewUser: objectUser.additionalUserInfo.isNewUser,
      userPhotoUrl: objectUser.user.photoURL,
      providerId: objectUser.additionalUserInfo.providerId
    }).then(() => {
      directionalUrl('../src/view/muro.html')
    });
  }
  return objectUser
}

const mostrarPost = () => {
  let refPost = (firebase.database().ref().child('POST'));
  refPost.on("value", function (snap) {
    let datos = snap.val();
    const viewPost = document.getElementById('posts');
    let elementsView = "";
    for (let key in datos) {
      if (datos[key].privacity === 'PRIVADO') {
        if (datos[key].userId === firebase.auth().currentUser.uid) {
          elementsView += `           
          <form class="comentary">
              <p class="users" >${datos[key].autor}</p>
              <textarea name="postMessage" rows="4" cols="50" readonly class="mensaje">  ${datos[key].description}</textarea>
              <input type="number" class="textValuefixed" readonly value="${datos[key].likesCount}" />
              <select disabled id="post-privacity-selector">
                <option value="${datos[key].privacity}">${datos[key].privacity}</option>
              </select>
              <button type="button" class="icon-ok" data-like="${key}"></button>
              <a href="#miModal"><button type="button" class="borrar" data-message-delete=${key}>Eliminar</button></a>
              <button type="button" id="btn-edit" class="editar" data-message-edit= ${key}>Editar</button>
             </div>
          </form>`
        }

      } else if (datos[key].privacity === 'PUBLICO') {
        if (datos[key].userId != firebase.auth().currentUser.uid) {
          elementsView += `           
              <form class="comentary">
              <p class="users" >${datos[key].autor}</p>
              <textarea name="postMessage" rows="4" cols="50" readonly class="mensaje">  ${datos[key].description}</textarea>
              <input type="number" class="textValuefixed" readonly value="${datos[key].likesCount}"/>
              <button type="button" class="icon-ok" data-like="${key}"></button>
              <select disabled id="post-privacity-selector">
                <option value="${datos[key].privacity}">${datos[key].privacity}</option>
              </select>
              </div>
             </form>`
        } else {
          elementsView += `           
             <form class="comentary">
             <p class="users" >${datos[key].autor}</p>
             <textarea name="postMessage" rows="4" cols="50" readonly class="mensaje">  ${datos[key].description}</textarea>
             <input type="number" class="textValuefixed" readonly value="${datos[key].likesCount}"/>
             <select disabled id="post-privacity-selector">
                <option value="${datos[key].privacity}">${datos[key].privacity}</option>
              </select>
             <button type="button" class="icon-ok" data-like="${key}"></button>
             <a href="#miModal"><button type="button" class="borrar" data-message-delete=${key}>Eliminar</button></a>
             <button type="button" id="btn-edit" class="editar" data-message-edit= ${key}>Editar</button>
            </div>
               </form>`
        }


      }
      viewPost.innerHTML = elementsView;
      if (elementsView != "") {
        const elementDelete = document.getElementsByClassName("borrar");
      const elementEdit = document.getElementsByClassName("editar");
      const elementLike = document.getElementsByClassName('icon-ok');
        for (let i = 0; i < elementLike.length; i++) {
          elementLike[i].addEventListener('click', createLike, false);
      }
        for (let i = 0; i < elementDelete.length; i++) {
          // console.log(elementsView);
          elementDelete[i].addEventListener('click', borrarDatosFirebase, false);
          elementEdit[i].addEventListener('click', editaDatosFirebase, false);
          
        }
          
      }
    }
  })
}





const modalView = (reftexto, text, btn1, btn2) => {
  return `
    <div class="modal-contentView">
      <a href="#modal-close" title="Cerrar" id="close" class="modal-close">Cerrar</a>
      <h2>${reftexto}</h2>
      <p>${text}</p>
        <button id="accept" class="btnmodal">${btn1}</button>
        <a href="#modal-close" title="${btn2}"><button class="btnmodal">${btn2}</button></a>
    </div>
  `
};
