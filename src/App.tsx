import { BrowserRouter, Routes, Route } from "react-router-dom";
import Envelope from "./components/Envelope";
import HeartScene from "./components/HeartScene";
import HeroSection from "./components/HeroSection";
import MusicPlayer from "./components/MusicPlayer";

// Home Page
function HomePage() {
  return (
    <>
      <HeartScene />
      <HeroSection />
      <Envelope />
    </>
  );
}
function App() {
  return (
    <BrowserRouter>
      {/* Music Player outside routes - stays on all pages*/}
      <MusicPlayer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* More pages to be added here soon */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
