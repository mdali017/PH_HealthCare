
const pick = <T, k extends keyof T>(obj: T, keys: k[]) => {
    // console.log(obj, keys);
  
    const finalObj: Partial<T> = {};
  
    for (const key of keys) {
      if (obj && obj.hasOwnProperty.call(obj, key)) {
        // console.log({ obj });
  
        finalObj[key] = obj[key];
      }
    }
    console.log({ finalObj });
    return finalObj;
  };

  export default pick