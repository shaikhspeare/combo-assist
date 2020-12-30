import React, { useEffect } from 'react'

export default function KeyboardListener(props) {
    const { onButtonDown } = props;
    useEffect(() => {
        const triggerKeyEvent = (event) => {
            console.log(event.key);
            onButtonDown(event.key);
        }
        window.addEventListener('keydown', triggerKeyEvent)
    }, [])
  return (
    <>
  </>
  );
}
