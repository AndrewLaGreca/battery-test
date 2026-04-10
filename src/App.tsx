import { useState } from "react";
import type { Battery, ResultReport } from "./utils/types";
import { generateBattery } from "./simulation/generateBattery";
import { runPipeline } from "./pipeline/pipeline";

export default function App() {
  const [battery, setBattery] = useState<Battery | null>(null);
  const [report, setReport] = useState<ResultReport | null>(null);

  async function handleRun() {
    console.log("handling run");

    const b = generateBattery();
    const result = await runTestPipeline(b);

    setBattery(b);
    setReport(result);

    console.log("report: ", result);
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Battery Test System</h1>

      <button onClick={handleRun}>Run Test</button>

      {battery && (
        <>
          <h2>Battery</h2>
          <pre>{JSON.stringify(battery, null, 2)}</pre>
        </>
      )}

      {report && (
        <>
          <h2>Result</h2>
          <p>
            Status: {report.passed ? "PASS" : "FAIL"}
          </p>
          
          <h3>Test Results</h3>
          <pre>{JSON.stringify(report.results, null, 2)}</pre>
        </>
      )}
    </div>
  );
}

async function runTestPipeline(b: Battery) {
    const pipeline = await runPipeline(b);
    console.log("pipeline: ", pipeline);
    return pipeline;
}