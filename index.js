#!/usr/bin/env node

require('./src/cli')
  .run(process.argv.slice(2))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
