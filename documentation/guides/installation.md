# Installation Guide

This guide provides detailed instructions for installing and setting up the Map Controls module in your project.

## Prerequisites

Before installing Map Controls, ensure your development environment meets the following requirements:

- **Node.js**: Version 14.0.0 or higher
- **npm**: Version 6.0.0 or higher (comes with Node.js)
- **TypeScript**: Version 4.0.0 or higher (for TypeScript projects)
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

## Installation Methods

### Using npm

The recommended way to install Map Controls is through npm:

```bash
npm install map-controls --save
```

This will add Map Controls to your project's dependencies in `package.json`.

### Using yarn

If you prefer yarn as your package manager:

```bash
yarn add map-controls
```

### Manual Installation

For projects that don't use a package manager, you can manually install Map Controls:

1. Download the latest release from the [GitHub repository](https://github.com/your-repo/map-controls/releases)
2. Extract the files to your project directory
3. Include the script in your HTML:

```html
<script src="path/to/map-controls/dist/index.js"></script>
```

## Project Setup

### TypeScript Projects

If you're using TypeScript, Map Controls comes with built-in type definitions. Add the following to your `tsconfig.json` to ensure proper type checking:

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "esnext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "lib": ["dom", "es2017"],
    "strict": true
  }
}
```

### JavaScript Projects

For JavaScript projects, you can import Map Controls using ES modules or CommonJS:

**ES Modules:**
```javascript
import { MapControls } from 'map-controls';
```

**CommonJS:**
```javascript
const { MapControls } = require('map-controls');
```

**Browser (UMD):**
```html
<script src="node_modules/map-controls/dist/index.js"></script>
<script>
  const mapControls = new MapControls.MapControls({
    // options
  });
</script>
```

## Webpack Configuration

If you're using Webpack, ensure your configuration properly handles TypeScript files:

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.ts',
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
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

## Verifying Installation

To verify that Map Controls is correctly installed, create a simple test file:

```typescript
// test.ts
import { MapControls } from 'map-controls';

console.log('MapControls imported successfully:', MapControls);
```

Or for browser environments, check the console:

```html
<script src="node_modules/map-controls/dist/index.js"></script>
<script>
  console.log('MapControls loaded:', typeof MapControls);
</script>
```

## Troubleshooting Installation Issues

### Common Issues

1. **Module not found error**:
   - Ensure the package is correctly installed in `node_modules`
   - Check your import path is correct
   - Verify your module resolution settings in tsconfig.json

2. **TypeScript errors**:
   - Make sure you're using a compatible TypeScript version
   - Check that your tsconfig.json includes the necessary lib files

3. **Browser loading issues**:
   - Ensure the path to the UMD bundle is correct
   - Check browser console for any loading errors
   - Verify that the script is loaded before you try to use it

### Resolving Dependency Conflicts

If you encounter dependency conflicts, try the following:

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install
```

## Next Steps

Now that you have successfully installed Map Controls, proceed to the [Getting Started Guide](getting-started.md) to learn how to use it in your project.

For more advanced setup options, see the [Advanced Configuration](advanced-usage.md) guide.
