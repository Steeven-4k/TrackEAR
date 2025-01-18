import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FADBD8",
  },
  container: {
    flex: 1,
    backgroundColor: "#FADBD8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: width * 0.05,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  logo: {
    width: width * 0.6,
    height: height * 0.3,
    resizeMode: "contain",
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: height * 0.02,
    color: "#333",
  },
  subtitle: {
    fontSize: width * 0.04,
    textAlign: "center",
    color: "#666",
    marginBottom: height * 0.03,
  },
  button: {
    backgroundColor: "#85C1E9",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: 25,
    marginVertical: height * 0.02,
  },
  buttonText: {
    fontSize: width * 0.05,
    color: "#fff",
    fontWeight: "bold",
  },
});
