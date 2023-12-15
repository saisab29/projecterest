import React from 'react'
import styles from './PreLoader.module.css'
import Projecterest from '../../Assets'

function PreLoader() {
    return (
        <div className={styles.preloader}>
            <img src={Projecterest}></img>
        </div>
    )
}

export default PreLoader