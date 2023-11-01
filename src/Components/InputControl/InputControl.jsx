import React from 'react'
import styles from './InputControl.module.css'

function InputControl() {
    return (
        <div className={styles.container}>
            <label>Name</label>
            <input type="text" />
        </div>
    )
}

export default InputControl