import responseFormat from '../helper/responseFormat.js';

function setGuard(request, response, rules = { required: {}, optional: {} }) {
  const unknownKeys = checkMissingAttributes(request.body, rules);
  if (unknownKeys.length > 0) {
    responseFormat.sendResponseFormat(response, 400, `Unknown attribute detected`, null, [`These attributes are not allowed: ${unknownKeys.join(', ')}`]);
    return false;
  }

  const { missingKeys, wrongTypes: requiredWrongTypes } = requiredPropertiesGuard(request.body, rules.required);
  if (missingKeys.length > 0) {
    responseFormat.sendResponseFormat(
      response,
      400,
      `Missing required attributes`,
      null,
      missingKeys.map((key) => `\`${key}\` is required`),
    );
    return false;
  }

  const optionalWrongTypes = optionalPropertiesGuard(request.body, rules.optional);
  const allWrongTypes = [...requiredWrongTypes, ...optionalWrongTypes];
  if (allWrongTypes.length > 0) {
    responseFormat.sendResponseFormat(
      response,
      400,
      `Invalid data type`,
      null,
      allWrongTypes.map(({ key, type }) => `\`${key}\` must be of type ${type}`),
    );
    return false;
  }

  return true;
}

function checkMissingAttributes(body, rules = { required: {}, optional: {} }) {
  const unknownKeys = Object.keys(body).filter((key) => rules.required[key] === undefined && rules.optional[key] === undefined);

  if (unknownKeys.length > 0) {
    return unknownKeys; // kembalikan list key antek antek asing
  }
  return [];
}

function requiredPropertiesGuard(body, required) {
  let missingKeys = [];
  let wrongTypes = [];

  for (const [key, type] of Object.entries(required)) {
    if (body[key] === undefined) {
      missingKeys.push(key);
      continue;
    }
    if (!typeGuard(body[key], type)) {
      wrongTypes.push({ key, type });
    }
  }

  return { missingKeys, wrongTypes };
}

function optionalPropertiesGuard(body, optional) {
  let wrongTypes = [];

  for (const [key, type] of Object.entries(optional)) {
    if (body[key] === undefined) continue; // boleh tidak ada, skip
    if (!typeGuard(body[key], type)) {
      wrongTypes.push({ key, type });
    }
  }

  return wrongTypes;
}

function typeGuard(value, typeCheck) {
  return typeof value === typeCheck;
}

export default { setGuard };
