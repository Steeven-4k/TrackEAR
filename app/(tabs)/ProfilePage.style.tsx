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
    alignItems: "center",
  },
  editIndicatorContainer: {
    marginBottom: height * 0.01,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD700",
    paddingVertical: height * 0.01,
    borderRadius: 5,
    width: "100%",
  },
  editIndicator: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#000",
  },
  avatarSection: {
    alignItems: "center",
    marginVertical: height * 0.025,
  },
  avatar: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.175,
    backgroundColor: "#FFF",
  },
  editIcon: {
    position: "absolute",
    bottom: height * 0.0,
    right: width * 0.0,
    backgroundColor: "#85C1E9",
    borderRadius: width * 0.175,
    padding: width * 0.015,
  },
  editText: {
    color: "#FFF",
    fontSize: width * 0.03,
  },
  name: {
    fontSize: width * 0.055,
    fontWeight: "bold",
    marginTop: height * 0.015,
  },
  editingName: {
    backgroundColor: "#FFF",
    paddingHorizontal: width * 0.02,
    borderRadius: width * 0.02,
    borderWidth: width * 0.002,
    borderColor: "#85C1E9",
  },
  inputError: {
    borderColor: "#F44336",
    borderWidth: width * 0.002,
  },
  errorText: {
    color: "red",
    fontSize: width * 0.03,
    marginTop: height * 0.006,
    marginBottom: height * 0.01,
    alignSelf: "center",
    textAlign: "center",
    width: "100%",
  },
  infoSection: {
    width: "100%",
    marginVertical: height * 0.03,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#D6EAF8",
    padding: width * 0.05,
    borderWidth: width * 0.002,
    borderRadius: width * 0.02,
    borderColor: "#85C1E9",
    marginBottom: height * 0.012,
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    flex: 1,
  },
  input: {
    backgroundColor: "#FFF",
    flex: 2,
    borderRadius: width * 0.02,
    padding: width * 0.03,
    fontSize: width * 0.04,
    color: "#000",
  },
  inputValue: {
    marginLeft: width * 0.03,
  },
  value: {
    fontSize: width * 0.04,
    color: "#555",
    flex: 2,
    overflow: "hidden",
    textAlign: "right",
  },
  textValue: {
    marginLeft: width * 0.03,
  },
  actionSection: {
    width: "100%",
  },
  actionButton: {
    backgroundColor: "#85C1E9",
    padding: width * 0.05,
    borderRadius: width * 0.02,
    marginBottom: height * 0.012,
    alignItems: "center",
  },
  actionText: {
    color: "#FFF",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: height * 0.025,
    width: "80%",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: width * 0.025,
    borderRadius: width * 0.02,
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: width * 0.04,
    textAlign: "center",
    color: "#fff",
  },
  cancelButton: {
    backgroundColor: "#F44336",
    padding: width * 0.025,
    borderRadius: width * 0.02,
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
  },
});
