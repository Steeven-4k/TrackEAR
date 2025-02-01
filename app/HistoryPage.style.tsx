import { Dimensions, StyleSheet } from "react-native";

// Get device screen width and height
const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FADBD8",
  },
  container: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: "#FADBD8",
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    marginBottom: height * 0.05,
    textAlign: "center",
  },
  notificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: width * 0.05,
    backgroundColor: "#FFF",
    borderRadius: width * 0.02,
    marginBottom: height * 0.015,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    borderWidth: width * 0.002,
    borderColor: "#ddd",
  },
  notificationText: {
    fontSize: width * 0.044,
    color: "#333",
    flex: 1,
    marginRight: width * 0.03,
  },
  deleteButton: {
    backgroundColor: "#E74C3C",
    padding: width * 0.05,
    borderRadius: width * 0.05,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#FFF",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  clearButton: {
    backgroundColor: "#85C1E9",
    padding: width * 0.05,
    borderRadius: width * 0.05,
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.05,
  },
  clearButtonText: {
    color: "#FFF",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
});
