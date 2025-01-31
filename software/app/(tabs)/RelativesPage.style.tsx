import { Dimensions, StyleSheet, Platform } from "react-native";

// Get device screen width and height
const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FADBD8",
  },
  container: {
    flex: 1,
    backgroundColor: "#FADBD8",
    padding: width * 0.05,
    paddingBottom: height * 0.1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "#555",
    marginBottom: height * 0.02,
    textAlign: "center",
  },
  listSubtitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginVertical: height * 0.015,
  },
  input: {
    backgroundColor: "#FFF",
    padding: width * 0.04,
    borderRadius: width * 0.02,
    marginBottom: height * 0.015,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  actionButton: {
    backgroundColor: "#85C1E9",
    paddingVertical: height * 0.015,
    borderRadius: width * 0.02,
    alignItems: "center",
    marginTop: height * 0.02,
  },
  actionText: {
    color: "#FFF",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  addContainer: {
    backgroundColor: "#F8E7E4",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.01,
    paddingBottom: Platform.OS === "ios" ? height * 0.03 : height * 0.03,
    borderRadius: width * 0.03,
    marginVertical: height * 0.015,
    marginTop: Platform.OS === "ios" ? height * 0.025 : height * 0.1,
  },
  addButton: {
    backgroundColor: "#D6EAF8",
    paddingVertical: height * 0.015,
    borderRadius: width * 0.02,
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  addButtonText: {
    color: "#333",
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
  listContainer: {
    flex: 1,
    width: "100%",
  },
  relativeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: width * 0.04,
    borderRadius: width * 0.02,
    marginBottom: height * 0.015,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  relativeName: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    maxWidth: "50%",
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailButton: {
    backgroundColor: "#85C1E9",
    padding: width * 0.02,
    borderRadius: 50,
    marginHorizontal: width * 0.02,
  },
  detailText: {
    color: "#FFF",
    fontSize: width * 0.045,
  },
  deleteButton: {
    backgroundColor: "#E74C3C",
    paddingHorizontal: width * 0.03,
    paddingVertical: width * 0.02,
  },
  inputError: {
    borderColor: "#F44336",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    fontSize: width * 0.035,
    marginBottom: height * 0.01,
    textAlign: "center",
    width: "100%",
  },
});
