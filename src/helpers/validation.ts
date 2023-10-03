export const isArray = (value: any) => {
  return value && typeof value === "object" && Array.isArray(value);
};
export const isObject = (value: any) => {
  return value && typeof value === "object" && !Array.isArray(value);
};

export const isArrayOfString = (value: any) => {
  if (!isArray(value)) {
    return false;
  }
  for (let i = 0; i < value.length; i++) {
    const v = value[i];
    if (typeof v != "string") {
      return false;
    }
  }
  return true;
};

export const isUndefined = (value: any) => typeof value === "undefined";

export const isNumber = (val: any) => /^(\d+)$/.test(val);
export const isString = (value: any) => typeof value == "string";

export const isDateFormat = (date: any) => /^\d{4}-\d{2}-\d{2}$/.test(date);
