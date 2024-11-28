import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, Alert } from "react-native";

import { styles } from "./DevicesPages.style";

import { useRouter } from "expo-router";

export default function DevicesPage() {
  const router = useRouter(); // Utilise le hook useRouter

  const [isDeviceConnected, setIsDeviceConnected] = useState(false); // État local pour simuler la connexion
  const [device, setDevice] = useState(null);

  const handleConnectDevice = () => {
    Alert.alert("Device Connected", "Your device is now connected!");
    setIsDeviceConnected(true);
    setDevice({
      name: "My Hearing Aids",
      model: "Hearing Aid Pro",
      modelNumber: "A9548",
      serialNumber: "JSHDFEH544D",
      version: "2E93",
    });
  };

  const handleForgetDevice = () => {
    Alert.alert(
      "Forget Device",
      "Are you sure you want to forget this device?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            setIsDeviceConnected(false);
            setDevice(null);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect your hearing aids</Text>
      {!isDeviceConnected ? (
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleConnectDevice}
        >
          <Text style={styles.addButtonText}>Add a device</Text>
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.deviceRow}>
            <Text style={styles.deviceName}>{device.name}</Text>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() =>
                Alert.alert(
                  "Device Info",
                  `Model Name: ${device.model}\nModel N°: ${device.modelNumber}\nSerial N°: ${device.serialNumber}\nVersion: ${device.version}`,
                  [
                    {
                      text: "Current Location",
                      onPress: () => router.push("/GeolocationPage"),
                    },
                    {
                      text: "Forget the device",
                      style: "destructive",
                      onPress: handleForgetDevice,
                    },
                    { text: "Close", style: "cancel" },
                  ]
                )
              }
            >
              <Text style={styles.infoText}>ℹ️</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
