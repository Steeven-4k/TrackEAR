import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";

import { styles } from "./DevicesPages.style";
import i18n from "../../constants/i18n";

import { useRouter } from "expo-router";

export default function DevicesPage() {
  const router = useRouter(); // Hook to navigate between pages

  const [isDeviceConnected, setIsDeviceConnected] = useState(false); // State to track whether a device is connected

  // Interface defining the structure of a device object
  interface Device {
    name: string;
    model: string;
    modelNumber: string;
    serialNumber: string;
    version: string;
  }

  const [device, setDevice] = useState<Device | null>(null); // State to store the connected device information

  // Function to simulate connecting a device
  const handleConnectDevice = () => {
    Alert.alert(
      i18n.t("deviceConnectedAlertTitle"),
      i18n.t("deviceConnectedAlertMessage")
    );
    setIsDeviceConnected(true); // Update the state to indicate a device is connected
    setDevice({
      name: "My Hearing Aids",
      model: "Hearing Aid Pro",
      modelNumber: "A9548",
      serialNumber: "JSHDFEH544D",
      version: "2E93",
    });
  };

  // Function to simulate forgetting a connected device
  const handleForgetDevice = () => {
    Alert.alert(
      i18n.t("forgetDeviceAlertTitle"),
      i18n.t("forgetDeviceAlertMessage"),
      [
        { text: i18n.t("forgetDeviceCancel"), style: "cancel" },
        {
          text: i18n.t("forgetDeviceConfirm"),
          style: "destructive",
          onPress: () => {
            setIsDeviceConnected(false); // Reset the connection state
            setDevice(null); // Clear the device information
          },
        },
      ]
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>{i18n.t("devicesPageTitle")}</Text>

          {/* If no device is connected, show the add button */}
          {!isDeviceConnected ? (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleConnectDevice}
            >
              <Text style={styles.addButtonText}>
                {i18n.t("addDeviceButton")}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              {/* Display the connected device */}
              <View style={styles.deviceRow}>
                {device && <Text style={styles.deviceName}>{device.name}</Text>}
                <TouchableOpacity
                  style={styles.infoButton}
                  onPress={() =>
                    device &&
                    Alert.alert(
                      i18n.t("deviceInfoTitle"),
                      `Model Name: ${device.model}\nModel N°: ${device.modelNumber}\nSerial N°: ${device.serialNumber}\nVersion: ${device.version}`, // Device details
                      [
                        {
                          text: i18n.t("currentLocation"), // Option to go to Geolocation page
                          onPress: () => router.push("/GeolocationPage"),
                        },
                        {
                          text: i18n.t("forgetDeviceButton"), // Option to forget the device
                          style: "destructive",
                          onPress: handleForgetDevice,
                        },
                        { text: i18n.t("close"), style: "cancel" }, // Close the alert
                      ]
                    )
                  }
                >
                  {/* Info button */}
                  <Text style={styles.infoText}>ℹ️</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
