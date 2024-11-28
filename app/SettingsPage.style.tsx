import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FADBD8",
    padding: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  titleIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#333",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  hintButton: {
    backgroundColor: "#85C1E9",
    width: 25,
    height: 25,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  hintText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#555",
    marginRight: 5,
  },
  pickerContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 55,
    color: "#333",
  },
  backButton: {
    backgroundColor: "#85C1E9",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  backButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
