import React, { useEffect, useRef } from 'react';
import styles from './Home.module.css';
import { useNavigate, useLocation } from "react-router-dom"


const Home = (props) => {
    const navigate = useNavigate();
    const isAuthenticated = props.auth ? true : false;
    const handleNextButtonClick = () => {
        if (isAuthenticated) navigate("/account");
        else navigate("/login")
    };
    const leftRef = useRef(null);
    const buttonRef = useRef(null);

    const location = useLocation();
    console.log(location)




    useEffect(() => {
        const handleMove = e => {
            if (
                leftRef.current &&
                e.target !== buttonRef.current &&
                e.target !== buttonRef.current.firstChild
            ) {
                leftRef.current.style.width = `${(e.clientX / window.innerWidth) * 100}%`;
            }
        };

        document.addEventListener('mousemove', handleMove);
        document.addEventListener('touchmove', e => {
            if (
                e.targetTouches &&
                e.targetTouches[0] &&
                e.targetTouches[0].target !== buttonRef.current &&
                e.targetTouches[0].target !== buttonRef.current.firstChild
            ) {
                handleMove(e.targetTouches[0]);
            }
        });

        return () => {
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('touchmove', e => {
                if (
                    e.targetTouches &&
                    e.targetTouches[0] &&
                    e.targetTouches[0].target !== buttonRef.current &&
                    e.targetTouches[0].target !== buttonRef.current.firstChild
                ) {
                    handleMove(e.targetTouches[0]);
                }
            });
        };
    }, [location]);




    return (
        <div >

            <div>
                <div ref={leftRef} id={styles.leftSide} className={styles.side}>
                    <h2 className={styles.title}>
                        Projects based on your<span className={styles.fancy}> interest</span>
                    </h2>
                </div>
                <div id={styles.rightSide} className={styles.side}>
                    <h2 className={styles.title}>
                        Projects based on your<span className={styles.fancy}> choice</span>
                    </h2>
                </div>
            </div>
            <div className={styles.btncontainer}>

                <button ref={buttonRef} onClick={handleNextButtonClick} className={styles.button}>
                    {isAuthenticated ? "Your Projects" : "Get Started"}
                </button>
                <button ref={buttonRef} className={styles.button1}>
                    Home
                </button>
            </div>

            <div className={styles.body}>
                <p className={styles.title}>Projects</p>
                <div className={styles.projects}>
                    <div className={styles.project}>
                        <div className={styles.image}>

                        </div>
                        <p className={styles.title}>Twitter Clone</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Home;
