import React, { useEffect, useRef } from 'react';
import styles from './Home.module.css';


const Home = () => {
    const leftRef = useRef(null);
    const buttonRef = useRef(null);

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
    }, []);

    const handleButtonClick = () => {
        // Add functionality for the button click here
        console.log('Button clicked!');
    };

    return (
        <div>

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
            <button ref={buttonRef} onClick={handleButtonClick} className={styles.button}>
                Get Started
            </button>
        </div>
    );
};

export default Home;
