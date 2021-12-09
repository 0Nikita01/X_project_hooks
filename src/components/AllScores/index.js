import s from './style.module.css';
import cn from 'classnames';
import { ReactComponent as AlcoRankSVG } from '../../assets/icons/rank/alcoholic.svg';
import { ReactComponent as IntelRankSVG } from '../../assets/icons/rank/intellectual.svg';

const AllScores = ({left, allData, progress}) => {
    //console.log(Object.entries(allData[0][1]['usersdata'])[0][1].score);
    allData.sort(function (a, b) {
        let ac = Object.entries(a[1]['usersdata'])[0][1].score;
        let bc = Object.entries(b[1]['usersdata'])[0][1].score;
        
        if (ac < bc) {
            return 1;
        }
        if (ac > bc) {
            return -1;
        }
        return 0;
    });

    const progressColor = (type, score) => {
        if (Number(score) < 40)
        {
            return type === 'back' ? 'less40' : 'less40b';
        }
        else if (Number(score) >= 40 && Number(score) < 60)
        {
            return type === 'back' ? 'beetwen4060' : 'beetwen4060b';
        }
        else if (Number(score) >= 60 && Number(score) < 90)
        {
            return type === 'back' ? 'beetwen6090' : 'beetwen6090b';
        }
        else if (Number(score) >= 90)
        {
            return type === 'back' ? 'more90' : 'more90b';
        }
    }
    const scorePage = allData.map((item, key) => {
        /*console.log(Object.entries(item[1]['usersdata']));*/
        const  shortItem = Object.entries(item[1]['usersdata'])[0][1];
        return (
            <li className="allScores__users_user" key={shortItem.login}>
            <ul className="allScores__users_user_propeties">
                <li className={"allScores__users_user_propeties_item " + s[shortItem.avatar]}></li>
                <li className="allScores__users_user_propeties_item">
                    <p className="name">{shortItem.name}</p>
                    <div className={"progressBar " + s[progressColor('border', shortItem.score)]}>
                        <div className={"progressCheck " + s.progress + ' ' + s[progressColor('back', shortItem.score)]} style={{width: shortItem.score + '%'}}></div>
                        <div className="progress">{shortItem.score}%</div>
                    </div>
                </li>
                <li className="allScores__users_user_propeties_item">
                    <AlcoRankSVG />
                </li>
            </ul>
        </li>
        )
    })
   //console.log(allData);
    /*
   
    */
    return (
        
        <div className="allScores" style={{left: left}}>
            <ul className="allScores__users">
                {scorePage}
            </ul>
        </div>
    )
}

export default AllScores;