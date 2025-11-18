import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AppState,
  Animated,
  PanResponder,
} from "react-native";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useApp } from "../context/AppContext";
import { saveSession } from "../services/focusService";
import { colors, commonStyles } from "../styles/theme";

export default function HomeScreen() {
  const { defaultDuration, addSession, isPremium } = useApp();
  const [timeLeft, setTimeLeft] = useState(defaultDuration * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(defaultDuration * 60);
  const [duration, setDuration] = useState(defaultDuration); // in minutes

  const intervalRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const backgroundTimeRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const lastDragX = useRef(0);
  const sliderPosition = useRef(new Animated.Value(0)).current;
  const tickScrollPosition = useRef(new Animated.Value(0)).current;
  const baselineDuration = useRef(defaultDuration); // Track the starting point for each gesture
  const [persistentSliderOffset, setPersistentSliderOffset] = useState(0); // Persistent position

  // Sync animated value with persistent offset on mount and updates
  useEffect(() => {
    sliderPosition.setValue(persistentSliderOffset);
    tickScrollPosition.setValue(-persistentSliderOffset * 0.5);
  }, [persistentSliderOffset]);

  // Gesture handler for time adjustment
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isRunning,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return !isRunning && Math.abs(gestureState.dx) > 2;
      },
      onPanResponderGrant: () => {
        lastDragX.current = 0;
        baselineDuration.current = duration; // Store current duration as baseline
      },
      onPanResponderMove: (evt, gestureState) => {
        if (isRunning) return;

        // Calculate new position from persistent offset
        const newPosition = persistentSliderOffset + gestureState.dx;
        const maxSlide = 450;
        const clampedPosition = Math.max(
          -maxSlide,
          Math.min(maxSlide, newPosition)
        );

        // Animate slider position
        Animated.timing(sliderPosition, {
          toValue: clampedPosition,
          duration: 0,
          useNativeDriver: true,
        }).start();

        // Animate tick marks to create scrolling effect
        Animated.timing(tickScrollPosition, {
          toValue: -clampedPosition * 0.5,
          duration: 0,
          useNativeDriver: true,
        }).start();

        // RIGHT = increase, LEFT = decrease
        const sensitivity = 0.15;
        const totalDrag = gestureState.dx;
        const deltaMinutes = Math.round(totalDrag * sensitivity);

        // Premium: unlimited, Free: max 20 minutes
        const maxLimit = isPremium ? 999 : 20;
        const newDuration = Math.max(
          1,
          Math.min(maxLimit, baselineDuration.current + deltaMinutes)
        );

        if (newDuration !== duration) {
          setDuration(newDuration);
          const newTime = newDuration * 60;
          setTimeLeft(newTime);
          setTotalTime(newTime);

          // Subtle feedback animation
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.02,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
              toValue: 1,
              friction: 6,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Save the final position
        const newPosition = persistentSliderOffset + gestureState.dx;
        const maxSlide = 450;
        const clampedPosition = Math.max(
          -maxSlide,
          Math.min(maxSlide, newPosition)
        );
        setPersistentSliderOffset(clampedPosition);

        lastDragX.current = 0;
        // NO animation back to center - keep position
      },
    })
  ).current;

  // Keep screen awake when timer is running
  useEffect(() => {
    if (isRunning) {
      activateKeepAwakeAsync();
    } else {
      deactivateKeepAwake();
    }
    return () => {
      deactivateKeepAwake();
    };
  }, [isRunning]);

  // Handle background timer
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/active/) && nextAppState === "background") {
        // App going to background
        if (isRunning) {
          backgroundTimeRef.current = Date.now();
        }
      } else if (
        appState.current.match(/background/) &&
        nextAppState === "active"
      ) {
        // App coming to foreground
        if (isRunning && backgroundTimeRef.current) {
          const timeInBackground = Math.floor(
            (Date.now() - backgroundTimeRef.current) / 1000
          );
          setTimeLeft((prev) => {
            const newTime = prev - timeInBackground;
            return newTime > 0 ? newTime : 0;
          });
          backgroundTimeRef.current = null;
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleComplete = async () => {
    setIsRunning(false);
    const completedMinutes = Math.round(totalTime / 60);

    // Save to Supabase
    const result = await saveSession(completedMinutes);
    if (result.success) {
      window.alert(`✅ Session Saved! ${completedMinutes} minutes completed`);
    }

    // Also save to local storage (for offline)
    addSession(completedMinutes);

    // Reset timer
    const newTime = defaultDuration * 60;
    setTimeLeft(newTime);
    setTotalTime(newTime);
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = async () => {
    setIsRunning(false);

    // Calculate how much time was used
    const timeUsed = totalTime - timeLeft; // in seconds
    const minutesUsed = Math.floor(timeUsed / 60);

    // Save if at least 1 minute was used
    if (minutesUsed >= 1) {
      const confirmed = window.confirm(
        `You focused for ${minutesUsed} minute${
          minutesUsed > 1 ? "s" : ""
        }. Save this session?`
      );

      if (confirmed) {
        // Save to Supabase
        const result = await saveSession(minutesUsed);
        if (result.success) {
          window.alert(`✅ Saved! ${minutesUsed} minutes recorded`);
        } else {
          window.alert("❌ Failed to save session");
        }

        // Also save to local storage
        addSession(minutesUsed);
      }

      // Reset timer
      const newTime = defaultDuration * 60;
      setTimeLeft(newTime);
      setTotalTime(newTime);
    } else {
      // Less than 1 minute, just reset
      const newTime = defaultDuration * 60;
      setTimeLeft(newTime);
      setTotalTime(newTime);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;

  return (
    <View style={commonStyles.container}>
      <View style={styles.timerContainer}>
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </Animated.View>
        {!isRunning && (
          <Text style={styles.hintText}>
            ← Decrease | Increase → {!isPremium && "(Max 20 min)"}
          </Text>
        )}

        {!isRunning && (
          <View
            style={styles.sliderTrackContainer}
            {...panResponder.panHandlers}>
            {/* Animated background ticks */}
            <Animated.View
              style={[
                styles.ticksContainer,
                {
                  transform: [{ translateX: tickScrollPosition }],
                },
              ]}>
              {[...Array(81)].map((_, i) => (
                <View
                  key={i}
                  style={[styles.tick, i % 5 === 0 && styles.tickLarge]}
                />
              ))}
            </Animated.View>

            {/* Fixed center indicator line */}
            <View style={styles.centerIndicator} />

            {/* Moving white slider indicator */}
            <Animated.View
              style={[
                styles.sliderIndicator,
                {
                  transform: [{ translateX: sliderPosition }],
                },
              ]}
            />
          </View>
        )}

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>

        <TouchableOpacity
          style={commonStyles.button}
          onPress={isRunning ? handleStop : handleStart}
          activeOpacity={0.7}>
          <Text style={commonStyles.buttonText}>
            {isRunning ? "STOP" : "START"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  timerText: {
    color: colors.white,
    fontSize: 80,
    fontWeight: "200",
    letterSpacing: 4,
    marginBottom: 12,
  },
  hintText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "300",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 32,
  },
  sliderTrackContainer: {
    width: "90%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 8,
  },
  ticksContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "200%",
    height: "100%",
    position: "absolute",
  },
  tick: {
    width: 1,
    height: 10,
    backgroundColor: colors.gray,
    opacity: 0.25,
  },
  tickLarge: {
    height: 16,
    opacity: 0.4,
    width: 1.5,
  },
  centerIndicator: {
    width: 2,
    height: 32,
    backgroundColor: colors.white,
    opacity: 0.3,
    position: "absolute",
    zIndex: 1,
  },
  sliderIndicator: {
    width: 4,
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 2,
    position: "absolute",
    zIndex: 2,
    shadowColor: colors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 8,
  },
  progressContainer: {
    width: "80%",
    height: 1,
    backgroundColor: colors.gray,
    marginBottom: 60,
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.white,
  },
});
