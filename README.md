# Manufacturing Battery Test Pipeline

*Designed by Andrew LaGreca,*
*For Manufacturing Test Engineer Candidacy*

## Overview
This project implements a simulated command-line-based validation system for battery units. It is meant to represent my first-pass at designing and deploying an automated manufacturing test system for battery backup system production.

The pipeline runs a sequence of tests, each designed to validate a specific subsystem or property of the battery, including:
  * Manufacturing integrity checks (e.g., insulation resistance, temperature)
  * Electrical performance validation
  * Functional behavior verification
  * Grid simulation response testing
  * System-level safety validation

The program executes each test in sequence. It returns a failure report if any tests fail. If all tests pass, the battery is considered valid.

## How to Use
Via browser:
  1) Open: https://basebatterytest.netlify.app/
  2) Press: `Run Test` (this action is repeatable)

Via terminal:
Prerequisites: Node.js and npm
  1) Install dependencies via command line: `npm install`
  2) Run the CLI via command line: `npm run CLI`
  3) Follow the prompts printed in the terminal

Via user interface:
Prerequisites: Node.js and npm
  1) Install dependencies via command line: `npm install`
  2) Run the program via command line: `npm run dev`
  3) Open the link in a browser
  4) Press: `Run Test` (this action is repeatable)

## Expected Behavior
The program executes all tests in the configured pipeline order. Each test receives the current battery state.

If a test fails, the failure reason and failed step are returned

If all tests pass, all test results are included in the output

## Improvements / Oversights / Faults
This project contains simplifications and non-physical representations of physical systems. These imperfections stem from intentional design tradeoffs; I aimed to design and deliver this simulation quickly.

Some improvement areas that could enhance the system include, but are not limited to:
  * There are many ways a production unit might fail. In this system, each unit is simulated, and only a limited set of failure root causes are modeled: badWeld, sensorDrift, thermalIssue, and isolationFault.
  * Simulated battery units are generally static representations of dynamic systems. While some dynamic behaviors are modeled, such as state transitions and grid responses, these representations are still highly simplified. A real battery would behave much more dynamically under test conditions.
  * The non-physical representation of this system does not support realistic modeling of key metrics such as reliability and cycle time. While I could have simulated these, I omitted them for simplicity. In real test systems, there is inherent uncertainty, maintenance requirements, and significantly longer cycle times.
  * In a real production environment, I would design some tests to run in parallel to improve throughput and reduce cycle time. This system does not include parallel test execution.
  * This system stops testing upon detection of a single fault within each sub-test. In scenarios where cells are reworked rather than scrapped, it would be preferable to run a full test suite capable of identifying multiple faults per sub-test. This system does not currently support that behavior.

## Project Structure
```
Battery-Test/
├── node_modules/
├── src/
│   ├── pipeline/
│   │   ├── finalize.ts
│   │   └── pipeline.ts
│   ├── simulation/
│   │   └── generateBattery.ts
│   ├── tests/
│   │   ├── electricalPerformance.test.ts
│   │   ├── electricalPerformance.ts
│   │   ├── functional.test.ts
│   │   ├── functional.ts
│   │   ├── gridSimulation.test.ts
│   │   ├── gridSimulation.ts
│   │   ├── manufacturingIntegrity.test.ts
│   │   ├── manufacturingIntegrity.ts
│   │   ├── systemSafety.test.ts
│   │   └── systemSafety.ts
│   ├── utils/
│   │   ├── fail.ts
│   │   ├── simulateTransition.ts
│   │   └── type.ts
│   ├── App.tsx
│   ├── main.ts
│   └── main.tsx
├── .gitignore
├── eslint.config.js
├── index.html
├── jest.config.cjs
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.cli.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

More generally:
  * Tests: contains individual test modules and their unit tests
  * Pipeline: contains orchestation logic that defines test order, executes tests, aggregates results, and handles system termination
  * Utils: contains shared utilities
  * Simulation: Generates battery instances used as input for tests