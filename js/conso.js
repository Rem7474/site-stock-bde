//variables globales
var Temp_Local_Storage={};
window.addEventListener("storage",update_windows);

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
    let prixConso=parseFloat(event.target.getAttribute("value"));
    if (Temp_Local_Storage[idconso]==undefined){
        Temp_Local_Storage[idconso]={};
        Temp_Local_Storage[idconso]["quantité"]=1;
        Temp_Local_Storage[idconso]["prix"]=prixConso;
        Temp_Local_Storage[idconso]["nom"]=nameConso;
    }
    else{
        Temp_Local_Storage[idconso]["quantité"]+=1;
        Temp_Local_Storage[idconso]["prix"]+=prixConso;
        
    }
}
function prix_panier(){
    let prix=0;
    //calcul du prix du panier temporaire, et déduit les reductions appliquables
    for (let conso in Temp_Local_Storage){
        prix+=Temp_Local_Storage[conso]["prix"];
    }
    return prix;
}