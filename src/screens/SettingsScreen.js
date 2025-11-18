import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';
import { useAuth } from '../auth/AuthContext';
import { colors, commonStyles } from '../styles/theme';

export default function SettingsScreen() {
  const { defaultDuration, dailyGoal, updateDefaultDuration, updateDailyGoal, resetHistory } = useApp();
  const { logout, user } = useAuth();
  const [durationModalVisible, setDurationModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [tempDuration, setTempDuration] = useState(defaultDuration.toString());
  const [tempGoal, setTempGoal] = useState(dailyGoal.toString());

  const handleDurationSave = () => {
    const duration = parseInt(tempDuration, 10);
    if (!isNaN(duration) && duration > 0 && duration <= 180) {
      updateDefaultDuration(duration);
      setDurationModalVisible(false);
    }
  };

  const handleGoalSave = () => {
    const goal = parseInt(tempGoal, 10);
    if (!isNaN(goal) && goal > 0 && goal <= 1440) {
      updateDailyGoal(goal);
      setGoalModalVisible(false);
    }
  };

  const handleResetConfirm = () => {
    resetHistory();
    setResetModalVisible(false);
  };

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    
    if (confirmed) {
      const result = await logout();
      if (!result.success) {
        window.alert('Failed to logout: ' + result.error);
      }
    }
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      <Text style={styles.title}>SETTINGS</Text>
      
      <View style={styles.settingsList}>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => {
            setTempDuration(defaultDuration.toString());
            setDurationModalVisible(true);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.settingLabel}>Default focus duration</Text>
          <Text style={styles.settingValue}>{defaultDuration} min</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => {
            setTempGoal(dailyGoal.toString());
            setGoalModalVisible(true);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.settingLabel}>Daily focus goal</Text>
          <Text style={styles.settingValue}>{dailyGoal} min</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => setResetModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.settingLabel}>Reset history</Text>
        </TouchableOpacity>

        {user && (
          <TouchableOpacity
            style={[styles.settingItem, styles.logoutItem]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Duration Modal */}
      <Modal
        visible={durationModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setDurationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>DEFAULT DURATION</Text>
            <Text style={styles.modalSubtitle}>Minutes (1-180)</Text>
            
            <TextInput
              style={styles.input}
              value={tempDuration}
              onChangeText={setTempDuration}
              keyboardType="numeric"
              maxLength={3}
              autoFocus={true}
              selectionColor={colors.white}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setDurationModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonText}>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleDurationSave}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonText}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Goal Modal */}
      <Modal
        visible={goalModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setGoalModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>DAILY GOAL</Text>
            <Text style={styles.modalSubtitle}>Minutes (1-1440)</Text>
            
            <TextInput
              style={styles.input}
              value={tempGoal}
              onChangeText={setTempGoal}
              keyboardType="numeric"
              maxLength={4}
              autoFocus={true}
              selectionColor={colors.white}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setGoalModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonText}>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleGoalSave}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonText}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reset Modal */}
      <Modal
        visible={resetModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setResetModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>RESET HISTORY</Text>
            <Text style={styles.modalSubtitle}>This will delete all sessions</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setResetModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonText}>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleResetConfirm}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonText}>RESET</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    paddingTop: 80,
  },
  title: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '200',
    letterSpacing: 6,
    marginBottom: 60,
  },
  settingsList: {
    width: '100%',
    paddingHorizontal: 40,
  },
  settingItem: {
    paddingVertical: 30,
    width: '100%',
  },
  settingLabel: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '300',
    letterSpacing: 1,
    marginBottom: 8,
  },
  settingValue: {
    color: colors.gray,
    fontSize: 16,
    fontWeight: '300',
  },
  logoutItem: {
    marginTop: 40,
  },
  logoutText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '300',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: colors.black,
    padding: 40,
    alignItems: 'center',
  },
  modalTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '300',
    letterSpacing: 3,
    marginBottom: 12,
  },
  modalSubtitle: {
    color: colors.gray,
    fontSize: 14,
    fontWeight: '300',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: colors.black,
    color: colors.white,
    fontSize: 48,
    fontWeight: '200',
    textAlign: 'center',
    paddingVertical: 20,
    marginBottom: 40,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  modalButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 2,
  },
});

