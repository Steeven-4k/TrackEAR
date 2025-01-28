import React, { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Device } from "react-native-ble-plx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BleManager } from "react-native-ble-plx";
import I18n from "../../constants/i18n";
import { styles } from "./DevicesPages.style";
import { Buffer } from "buffer";
import BackgroundTimer from "react-native-background-timer";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";

// Initialize BLE manager
const manager = new BleManager();

const DevicesPage = () => {
  // States to manage devices and scanning status
  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [aidLost, setAidLost] = useState<boolean | null>(null);

  // Ajout d'un effet pour démarrer la récupération en arrière-plan
  useEffect(() => {
    const startBackgroundTask = async () => {
      BackgroundTimer.runBackgroundTimer(async () => {
        if (connectedDevice) {
          await monitorDeviceUID(connectedDevice);
        }
      }, 5000); // Exécuter toutes les 5 secondes
    };

    startBackgroundTask();

    return () => {
      BackgroundTimer.stopBackgroundTimer();
    };
  }, [connectedDevice]);

  // Fonction pour surveiller l'UID du microcontrôleur
  const monitorDeviceUID = async (device) => {
    try {
      if (!device.isConnected) {
        console.warn("L'appareil n'est plus connecté.");
        return;
      }

      const services = await device.services();
      for (const service of services) {
        const characteristics = await service.characteristics();
        for (const char of characteristics) {
          if (
            char.uuid === "12345678-1234-5678-1234-56789abcdef1" &&
            char.isReadable
          ) {
            const charValue = await char.read();
            if (charValue.value) {
              const boolValue =
                Buffer.from(charValue.value, "base64").readUInt8(0) === 1;
              setAidLost(boolValue);
              console.log("Valeur de l'UID récupérée :", boolValue);
            }
          }
        }
      }
    } catch (error) {
      console.warn(
        "Erreur lors de la lecture de l'UID en arrière-plan :",
        error
      );
    }
  };

  useEffect(() => {
    if (!connectedDevice) {
      BackgroundTimer.stopBackgroundTimer();
    }
  }, [connectedDevice]);

  // Fonction pour obtenir l'heure actuelle formatée
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Configuration des notifications
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  let notificationSent = false; // Variable globale pour suivre l'état de la notification
  // Fonction pour envoyer une notification avec localisation et heure
  const sendNotificationWithDetails = async (location) => {
    const currentTime = getCurrentTime();
    const locationText = `Latitude: ${location.latitude.toFixed(
      5
    )}, Longitude: ${location.longitude.toFixed(5)}`;

    // Enregistrement de la localisation actuelle dans AsyncStorage
    await AsyncStorage.setItem("lastKnownLocation", JSON.stringify(location));

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Prothèse Perdue !",
        body: `Perte détectée à ${currentTime} - ${locationText}`,
      },
      trigger: null, // Notification immédiate
    });

    notificationSent = true; // Marquer la notification comme envoyée
  };

  // Vérifier si la prothèse est perdue et envoyer une seule notification
  useEffect(() => {
    const checkAidLost = async () => {
      const storedValue = await AsyncStorage.getItem("aidLost");
      const lastNotification = await AsyncStorage.getItem(
        "lastNotificationSent"
      );

      if (storedValue === "true" && !lastNotification) {
        const location = await Location.getCurrentPositionAsync({});
        const userLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        // Envoi de la notification
        await sendNotificationWithDetails(userLocation);

        // Marquer la notification comme envoyée
        await AsyncStorage.setItem("lastNotificationSent", "true");
      } else if (storedValue !== "true") {
        // Réinitialiser lorsque la prothèse est retrouvée
        await AsyncStorage.removeItem("lastNotificationSent");
      }
    };

    const interval = setInterval(checkAidLost, 5000);

    return () => clearInterval(interval);
  }, []);

  // Load stored device and request permissions for Android
  useEffect(() => {
    if (Platform.OS === "android") {
      requestAndroidPermissions();
    }
    loadStoredDevice();
    return () => {
      manager.stopDeviceScan();
    };
  }, []);

  // Request necessary Bluetooth permissions on Android
  const requestAndroidPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      if (
        granted["android.permission.BLUETOOTH_SCAN"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.BLUETOOTH_CONNECT"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.ACCESS_FINE_LOCATION"] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log("Bluetooth permissions granted");
      } else {
        Alert.alert(I18n.t("error"), I18n.t("permissionsDenied"));
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Load connected device from AsyncStorage
  const loadStoredDevice = async () => {
    try {
      const deviceId = await AsyncStorage.getItem("connectedDevice");
      if (deviceId) {
        const device = await manager.connectToDevice(deviceId);
        setConnectedDevice(device);
        Alert.alert(
          I18n.t("connected"),
          `${I18n.t("connectedTo")} ${device.name}`
        );

        // Start reading aidLost status periodically
        startAidLostMonitor(device);
      }
    } catch (error) {
      console.error("Failed to load stored device:", error);
      Alert.alert(I18n.t("error"), I18n.t("loadBluetoothError"));
    }
  };

  // Start scanning for BLE devices
  const startScan = () => {
    setDevices([]);
    setIsScanning(true);
    let foundDevices: Device[] = [];

    manager.startDeviceScan(null, null, (error, device: Device | null) => {
      if (error) {
        console.error("Scan error:", error);
        Alert.alert(I18n.t("scanError"), I18n.t("noDevicesMessage"));
        setIsScanning(false);
        return;
      }

      if (device && device.name) {
        foundDevices.push(device);
        setDevices((prevDevices) => {
          if (!prevDevices.some((d) => d.id === device.id)) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
      if (foundDevices.length === 0) {
        Alert.alert(I18n.t("noDevicesFound"), I18n.t("tryAgain"));
      }
    }, 30000);
  };

  // Function to connect to a BLE device
  const connectToDevice = async (device: Device) => {
    try {
      setIsScanning(false);
      console.log("Connecting to device:" + " " + device.name);

      const connected = await manager.connectToDevice(device.id);
      await connected.discoverAllServicesAndCharacteristics();

      setConnectedDevice(connected);
      await AsyncStorage.setItem("connectedDevice", device.id);
      Alert.alert(
        I18n.t("connected"),
        I18n.t("connectedTo") + " " + device.name
      );
      startAidLostMonitor(connected);
    } catch (error) {
      console.error("Connection error:", error);
      Alert.alert(I18n.t("error"), I18n.t("connectionFailed"));
    }
  };

  const startAidLostMonitor = (device: Device) => {
    let lastStoredValue = null; // Stocke la dernière valeur pour éviter les doublons

    const monitorInterval = setInterval(async () => {
      try {
        if (!device.isConnected) {
          console.warn("Device not connected. Stopping monitoring.");
          clearInterval(monitorInterval);
          return;
        }

        const services = await device.services();
        for (const service of services) {
          const characteristics = await service.characteristics();
          for (const char of characteristics) {
            if (
              char.uuid === "12345678-1234-5678-1234-56789abcdef1" &&
              char.isReadable
            ) {
              const charValue = await char.read();
              if (charValue.value) {
                const boolValue =
                  Buffer.from(charValue.value, "base64").readUInt8(0) === 1;

                // Vérifier si la valeur a changé avant de l'enregistrer et l'afficher
                if (boolValue !== lastStoredValue) {
                  lastStoredValue = boolValue;
                  setAidLost(boolValue);
                  await AsyncStorage.setItem(
                    "aidLost",
                    JSON.stringify(boolValue)
                  );
                }
              }
            }
          }
        }
      } catch (error) {
        console.warn(
          "Error reading aidLost characteristic or device disconnected.",
          error
        );
      }
    }, 5000);
  };

  // Function to disconnect from a BLE device
  const disconnectDevice = async () => {
    if (connectedDevice) {
      Alert.alert(
        I18n.t("forgetDeviceAlertTitle"),
        I18n.t("forgetDeviceAlertMessage"),
        [
          {
            text: I18n.t("forgetDeviceCancel"),
            style: "cancel",
          },
          {
            text: I18n.t("forgetDeviceConfirm"),
            onPress: async () => {
              try {
                await manager.cancelDeviceConnection(connectedDevice.id);
                setConnectedDevice(null);
                await AsyncStorage.removeItem("connectedDevice");
                console.log("Disconnected from device");
                Alert.alert(I18n.t("success"), I18n.t("disconnected"));
              } catch (error) {
                Alert.alert(I18n.t("error"), I18n.t("disconnectFailed"));
                console.error("Disconnection error:", error);
              }
            },
          },
        ]
      );
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>{I18n.t("devicesPageTitle")}</Text>

          {/* Scanning Button */}
          <TouchableOpacity
            style={styles.scanButton}
            onPress={startScan}
            disabled={isScanning}
          >
            <Text style={styles.scanButtonText}>
              {isScanning ? I18n.t("scanning") : I18n.t("addDeviceButton")}
            </Text>
          </TouchableOpacity>

          {isScanning && <ActivityIndicator size="large" color="#85C1E9" />}

          {/* Visible Devices */}
          <Text style={styles.sectionTitle}>{I18n.t("bluetoothDevices")}</Text>
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.deviceRow}
                onPress={() => connectToDevice(item)}
              >
                <Text style={styles.deviceName}>
                  {item.name || I18n.t("unknownDevice")}
                </Text>
                <Text style={styles.deviceId}>{item.id}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Connected Device */}
          {connectedDevice && (
            <View>
              <Text style={styles.sectionTitle}>
                {I18n.t("deviceConnectedAlertTitle")}
              </Text>
              <View style={styles.connectedDevice}>
                <Text style={styles.connectedText}>
                  {I18n.t("connectedTo")}{" "}
                  {connectedDevice?.name || I18n.t("unknownDevice")}
                </Text>
                <TouchableOpacity onPress={disconnectDevice}>
                  <Text style={styles.scanButtonText}>
                    {I18n.t("forgetDeviceButton")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default DevicesPage;
