import Header from "./shared/Header";
import Footer from "./shared/Footer";
import Tab from "./shared/Tab";
import { useState, useRef } from "react";
import { checkIsPresent } from "../utils/helpers";
import TimerIcon from '@mui/icons-material/Timer';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';

function App() {
  var records = [
    {id: 1, place: null, bib: 1, age: 32, sex: "M", raceNo: 1, handicap: 0, timeRaw: null, city: "Lumiere", time: null, fName: "Gustave", lName: "Pierre", division: "M30-39"},
    {id: 2, place: null, bib: 2, age: 16, sex: "F", raceNo: 1, handicap: 0, timeRaw: null, city: "Lumiere", time: null, fName: "Maelle", lName: "Pierre", division: "F10-19"},
    {id: 3, place: null, bib: 3, age: 32, sex: "F", raceNo: 1, handicap: 0, timeRaw: null, city: "Lumiere", time: null, fName: "Sciel", lName: "Jeanne", division: "F30-39"},
    {id: 4, place: null, bib: 4, age: 32, sex: "F", raceNo: 1, handicap: 0, timeRaw: null, city: "Lumiere", time: null, fName: "Lune", lName: "Acuse", division: "F30-39"},
    {id: 5, place: null, bib: 5, age: 45, sex: "M", raceNo: 1, handicap: 0, timeRaw: null, city: "Lumiere", time: null, fName: "Verso", lName: "L'vange", division: "M40-49"},
    {id: 6, place: null, bib: 54, age: 59, sex: "M", raceNo: 1, handicap: 0, timeRaw: null, city: "Lumiere", time: null, fName: "Monoco", lName: "Gestral", division: "M50-59"}
  ];

  var categories = [
    {id: 1, category: "F20-29", raceNo: 1, handicap: 0, sex: 'F'},
    {id: 2, category: "M20-29", raceNo: 1, handicap: 0, sex: 'M'},
    {id: 3, category: "F30-39", raceNo: 1, handicap: 0, sex: 'F'},
    {id: 4, category: "M30-39", raceNo: 1, handicap: 0, sex: 'M'},
    {id: 5, category: "F40-49", raceNo: 1, handicap: 0, sex: 'F'},
    {id: 6, category: "M40-49", raceNo: 1, handicap: 0, sex: 'M'}
  ];

  // TODO: displayRecords starter to be replaced with await fetchAllRacers()
  const [displayRecords, setDisplayRecords] = useState(records);
  // TODO: displayRecords starter to be replaced with await fetchAllCategories()
  const [displayCategories, setDisplayCategories] = useState(categories);
  // TODO: connect backend and generate IDs there
  const nextID = useRef(7);
  const nextCatID = useRef(7);
  // TODO: timerDisplayRecords to be a filtered version of displayRecords
  // filter for time/rawTime, and also order by ascension (not calculating handicaps yet)
  // this way timerDisplayRecords is updated with user data if prev not found
  const [timerDisplayRecords, setTimerDisplayRecords] = useState([]);
  const [tab, setTab] = useState("timer");
  const [place, setPlace] = useState(1);
  const [timerOn, setTimerOn] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [buttonText, setButtonText] = useState("Start");

  const timerHeaders = ['place', 'bib', 'timeRaw', 'lName', 'fName'];
  const categoryHeaders = ['category', 'raceNo', 'handicap'];
  const racerHeaders = ['bib', 'fName', 'lName', 'division'];
  const resultHeaders = ['place', 'time', 'bib', 'lName', 'fName', 'city', 'division', 'sex'];
  const headersObject = {
    timer: timerHeaders,
    category: categoryHeaders,
    racer: racerHeaders,
    result: resultHeaders
  };

  const importExportFields = ['times', 'categories', 'racers', 'clear existing', 'merge', 'filename'];
  const timerRecordsEditFields = ['bib', 'timeRaw'];
  const categoryFields = ['category', 'handicap', 'raceNo', 'sex', 'plusFive', 'plusTen'];
  const racerFields = ['bib', 'age', 'sex', 'lName', 'fName', 'city', 'handicap', 'raceNo', 'division'];
  const fieldsObject = {
    timer: timerRecordsEditFields,
    category: categoryFields,
    racer: racerFields,
    import: importExportFields,
    export: importExportFields
  };

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
  // async function fetchAllRacers() {
  //   // TODO: fetch racer records from backend
  //   // return as list
  //   return records;
  // };

  // async function fetchLastDBRecord() {
    // TODO: retrieve time and placement of last record in DB
  // };

  async function updateDBRecord() {
    // TODO: update racer/record in DB
  };

  function resetDBRecord() {
    // TODO: set DB record time and place back to null
  };

  function deleteDBRacer() {
    // TODO: delete racer from DB
  }

  // async function fetchAllCategories() {
  //   // TODO: get all categories from DB
  // };

  async function addDBCategory() {
     // TODO: add category in DB
  };

  async function updateDBCategory() {
    // TODO: update category in DB
  };

  function deleteDBCategory() {
    // TODO: set DB category time and place back to null
  };


  // -------------- FRONT END LOGIC --------------
  async function fetchRacerRecord(bib) {
    const racerRecord = displayRecords.find((record) => {
      return record.bib === bib;
    });
    return racerRecord;
  };


  // -------------- TIMER RECORD DISPLAY LOGIC --------------
  // updates a single record with new time and/or placement
  function updateDisplayedRecord(record) {
    updateDBRecord(record);
    // TODO: add new time and placement
    // TODO: send to backend function and use SQL to update single record only
    // instead of updating entire array/db
    // temporary until backend is established
    // TODO: recalculate placement if time is reduced or increased
    setDisplayRecords((prevRecords) => {
      return prevRecords.map((oldRecord) => {
        return (oldRecord.id === record.id) ? record : oldRecord
      });
    });
    setTimerDisplayRecords((prevRecords) => {
      return [...prevRecords, record];
    });
  };

  // takes 2 records => replaces a previously displayed racer record with an updated racer record on timer record display, and resets the old record
  function swapDisplayedRacers({ oldRecord: oldR, newRecord: newR }) {
    resetDBRecord(oldR);
    updateDBRecord(newR);
    setTimerDisplayRecords((prevRecords) =>
      prevRecords.map((record) => {
        return record.id === oldR.id ? newR : record
      })
    );
  };

  // deletes a racer record from the timer record display and resets the racer's time/place in the DB
  function deleteDisplayedRecord(recordToDelete) {
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
    // TODO: need to update places in DB
    setPlace(prev => prev - 1);
  };


  // -------------- RACER LOGIC --------------
  // adds a new racer to the database and instantaneously updates displayed records in timer and racer tabs
  function addRacer(racerData) {
    const newRacer = {
      ...racerData,
      id: nextID.current,
      place: null,
      time: null,
      timeRaw: null,
      bib: parseInt(racerData.bib),
      raceNo: parseInt(racerData.raceNo)
    };
    setDisplayRecords(prev => [...prev, newRacer]);
    // update timer display with relevant info in case a placement is recorded for an empty bib. update user info on timer display when info is added
    setTimerDisplayRecords(prev =>
      prev.map((record) => {
        if (record.bib === newRacer.bib && record.lName === "Not Found") {
          return { ...record, ...newRacer, place: record.place, time: record.time, timeRaw: record.timeRaw };
        }
        return record;
      })
    );
    nextID.current += 1;
  };

  // edits a racer's personal information and instantaneously updates the records displayed in timer tab and racers tab
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
    updateDBRecord(updatedRacer);
  };

  // deletes a racer from the database and from timer display (if relevant) and racers' tab
  function deleteRacer(racerToDelete) {
    const isDisplayed = checkIsPresent({ array: timerDisplayRecords, target: racerToDelete.bib, type: "bib" });
    if (isDisplayed) {
      deleteDisplayedRecord(racerToDelete);
    };

    setDisplayRecords(prev => {
      const filtered = prev.filter(record =>
        record.id !== racerToDelete.id
      );
      return filtered;
    });

    deleteDBRacer(racerToDelete);
  };


  // -------------- CATEGORY LOGIC --------------
  function addCategory(category) {
    setDisplayCategories(prev => [...prev, { ...category, id: nextCatID.current }]);
    addDBCategory(category);
    nextCatID.current += 1;
  };

  function editCategory({ newData: newData, oldData: oldData, }) {
    const updatedCategory = {
      ...oldData,
      ...newData
    };
    setDisplayCategories(prev => prev.map(cat => {
      return cat.id === updatedCategory.id ? updatedCategory : cat;
    }));
    updateDBCategory(updatedCategory);
  };

  function deleteCategory(catToDelete) {
    setDisplayCategories(prev => prev.filter(cat => cat.id !== catToDelete.id));
    // TODO: remove category from all racers with it currently listed
    deleteDBCategory(catToDelete);
  };


  return (
    <div className="App">
      <Header />
      <div className="main-content">
        <div className="tab-display">
          <button className={`tab-btn ${tab === "timer" ? "active" : ""}`} onClick={() => setTab("timer")} alt="Timer"><TimerIcon /></button>
          <button className={`tab-btn ${tab === "category" ? "active" : ""}`} onClick={() => setTab("category")} alt="Category"><FormatListBulletedAddIcon /></button>
          <button className={`tab-btn ${tab === "racer" ? "active" : ""}`} onClick={() => setTab("racer")} alt="Racer"><DirectionsRunIcon /></button>
          <button className={`tab-btn ${tab === "result" ? "active" : ""}`} onClick={() => setTab("result")} alt="Results"><EmojiEventsIcon /></button>
        </div>
        {tab === "timer" && <Tab
                              tab={tab}
                              headers={headersObject[tab]}
                              fields={fieldsObject[tab]}
                              setPlace={setPlace}
                              place={place}
                              timerOn={timerOn}
                              setTimerOn={setTimerOn}
                              buttonText={buttonText}
                              setButtonText={setButtonText}
                              startTime={startTime}
                              startTimer={startTimer}
                              setStartTime={setStartTime}
                              records={timerDisplayRecords}
                              edit={swapDisplayedRacers}
                              fetchRecord={fetchRacerRecord}
                              delete={deleteDisplayedRecord}
                              update={updateDisplayedRecord}
                            />
        }
        {tab === "category" && <Tab
                              tab={tab}
                              headers={headersObject[tab]}
                              fields={fieldsObject[tab]}
                              fieldsObj={fieldsObject}
                              records={displayCategories}
                              add={addCategory}
                              edit={editCategory}
                              delete={deleteCategory}
                            />
        }
        {tab === "racer" && <Tab
                              tab={tab}
                              headers={headersObject[tab]}
                              fields={fieldsObject[tab]}
                              fieldsObj={fieldsObject}
                              records={displayRecords}
                              categories={displayCategories}
                              add={addRacer}
                              edit={editRacer}
                              delete={deleteRacer}
                            />
        }
        {tab === "result" && <Tab
                              tab={tab}
                              headers={headersObject[tab]}
                              fieldsObj={fieldsObject}
                              records={timerDisplayRecords}
                            />
        }
      </div>
      <Footer />
    </div>
  );
};

export default App;
