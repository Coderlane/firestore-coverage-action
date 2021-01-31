const coverageConverter = require('./coverage_converter');

const RULE_FILE_NAME = 'firestore.rules';

const SOURCE_POSITION = {
  line: 6,
  column: 24,
  currentOffset: 162,
  endOffset: 193,
};

const VALUE_BOOL_TRUE = {
  value: {
    boolValue: true,
  },
  count: 1,
};

const VALUE_BOOL_FALSE = {
  value: {
    boolValue: false,
  },
  count: 1,
};

function createReport(values) {
  return {
    report: [{
      sourcePosition: SOURCE_POSITION,
      values,
    },
    ],
  };
}

describe('Converter Tests', () => {
  test('converter parses no values', () => {
    const report = createReport(undefined);
    const output = coverageConverter.convert(report, RULE_FILE_NAME);
    expect(JSON.stringify(output)).toEqual(
      '{"coverage":{"firestore.rules":{"6":0}}}');
  });

  test('converter parses true bool', () => {
    const report = createReport([VALUE_BOOL_TRUE]);
    const output = coverageConverter.convert(report, RULE_FILE_NAME);
    expect(JSON.stringify(output)).toEqual(
      '{"coverage":{"firestore.rules":{"6":"1/2"}}}');
  });

  test('converter parses false bool', () => {
    const report = createReport([VALUE_BOOL_FALSE]);
    const output = coverageConverter.convert(report, RULE_FILE_NAME);
    expect(JSON.stringify(output)).toEqual(
      '{"coverage":{"firestore.rules":{"6":"1/2"}}}');
  });

  test('converter parses true and false bool', () => {
    const report = createReport([VALUE_BOOL_TRUE, VALUE_BOOL_FALSE]);
    const output = coverageConverter.convert(report, RULE_FILE_NAME);
    expect(JSON.stringify(output)).toEqual(
      '{"coverage":{"firestore.rules":{"6":2}}}');
  });
});
