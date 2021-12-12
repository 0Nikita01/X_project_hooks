import s from './style.module.css';
import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';

const SplashScreen  = ({text, isShow}) => {
    const [showSplashScreen, setShowSplashScreen] = useState(false);
    const splash = useRef(null);
    useEffect(() => {
        splash.current.style.display = "flex";
        setShowSplashScreen(prev => !prev);
        setTimeout(() => {setShowSplashScreen(prev => !prev)}, 3000);

        setTimeout(() => {
            splash.current.style.display = "none";
        }, 4050);
    }, [isShow]);

    return (
        <div className={cn(s.splashStart, {[s.splashStart_active] : showSplashScreen})} ref={splash}>
                <div className={s.splashStart__title}>{text}</div>
        </div>
    )
}

export default SplashScreen;