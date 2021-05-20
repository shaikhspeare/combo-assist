import React from 'react';
import { message } from 'antd';
import PropTypes from 'prop-types';
import './ActionBar.css';

/**
 * toggleRecording() toggles true or false between recordings
 * also returns timeElapsed which is the total duration of the recording
 */
function toggleRecording(state) {
  if (state.recording === false) {
    message.info('Now recording...');

    return {
      ...state,
      currPressed: state.currPressed,
      buttonsPressed: state.buttonsPressed,
      currTime: Date.now(),
      recording: true,
    };
  }
  message.info('Stopped recording...');

  return {
    ...state,
    recording: false,
    timeElapsed: Date.now() - state.currTime,
  };
}

function playRecording(state) {
  return { ...state, playing: true };
}

function saveRecording(state) {
  return { ...state, saved: true };
}

function openBindings(state) {
  return { ...state, bindingIsOpen: true}
}

function reset(state) {
  return {
    ...state, 
    recording: false,
    playing: false,
    currPressed: {},
    buttonsPressed: [],
    currTime: null,
    timeElapsed: null,
  };
}

function ActionBar(props) {
  const { state, dispatch } = props;
 console.log("CURR STATE", state)

  return (
    <div className="action-panel">
      <div className="buttons">
        {state.recording === false && state.timeElapsed && (
          <button type="button" onClick={() => dispatch(reset(state))}>
            Restart
          </button>
        )}
        {state.recording === false && state.timeElapsed === null && (
          <button type="button" onClick={() => dispatch(toggleRecording(state))}>
            Record
          </button>
        )}

        {state.recording === true && (
          <button type="button" onClick={() => dispatch(toggleRecording(state))}>
            Stop
          </button>
        )}

        {state.timeElapsed && !state.playing && (
          <button type="button" onClick={() => dispatch(playRecording(state))}>
            Play
          </button>
        )}

        {state.timeElapsed && (
          <button type="button" onClick={() => dispatch(saveRecording(state))}>
            Save
          </button>
        )}

        {state.recording === false && (
          <button type="button" onClick={() => dispatch(openBindings(state))}>
          Bindings
          </button>
        )}

      </div>
    
    </div>
  );
}


ActionBar.defaultProps = {
  state: {},
  dispatch: {},
};

export default ActionBar;
