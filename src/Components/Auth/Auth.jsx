import React from 'react'
import styles from './Auth.module.css'
import InputControl from '../InputControl/InputControl';

function Auth(props) {
    const isSignup = props.signup ? true : false;
    return (
        <div className={styles.container}>
            <p className={styles.smallLink}>{"Back to Home"}</p>
            <form className={styles.form}>
                <p className={styles.heading}>{isSignup ? "Signup" : "Login"}</p>
                <InputControl />
            </form>
        </div>
    )
}

export default Auth