import { React, useState } from 'react'
import Modal from '../../Modal/Modal'
import styles from './ProjectForm.module.css'
import InputControl from '../../InputControl/InputControl'


function ProjectForm(props) {


    const [values, setValues] = useState({
        thumbnail: "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg",
        title: "",
        overview: "",
        github: "",
        link: "",
        points: ["", ""],

    });

    const handlePointUpdate = (value, index) => {
        const tempPoints = [...values.points]
        tempPoints[index] = value;
        setValues(prev => ({ ...prev, points: tempPoints }))
    }


    return (
        <Modal onClose={() => (props.onClose ? props.onClose() : "")}>
            <div className={styles.container}>
                <div className={styles.inner}>

                    <div className={styles.left}>
                        <div className={styles.image}>
                            <img src={values.thumbnail} alt='Project Cover' />
                            <p>
                                <span>30%</span> uploaded
                            </p>
                        </div>
                        <InputControl label='Github' value={values.github} onChange={(event) => setValues((prev) => ({ prev, github: event.currentTarget.value, }))} />
                        <InputControl label='Live Project' onChange={(event) => setValues((prev) => ({ prev, link: event.currentTarget.value, }))} />
                    </div>
                    <div className={styles.right}>
                        <InputControl label='Project Name' onChange={(event) => setValues((prev) => ({ prev, title: event.currentTarget.value, }))} />
                        <InputControl label='Project Overview' />

                        <div className={styles.description}>
                            <div className={styles.top}>

                                <p className={styles.title}>Project Description</p>
                                <p className={styles.link}> + Add</p>
                            </div>
                            <div className={styles.inputs}>
                                {values.points.map((item, index) => (
                                    <InputControl
                                        key={index}
                                        value={item}
                                        onChange={(event) => handlePointUpdate(event.target.value, index)
                                        }
                                    />))}
                            </div>

                        </div>

                    </div>
                </div>
                <div className={styles.footer}>
                    <p className={styles.cancel} onClick={() => (props.onClose ? props.onClose() : "")}>Cancel</p>
                    <button className={styles.button}>Submit</button>
                </div>
            </div>
        </Modal>
    )
}

export default ProjectForm