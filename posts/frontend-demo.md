---
title: "Modern CSS Layouts: Flexbox and Grid"
date: "2025-08-27"
author: "Demo Author"
category: "Frontend"
image: "https://1000logos.net/wp-content/uploads/2020/09/CSS-Logo-2011.png"
---

# Modern CSS Layouts: Flexbox and Grid

Building responsive and maintainable layouts is a cornerstone of modern frontend development. Two CSS modules — **Flexbox** and **Grid** — have revolutionized how we approach layout design.

## Flexbox: One-Dimensional Layout

Flexbox is designed for **one-dimensional layouts**, either in a row or a column. It allows developers to:

- Align items easily along a single axis.
- Distribute space evenly between elements.
- Create responsive components without floats or positioning hacks.

### Example: Centering a Card

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.card {
  width: 200px;
  height: 150px;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
}
