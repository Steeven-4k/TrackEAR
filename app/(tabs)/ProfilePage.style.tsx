import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FADBD8",
  },
  container: {
    flex: 1,
    backgroundColor: "#FADBD8",
    padding: 20,
    alignItems: "center",
  },
  editIndicatorContainer: {
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD700",
    paddingVertical: 5,
    borderRadius: 5,
    width: "100%",
  },
  editIndicator: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  avatarSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFF",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#85C1E9",
    borderRadius: 15,
    padding: 5,
  },
  editText: {
    color: "#FFF",
    fontSize: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  editingName: {
    backgroundColor: "#FFF",
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#85C1E9",
  },
  inputError: {
    borderColor: "#F44336",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 10,
    alignSelf: "center",
    textAlign: "center",
    width: "100%",
  },
  infoSection: {
    width: "100%",
    marginVertical: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#D6EAF8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  input: {
    backgroundColor: "#FFF",
    flex: 2,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: "#000",
  },
  inputValue: {
    marginLeft: 10,
  },
  value: {
    fontSize: 16,
    color: "#555",
    flex: 3,
    overflow: "hidden",
    textAlign: "right",
  },
  textValue: {
    marginLeft: 10,
  },
  actionSection: {
    width: "100%",
  },
  actionButton: {
    backgroundColor: "#85C1E9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  actionText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "80%",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
  cancelButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
});
