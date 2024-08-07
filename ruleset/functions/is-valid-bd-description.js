'use strict';

const assertValidBankdataDescription = (schema) => {
  if(!schema.match("(# Summary)(.*\n)+(# About .*)(.*\n)+(# Service Level Objectives \\\(Global values\\\))(.*\n)+(# Authentication)(.*\n)+(# Authorization)(.*\n)+")){
    throw "Description should include Summary, About, Service Level Objectives (Global values), Authentication, Authorization in that order";
  }
};


const check = (schema) => {
  const combinedSchemas = [...(schema.anyOf || []), ...(schema.oneOf || []), ...(schema.allOf || [])];
  if (combinedSchemas.length > 0) {
    combinedSchemas.forEach(check);
  } else {
    assertValidBankdataDescription(schema);
  }
};

export default (targetValue, options, context) => {
  try {
    check(targetValue);
  } catch (ex) {
    return [
      {
        message: ex,
      },
    ];
  }
};
