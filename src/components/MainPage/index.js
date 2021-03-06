import { useContext, useEffect, useState, useRef } from "react";
import s from './style.module.css';
import { NotificationManager } from 'react-notifications';
import { FireBaseContext } from "../../context/firebaseContext";
import { useSelector } from "react-redux";
import { selectLocalID } from '../../store/user';
import TasksBlock from "../TasksBlock";
import Modal from "../Modal";
import AllScores from "../AllScores";
import MafiaGame from "../MafiaGame";

const MainPage = () => {
    const firebase = useContext(FireBaseContext);
    const [hGraph, setHGraph] = useState(-380);
    const [mysccore, setMysccore] = useState(0);
    const [allscores, setAllscores] = useState(380);
    const [change, setChange] = useState(-380);
    const [allData, setAllData] = useState(null);
    const [userdata, setUserdata] = useState(null);
    const [modalData, setModalData] = useState({});
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isStartMafia, setIsStartMafia] = useState(false);
    const [isRoomExists, setIsRoomExists] = useState(false);
    const localID = useSelector(selectLocalID);
    const subheader = useRef(null);
    
    /*
    useEffect(() => {
        const func = async () => {
            const res = await firebase.getDataOnce(localID);
            await setUserdata(Object.entries(res)[0]);
        }
        func();
    }, []);*/

    useEffect(() => {
        if (allData) {
            let hasRoom = false;
            allData.forEach((item,index)=>{
                const shortItem = Object.entries(item[1]['usersdata'])[0][1];
                if (shortItem.mafia.host) {
                    hasRoom = true;
                }
            });
            setIsRoomExists(hasRoom);
        }
    }, [allData]);

    useEffect(() => {
        firebase.getDataSocket(localID, (data) => {
            setAllData(Object.entries(data))
            setUserdata(Object.entries(data[localID]['usersdata'])[0]);
        })
        document.body.style.overflowY = "scroll";
       
    }, []);

    const changeStatus = (score, oldScore, oldKey, key) => {
        let playerStatus = '';

        if (score < 40) {
            playerStatus = 'Younger';
        } else if (score >= 40 && score < 60) {
            playerStatus = 'Padavan';
        } else if (score >= 60 && score < 90) {
            playerStatus = 'Master';
        } else {
            playerStatus = 'God'
        }

        if (playerStatus === 'God') {
            NotificationManager.info("Win!");
        } else if (playerStatus !== userdata[1].status) {
            NotificationManager.info("Level Up!");
        } else {

        }

        firebase.postData('playerStatus', oldKey, key, playerStatus);
    }

    const changeScore = (score, oldKey, key) => {
        firebase.postData('score', oldKey, key, score);
    }

    const changeTaskStatus = (data, oldKey, key, type, num) => {
        firebase.postData('status', oldKey, key, data, type, num);
    }

    const setMafiaHost = (data, oldKey, key) => {
        firebase.postData('setGameHost', oldKey, key, data);
    }

    const setMafiaReady = (data, oldKey, key) => {
        firebase.postData('setGameReady', oldKey, key, data);
    }

    const resetMafiaData = (oldKey, key) => {
        firebase.postData('resetMafiaData', oldKey, key);
    }

    const handlerSubmitTask = (event, lock, title, key, descr, type) => {
        if (lock !== 'lock') {
            handleCloseModal();
            document.body.style.overflowY = "hidden";
            let code = (lock === 'unlock') ? false : true;
            let action = '';
            
            if (!code && !isRoomExists) action = 'subscribe';
            if (!code && isRoomExists) action = 'join';
            if (code) action = 'send';
            console.log(isRoomExists);
            setModalData(() => {return {type: type, name: title, descrTask: descr, key: key, isCode: code, button: action}});
        }
    }

    const handleSubmitModal = ({type, code, key, typeTask, game}) => {
        handleCloseModal();

        if (type === 'subscribe') {
            changeTaskStatus('1', localID, userdata[0], typeTask, key);
            if (game) {
                setIsStartMafia(true);
                setMafiaHost(true, localID, userdata[0]);
                setMafiaReady(true, localID, userdata[0]);
            }
        }
        else if (type === 'send' && code === userdata[1].tasks[typeTask]['pas'][key]) {
            let score = String(Number(userdata[1].score) + 15);

            changeTaskStatus('2', localID, userdata[0], typeTask, key);
            changeScore(score, localID, userdata[0]);
            changeStatus(Number(score), Number(userdata[1].score), localID, userdata[0]);
        }
        else if (type === 'join') {
            changeTaskStatus('1', localID, userdata[0], typeTask, key);
            if (game) {
                setIsStartMafia(true);
                setMafiaReady(true, localID, userdata[0]);
            }
        }
        else {
            NotificationManager.error('???????????????? ??????', "Wrong!");
        }

        /*
        setModalData(prevState => {
            return prevState.map(item => ({
                ...item,
                isOpen : 
            }))
        })*/
        
        
    }

    const handleCloseModal = () => {
        document.body.style.overflowY = "scroll";
        setIsOpenModal(prevState => !prevState);
    }

    let menu = subheader.current;
    let html = document.getElementsByTagName('body')[0];
    html.onscroll = function()
    {
        if (!isStartMafia)
        {
            resizeHeader(menu, subheader);
        }
    }

    function resizeHeader(elem, fmenu)
{
    if (elem == undefined)
        elem = fmenu.current;
    let coords = elem.getBoundingClientRect();
    let header_inform = document.getElementsByClassName('header__information')[0];
    let subheader = document.getElementsByClassName('subheader')[0];
    let img = document.getElementsByClassName('header__information_img')[0];
    if (coords.top < 320)
    {
        if (coords.top > 200)
        {
            img.style.width = (165 - (320 - coords.top)) + 'px';
            img.style.height = (165 - (320 - coords.top)) + 'px';
        }
        else
            header_inform.classList.add('header__information_halfhidden');
    }
    if (coords.top >= 320)
    {
        header_inform.classList.remove('header__information_halfhidden');
    }
        
}

    useEffect(() => {
        setHGraph(change);
        setMysccore(change + 380);
        setAllscores(change + 760);
    }, [change])
    const openPage = (e) => {
        let page = e.target.classList[1];
        switch(page){
            case 'one' :
                setChange(0);
                break;
            case 'two' :
                setChange(-380);
                break;
            case 'three' :
                setChange(-760);
                break;
            default :
            break;
        }
    }

    let progressColor = "", borderColor = "", width = "";

    if (!userdata) {
        return (
            <div></div>
        )
    }
    else {

        if (Number(userdata[1].score) < 40)
        {
            progressColor = 'less40';
            borderColor = 'less40b';
        }
        else if (Number(userdata[1].score) >= 40 && Number(userdata[1].score) < 60)
        {
            progressColor = 'beetwen4060';
            borderColor = 'beetwen4060b';
        }
        else if (Number(userdata[1].score) >= 60 && Number(userdata[1].score) < 90)
        {
            progressColor = 'beetwen6090';
            borderColor = 'beetwen6090b';
        }
        else if (Number(userdata[1].score) >= 90)
        {
            progressColor = 'more90';
            borderColor = 'more90b';
        }

        width = userdata[1].score + "%";
    }

    const handlerExitMafiaGame = () => {
        setIsStartMafia(false);
        document.body.style.overflowY = "scroll";
    }

    if (isStartMafia) {
        return (
            <MafiaGame          
                userdata={userdata}
                localID={localID}
                data={allData}
                modalData={modalData}
                handleExit={handlerExitMafiaGame}
            />
        )
    }
    return (
        <div className="dd">
            <Modal 
                isOpen={isOpenModal} 
                props={modalData}        
                onCloseModal={handleCloseModal}
                typeModal={"functional"}
                onSubmit={handleSubmitModal}
            />
            <header className="header">
                <div className="container">
                    <ul className="header__information">
                        <li className="header__information_item">
                            <div className={"header__information_img " + s[userdata[1].avatar]}></div>
                        </li>
                        <li className="header__information_item">
                            <div className="header__information_name">{userdata[1].name}</div>
                        </li>
                        <li className="header__information_item">
                            <div className={"header__information_progressBar " + s[borderColor]}>
                                <div className={"header__information_progressBar_progressCheck " + s.progress + ' ' + s[progressColor]} style={{width: width}}>
                                    
                                </div>
                                <div className="header__information_progressBar_status">{userdata[1].status}</div>
                                <div className="header__information_progressBar_score">{userdata[1].score}%</div>
                            </div>   
                        </li>
                    </ul>
                </div>
                <hr className="header_hr_hidden"/>
            </header>
            <section className="subheader">
                <div className="container">
                    <ul ref={subheader} className="subheader__menu">
                        <li onClick={(e) => openPage(e)} className="subheader__menu_item one">Holy graph</li>
                        <li onClick={(e) => openPage(e)} className="subheader__menu_item two">My score</li>
                        <li onClick={(e) => openPage(e)} className="subheader__menu_item three">All scores</li>
                    </ul>
                </div>
            </section>
            <section className="content">
                <div className="container">
                    <div className="pages">
                        <div className="content__myscore" style={{left: String(mysccore) + 'px'}}>
                            <div className="content__myscore_dropDownList">
                                <form action="getInformation" name="form" method="POST">
                                    
                                    <select name="category" id="category">
                                        <option value="alcoholic">Alcoholic</option>
                                        <option value="intellectual">Intellectual</option>
                                    </select>
                                </form>
                                <div className={s.resetData} onClick={() => resetMafiaData(localID, userdata[0])}>reset</div>
                            </div> 
                            <TasksBlock data={userdata[1].tasks} onSubmitTask={handlerSubmitTask}/>
                        </div>

                        <AllScores 
                            left={String(allscores) + 'px'}
                            allData={allData}
                            progress={progressColor}
                        />

                        <div className="holyGraph" style={{left: String(hGraph) + 'px'}}>
                            <div className="holyGraph__introduction"></div>
                            <ul className="holyGraph__trees">
                                <li className="holyGraph__trees_item">
                                    <ul className="holyGraph__trees_item_alco">
                                        <li className="holyGraph__trees_item_alco_achieve"></li>
                                        <li className="holyGraph__trees_item_alco_achieve"></li>
                                        <li className="holyGraph__trees_item_alco_achieve"></li>
                                        <li className="holyGraph__trees_item_alco_achieve"></li>
                                        <li className="holyGraph__trees_item_alco_achieve"></li>
                                    </ul>
                                </li>
                                <li className="holyGraph__trees_item">
                                    <ul className="holyGraph__trees_item_intel">
                                        <li className="holyGraph__trees_item_alco_achieve"></li>
                                        <li className="holyGraph__trees_item_alco_achieve"></li>
                                        <li className="holyGraph__trees_item_alco_achieve"></li>
                                        <li className="holyGraph__trees_item_alco_achieve"></li>
                                        <li className="holyGraph__trees_item_alco_achieve"></li>
                                    </ul>
                                </li>
                            </ul>
                            <div className="holyGraph__conclusion"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default MainPage;

