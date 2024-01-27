//AUTHOR: REMY CUVELIER
//DATE: 2023.10.27
//PROJECT: STOCK BDE
window.addEventListener("load",update_windows);

function display_stock(){
    let stock = localStorage.getItem("stock_courses");
    if (stock==null){
        stock = "{}";
    }
    stock = JSON.parse(stock);
    let keys = Object.keys(stock);
    for (let key of keys){
        let value = stock[key];
        let badge_quantite = document.querySelector("#"+key+" .badge_stock");
        badge_quantite.innerHTML = value["quantité"];
    }
}


function update_windows(){
    display_stock();
    let boutons=document.getElementsByClassName("conso");
    for (let bouton of boutons){
        bouton.addEventListener("click",update_stock_produit);
    }
    document.getElementById("form_stock").addEventListener("submit",save_stock);
    document.getElementById("delete_stock").addEventListener("click",delete_local_storage);
}
function update_stock_produit(event){
    document.getElementById("id_conso").value=event.currentTarget.id;
    document.getElementById("cost_conso").value=event.currentTarget.value;
    document.getElementById("prix_achat").value=get_prix_achat(event.currentTarget.id);
    document.getElementById("stock").value=get_stock(event.currentTarget.id);
}
function save_stock(event){
    event.preventDefault();
    let formulaire=document.getElementById("form_stock");
    let conso_name=event.target[0].value;
    let nb_conso_vente=parseFloat(event.target[1].value);
    let prix_achat=parseFloat(event.target[2].value);
    let conso_quantite=parseInt(event.target[3].value);
    let stock=localStorage.getItem("stock_courses");
    stock=JSON.parse(stock);
    if(stock==null){
        stock={};
    }
    //test si la conso existe déjà
    if(stock[conso_name]==undefined){
        stock[conso_name]={};
    }
    stock[conso_name]["quantité"]=conso_quantite;
    stock[conso_name]["prix"]=nb_conso_vente;
    stock[conso_name]["prix_achat"]=prix_achat;

    localStorage.setItem("stock_courses",JSON.stringify(stock));
    formulaire.reset();
    display_stock();
}

function get_prix_achat(id_conso){
    let stock = localStorage.getItem("stock_courses");
    if (stock==null){
        stock = "{}";
    }
    let prix_achat;
    stock = JSON.parse(stock);
    if (stock[id_conso]==undefined){
        prix_achat = 0;
    }
    else{
        prix_achat = stock[id_conso]["prix_achat"];
    }
    return prix_achat;
}

function get_stock(id_conso){
    let stock = localStorage.getItem("stock_courses");
    if (stock==null){
        stock = "{}";
    }
    let stock_conso;
    stock = JSON.parse(stock);
    if (stock[id_conso]==undefined){
        stock_conso = 0;
    }
    else{
        stock_conso = stock[id_conso]["quantité"];
    }
    return stock_conso;
}
function delete_local_storage(){
    delete_historique_conso_vendu();
    delete_stock();
    display_stock();
}
function delete_stock(){
    //dans le stock_courses on supprime uniquement les quantités
    //{"bijoucaramel":{"quantité":20,"prix":1,"prix_achat":0.4},"maido":{"quantité":20,"prix":1,"prix_achat":0.3},"cafe":{"quantité":10,"prix":0.5,"prix_achat":0},"pepsi":{"quantité":10,"prix":1,"prix_achat":0},"redbull":{"quantité":10,"prix":2,"prix_achat":0},"lion":{"quantité":10,"prix":1,"prix_achat":0},"pringles_onion":{"quantité":10,"prix":1,"prix_achat":0}}
    let stock = localStorage.getItem("stock_courses");
    if (stock==null){
        stock = "{}";
    }
    stock = JSON.parse(stock);
    let keys = Object.keys(stock);
    for (let key of keys){
        stock[key]["quantité"]=0;
    }
    localStorage.setItem("stock_courses",JSON.stringify(stock));

}
function delete_historique_conso_vendu(){
    //supprime tout les clé sauf "stock_courses" et "users"
    let keys = Object.keys(localStorage);
    for (let key of keys){
        if (key!="stock_courses" && key!="users"){
            localStorage.removeItem(key);
        }
    }
}