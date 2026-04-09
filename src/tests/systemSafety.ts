import { fail } from "../utils/fail";
import type { Battery, ResultPackage } from "../utils/types";

export function systemSafetyTest(b: Battery): ResultPackage {
    let resultPackage: ResultPackage = {
        passed: true,
        step: "systemSafety",
        reason: "pass",
    };

    // 1. test temperature
    if (b.temperature > 55)
    return resultPackage = fail(resultPackage, `measured temperature ${b.temperature} C exceeds the safe range of 55 C`);
    
    return resultPackage;
}