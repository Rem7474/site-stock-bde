//récupère le contenu du local storage
let data=localStorage.getItem("consos");
//si le local storage est vide, initialise une liste vide
if(data==null){
    data={};
}
//sinon, récupère les données du local storage
else{
    data=JSON.parse(data);
}
//affiche les données
console.log(data);
