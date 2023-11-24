import { React, useRef, useState, useEffect } from 'react'
import styles from './Account.module.css'
import { Camera, LogOut } from 'react-feather'
import InputControl from '../InputControl/InputControl'
import { Navigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, updateUserToDatabase, uploadImage } from '../../firebase';

function Account(props) {
  const userDetails = props.userDetails;
  const isAuthenticated = props.auth;
  const imagePicker = useRef();


  const [progress, setProgress] = useState(0);
  const [profileImageUrl, setProfileImageUrl] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
  const [profileImageUploadStarted, setProfileImageUploadStarted] = useState(false);


  const [userprofileValues, setUserprofileValues] = useState({
    name: userDetails.name || "",
    designation: userDetails.designation || "",
    github: userDetails.github || "",
    linkedin: userDetails.linkeding || ""
  })
  const [showSaveDetailsButton, setShowSaveDetailsButton] = useState(false);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
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
  const handleInputChange = (event, property) => {
    setShowSaveDetailsButton(true);

    setUserprofileValues((prev) => ({
      ...prev,
      [property]: event.target.value

    }))
  }
  const saveDetailsToDatabase = async () => {
    if (!userprofileValues.name) {
      setErrorMessage("Name required");
      return;
    }
    setSaveButtonDisabled(true);
    await updateUserToDatabase({ ...userprofileValues }, userDetails.uid);
    setSaveButtonDisabled(false);
    setShowSaveDetailsButton(false);
  };


  return isAuthenticated ? (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.heading}>
          Bonjour, <span>{userprofileValues.name}</span>!
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
              <InputControl label="Name" placeholder="Enter your Name" value={userprofileValues.name} onChange={(event) => handleInputChange(event, "name")} />
              <InputControl label="Title" placeholder="E.g Full stack developer" value={userprofileValues.designation} onChange={(event) => handleInputChange(event, "designation")} />
            </div>
            <div className={styles.row}>
              <InputControl label="Github" placeholder="Github URL" value={userprofileValues.github} onChange={(event) => handleInputChange(event, "github")} />
              <InputControl label="Linkedin" placeholder="Linkedin URL" value={userprofileValues.linkedin} onChange={(event) => handleInputChange(event, "linkedin")} />
            </div>
            <div className={styles.footer}>
              <p className={styles.error}>{errorMessage}</p>
              {showSaveDetailsButton &&
                <button className={styles.saveButton} disabled={saveButtonDisabled} onClick={saveDetailsToDatabase}>Save Info</button>
              }
            </div>
          </div>
        </div>
      </div>
    </div >
  ) : <Navigate to="/" />
}
export default Account