import {Route, Switch, Redirect} from 'react-router-dom';
import NotFound from './components/NotFound';
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import { FireBaseContext } from './context/firebaseContext';
import FirebaseClass from './service/firebase';
import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAsync, selectUserLoading } from './store/user';
import { useEffect } from 'react';
import MafiaGame from './components/MafiaGame';

const App = () => {

    const dispatch = useDispatch();
    const isUserLoading = useSelector(selectUserLoading);

	useEffect(() => {
		dispatch(getUserAsync());
	}, [dispatch]);

    if (isUserLoading) {
        return (
            <div></div>
        )
    }
    return (
        <FireBaseContext.Provider value={FirebaseClass}>
            <Switch>
                <Route path="/404" component={NotFound}/>
                <Route>
                    <Switch>
                        <Route path="/login" component={LoginPage} />
                        <Route path="/" exact render={() => (<Redirect to="/game"/>)} />    
                        <PrivateRoute path="/game" component={MainPage} />
                        <PrivateRoute path="/mafia" component={MafiaGame} />
                        <Route render={() => (
                                <Redirect to="/404" />
                            )} />
                    </Switch>
                </Route>
            </Switch>
            <NotificationContainer />
        </FireBaseContext.Provider>
    )
}

export default App;