import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FADBD8",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  mapImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  noDeviceText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },
  connectButton: {
    backgroundColor: "#85C1E9",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  connectButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  centerButton: {
    backgroundColor: "#85C1E9",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  centerButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  compassTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  compassImage: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 10,
  },
  distanceText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
