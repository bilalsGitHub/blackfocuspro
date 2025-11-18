import { StyleSheet } from "react-native";

export const colors = {
  // Core palette
  background: "#050505",
  card: "#111111",
  text: "#FFFFFF",
  textSecondary: "#9E9E9E",
  primary: "#8C7CFF",
  error: "#FF5C5C",

  // Legacy aliases (kept for backward compatibility)
  black: "#000000",
  white: "#FFFFFF",
  gray: "#666666",
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.white,
    fontFamily: "System",
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "300",
    letterSpacing: 2,
  },
});
