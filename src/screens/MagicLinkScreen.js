import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { colors, commonStyles } from '../styles/theme';

export default function MagicLinkScreen({ navigation }) {
  const { loginWithMagicLink } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendMagicLink = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setIsLoading(true);
    const result = await loginWithMagicLink(email);
    setIsLoading(false);

    if (result.success) {
      setEmailSent(true);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  if (emailSent) {
    return (
      <View style={[commonStyles.container, styles.container]}>
        <View style={styles.content}>
          <Text style={styles.title}>CHECK YOUR EMAIL</Text>
          <Text style={styles.message}>
            We sent a magic link to
          </Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.message}>
            Click the link in the email to sign in.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>BACK TO LOGIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[commonStyles.container, styles.container]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>MAGIC LINK</Text>
        <Text style={styles.subtitle}>Sign in with email</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.gray}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSendMagicLink}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'SENDING...' : 'SEND MAGIC LINK'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.7}
        >
          <Text style={styles.linkText}>Back to login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 36,
    fontWeight: '200',
    letterSpacing: 8,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.gray,
    fontSize: 18,
    fontWeight: '300',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 60,
  },
  message: {
    color: colors.gray,
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  email: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    backgroundColor: colors.black,
    color: colors.white,
    fontSize: 16,
    fontWeight: '300',
    paddingVertical: 16,
    paddingHorizontal: 0,
    marginBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
  },
  button: {
    paddingVertical: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '300',
    letterSpacing: 3,
  },
  linkButton: {
    marginTop: 32,
    alignItems: 'center',
  },
  linkText: {
    color: colors.gray,
    fontSize: 14,
    fontWeight: '300',
  },
});

