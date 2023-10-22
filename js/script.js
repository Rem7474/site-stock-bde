//test si la page est "index.html"
let stock_calcul={};
let conso_calcul={};
let conso_day={};
let dicoConso={};
let dicoAffichage={};
if(document.title=="Vente de Conso du BDE R&T"){
    //refrech si local storage update
    window.addEventListener("storage",check_stock);
    check_stock();
}
//test si la page est "stock.html"
if(document.title=="Calcul de stock du BDE R&T"){
    gestion_stock();
    window.addEventListener("storage",gestion_stock);
}
if(document.title=="Liste des consos disponibles au BDE R&T"){
    listeconsodispo();
    let boutons=document.getElementsByClassName("conso");
    for (let bouton of boutons){
        bouton.addEventListener("click",updateproduit);
    }
    document.getElementById("form_stock").addEventListener("submit",ajoutstock);
}
function check_stock(){
    let boutons=document.getElementsByClassName("conso");
    //bouton de validation du panier
    document.getElementById("save").addEventListener("click",panier);
    //bouton pour ajouter au panier
    let stock=Object.keys(calcul_stock());
    for (let bouton of boutons){
        bouton.addEventListener("click",panier);
        if (stock.indexOf(bouton.id) < 0){
            //add attribute disabled
            bouton.setAttribute("disabled","disabled");
        }
        else{
            //remove attribute disabled
            bouton.removeAttribute("disabled");
        }
    }
}
function panier(event){
    if (event.target.id=="save"){
        //appel de la fonction save pour enregistrer les données
        save(dicoConso);
        //reset des variables
        dicoConso={};
        dicoAffichage={};
    }
    else{
    //appel de la fonction conso pour créer la liste
    console.log(event);
    let nom=event.target.name;
    let id=event.target.id;
    let prix=parseInt(event.target.value);
    let stock=calcul_stock();
    dicoConso,dicoAffichage=conso(nom,id,prix,dicoConso,dicoAffichage,stock);
    affichage(dicoAffichage);
    }
}
function conso(nomConso,idConso,prixConso,listeConsos,listeAffichage,stock){
    //ajout du nom des consos dans la liste
    
    if(listeConsos[idConso]==undefined){
        listeConsos[idConso]=1;
        listeAffichage[nomConso]={};
        listeAffichage[nomConso]["quantité"]=1;
        listeAffichage[nomConso]["prix"]=prixConso;
    }
    else{
        listeConsos[idConso]+=1;
        listeAffichage[nomConso]["quantité"]+=1;
        listeAffichage[nomConso]["prix"]+=prixConso;
    }
    if (listeConsos[idConso]>stock[idConso]){
        alert("Stock insuffisant");
        listeConsos[idConso]=stock[idConso];
        listeAffichage[nomConso]["quantité"]=stock[idConso];
        listeAffichage[nomConso]["prix"]=stock[idConso]*prixConso;
    }
    return listeConsos,listeAffichage;
}
function affichage(data){
    //affiche des données dans le html
    //récupère la liste des clés du dictionnaire
    let keys=Object.keys(data);
    //supprime le tableau existant
    let tableau=document.getElementById("tableau");
    tableau.innerHTML="";
    let conso_total=0;
    let quantite_total=0;
    let ligne=document.createElement("tr");
    let cellule1=document.createElement("td");
    let cellule2=document.createElement("td");
    let cellule3=document.createElement("td");
    cellule1.innerHTML="Nom";
    cellule2.innerHTML="Quantité";
    cellule3.innerHTML="Prix";
    ligne.appendChild(cellule1);
    ligne.appendChild(cellule2);
    ligne.appendChild(cellule3);
    tableau.appendChild(ligne);
    let quantite;
    let prix;
    console.log(data);
    for (let nomConso in data){
        quantite=data[nomConso]["quantité"];
        prix=data[nomConso]["prix"];
        ligne=document.createElement("tr");
        cellule1=document.createElement("td");
        cellule2=document.createElement("td");
        cellule3=document.createElement("td");
        cellule1.innerHTML=nomConso;
        cellule2.innerHTML=quantite;
        cellule3.innerHTML=prix;
        conso_total+=prix;
        quantite_total+=quantite;
        ligne.appendChild(cellule1);
        ligne.appendChild(cellule2);
        ligne.appendChild(cellule3);
        tableau.appendChild(ligne);
    }
    ligne=document.createElement("tr");
    cellule1=document.createElement("td");
    cellule2=document.createElement("td");
    cellule3=document.createElement("td");
    cellule1.innerHTML="Total";
    cellule2.innerHTML=quantite_total;
    cellule3.innerHTML=(conso_total*0.8).toFixed(2)+"€" + " ("+conso_total+")";
    ligne.appendChild(cellule1);
    ligne.appendChild(cellule2);
    ligne.appendChild(cellule3);
    tableau.appendChild(ligne);

}
function save(listeConsos){
    //enregistrer les données dans le local storage en format JSON en précisant l'heure et la date
    document.getElementById('checkout').classList.remove('anim1');
    let date=new Date();
    let heure=date.getHours()+":"+date.getMinutes();
    let jour=date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
    let consos={};
    consos["jour"]=jour;
    consos["heure"]=heure;
    consos["consos"]=listeConsos;
    //ajout des données dans le local storage avec un id unique
    let id=Date.now();
    localStorage.setItem(id,JSON.stringify(consos));
    affichage(listeConsos);
    stock_calcul=calcul_stock();
    check_stock();

}
function listeconsodispo(){
    //récupère les données du local storage
    //clé pour acceder au stock actuel : "stock_courses"
    //test si le stock existe, s'il n'existe pas, on fait rien
    let stock=localStorage.getItem("stock_courses");
    if(stock==null){
        return;
    }
    stock=JSON.parse(stock);
    affichage(stock);

}
function ajoutstock(event){
    event.preventDefault();
    //reset le formulaire
    let formulaire=document.getElementById("form_stock");
    console.log(event);
    console.log(event.target[0].value);
    console.log(event.target[1].value);
    console.log(event.target[2].value);
    //ajout le stock actuel dans le local storage
    let nom=event.target[0].value;
    let prix=parseInt(event.target[1].value);
    let quantite=parseInt(event.target[2].value);
    let stock=localStorage.getItem("stock_courses");
    stock=JSON.parse(stock);
    if(stock==null){
        stock={};
    }
    //test si la conso existe déjà
    if(stock[nom]==undefined){
        stock[nom]={};
        stock[nom]["quantité"]=quantite;
        stock[nom]["prix"]=prix;
    }
    else{
        stock[nom]["quantité"]+=quantite;
        stock[nom]["prix"]=prix;
    }
    localStorage.setItem("stock_courses",JSON.stringify(stock));
    listeconsodispo();
    formulaire.reset();
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
                let prix=parseInt(value.consos[conso])*stock[conso]["prix"];
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
            stock_restant[consos]["prix"]=stock[consos]["prix"];
        }
        else{
            stock_restant[consos]={};
            stock_restant[consos]["quantité"]=stock[consos]["quantité"]-consommations[consos]["quantité"];
            stock_restant[consos]["prix"]=stock_restant[consos]["quantité"]*stock[consos]["prix"];
        }
        if(stock_restant[consos]<=0){
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
function updateproduit(event){
    document.getElementById("id_conso").value=event.target.id;
    document.getElementById("cost_conso").value=event.target.value;
}

function gestion_stock(){
    let stock=calcul_stock("all");
    conso_calcul=stock[0];
    stock_calcul=stock[1];
    conso_day=stock[2];
    affichage(stock_calcul);
    graphique(conso_day);
    //affichage(conso_calcul);
}
//fonction pour calculer les ventes réalisées chaque jour et affiché les quantités vendues et le prix total, affichage avec un graphique
function graphique(data_day){
    //reset le canvas
    document.getElementById("myChart").remove();
    let canvas=document.createElement("canvas");
    canvas.id="myChart";
    document.getElementById("graphique").appendChild(canvas);
    let labels=Object.keys(data_day);
    let quantite=[];
    let prix=[];
    for(let label of labels){
        quantite.push(data_day[label]["quantité"]);
        prix.push(data_day[label]["prix"]*0.8);
    }
    let ctx = document.getElementById('myChart').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Quantité',
                data: quantite,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor:'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Prix',
                data: prix,
                backgroundColor: 'rgba(99, 255, 132, 0.2)',
                borderColor:'rgba(99, 255, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            return value + '€';
                        }
                    }
                }
            }
        }
    });
}
//rajout du calcul entre le total des ventes et le prix total des consos
    