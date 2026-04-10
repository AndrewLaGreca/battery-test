export type mode = "charge" | "discharge" | "idle";

export const idleMode: mode = "idle";
export const dischargeMode: mode = "discharge";
export const chargeMode: mode = "charge";

export interface Battery {
    mode: mode;
    voltage: number; // V
    current: number; // A
    power: number; // kW
    charge: number; // %
    internalResistance: number; // milli Ohms
    temperature: number; // C
    insulationResistance: number; // mega Ohms

    hasSensorDrift: boolean;
    hasBadWeld: boolean;
    hasLeak: boolean;
}

export type tests = "functional" | "electricalPerformance" | "gridSimulation" | "systemSafety" | "manufacturingIntegrity";

export interface ResultPackage {
    passed: boolean;
    step: tests;
    reason: string;
}

export interface ResultReport {
    state: mode;
    battery: Battery;
    results: ResultPackage[];
    passed: boolean;
}