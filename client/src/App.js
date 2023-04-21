import './App.css';
import NavBar from './components/NavBar/NavBar';
import { Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp/SignUp';
import SignIn from './components/SignIn/SignIn';
import Footer from './components/Footer/Footer';
import HomePage from './components/HomePage/HomePage';

function App() {
  return (
    <div className="App">
        <NavBar />
        <div className="content">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/signin" element={<SignIn />} />
            <Route exact path="/signup" element={<SignUp />} />
          </Routes>
        </div>
        {/* <HomePage /> */}
        <Footer />
    </div>
  );
}

export default App;