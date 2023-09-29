## Getting started

- Recommended `node js 16.x` and `npm 6+`. (suggestion v16.15.0)
- Install dependencies: `npm install` 
- Start the project: `npm run start` 
- Build  the project: `npm run build` 

## Environment Variables
- Create .env and provide - REACT_APP_BACKEND_URL

## Accessing Store Subdomains for Local Testing
- Grab a Store's URL
  ### Access store via localhost:3000
- Example: storeUrl: goldencatch | localhost:3000/goldencatch
- For localhost:3000, no redirection is added for testing
   ### Access store via lvh.me:3000
- Example: storeUrl: goldencatch | goldencatch.lvh.me:3000
- Stores will now be redirected as well: lvh.me:3000/goldencatch will always go to goldencatch.lvh.me:3000
