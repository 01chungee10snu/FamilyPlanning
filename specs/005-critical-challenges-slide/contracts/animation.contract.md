# Animation Contract: Critical Challenges Slide

## Entry Animations
```javascript
// Panel stagger entry
.panel-enter {
  animation: fadeInUp 0.5s ease-out;
  animation-fill-mode: both;
}

.panel-1 { animation-delay: 0.1s; }
.panel-2 { animation-delay: 0.3s; }
.panel-3 { animation-delay: 0.5s; }
```

## Chart Animations
```javascript
// Line chart draw
{
  animation: {
    duration: 1000,
    easing: 'easeOutQuart',
    delay: 600
  }
}

// Bar chart grow
{
  animation: {
    duration: 800,
    easing: 'easeOutCubic',
    delay: 800
  }
}
```

## Number Animations
```javascript
// Count up effect
function animateValue(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = formatNumber(current);
  }, 16);
}
```

## Transition Timing
- **Slide enter**: 0.3s fade
- **Panel reveal**: 0.5s each (staggered)
- **Chart draw**: 1.0s
- **Number count**: 1.2s
- **Total sequence**: ~2.0s

## Easing Functions
- **Panel entry**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Charts**: `easeOutQuart`
- **Numbers**: Linear
- **Exit**: `ease-in`

---