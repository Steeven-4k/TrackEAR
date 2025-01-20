import { Dimensions, StyleSheet, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F9",
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? height * 0.1 : height * 0.08,
    left: width * 0.05,
    right: width * 0.05,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    flex: 1,
    backgroundColor: "#2196F3",
    marginHorizontal: width * 0.01,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontSize: width * 0.04,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  imageBubble: {
    position: "absolute",
    top: height * 0.06,
    left: width * 0.05,
    width: width * 0.23,
    height: height * 0.093,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  imageText: {
    fontSize: width * 0.02,
    fontWeight: "bold",
    marginBottom: 5,
  },
  mapPreview: {
    width: width * 0.2,
    height: height * 0.07,
    borderRadius: 8,
  },
});
