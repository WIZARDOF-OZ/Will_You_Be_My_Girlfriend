import HeartScene from "./components/HeartScene";

function App() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <HeartScene />
      <h1
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          paddingTop: "40vh",
          fontSize: "3rem",
          color: "#fff5f0",
        }}
      >
        Hi! My love for you is as infinite as the hearts floating around.💖
      </h1>
    </div>
  );
}

export default App;
