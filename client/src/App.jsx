import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PersonShowPage from "./pages/PersonShowPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/people/:id" element={<PersonShowPage />} />
      </Routes>
    </Router>
  );
}
