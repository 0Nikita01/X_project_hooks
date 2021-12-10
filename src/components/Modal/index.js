import s from './style.module.css';
import cn from 'classnames';
import { useState, useEffect } from 'react';

const Modal = ({isOpen, props, onCloseModal, typeModal, onSubmit = false}) => {
    const [code, setCode] = useState('');
    const [game, setGame] = useState(false);
    useEffect(() => {
        setCode('');

        if (props.name === 'Мафия') {
            setGame(true);
        }
    }, [isOpen]);
    let buttonAction = '';
    switch(props.button) {
        case('send') :
            buttonAction = 'Отправить';
            break;
        case('subscribe') :
            buttonAction = 'Начать';
            break;
        case('join') :
            buttonAction = 'Зайти';
            break;
        default :
            buttonAction = 'Action';
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit && onSubmit({
            type: props.button,
            code,
            key: props.key,
            typeTask: props.type,
            game
        })
    }

    if (typeModal === "functional")
    {
        return (
            <div className={cn({[s.modal_close] : !isOpen}, {[s.modal_open] : isOpen})}>
                <div className={s.modal_container}>
                    <div className={s.modal_content}>
                        <p className={s.modal_content_title}>Задание</p>
                        <p className={s.modal_content_task}>{props.descrTask}</p>
                        <form onSubmit={handleSubmit}>
                            <div className={cn(s.modal_input, {[s.input_enable] : props.isCode}, {[s.input_disable] : !props.isCode})}>
                                <input 
                                    onChange={(e) => {setCode(e.target.value)}} 
                                    name="login" 
                                    type="text" 
                                    placeholder="Код подтверждения" 
                                    value={code}/> 
                            </div>
                            <div className={s.modal_buttons}>
                                <div onClick={() => onCloseModal()} className={s.modal_exit}>Отменить</div>
                                <button className={s.modal_exit}>{buttonAction}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
    else if (typeModal === "information")
    {
        return (
            <div className={cn({[s.modal_close] : !isOpen}, {[s.modal_open] : isOpen})}>
                <div className={s.modal_container}>
                    <div className={s.modal_content}>
                        <p className={s.modal_content_title}>Задание</p>
                        <p className={s.modal_content_task}>{props.descrTask}</p>
                        <div className={s.modal_buttons}>
                            <div onClick={() => onCloseModal()} className={s.modal_exit}>Отменить</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Modal;