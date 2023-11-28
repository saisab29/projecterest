import React from 'react'
import Modal from '../../Modal/Modal'
import styles from './ProjectForm.module.css'
import InputControl from '../../InputControl/InputControl'


function ProjectForm(props) {
    return (
        <Modal onClose={() => (props.onClose ? props.onClose() : "")}>
            <div className={styles.container}>
                <div className={styles.inner}>

                    <div className={styles.left}>
                        <div className={styles.image}>
                            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZejv9yWWeQOZhd-OYDFQ8PbR_jo3968ILuA&usqp=CAU:image/png;base64,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' alt='Project Cover' />
                            <p>
                                <span>30%</span> uploaded
                            </p>
                        </div>
                        <InputControl label='Github' />
                        <InputControl label='Live Project' />
                    </div>
                    <div className={styles.right}>
                        <InputControl label='Project Name' />
                        <InputControl label='Project Overview' />

                        <div className={styles.description}>
                            <div className={styles.top}>

                                <p className={styles.title}>Project Description</p>
                                <p className={styles.link}> + Add</p>
                            </div>
                            <div className={styles.inputs}>
                                <InputControl />
                                <InputControl />
                            </div>

                        </div>

                    </div>
                </div>
                <div className={styles.footer}>
                    <p className={styles.cancel}>Cancel</p>
                    <button className={styles.button}>Submit</button>
                </div>
            </div>
        </Modal>
    )
}

export default ProjectForm