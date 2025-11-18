# Focus Bubble - File Structure

## Complete File Tree

```
focus-bubble/
│
├── App.js                          # Main entry point with navigation setup
├── app.json                        # Expo configuration
├── package.json                    # Dependencies and scripts
├── babel.config.js                 # Babel configuration
├── .gitignore                      # Git ignore rules
├── README.md                       # Documentation
│
└── src/
    ├── context/
    │   └── AppContext.js          # Global state (sessions, settings, AsyncStorage)
    │
    ├── screens/
    │   ├── HomeScreen.js          # Timer screen with START/STOP
    │   ├── HistoryScreen.js       # Session history list
    │   └── SettingsScreen.js      # Settings with modals
    │
    └── styles/
        └── theme.js               # Shared colors and styles
```

## Screen Descriptions

### 1. HomeScreen (Timer)
- Large countdown timer display (MM:SS format)
- Thin white progress bar (1px)
- START/STOP button
- Background timer support
- Auto-saves on completion
- Keeps screen awake during session

### 2. HistoryScreen
- Vertical list of completed sessions
- Format: "20 min • Today 14:32"
- Smart date display (Today/Yesterday/Date)
- Empty state message
- Scrollable with no indicators

### 3. SettingsScreen
- Three settings options:
  1. Default focus duration (1-180 min)
  2. Daily focus goal (1-1440 min)
  3. Reset history
- Simple modals for input
- Text-only interface

## Key Features Implemented

✓ Pure black (#000000) and white (#FFFFFF) design
✓ No icons, images, borders, shadows, or colors
✓ Large typography with generous spacing
✓ Three-screen bottom tab navigation
✓ Background timer with timestamp tracking
✓ AsyncStorage persistence
✓ React Context API for state
✓ Screen awake during focus sessions
✓ Clean, production-ready code

## Design Principles Followed

- Minimalism: Only essential elements
- Typography: Large, clean fonts with letter-spacing
- Whitespace: Generous padding and margins
- No visual noise: Text-only buttons, no decorations
- Calm experience: No animations or transitions

