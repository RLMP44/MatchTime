import Header from "./Header";
import Footer from "./Footer";
import TimerTab from "./timer-tab/TimerTab";
import RacersTab from "./racers-tab/RacersTab";
import CategoriesTab from "./CategoriesTab";
import ResultsTab from "./ResultsTab";
import { useState } from "react";
import TimerIcon from '@mui/icons-material/Timer';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';

function App() {
  // TODO: connect backend and generate IDs there
  var nextID = 7;
  var records = [
    {id: 1, place: null, bib: 1, age: 32, sex: "M", raceNo: 1, handicap: null, timeRaw: null, city: "Lumiere", time: null, fName: "Gustave", lName: "Pierre", division: "M30-39"},
    {id: 2, place: null, bib: 2, age: 16, sex: "F", raceNo: 1, handicap: null, timeRaw: null, city: "Lumiere", time: null, fName: "Maelle", lName: "Pierre", division: "F10-19"},
    {id: 3, place: null, bib: 3, age: 32, sex: "F", raceNo: 1, handicap: null, timeRaw: null, city: "Lumiere", time: null, fName: "Sciel", lName: "Jeanne", division: "F30-39"},
    {id: 4, place: null, bib: 4, age: 32, sex: "F", raceNo: 1, handicap: null, timeRaw: null, city: "Lumiere", time: null, fName: "Lune", lName: "Acuse", division: "F30-39"},
    {id: 5, place: null, bib: 5, age: 45, sex: "M", raceNo: 1, handicap: null, timeRaw: null, city: "Lumiere", time: null, fName: "Verso", lName: "L'vange", division: "M40-49"},
    {id: 6, place: null, bib: 54, age: 59, sex: "M", raceNo: 1, handicap: null, timeRaw: null, city: "Lumiere", time: null, fName: "Monoco", lName: "Gestral", division: "M50-59"}
  ];

  // TODO: displayRecords starter to be replaced with await fetchAllUsers()
  const [displayRecords, setDisplayRecords] = useState(records);
  // TODO: timerDisplayRecords to be a filtered version of displayRecords
  // filter for time/rawTime, and also order by ascension (not calculating handicaps yet)
  // this way timerDisplayRecords is updated with user data if prev not found
  const [timerDisplayRecords, setTimerDisplayRecords] = useState([]);
  const [tab, setTab] = useState("timer");
  const [place, setPlace] = useState(1);
  const [timerOn, setTimerOn] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [buttonText, setButtonText] = useState("Start");

  // -------------- TIMER LOGIC --------------
  function startTimer() {
    setStartTime(performance.now());
    setTimerOn(true);
  };

  // function stopTimer() {
  //   setTimerOn(false);
  //   // TODO: create race end button away from timer UI to avoid accidents
  // };


  // -------------- DB LOGIC --------------
  // async function fetchAllUsers() {
  //   // TODO: fetch user records from backend
  //   // return as list
  //   return records;
  // };

  // async function fetchLastDBRecord() {
    // TODO: retrieve time and placement of last record in DB
  // };

  async function updateDBRecord() {
    // TODO: update user record in DB
  };

  function resetDBRecord() {
    // TODO: set DB record time and place back to null
  };


  // -------------- FRONT END DISPLAY LOGIC --------------
  async function fetchUserRecord(bib) {
    const userRecord = displayRecords.find((record) => {
      return record.bib === bib;
    });
    return userRecord;
  };

  function updateDisplayRecord(record) {
    updateDBRecord(record);
    // TODO: add new time and placement
    // TODO: send to backend function and use SQL to update single record only
    // instead of updating entire array/db
    // temporary until backend is established
    records = records.map((oldRecord) => {
      return (oldRecord.id === record.id) ? record : oldRecord
    });
    setTimerDisplayRecords((prevRecords) => {
      return [...prevRecords, record];
    });
  };

  // takes 2 records => resets old record and updates new record
  function editUserRecords({ oldRecord: oldR, newRecord: newR }) {
    resetDBRecord(oldR);
    updateDBRecord(newR);
    setTimerDisplayRecords((prevRecords) =>
      prevRecords.map((record) => {
        return record.id === oldR.id ? newR : record
      })
    );
  };

  function deleteRecord(recordToDelete) {
    resetDBRecord(recordToDelete);
    setTimerDisplayRecords((prevRecords) => {
      // filter out deleted record
      const filteredRecords = prevRecords.filter((record) =>
        record.id !== recordToDelete.id
      );
      // update placements of all subsequent records
      return filteredRecords.map((record) =>
        record.place > recordToDelete.place ? { ...record, place: record.place - 1 } : record
      );
    });
    setPlace(prev => prev - 1);
  };


  // -------------- RACER LOGIC --------------
  function addRacer(racerData) {
    const newRacer = {
      ...racerData,
      id: nextID,
      place: null,
      time: null,
      timeRaw: null,
      bib: parseInt(racerData.bib),
      raceNo: parseInt(racerData.raceNo)
    };
    nextID += 1;
    setDisplayRecords(prev => [...prev, newRacer]);
  };

  function editRacer({ oldData: oldR, newData: newR }) {
    // object spreading to update only new values
    var updatedRacer = {
      ...oldR,
      ...newR,
    };
    setDisplayRecords(prev =>
      prev.map(record =>
        record.id === oldR.id ? updatedRacer : record
      )
    );
    setTimerDisplayRecords(prev =>
      prev.map(record => {
        if (record.id !== oldR.id) {
          return record;
        }
        return {
          ...record,
          ...newR
        }
      })
    );
  };

  function deleteRacer() {
    console.log('delete racer');
  };


  return (
    <div className="App">
      <Header />
      <div className="main-content">
        <div className="tab-display">
          <button className={`tab-btn ${tab === "timer" ? "active" : ""}`} onClick={() => setTab("timer")} alt="Timer"><TimerIcon /></button>
          <button className={`tab-btn ${tab === "categories" ? "active" : ""}`} onClick={() => setTab("categories")} alt="Categories"><FormatListBulletedAddIcon /></button>
          <button className={`tab-btn ${tab === "racers" ? "active" : ""}`} onClick={() => setTab("racers")} alt="Racers"><DirectionsRunIcon /></button>
          <button className={`tab-btn ${tab === "results" ? "active" : ""}`} onClick={() => setTab("results")} alt="Results"><EmojiEventsIcon /></button>
        </div>
        {tab === "timer" && <TimerTab
                              setPlace={setPlace}
                              place={place}
                              timerOn={timerOn}
                              setTimerOn={setTimerOn}
                              buttonText={buttonText}
                              setButtonText={setButtonText}
                              tab={tab}
                              startTime={startTime}
                              startTimer={startTimer}
                              setStartTime={setStartTime}
                              timerDisplayRecords={timerDisplayRecords}
                              editRecords={editUserRecords}
                              fetchRecord={fetchUserRecord}
                              deleteRecord={deleteRecord}
                              updateDisplayRecord={updateDisplayRecord}
                            />
        }
        {tab === "categories" && <CategoriesTab />}
        {tab === "racers" && <RacersTab
                              records={displayRecords}
                              setDisplayRecords={setDisplayRecords}
                              addRacer={addRacer}
                              editRacer={editRacer}
                              deleteRacer={deleteRacer}
                            />
        }
        {tab === "results" && <ResultsTab timerDisplayRecords={timerDisplayRecords} />}
      </div>
      <Footer />
    </div>
  );
};

export default App;
