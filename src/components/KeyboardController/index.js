import React, {useEffect} from "react";

function KeyboardController(props) {
    const {onButtonDown, onButtonUp} = props;

    const registerKeyDown = (event) => {
        const keyCode = event.key
        console.log("PRESSED", keyCode)
        onButtonDown(keyCode);
    }

    const registerKeyUp = (event) => {
        const keyCode = event.key
        onButtonUp(keyCode);
    }

    useEffect(() => {
        window.addEventListener('keydown', registerKeyDown);
        window.addEventListener('keyup', registerKeyUp);

        return (() => {
            window.removeEventListener('keydown', registerKeyDown);
            window.removeEventListener('keyup', registerKeyUp);

        })
    }, [])
  return (
      <>

      </>
  );
}

export default KeyboardController;
