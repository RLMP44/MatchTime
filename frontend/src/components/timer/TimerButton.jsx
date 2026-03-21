import { titleize } from "../../utils/helpers";
import { memo } from "react";

function TimerButton(props) {
  // set id to provided number or string value
  // in case of provided label, use label over provided value
  const identifier = typeof(props.value) === 'string'
    ? `${props.value}-button`
    : `button-${props.value}`;

  const newValue = typeof(props.value) !== 'string' ? props.value : null;
  const displayText = props.label ? titleize(props.label) : props.value;

  return (
    <button
      onClick={props.onClick}
      id={identifier}
      className={`timer-button timer-btn-${props.type}`}
      value={newValue}
    >
      {displayText}
    </button>
  );
};

export default memo(TimerButton);
