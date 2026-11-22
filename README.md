<p align="center"><img src="assets/hero.svg" alt="d04-request-validator animated SVG banner" width="100%"></p>

# d04-request-validator

A small schema-based request validator with field rules and middleware integration.

## Features
- Node.js 20+ ES modules
- Deterministic result objects for automation and dashboards
- Configurable behavior with conservative defaults
- No runtime dependencies

## Install
```bash
npm install
```

## Quick start
```js
import { validate, createValidator } from "d04-request-validator";
const result = validate({ email: "dev@example.com", age: 24 }, { email: { type: "string", required: true, pattern: "^[^@]+@[^@]+\\.[^@]+$" }, age: { type: "number", min: 18 } });\nif (!result.valid) console.error(result.errors);
```

## Development
```bash
npm test
```

## License
MIT
