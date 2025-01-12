import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, Alert } from "react-native";

import { styles } from "./DevicesPages.style";
import i18n from "../../constants/i18n";

import { useRouter } from "expo-router";

export default function DevicesPage() {
  const router = useRouter(); // Utilise le hook useRouter

  const [isDeviceConnected, setIsDeviceConnected] = useState(false); // État local pour simuler la connexion
  const [device, setDevice] = useState(null);

  const handleConnectDevice = () => {
    Alert.alert(
      i18n.t("deviceConnectedAlertTitle"),
      i18n.t("deviceConnectedAlertMessage")
    );
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
      i18n.t("forgetDeviceAlertTitle"),
      i18n.t("forgetDeviceAlertMessage"),
      [
        { text: i18n.t("forgetDeviceCancel"), style: "cancel" },
        {
          text: i18n.t("forgetDeviceConfirm"),
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
      <Text style={styles.title}>{i18n.t("devicesPageTitle")}</Text>
      {!isDeviceConnected ? (
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleConnectDevice}
        >
          <Text style={styles.addButtonText}>{i18n.t("addDeviceButton")}</Text>
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.deviceRow}>
            <Text style={styles.deviceName}>{device.name}</Text>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() =>
                Alert.alert(
                  i18n.t("deviceInfoTitle"),
                  `Model Name: ${device.model}\nModel N°: ${device.modelNumber}\nSerial N°: ${device.serialNumber}\nVersion: ${device.version}`,
                  [
                    {
                      text: i18n.t("currentLocation"),
                      onPress: () => router.push("/GeolocationPage"),
                    },
                    {
                      text: i18n.t("forgetDeviceButton"),
                      style: "destructive",
                      onPress: handleForgetDevice,
                    },
                    { text: i18n.t("close"), style: "cancel" },
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
