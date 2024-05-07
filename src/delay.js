// delay.js
const time = process.argv[2] || 10000;  // Default to 10 seconds if no argument is provided
setTimeout(() => {
  process.exit(0);
}, parseInt(time, 10));
