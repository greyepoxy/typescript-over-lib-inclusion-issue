import { shallow } from "enzyme";
// just console log the import to show it being "used"
console.log(shallow);

// should not be able to create a big int with the current tsconfig lib settings set to es5
// if you comment out the above import, this becomes an error like its supposed to be
const bigInt = BigInt(9007199254740991);
