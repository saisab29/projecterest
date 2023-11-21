import { React, useRef, useState } from 'react'
import styles from './Account.module.css'
import { Camera, LogOut } from 'react-feather'
import InputControl from '../InputControl/InputControl'
import { Navigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, uploadImage } from '../../firebase';

function Account(props) {
  const userDetails = props.userDetails;
  const isAuthenticated = props.auth;
  const imagePicker = useRef();


  const [progress, setProgress] = useState(0);
  const [profileImageUrl, setProfileImageUrl] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
  const [profileImageUploadStarted, setProfileImageUploadStarted] = useState(false);


  const [userprofileValues, setUserProfileValues] = useState({
    name: userDetails.name,
    designation: userDetails.designation || " ",
    github: userDetails.github || " ",
    linkedin: userDetails.linkeding || " "
  })
  const [showSaveDetailsButton, setSaveDetailsButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState(" ");

  const handleLogout = async () => {
    await signOut(auth);
  }

  const handleCameraClick = () => {
    imagePicker.current.click();
  }
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setProfileImageUploadStarted(true);
    uploadImage(
      file,
      (progress) => { setProgress(progress) },
      (url) => {
        setProfileImageUrl(url);
        setProfileImageUploadStarted(false);
        setProgress(0)
      },
      (err) => {
        console.error("Error->", err);
        setProfileImageUploadStarted(false);
      }
    )
  }

  return isAuthenticated ? (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.heading}>
          Bonjour, <span>{userDetails.name}</span>!
        </p>
        <div className={styles.logout} onClick={handleLogout}>
          <LogOut /> Logout
        </div>
      </div>
      <input ref={imagePicker} type="file" style={{ display: "none" }} onChange={handleImageChange} />
      <div className={styles.section}>
        <div className={styles.title}>Profile</div>
        <div className={styles.profile}>

          <div className={styles.left}>
            <div className={styles.image}>
              <img src={profileImageUrl}
                alt="Profile-Picture" />
              <div className={styles.camera} onClick={handleCameraClick}>

                <Camera />
              </div>
            </div>

            {profileImageUploadStarted ? (<p className={styles.progress}>{progress == 100 ? "Uploading Image" : `${progress.toFixed(2)} % uploaded`}</p>) : ("")}
          </div>
          <div className={styles.right}>
            <div className={styles.row}>
              <InputControl label="Name" placeholder="Enter your Name" onChange={(event) => setUserProfileValues((prev) => ({ ...prev, name: event.target.value, }))} />
              <InputControl label="Title" placeholder="E.g Full stack developer" onChange={(event) => setUserProfileValues((prev) => ({ ...prev, title: event.target.value, }))} />
            </div>
            <div className={styles.row}>
              <InputControl label="Github" placeholder="Github URL" onChange={(event) => setUserProfileValues((prev) => ({ ...prev, github: event.target.value, }))} />
              <InputControl label="Linkedin" placeholder="Linkedin URL" onChange={(event) => setUserProfileValues((prev) => ({ ...prev, linkedin: event.target.value, }))} />
            </div>
            <div className={styles.footer}>
              <p className={styles.error}>{errorMessage}</p>
              {showSaveDetailsButton &&
                <button className={styles.saveButton}>Save Info</button>
              }
            </div>
          </div>
        </div>
      </div>
    </div >
  ) : <Navigate to="/" />
}

export default Account