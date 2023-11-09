function save_localStorage() {
    let keys = Object.keys(localStorage);

    let donneesJSON = {};
    keys.forEach(function(cle) {
        donneesJSON[cle] = localStorage.getItem(cle);
    });

    let donneesJSONString = JSON.stringify(donneesJSON);

    let lienTelechargement = document.createElement('a');
    lienTelechargement.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(donneesJSONString);
    lienTelechargement.download = 'localstorage.json';

    document.body.appendChild(lienTelechargement);
    lienTelechargement.click();
    document.body.removeChild(lienTelechargement);

}

function import_localStorage() {
    localStorage.clear();
    let fichier = event.target.files[0];
    let lecteur = new FileReader();

    lecteur.onload = function(e) {
        let donneesJSON = JSON.parse(e.target.result);
        // Mettre à jour le localStorage avec les données importées
        for (let cle in donneesJSON) {
            localStorage.setItem(cle, donneesJSON[cle]);
        }
        console.log('Données importées avec succès depuis le fichier.');
    };

    lecteur.readAsText(fichier);
}