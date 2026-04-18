import Header from "./shared/Header";
import Footer from "./shared/Footer";
import Tab from "./shared/tab/Tab";
import TabButton from "./shared/tab/TabButton";
import TimeKeeper from "./timer/TimeKeeper";
import Timer from "./timer/Timer";

import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import handicapsJSON from '../handicaps.json';
import { checkIsPresent, setMinmax_age } from "../utils/helpers";
import TimerIcon from '@mui/icons-material/Timer';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';

const timerHeaders = ['place', 'bib', 'time_raw', 'last_name', 'first_name'];
const categoryHeaders = ['category', 'min_age', 'max_age'];
const racerHeaders = ['bib', 'first_name', 'last_name', 'category', 'division', 'handicap'];
const resultHeaders = ['place', 'time_raw', 'bib', 'last_name', 'first_name', 'city', 'category', 'division', 'sex'];
const headersObject = {
  timer: timerHeaders,
  category: categoryHeaders,
  racer: racerHeaders,
  result: resultHeaders
};

const importExportFields = ['times', 'categories', 'racers', 'clear existing', 'merge', 'filename'];
const timerRecordsEditFields = ['bib', 'time_raw'];
const categoryFields = ['category', 'sex', 'min_age', 'max_age', 'plusFive', 'plusTen'];
const divisionFields = ['division', 'race_no', 'start_time'];
const racerFields = ['age', 'sex', 'first_name', 'last_name', 'city', 'handicap', 'email', 'race_no', 'category_id', 'division_id'];
const fieldsObject = {
  timer: timerRecordsEditFields,
  category: categoryFields,
  division: divisionFields,
  racer: racerFields,
  import: importExportFields,
  export: importExportFields
};

function App() {
  // TODO: timerDisplayRecords to be a filtered version of displayRecords
  // filter for time/rawTime, and also order by ascension
  // this way timerDisplayRecords is updated with user data if prev not found
  const [timerDisplayRecords, setTimerDisplayRecords] = useState([]);
  const [tab, setTab] = useState("timer");
  const [place, setPlace] = useState(1);
  const [buttonText, setButtonText] = useState("start");
  const [handicaps, setHandicaps] = useState(handicapsJSON);
  const [displayRecords, setDisplayRecords] = useState([]);
  const [displayCategories, setDisplayCategories] = useState([]);
  const [displayDivisions, setDisplayDivisions] = useState([]);
  const lastRecord = displayRecords.at(-1);
  const lastCat = displayCategories.at(-1);
  const lastDivision = displayDivisions.at(-1);
  const nextID = useRef(lastRecord ? lastRecord.id + 1 : 0);
  const nextCatID = useRef(lastCat ? lastCat.id + 1 : 0);
  const nextDivID = useRef(lastDivision ? lastDivision.id + 1 : 0);

  const headers = useMemo(() => headersObject[tab], [tab]);
  const fields = useMemo(() => fieldsObject[tab], [tab]);
  const memoCategories = useMemo(() => displayCategories, [displayCategories]);
  const memoRecords = useMemo(() => displayRecords, [displayRecords]);
  const memoTimerRecords = useMemo(() => timerDisplayRecords, [timerDisplayRecords]);
  const memoDivisions = useMemo(() => displayDivisions, [displayDivisions]);


  // -------------- DB LOGIC --------------
  // load data from backend on first render
  useEffect(() => {
    async function loadHandicaps() {
      const handicapsJSON = await fetchHandicaps();
      setHandicaps(handicapsJSON);
    }
    loadHandicaps();
  }, []);

  useEffect(() => {
    async function loadRacers() {
      const racersJSON = await fetchAllRacers();
      setDisplayRecords(racersJSON);
    }
    loadRacers();
  }, []);

  useEffect(() => {
    async function loadCategories() {
      const categoriesJSON = await fetchAllCategories();
      setDisplayCategories(categoriesJSON);
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadDivisions() {
      const divisionsJSON = await fetchAllDivisions();
      setDisplayDivisions(divisionsJSON);
    }
    loadDivisions();
  }, []);


  async function fetchHandicaps() {
    const response = await fetch('/handicaps');
    return response.json();
  }

  async function fetchAllRacers() {
    const response = await fetch('/api/racer');
    return response.json();
  };

  async function addDBRacer(data) {
    const response = await fetch('/api/racer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ racer: data })
    });

    return await response.json();
  };

  async function updateDBRacer() {
    // TODO: update racer/record in DB
  };

  function resetDBRacer() {
    // TODO: set DB racer time and place back to null
  };

  function deleteDBRacer() {
    // TODO: delete racer from DB
  }

  async function fetchAllCategories() {
    const response = await fetch('/api/category');
    return response.json();
  };

  async function addDBCategory(data) {
    const response = await fetch('/api/category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: data })
    });

    return await response.json();
  };

  async function updateDBCategory() {
    // TODO: update category in DB
  };

  function deleteDBCategory() {
    // TODO: delete and remove from racers
  };

  async function fetchAllDivisions() {
    const response = await fetch('/api/division');
    return response.json();
  };

  async function addDBDivision() {
     // TODO: add Division in DB
  };

  async function updateDBDivision() {
    // TODO: update Division in DB and racers
  };

  function deleteDBDivision() {
    // TODO: delete and remove from racers
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
    resetDBRacer(oldR);
    updateDBRacer(updated);
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
    resetDBRacer(recordToDelete);
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
    async (racerData) => {
      const updated = { ...racerData }
      delete updated.race_no
      const newRacer = await addDBRacer(updated)
      setDisplayRecords(prev => [...prev, newRacer]);
      // update timer display with relevant info in case a placement is recorded
      // for an empty bib. update user info on timer display when info is added
      setTimerDisplayRecords(prev =>
        prev.map((record) => {
          if (record.bib === newRacer.bib && record.last_name === "Not Found") {
            return {
              ...record,
              ...newRacer,
              place: record.place,
              time_raw: record.time_raw
            };
          }
          return record;
        })
      );
    }
  );

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
      updateDBRacer(updatedRacer);
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
    async (category) => {
      const newCat = await addDBCategory(category);
      setDisplayCategories(prev => [...prev, { ...newCat }]);
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
                              divisions={memoDivisions}
                              categories={memoCategories}
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
                                    divisions={memoDivisions}
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
                                    divisions={memoDivisions}
                                    categories={memoCategories}
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
