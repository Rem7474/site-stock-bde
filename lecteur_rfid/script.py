#AUTHOR: REMY CUVELIER
#DATE: 2023.10.27
#PROJECT: STOCK BDE
#DESCRIPTION: le script se comporte comme un serveur, d'un côté il attend un http get pour afficher le dernier id de carte rfid, de l'autre il lit en continu le lecteur rfid et enregistre le dernier id lu dans une variable
#VERSION: 1.0
#utilisation de la librairie SimpleMFRC522 pour lire le lecteur rfid
#utilisation de la librairie flask pour créer un serveur http

import RPi.GPIO as gpio
from mfrc522 import SimpleMFRC522
from flask import Flask, jsonify
import threading
import time
import signal
import sys

# création de l'application flask
app = Flask(__name__)

# création du lecteur rfid
reader = SimpleMFRC522()

# création de la variable qui va contenir le dernier id lu
rfid_id = "temp"  

# route pour afficher le dernier id lu
@app.route('/api/uid')
def get_id():
    global rfid_id
    try:
        rfid_id = reader.read_id_no_block()
        print(rfid_id)
    except Exception as e:
        print("Erreur lors de la lecture RFID : ", str(e))
        time.sleep(0.1)
    dico={"uid":rfid_id}
    return jsonify(dico)


# on lance l'application flask
if __name__ == '__main__':
    app.run(host='bde.local', port=8080, debug=True)
