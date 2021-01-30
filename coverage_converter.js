function convertToBranchCoverage(conditions) {
  const coverage = new Map();
  // Determine branch coverage for a conditional, recursively
  const branchCoverage = (condition) => {
    let trueBranch = 0;
    let falseBranch = 0;
    // Check the counts for each side of the branch
    if (condition.values) {
      condition.values.forEach((valueCount) => {
        if (valueCount.value.boolValue === true) {
          trueBranch = valueCount.count;
        } else if (valueCount.value.boolValue === false) {
          falseBranch = valueCount.count;
        }
      });
    }
    // Update counts in the map
    const { line } = condition.sourcePosition;
    const conditionCoverage = coverage.has(line)
      ? coverage.get(line) : {
        branches: 0, hits: 0, count: 0,
      };
    if (trueBranch !== 0 || falseBranch !== 0) {
      conditionCoverage.branches += 2;
      conditionCoverage.hits += 1;
      conditionCoverage.count += trueBranch + falseBranch;
      if (trueBranch !== 0 && falseBranch !== 0) {
        conditionCoverage.hits += 1;
      }
    }
    coverage.set(line, conditionCoverage);
    if (condition.children) {
      condition.children.forEach((child) => {
        branchCoverage(child);
      });
    }
  };
  // Run over coverage for the entire report
  conditions.forEach((condition) => {
    branchCoverage(condition);
  });
  return coverage;
}

function convert(input, ruleFile) {
  const coverage = convertToBranchCoverage(input.report);
  const report = new Map();
  coverage.forEach((data, line) => {
    if (data.branches === data.hits) {
      report.set(line, data.count);
    } else {
      report.set(line, `${data.hits}/${data.branches}`);
    }
  });
  return {
    coverage: {
      [ruleFile]: Object.fromEntries(report),
    },
  };
}

exports.convert = convert;
