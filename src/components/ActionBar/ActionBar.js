import React from "react";
import { message } from "antd";
import PropTypes from "prop-types";

/**
 * toggleRecording() toggles true or false between recordings
 * also returns timeElapsed which is the total duration of the recording
 */
function toggleRecording(state) {
  if (state.recording === false) {
    message.info("Now recording...");

    return {
      currPressed: state.currPressed,
      buttonsPressed: state.buttonsPressed,
      currTime: Date.now(),
      recording: true
    };
  }
  message.info("Stopped recording...");

  return {
    ...state,
    recording: false,
    timeElapsed: Date.now() - state.currTime
  };
}

function playRecording() {
  return { playing: true };
}

function saveRecording() {
  return { saved: true };
}

function reset() {
  return {
    recording: false,
    playing: false,
    currPressed: {},
    buttonsPressed: [],
    currTime: null,
    timeElapsed: null
  };
}

function ActionBar(props) {
  const { state, dispatch } = props;

  return (
    <div className="action-panel">
      <div className="buttons">
        {state.recording === false && state.timeElapsed && (
          <button type="button" onClick={() => dispatch(reset())}>
            Reset
          </button>
        )}
        {state.recording === false && (
          <button
            type="button"
            onClick={() => dispatch(toggleRecording(state))}
          >
            Record
          </button>
        )}

        {state.recording === true && (
          <button
            type="button"
            onClick={() => dispatch(toggleRecording(state))}
          >
            Stop
          </button>
        )}

        {state.timeElapsed && (
          <button type="button" onClick={() => dispatch(playRecording())}>
            Play
          </button>
        )}

        {state.timeElapsed && (
          <button type="button" onClick={() => dispatch(saveRecording())}>
            Save
          </button>
        )}
      </div>
    </div>
  );
}

ActionBar.propTypes = {
  state: PropTypes.shape,
  dispatch: PropTypes.func
};

ActionBar.defaultProps = {
  state: {},
  dispatch: {}
};

export default ActionBar;
