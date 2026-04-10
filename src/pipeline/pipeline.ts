import { functionalTest } from "../tests/functional";
import { electricalPerformanceTest } from "../tests/electricalPerformance";
import { gridSimulationTest } from "../tests/gridSimulation";
import { systemSafetyTest } from "../tests/systemSafety";
import { manufacturingIntegrityTest } from "../tests/manufacturingIntegrity";
import type { Battery, ResultPackage } from "../utils/types";
import { finalize } from "./finalize";

export function runPipeline(battery: Battery) {
    const results: ResultPackage[] = [];

    const tests = [
        functionalTest,
        electricalPerformanceTest,
        gridSimulationTest,
        systemSafetyTest,
        manufacturingIntegrityTest,
    ];

    for (const test of tests) {
        const result = test(battery);
        results.push(result);
    }

    return finalize(battery, results);
}