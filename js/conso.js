window.addEventListener("storage",check_conso_en_stock);

function check_conso_en_stock(){
    let stock = stock_actuel();
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
                if (stock[conso]["quantité"]<=0){
                    delete stock[conso];
                    console.log("suppression de "+conso);
                }
            }
        }
    }
    console.log(stock);
    return stock;
}

function calcul_stock(details){
    let consommations={};
    let stock_restant={};
    let stock=localStorage.getItem("stock_courses")
    stock=JSON.parse(stock);
    let conso_by_day={};
    //récupère les données du local storage
    let keys=Object.keys(localStorage);    
    //stock actuel :
    console.log("stock actuel :")
    console.log(stock);
    //calcul des consommations
    for (let key of keys){
        if (key!="stock_courses"){
            let value=localStorage.getItem(key);
            value=JSON.parse(value);
            //récupère le dictionnaire des consos pour afficher les données
            for(let conso in value.consos){
                let quantite=parseInt(value.consos[conso]);
                let prix=parseFloat(value.consos[conso])*stock[conso]["prix"];
                if(conso_by_day[value.jour]==undefined){
                    conso_by_day[value.jour]={};
                    conso_by_day[value.jour]["quantité"]=quantite;
                    conso_by_day[value.jour]["prix"]=prix;
                }
                else{
                    conso_by_day[value.jour]["quantité"]+=quantite;
                    conso_by_day[value.jour]["prix"]+=prix;
                }
                if(consommations[conso]==undefined){
                    consommations[conso]={};
                    consommations[conso]["quantité"]=quantite;
                    consommations[conso]["prix"]=prix;
                }
                else{
                    consommations[conso]["quantité"]+=quantite;
                    consommations[conso]["prix"]+=prix;
                }
            }
        }
    }


    console.log("consommations :");
    console.log(consommations);
    console.log("consommations by day :");
    console.log(conso_by_day);
    
    for (let consos in stock){
        if(consommations[consos]==undefined){
            stock_restant[consos]={};
            stock_restant[consos]["quantité"]=stock[consos]["quantité"];
            stock_restant[consos]["prix"]=stock[consos]["prix"]*stock[consos]["quantité"];
        }
        else{
            stock_restant[consos]={};
            stock_restant[consos]["quantité"]=stock[consos]["quantité"]-consommations[consos]["quantité"];
            stock_restant[consos]["prix"]=stock_restant[consos]["quantité"]*stock[consos]["prix"];
        }
        if(stock_restant[consos]["quantité"]<=0){
            //supprime la clé si le stock est vide
            delete stock_restant[consos];
        }

    }
    console.log("stock restant :");
    console.log(stock_restant);
    switch(details){
        case "consommations":
            console.log("consommations");
            return consommations;
            break;
        case "stock_restant":
            console.log("stock restant");
            return stock_restant;
            break;
        case "conso_by_day":
            console.log("conso by day");
            return conso_by_day;
            break;
        case "all":
            console.log("all");
            return [consommations,stock_restant,conso_by_day];
            break;
        default:
            return stock_restant;
            break;
    }
}
