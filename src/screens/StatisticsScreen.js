import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useApp } from "../context/AppContext";
import { colors, commonStyles } from "../styles/theme";

export default function StatisticsScreen() {
  const {
    isPremium,
    sessions,
    getTodayMinutes,
    getTotalMinutes,
    getWeeklyMinutes,
    getMonthlyMinutes,
    getAverageDailyMinutes,
    bestStreak,
    togglePremium,
  } = useApp();

  const [stats, setStats] = useState({
    todayMinutes: 0,
    totalMinutes: 0,
    weeklyMinutes: 0,
    monthlyMinutes: 0,
    averageDaily: 0,
    bestStreak: 0,
  });

  useEffect(() => {
    updateStatistics();
  }, [sessions, bestStreak]);

  const updateStatistics = () => {
    setStats({
      todayMinutes: getTodayMinutes(),
      totalMinutes: getTotalMinutes(),
      weeklyMinutes: getWeeklyMinutes(),
      monthlyMinutes: getMonthlyMinutes(),
      averageDaily: getAverageDailyMinutes(),
      bestStreak: bestStreak,
    });
  };

  const StatCard = ({
    title,
    value,
    unit = "dakika",
    isPremiumFeature = false,
    decimalPlaces = 0,
  }) => (
    <View
      style={[
        styles.statCard,
        isPremiumFeature && !isPremium && styles.lockedCard,
      ]}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        {isPremiumFeature && !isPremium ? (
          <View style={styles.lockBadge}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.lockText}>Premium</Text>
          </View>
        ) : (
          <Text style={styles.cardValue}>
            {typeof value === "number" ? value.toFixed(decimalPlaces) : value}
          </Text>
        )}
        <Text style={styles.cardUnit}>{unit}</Text>
      </View>
    </View>
  );

  return (
    <View style={[commonStyles.container, styles.container]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.header}>İSTATİSTİKLER</Text>
          <View style={styles.premiumBadge}>
            <Text style={styles.badgeText}>
              {isPremium ? "✨ Premium Üye" : "👤 Ücretsiz Üye"}
            </Text>
          </View>
        </View>

        {/* Free Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 ÜCRETSIZ İSTATİSTİKLER</Text>
          <StatCard
            title="Bugün Odaklandığı Süre"
            value={stats.todayMinutes}
            unit="dakika"
          />
          <StatCard
            title="Toplam Odak Süresi"
            value={stats.totalMinutes}
            unit="dakika"
          />
        </View>

        {/* Premium Stats */}
        <View style={styles.section}>
          <View style={styles.premiumHeader}>
            <Text style={styles.sectionTitle}>⭐ PREMIUM İSTATİSTİKLER</Text>
            {!isPremium && <Text style={styles.premiumTag}>Kilitli</Text>}
          </View>

          <StatCard
            title="Haftalık Toplam"
            value={stats.weeklyMinutes}
            unit="dakika"
            isPremiumFeature={true}
          />
          <StatCard
            title="Aylık Toplam"
            value={stats.monthlyMinutes}
            unit="dakika"
            isPremiumFeature={true}
          />
          <StatCard
            title="Ortalama Günlük"
            value={stats.averageDaily}
            unit="dakika"
            isPremiumFeature={true}
            decimalPlaces={1}
          />
          <StatCard
            title="En Uzun Streak"
            value={stats.bestStreak}
            unit="gün"
            isPremiumFeature={true}
          />
        </View>

        {/* Premium CTA */}
        {!isPremium && (
          <View style={styles.promoBanner}>
            <Text style={styles.promoTitle}>🚀 Premium'a Yükselt!</Text>
            <Text style={styles.promoText}>
              Detaylı istatistikler, haftalık ve aylık analizlerini görmek için
              premium üyeliğe geçiş yap.
            </Text>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={togglePremium}>
              <Text style={styles.upgradeButtonText}>Premium'a Yükselt</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Premium Toggle for Testing */}
        {isPremium && (
          <View style={styles.devSection}>
            <Text style={styles.devText}>Test Modu:</Text>
            <TouchableOpacity style={styles.devButton} onPress={togglePremium}>
              <Text style={styles.devButtonText}>Ücretsiz Moda Dön</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerSection: {
    marginBottom: 24,
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  premiumBadge: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.white,
  },
  section: {
    marginBottom: 28,
  },
  premiumHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  premiumTag: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.error,
    backgroundColor: colors.error + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 2,
    borderLeftColor: colors.textSecondary,
  },
  lockedCard: {
    opacity: 0.7,
    borderLeftColor: colors.error,
  },
  cardContent: {
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: "center",
  },
  cardValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 4,
  },
  cardUnit: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  lockBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  lockIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  lockText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: "600",
  },
  promoBanner: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    marginBottom: 20,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 8,
  },
  promoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.background,
  },
  devSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  devText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  devButton: {
    backgroundColor: colors.error,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  devButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
});
