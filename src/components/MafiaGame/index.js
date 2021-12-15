import { createRef, useContext, useEffect, useRef, useState } from "react";
import s from './style.module.css';
import cn from 'classnames';
import { NotificationManager } from 'react-notifications';
import { FireBaseContext } from "../../context/firebaseContext";
import { useSelector } from "react-redux";
import user, { selectLocalID } from '../../store/user';
import cardFront from '../../assets/img/front_side.png';
import copCard from '../../assets/img/back_cop.png';
import mafiaCard from '../../assets/img/back_mafia.png';
import docCard from '../../assets/img/back_doc.png';
import putanaCard from '../../assets/img/back_putana.png';
import civCard from '../../assets/img/back_civilian.png';
import Modal from "../Modal";
import SplashScreen from '../SplashScreen';

const MafiaGame = ({userdata, localID, data, modalData, handleExit}) => {
    const firebase = useContext(FireBaseContext);
    const [cardActive, setCardActive] = useState(false);
    const [isCardHidden, setCardHidden] = useState(false);
    const [isActiveSplashScreen, setIsActiveSplashScreen] = useState(true);
    const [isStartGame, setIsStartGame] = useState(false);
    const [kolReadyUsers, setKolReadyUsers] = useState(0);
    const [activeGame, setActiveGame] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(false);
    const [timer, setTimer] = useState(-1);
    const [timesOfDay, setTimesOfDay] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const [role, setRole] = useState(null);
    const [gameAvatar, setGameAvatar] = useState(null);

    const [showSplash, setShowSplash] = useState(false);
    const [splashText, setSplashText] = useState(null);

    const splash = useRef(null);
    const splashStart = useRef(null);

    const gameTimer = (time) => {
        const timer = setInterval(() => {
            if (time < 0) {
                clearInterval(timer);
            }

            setTimer(time--);
        }, 1000)
    }
/*
    useEffect(() => {
        if (userdata[1].mafia.attachment && userdata[1].mafia.host === false) {
            setActiveGame(true);
            showSplashStart();
            setTimesOfDay('starting');
        }
    }, [userdata[1].mafia.attachment])
*/
    useEffect(() => {
        console.log('startTimer = ' + userdata[1].mafia.startTimer);
        if (userdata[1].mafia.startTimer) {
            let delay = 0;
            if (userdata[1].mafia.host === true) {
                delay = 150;
            }
            setTimeout(() => {
                console.log('call timer');
                setActiveGame(true);
                showSplashStart();
                setTimesOfDay('starting');
            }, delay);
            
        }
    }, [userdata[1].mafia.startTimer]);

    useEffect(() => {
        if (timer === 0) {
            if (timesOfDay === 'starting') {
                
                setTimesOfDay('Mafia');
                //gameTimer(10);
                
            }
            if (timesOfDay === 'Mafia') {
                clearCheckedField(selectedUser);
                setTimesOfDay('Cop');
                gameTimer(10);
            }
            if (timesOfDay === 'Cop') {
                clearCheckedField(selectedUser);
                gameTimer(10);
                setTimesOfDay('Doc');
            }
            if (timesOfDay === 'Doc') {
                clearCheckedField(selectedUser);
                gameTimer(10);
                setTimesOfDay('Putana');
            }
            if (timesOfDay === 'Putana') {
                clearCheckedField(selectedUser);
                gameTimer(10);
                setTimesOfDay('Civ');
            }
            if (timesOfDay === 'Civ') {
                clearCheckedField(selectedUser);
                
                gameTimer(10);
                setTimesOfDay('Mafia');
            }
        }
        

    }, [timer]);

    useEffect(() => {
        if (timesOfDay === 'starting') {
            console.log('starting');
            if (isHost === true) {
               distributeCards(kolReadyUsers);
            }
              
            gameTimer(10);
        }
        if (timesOfDay === 'Mafia') {
            console.log('letsMafia');
            showSplashScreen('Ход Мафии');


        }
        if (timesOfDay === 'Cop') {
            console.log('letsCop');
            showSplashScreen('Ход Шерифа');
        }
        if (timesOfDay === 'Doc') {
            console.log('letsDoc');
            showSplashScreen('Ход Доктора')
            
        }
        if (timesOfDay === 'Putana') {
            console.log('letsPutana');
            showSplashScreen('Ход Путаны')
        }
        if (timesOfDay === 'Civ') {
            console.log('letsCivilian');
            showSplashScreen('Город просыпается');
        }

    }, [timesOfDay]);

    useEffect(() => {
        let count = 0;
        data.forEach((item, key) => {
            const  shortItem = Object.entries(item[1]['usersdata'])[0][1];
            if (shortItem.mafia.isReady == true) {
                count++;
            }
        });
        setKolReadyUsers(count);
    }, [data]);

    useEffect(() => {
        setAvatar();
    }, [userdata]);

    useEffect(() => {

    }, [kolReadyUsers])

    useEffect(() => {
        document.body.style.overflowY = "hidden";
        setTimeout(() => {setIsActiveSplashScreen(prev => !prev)}, 2000);

        setTimeout(() => {
            splash.current.style.display = "none";
        }, 3050);
    }, []);

    const clearCheckedField = (user) => {
        if (user && user !== {} && timesOfDay === userdata[1].mafia.attachment) {
            setMafiaChecked(false, user.oldkey, user.newkey);
        }
    }

    const showSplashScreen = (text) => {
        setShowSplash(prevState => !prevState);
        setSplashText(text);
    }

    const nextGameProcess = () => {
        if (timesOfDay === 'starting') {

        }
    }

    const distributeCards = (kol) => {
        let count = 0;
        let arrayCategories = getCategoriesArray(kol);
        arrayCategories = getRandomQueue(kol, arrayCategories);
        
        data.forEach((item, key) => {
            const oldKey = item[0];
            const  newKey = Object.entries(item[1]['usersdata'])[0][0];
            setUserCardToFirebase(arrayCategories[count], oldKey, newKey);
            count++;
        });
        console.log(arrayCategories);
    }

    const getCategoriesArray = (kol) => {
        let arr = [];
        let Mafia = Math.round(kol / 3.5);
        let Cop = 0, Putana = 0, Doc = 0;

        if (kol === 5) Cop = 1;

        if (kol === 6) {
            Cop = 1;
            Doc = 1;
        }

        if (kol > 6) {
            Cop = 1;
            Doc = 1;
            Putana = 1;
        }

        while (kol > 0) {
            if (Mafia > 0) {
                arr.push('Mafia');
                --Mafia;
                --kol;
            }
            if (Cop > 0) {
                arr.push('Cop');
                --Cop;
                --kol;
            }
            if (Doc > 0) {
                arr.push('Doc');
                --Doc;
                --kol;
            }
            if (Putana > 0) {
                arr.push('Putana');
                --Putana;
                --kol;
            }
            if (kol > 0) {
                arr.push('Civ');
                --kol;
            }
        }
        return (arr);
    }

    const getRandomQueue = (kol, arrCateg) => {
        let num = 0;
        let helpElem = '';
        let newArr = [];

        while (arrCateg[0] !== undefined) {
            num = Math.floor(Math.random() * kol);

            if (num !== 0) {
                helpElem = arrCateg[0];
                arrCateg[0] = arrCateg[num];
                arrCateg[num] = helpElem;
            }

            newArr.push(arrCateg[0]);
            arrCateg.shift();
            kol--;
        }

        return (newArr);
    }

    const setStartTimerToFirebase = (value, oldKey, key) => {
        firebase.postData('setStartTimer', oldKey, key, value, false, false, data);
    }

    const setUserCardToFirebase = (data, oldKey, key) => {
        firebase.postData('setUserCard', oldKey, key, data);
    }

    const setMafiaChecked = (data, oldKey, key) => {
        firebase.postData('setGameChecked', oldKey, key, data);
    }

    const setCurentTarget = (data, oldKey, key) => {/*По нажатию добалять в базу цель*/
        firebase.postData('setCurentTarget', oldKey, key, data);
    }

    const onToggleCard = () => {
        if (activeGame) {
            setCardActive(!cardActive);
        }
    }

    const onMoveCard = () => {
        if (isCardHidden || !cardActive) {
            setCardHidden(!isCardHidden)
        }
        else {
            onToggleCard();
            setTimeout(() => setCardHidden(!isCardHidden), 1200);
        }
        
    }

    const handleClickGame = () => {
        const userIsHost = userdata[1].mafia.host;

        if (!userIsHost) {
            handleExit();
        }
        if (userIsHost) {
            if (kolReadyUsers > 4) 
            {
                setActiveGame(true);
                setIsHost(userdata[1].mafia.host);
                setStartTimerToFirebase(true, localID, userdata[0]);
            }
        }

        
    }



    const showSplashStart = () => {
        splashStart.current.style.display = "flex";
        setIsStartGame(prev => !prev);

        setTimeout(() => {setIsStartGame(prev => !prev)}, 2000);

        setTimeout(() => {
            splashStart.current.style.display = "none";
        }, 3050);
    }

    const handleCloseModal = () => {
        setIsOpenModal(prevState => !prevState);
    }

    const handleClickRules = () => {
        setIsOpenModal(prevState => !prevState);
    }

    const handleClickUser = (event) => {
        let user = "";
        const id = event.target.id;
        if (id && timesOfDay === userdata[1].mafia.attachment) {
            data.forEach((item,index)=>{
                if (item[0] === id) {
                    user = Object.entries(item[1]['usersdata'])[0][0];
                    return;
                }
            })
            if (selectedUser) {
                setMafiaChecked(false, selectedUser.oldkey, selectedUser.newkey);
                setMafiaChecked(true, id, user);
                setSelectedUser({oldkey: id, newkey: user});
            }
            else {
                setMafiaChecked(true, id, user);
                setSelectedUser({oldkey: id, newkey: user});
            }
        }
        
    }

    const setAvatar = () => {
        let role = userdata[1].mafia.attachment;
        let avatar;
        switch (role) {
            case 'Mafia':
                avatar = mafiaCard;
                role = 'Мафия';
                break;
            case 'Cop':
                avatar = copCard;
                role = 'Шериф';
                break;
            case 'Doc':
                avatar = docCard;
                role = 'Доктор';
                break;
            case 'Putana':
                avatar = putanaCard;
                role = 'Путана';
                break;
            case 'Civ':
                avatar = civCard;
                role = 'Мирный';
                break;
            default:
                break;
        }

        setRole(role);
        setGameAvatar(avatar);
    }

    const handleUserAction = () => {
        const user = userdata[1].mafia.attachment;
        if (timesOfDay === user) {
            console.log(timesOfDay + ' made a move');

            if (user === 'Mafia' && selectedUser) {

            }
        }
    }


    let allUsers = data.map((item, key) => {
        const  shortItem = Object.entries(item[1]['usersdata'])[0][1];
        if (item[0] !== localID)
        {
            return (
                <li 
                    id={item[0]} 
                    className={cn(s.usersList_Item, s[shortItem.avatar], {[s.usersList_Item_checked] : shortItem.mafia.checked && (timesOfDay === userdata[1].mafia.attachment)})} 
                    key={item[0]}>
                    
                </li>
            )
        } 
    })


    /*
    if (isActiveSplashScreen) {
        return (
            <div className={s.splashScreen}>
                <div className={s.splashScreen__descr}>МАФИЯ</div>
            </div>
        )
    }
    */
    return (   
        <section className={s.mafia}>
            <Modal 
                isOpen={isOpenModal} 
                props={modalData} 
                onCloseModal={handleCloseModal}
                typeModal={"information"}
            />
            <div ref={splash} className={cn(s.splashScreen, {[s.hideSplashScreen] :  !isActiveSplashScreen})}>
                <div className={s.splashScreen__descr}>МАФИЯ</div>
            </div>
            <div className={s.box}>
                <div className={s.changeCardBlock}>
                <div className={cn(s.timer)}>
                    
                    {timer % 60 >= 0 ? (timer - (timer % 60)) / 60 : 0}:{timer > 0 && timer % 60 < 10 ? 0 : null}{timer >= 0 ? timer % 60 : 0}{timer <= 0 ? 0 : null}
                </div>
                    <div className={s.changeCardButton} onClick={() => onMoveCard()}>
                        {
                            isCardHidden ? "Open" : "Close"
                        }
                    </div>
                    
                </div>
                <div className={cn(s.cardWrapeer, {[s.cardWrapeerHidden] : isCardHidden})}>
                    <div className={cn(s.cardContainer, {[s.cardContainerHidden] : isCardHidden})}>
                        <div onClick={() => onToggleCard()} className={cn(s.card , {[s.active] : cardActive && !isCardHidden}, {[s.cardHidden] : isCardHidden})}>   
                            <div className={s.front}>
                                <div className={s.mafiaImg}>
                                    <img src={cardFront} alt="front"/>
                                </div>
                            </div>
                            <div className={s.back}>
                                <div className={s.backImg}>
                                    <img src={gameAvatar} alt="back"/>
                                </div>
                                <div className={s.descr}>
                                    {role}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cn(s.splashStart, {[s.splashStart_active] : isStartGame})} ref={splashStart}>
                <div className={s.splashStart__title}>Игра началась</div>
            </div>
            <SplashScreen 
                text={splashText}
                isShow={showSplash}
            />
            <div className={s.gameBox}>
                <div className={cn(s.startScreen, {[s.startScreen_block] : activeGame})}>
                    <div className={s.startScreen__title}>
                        Ожидание игроков
                    </div>
                    <div className={s.startScreen__subtitle}>
                        Игроков в комнате
                    </div>
                    <div className={s.startScreen__quantity}>
                        <div className={s.startScreen__quantity__number}>
                            {kolReadyUsers}
                        </div>
                    </div>
                    <div className={s.startScreen__actions}>
                        <div onClick={() => handleClickRules()} className={s.startScreen__rools}>Правила</div>
                        <div 
                            className={cn(s.startScreen__startGame, {[s.startScreen__startGame__unblock] : kolReadyUsers > 4})}
                            onClick={() => handleClickGame()}
                        >
                            {userdata[1].mafia.host ? 'Играть' : 'Выйти'}
                        </div>
                    </div>
                </div>
                <div className={cn(s.actionGame, {[s.actionGame_unblock] : activeGame})}>
                    <ul className={s.usersList} onClick={(e) => handleClickUser(e)}>
                        {allUsers}
                    </ul>
                    <div className={s.userActionBlock}>
                        <div className={s.userAction} onClick={() => handleUserAction()}></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MafiaGame;