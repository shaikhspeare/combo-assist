import React from "react";
import PropTypes from "prop-types";
import { TransitionGroup, Transition } from "react-transition-group";
import right from './images/right.svg';
import left from "./images/left.svg";
import up from "./images/up.svg";
import downButton from "./images/down.svg";
import circle from "./images/circle.svg";
import square from "./images/square.svg";
import cross from "./images/square.svg";
import triangle from "./images/triangle.svg";
import ProgressBar from "../ProgressBar/ProgressBar";

const buttons = {
  X: square,
  Y: triangle,
  B: circle,
  A: cross,
  DPadDown: downButton,
  DPadUp: up,
  DPadLeft: left,
  DPadRight: right
};

function getButton(buttonName) {
  return <img width="30px" src={buttons[buttonName]} alt={buttonName} />;
}

function ButtonMap(props) {
  const { state } = props;
  return (
    <div className="button-map">
      {state.buttonsPressed && (
        <TransitionGroup component="div" className="buttons-pressed">
          {state.buttonsPressed.map(entry => (
            <Transition
              key={entry.time}
              timeout={10}
              appear
              mountOnEnter
              unmountOnExit
            >
              {() => (
                <div className="list-item">
                  <b>{getButton(entry.button)}</b>
                </div>
              )}
            </Transition>
          ))}
        </TransitionGroup>
      )}
              {state.playing && <ProgressBar state={state} /> }

    </div>
  );
}

ButtonMap.propTypes = {
  state: PropTypes.shape
};

ButtonMap.defaultProps = {
  state: {}
};

export default ButtonMap;
