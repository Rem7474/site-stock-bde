//AUTHOR: REMY CUVELIER
//DATE: 2023.10.27
//PROJECT: STOCK BDE
window.addEventListener("load",update_windows);
window.addEventListener("storage",update_windows);

function update_windows(){
    //appel de la fonction de calcul des stocks
    let stock_courses = localStorage.getItem("stock_courses");
    if (stock_courses==null){
        stock_courses = "{}";
    }
    stock_courses = JSON.parse(stock_courses);
    let prix_achat = get_prix_achat(stock_courses);
    let prix_vente = get_prix_vente(stock_courses);
    let stock_restant = get_stock(stock_courses);
    let prix_stock_restant_achat = get_prix_stock_restant_achat(stock_restant);
    let prix_stock_restant_vente = get_prix_stock_restant_vente(stock_restant);
    let infos_ventes_jours = get_infos_ventes_jours();
    //affichage des stocks
    console.log("stock des courses :");
    console.log(stock_courses);
    console.log("prix d'achat des courses :");
    console.log(prix_achat);
    console.log("prix de vente des courses :");
    console.log(prix_vente);
    console.log("stock restant :");
    console.log(stock_restant);
    console.log("prix d'achat du stock restant :");
    console.log(prix_stock_restant_achat);
    console.log("prix de vente du stock restant :");
    console.log(prix_stock_restant_vente);
    console.log("infos des ventes par jour :");
    console.log(infos_ventes_jours);

}
function get_prix_achat(stock_courses){
    let keys = Object.keys(stock_courses);
    let prix_achat = 0;
    let value;
    for (let key of keys){
        value = stock_courses[key];
        prix_achat += parseFloat(value["prix_achat"])*parseInt(value["quantité"])*0.8;
    }
    return prix_achat.toFixed(2);
}

function get_prix_vente(stock_courses){
    let keys = Object.keys(stock_courses);
    let prix_vente = 0;
    let value;
    for (let key of keys){
        value = stock_courses[key];
        prix_vente += parseFloat(value["prix"])*parseInt(value["quantité"]);
    }
    return prix_vente.toFixed(2);
}
//fonction de conso.js
function get_stock(){
    let stock=localStorage.getItem("stock_courses")
    stock=JSON.parse(stock);
    let keys=Object.keys(localStorage);
    for (let key of keys){
        if (key!="stock_courses"){
            let value=localStorage.getItem(key);
            value=JSON.parse(value);
            for (let conso in value.consos){
                stock[conso]["quantité"]-=value.consos[conso]["quantité"];
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
function get_prix_stock_restant_achat(stock_restant){
    let keys = Object.keys(stock_restant);
    let prix_stock_restant_achat = 0;
    let value;
    for (let key of keys){
        value = stock_restant[key];
        prix_stock_restant_achat += parseFloat(value["prix_achat"])*parseInt(value["quantité"])*0.8;
    }
    return prix_stock_restant_achat.toFixed(2);
}

function get_prix_stock_restant_vente(stock_restant){
    let keys = Object.keys(stock_restant);
    let prix_stock_restant_vente = 0;
    let value;
    for (let key of keys){
        value = stock_restant[key];
        prix_stock_restant_vente += parseFloat(value["prix"])*parseInt(value["quantité"]);
    }
    return prix_stock_restant_vente.toFixed(2);
}

function get_infos_ventes_jours(){
    let keys = Object.keys(localStorage);
    let infos_ventes_jours = {};
    let value;
    for (let key of keys){
        if (key!="stock_courses"){
            value = localStorage.getItem(key);
            value = JSON.parse(value);
            for(let conso in value.consos){
                let quantite=parseInt(value.consos[conso]["quantité"]);
                
                if(infos_ventes_jours[value.jour]==undefined){
                    infos_ventes_jours[value.jour]={};
                    infos_ventes_jours[value.jour]["quantité"]=quantite;
                }
                else{
                    infos_ventes_jours[value.jour]["quantité"]+=quantite;
                }
            }
            infos_ventes_jours[value.jour]["prix"]=parseFloat(value["prix"])*0.8;
        }
    }
    return infos_ventes_jours;
}