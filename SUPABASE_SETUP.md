# Supabase Setup Guide for Focus Bubble

This guide walks you through the Supabase configuration that has been added to your Focus Bubble app.

## ✅ Completed Setup Steps

### 1. Dependencies Installed

The following packages have been installed:
- `@supabase/supabase-js` - Official Supabase JavaScript client
- `react-native-dotenv` - Environment variable support for React Native

### 2. Babel Configuration Updated

`babel.config.js` has been configured to support environment variables using `react-native-dotenv`.

### 3. Supabase Client Created

A new file `src/lib/supabaseClient.js` has been created with:
- Configured Supabase client instance
- Auto-refresh token enabled
- Session persistence enabled
- Test connection function

## 🔧 Manual Step Required: Create .env File

You need to manually create a `.env` file in the project root with your Supabase credentials:

**Create a file named `.env` in the root directory with this content:**

```env
SUPABASE_URL=https://bgsihysmgberzwnoajia.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnc2loeXNtZ2Jlcnp3bm9hamlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTc5MDEsImV4cCI6MjA3ODk3MzkwMX0.IHaoZNjnp7z-AIlDHS6h1sSQy21RA0j10FRskY79JUA
```

**Important Notes:**
- The `.env` file is already added to `.gitignore` for security
- Use `.env.example` as a template for other team members
- Never commit `.env` to version control

## 📁 File Structure

```
focus-bubble/
├── .env                          # Your credentials (not tracked by git)
├── .env.example                  # Template for other developers
├── babel.config.js               # ✅ Updated with dotenv plugin
├── src/
│   └── lib/
│       └── supabaseClient.js     # ✅ Supabase client instance
```

## 🧪 Testing the Connection

### Method 1: Using the Test Function

Import and call the test function in any component:

```javascript
import { testSupabaseConnection } from './src/lib/supabaseClient';

// Call it when your app loads or in a useEffect
useEffect(() => {
  testSupabaseConnection();
}, []);
```

### Method 2: Using the Supabase Client Directly

```javascript
import { supabase } from './src/lib/supabaseClient';

// Example: Query data
const { data, error } = await supabase
  .from('focus_sessions')
  .select('*')
  .limit(10);

console.log({ data, error });
```

## 🚀 Next Steps

### 1. Clear Cache and Restart

After creating the `.env` file, clear the Expo cache:

```bash
# Clear Expo cache
npx expo start -c

# Or stop the current server and restart with:
npm start -- -c
```

### 2. Verify Connection

Add this to your `App.js` temporarily to test:

```javascript
import { testSupabaseConnection } from './src/lib/supabaseClient';
import { useEffect } from 'react';

// Inside your App component
useEffect(() => {
  testSupabaseConnection();
}, []);
```

Check the console output for:
- ✅ "Supabase connected successfully!" (success)
- ❌ Error messages (if connection fails)

### 3. Create Database Tables

If you haven't already, create the `focus_sessions` table in Supabase:

```sql
CREATE TABLE focus_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  duration INTEGER NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## 📚 Usage Examples

### Insert a Session

```javascript
import { supabase } from './src/lib/supabaseClient';

const saveSession = async (duration) => {
  const { data, error } = await supabase
    .from('focus_sessions')
    .insert([
      {
        duration: duration,
        timestamp: new Date().toISOString(),
      }
    ]);
  
  if (error) console.error('Error saving session:', error);
  return { data, error };
};
```

### Fetch User Sessions

```javascript
const getSessions = async () => {
  const { data, error } = await supabase
    .from('focus_sessions')
    .select('*')
    .order('timestamp', { ascending: false });
  
  if (error) console.error('Error fetching sessions:', error);
  return { data, error };
};
```

### Real-time Subscriptions

```javascript
const channel = supabase
  .channel('focus_sessions_changes')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'focus_sessions' },
    (payload) => {
      console.log('New session added:', payload.new);
    }
  )
  .subscribe();

// Cleanup when component unmounts
return () => {
  supabase.removeChannel(channel);
};
```

## 🔐 Security Notes

- The `.env` file contains your **public anon key** (safe for client-side use)
- Never expose your **service role key** in client code
- Row Level Security (RLS) should be enabled on your Supabase tables
- Use Supabase Auth for user authentication

## 🐛 Troubleshooting

### "Module not found: @env"
- Make sure you created the `.env` file in the project root
- Restart with cache clear: `npx expo start -c`

### "Cannot read SUPABASE_URL"
- Verify `.env` file format (no quotes needed)
- Check that `babel.config.js` has the dotenv plugin

### Connection Errors
- Verify your Supabase URL is correct
- Check that your anon key is valid
- Ensure your Supabase project is active

## 📖 Documentation

- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript)
- [React Native Dotenv](https://github.com/goatandsheep/react-native-dotenv)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)

---

**Setup completed!** Your Focus Bubble app is now ready to integrate with Supabase. 🎉

