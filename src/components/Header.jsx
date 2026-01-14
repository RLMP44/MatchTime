import logo from "../assets/logo.jpg";

function Header() {
  return (
    <header>
      <img src={logo} alt="Match Time logo" />
      <h1>Match Time</h1>
    </header>
  );
}

export default Header;
