import type { ResultPackage } from "./types";

export function fail(r: ResultPackage, reason: string): ResultPackage {
    return {
        ...r,
        passed: false,
        reason,
    };
}