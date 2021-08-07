function package(name, type = 'packages') {
    return {
        displayName: name,
        preset: 'ts-jest',
        testMatch: [
            `<rootDir>/${type}/${name}/src/**/*.test.ts`,
            `<rootDir>/${type}/${name}/src/**/*.spec.ts`,
            `<rootDir>/${type}/${name}/__tests__/**/*.test.ts`,
            `<rootDir>/${type}/${name}/__tests__/**/*.spec.ts`,
        ],
    };
}

module.exports = {
    projects: [package('core'), package('node', 'example')],
};
