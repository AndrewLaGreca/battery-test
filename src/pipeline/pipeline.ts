import { generateBattery } from "../simulation/generateBattery";
import { functionalTest } from "../tests/functional";
import { electricalPerformanceTest } from "../tests/electricalPerformance";
import { gridSimulationTest } from "../tests/gridSimulation";
import { systemSafetyTest } from "../tests/systemSafety";
import { manufacturingIntegrityTest } from "../tests/manufacturingIntegrity";
import type { ResultPackage } from "../utils/types";
import { finalize } from "./finalize";

export async function runPipeline() {
    const battery = generateBattery();

    const results: ResultPackage[] = [];

    // Run tests sequentially
    const functional = functionalTest(battery);
    results.push(functional);
    if (!functional.passed) return finalize(battery, results);

    const electrical = electricalPerformanceTest(battery);
    results.push(electrical);
    if (!electrical.passed) return finalize(battery, results);

    const grid = gridSimulationTest(battery);
    results.push(grid);
    if (!grid.passed) return finalize(battery, results);

    const safety = systemSafetyTest(battery);
    results.push(safety);
    if (!safety.passed) return finalize(battery, results);

    const manufacturing = manufacturingIntegrityTest(battery);
    results.push(manufacturing);
    if (!manufacturing.passed) return finalize(battery, results);

    return finalize(battery, results);
}