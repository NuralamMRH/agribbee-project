import { useState, useEffect, useRef } from "react";
import styles from "./CustomSwiper.module.css"; // Import custom CSS module for styling

const CustomSwiper = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [dx, setDx] = useState(0);
  const [swiped, setSwiped] = useState(0);
  const swipeBtnRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const minX = 10;
      const maxX =
        buttonRef.current.offsetWidth - swipeBtnRef.current.offsetWidth - minX;
      const newDx = Math.min(
        Math.max(e.clientX - swipeBtnRef.current.startX, 0),
        maxX
      );
      setDx(newDx);
      buttonRef.current.style.setProperty("--swiped-blur", newDx / maxX);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        const minX = 10;
        const maxX =
          buttonRef.current.offsetWidth -
          swipeBtnRef.current.offsetWidth -
          minX;
        if (dx >= maxX) {
          setSwiped(1);
        } else {
          setDx(0);
          setSwiped(0);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dx]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    swipeBtnRef.current.startX = e.clientX;
  };

  return (
    <div className={styles.container}>
      <button
        ref={buttonRef}
        className={`${styles.button} ${swiped ? styles.order : ""}`}
        style={{ "--swiped": swiped, "--swiped-blur": dx }}
      >
        <div className={styles.inner}>
          <span
            id="swipe-btn"
            ref={swipeBtnRef}
            onMouseDown={handleMouseDown}
            className={styles.swipeBtn}
            style={{ transform: `translateX(${dx}px)` }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 6L15 12L9 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 6L15 12L9 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        <div className={styles.result}></div>
      </button>
    </div>
  );
};

export default CustomSwiper;
