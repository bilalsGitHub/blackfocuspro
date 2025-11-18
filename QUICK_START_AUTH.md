# Quick Start - Authentication

## 🚀 Run the App

```bash
# Clear cache and start
npx expo start -c

# Or
npm start -- -c
```

## 📋 Before You Start

### 1. Create Supabase Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create table
CREATE TABLE focus_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  duration INTEGER NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can view own sessions"
  ON focus_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON focus_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON focus_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Add indexes
CREATE INDEX idx_sessions_user ON focus_sessions(user_id);
CREATE INDEX idx_sessions_time ON focus_sessions(timestamp DESC);
```

### 2. Enable Google OAuth (Optional)

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google
3. Add Client ID and Secret from Google Cloud Console
4. Add redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### 3. Configure Redirect URLs

In Supabase → Authentication → URL Configuration, add:

```
focusbubble://auth/callback
http://localhost:19006/auth/callback
exp://localhost:19000/--/auth/callback
```

## 🎯 How to Use Auth in Your Code

### Get Current User

```javascript
import { useAuth } from './src/auth/AuthContext';

function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!user) return <Text>Not logged in</Text>;
  
  return <Text>Welcome {user.email}</Text>;
}
```

### Login with Email

```javascript
const { loginWithEmail } = useAuth();

const handleLogin = async () => {
  const result = await loginWithEmail('user@example.com', 'password123');
  
  if (result.success) {
    console.log('Logged in!');
  } else {
    console.error(result.error);
  }
};
```

### Sign Up

```javascript
const { signupWithEmail } = useAuth();

const result = await signupWithEmail('user@example.com', 'password123');
```

### Logout

```javascript
const { logout } = useAuth();

const result = await logout();
```

### Save Focus Session

```javascript
import { saveSession } from './src/services/focusService';

// Automatically includes user_id
const result = await saveSession(20); // 20 minutes
```

### Get User's Sessions

```javascript
import { getSessions } from './src/services/focusService';

const { data, error } = await getSessions();
// Only returns current user's sessions
```

## 🧪 Test Authentication

### Test Email/Password

1. Run app
2. See LoginScreen (no user logged in)
3. Tap "Don't have an account? Sign up"
4. Enter email/password, create account
5. Go back to login
6. Login with credentials
7. See Timer screen (logged in!)

### Test Logout

1. Navigate to Settings tab
2. Scroll down
3. Tap "Logout"
4. Confirm
5. See LoginScreen (logged out!)

### Test Session Persistence

1. Login
2. Force close app
3. Reopen app
4. Should see Timer screen (still logged in)

## 📱 Navigation Structure

```
User NOT logged in
  ↓
AuthNavigator
  ├── LoginScreen
  ├── SignupScreen
  └── MagicLinkScreen

User IS logged in
  ↓
AppNavigator
  ├── Timer (HomeScreen)
  ├── History (HistoryScreen)
  ├── Profile (ProfileScreen)
  └── Settings (SettingsScreen with Logout)
```

## 🔑 Environment Variables

Your `.env` file:

```env
SUPABASE_URL=https://bgsihysmgberzwnoajia.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
```

**Important:** The `.env` file is in `.gitignore` for security.

## 🆘 Common Issues

### Issue: "Cannot read property 'SUPABASE_URL'"
**Fix:** 
1. Verify `.env` file exists in project root
2. Restart with cache clear: `npx expo start -c`

### Issue: "Error saving session: No authenticated user"
**Fix:**
1. Verify user is logged in
2. Check console: `console.log(user)`
3. Test: Open LoginScreen and login first

### Issue: Can't see sessions in History
**Fix:**
1. Check RLS policies on `focus_sessions` table
2. Verify `user_id` column exists
3. Test query in Supabase SQL editor:
   ```sql
   SELECT * FROM focus_sessions WHERE user_id = auth.uid();
   ```

### Issue: Google OAuth not working
**Fix:**
1. Enable Google in Supabase Dashboard
2. Add proper redirect URLs
3. Test on real device (not web browser)

## ✅ Checklist

- [ ] Created `focus_sessions` table in Supabase
- [ ] Enabled RLS and added policies
- [ ] Created `.env` file with credentials
- [ ] Installed all dependencies (`npm install`)
- [ ] Cleared cache and restarted (`npx expo start -c`)
- [ ] Can sign up new account
- [ ] Can login with email/password
- [ ] Can logout from Settings
- [ ] Sessions persist after app restart
- [ ] Focus sessions save to database
- [ ] History shows only my sessions

---

**You're ready to go!** 🚀

Start the app, create an account, and begin tracking your focus sessions.

