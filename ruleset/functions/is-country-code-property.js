'use strict';

const assertCountryCodeWithDescription = (schema) => {
  if(!schema.match('country|land|lnd|ctry|cntry')){
    return;
  } 

  if(!schema.description || (schema.description && !schema.description.match('ISO-3166'))){
    throw "Description doesn't include ISO-3166 reference";
  }
};

const check = (schema) => {
  const combinedSchemas = [...(schema.anyOf || []), ...(schema.oneOf || []), ...(schema.allOf || [])];
  if (combinedSchemas.length > 0) {
    combinedSchemas.forEach(check);
  } else {
    assertCountryCodeWithDescription(schema);
  }
};

export default (targetValue, options, context) => {
  /*if(targetValue == "land"){
    console.log(targetValue);
    console.log(JSON.stringify(context.document.parserResult.data.components));

    let targetProp = context.document.parserResult.data;
    console.log(context.path);
    
    context.path.forEach((element) => {
      console.log(JSON.stringify(targetProp));
      console.log(element);
      targetProp = targetProp[element];
    });
    
    console.log(JSON.stringify(targetProp));
    console.log(JSON.stringify(context.path));
  }*/
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
