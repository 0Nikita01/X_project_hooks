import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDYV_WEsMNCAD_FFuPvivgEQ1reZuSYXkI",
    authDomain: "party-game-2acf6.firebaseapp.com",
    databaseURL: "https://party-game-2acf6-default-rtdb.firebaseio.com",
    projectId: "party-game-2acf6",
    storageBucket: "party-game-2acf6.appspot.com",
    messagingSenderId: "945945799917",
    appId: "1:945945799917:web:baeb4b1b5e0e78c4fa70e4"
};

firebase.initializeApp(firebaseConfig);

class Firebase {
    constructor() {
        this.fire = firebase;
        this.database = this.fire.database();
    }

    getDataSocket = (key, cb) => {
        let path = 'data/' + key + '/usersdata/';
        this.database.ref('data/').on('value', (snapshot) => {
            cb(snapshot.val());
        })
    }

    postData = (typeAction, oldKey, key, data, type = false, number = false, allUsers = {}) => {
        
        if (typeAction === 'status') {
            this.database.ref(`data/${oldKey}/usersdata/${key}/tasks/${type}/status/${number}`).set(data);
        }

        if (typeAction === 'score') {
            this.database.ref(`data/${oldKey}/usersdata/${key}/score`).set(data);
        }

        if (typeAction === 'playerStatus') {
            this.database.ref(`data/${oldKey}/usersdata/${key}/status`).set(data);
        }

        if (typeAction === 'setGameHost') {
            this.database.ref(`data/${oldKey}/usersdata/${key}/mafia/host`).set(data);
        }
        
        if (typeAction === 'setGameChecked') {
            this.database.ref(`data/${oldKey}/usersdata/${key}/mafia/checked`).set(data);
        }

        if (typeAction === 'setUserCard') {
            this.database.ref(`data/${oldKey}/usersdata/${key}/mafia/attachment`).set(data);
        }
        if (typeAction === 'setGameReady') {
            this.database.ref(`data/${oldKey}/usersdata/${key}/mafia/isReady`).set(data);
        }
        if (typeAction === 'setCurentTarget') {
            this.database.ref(`data/${oldKey}/usersdata/${key}/mafia/target`).set(data);
        }
        
        if (typeAction === 'setStartTimer') {

            allUsers.forEach((item,index)=>{
                const id = Object.entries(item[1]['usersdata'])[0][0];
                this.database.ref(`data/${item[0]}/usersdata/${id}/mafia/startTimer`).set(data);
            })
            
        }
        if (typeAction === 'resetMafiaData') {
            const arr = ['attachment', 'checked', 'faceUp', 'host', 'isReady', 'won', 'startTimer', 'offline', 'shortTimer'];

            console.log("call resetMafiaData");
            
            for (let i = 0; i < arr.length; i++) {
                this.database.ref(`data/${oldKey}/usersdata/${key}/mafia/${arr[i]}`).set(false);
            }
            this.database.ref(`data/${oldKey}/usersdata/${key}/tasks/common/status/2`).set("0");
        }
	}

    getDataOnce = async (key) => {
        return await this.database.ref(`data/${key}/usersdata/`).once('value').then(snapshot => snapshot.val());
    }
}

const FirebaseClass = new Firebase();

export default FirebaseClass;