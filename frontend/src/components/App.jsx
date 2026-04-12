import Header from "./shared/Header";
import Footer from "./shared/Footer";
import Tab from "./shared/tab/Tab";
import TabButton from "./shared/tab/TabButton";
import TimeKeeper from "./timer/TimeKeeper";
import Timer from "./timer/Timer";

import { useState, useRef, useCallback, useMemo, memo } from "react";
import handicapsJSON from '../handicaps.json';
import { checkIsPresent, setMinMaxAge } from "../utils/helpers";
import TimerIcon from '@mui/icons-material/Timer';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';

const timerHeaders = ['place', 'bib', 'timeRaw', 'lName', 'fName'];
const categoryHeaders = ['category', 'raceNo'];
const racerHeaders = ['bib', 'fName', 'lName', 'category', 'division', 'handicap'];
const resultHeaders = ['place', 'timeRaw', 'bib', 'lName', 'fName', 'city', 'category', 'division', 'sex'];
const headersObject = {
  timer: timerHeaders,
  category: categoryHeaders,
  racer: racerHeaders,
  result: resultHeaders
};

const importExportFields = ['times', 'categories', 'racers', 'clear existing', 'merge', 'filename'];
const timerRecordsEditFields = ['bib', 'timeRaw'];
const categoryFields = ['category', 'raceNo', 'sex', 'plusFive', 'plusTen'];
const racerFields = ['bib', 'age', 'sex', 'lName', 'fName', 'city', 'handicap', 'raceNo', 'category', 'division'];
const fieldsObject = {
  timer: timerRecordsEditFields,
  category: categoryFields,
  racer: racerFields,
  import: importExportFields,
  export: importExportFields
};

function App() {
  var records = [
    {id: 1, place: null, bib: 1, age: 32, sex: "M", raceNo: 1, handicap: 0.996, timeRaw: null, city: "Lumiere", fName: "Gustave", lName: "Pierre", category: "M30-39", division: "10k"},
    {id: 2, place: null, bib: 2, age: 16, sex: "F", raceNo: 1, handicap: 0.78, timeRaw: null, city: "Lumiere", fName: "Maelle", lName: "Pierre", category: "F10-19", division: "23k"},
    {id: 3, place: null, bib: 3, age: 32, sex: "F", raceNo: 1, handicap: 0.97, timeRaw: null, city: "Lumiere", fName: "Sciel", lName: "Jeanne", category: "F30-39", division: "10k"},
    {id: 4, place: null, bib: 4, age: 32, sex: "F", raceNo: 1, handicap: 0.97, timeRaw: null, city: "Lumiere", fName: "Lune", lName: "Acuse", category: "F30-39", division: "15k"},
    {id: 5, place: null, bib: 5, age: 45, sex: "M", raceNo: 1, handicap: 0.84, timeRaw: null, city: "Lumiere", fName: "Verso", lName: "L'vange", category: "M40-49", division: "10k"},
    {id: 6, place: null, bib: 54, age: 59, sex: "M", raceNo: 1, handicap: 0.795, timeRaw: null, city: "Lumiere", fName: "Monoco", lName: "Gestral", category: "M50-59", division: "5k"}
  ];

  var categories = [
    {id: 1, category: "F20-29", raceNo: 1, sex: 'F', minAge: 20, maxAge: 29 },
    {id: 2, category: "M20-29", raceNo: 1, sex: 'M', minAge: 20, maxAge: 29 },
    {id: 3, category: "F30-39", raceNo: 1, sex: 'F', minAge: 30, maxAge: 39 },
    {id: 4, category: "M30-39", raceNo: 1, sex: 'M', minAge: 30, maxAge: 39 },
    {id: 5, category: "F40-49", raceNo: 1, sex: 'F', minAge: 40, maxAge: 49 },
    {id: 6, category: "M40-49", raceNo: 1, sex: 'M', minAge: 40, maxAge: 49 }
  ];

  // TODO: displayRecords starter to be replaced with await fetchAllRacers()
  const [displayRecords, setDisplayRecords] = useState(records);
  // TODO: displayRecords starter to be replaced with await fetchAllCategories()
  const [displayCategories, setDisplayCategories] = useState(categories);
  // TODO: connect backend and generate IDs there
  const nextID = useRef(7);
  const nextCatID = useRef(7);
  // TODO: timerDisplayRecords to be a filtered version of displayRecords
  // filter for time/rawTime, and also order by ascension
  // this way timerDisplayRecords is updated with user data if prev not found
  const [timerDisplayRecords, setTimerDisplayRecords] = useState([]);
  const [tab, setTab] = useState("timer");
  const [place, setPlace] = useState(1);
  const [buttonText, setButtonText] = useState("start");
  const [handicaps, setHandicaps] = useState(handicapsJSON);

  const headers = useMemo(() => headersObject[tab], [tab]);
  const fields = useMemo(() => fieldsObject[tab], [tab]);
  const memoCategories = useMemo(() => displayCategories, [displayCategories]);
  const memoRecords = useMemo(() => displayRecords, [displayRecords]);
  const memoTimerRecords = useMemo(() => timerDisplayRecords, [timerDisplayRecords]);


  // -------------- DB LOGIC --------------
  // load handicaps from backend on first render
  // useEffect(() => {
  //   async function loadHandicaps() {
  //     const handicapsJSON = await fetchHandicaps();
  //     setHandicaps(handicapsJSON);
  //   }
  //   loadHandicaps();
  // }, []);

  // async function fetchHandicaps() {
  //   const response = await fetch('/handicaps');
  //   return response.json();
  // }

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
  const fetchRacerRecord = useCallback(
    async (bib) => {
    const racerRecord = displayRecords.find((record) => {
      return record.bib === bib;
    });
    return racerRecord;
    }, [displayRecords]
  );


  // -------------- TIMER RECORD DISPLAY LOGIC --------------
  // takes 2 records => updates a single, previously displayed record
  // with new time and/or placement on timer record display,
  // resets the old record and updates all record displays
  const updateDisplayedRecords = useCallback(
    ({ oldRecord: oldR, newRecord: updated }) => {
    resetDBRecord(oldR);
    updateDBRecord(updated);
    // TODO: recalculate placement if time is reduced or increased
    setDisplayRecords(prev =>
      prev.map(prevRecord =>
        prevRecord.id === updated.id ? { ...updated } : prevRecord
      )
    );
    setTimerDisplayRecords(prev => {
      const index = prev.findIndex(record => record?.id === oldR?.id);
      if (index === -1) { return [...prev, updated] };
      const updatedRecords = [...prev];
      updatedRecords[index] = { ...updatedRecords[index], ...updated};
      return updatedRecords;
    });
  }, []);

  // deletes a racer record from the timer record display and resets the racer's time/place in the DB
  const deleteDisplayedRecord = useCallback(
    (recordToDelete) => {
    resetDBRecord(recordToDelete);
    setTimerDisplayRecords((prevRecords) => {
      // filter out deleted record
      const filteredRecords = prevRecords.filter((record) =>
        record.id !== recordToDelete.id
      );
      // update placements of all subsequent records
      return filteredRecords.map((record) =>
        record.place > recordToDelete.place
        ? { ...record, place: record.place - 1 }
        : record
      );
    });
    // TODO: need to update places in DB
    setPlace(prev => prev - 1);
  }, []);


  // -------------- RACER LOGIC --------------
  // adds a new racer to the database
  // and instantaneously updates displayed records in timer and racer tabs
  const addRacer = useCallback(
    (racerData) => {
    const newRacer = {
      ...racerData,
      id: nextID.current,
      place: null,
      timeRaw: null,
      bib: parseInt(racerData.bib),
      raceNo: parseInt(racerData.raceNo),
      handicap: handicaps[racerData.sex][racerData.age]
    };
    setDisplayRecords(prev => [...prev, newRacer]);
    // update timer display with relevant info in case a placement is recorded
    // for an empty bib. update user info on timer display when info is added
    setTimerDisplayRecords(prev =>
      prev.map((record) => {
        if (record.bib === newRacer.bib && record.lName === "Not Found") {
          return {
            ...record,
            ...newRacer,
            place: record.place,
            timeRaw: record.timeRaw
          };
        }
        return record;
      })
    );
    nextID.current += 1;
  }, [handicaps]);

  // edits a racer's personal information
  // and instantaneously updates the records displayed in timer tab and racers tab
  const editRacer = useCallback(
    ({ oldRecord: oldR, newRecord: newR }) => {
      const ageChanged = oldR.age !== newR.age;
      const sexChanged = oldR.sex !== newR.sex;
      const handicapMissing = newR.handicap === undefined;

      const shouldRecalculateHandicap =
        handicapMissing ||
        (ageChanged || sexChanged) && oldR.handicap === newR.handicap;

      // object spreading to update only new values
      var updatedRacer = {
        ...oldR,
        ...newR,
        ...(shouldRecalculateHandicap && {
          handicap: handicaps[newR.sex ?? oldR.sex][newR.age ?? oldR.age]
        })
      };

      if (shouldRecalculateHandicap) {
        updatedRacer.handicap = handicaps[updatedRacer.sex][updatedRacer.age];
      };

      updateDisplayedRecords({ oldRecord: oldR, newRecord: updatedRacer })
      updateDBRecord(updatedRacer);
  }, [handicaps, updateDisplayedRecords]);

  // deletes a racer from the database
  // and from timer display (if relevant) and racers' tab
  const deleteRacer = useCallback(
    (racerToDelete) => {
    const isDisplayed = checkIsPresent({
      array: timerDisplayRecords,
      target: racerToDelete.bib,
      type: "bib"
    });

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
  }, [deleteDisplayedRecord, timerDisplayRecords]);


  // -------------- CATEGORY LOGIC --------------
  const addCategory = useCallback(
    (category) => {
    setDisplayCategories(prev =>
      [...prev,
        { ...category, id: nextCatID.current }
      ]);
    addDBCategory(category);
    nextCatID.current += 1;
  }, []);

  const editCategory = useCallback(
    ({ newData: newData, oldData: oldData, }) => {
    const updatedCategory = {
      ...oldData,
      ...newData
    };
    setDisplayCategories(prev => prev.map(cat => {
      return cat.id === updatedCategory.id ? updatedCategory : cat;
    }));
    updateDBCategory(updatedCategory);
  }, []);

  const deleteCategory = useCallback(
    (catToDelete) => {
    setDisplayCategories(prev => prev.filter(cat => cat.id !== catToDelete.id));
    // TODO: remove category from all racers with it currently listed
    deleteDBCategory(catToDelete);
  }, []);


  // -------------- TAB SWITCH LOGIC --------------
  // create function once to prevent recreation every rerender
  const goToTimer = useCallback(() => setTab("timer"), []);
  const goToCategory = useCallback(() => setTab("category"), []);
  const goToRacer = useCallback(() => setTab("racer"), []);
  const goToResult = useCallback(() => setTab("result"), []);

  const TIMER_ICON = <TimerIcon />;
  const CATEGORY_ICON = <FormatListBulletedAddIcon />;
  const RACER_ICON = <DirectionsRunIcon />;
  const RESULT_ICON = <EmojiEventsIcon />;

  const TabButtonBar = memo(function TabButtonBar({
    tab, goToTimer, goToCategory, goToRacer, goToResult
  }) {
    return (
      <div className="tab-display">
        <TabButton aria-label="timer tab" active={tab === "timer"} icon={TIMER_ICON} onClick={goToTimer} />
        <TabButton aria-label="category tab" active={tab === "category"} icon={CATEGORY_ICON} onClick={goToCategory} />
        <TabButton aria-label="racer tab" active={tab === "racer"} icon={RACER_ICON} onClick={goToRacer} />
        <TabButton aria-label="result tab" active={tab === "result"} icon={RESULT_ICON} onClick={goToResult} />
      </div>
    );
  });


  return (
    <div className="App">
      <Header />
      <div className="main-content">
        <TabButtonBar
          tab={tab}
          goToTimer={goToTimer}
          goToCategory={goToCategory}
          goToRacer={goToRacer}
          goToResult={goToResult}
        />

        <TimeKeeper>
          {timer => (
            <>
              {tab === "timer" && (
                <div className="timer-tab">
                            <Tab
                              tab={tab}
                              headers={headers}
                              fields={fields}
                              setPlace={setPlace}
                              place={place}
                              buttonText={buttonText}
                              setButtonText={setButtonText}
                              records={memoTimerRecords}
                              fetchRecord={fetchRacerRecord}
                              delete={deleteDisplayedRecord}
                              update={updateDisplayedRecords}
                            />
                            <Timer
                              tab={tab}
                              timer={timer}
                              setPlace={setPlace}
                              place={place}
                              buttonText={buttonText}
                              setButtonText={setButtonText}
                              records={memoTimerRecords}
                              fetchRecord={fetchRacerRecord}
                              update={updateDisplayedRecords}
                            />
                </div>
              )}
              {tab === "category" && <Tab
                                    tab={tab}
                                    headers={headers}
                                    fields={fields}
                                    fieldsObj={fieldsObject}
                                    records={memoCategories}
                                    add={addCategory}
                                    edit={editCategory}
                                    delete={deleteCategory}
                                  />
              }
              {tab === "racer" && <Tab
                                    tab={tab}
                                    headers={headers}
                                    fields={fields}
                                    fieldsObj={fieldsObject}
                                    records={memoRecords}
                                    categories={memoCategories}
                                    update={updateDisplayedRecords}
                                    add={addRacer}
                                    edit={editRacer}
                                    delete={deleteRacer}
                                  />
              }
              {tab === "result" && <Tab
                                    tab={tab}
                                    headers={headers}
                                    fieldsObj={fieldsObject}
                                    records={memoTimerRecords}
                                  />
              }
          </>
        )}
      </TimeKeeper>
      </div>
      <Footer />
    </div>
  );
};

export default memo(App);
