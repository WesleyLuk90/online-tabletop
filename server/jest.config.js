module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    rootDir: "test",
    transformIgnorePatterns: [
        "node_modules/(?!(protocol)/)"
    ]
};
