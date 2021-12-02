import loader from '../../assets/icons/loading/loading.png';
import s from './style.module.css';


const TasksBlock = ({data, onSubmitTask}) => {
    const personalTasks = data.personal;
    const commonTasks = data.common;

    const pageP = personalTasks.title.map((item, key) => {
        let cl = "content__myscore_tasks_personal_item", id = 'personal_';
        let hid = '', lock = '';
        if (personalTasks.status[key] !== "1") {
            hid = 'hidden';
        }

        switch (personalTasks.status[key]) {
            case '0':
                lock = 'unlock';
                break;
            case '1':
                lock = 'inprogress';
                break;
            case '2':
                lock = 'lock';
                break;
            default :
                lock = 'unknown';
                break;
        }
        
        return (
            <li onClick={(e) => {onSubmitTask(e, lock, item, key, personalTasks.descr[key], 'personal')}} id={id + item} className={cl + ' ' + s[lock]} key={item}>
                <ul>
                    <li>{item}</li>
                    <li><img className={'loader ' + hid} src={loader}/></li>
                    <li>200xp</li>
                </ul>
            </li>
        )
    });

    const pageC = commonTasks.title.map((item, key) => {
        let cl = "content__myscore_tasks_common_item", id = 'common_';
        let hid = '', lock = '';
        if (commonTasks.status[key] !== "1") {
            hid = 'hidden';
        }

        switch (commonTasks.status[key]) {
            case '0':
                lock = 'unlock';
                break;
            case '1':
                lock = 'inprogress';
                break;
            case '2':
                lock = 'lock';
                break;
            default :
                lock = 'unknown';
                break;
        }
        
        return (
            <li onClick={(e) => {onSubmitTask(e, lock, item, key, commonTasks.descr[key], 'common')}} id={id + item} className={cl + ' ' + s[lock]} key={item}>
                <ul>
                    <li>{item}</li>
                    <li><img className={'loader ' + hid} src={loader}/></li>
                    <li>200xp</li>
                </ul>
            </li>
        )
    });


    return (
        <div className="content__myscore_tasks">
            <p>Personal</p>
            <div className="hrr">
                <hr/>
            </div>
            <ul className="content__myscore_tasks_personal">
                {pageP}
            </ul>
            <p>Common</p>
            <div className="hrr">
                <hr/>
            </div>
            <ul className="content__myscore_tasks_common">
                {pageC}
            </ul>
        </div>
    )
}

export default TasksBlock;