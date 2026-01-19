import Header from "./Header";
import Footer from "./Footer";
import Timer from "./Timer";
import RecordDisplay from "./RecordDisplay";
import { useState } from "react";

function App() {
  var records = [
    {id: 1, place: null, bib: 1, time: null, name: "Gustave Pierre"},
    {id: 2, place: null, bib: 2, time: null, name: "Maelle Pierre"},
    {id: 3, place: null, bib: 3, time: null, name: "Sciel Jeanne"},
    {id: 4, place: null, bib: 4, time: null, name: "Lune Acuse"},
    {id: 5, place: null, bib: 5, time: null, name: "Verso L'vange"}
  ]

  const [displayRecords, setDisplayRecords] = useState([]);

  async function fetchAllUsers() {
    // TODO: fetch user records from backend
    // return as list
    return records;
  }

  async function fetchUserRecord(bib) {
    const userRecord = records.find((record) => {
      return record.bib === bib;
    });
    return userRecord;
  }

  async function fetchLastRecord() {
    // TODO: retrieve time and placement of last record
  }

  function updateUserRecord(record) {
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

  // TODO: function deleteRecord()

  return (
    <div className="App">
      <Header />
      <div className="timer-tab">
        <div className="records-display-container">
          <RecordDisplay />
          {displayRecords.map(record => <RecordDisplay key={record.id} data={record} />)}
        </div>
        <Timer
          updateUserRecord={updateUserRecord}
          fetchRecord={fetchUserRecord}
          />
      </div>
      <Footer />
    </div>
  );
}

export default App;
