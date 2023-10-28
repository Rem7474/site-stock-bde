//AUTHOR: REMY CUVELIER
//DATE: 2023.10.27
//PROJECT: STOCK BDE

//ip du lecteur RFID
var ip_rfid_reader = "http://bde.local:8080/api/uid";

//récupération de l'id de l'utilisateur
document.getElementById("uid_rfid").addEventListener("click",get_uid);

document.getElementById("form_user").addEventListener("submit",save_user);
//fonctions de conso.js
function rfid(uid){
    console.log("rfid");
    console.log(uid);
    let users=localStorage.getItem("users");
    let uid_form=document.getElementById("uid");
    let username_form=document.getElementById("username");
    let nb_conso_form=document.getElementById("nb_conso");
    let reset=0;
    if (uid!=null){
        document.getElementById("uid").value=uid;
    }
    else{
        reset=1;
    }
    if (users!=null){
        users=JSON.parse(users);
        if (users[uid]!=undefined){
            document.getElementById("username").value=users[uid]["nom"];
            document.getElementById("nb_conso").value=users[uid]["nb_conso"];
        }
        else{
            reset=2;
        }
    }
    else{
        reset=2;
    }
    switch (reset){
        case 1:
            uid_form.value="";
            username_form.value="";
            nb_conso_form.value="";
            break;
        case 2:
            username_form.value="";
            nb_conso_form.value="";
            break;
    }
}
function get_uid(){
    //requète AJAX pour récupérer l'uid du badge
    let uid;
    let xhr=new XMLHttpRequest();
    xhr.open("GET",ip_rfid_reader);
    xhr.responseType="json";
    xhr.onload=function(){
        if (xhr.readyState===xhr.DONE){
            if (xhr.status===200){
                uid=xhr.response.uid;
                rfid(uid);
            }
            else{
                alert("Impossible de joindre le lecteur RFID");
            }
        }
    }
    xhr.send();
}

function save_user(event){
    event.preventDefault();
    let nom=document.getElementById("username").value;
    let uid=document.getElementById("uid").value;
    let nb_conso=document.getElementById("nb_conso").value;
    let users=localStorage.getItem("users");
    if (users==null){
        users={};
    }
    else{
        users=JSON.parse(users);
    }
    users[uid]={"nb_conso":nb_conso,"nom":nom};
    localStorage.setItem("users",JSON.stringify(users));
    document.getElementById("username").value="";
    document.getElementById("uid").value="";
    document.getElementById("nb_conso").value="";
}