import { React, useState, useRef } from 'react'
import Modal from '../../Modal/Modal'
import styles from './ProjectForm.module.css'
import InputControl from '../../InputControl/InputControl'
import { Delete } from 'react-feather';
import { addProjectInDatabase, uploadImage } from '../../../firebase';


function ProjectForm(props) {
    const fileInputRef = useRef();


    const [values, setValues] = useState({
        thumbnail: "",
        title: "",
        overview: "",
        github: "",
        link: "",
        points: ["", ""],

    });
    const [errorMessage, setErrorMessage] = useState("");
    const [imageUploadStarted, setImageUploadStarted] = useState(false);
    const [imageUploadProgress, setImageUploadProgress] = useState(0);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

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

    const validateForm = () => {
        const actualPoints = values.points.filter((item) => item.trim());
        let isValid = true;
        if (!values.thumbnail) {
            setErrorMessage("Project Cover Image is required");
            isValid = false;

        }
        else if (!values.github) {
            isValid = false;
            setErrorMessage("Project Repository is required")
        }
        else if (!values.overview) {
            isValid = false;
            setErrorMessage("List the techstack used");
        }
        else if (!actualPoints.length) {
            isValid = false;
            setErrorMessage("Project Description is required");
        }
        else if (actualPoints.length < 2) {
            isValid = false;
            setErrorMessage("Minimum 2 description points are required");
        } else {

            setErrorMessage("");
        }


        return isValid;

    }

    const handleSubmission = async () => {
        if (!validateForm()) return;

        setSubmitButtonDisabled(true);
        await addProjectInDatabase({ ...values, refUser: props.uid })
        setSubmitButtonDisabled(false);
        if (props.onSubmission) props.onSubmission();
        if (props.onClose) props.onClose();
    }



    return (
        <Modal onClose={() => (props.onClose ? props.onClose() : "")}>
            <div className={styles.container}>
                <input ref={fileInputRef} type='file' style={{ display: 'none' }} onChange={handleFileInputChange}></input>
                <div className={styles.inner}>

                    <div className={styles.left}>
                        <div className={styles.image}>
                            <img src={values.thumbnail ? values.thumbnail : "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"} alt='Project Cover' onClick={() => fileInputRef.current.click()} />
                            {imageUploadStarted && <p>
                                <span>{imageUploadProgress.toFixed(2)}</span> uploaded
                            </p>
                            }
                        </div>
                        <InputControl label='Github' placeholder='Github Repository' value={values.github} onChange={(event) => setValues((prev) => ({ ...prev, github: event.target.value, }))} />
                        <InputControl label='Live Project' placeholder='Deployed Project LInk' onChange={(event) => setValues((prev) => ({ ...prev, link: event.target.value, }))} />
                    </div>
                    <div className={styles.right}>
                        <InputControl label='Project Name' placeholder='Name of the Project' onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value, }))} />
                        <InputControl label='Project Overview' placeholder='Summarize your Project' onChange={(event) => setValues((prev) => ({ ...prev, overview: event.target.value, }))} />

                        <div className={styles.description}>
                            <div className={styles.top}>

                                <p className={styles.title}>Project Description</p>
                                <p className={styles.link} onClick={handleAddPoint}> + Add</p>
                            </div>
                            <div className={styles.inputs}>

                                {values.points.map((item, index) => (
                                    <div className={styles.input} key={index}>
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
                    <button className={styles.button} onClick={handleSubmission} disabled={submitButtonDisabled}>Submit</button>
                </div>
            </div>
        </Modal>
    )
}

export default ProjectForm