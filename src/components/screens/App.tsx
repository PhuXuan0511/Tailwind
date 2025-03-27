import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./Index";
import ManageBook from "./ManageBook";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/manage-book" element={<ManageBook />} />
      </Routes>
    </Router>
  );
}

export default App;
