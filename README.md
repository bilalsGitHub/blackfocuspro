# Black Focus Pro

A premium focus timer app with swipe-adjustable durations and advanced statistics.

## Design Philosophy

- Monochrome aesthetic with white text on black background
- Gesture-based interactions for seamless UX
- Premium features with free tier support
- Distraction-free minimal design

## Features

### Core Features

- **Swipe-Adjustable Timer**: Horizontal swipe gesture to adjust duration (1-20 min free, 1-999 min premium)
- **Visual Slider**: Persistent slider with animated tick marks
- **Background Support**: Timer continues running when app is backgrounded
- **Session History**: View all completed focus sessions with timestamps

### Statistics (Premium/Free Tiers)

- **Free**: Today's minutes, Total minutes
- **Premium**: Weekly, Monthly, Average Daily, Longest Streak (+ Free stats)

### Authentication

- Magic link authentication via Supabase
- Profile management with premium status

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/bilalsGitHub/blackfocuspro.git
cd blackfocuspro
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your Supabase credentials:
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

4. Start the development server:

```bash
npm start
```

5. Run on your device:
   - **iOS**: Scan QR code with Camera app (requires Expo Go app)
   - **Android**: Scan QR code with Expo Go app
   - **iOS Simulator**: Press `i` in terminal
   - **Android Emulator**: Press `a` in terminal

## Project Structure

```
blackfocuspro/
├── App.js                           # Main app entry
├── src/
│   ├── auth/
│   │   └── AuthContext.js           # Authentication state management
│   ├── context/
│   │   └── AppContext.js            # Global state (timer, stats, premium)
│   ├── lib/
│   │   └── supabaseClient.js        # Supabase client configuration
│   ├── navigation/
│   │   ├── AppNavigator.js          # Main app navigation
│   │   └── AuthNavigator.js         # Auth flow navigation
│   ├── screens/
│   │   ├── HomeScreen.js            # Timer with swipe gestures
│   │   ├── StatisticsScreen.js      # Premium/Free statistics
│   │   ├── HistoryScreen.js         # Session history
│   │   ├── ProfileScreen.js         # User profile + premium toggle
│   │   ├── LoginScreen.js           # Email/password login
│   │   ├── SignupScreen.js          # Account creation
│   │   ├── MagicLinkScreen.js       # Passwordless auth
│   │   └── LoadingScreen.js         # Auth loading state
│   ├── services/
│   │   └── focusService.js          # Focus session CRUD operations
│   └── styles/
│       └── theme.js                 # Shared styles and colors
├── .env                              # Environment variables (not in git)
├── .env.example                      # Environment template
├── .gitignore
├── package.json
└── app.json
```

## Technical Details

- **Framework**: React Native (Expo SDK 51)
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **State Management**: React Context API
- **Backend**: Supabase (Auth + Database)
- **Storage**: AsyncStorage + Supabase
- **Gestures**: PanResponder with Animated API
- **Premium System**: Boolean flag in AppContext with feature gating

## Usage

### Timer

1. Swipe horizontally on the white slider to adjust duration
2. Press "START" to begin a focus session
3. Timer runs in background if you switch apps
4. Press "STOP" to cancel and reset
5. Timer auto-completes and saves to history

### Statistics

- Free users see 2 basic stats (Today, Total)
- Premium users unlock 6 stats including Weekly, Monthly, Average, Streak
- Toggle premium in Profile screen for testing

### Premium Limits

- **Free**: Max 20 minutes per session
- **Premium**: Unlimited (up to 999 minutes)

## Environment Variables

Required variables in `.env`:

| Variable                        | Description                 |
| ------------------------------- | --------------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`      | Your Supabase project URL   |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import repository in Vercel dashboard
3. Add environment variables in Vercel settings
4. Deploy with framework preset: "Other" or "Expo"

## License

MIT
