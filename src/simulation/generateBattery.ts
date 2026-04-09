import type { Battery, mode } from "./batteryModel";

type FailureType = "badWeld" | "sensorDrift" | "thermalIssue" | "isolationFault";

export function generateBattery(): Battery {
    const mode = getWeightedMode();

    let battery: Battery = {
        mode,
        voltage: getRandom(350, 400), // V
        current: getCurrent(mode), // A
        charge: getRandom(20, 90), // %
        internalResistance: getRandom(10, 25), // milli ohms
        temperature: getRandom(25, 40), // C
        insulationResistance: getRandom(100, 500), // mega ohms
        power: 0, // computed below
    };

    battery.power = (battery.voltage * battery.current) / 1000; // Compute power from V * I

    // Determine failure (~10%)
    if (Math.random() < 0.1) {
        const failure = getRandomFailure();
        battery = injectFailure(battery, failure);
    }

    return battery;
}

function getWeightedMode(): mode {
    const r = Math.random();

    if (r < 0.5) return "discharge";
    else if (r < 0.8) return "charge";
    else return "idle";
}

function getCurrent(mode: mode): number {
    if (mode === "charge") return getRandom(-80, -20);
    if (mode === "discharge") return getRandom(20, 80);
    return getRandom(-5, 5);
}

function getRandomFailure(): FailureType {
    const failures: FailureType[] = ["badWeld", "sensorDrift", "thermalIssue", "isolationFault"];
    return failures[Math.floor(Math.random() * failures.length)];
}

function injectFailure(battery: Battery, type: FailureType): Battery {
    const b = { ...battery }; 

    switch (type) {
        case "badWeld":
            b.internalResistance = getRandom(40, 80);
        break;

        case "sensorDrift":
            b.voltage = b.voltage * getRandomFloat(0.85, 1.15);
        break;

        case "thermalIssue":
            b.temperature = getRandom(55, 75);
        break;

        case "isolationFault":
            b.insulationResistance = getRandomFloat(0.1, 5);
        break;
    }

    b.power = (b.voltage * b.current) / 1000;

    return b;
}

function getRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}