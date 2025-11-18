import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, commonStyles } from '../styles/theme';

export default function HistoryScreen() {
  const { sessions } = useApp();

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sessionDate = new Date(timestamp);
    sessionDate.setHours(0, 0, 0, 0);

    const isToday = sessionDate.getTime() === today.getTime();
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = sessionDate.getTime() === yesterday.getTime();

    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });

    if (isToday) {
      return `Today ${timeStr}`;
    } else if (isYesterday) {
      return `Yesterday ${timeStr}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }) + ' ' + timeStr;
    }
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      <Text style={styles.title}>HISTORY</Text>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {sessions.length === 0 ? (
          <Text style={styles.emptyText}>No sessions yet</Text>
        ) : (
          sessions.map((session) => (
            <View key={session.id} style={styles.sessionItem}>
              <Text style={styles.sessionText}>
                {session.duration} min • {formatDate(session.timestamp)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
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
  scrollView: {
    width: '100%',
  },
  listContainer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  sessionItem: {
    marginBottom: 40,
  },
  sessionText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '300',
    letterSpacing: 1,
  },
  emptyText: {
    color: colors.gray,
    fontSize: 18,
    fontWeight: '300',
    textAlign: 'center',
    marginTop: 40,
  },
});

