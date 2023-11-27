import React from 'react'
import Modal from '../../Modal/Modal'
import styles from './ProjectForm.module.css'


function ProjectForm(props) {
    return (
        <Modal onClose={() => (props.onClose ? props.onClose() : "")}>
            <h1>Hello</h1></Modal>
    )
}

export default ProjectForm