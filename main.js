const core = require('@actions/core');
const axios = require('axios');
const fs = require('fs');

const fsPromises = fs.promises;

const coverageConverter = require('./coverage_converter');

async function run() {
  try {
    const projectId = core.getInput('project_id');
    const ruleFile = core.getInput('rule_file');
    const inputFile = core.getInput('input_file');
    const outputFile = core.getInput('output_file');
    let coverageData;
    if (inputFile) {
      coverageData = JSON.parse(await fsPromises.readFile(inputFile));
    } else {
      const emulatorBase = 'http://localhost:8080';
      const requestURL = `${emulatorBase}/emulator/v1/projects/${projectId}:ruleCoverage`;
      const resp = await axios.get(requestURL);
      coverageData = resp.data;
    }
    const converted = coverageConverter.convert(coverageData, ruleFile);
    await fsPromises.writeFile(outputFile, JSON.stringify(converted));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
