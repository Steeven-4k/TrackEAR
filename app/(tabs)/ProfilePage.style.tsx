import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FADBD8", // Fond rose
    padding: 20,
    alignItems: "center",
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
    flex: 1, // Prend de l'espace mais garde le texte aligné à droite
  },
  value: {
    fontSize: 16,
    color: "#555",
    flex: 3, // Prend plus d'espace pour s'assurer que le label et la valeur ne se chevauchent pas
    overflow: "hidden",
    textAlign: "right",
  },
  textValue: {
    marginLeft: 10, // Espace entre le label et la valeur
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
    marginLeft: 10, // Espace entre le label et le champ d'entrée
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
});
