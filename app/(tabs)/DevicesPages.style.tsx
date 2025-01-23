import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FADBD8",
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  sectionTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    textAlign: "left",
    marginTop: height * 0.03,
    marginBottom: height * 0.01,
    color: "#333",
  },
  scanButton: {
    backgroundColor: "#85C1E9",
    paddingVertical: height * 0.015,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: height * 0.01,
    marginBottom: height * 0.02,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: width * 0.05,
    fontWeight: "bold",
    textAlign: "center",
  },
  deviceRow: {
    padding: 15,
    alignItems: "center",
    paddingVertical: height * 0.01,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
  },
  deviceName: {
    fontSize: width * 0.05,
    color: "#000",
    fontWeight: "bold",
  },
  deviceId: {
    fontSize: width * 0.04,
    color: "#555",
  },
  connectedDevice: {
    padding: height * 0.02,
    backgroundColor: "#d4edda",
    borderRadius: 15,
    alignItems: "center",
    width: "100%",
  },
  connectedText: {
    fontSize: width * 0.05,
    color: "#2E4053",
    fontWeight: "bold",
    textAlign: "center",
  },
});
