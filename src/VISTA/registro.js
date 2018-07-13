var db = firebase.firestore();

function guardar() {
    var postenvio= document.getElementById("mensajePost").value;
    db.collection().add ({
        
    })
    .then (function(docref) {
        console.log(docref.id);
    })
    .catch (function(error){
        console.log(error);
    });
}
