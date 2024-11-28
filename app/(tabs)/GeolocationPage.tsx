import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";

import { styles } from "./GeolocationPage.style";

import { useRouter } from "expo-router";

export default function GeolocationPage({ route }) {
  const router = useRouter(); // Utilise le hook useRouter

  const [isDeviceConnected, setIsDeviceConnected] = useState(false); // État de connexion
  const [distance, setDistance] = useState("2 km"); // Distance simulée

  // Simuler la connexion d'un appareil depuis la page Devices
  React.useEffect(() => {
    if (route?.params?.deviceConnected) {
      setIsDeviceConnected(true);
    }
  }, [route?.params?.deviceConnected]);

  const handleConnectDevice = () => {
    Alert.alert(
      "No Device Connected",
      "Please connect a device from the Devices page."
    );
    router.push("/DevicesPage");
  };

  return (
    <View style={styles.container}>
      {isDeviceConnected ? (
        // Si un appareil est connecté
        <>
          <Text style={styles.title}>Precise Location</Text>
          <Image
            source={require("../../assets/images/map.jpg")} // Remplacez par une image de carte
            style={styles.mapImage}
          />
          <TouchableOpacity style={styles.centerButton}>
            <Text style={styles.centerButtonText}>Center on my position</Text>
          </TouchableOpacity>
          <Text style={styles.compassTitle}>Compass</Text>
          <Image
            source={require("../../assets/images/compass.png")} // Remplacez par une image de boussole
            style={styles.compassImage}
          />
          <Text style={styles.distanceText}>Distance: {distance}</Text>
        </>
      ) : (
        // Si aucun appareil n'est connecté
        <>
          <Image
            source={require("../../assets/images/map.jpg")} // Remplacez par une image par défaut
            style={styles.mapImage}
          />
          <Text style={styles.noDeviceText}>Can't find any device</Text>
          <TouchableOpacity
            style={styles.connectButton}
            onPress={handleConnectDevice}
          >
            <Text style={styles.connectButtonText}>Connect Here</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
