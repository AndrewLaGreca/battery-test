export type mode = "charge" | "discharge" | "idle";

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
}

export type tests = "functional" | "electricalPerformance" | "gridSimulation" | "systemSafety" | "manufacturingIntegrity";

export interface ResultPackage {
    passed: boolean;
    step: tests;
    reason: string;
}