import React from 'react';

function TabButton({ icon, active, onClick, ...props }) {
  return (
    <button
      { ...props }
      className={`tab-btn ${active ? "active" : ""}`}
      onClick={onClick}
    >
    {icon}
    </button>
  );
}

export default React.memo(TabButton);
