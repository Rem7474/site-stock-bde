//AUTHOR: REMY CUVELIER
//DATE: 2023.10.27
//DERNIERE MAJ : 2024.02.06 : ajout de la fonction display_historique
//PROJECT: STOCK BDE

//ip du lecteur RFID
var ip_rfid_reader = "http://bde.local:8080/api/uid";

//récupération de l'id de l'utilisateur
document.getElementById("uid_rfid").addEventListener("click",get_uid);

document.getElementById("form_user").addEventListener("submit",save_user);

document.getElementById("list_users").addEventListener("click",utilisateurs);

document.getElementById("search_user").addEventListener("click",search_user);

document.getElementById("cancel").addEventListener("click", reset_form)
//fonctions de conso.js
function rfid(uid){
    console.log("rfid");
    console.log(uid);
    let users=localStorage.getItem("users");
    let uid_form=document.getElementById("uid");
    let username_form=document.getElementById("username");
    let nb_conso_form=document.getElementById("nb_conso");
    let affichage=document.getElementById("conso_history");
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
            //appelle de la fonction pour afficher l'historique des consos de l'utilisateur
            display_historique(uid);
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
            affichage.innerHTML="";
            break;
        case 2:
            username_form.value="";
            nb_conso_form.value="";
            affichage.innerHTML="";
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
    let affichage=document.getElementById("users_list");
    affichage.innerHTML="";
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
    document.getElementById("conso_history").innerHTML="";
}
function display_historique(uid){
    let affichage=document.getElementById("conso_history");
    //récupère toute les clés du local storage
    let keys=Object.keys(localStorage);
    //tout parcourir pour trouver dans lesquel la valeur de l'uid est stockée (clé : user_id) : structure clé:{user_id:uid,"consos":{"up_mojito":{"quantité":1,"nbconso":1,"nom":"7Up Mojito"}},"prix":1}
    let historique=[];
    for (let key of keys){
        //si la clé est un nombre
        if (!isNaN(key)){
            let value=localStorage.getItem(key);
            value=JSON.parse(value);
            if (value["user_id"]==uid){
                historique.push(value);
            }
        }
    }
    //affiche l'historique
    //dans value : {"jour":"6/2/2024","heure":"21:7","consos":{"up_mojito":{"quantité":1,"nbconso":1,"nom":"7Up Mojito"}},"prix":1}
    affichage.innerHTML="";
    //création du tableau dans le html
    tableau=document.createElement("table");
    //entête du tableau
    let ligne=document.createElement("tr");
    let th=document.createElement("th");
    th.innerHTML="Date et heure d'achat";
    ligne.appendChild(th);
    th=document.createElement("th");
    th.innerHTML="Consos acheté et quantité";
    ligne.appendChild(th);
    th=document.createElement("th");
    th.innerHTML="Prix Total";
    ligne.appendChild(th);
    tableau.appendChild(ligne);
    for (let value of historique){
        let date=value["jour"]+" "+value["heure"];
        let consos=value["consos"];
        //récupère les clé de consos
        let keys=Object.keys(consos);
        let noms=[];
        let quantites=[];
        for (let key of keys){
            //récupère le nom de la conso et la quantité
            noms.push(consos[key]["nom"]);
            quantites.push(consos[key]["quantité"]);
        }
        let prix=value["prix"];
        let ligne=document.createElement("tr");
        let td=document.createElement("td");
        td.innerHTML=date;
        ligne.appendChild(td);
        td=document.createElement("td");
        //affichage du nom et de la quantité des consos
        let consos_string="";
        for (let i=0;i<noms.length;i++){
            consos_string+=noms[i]+" : "+quantites[i]+"<br>";
        }
        td.innerHTML=consos_string;
        ligne.appendChild(td);
        td=document.createElement("td");
        td.innerHTML=prix;
        ligne.appendChild(td);
        tableau.appendChild(ligne);
    }
    affichage.appendChild(tableau);
}

function utilisateurs(){
    let users=localStorage.getItem("users");
    let affichage=document.getElementById("users_list");
    affichage.innerHTML="";
    tableau=createTable();
    if (users!=null){
        users=JSON.parse(users);
        let keys=Object.keys(users);
        affichage.innerHTML="";
        for (let key of keys){
            display_utilisateur(tableau,key,users[key])
        }
        affichage.appendChild(tableau);
    }
    else{
        affichage.innerHTML="Aucun utilisateur enregistré";
    }
}

function delete_utilisateur(event){
    let uid=event.target.id;
    let users=localStorage.getItem("users");
    if (users!=null && JSON.parse(users)[uid]!=undefined){
        users=JSON.parse(users);
        delete users[uid];
        localStorage.setItem("users",JSON.stringify(users));
        utilisateurs();
    }
    else{
        alert("Utilisateur introuvable");
    }
}

function affiche_users(event){
    let uid=event.target.id;
    let users=localStorage.getItem("users");
    if (users!=null && JSON.parse(users)[uid]!=undefined){
        users=JSON.parse(users);
        document.getElementById("uid").value=uid;
        document.getElementById("username").value=users[uid]["nom"];
        document.getElementById("nb_conso").value=users[uid]["nb_conso"];
        display_historique(uid);
    }
    else{
        alert("Utilisateur introuvable");
    }
}

function search_user(){
    let affichage=document.getElementById("users_list");
    affichage.innerHTML="";
    tableau=createTable();
    let nom=document.getElementById("username").value;
    let users=localStorage.getItem("users");
    users=JSON.parse(users);
    for (let user in users){
        if (users[user]["nom"].toLowerCase().includes(nom.toLowerCase())){
            display_utilisateur(tableau,user,users[user])

        }
    }
    affichage.appendChild(tableau);
}

function display_utilisateur(tableau,id,user){
    let ligne=document.createElement("tr");
    let td=document.createElement("td");
    td.innerHTML=id;
    ligne.appendChild(td);
    td=document.createElement("td");
    td.innerHTML=user["nom"];
    ligne.appendChild(td);
    td=document.createElement("td");
    td.innerHTML=user["nb_conso"];
    ligne.appendChild(td);

    td=document.createElement("td");
    //ajout d'un bouton pour supprimer l'utilisateur
    let bouton=document.createElement("button");
    bouton.innerHTML="Supprimer";
    bouton.addEventListener("click",delete_utilisateur);
    bouton.id=id;
    td.appendChild(bouton);
    //bouton pour modifier l'utilisateur
    let bouton_modif=document.createElement("button");
    bouton_modif.innerHTML="Modifier";
    bouton_modif.id=id;
    bouton_modif.addEventListener("click",affiche_users);
    td.appendChild(bouton_modif);
    ligne.appendChild(td);
    tableau.appendChild(ligne);
}

function createTable(){
    tableau=document.createElement("table");
    //entête du tableau
    let ligne=document.createElement("tr");
    let th=document.createElement("th");
    th.innerHTML="ID carte";
    ligne.appendChild(th);
    th=document.createElement("th");
    th.innerHTML="Nom d'utilisateur";
    ligne.appendChild(th);
    th=document.createElement("th");
    th.innerHTML="Consos restantes";
    ligne.appendChild(th);
    th=document.createElement("th");
    th.innerHTML="Actions";
    ligne.appendChild(th);
    tableau.appendChild(ligne);
    return tableau;
}

function reset_form(){
    document.getElementById("username").value="";
    document.getElementById("uid").value="";
    document.getElementById("nb_conso").value="";
    document.getElementById("conso_history").innerHTML="";
}