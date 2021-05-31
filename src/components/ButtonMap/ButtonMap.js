import React, { useEffect } from 'react';
import right from './images/right.svg';
import left from './images/left.svg';
import up from './images/up.svg';
import downButton from './images/down.svg';
import circle from './images/circle.svg';
import square from './images/square.svg';
import cross from './images/cross.svg';
import triangle from './images/triangle.svg';


export const buttons = {
  X: { img: square, PC: 'w' },
  Y: { img: triangle, PC: 'a' },
  B: { img: circle, PC: 's' },
  A: { img: cross, PC: 'd' },
  DPadUp: { img: up, PC: 'ArrowUp' },
  DPadRight: { img: right, PC: 'ArrowRight' },
  DPadDown: { img: downButton, PC: 'ArrowDown' },
  DPadLeft: { img: left, PC: 'ArrowLeft' },
};

export function getButton(buttonName) {
  return <img width="30px" src={buttons[buttonName].img} alt={buttonName} />;
}

function ButtonMap(props) {
  const { state, children, canvas } = props;

  function draw(button) {
    console.log('CANVAS', canvas.current, button);
    const img = new Image(20, 20);
    img.src = "https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg";
    const ctx = canvas.current.getContext('2d');
    ctx.drawImage(img, 0, 0);
    ctx.save();
  }

  useEffect(() => {
    state.buttonsPressed.map((entry) => draw(buttons[entry.button].img));
  }, [state.buttonsPressed]);
  return <div className="button-map">{children}</div>;
}

export default ButtonMap;
