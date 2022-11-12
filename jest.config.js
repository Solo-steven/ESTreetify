/** @type {import('jest').Config} */
const config = {
    rootDir: ".",
    testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"], // Emit helper.ts in __tests__ folder.
    moduleNameMapper: {
        "@/src/(.*)": ["<rootDir>/src/$1"]
    },

};

module.exports = config;



