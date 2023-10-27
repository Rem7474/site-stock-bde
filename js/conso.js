//AUTHOR: REMY CUVELIER
//DATE: 2023.10.27
//PROJECT: STOCK BDE

//variables globales
var Temp_Local_Storage={};
window.addEventListener("storage",update_windows);
window.addEventListener("load",update_windows);
document.getElementById("save").addEventListener("click",save_panier);
document.getElementById("cancel").addEventListener("click",vider_panier);
function update_windows(){
    let stock = stock_actuel();
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
                stock[conso]["quantité"]-=value.consos[conso];
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
    //définition des variables
    let boisson=0;
    let snack=0;
    let reduc=0;
    for (let conso in Temp_Local_Storage){
        total_conso+=Temp_Local_Storage[conso]["nbconso"];
        if (Temp_Local_Storage[conso]["formule"]=="snack_ptit_dej"){
            snack+=Temp_Local_Storage[conso]["quantité"];
        }
        else if (Temp_Local_Storage[conso]["formule"]=="boisson_ptit_dej"){
            boisson+=Temp_Local_Storage[conso]["quantité"];
        }
    }
    //calcul des réductions
    //si nombre paire de madeleine + 1 boissons par nombre paire de madeleine
    if (snack%2==0 && boisson==Math.floor(snack/2)){
        //division entière du nombre de madeleine par 2
        reduc+=Math.floor(snack/2);
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
    consos["jour"]=jour;
    consos["heure"]=heure;
    consos["consos"]=Temp_Local_Storage;
    consos["prix"]=prix_panier()[0];
    //ajout des données dans le local storage avec un id unique
    let id=Date.now();
    localStorage.setItem(id,JSON.stringify(consos));
    vider_panier();
}
function vider_panier(){
    document.getElementById('checkout').classList.remove('anim1');
    setTimeout(() => {
        Temp_Local_Storage={};
    }, 250);
}