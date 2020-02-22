import React from 'react';
import PropTypes from 'prop-types';
import anime from 'animejs';

function updateProgress(ref, duration) {
  const basicTimeline = anime.timeline();
  basicTimeline.add({
    targets: '.progress-bar',
    width: '100%',
    duration,
    easing: 'linear',
  });
}

const ProgressBar = props => {
  const { state } = props;
  let progressBar = null;

  return (
    <div
      className="progress-bar"
      ref={ref => {
        progressBar = ref;
        updateProgress(progressBar, state.timeElapsed);
      }}
    />
  );
};

ProgressBar.propTypes = {
  state: PropTypes.shape,
};

ProgressBar.defaultProps = {
  state: {},
};

export default ProgressBar;
