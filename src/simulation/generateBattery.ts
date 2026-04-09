import type { Battery, mode } from "../utils/types";

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

    hasSensorDrift: false,
    hasBadWeld: false,
    hasLeak: false,
  };

  // Compute power from V * I
  battery.power = (battery.voltage * battery.current);

  // Inject failure (~10%)
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

export function getCurrent(mode: mode): number {
  if (mode === "charge") return getRandom(80, 20);
  if (mode === "discharge") return getRandom(-20, -80);
  return getRandom(-5, 5);
}

function getRandomFailure(): FailureType {
  const failures: FailureType[] = [
    "badWeld",
    "sensorDrift",
    "thermalIssue",
    "isolationFault",
  ];
  return failures[Math.floor(Math.random() * failures.length)];
}

function injectFailure(battery: Battery, type: FailureType): Battery {
  const b = { ...battery };

  switch (type) {
    case "badWeld":
      b.internalResistance = getRandom(40, 80);
      break;

    case "sensorDrift":
      b.power *= 1.15;
      b.hasSensorDrift = true;
      break;

    case "thermalIssue":
      b.temperature = getRandom(55, 75);
      break;

    case "isolationFault":
      b.insulationResistance = getRandomFloat(0.1, 5);
      break;
  }

  return b;
}

function getRandom(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}