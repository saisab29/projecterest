import { React, useRef, useState, useEffect } from 'react'
import styles from './Account.module.css'
import { Camera, Edit2, GitHub, Linkedin, LogOut, Paperclip, Trash } from 'react-feather'
import InputControl from '../InputControl/InputControl'
import { Link, Navigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, getAllProjectsForUser, updateUserToDatabase, uploadImage, updateProjectInDatabase, deleteProject } from '../../firebase';
import ProjectForm from './ProjectForm/ProjectForm';
import Loader from '../Loader/Loader';

function Account(props) {
  const userDetails = props.userDetails;
  const isAuthenticated = props.auth;
  const imagePicker = useRef();


  const [progress, setProgress] = useState(0);
  const [profileImageUrl, setProfileImageUrl] = useState(userDetails.profileImage || "https://firebasestorage.googleapis.com/v0/b/project-ion-fce56.appspot.com/o/images%2F123455666%20(2).jpg?alt=media&token=762379c0-758d-4de4-8375-88aa2de916b2");
  const [profileImageUploadStarted, setProfileImageUploadStarted] = useState(false);


  const [userprofileValues, setUserprofileValues] = useState({
    name: userDetails.name || "",
    designation: userDetails.designation || "",
    github: userDetails.github || "",
    linkedin: userDetails.linkeding || "",
  })
  const [showSaveDetailsButton, setShowSaveDetailsButton] = useState(false);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState(" ");
  const [showProjectform, setShowProjectform] = useState(false);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isEditProjectModal, setIsEditProjectModal] = useState(false);
  const [editProject, setEditProject] = useState({});

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
        updateProfileImageToDatabase(url);
        setProfileImageUploadStarted(false);
        setProgress(0)
      },
      (err) => {
        console.error("Error->", err);
        setProfileImageUploadStarted(true);
      }
    )
  }

  const updateProfileImageToDatabase = (url) => {
    updateUserToDatabase({ ...userprofileValues, profileImage: url },
      userDetails.uid)
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


  const fetchAllProjects = async () => {
    const result = await getAllProjectsForUser(userDetails.uid);
    if (!result) {
      setProjectsLoaded(true);
      return;
    }

    let tempProjects = [];
    setProjectsLoaded(true);
    result.forEach(doc => tempProjects.push({ ...doc.data(), pid: doc.id }));
    setProjects(tempProjects);
  }

  const handleEditClick = (project) => {
    setIsEditProjectModal(true);
    setEditProject(project);
    setShowProjectform(true);
  };


  const handleDeletion = async (pid) => {
    await deleteProject(pid);
    fetchAllProjects();
  }


  useEffect(() => {
    fetchAllProjects();
  })
  return isAuthenticated ? (
    <div className={styles.container}>
      {
        showProjectform && (
          <ProjectForm onClose={() => setShowProjectform(false)} onSubmission={fetchAllProjects} uid={userDetails.uid} isEdit={isEditProjectModal} default={editProject} />
        )}


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

      <div className={styles.hr}>
        <hr />
      </div>
      <div className={styles.projectsHeader}>
        <div className={styles.section}>Your Projects</div>
        <button className={styles.button} onClick={() => setShowProjectform(true)}>Add Projects</button>
      </div>

      <div className={styles.projects}>
        {projectsLoaded ?
          projects.length > 0 ? (projects.map((item, index) =>
          (<div className={styles.project} key={item.title + index}>
            <p className={styles.title}>{item.title}</p>

            <div className={styles.link}>
              <Edit2 onClick={() => handleEditClick(item)} />
              <Trash onClickCapture={() => handleDeletion(item.pid)} />
              <Link to={`//${item.github}`} target="_blank"><GitHub /></Link>
              <Link to={`//${item.github}`} target="_blank"><Paperclip /></Link>
            </div>

          </div>)
          )) : (<p>No projects found</p>)
          : (<Loader />)}
      </div>
    </div >
  ) : <Navigate to="/" />
}
export default Account