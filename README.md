# Overview

This project is an end-to-end test automation framework for the OrangeHRM application, developed using Playwright with TypeScript.
It covers essential test scenarios like login, user management, and admin workflows.

# Project Setup
## Prerequisites

Node.js (v16 or later)

npm (comes with Node.js)

## Installation Steps

Clone the repository:

git clone https://github.com/your-username/orangehrm-automation.git
cd orangehrm-automation


#Install dependencies:
 ```bash
npm install
```
🚀 Running Test Cases

Run all test cases:
 ```bash
npx playwright test
```

Run in headed mode (see browser actions):
 ```bash
npx playwright test --headed
```

Run a specific test file:
 ```bash
npx playwright test tests/addUser.spec.ts
```

Generate and view the HTML report:
 ```bash
npx playwright show-report
```
# Playwright Version
This project uses:
 ```bash
"@playwright/test": "^1.47.2"
```
This project uses:

"@playwright/test": "^1.47.2"
