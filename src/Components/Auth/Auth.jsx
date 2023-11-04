import React from 'react'
import styles from './Auth.module.css'
import InputControl from '../InputControl/InputControl';
import { Link } from 'react-router-dom'

function Auth(props) {
    const isSignup = props.signup ? true : false;
    return (
        <div className={styles.container}>
            <form className={styles.form}>
                <Link to='/'><p className={styles.smallLink}>{"< Back to Home"}</p></Link>
                <p className={styles.heading}>{isSignup ? "Signup" : "Login"}</p>


                {
                    isSignup &&

                    (<InputControl label="Name" placeholder="Enter your Name" />)
                }
                <InputControl label="Email" placeholder="Enter your Email" />
                <InputControl label="Password" placeholder="Enter your Password" isPassword />

                <p className={styles.error}>Error message</p>


                <button>{isSignup ? "Signup" : "Login"}</button>

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