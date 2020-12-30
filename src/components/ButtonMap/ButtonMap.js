import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, Transition } from 'react-transition-group';
import right from './images/right.svg';
import left from './images/left.svg';
import up from './images/up.svg';
import downButton from './images/down.svg';
import circle from './images/circle.svg';
import square from './images/square.svg';
import cross from './images/cross.svg';
import triangle from './images/triangle.svg';
import ProgressBar from '../ProgressBar/ProgressBar';

export const buttons = {
  X: { img: square, PC: 'A' },
  Y: { img: triangle, PC: 'B' },
  B: { img: circle, PC: 'C' },
  A: { img: cross, PC: 'D' },
  DPadUp: { img: up, PC: 'up' },
  DPadRight: { img: right, PC: 'right' },
  DPadDown: { img: downButton, PC: 'down' },
  DPadLeft: { img: left, PC: 'left' },
};

export function getButton(buttonName) {
  return <img width="30px" src={buttons[buttonName].img} alt={buttonName} />;
}

function ButtonMap(props) {
  const { head, state, children } = props;
  return (
    <div className="button-map">
        {console.log("pressed", state.buttonsPressed)}
      {state.buttonsPressed && (
        <TransitionGroup component="div" className="buttons-pressed">
          {state.buttonsPressed.map((entry) => (
            <Transition key={entry.time} timeout={0} appear mountOnEnter unmountOnExit>
              {() => (
                <div className="list-item">
                  <b>{getButton(entry.button)}</b>
                </div>
              )}
            </Transition>
          ))}
        </TransitionGroup>
      )}

      {children}
    </div>
  );
}

export default ButtonMap;
