import { NotificationManager } from 'react-notifications';
import {ReactComponent as LoginSVG} from "../../assets/icons/login_bg.svg";
import LoginForm from "../Login";
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getRemoveUser, getUserFetch, getUserUpdateAsync } from '../../store/user';
import { useEffect } from 'react';


const loginSignupUser = async ({email, password, type}) => {

    const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
            "expiresIn": "3600",
            returnSecureToken: true,
        })
    }

    switch (type) {
        case 'signup':
            return await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDYV_WEsMNCAD_FFuPvivgEQ1reZuSYXkI', requestOptions).then(res => res.json());
        case 'login':
            return await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDYV_WEsMNCAD_FFuPvivgEQ1reZuSYXkI', requestOptions).then(res => res.json());
        default:
            return 'I cannot login user';
    }
}

const LoginPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        const idToken = localStorage.getItem('idToken');
        if (idToken) {
            history.replace('/game');
        }
    }, [])

    const handleSubmitLoginForm = async (props) => {
        dispatch(getUserFetch());
        const responce = await loginSignupUser(props);

        if (responce.hasOwnProperty('error')) {
            dispatch(getRemoveUser());
            NotificationManager.error(responce.error.message, "Wrong!");
        }
        else {
            if (props.type === 'signup')
            {
                const file = require("../../json/userdata.json");
                //console.log(responce.localId);
                if (file) {
                    await fetch(`https://party-game-2acf6-default-rtdb.firebaseio.com/data/${responce.localId}/usersdata.json?auth=${responce.idToken}`, {
                        method: 'POST',
                        body: JSON.stringify(file)
                    });
                    localStorage.setItem('idToken', responce.idToken);
                    NotificationManager.success("Successful");
                    dispatch(getUserUpdateAsync());
                    history.replace('/game');
                }
            }
            if (props.type === 'login') {
                localStorage.setItem('idToken', responce.idToken);
                NotificationManager.success("Successful");
                dispatch(getUserUpdateAsync());
                history.replace('/game');
            }
            
        }
    }

    return (
        <section className="login" id="touchsurface">
            <div className="container">
                <div className="login_host">Nikita's birthday</div>
                <div className="login_wellcome">Wellcome to the party!</div>
                <div className="login_image"><LoginSVG /></div>
                <div className="login_form">
                    <div className="login_form_block">
                        <LoginForm 
                            isResetField={false}
                            onSubmit={handleSubmitLoginForm}
                        />
                    </div>
                </div>
            </div>
        </section>
    )

}

export default LoginPage;