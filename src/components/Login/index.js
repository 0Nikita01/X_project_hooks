import { useEffect, useState } from "react";

const LoginForm = ({onSubmit, isResetField = false}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setLogin] = useState(true);

    useEffect(() => {
        setEmail('');
        setPassword('');
    }, [isResetField]);

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit && onSubmit({
            type: isLogin ? 'login' : 'signup',
            email,
            password
        })
        setEmail('');
        setPassword('');
    }

    return (
        <form onSubmit={handleSubmit}>
            <input onChange={(e) => setEmail(e.target.value)} name="login" type="text" placeholder="Введите логин" value={email}/>
            <input onChange={(e) => setPassword(e.target.value)} name="password" type="password" placeholder="Введите пароль" value={password}/>
            <button id="send_form">{ isLogin ? 'Login' : 'SignUp' }</button>
            <div 
                className='link'
                onClick={() => setLogin(!isLogin)}
            >
                { isLogin ? 'Register' : 'Login' }
            </div>
        </form>
    )

}

export default LoginForm;