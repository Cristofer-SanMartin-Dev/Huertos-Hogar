import './App.css';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage'; // 1. Importamos la página

function App() {
  return (
    <>
      <Navbar />
      <HomePage /> {/* 2. Usamos la página */}
    </>
  );
}

export default App;