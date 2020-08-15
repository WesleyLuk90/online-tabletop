module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    rootDir: "test",
    moduleNameMapper: {
        "^engine/(.*)$": "<rootDir>/../../engine/src/$1",
    },
};
