import { createRef, useContext, useEffect, useRef, useState } from "react";
import s from './style.module.css';
import cn from 'classnames';
import { NotificationManager } from 'react-notifications';
import { FireBaseContext } from "../../context/firebaseContext";
import { useSelector } from "react-redux";
import { selectLocalID } from '../../store/user';
import cardFront from '../../assets/img/front_side.png';
import backFront from '../../assets/img/back_cop.png';

const MafiaGame = () => {
    const [cardActive, setCardActive] = useState(false);
    const [isCardHidden, setCardHidden] = useState(false);
    const [isActiveSplashScreen, setIsActiveSplashScreen] = useState(true);
    const splash = useRef(null);
    

    

    useEffect(() => {
        document.body.style.overflowY = "hidden";
        setTimeout(() => {setIsActiveSplashScreen(prev => !prev)}, 2000);

        setTimeout(() => {
            splash.current.style.display = "none";
        }, 3050);
    }, []);

    const onToggleCard = () => {
        setCardActive(!cardActive);
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
            <div className={s.gameBox}>
                <div className={s.users}>
                    
                </div>
            </div>
        </section>
    )
}

export default MafiaGame;