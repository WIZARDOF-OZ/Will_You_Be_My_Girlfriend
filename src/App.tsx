import Envelope from "./components/Envelope";
import HeartScene from "./components/HeartScene";
import HeroSection from "./components/HeroSection";
function App() {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Three.js 3D heart background — fixed behind everything */}
      <HeartScene />

      {/* Hero section with animated title */}
      <HeroSection />
      <Envelope></Envelope>
    </div>
  );
}

export default App;
