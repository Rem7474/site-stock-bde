//AUTHOR: REMY CUVELIER
//DATE: 2023.10.27
//PROJECT: STOCK BDE
window.addEventListener("load",init_page);
window.addEventListener("storage",update_windows);
function init_page(){
    let liste=document.getElementById("nb_jour");
    //possibilité de choisir entre 1 et 30 jours
    for(let i=1;i<=30;i++){
        let option=document.createElement("option");
        option.value=i;
        option.innerHTML=i;
        if (i==5){
            option.selected="selected";
        }
        liste.appendChild(option);
    }
    liste.addEventListener("change",update_windows);

    let liste2=document.getElementById("id_conso");
    //reset des options
    liste2.innerHTML="";
    //possibilité de choisir parmis toutes les consos
    let stock_courses=localStorage.getItem("stock_courses");
    stock_courses=JSON.parse(stock_courses);
    let keys=Object.keys(stock_courses);
    for(let key of keys){
        let option=document.createElement("option");
        option.value=key;
        option.innerHTML=key;
        liste2.appendChild(option);
    }
    liste2.addEventListener("change",update_windows);
    update_windows();
}
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
    //affichage des stocks
    graphique(infos_ventes_jours,document.getElementById("nb_jour").value);
    graphique_conso(get_infos_ventes_produit(),document.getElementById("id_conso").value,document.getElementById("nb_jour").value);
    tableau_stock_restant(stock_restant,prix_stock_restant_vente);
    update_html(prix_stock_restant_achat,prix_stock_restant_vente,prix_achat,prix_vente);
}
function get_prix_achat(stock_courses){
    let keys = Object.keys(stock_courses);
    let prix_achat = 0;
    let value;
    for (let key of keys){
        value = stock_courses[key];
        prix_achat += parseFloat(value["prix_achat"])*parseInt(value["quantité"]);
    }
    return prix_achat.toFixed(2);
}

function get_prix_vente(stock_courses){
    let keys = Object.keys(stock_courses);
    let prix_vente = 0;
    let value;
    for (let key of keys){
        value = stock_courses[key];
        prix_vente += parseFloat(value["prix"])*parseInt(value["quantité"])*0.8;
    }
    return prix_vente.toFixed(2);
}
function get_prix_vendu(){
    let keys = Object.keys(localStorage);
    let prix_vendu = 0;
    let value;
    for (let key of keys){
        if (key!="stock_courses" && key!="users"){
            value = localStorage.getItem(key);
            value = JSON.parse(value);
            prix_vendu += value["prix"]*0.8;
        }
    }
    return prix_vendu;
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
        prix_stock_restant_achat += parseFloat(value["prix_achat"])*parseInt(value["quantité"]);
    }
    return prix_stock_restant_achat.toFixed(2);
}

function get_prix_stock_restant_vente(stock_restant){
    let keys = Object.keys(stock_restant);
    let prix_stock_restant_vente = 0;
    let value;
    for (let key of keys){
        value = stock_restant[key];
        prix_stock_restant_vente += parseFloat(value["prix"])*parseInt(value["quantité"])*0.8;
    }
    return prix_stock_restant_vente.toFixed(2);
}

function get_infos_ventes_jours(){
    let keys = Object.keys(localStorage);
    let infos_ventes_jours = {};
    let value;
    for (let key of keys){
        if (key!="stock_courses" && key!="users"){
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
            //ICI VERIFIER AVANT SI LA CLE EXISTE
            if (infos_ventes_jours[value.jour]["prix"]==undefined){
                infos_ventes_jours[value.jour]["prix"]=parseFloat(value["prix"])*0.8;
            }
            else{
                infos_ventes_jours[value.jour]["prix"]+=parseFloat(value["prix"])*0.8;
            }
        }
    }
    return infos_ventes_jours;
}

function get_infos_ventes_produit(){
    let keys = Object.keys(localStorage);
    let infos_ventes_produit = {};
    let value;
    for (let key of keys){
        if (key!="stock_courses" && key!="users"){
            value = localStorage.getItem(key);
            value = JSON.parse(value);
            for(let conso in value.consos){
                let quantite=parseInt(value.consos[conso]["quantité"]);
                if (infos_ventes_produit[value.jour]==undefined){
                    infos_ventes_produit[value.jour]={};
                }
                if(infos_ventes_produit[value.jour][conso]==undefined){
                    infos_ventes_produit[value.jour][conso]={};
                    infos_ventes_produit[value.jour][conso]["quantité"]=quantite;
                    infos_ventes_produit[value.jour][conso]["prix"]=parseFloat(value["prix"])*0.8;
                }
                else{
                    infos_ventes_produit[value.jour][conso]["quantité"]+=quantite;
                    infos_ventes_produit[value.jour][conso]["prix"]+=parseFloat(value["prix"])*0.8;
                }
            }
        }
    }
    return infos_ventes_produit;
}
function graphique(data_day,nb_day){
    //reset le canvas
    document.getElementById("myChart").remove();
    let canvas=document.createElement("canvas");
    canvas.id="myChart";
    document.getElementById("graphique").appendChild(canvas);
    let infos = TrieConsos(data_day,nb_day,false);
    let quantite=infos[0];
    let day=infos[1];
    let prix=infos[2];
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

function tableau_stock_restant(stock,prix_vente){
        //affichage du panier temporaire
        let div=document.getElementById("stock_restant");
        div.innerHTML="";
        let panier=document.createElement("table");
        panier.innerHTML="";
        panier.className="table_stock";
        let ligne=document.createElement("tr");
        let cellule1=document.createElement("td");
        cellule1.className="colonne1";
        let cellule2=document.createElement("td");
        cellule2.className="colonne2";
        cellule1.innerHTML="Nom";
        cellule2.innerHTML="Qté";
        ligne.appendChild(cellule1);
        ligne.appendChild(cellule2);
        panier.appendChild(ligne);
    
        for (let conso in stock){
            ligne=document.createElement("tr");
            cellule1=document.createElement("td");
            cellule1.className="colonne1";
            cellule2=document.createElement("td");
            cellule2.className="colonne2";
            cellule1.innerHTML=conso;
            cellule2.innerHTML=stock[conso]["quantité"];
            ligne.appendChild(cellule1);
            ligne.appendChild(cellule2);
            panier.appendChild(ligne);
        }
        ligne=document.createElement("tr");
        cellule1=document.createElement("td");
        cellule2=document.createElement("td");
        cellule1.innerHTML="Total";
        cellule2.innerHTML=prix_vente+"€";
        ligne.appendChild(cellule1);
        ligne.appendChild(cellule2);
        panier.appendChild(ligne);
        div.appendChild(panier);
}
function trierParDate(a, b) {
    // Convertir les dates au format "jj/mm/aaaa" en objets Date pour la comparaison
    const dateA = new Date(a.split('/').reverse().join('/'));
    const dateB = new Date(b.split('/').reverse().join('/'));

    // Comparer les dates et retourner le résultat de la comparaison
    return dateA - dateB;
}
function update_html(prix_stock_restant_achat,prix_stock_restant_vente,prix_achat,prix_vente){
    let marge_total=prix_vente-prix_achat;
    let prix_vendu=get_prix_vendu();
    let prix_achat_vendu=prix_achat-prix_stock_restant_achat;
    let pourcentage_prix_vendu=(100-(prix_stock_restant_vente/prix_vente*100)).toFixed(2);
    let pourcetage_marge=(marge_total/prix_achat*100).toFixed(2);
    let marge_actuel=prix_vendu-prix_achat_vendu;
    let texte="Prix d'achat total : "+prix_achat+"€<br>";
    texte+="Prix de vente total : "+prix_vente+"€<br>";
    texte+="Marge total des courses: "+marge_total.toFixed(2)+"€<br>";
    texte+="Prix d'achat du stock restant : "+prix_stock_restant_achat+"€<br>";
    texte+="Prix de vente du stock restant : "+prix_stock_restant_vente+"€<br>";
    texte+="Pourcentage de marge moyenne : "+pourcetage_marge+"%<br>";
    texte+="Prix d'achat des courses vendues : "+prix_achat_vendu.toFixed(2)+"€<br>";
    texte+="Marge actuel : "+marge_actuel.toFixed(2)+"€<br>";
    texte+="Total vendu : "+(prix_vendu).toFixed(2)+"€<br>";
    texte+="Ventes restant : "+(prix_vente-prix_vendu).toFixed(2)+"€<br>";
    texte+="Pourcentage vendu : "+pourcentage_prix_vendu+"%<br>";
    document.getElementById("prix").innerHTML=texte;
}

function graphique_conso(data_day,conso,nb_day){
    //reset le canvas
    document.getElementById("myChart2").remove();
    let canvas=document.createElement("canvas");
    canvas.id="myChart2";
    document.getElementById("graphique_conso").appendChild(canvas);
    //appelle fonction trie labels
    let infos = TrieConsos(data_day,nb_day,true,conso);
    let quantite=infos[0];
    let day=infos[1];
    //créer une courbe avec un point du nombre de conso par jour
    let ctx = document.getElementById('myChart2').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: day,
            datasets: [{
                label: 'Quantité',
                data: quantite,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor:'rgba(255, 99, 132, 1)',
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
                            return value;
                        }
                    }
                }
            }
        }
    });
}

function TrieConsos(data, days, donnes, conso){
    let labels=Object.keys(data);
    //trie les labels par ordre décroissant
    labels=labels.sort(trierParDate).reverse();
    let quantite=[];
    let prix=[];
    let day=[];
    let date=new Date();
    let jour=date.getDate()-days;
    if (jour<10){
        jour="0"+jour;
    }
    let mois=date.getMonth()+1;
    if (mois<10){
        mois="0"+mois;
    }
    let annee=date.getFullYear();
    let date_jour="".concat(annee,mois,jour);

    for(let label of labels){
        //check si le jour est dans la limite du nb_day
        //changement du format de la date de jj/mm/aaaa en aaaammjj
        let date_split=label.split("/");
        if (date_split[0]<10){
            date_split[0]="0"+date_split[0];
        }
        if (date_split[1]<10){
            date_split[1]="0"+date_split[1];
        }
        let date_format=date_split[2]+date_split[1]+date_split[0];
        date_test=date_format;
        if(date_test>date_jour){
            if (donnes){
                if (data[label][conso] != undefined ){
                    quantite.push(data[label][conso]["quantité"]);
                    prix.push(data[label][conso]["prix"]);
                    day.push(label);
                }
            }
            else{
                if (data[label] != undefined ){
                    quantite.push(data[label]["quantité"]);
                    prix.push(data[label]["prix"]);
                    day.push(label);
                }
            }
            
            
        }
    }
    return [quantite, day, prix];
}
