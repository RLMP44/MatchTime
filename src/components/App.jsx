import Header from "./Header";
import Footer from "./Footer";
import Timer from "./Timer";
import RecordDisplay from "./RecordDisplay";

function App() {
  var records = [
    {id: 1, place: 1, bib: 1, time: 34, name: "Gustave Pierre"},
    {id: 2, place: 2, bib: 2, time: 32, name: "Maelle Pierre"},
    {id: 3, place: 3, bib: 3, time: 35, name: "Sciel Jeanne"},
    {id: 4, place: null, bib: 4, time: null, name: "Lune Acuse"},
    {id: 5, place: null, bib: 5, time: null, name: "Verso L'vange"}
  ]

  async function fetchRecords() {
    // fetch records from backend
    // return as list
  }

  async function fetchUserRecord(bib) {
    const userRecord = records.find((record) => {
      return record.bib === bib;
    });
    return userRecord;
  }

  async function fetchLastRecord() {
    // retrieve time and placement of last record
  }

  function updateUserRecord(record) {
    // temporary until backend is established
    records = records.map((oldRecord) => {
      return (oldRecord.id === record.id) ? record : oldRecord
    })
    // IDs will already be assigned when entrants are added
    // add new time and placement
    // send to backend function and use SQL to update single record only
    // instead of updating entire array/db
  }

  // function deleteRecord()

  return (
    <div className="App">
      <Header />
      <div className="timer-tab">
        <RecordDisplay />
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
