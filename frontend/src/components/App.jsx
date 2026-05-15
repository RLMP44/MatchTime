import Header from "./shared/Header";
import Footer from "./shared/Footer";
import Tab from "./shared/tab/Tab";
import TabButton from "./shared/tab/TabButton";
import TimeKeeper from "./timer/TimeKeeper";
import Timer from "./timer/Timer";

import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { checkIsPresent, mergeUpdatedRecord, diff, convertToMs } from "../utils/helpers";
import TimerIcon from '@mui/icons-material/Timer';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';

const API_BASE =
  window.location.search.includes("e2e") ? "/test_support" : "/api";

const timerHeaders = ['place', 'bib', 'time_raw', 'last_name', 'first_name'];
const categoryHeaders = ['category', 'sex', 'min_age', 'max_age'];
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
const categoryFields = ['category'];
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
  const [displayRecords, setDisplayRecords] = useState([]);
  const [displayCategories, setDisplayCategories] = useState([]);
  const [displayDivisions, setDisplayDivisions] = useState([]);

  const headers = useMemo(() => headersObject[tab], [tab]);
  const fields = useMemo(() => fieldsObject[tab], [tab]);
  const memoCategories = useMemo(() => displayCategories, [displayCategories]);
  const memoRecords = useMemo(() => displayRecords, [displayRecords]);
  const memoTimerRecords = useMemo(() => timerDisplayRecords, [timerDisplayRecords]);
  const memoDivisions = useMemo(() => displayDivisions, [displayDivisions]);


  // -------------- DB LOGIC --------------
  // load data from backend on first render
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

  async function fetchAllRacers() {
    const response = await fetch(`${API_BASE}/racer`);
    return response.json();
  };

  async function addDBRacer(data) {
    const response = await fetch(`${API_BASE}/racer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ racer: data })
    });

    return await response.json();
  };

  async function updateDBRacer({ id, newRecord }) {
    const response = await fetch(`${API_BASE}/racer/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ racer: newRecord })
    });

    return await response.json();
  };

  async function resetDBRacer(id) {
    const response = await fetch(`${API_BASE}/racer/${id}/reset`, { method: 'PATCH' });

    return await response.json();
  };

  async function deleteDBRacer(id) {
    return await fetch(`${API_BASE}/racer/${id}`, { method: 'DELETE' });
  }

  async function fetchAllCategories() {
    const response = await fetch(`${API_BASE}/category`);
    return response.json();
  };

  async function addDBCategory(data) {
    const response = await fetch(`${API_BASE}/category`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: data })
    });

    return await response.json();
  };

  async function updateDBCategory({ id, newCategory }) {
    const response = await fetch(`${API_BASE}/category/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: newCategory })
    });

    return await response.json();
  };

  function deleteDBCategory() {
    // TODO: delete and remove from racers
  };

  async function fetchAllDivisions() {
    const response = await fetch(`${API_BASE}/division`);
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
  const updateAllRecords = async ({ oldRecord, newRecord }) => {
    updateDisplayedRecords({ oldRecord, newRecord });
    await updateDBRacer({
        id: oldRecord.id,
        newRecord: diff(oldRecord, newRecord)
      });
  };

  // takes 2 records => updates a single, previously displayed record
  // with new time and/or placement on timer record display,
  // resets the old record and updates all record displays
  const updateDisplayedRecords = async ({ oldRecord, newRecord }) => {
    setDisplayRecords(prev => mergeUpdatedRecord(prev, newRecord));

    setTimerDisplayRecords(prev => {
      const index = prev.findIndex(record => record?.id === oldRecord?.id);
      if (index === -1) return [...prev, newRecord];
      const updated = [...prev];
      updated[index] = newRecord;
      return updated;
    });
  };

  const resetRacerRecord = async ({ racerToReset }) => {
    const updatedRacer = await resetDBRacer(racerToReset.id);
    setDisplayRecords(prev => mergeUpdatedRecord(prev, updatedRacer));
    setTimerDisplayRecords(prev =>
      prev.filter(record => record.id !== racerToReset.id)
    );
    return updatedRacer;
  };

  const swapRacers = async ({ prevData, newData, timeChanged, timeInMs }) => {
    const newRacer = await transferDataToNewRacer({
      racerToReset: prevData,
      racerToUpdate: newData,
      timeChanged,
      timeInMs
    });
    await updateDisplayedRecords({
      oldRecord: prevData,
      newRecord: newRacer
    });
    await resetRacerRecord({ racerToReset: prevData });
  };

  // updates single record in timer display (time or racer)
  // converts updated time into milliseconds
  // swaps and resets racer record if bib changed
  async function formatAndUpdateTimerDisplayRecord({ prevData, newData }) {
    const bibChanged = newData.bib && newData.bib !== prevData.bib;
    const timeInMs = typeof newData.time_raw === "string"
      ? convertToMs(newData.time_raw)
      : newData.time_raw;
    const timeChanged = timeInMs && timeInMs !== prevData.time_raw;

    if (bibChanged) {
      swapRacers({ prevData, newData, timeChanged, timeInMs });
      return;
    };

    if (timeChanged) {
      const racer = await updateDBRacer({
        id: prevData.id,
        newRecord: { place: prevData.place, time_raw: timeInMs }
      });
      await updateDisplayedRecords({
        oldRecord: prevData,
        newRecord: racer
      });
    };
  };

  // when swapping racers in timer display,
  // fetch and update new racer with prev racer's time and place
  // if no new racer is found, add placeholder with time, place, bib, and null for rest
  async function transferDataToNewRacer({
    racerToReset, racerToUpdate, timeChanged, timeInMs
  }) {
    const user = await fetchRacerRecord(racerToUpdate.bib);
    if (user) {
      const updatedRacer = await updateDBRacer({
        id: user.id,
        newRecord: {
          place: racerToReset.place,
          time_raw: timeChanged ? timeInMs : racerToReset.time_raw
        }
      });
      return updatedRacer;
    };

    const placeholderRacer = await addDBRacer({
      placeholder: true,
      place: racerToReset.place,
      bib: racerToUpdate.bib,
      time_raw: timeInMs
    });
    return placeholderRacer;
  }

  // deletes a racer record from the timer record display
  // resets the racer's time/place in the DB
  // updates place of all subsequent records
  const deleteDisplayedRecord = useCallback(async (recordToDelete) => {
    await resetDBRacer(recordToDelete.id);
    let updatedRecords;
    setTimerDisplayRecords((prevRecords) => {
      const filteredRecords = prevRecords.filter((record) =>
        record.id !== recordToDelete.id
      );
      updatedRecords = filteredRecords.map((record) =>
        record.place > recordToDelete.place
        ? { ...record, place: record.place - 1 }
        : record
      );
      return updatedRecords;
    });

    // for loop to allows async calls to DB, writes one change at a time
    for (const record of updatedRecords) {
      await updateDBRacer({ id: record.id, newRecord: { place: record.place }});
    };
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
    async ({ oldRecord: oldR, newRecord: newR }) => {
      const racer = await updateDBRacer({ id: oldR.id, newRecord: newR });
      setDisplayRecords(prev => mergeUpdatedRecord(prev, racer));
      setTimerDisplayRecords(prev => mergeUpdatedRecord(prev, racer));
    }
  );

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

    deleteDBRacer(racerToDelete.id);
  }, [deleteDisplayedRecord, timerDisplayRecords]);


  // -------------- CATEGORY LOGIC --------------
  const addCategory = useCallback(
    async (category) => {
      const newCat = await addDBCategory(category);
      setDisplayCategories(prev => [...prev, newCat ]);
  }, []);

  const editCategory = useCallback(
    async ({ newRecord, oldRecord }) => {
    const changed = diff(oldRecord, newRecord)
    const updatedCategory = await updateDBCategory({ id: oldRecord.id, newCategory: changed });
    setDisplayCategories(prev => mergeUpdatedRecord(prev, updatedCategory));
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
                              delete={deleteDisplayedRecord}
                              update={formatAndUpdateTimerDisplayRecord}
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
                              update={updateAllRecords}
                            />
                </div>
              )}
              {tab === "category" && <Tab
                                    tab={tab}
                                    headers={headers}
                                    fields={fields}
                                    fieldsObj={fieldsObject}
                                    records={memoCategories}
                                    divisions={memoDivisions}
                                    categories={memoCategories}
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
