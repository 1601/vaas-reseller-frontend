
# Frontend Development Environment - VAAS Reseller

This project is set up with Docker for a consistent development environment. It leverages React and extensive testing with Cypress.

## Getting Started

### Prerequisites
- Node.js version 16.x (recommended: v16.15.0)
- npm version 6 or higher

### Installation
1. Install dependencies by running:
   ```bash
   npm install
   ```
2. Start the project:
   ```bash
   npm run start
   ```
3. Build the project:
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in the /src of your project and specify:
- `REACT_APP_BACKEND_URL`: URL to the backend server

## Testing

- Run end-to-end tests:
  ```bash
  npm run test
  ```

## Accessing Store Subdomains for Local Testing

### Using localhost
- Directly access a store by appending its URL to `localhost:3000`. For example:
  ```plaintext
  goldencatch | localhost:3000/goldencatch
  ```
  No redirection is added for local testing.

### Using lvh.me
- Access a store using `lvh.me:3000`. For example:
  ```plaintext
  goldencatch | goldencatch.lvh.me:3000
  ```
  Stores will be redirected accordingly, e.g., `lvh.me:3000/goldencatch` will redirect to `goldencatch.lvh.me:3000`.

## Scripts

The project utilizes Husky for managing pre-commit hooks, and scripts are organized into multiple `package.json` files for modular development. See the root `package.json` for Docker-specific configurations and the `src/package.json` for application-specific scripts.

### Important Scripts in `src/package.json`
- `cy:open`: Opens the Cypress test runner.
- `cy:run`: Runs Cypress tests in headless mode.

## Contributors
Developed by SparkleStar International Corporation, this project is under the MIT license and aims to provide a robust platform for developing e-commerce solutions.