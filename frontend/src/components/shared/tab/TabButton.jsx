import React from 'react';

function TabButton(props) {
  return (
    <button
      className={`tab-btn ${props.active ? "active" : ""}`}
      onClick={props.onClick}
    >
    {props.icon}
    </button>
  );
}

export default React.memo(TabButton);
