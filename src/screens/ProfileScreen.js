import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useApp } from "../context/AppContext";
import { useAuth } from "../auth/AuthContext";
import { colors, commonStyles } from "../styles/theme";

export default function ProfileScreen() {
  const {
    sessions,
    dailyGoal,
    getTodayMinutes,
    currentStreak,
    bestStreak,
    isPremium,
    togglePremium,
  } = useApp();

  const { logout, user } = useAuth();

  const [stats, setStats] = useState({
    todayFocus: 0,
    dailyGoal: 60,
    totalFocus: 0,
    totalSessions: 0,
    currentStreak: 0,
    bestStreak: 0,
  });

  useEffect(() => {
    loadProfileData();
  }, [sessions, dailyGoal, currentStreak, bestStreak]);

  const loadProfileData = () => {
    // Calculate today's focus
    const todayFocus = getTodayMinutes();

    // Calculate lifetime totals
    const totalFocus = sessions.reduce(
      (sum, session) => sum + session.duration,
      0
    );
    const totalSessions = sessions.length;

    setStats({
      todayFocus,
      dailyGoal,
      totalFocus,
      totalSessions,
      currentStreak: currentStreak || 0,
      bestStreak: bestStreak || 0,
    });
  };

  const handleLogout = async () => {
    console.log("🔴 LOGOUT BUTTON CLICKED!");

    // Web-compatible confirmation
    const confirmed = window.confirm("Are you sure you want to logout?");

    if (confirmed) {
      console.log("🔴 LOGOUT CONFIRMED!");
      const result = await logout();
      console.log("🔴 LOGOUT RESULT:", result);

      if (!result.success) {
        console.error("🔴 LOGOUT FAILED:", result.error);
        window.alert("Failed to logout: " + result.error);
      } else {
        console.log("✅ LOGOUT SUCCESS!");
      }
    } else {
      console.log("🔴 LOGOUT CANCELLED");
    }
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>YOUR PROFILE</Text>

        {/* Premium Status Banner */}
        <View style={[styles.section, styles.premiumSection]}>
          <View
            style={[
              styles.premiumBanner,
              isPremium && styles.premiumActiveBanner,
            ]}>
            <Text style={styles.premiumIcon}>{isPremium ? "✨" : "👤"}</Text>
            <Text style={styles.premiumStatus}>
              {isPremium ? "PREMIUM MEMBER" : "FREE MEMBER"}
            </Text>
            <TouchableOpacity
              style={styles.premiumToggleButton}
              onPress={togglePremium}>
              <Text style={styles.premiumToggleText}>
                {isPremium ? "View Free Version" : "View Premium"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DAILY STATS</Text>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Today's Focus</Text>
            <Text style={styles.statValue}>{stats.todayFocus} minutes</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Daily Goal</Text>
            <Text style={styles.statValue}>{stats.dailyGoal} minutes</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LIFETIME STATS</Text>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Focus</Text>
            <Text style={styles.statValue}>{stats.totalFocus} minutes</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Sessions</Text>
            <Text style={styles.statValue}>{stats.totalSessions}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>STREAK</Text>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Current Streak</Text>
            <Text style={styles.statValue}>{stats.currentStreak} days</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Best Streak</Text>
            <Text style={styles.statValue}>{stats.bestStreak} days</Text>
          </View>
        </View>

        {user && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}>
            <Text style={styles.logoutText}>LOGOUT</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    paddingTop: 80,
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  header: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "200",
    letterSpacing: 6,
    marginBottom: 40,
    textAlign: "center",
  },
  section: {
    width: "100%",
    marginBottom: 80,
    alignItems: "center",
  },
  premiumSection: {
    marginBottom: 60,
  },
  premiumBanner: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  premiumActiveBanner: {
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    borderColor: "#FFD700",
  },
  premiumIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  premiumStatus: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 2,
    marginBottom: 16,
  },
  premiumToggleButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 6,
  },
  premiumToggleText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "300",
    letterSpacing: 1,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "300",
    letterSpacing: 4,
    marginBottom: 40,
    textAlign: "center",
  },
  statItem: {
    marginBottom: 32,
    alignItems: "center",
  },
  statLabel: {
    color: colors.gray,
    fontSize: 14,
    fontWeight: "300",
    letterSpacing: 2,
    marginBottom: 8,
    textAlign: "center",
  },
  statValue: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "200",
    letterSpacing: 1,
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 40,
    marginBottom: 40,
    paddingVertical: 16,
    paddingHorizontal: 40,
  },
  logoutText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "300",
    letterSpacing: 3,
    textAlign: "center",
  },
});
