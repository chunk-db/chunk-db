function package(name) {
    return {
        displayName: name,
        preset: "ts-jest",
        testMatch: [
            `<rootDir>/packages/${name}/src/**/*.test.ts`,
            `<rootDir>/packages/${name}/__tests__/**/*.test.ts`
        ]
    };
}

module.exports = {
    projects: [
        package("core")
    ]
};
