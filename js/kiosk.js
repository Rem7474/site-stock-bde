//AUTHOR: REMY CUVELIER
//DATE: 2023.11.06
//PROJECT: STOCK BDE

window.addEventListener("storage",update_windows);
window.addEventListener("load",update_windows);

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