// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { doc, setDoc, getDoc, getFirestore, addDoc, collection, query, where } from 'firebase/firestore'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCvJWlN3FUooqiZyMcIhP-N4Nwc5kjV3Gk",
    authDomain: "project-ion-fce56.firebaseapp.com",
    projectId: "project-ion-fce56",
    storageBucket: "project-ion-fce56.appspot.com",
    messagingSenderId: "594567170941",
    appId: "1:594567170941:web:a6ebde55cce5cc2b9c1a14",
    measurementId: "G-6EJ8P78H15"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

const updateUserToDatabase = async (user, uid) => {
    if (typeof user !== "object") return;
    const docRef = doc(db, 'users', uid)
    await setDoc(docRef, { ...user, uid });

}
const getUserFromDatabase = async (uid) => {

    const docRef = doc(db, 'users', uid)
    const result = await getDoc(docRef);
    if (!result.exists()) return null;
    return result.data()


}
const uploadImage = (file, progressCallback, urlCallback, errorCallback) => {
    if (!file) {
        errorCallback("File not found");
        return;
    }
    const fileType = file.type;
    const fileSize = file.size / 1024 / 1024;


    if (!fileType.includes("image")) {
        errorCallback("File must be an image");
        return

    }
    if (fileSize > 2) {
        errorCallback("File must be smaller than 2MB");
        return;
    }

    const storageRef = ref(storage, `images/${file.name}`);

    const task = uploadBytesResumable(storageRef, file);
    task.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressCallback(progress)

    }, error => {
        errorCallback(error.message);
    }, () => {
        getDownloadURL(storageRef).then((url) => {
            urlCallback(url);
        })

    })


}
const addProjectInDatabase = async (project) => {
    if (typeof project !== "object") return;
    const collectionRef = collection(db, 'projects')
    await addDoc(collectionRef, { ...project });

}

const updateProjectInDatabase = async (project, pid) => {
    if (typeof project !== 'object') return;

    const docRef = doc(db, 'projects', pid);
    await setDoc(docRef, { ...project });
}

const getAllProjects = async () => {
    await getDoc(collection(db, 'projects'));

}

const getAllProjectsForUser = async (uid) => {
    if (!uid) return;
    const collectionRef = collection(db, 'projects');
    const condition = where('refUser', '==', uid)
    query(collectionRef, condition);

    await getDocs(query);
}


export { app as default, auth, db, updateUserToDatabase, getUserFromDatabase, uploadImage, addProjectInDatabase, updateProjectInDatabase, getAllProjects, getAllProjectsForUser };
