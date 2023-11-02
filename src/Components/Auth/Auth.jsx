import React from 'react'
import styles from './Auth.module.css'
import InputControl from '../InputControl/InputControl';

function Auth(props) {
    const isSignup = props.signup ? true : false;
    return (
        <div className={styles.container}>
            <form className={styles.form}>
                <p className={styles.smallLink}>{"< Back to Home"}</p>
                <p className={styles.heading}>{isSignup ? "Signup" : "Login"}</p>
                <InputControl label="Name" placeholder="Enter your Name" />
                <InputControl label="Email" placeholder="Enter your Email" />
                <InputControl label="Passwrod" placeholder="Enter  your Password" />


                <button>{isSignup ? "Signup" : "Login"}</button>
            </form>
        </div>
    )
}

export default Auth