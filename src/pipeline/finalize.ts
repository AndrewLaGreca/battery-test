import { type Battery, type ResultPackage } from "../utils/types";

export function finalize(battery: Battery, results: ResultPackage[]) {
    const allPassed = results.every(r => r.passed);

    console.log("*** FINAL REPORT: ***");
    console.log("Battery:", battery);
    console.log("Results:", results);
    console.log("Overall Passed:", allPassed);

    const resultReport = {
        state: battery.mode,
        battery: battery,
        results: results,
        passed: allPassed,
    }

    return resultReport;
}