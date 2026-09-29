import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Simulator from './Simulator';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/simulator" element={<Simulator />} />
      </Routes>
    </BrowserRouter>
  );
}
