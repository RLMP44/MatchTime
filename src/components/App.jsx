import Header from "./Header";
import Footer from "./Footer";
import TimerTab from "./TimerTab";
import RacersTab from "./RacersTab";
import CategoriesTab from "./CategoriesTab";
import ResultsTab from "./ResultsTab";
import { useState } from "react";
import TimerIcon from '@mui/icons-material/Timer';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';

function App() {
  var records = [
    {id: 1, place: null, bib: 1, time: null, name: "Gustave Pierre", division: "M30-39"},
    {id: 2, place: null, bib: 2, time: null, name: "Maelle Pierre", division: "F10-19"},
    {id: 3, place: null, bib: 3, time: null, name: "Sciel Jeanne", division: "F30-39"},
    {id: 4, place: null, bib: 4, time: null, name: "Lune Acuse", division: "F30-39"},
    {id: 5, place: null, bib: 5, time: null, name: "Verso L'vange", division: "M40-49"},
    {id: 6, place: null, bib: 54, time: null, name: "Monoco", division: "M50-59"}
  ]

  const [displayRecords, setDisplayRecords] = useState([]);
  const [tab, setTab] = useState("timer");
  const [place, setPlace] = useState(1);

  // async function fetchAllUsers() {
  //   // TODO: fetch user records from backend
  //   // return as list
  //   return records;
  // }

  async function fetchUserRecord(bib) {
    const userRecord = records.find((record) => {
      return record.bib === bib;
    });
    return userRecord;
  }

  // async function fetchLastDBRecord() {
    // TODO: retrieve time and placement of last record in DB
  // }

  async function updateDBRecord(record) {
    // TODO: update user record in DB
  }

  function resetDBRecord(record) {
    // TODO: set DB record time and place back to null
  }

  function updateUserRecord(record) {
    updateDBRecord(record);
    // IDs will already be assigned when entrants are added
    // TODO: add new time and placement
    // TODO: send to backend function and use SQL to update single record only
    // instead of updating entire array/db
    // temporary until backend is established
    records = records.map((oldRecord) => {
      return (oldRecord.id === record.id) ? record : oldRecord
    })
    setDisplayRecords((prevRecords) => {
      return [...prevRecords, record];
    });
  }

  // takes 2 records => resets old record and updates new record
  function editUserRecords({ oldRecord: oldR, newRecord: newR }) {
    resetDBRecord(oldR);
    setDisplayRecords((prevRecords) =>
      prevRecords.map((record) => {
        return record.id === oldR.id ? newR : record
      })
    );
  };

  function deleteRecord(recordToDelete) {
    resetDBRecord(recordToDelete);
    setDisplayRecords((prevRecords) => {
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
  }

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
                              displayRecords={displayRecords}
                              editRecords={editUserRecords}
                              fetchRecord={fetchUserRecord}
                              deleteRecord={deleteRecord}
                              updateUserRecord={updateUserRecord}
                            />
        }
        {tab === "categories" && <CategoriesTab />}
        {tab === "racers" && <RacersTab
                              records={records}
                              fetchRecord={fetchUserRecord}
                              deleteRecord={deleteRecord}
                              updateRecord={updateUserRecord}
                            />
        }
        {tab === "results" && <ResultsTab displayRecords={displayRecords} />}
      </div>
      <Footer />
    </div>
  );
}

export default App;
