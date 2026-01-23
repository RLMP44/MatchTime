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
    {id: 5, place: null, bib: 5, time: null, name: "Verso L'vange"},
    {id: 6, place: null, bib: 54, time: null, name: "Monoco"}
  ]

  const [displayRecords, setDisplayRecords] = useState([]);

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

  function resetDBRecord(record) {
    // TODO: set DB record time and place back to null
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
  }

  return (
    <div className="App">
      <Header />
      <div className="timer-tab">
        <div className="records-display-container">
          <RecordDisplay />
          {displayRecords.map(record =>
            <RecordDisplay
              key={record.id}
              data={record}
              editRecords={editUserRecords}
              fetchRecord={fetchUserRecord}
              deleteRecord={deleteRecord}
            />)}
        </div>
        <Timer
          updateUserRecord={updateUserRecord}
          fetchRecord={fetchUserRecord}
          displayRecords={displayRecords}
          />
      </div>
      <Footer />
    </div>
  );
}

export default App;
