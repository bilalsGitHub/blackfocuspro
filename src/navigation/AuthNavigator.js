import React, { useState } from 'react';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import MagicLinkScreen from '../screens/MagicLinkScreen';

export default function AuthNavigator() {
  const [currentScreen, setCurrentScreen] = useState('Login');

  const navigation = {
    navigate: (screen) => setCurrentScreen(screen),
  };

  switch (currentScreen) {
    case 'Signup':
      return <SignupScreen navigation={navigation} />;
    case 'MagicLink':
      return <MagicLinkScreen navigation={navigation} />;
    default:
      return <LoginScreen navigation={navigation} />;
  }
}

