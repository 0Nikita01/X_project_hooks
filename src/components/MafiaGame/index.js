import { useContext, useEffect, useState } from "react";
import s from './style.module.css';
import cn from 'classnames';
import { NotificationManager } from 'react-notifications';
import { FireBaseContext } from "../../context/firebaseContext";
import { useSelector } from "react-redux";
import { selectLocalID } from '../../store/user';
import cardFront from '../../assets/img/nikolay_img.jpg'

const MafiaGame = () => {
    const [cardActive, setCardActive] = useState(false);
    const [isCardHidden, setCardHidden] = useState(false);

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



    return (
        <section className={s.mafia}>
            <div className={s.box}>
                <div className={s.changeCardBlock}>
                    <div className={s.changeCardButton} onClick={() => onMoveCard()}>
                        {
                            isCardHidden ? "Open" : "Close"
                        }
                    </div>
                </div>
                <div className={cn(s.cardWrapeer , {[s.cardHidden] : isCardHidden})}>
                    <div className={s.cardContainer}>
                        <div onClick={() => onToggleCard()} className={cn(s.card , {[s.active] : cardActive && !isCardHidden})}>
                            <div className={s.front}>
                                <div className={s.mafiaImg}>
                                    <img src={cardFront} alt="front"/>
                                </div>
                            </div>
                            <div className={s.back}>
                                <div className={s.backImg}></div>
                                <div className={s.descr}>
                                    Это твой город. И твои правила. 
                                    С наступлением темноты ты убиваешь всех.
                                    Будь осторожен, не ты один не спишь этой ночью.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={s.gameBox}>
                    
            </div>
        </section>
    )
}

export default MafiaGame;