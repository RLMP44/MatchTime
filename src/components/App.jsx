import Header from "./Header";
import Footer from "./Footer";
import Timer from "./Timer";
import RecordDisplay from "./RecordDisplay";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="timer-tab">
        <RecordDisplay />
        <Timer />
      </div>
      <Footer />
    </div>
  );
}

export default App;
