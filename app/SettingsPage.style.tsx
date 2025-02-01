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
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: height * 0.025,
  },
  titleIcon: {
    width: width * 0.15,
    height: width * 0.15,
    marginRight: width * 0.025,
  },
  title: {
    fontSize: width * 0.1,
    fontWeight: "bold",
    color: "#333",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.018,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  label: {
    fontSize: width * 0.04,
    color: "#333",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: height * 0.012,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginVertical: height * 0.025,
    color: "#555",
    marginRight: width * 0.02,
  },
  hintButton: {
    backgroundColor: "#85C1E9",
    width: width * 0.07,
    height: width * 0.07,
    borderRadius: width * 0.05,
    alignItems: "center",
    justifyContent: "center",
  },
  hintText: {
    color: "#FFF",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  languageSelector: {
    padding: width * 0.04,
    borderRadius: width * 0.02,
    borderWidth: width * 0.002,
    borderColor: "#ddd",
    backgroundColor: "#FFF",
    marginVertical: height * 0.012,
  },
  languageText: {
    fontSize: width * 0.045,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  languageOption: {
    padding: width * 0.05,
    backgroundColor: "#FFF",
    marginVertical: height * 0.013,
    marginHorizontal: width * 0.05,
    borderRadius: width * 0.02,
    borderWidth: width * 0.002,
    borderColor: "#FADBD8",
    alignItems: "center",
  },
  languageOptionText: {
    fontSize: width * 0.06,
    textAlign: "center",
    color: "#333",
  },
  backButton: {
    backgroundColor: "#85C1E9",
    padding: width * 0.05,
    borderRadius: width * 0.02,
    marginTop: height * 0.04,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#FFF",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
});
