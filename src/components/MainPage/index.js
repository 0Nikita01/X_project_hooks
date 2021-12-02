import { useContext, useEffect, useState } from "react";
import s from './style.module.css';
import { NotificationManager } from 'react-notifications';
import { FireBaseContext } from "../../context/firebaseContext";
import { useSelector } from "react-redux";
import { selectLocalID } from '../../store/user';
import TasksBlock from "../TasksBlock";
import Modal from "../Modal";
import AllScores from "../AllScores";

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
    const localID = useSelector(selectLocalID);
    
    /*
    useEffect(() => {
        const func = async () => {
            const res = await firebase.getDataOnce(localID);
            await setUserdata(Object.entries(res)[0]);
        }
        func();
    }, []);*/

    useEffect(() => {
        firebase.getDataSocket(localID, (data) => {
            setAllData(Object.entries(data))
            setUserdata(Object.entries(data[localID]['usersdata'])[0]);
        })
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

    const handlerSubmitTask = (event, lock, title, key, descr, type) => {
        if (lock !== 'lock') {
            handleCloseModal();
            let code = (lock === 'unlock') ? false : true;
            setModalData(() => {return {type: type, name: title, descrTask: descr, key: key, isCode: code, button: code ? 'send' : 'subscribe'}});
        }
    }

    const handleSubmitModal = ({type, code, key, typeTask}) => {
        handleCloseModal();

        if (type === 'subscribe') {
            changeTaskStatus('1', localID, userdata[0], typeTask, key);
        }
        else if (type === 'send' && code === userdata[1].tasks[typeTask]['pas'][key]) {
            let score = String(Number(userdata[1].score) + 15);

            changeTaskStatus('2', localID, userdata[0], typeTask, key);
            changeScore(score, localID, userdata[0]);
            changeStatus(Number(score), Number(userdata[1].score), localID, userdata[0]);
        }
        else {
            NotificationManager.error('Неверный код', "Wrong!");
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
        setIsOpenModal(prevState => !prevState);
    }

    let menu = fmenu();
    let html = document.getElementsByTagName('body')[0];
    html.onscroll = function()
    {
        resizeHeader(menu, fmenu);
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
    return (
        <div className="dd">
            <Modal 
                isOpen={isOpenModal} 
                props={modalData} 
                onSubmit={handleSubmitModal}
                onCloseModal={handleCloseModal}
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
                    <ul className="subheader__menu">
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

function resizeHeader(elem, fmenu)
{
    if (elem == undefined)
        elem = fmenu();
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

function fmenu()
{
    return document.getElementsByClassName('subheader__menu')[0];
}