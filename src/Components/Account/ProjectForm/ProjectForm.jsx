import { React, useState, useRef } from 'react'
import Modal from '../../Modal/Modal'
import styles from './ProjectForm.module.css'
import InputControl from '../../InputControl/InputControl'
import { Delete } from 'react-feather';
import { uploadImage } from '../../../firebase';


function ProjectForm(props) {
    const fileInputRef = useRef();


    const [values, setValues] = useState({
        thumbnail: "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg",
        title: "",
        overview: "",
        github: "",
        link: "",
        points: ["", ""],

    });
    const [errorMessage, setErrorMessage] = useState("");
    const [imageUploadStarted, setImageUploadStarted] = useState(false);
    const [imageUploadProgress, setImageUploadProgress] = useState(0);

    const handlePointUpdate = (value, index) => {
        const tempPoints = [...values.points]
        tempPoints[index] = value;
        setValues(prev => ({ ...prev, points: tempPoints }))
    }
    const handleAddPoint = () => {
        if (values.points.length > 4) return;
        setValues(prev => ({ ...prev, points: [...values.points, ""] }))
    }

    const handlePointDelete = (index) => {
        const tempPoints = [...values.points];
        tempPoints.splice(index, 1);
        setValues((prev) => ({ ...prev, points: tempPoints }))
    }


    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setImageUploadStarted(true);
        uploadImage(file, (progress) => { setImageUploadProgress(progress) }, (url) => {
            setImageUploadStarted(false);
            setImageUploadProgress(0);
            setValues(prev => ({ ...prev, thumbnail: url }))
        },
            (error) => {
                setImageUploadStarted(false);
                setErrorMessage(error)
            })
        console.log(file);

    }

    return (
        <Modal onClose={() => (props.onClose ? props.onClose() : "")}>
            <div className={styles.container}>
                <input ref={fileInputRef} type='file' style={{ display: 'none' }} onChange={handleFileInputChange}></input>
                <div className={styles.inner}>

                    <div className={styles.left}>
                        <div className={styles.image}>
                            <img src={values.thumbnail} alt='Project Cover' onClick={() => fileInputRef.current.click()} />
                            {imageUploadStarted && <p>
                                <span>{imageUploadProgress.toFixed(2)}</span> uploaded
                            </p>
                            }
                        </div>
                        <InputControl label='Github' placeholder='Github Repository' value={values.github} onChange={(event) => setValues((prev) => ({ prev, github: event.currentTarget.value, }))} />
                        <InputControl label='Live Project' placeholder='Deployed Project LInk' onChange={(event) => setValues((prev) => ({ prev, link: event.currentTarget.value, }))} />
                    </div>
                    <div className={styles.right}>
                        <InputControl label='Project Name' placeholder='Name of the Project' onChange={(event) => setValues((prev) => ({ prev, title: event.currentTarget.value, }))} />
                        <InputControl label='Project Overview' placeholder='Summarize your Project' />

                        <div className={styles.description}>
                            <div className={styles.top}>

                                <p className={styles.title}>Project Description</p>
                                <p className={styles.link} onClick={handleAddPoint}> + Add</p>
                            </div>
                            <div className={styles.inputs}>

                                {values.points.map((item, index) => (
                                    <div className={styles.input}>
                                        <InputControl placeholder='Project Description'
                                            key={index}
                                            value={item}
                                            onChange={(event) => handlePointUpdate(event.target.value, index)
                                            }
                                        />
                                        {index > 1 && <Delete onClick={() => { handlePointDelete(index) }} />}
                                    </div>))}

                            </div>

                        </div>

                    </div>
                </div>
                <p className={styles.error}>{errorMessage}</p>
                <div className={styles.footer}>
                    <p className={styles.cancel} onClick={() => (props.onClose ? props.onClose() : "")}>Cancel</p>
                    <button className={styles.button}>Submit</button>
                </div>
            </div>
        </Modal>
    )
}

export default ProjectForm