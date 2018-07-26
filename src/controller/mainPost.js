const buttonPublicPost = document.getElementById('btn-public-post');
const containerModalWelcome = document.getElementById('container-modal');
let refPost = (firebase.database().ref().child('POST'));
const logOut = document.getElementById('log-out');

window.onload = () => {
    getDataUserSessionActive();
    console.log(firebase.auth());
    let modal = document.getElementById('miModal');
    modal.classList.remove('modalView');
    let nameUser= document.getElementById('name-user');
}

logOut.addEventListener('click', () => {
    let modal = document.getElementById('miModal');
    modal.classList.add('modalView');
    let elmet = '';
    elmet = modalView('Cerrar Sesion','Seguro que desea salir ?','Si','No');
    modal.innerHTML = elmet;
    document.getElementById('accept').addEventListener('click', () => {
        directionalUrl('../login.html');
    })
})

mostrarPost();
buttonPublicPost.addEventListener('click', (e) => {
    e.preventDefault();
    let descriptionPost = document.getElementById('txt-description-post');
    let likesCount = document.getElementById('input-likes-count');
    const privacityPost = document.getElementById('post-privacity-selector');
    createPost(descriptionPost, likesCount, privacityPost);
	/*posts.innerHTML += `
	<form class="comentary">
	<!--<button type="button" id="seleccion" class="icon-ellipsis-vert"></button>-->
	<textarea  id="${newPost}" name="textarea" rows="4" cols="50">${descriptionPost.value}</textarea>
	<input type="number" class="textValuefixed" readonly/>
	<button type="button" class="icon-ok"></button>
	<div class="section-seleccion">
			<button type="button" data-message-edit= ${newPost}>Editar</button>
			<button type="button" id="cerrar-sesion" data-message-delete="${newPost}">Eliminar</button>
	</div>
	</form>`*/
    // gngnh
});
const borrarDatosFirebase = () => {
    let refPost = (firebase.database().ref().child('POST'));
    console.log(event.target);
    let keyDataDelete = event.target.getAttribute("data-message-delete");
    // let keyDataDelete = event.target.data-message-deleted;
    console.log(keyDataDelete);
    let refMesaggeDelete = refPost.child(keyDataDelete);
    let modal = document.getElementById('miModal');
    modal.classList.add('modalView');
    let elmet = '';
    elmet = modalView('Eliminar', 'Desea realmente eliminar ?', 'SI', 'NO');
    modal.innerHTML = elmet;
    console.log(modal);

    document.getElementById("accept").addEventListener('click', () => {
        refMesaggeDelete.remove();
    })

}
const editaDatosFirebase = () => {
    alert('editar');
    const posts = document.getElementById('posts');
    let keyDataEdit = event.target.getAttribute("data-message-edit");
    console.log(keyDataEdit);
    refPost.on("value", function (snap) {
        let datos = snap.val();
        console.log(datos);
        posts.innerHTML = "";

        for (let key in datos) {
            console.log(key);
            if (key == keyDataEdit) {
                console.log(datos[key].privacity);
                if (datos[key].privacity == 'PUBLICO') {
                    posts.innerHTML +=
                        `<form class="comentary">
            <p class="users" >${datos[key].autor}</p>
            <textarea name="postMessage" rows="4" cols="50" class="mensaje" id="text-save">  ${datos[key].description}</textarea>
            <input type="number" class="textValuefixed" readonly value="${datos[key].likesCount}"/>
            <select id="postEdit-privacity-selector">
                <option value="${datos[key].privacity}">${datos[key].privacity}</option>
                <option value="PRIVADO">PRIVADO</option>
              </select>
            <button type="button" class="borrar" data-message-delete=${key}  onclick=mostrarPost()>Cancelar</button>
            <button type="button" id="btn-edit" class="save" data-message-save= ${key}>Guardar</button>
            </div>
        </form>
            `
                } else {
                    posts.innerHTML +=
                        `<form class="comentary">
            <p class="users" >${datos[key].autor}</p>
            <textarea name="postMessage" rows="4" cols="50" class="mensaje" id="text-save">  ${datos[key].description}</textarea>
            <input type="number" class="textValuefixed" readonly value="${datos[key].likesCount}"/>
            <select id="postEdit-privacity-selector">
                <option value="${datos[key].privacity}">${datos[key].privacity}</option>
                <option value="PUBLICO">PUBLICO</option>
              </select>
            <button type="button" class="icon-ok"></button>
            <button type="button" class="borrar" data-message-delete=${key} onclick=mostrarPost()>Cancelar</button>
            <button type="button" id="btn-edit" class="save" data-message-save= ${key}>Guardar</button>
            </div>

        </form>`
                }

            } else {
                posts.innerHTML += `<form class="comentary">
        <p class="users" >${datos[key].autor}</p>
            <textarea name="postMessage" rows="4" cols="50" class="mensaje" readonly> ${datos[key].description} </textarea>
            <input type="number" class="textValuefixed" value="${datos[key].likesCount}" readonly/>
            <select disabled id="postEdit-privacity-selector">
                <option value="${datos[key].privacity}">${datos[key].privacity}</option>
              </select>
            <button type="button" class="icon-ok"></button>
        </form>
 `
            };
        }
        if (posts != "") {
            const elementGuardar = document.getElementsByClassName("save");
            for (let i = 0; i < elementGuardar.length; i++) {
                elementGuardar[i].addEventListener('click', updateU, false);
            }

        }


    })

}
const updateU = () => {
    let keyDataSave = event.target.getAttribute("data-message-save");
    let refMesaggesave = refPost.child(keyDataSave);
    console.log(refMesaggesave);
    let newPost = document.getElementById("text-save").value;
    let newSelect = document.getElementById('postEdit-privacity-selector').value;

    refPost.once("value", function (snap) {
        let data = snap.val();
        for (key in data) {
            if (key == keyDataSave) {
                console.log(keyDataSave);
                if (newPost === '') {
                    alert("Incompleto");
                }
                else {
                    data[key].mensaje = newPost;
                    data[key].option = newSelect;

                    let nuevoPost = {
                        description: newPost,
                        privacity: newSelect

                    }

                    console.log(nuevoPost);
                    var updatesPost = {};
                    updatesPost = nuevoPost;
                    refMesaggesave.update(updatesPost)
                    console.log(newPost);
                    mostrarPost();
                }
            }
        }
    })


}
const closeModalWelcome = () => {
    containerModalWelcome.innerHTML = '';
};
const render = (containerModalWelcome) => {
    if (!firebase.auth().currentUser.displayName) {
        const userId = firebase.auth().currentUser.uid;
        (firebase.database().ref('/users/' + userId).once('value', (snapshot) => {
            const displayName = snapshot.val().userName;
            containerModalWelcome.innerHTML =
                `
	<div id="modal-welcome" class="modal">
        <div class="modal-content">
             <div class="modal-header">
                <span id="close-modal-welcome"  class="close">&times;</span>
                <h2>Bienvenido a *******</h2>
             </div>
<p class="welcomeUser">¡Hola ${snapshot.val().userName} !</p>
             <div class="modal-body">
<p>
Gracias por unirte. 
Las actualizaciones y las nuevas funciones son versiones diarias
por favor, ayúdenos a crear una red social simple, hermosa y sin adornos.
Diviértete usando eso.</p>
             </div>
            
        </div>
	</div>`, document.getElementById('close-modal-welcome').addEventListener('click', () => closeModalWelcome());
        }));
    } else {
        containerModalWelcome.innerHTML =
            `
	<div id="modal-welcome" class="modal">
        <div class="modal-content">
             <div class="modal-header">
                <span id="close-modal-welcome"  class="close">&times;</span>
                <h2>Modal Header</h2>
             </div>
             <div class="modal-body">
                <p>Some text in the Modal Body</p>
                <p >${firebase.auth().currentUser.displayName}</p>
             </div>
             <div class="modal-footer">
                <h3>Modal Footer</h3>
             </div>
        </div>
	</div>`, document.getElementById('close-modal-welcome').addEventListener('click', () => closeModalWelcome());
    }
};


window.onclick = () => {
    if (event.target.id == 'modal-welcome') {
        containerModalWelcome.innerHTML = '';
    }
}

























