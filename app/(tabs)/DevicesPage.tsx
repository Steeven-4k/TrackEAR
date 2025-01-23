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

// Initialize BLE manager
const manager = new BleManager();

const DevicesPage = () => {
  // States to manage devices and scanning status
  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

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

      console.log("Connected to device:", device.name);

      // Discover services and characteristics
      const services = await connected.services();
      services.forEach(async (service) => {
        const characteristics = await service.characteristics();
        characteristics.forEach((char) => {
          console.log("Found characteristic:" + " " + char.uuid);
        });
      });
    } catch (error) {
      console.error("Connection error:", error);
      Alert.alert(I18n.t("error"), I18n.t("connectionFailed"));
    }
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
