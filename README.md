# 📦 Modalitor.js

A modern, accessible modal system with focus management, URL hash support, and rich animations.

## ✨ Features

- 🎨 Rich animations with multiple presets
- ♿️ Full accessibility support with ARIA attributes and keyboard navigation
- 🔗 URL hash state management
- 📱 Responsive design with mobile-optimized animations
- 🎯 Focus trap and management
- 🖼️ Multiple size options
- 🔒 Scroll lock management
- 🎮 Comprehensive API

## 📥 Installation

```bash
npm install modalitor
# or
yarn add modalitor
```

Include the files directly:
```html
<link rel="stylesheet" href="modalitor.css">
<script src="modalitor.js"></script>
```

## 🚀 Quick Start

```html
<!-- Modal trigger -->
<button data-modal-target="my-modal">Open Modal</button>

<!-- Modal template -->
<div id="my-modal" class="modalitor">
    <div class="modalitor-header">
        <h2 class="modalitor-title">Modal Title</h2>
        <button class="modalitor-close"></button>
    </div>
    <div class="modalitor-content">
        Modal content goes here
    </div>
    <div class="modalitor-footer">
        <button class="modalitor-close">Close</button>
    </div>
</div>
```

```javascript
// JavaScript initialization
const modal = new Modalitor({
    id: 'my-modal',
    animation: 'zoom',
    size: 'md'
});

// Show programmatically
modal.show();
```

## ⚙️ Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | string | - | Modal element ID (required) |
| `size` | string | 'md' | Modal size ('sm', 'md', 'lg', 'xl', 'full') |
| `animation` | string | 'default' | Animation type |
| `closeOnOverlay` | boolean | true | Close when clicking overlay |
| `closeOnEscape` | boolean | true | Close on Escape key |
| `preventScroll` | boolean | true | Prevent body scroll when open |
| `role` | string | 'dialog' | ARIA role attribute |
| `labelledBy` | string | null | ID of labelling element |
| `describedBy` | string | null | ID of describing element |
| `updateUrl` | boolean | true | Update URL hash on open/close |
| `hashPrefix` | string | 'modal-' | Prefix for URL hash |

## 🎭 Available Animations

| Animation | Description |
|-----------|-------------|
| `default` | Simple fade animation |
| `zoom` | Scale in/out effect |
| `slide-up` | Slides up from bottom |
| `slide-down` | Slides down from top |
| `flip` | 3D flip animation |
| `rotate` | Rotating entrance/exit |
| `door` | Door opening effect |
| `unfold` | Unfolding paper effect |
| `roadrunner` | Fast horizontal slide |

## 📱 Mobile Support

Modalitor automatically switches to optimized animations on mobile devices for better performance. The default mobile animation is a simple slide-up regardless of the specified animation type.

## 🎯 Methods

```javascript
const modal = new Modalitor({ id: 'my-modal' });

modal.show();      // Show the modal
modal.hide();      // Hide the modal
modal.destroy();   // Remove the modal instance

// Check if modal is visible
if (modal.isVisible()) {
    // Do something
}
```

## 🔄 Events

```javascript
new Modalitor({
    id: 'my-modal',
    onShow: () => console.log('Modal shown'),
    onHide: () => console.log('Modal hidden')
});
```

## 📝 License

[MIT License](https://opensource.org/licenses/MIT)

Copyright (c) 2024 HamidReza Yazdani

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
