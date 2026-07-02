"use strict";

const { syncRulesToRepository } = require("@foundry-api/rules");

syncRulesToRepository({
  targetRepositoryPath: process.cwd(),
  generatedAtUtc: new Date().toISOString(),
})
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
