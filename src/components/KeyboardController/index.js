import React, {useEffect} from "react";

function KeyboardController(props) {
    const {onButtonDown, onButtonUp} = props;

    const registerKeyDown = (event) => {
        onButtonDown('X');
    }

    const registerKeyUp = (event) => {
        onButtonUp('X');
    }

    useEffect(() => {
        console.log('Keyboard loaded')
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
