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
    liste_deroulante();
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
    let prix=parseFloat(event.target.value);
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
    if (listeConsos[idConso]>stock[idConso]["quantité"]){
        alert("Stock insuffisant");
        listeConsos[idConso]=stock[idConso]["quantité"];
        listeAffichage[nomConso]["quantité"]=stock[idConso]["quantité"];
        listeAffichage[nomConso]["prix"]=stock[idConso]["quantité"]*prixConso;
    }
    return listeConsos,listeAffichage;
}
function affichage(data,id="tableau"){
    //affiche des données dans le html
    //récupère la liste des clés du dictionnaire
    let keys=Object.keys(data);
    //supprime le tableau existant
    let tableau=document.getElementById(id);
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
    console.log(event.target[3].value);
    //ajout le stock actuel dans le local storage
    let nom=event.target[0].value;
    let prix=parseFloat(event.target[1].value);
    let prix_achat=parseFloat(event.target[2].value);
    let quantite=parseInt(event.target[3].value);
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
        stock[nom]["prix_achat"]=prix_achat;
    }
    else{
        stock[nom]["quantité"]+=quantite;
        stock[nom]["prix"]=prix;
        stock[nom]["prix_achat"]=prix_achat;
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
function updateproduit(event){
    document.getElementById("id_conso").value=event.target.id;
    document.getElementById("cost_conso").value=event.target.value;
}

function gestion_stock(event){
    let stock=calcul_stock("all");
    conso_calcul=stock[0];
    stock_calcul=stock[1];
    conso_day=stock[2];
    affichage(conso_calcul,"stock_vendu");
    affichage(stock_calcul,"stock_restant");
    //test si event.id == "nb_jour"
    let nb_day=5;
    if(event!=undefined && event.target.id=="nb_jour"){
        nb_day=event.target.value;
    }
    graphique(conso_day,nb_day);
    let courses=localStorage.getItem("stock_courses")
    courses=JSON.parse(courses);
    let nb_consos=prix(courses,conso_calcul);
    console.log("nombre total de conso des courses :");
    console.log(nb_consos[0]);
    console.log("nombre de conso vendues :");
    console.log(nb_consos[1]);
    console.log("nombre de conso restantes :");
    console.log(nb_consos[2]);
    affiche_prix(nb_consos);
}
//fonction pour calculer les ventes réalisées chaque jour et affiché les quantités vendues et le prix total, affichage avec un graphique
function graphique(data_day,nb_day=5){
    //reset le canvas
    document.getElementById("myChart").remove();
    let canvas=document.createElement("canvas");
    canvas.id="myChart";
    document.getElementById("graphique").appendChild(canvas);
    let labels=Object.keys(data_day);
    //trie les labels par ordre décroissant
    labels.sort().reverse();
    let quantite=[];
    let prix=[];
    let day=[];
    let date=new Date();
    let jour=date.getDate()-nb_day;
    let mois=date.getMonth()+1;
    let annee=date.getFullYear();
    let date_jour=jour+"/"+mois+"/"+annee;

    for(let label of labels){
        //check si le jour est dans la limite du nb_day
        if(label>date_jour){
            quantite.push(data_day[label]["quantité"]);
            prix.push(data_day[label]["prix"]*0.8);
            day.push(label);
        }

        

    }
    let ctx = document.getElementById('myChart').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: day,
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
function prix(stock,consos){
    //calcul du prix total du stock
    let prix_stock=0;
    let prix_achat=0;
    for(let conso in stock){
        prix_stock+=stock[conso]["prix"]*stock[conso]["quantité"];
        prix_achat+=stock[conso]["prix_achat"]*stock[conso]["quantité"];
    }
    //calcul du prix total des consos
    let prix_conso=0;
    let prix_achat_conso=0;
    for(let conso in consos){
        prix_conso+=consos[conso]["prix"];
        prix_achat_conso+=stock[conso]["prix_achat"]*consos[conso]["quantité"];
    }
    //calcul du prix total des consos restantes
    let prix_restant=prix_stock-prix_conso;
    //calcul de la marge
    let prix_achat_restant=prix_achat-prix_achat_conso;
    return [prix_stock,prix_conso,prix_restant,prix_achat,prix_achat_conso,prix_achat_restant];
}
function affiche_prix(data){
    let affichage=document.getElementById("prix");
    affichage.innerHTML="Stock total : "+(data[0]*0.8).toFixed(2)+"€<br>Conso vendues : "+(data[1]*0.8).toFixed(2)+"€<br>Conso restantes : "+(data[2]*0.8).toFixed(2)+"€";
    affichage.innerHTML+="</br></br>Stock total (achat) : "+data[3].toFixed(2)+"€<br>Conso vendues (achat) : "+data[4].toFixed(2)+"€<br>Conso restantes (achat) : "+data[5].toFixed(2)+"€";
    affichage.innerHTML+="</br></br>Marge total : "+(data[0]*0.8-data[3]).toFixed(2)+"€<br>Marge vendu : "+(data[1]*0.8-data[4]).toFixed(2)+"€";
}
//fonction pour créer une liste déroulante avec le nombre de jour voulu dans l'affichage du graphique
function liste_deroulante(){
    let liste=document.getElementById("nb_jour");
    //possibilité de choisir entre 1 et 30 jours
    for(let i=1;i<=30;i++){
        let option=document.createElement("option");
        option.value=i;
        option.innerHTML=i;
        liste.appendChild(option);
    }
    //valeur par défaut : 5 jours
    liste.value=5;
    liste.addEventListener("change",gestion_stock);
}
//export local storage en csv
function export_csv(){
    let csv="";
    let keys=Object.keys(localStorage);
    for(let key of keys){
        if(key!="stock_courses"){
            let value=localStorage.getItem(key);
            value=JSON.parse(value);
            csv+=value.jour+";"+value.heure+";";
            for(let conso in value.consos){
                csv+=conso+";"+value.consos[conso]+";";
            }
            csv+="\n";
        }
        else{
            let value=localStorage.getItem(key);
            value=JSON.parse(value);
            csv+="stock_courses; ;";
            for(let conso in value){
                csv+=conso+";"+value[conso]["quantité"]+";"+value[conso]["prix"]+";"+value[conso]["prix_achat"]+";";
            }
            csv+="\n";
        }
    }
    let a=document.createElement("a");
    a.href="data:text/csv;charset=utf-8,"+encodeURI(csv);
    a.target="_blank";
    a.download="export.csv";
    document.body.appendChild(a);
    a.click();
}
//import csv en local storage
function import_csv(){
    let input=document.createElement("input");
    input.type="file";
    input.accept=".csv";
    input.addEventListener("change",function(event){
        let file=event.target.files[0];
        let reader=new FileReader();
        reader.readAsText(file);
        reader.onload=function(){
            let data=reader.result;
            data=data.split("\n");
            for(let ligne of data){
                ligne=ligne.split(",");
                let jour=ligne[0];
                let heure=ligne[1];
                let consos={};
                for(let i=2;i<ligne.length;i+=2){
                    consos[ligne[i]]=ligne[i+1];
                }
                let id=Date.now();
                localStorage.setItem(id,JSON.stringify({"jour":jour,"heure":heure,"consos":consos}));
            }
        }
    });
    document.body.appendChild(input);
    input.click();
}