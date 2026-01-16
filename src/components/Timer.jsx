function Timer() {
  return (
    <div className="timer-display">
      <div className="timer-info-display">
        <h4>Time: </h4>
        <h4>Place: </h4>
        <h4>Bib#: </h4>
        <h4>Name: </h4>
      </div>
      <div className="timer-buttons-container">
        <button id="button-1" className="timer-button timer-btn-reg" value="1">1</button>
        <button id="button-2" className="timer-button timer-btn-reg" value="2">2</button>
        <button id="button-3" className="timer-button timer-btn-reg" value="3">3</button>
        <button id="button-4" className="timer-button timer-btn-reg" value="4">4</button>
        <button id="button-5" className="timer-button timer-btn-reg" value="5">5</button>
        <button id="button-6" className="timer-button timer-btn-reg" value="6">6</button>
        <button id="button-7" className="timer-button timer-btn-reg" value="7">7</button>
        <button id="button-8" className="timer-button timer-btn-reg" value="8">8</button>
        <button id="button-9" className="timer-button timer-btn-reg" value="9">9</button>
        <button id="same-time-button" className="timer-button timer-btn-color">Same Time</button>
        <button id="button-0" className="timer-button timer-btn-reg" value="0">0</button>
        <button id="clear-button" className="timer-button timer-btn-color">Clear</button>
        <button id="start-record-button" className="timer-button timer-btn-color">Start</button>
      </div>
    </div>
  );
}

export default Timer;
