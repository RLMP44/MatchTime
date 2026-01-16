function Timer() {
  var time = 0;
  var bibNum = null;

  function handleClick(event) {
    console.log(event.target.id);
    var target = event.target;
    if (target.value) {
      bibNum = (bibNum === null) ? target.value : bibNum + target.value;
      console.log(bibNum);
      // retrieve value
      // append each value to previous bibNum and search
      // update timer-info-display with entrant name upon button press
    } else if (target.id === "start-record-button") {
      // check innerHTML
        // if "start", start timer
        // if "record"
          // submit bib number to backend and retrieve entrant's info
          // retrieve time and placement, and bundle with entrant's info
          // submit data to backend
          // update records display in timer tab
        console.log(bibNum);
        console.log("submit")
        bibNum = null;
    } else if (target.id === "clear-button") {
      // clear bibNum
      bibNum = null;
      // clear name in timer-info-display
      console.log("clear")
    } else if (target.id === "same-time-button") {
      // retrieve time and placement info from latest entry
      // if exists
        // submit bib number to backend and retrieve entrant's info
        // bundle time and placement with entrant's info
        // submit data to backend
        // update records display in timer tab
        console.log("same time")
    }
  }

  return (
    <div className="timer-display">
      <div className="timer-info-display">
        <h4>Time: </h4>
        <h4>Place: </h4>
        <h4>Bib#: </h4>
        <h4>Name: </h4>
      </div>
      <div className="timer-buttons-container">
        <button onClick={handleClick} id="button-1" className="timer-button timer-btn-reg" value="1">1</button>
        <button onClick={handleClick} id="button-2" className="timer-button timer-btn-reg" value="2">2</button>
        <button onClick={handleClick} id="button-3" className="timer-button timer-btn-reg" value="3">3</button>
        <button onClick={handleClick} id="button-4" className="timer-button timer-btn-reg" value="4">4</button>
        <button onClick={handleClick} id="button-5" className="timer-button timer-btn-reg" value="5">5</button>
        <button onClick={handleClick} id="button-6" className="timer-button timer-btn-reg" value="6">6</button>
        <button onClick={handleClick} id="button-7" className="timer-button timer-btn-reg" value="7">7</button>
        <button onClick={handleClick} id="button-8" className="timer-button timer-btn-reg" value="8">8</button>
        <button onClick={handleClick} id="button-9" className="timer-button timer-btn-reg" value="9">9</button>
        <button onClick={handleClick} id="same-time-button" className="timer-button timer-btn-color">Same Time</button>
        <button onClick={handleClick} id="button-0" className="timer-button timer-btn-reg" value="0">0</button>
        <button onClick={handleClick} id="clear-button" className="timer-button timer-btn-color">Clear</button>
        <button onClick={handleClick} id="start-record-button" className="timer-button timer-btn-color">Start</button>
      </div>
    </div>
  );
}

export default Timer;
