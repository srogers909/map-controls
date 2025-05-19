# Setting Up the Project

This guide will walk you through the process of setting up the Map Controls project for development.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: Version 14.0.0 or higher
- **npm**: Version 6.0.0 or higher (comes with Node.js)
- **Git**: For version control

## Clone the Repository

First, clone the repository from GitHub:

```bash
git clone https://github.com/your-repo/map-controls.git
cd map-controls
```

## Install Dependencies

Install the project dependencies using npm:

```bash
npm install
```

This will install all the required dependencies listed in the `package.json` file, including:

- TypeScript
- Webpack
- ESLint
- Prettier
- Jest (for testing)

## Project Structure

The project is organized as follows:

```
map-controls/
├── dist/               # Compiled output (generated)
├── src/                # Source code
│   ├── controls/       # UI controls components
│   ├── core/           # Core functionality
│   ├── handlers/       # Event handlers
│   ├── renderers/      # Rendering implementations
│   ├── utils/          # Utility functions
│   └── index.ts        # Main entry point
├── example/            # Example implementation
├── tests/              # Test files
├── .gitignore          # Git ignore file
├── jest.config.js      # Jest configuration
├── package.json        # Project metadata and dependencies
├── tsconfig.json       # TypeScript configuration
└── webpack.config.js   # Webpack configuration
```

## Development Workflow

### Building the Project

To build the project for development:

```bash
npm run dev
```

This will start Webpack in watch mode, which will automatically rebuild the project when changes are detected.

To build the project for production:

```bash
npm run build
```

This will create optimized production files in the `dist` directory.

### Running the Example

To run the example application:

```bash
npm run example
```

This will start a local development server and open the example in your default browser.

### Running Tests

To run the tests:

```bash
npm test
```

To run tests with coverage:

```bash
npm test -- --coverage
```

### Linting and Formatting

To lint the code:

```bash
npm run lint
```

To automatically fix linting issues:

```bash
npm run lint -- --fix
```

To format the code using Prettier:

```bash
npm run format
```

## Configuration Files

### TypeScript Configuration

The `tsconfig.json` file contains the TypeScript compiler options:

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "esnext",
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "lib": ["dom", "es2017"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### Webpack Configuration

The `webpack.config.js` file configures the build process:

```javascript
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/index.ts',
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'MapControls',
      libraryTarget: 'umd',
      globalObject: 'this'
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'example', to: 'example' }
        ]
      })
    ]
  };
};
```

### Jest Configuration

The `jest.config.js` file configures the testing environment:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  moduleFileExtensions: ['ts', 'js', 'json']
};
```

## Development Best Practices

### Code Style

- Follow the TypeScript coding guidelines
- Use meaningful variable and function names
- Write JSDoc comments for all public methods and classes
- Keep functions small and focused on a single responsibility

### Git Workflow

1. Create a new branch for each feature or bug fix
2. Make small, focused commits with clear messages
3. Write tests for new features
4. Submit a pull request for review

### Testing

- Write unit tests for all new functionality
- Ensure all tests pass before submitting a pull request
- Aim for high test coverage

## Troubleshooting

### Common Issues

#### Module Not Found Error

If you encounter a "Module not found" error, check:

- That all dependencies are installed (`npm install`)
- That import paths are correct (case-sensitive)
- That the module exists in the specified location

#### TypeScript Compilation Errors

For TypeScript errors:

- Check the error message for details on the issue
- Ensure your TypeScript version is compatible with the project
- Verify that your `tsconfig.json` is correctly configured

#### Webpack Build Issues

If Webpack fails to build:

- Check the console for specific error messages
- Verify that your `webpack.config.js` is correctly configured
- Ensure all required loaders and plugins are installed

## Next Steps

Now that you have set up the project, you can:

- Explore the [API Reference](../api/index.md) to understand the available components
- Check out the [Getting Started Guide](getting-started.md) for usage instructions
- Look at the [Examples](../examples/index.md) for implementation ideas
- Read the [Contributing Guide](contributing.md) if you want to contribute to the project

## Getting Help

If you encounter any issues or have questions:

- Check the [Troubleshooting Guide](troubleshooting.md)
- Open an issue on GitHub
- Reach out to the project maintainers

```mermaid
graph TD
    A[Clone Repository] --> B[Install Dependencies]
    B --> C[Explore Project Structure]
    C --> D{Development Task}
    D --> E[Build Project]
    D --> F[Run Example]
    D --> G[Run Tests]
    D --> H[Lint & Format]
    E --> I[Make Changes]
    F --> I
    G --> I
    H --> I
    I --> J[Commit Changes]
    J --> K[Submit Pull Request]
