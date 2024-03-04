//AUTHOR: REMY CUVELIER
//DATE: 2023.10.27
//PROJECT: STOCK BDE

//variables globales
var Temp_Local_Storage={};
const IP_RFID = "http://bde.local:8080/api/uid";

window.addEventListener("storage",update_windows);
window.addEventListener("load",update_windows);

document.getElementById("save").addEventListener("click",save_panier);
document.getElementById("cancel").addEventListener("click",vider_panier);
document.getElementById("uid_rfid").addEventListener("click",get_uid);
document.getElementById("search_form").addEventListener("submit",search_user);
function update_windows(){
    console.log("actualisation de la page");
    
    let stock = stock_actuel();
    console.log(stock);
    //liste des boutons de la page
    let boutons=document.getElementsByClassName("conso");
    for (let bouton of boutons){
        let idconso=bouton.getAttribute("id");
        if (stock[idconso]==undefined){
            bouton.setAttribute("disabled","disabled");
        }
        else{
            bouton.addEventListener("click",add_panier);
            bouton.removeAttribute("disabled");
        }
    }
}
function stock_actuel(){
    let stock=localStorage.getItem("stock_courses")
    stock=JSON.parse(stock);
    let keys=Object.keys(localStorage);
    for (let key of keys){
        if (key!="stock_courses"){
            let value=localStorage.getItem(key);
            value=JSON.parse(value);
            for (let conso in value.consos){
                stock[conso]["quantité"]-=parseInt(value.consos[conso]["quantité"]);
            }
        }
    }
    for (let conso in stock){
        if (stock[conso]["quantité"]<=0){
            delete stock[conso];
        }
    }
    return stock;
}
function add_panier(event){
    //ajout de la consommation au panier a afficher (Affichage_Panier) et au panier temporaire (Temp_Local_Storage)
    //si il est déjà présent on incrémente la quantité
    //sinon on le rajoute
    let idconso=event.target.getAttribute("id");
    let nameConso=event.target.getAttribute("name");
    let nbConso=parseFloat(event.target.getAttribute("value"));
    if (Temp_Local_Storage[idconso]==undefined){
        Temp_Local_Storage[idconso]={};
        Temp_Local_Storage[idconso]["quantité"]=1;
        Temp_Local_Storage[idconso]["nbconso"]=nbConso;
        Temp_Local_Storage[idconso]["nom"]=nameConso;
        if (event.target.getAttribute("data-formule")!=null){
            Temp_Local_Storage[idconso]["formule"]=event.target.getAttribute("data-formule");
            console.log("formule ajoutée")
        }
    }
    else if (stock_actuel()[idconso]["quantité"]==undefined){
        alert("Vous n'avez plus de stock pour cette consommation");
    }
    else if (Temp_Local_Storage[idconso]["quantité"]<stock_actuel()[idconso]["quantité"]){
        Temp_Local_Storage[idconso]["quantité"]+=1;
        Temp_Local_Storage[idconso]["nbconso"]+=nbConso;
    }
    else{
        alert("Vous avez atteint la limite de stock pour cette consommation");
    }
    Affichage_Panier();
    console.log(Temp_Local_Storage);
}
function prix_panier(){
    let total_conso=0;
    //calcul du prix du panier temporaire, et déduit les reductions appliquables
    let prix_manuel=document.getElementById("total_panier").value;
    //test si la valeur est un nombre
    if (!isNaN((prix_manuel)) && (prix_manuel!="")){
        return [parseFloat(prix_manuel),0];
    }
    //définition des variables
    let boisson=0;
    let snack=0;
    let reduc=0;
    let prixboissons=0;
    for (let conso in Temp_Local_Storage){
        total_conso+=Temp_Local_Storage[conso]["nbconso"];
        if (Temp_Local_Storage[conso]["formule"]=="snack_ptit_dej"){
            snack+=Temp_Local_Storage[conso]["quantité"];
        }
        else if (Temp_Local_Storage[conso]["formule"]=="boisson_ptit_dej"){
            boisson+=Temp_Local_Storage[conso]["quantité"];
            prixboissons+=Temp_Local_Storage[conso]["nbconso"];
        }
    }
    //calcul des réductions
    //formule ptit déj : 2 snack + 1 boisson = 2conso
    //calcul du nombre de formule ptit dej dans le panier
    if (snack>=2 && boisson>=1){
        reduc=Math.min(Math.floor(snack/2),prixboissons);
    }
    return [total_conso,reduc];
}
function Affichage_Panier(){
    //affichage du panier temporaire
    let div=document.getElementById("tableau");
    div.innerHTML="";
    let panier=document.createElement("table");
    panier.innerHTML="";
    panier.className="table";
    let total=prix_panier();
    let nb_consos_total=total[0];
    let reduc=total[1];
    
    let ligne=document.createElement("tr");
    let cellule1=document.createElement("td");
    cellule1.className="colonne1";
    let cellule2=document.createElement("td");
    cellule2.className="colonne2";
    let cellule3=document.createElement("td");
    cellule3.className="colonne3";
    cellule1.innerHTML="Nom";
    cellule2.innerHTML="Qté";
    cellule3.innerHTML="Prix";
    ligne.appendChild(cellule1);
    ligne.appendChild(cellule2);
    ligne.appendChild(cellule3);
    panier.appendChild(ligne);

    for (let conso in Temp_Local_Storage){
        ligne=document.createElement("tr");
        cellule1=document.createElement("td");
        cellule1.className="colonne1";
        cellule2=document.createElement("td");
        cellule2.className="colonne2";
        cellule3=document.createElement("td");
        cellule3.className="colonne3";
        cellule1.innerHTML=Temp_Local_Storage[conso]["nom"];
        cellule2.innerHTML=Temp_Local_Storage[conso]["quantité"];
        cellule3.innerHTML=Temp_Local_Storage[conso]["nbconso"];
        ligne.appendChild(cellule1);
        ligne.appendChild(cellule2);
        ligne.appendChild(cellule3);
        panier.appendChild(ligne);
    }
    ligne=document.createElement("tr");
    cellule1=document.createElement("td");
    cellule2=document.createElement("td");
    cellule3=document.createElement("td");
    cellule1.innerHTML="Total";
    cellule2.innerHTML=nb_consos_total+" conso";
    cellule3.innerHTML=((nb_consos_total-reduc)*0.8).toFixed(2)+"€";
    ligne.appendChild(cellule1);
    ligne.appendChild(cellule2);
    ligne.appendChild(cellule3);
    panier.appendChild(ligne);
    div.appendChild(panier);
}

function save_panier(){
    //enregistrer les données dans le local storage en format JSON en précisant l'heure et la date
    let date=new Date();
    let heure=date.getHours()+":"+date.getMinutes();
    let jour=date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
    let consos={};
    let total=prix_panier();
    consos["jour"]=jour;
    consos["heure"]=heure;
    consos["consos"]=Temp_Local_Storage;
    consos["prix"]=total[0]-total[1];
    let user_id=document.getElementById('username').getAttribute("data-uid")
    if (user_id!=null){
        consos["user_id"]=user_id;
        //retrait des conso de l'utilisateur
        let users=localStorage.getItem("users");
        users=JSON.parse(users);
        if (users[user_id]["nb_conso"]<consos["prix"]){
            alert("Vous n'avez pas assez de conso pour effectuer cet achat");
            return;
        }
        else{
            users[user_id]["nb_conso"]-=consos["prix"];
            localStorage.setItem("users",JSON.stringify(users));
        }
    }
    //ajout des données dans le local storage avec un id unique
    let id=Date.now();
    localStorage.setItem(id,JSON.stringify(consos));
    vider_panier();
    update_windows();
}
function vider_panier(){
    document.getElementById('checkout').classList.remove('anim1');
    setTimeout(() => {
        Temp_Local_Storage={};
        document.getElementById("username").value="";
        document.getElementById("username").removeAttribute("data-uid");
        document.getElementById("total_panier").value="";
        document.getElementById("search").value="";
        document.getElementById("result_users").innerHTML="";
    }, 250);
}
function rfid(uid){
    console.log("rfid");
    console.log(uid);
    let users=localStorage.getItem("users");
    if (uid!=null && users!=undefined){
        //recherche de l'utilisateur dans le local storage
        
        users=JSON.parse(users);
        if (users[uid]!=undefined){
            //si l'utilisateur est trouvé, on affiche le panier
            document.getElementById('username').value=users[uid]["nom"]+" : "+users[uid]["nb_conso"]+" conso";
            document.getElementById('username').setAttribute("data-uid",uid);
        }
        else{
            alert("Vous n'êtes pas autorisé à effectuer des achats");
        }
    }
    else{
        alert("Le badge ou l'utilisateur n'a pas été trouvé");
    }
}
function get_uid(){
    //requète AJAX pour récupérer l'uid du badge
    let uid;
    let xhr=new XMLHttpRequest();
    xhr.open("GET",IP_RFID);
    xhr.responseType="json";
    xhr.onload=function(){
        if (xhr.readyState===xhr.DONE){
            if (xhr.status===200){
                uid=xhr.response.uid;
                console.log(uid);
                rfid(uid);
            }
            else{
                alert("Impossible de joindre le lecteur RFID");
            }
        }
    }
    xhr.send();
}

function search_user(event){
    event.preventDefault();
    let affichage=document.getElementById("result_users");
    affichage.innerHTML="";
    let nom=document.getElementById("search").value;
    let users=localStorage.getItem("users");
    users=JSON.parse(users);
    for (let user in users){
        if (users[user]["nom"].toLowerCase().includes(nom.toLowerCase())){
            let ligne=document.createElement("p");
            ligne.innerHTML=users[user]["nom"]+" : "+users[user]["nb_conso"]+" conso";
            ligne.setAttribute("data-uid",user);
            ligne.addEventListener("click",select_user);
            ligne.className="select_user";
            affichage.appendChild(ligne);
        }
    }
}

function select_user(event){
    let user=event.target.getAttribute("data-uid");
    document.getElementById('username').value=event.target.innerHTML;
    document.getElementById('username').setAttribute("data-uid",user);
    document.getElementById("result_users").innerHTML="";
    document.getElementById("search").value="";
}