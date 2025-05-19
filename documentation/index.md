# Map Controls Documentation

Welcome to the official documentation for the Map Controls module, a framework-agnostic TypeScript library for map panning and zooming.

<div class="hero">
  <img src="assets/map-controls-logo.png" alt="Map Controls Logo" class="logo" />
  <p class="tagline">A powerful, lightweight solution for interactive maps</p>
</div>

## Overview

Map Controls is a TypeScript module that provides pan and zoom functionality for custom maps. It's designed to be framework-agnostic, making it compatible with any JavaScript project. Whether you're building a web application with React, Angular, Vue, or vanilla JavaScript, Map Controls can be easily integrated to provide interactive map features.

## Key Features

- **Framework Agnostic**: Works with any JavaScript framework or vanilla JS
- **TypeScript Support**: Full TypeScript definitions for enhanced development experience
- **Pan & Zoom**: Smooth panning and zooming functionality for custom maps
- **Boundary Constraints**: Configurable boundaries to control pan and zoom limits
- **Mouse & Touch Support**: Works with both mouse and touch interactions
- **Control Buttons**: Optional UI controls for zoom and pan operations
- **Event System**: Comprehensive event system for tracking user interactions
- **Extendable Architecture**: Designed to be extended for custom requirements

## Quick Navigation

<div class="nav-grid">
  <a href="guides/getting-started.md" class="nav-item">
    <h3>🚀 Getting Started</h3>
    <p>Quick start guide to integrate Map Controls into your project</p>
  </a>
  <a href="guides/installation.md" class="nav-item">
    <h3>📦 Installation</h3>
    <p>Step-by-step installation instructions</p>
  </a>
  <a href="api/index.md" class="nav-item">
    <h3>📚 API Reference</h3>
    <p>Detailed API documentation for all components</p>
  </a>
  <a href="examples/index.md" class="nav-item">
    <h3>💡 Examples</h3>
    <p>Code examples and usage scenarios</p>
  </a>
  <a href="guides/advanced-usage.md" class="nav-item">
    <h3>🔧 Advanced Usage</h3>
    <p>Advanced techniques and customization options</p>
  </a>
  <a href="guides/contributing.md" class="nav-item">
    <h3>👥 Contributing</h3>
    <p>Guidelines for contributing to the project</p>
  </a>
</div>

## Architecture Overview

The Map Controls module is built with a modular architecture that separates concerns into distinct components:

```mermaid
graph TD
    A[MapControls] --> B[EventManager]
    A --> C[CanvasRenderer]
    A --> D[MouseHandler]
    A --> E[TouchHandler]
    A --> F[ControlsManager]
    F --> G[ZoomControls]
    F --> H[PanControls]
    A --> I[Utils]
    I --> J[Math Utils]
    I --> K[DOM Utils]
    
    classDef core fill:#f9f,stroke:#333,stroke-width:2px
    classDef handlers fill:#bbf,stroke:#333,stroke-width:1px
    classDef controls fill:#bfb,stroke:#333,stroke-width:1px
    classDef utils fill:#fbb,stroke:#333,stroke-width:1px
    
    class A core
    class B,C core
    class D,E handlers
    class F,G,H controls
    class I,J,K utils
```

## Getting Help

If you encounter any issues or have questions about using Map Controls, please check the [Troubleshooting](guides/troubleshooting.md) guide or [open an issue](https://github.com/your-repo/map-controls/issues) on GitHub.

<div class="footer">
  <p>Map Controls is licensed under the MIT License.</p>
</div>
