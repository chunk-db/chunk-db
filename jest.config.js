function package(name, type = "packages") {
    return {
        displayName: name,
        preset: "ts-jest",
        testMatch: [
            `<rootDir>/${type}/${name}/src/**/*.test.ts`,
            `<rootDir>/${type}/${name}/__tests__/**/*.test.ts`
        ]
    };
}

module.exports = {
    projects: [
        package("core"),
        package("node", "example")
    ]
};
