import React from 'react'
import { useState } from 'react'
import styles from './Auth.module.css'
import InputControl from '../InputControl/InputControl';
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, updateUserToDatabase } from '../../firebase';

function Auth(props) {
    const isSignup = props.signup ? true : false;
    const navigate = useNavigate();

    const [values, setValues] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [errorMsg, setErrorMsg] = useState("");
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const handleLogin = () => {

    }
    const handleSignup = () => {
        if (!values.name || !values.email || !values.password) {
            setErrorMsg('Please fill out all the fields')
            return;
        }

        setSubmitButtonDisabled(true);
        createUserWithEmailAndPassword(auth, values.email, values.password).then(async (response) => {
            console.log(response);
            const userId = response.user.uid;
            await updateUserToDatabase({ name: values.name, email: values.email }, userId)
            setSubmitButtonDisabled(false);
            navigate('/');
        })
            .catch((err) => {
                setSubmitButtonDisabled(false);
                setErrorMsg(err.message)
            });

    }

    const handleSubmission = (event) => {
        event.preventDefault();



        if (isSignup) handleSignup();
        else handleLogin();

    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmission}>
                <Link to='/'><p className={styles.smallLink}>{"< Back to Home"}</p></Link>
                <p className={styles.heading}>{isSignup ? "Signup" : "Login"}</p>


                {
                    isSignup &&

                    (<InputControl label="Name" placeholder="Enter your Name" onChange={(event) => setValues(prev => ({ ...prev, name: event.target.value }))} />)
                }
                <InputControl label="Email" placeholder="Enter your Email" onChange={(event) => setValues(prev => ({ ...prev, email: event.target.value }))} />
                <InputControl label="Password" placeholder="Enter your Password" onChange={(event) => setValues(prev => ({ ...prev, password: event.target.value }))} isPassword />

                <p className={styles.error}></p>


                <button type='submit' disabled={submitButtonDisabled}>{isSignup ? "Signup" : "Login"}</button>

                <div className={styles.bottom}>
                    {isSignup ?
                        (<p>Already have an account? <Link to="/login">Login here</Link></p>) :
                        (<p>Doesnt have an account? <Link to="/signup">Create an account</Link></p>)
                    }
                </div>
            </form>
        </div>
    )
}

export default Auth