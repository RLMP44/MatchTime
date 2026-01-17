import { useState } from "react";

function Timer() {
  const [time, setTime] = useState(null);
  const [started, setStarted] = useState(false);
  const [bibNum, setBibNum] = useState(null);
  const [name, setName] = useState(null);
  const [place, setPlace] = useState(1);
  const [buttonText, setButtonText] = useState("Start");

  // while (started) {
  //   setTimeout(setTime(prev => prev + 1), 100);
  //   console.log(time)
  // }

  function handleClick(event) {
    console.log(event.target.id);
    var target = event.target;
    if (target.value) {
      setBibNum((prevNum) => {
        return (prevNum !== null) ? prevNum + target.value : target.value;
      });
      // submit bibNum to backend and retrieve name
      setName("name"); // to be updated
      // update timer-info-display with entrant name upon button press
    } else if (target.id === "start-record-button") {
      if (buttonText === "Start") {
        setButtonText("Record");
        setStarted(true);
      };
        // if "record"
          // submit bib number to backend and retrieve entrant's info
          // retrieve time and placement, and bundle with entrant's info
          // submit data to backend
          // update records display in timer tab
        console.log("submit")
        reset();
        setPlace((prevNum) => {return prevNum + 1});
    } else if (target.id === "clear-button") {
      reset();
      console.log("clear")
    } else if (target.id === "same-time-button") {
      reset();
      setPlace(prev => prev + 2);
      // retrieve time and placement info from latest entry
      // if exists
        // submit bib number to backend and retrieve entrant's info
        // bundle time and placement with entrant's info
        // submit data to backend
        // update records display in timer tab
        console.log("same time")
    }
  }

  function reset() {
    setBibNum(null);
    setName(null);
  }

  return (
    <div className="timer-display">
      <div className="timer-info-display">
        <h4>Time: <span id="time-display">{time}</span></h4>
        <h4>Place: <span id="place-display">{place}</span></h4>
        <h4>Bib#: <span id="bib-display">{bibNum}</span></h4>
        <h4>Name: <span id="name-display">{name}</span></h4>
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
        <button onClick={handleClick} id="start-record-button" className="timer-button timer-btn-color">{buttonText}</button>
      </div>
    </div>
  );
}

export default Timer;
