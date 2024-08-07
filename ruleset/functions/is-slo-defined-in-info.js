'use strict';

const assertIsSloDefinedInInfoAndIsRequired = (schema) => {
    if(!schema.hasOwnProperty("x-dk-bankdata-slo")){
      throw "Info should have x-dk-bankdata-slo defined";
    }

    console.log("1");

    var slo = schema['x-dk-bankdata-slo'];
    var isResponseTimeMsDefined = slo.hasOwnProperty("response-time-ms");
    var isResponseTimeDefined = slo.hasOwnProperty("response-time");
    if(!isResponseTimeMsDefined && !isResponseTimeDefined){
      throw "x-dk-bankdata-slo should have either response-time-ms or response-time defined";
    }
    console.log("2");
    
    if(isResponseTimeMsDefined){
      if(!(typeof slo['response-time-ms'] === 'number')) {
        throw "the value of response-time-ms should be a number";
      }
    }
    console.log("3");

    if(isResponseTimeDefined) {
      var isResponseTimeAnArray = Array.isArray(slo['response-time']);
      if(!isResponseTimeAnArray){
        throw "response-time should be an array";
      }
      console.log("4");

      if( slo['response-time'].length == 0) {
        throw "response-time should have at least one element";
      }
      console.log("5");

      slo['response-time'].forEach(element => {
        if(!(element.hasOwnProperty('response-ms') && element.hasOwnProperty('percentile'))){
          throw "Each definition in response-time should have response-ms and percentile defined";
        }
      });
  }
};

const check = (schema) => {
  const combinedSchemas = [...(schema.anyOf || []), ...(schema.oneOf || []), ...(schema.allOf || [])];
  if (combinedSchemas.length > 0) {
    console.log("checking more than one schema");
    combinedSchemas.forEach(check);
  } else {
    console.log("checking this schema");
    assertIsSloDefinedInInfoAndIsRequired(schema);
  }
};

export default (targetValue, options, context) => {
  console.log("default 1");
  const actualAudiences = context.documentInventory.resolved.info["x-audience"];

  console.log(actualAudiences);

  if(!actualAudiences) {
    console.warn("WARN: Skipping SLO check due to missing audience!");
    return;
  }

  const requiredAudiences = options.audiences;
  let isEligible = false;

  requiredAudiences.forEach(audience => {
    if(actualAudiences.constructor === Array){
      if(actualAudiences.includes(audience)){
        isEligible = true;
      }
    } else {
      if(actualAudiences === audience){
        isEligible = true;
      }
    }
  });



  if(!isEligible){
    console.log("Audience is not eligible")
    return;
  }

  try {
    check(targetValue);
  } catch (ex) {
    console.log(ex);
    return [
      {
        message: ex,
      },
    ];
  }
};
