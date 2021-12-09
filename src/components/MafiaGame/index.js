import { createRef, useContext, useEffect, useRef, useState } from "react";
import s from './style.module.css';
import cn from 'classnames';
import { NotificationManager } from 'react-notifications';
import { FireBaseContext } from "../../context/firebaseContext";
import { useSelector } from "react-redux";
import user, { selectLocalID } from '../../store/user';
import cardFront from '../../assets/img/front_side.png';
import backFront from '../../assets/img/back_cop.png';
import Modal from "../Modal";

const MafiaGame = ({userdata, localID, data, modalData}) => {
    const firebase = useContext(FireBaseContext);
    const [cardActive, setCardActive] = useState(false);
    const [isCardHidden, setCardHidden] = useState(false);
    const [isActiveSplashScreen, setIsActiveSplashScreen] = useState(true);
    const [isStartGame, setIsStartGame] = useState(false);
    const [kolReadyUsers, setKolReadyUsers] = useState(0);
    const [activeGame, setActiveGame] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(false);
    const splash = useRef(null);
    const splashStart = useRef(null);

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

    }, [kolReadyUsers])

    useEffect(() => {
        document.body.style.overflowY = "hidden";
        setTimeout(() => {setIsActiveSplashScreen(prev => !prev)}, 2000);

        setTimeout(() => {
            splash.current.style.display = "none";
        }, 3050);
    }, []);

    const setMafiaChecked = (data, oldKey, key) => {
        firebase.postData('setGameChecked', oldKey, key, data);
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

        if (kolReadyUsers > 4) 
        {
            showSplashStart();
            setActiveGame(true);
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
        console.log(id);
        if (id) {
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


    let allUsers = data.map((item, key) => {
        const  shortItem = Object.entries(item[1]['usersdata'])[0][1];
        if (item[0] !== localID)
        {
            return (
                <li 
                    id={item[0]} 
                    className={cn(s.usersList_Item, s[shortItem.avatar], {[s.usersList_Item_checked] : shortItem.mafia.checked})} 
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
                                    <img src={backFront} alt="back"/>
                                </div>
                                <div className={s.descr}>
                                    Шериф
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cn(s.splashStart, {[s.splashStart_active] : isStartGame})} ref={splashStart}>
                <div className={s.splashStart__title}>Игра началась</div>
            </div>
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
                            Играть
                        </div>
                    </div>
                </div>
                <div className={cn(s.actionGame, {[s.actionGame_unblock] : activeGame})}>
                    <ul className={s.usersList} onClick={(e) => handleClickUser(e)}>
                        {allUsers}
                    </ul>
                    <div className={s.userActionBlock}>
                        <div className={s.userAction}></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MafiaGame;