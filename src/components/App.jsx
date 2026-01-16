import Header from "./Header";
import Footer from "./Footer";
import Timer from "./Timer";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="timer-tab">
        <h1>Records display</h1>
        <Timer />
      </div>
      <Footer />
    </div>
  );
}

export default App;
