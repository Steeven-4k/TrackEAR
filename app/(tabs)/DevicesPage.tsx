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
import I18n from "@/constants/i18n";
import { styles } from "./DevicesPages.style";
import { Buffer } from "buffer";
import BackgroundTimer from "react-native-background-timer";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";

// Initialize BLE manager
const manager = new BleManager();

const DevicesPage = () => {
  /* ##########################################################
   ###########       STATE MANAGEMENT       #################
   ########################################################## */

  // Define type for relatives
  type Relative = {
    email: string;
  };

  // Define type for location
  type LocationType = {
    latitude: number;
    longitude: number;
  };

  // State to store the list of discovered Bluetooth devices
  const [devices, setDevices] = useState<Device[]>([]);

  // State to track whether the Bluetooth scan is currently in progress
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // State to store the currently connected Bluetooth device
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  // State to track whether the hearing aid is detected as lost (true), found (false), or unknown (null)
  const [aidLost, setAidLost] = useState<boolean | null>(null);

  /* ##########################################################
   ###########      EMAIL ALERT      ################
   ########################################################## */

  // Send an email alert to the user and its saved contacts
  const sendEmailAlert = async (userEmail: string | null) => {
    const SENDGRID_API_KEY = "YOUR_API_KEY";
    const SENDGRID_URL = "https://api.sendgrid.com/v3/mail/send";

    // Retrieve the current language setting
    const userLanguage = I18n.locale.split("-")[0];

    //  Email subjects and bodies for user
    const subjectUser = I18n.t("emailSubjectUser", { locale: userLanguage });
    const bodyUser = I18n.t("emailBodyUser", { locale: userLanguage });

    //  Email subjects and bodies for relatives
    const subjectRelatives = I18n.t("emailSubjectRelatives", {
      locale: userLanguage,
    });
    const bodyRelatives = I18n.t("emailBodyRelatives", {
      locale: userLanguage,
    });

    // Check user preferences for email alerts
    const emailAlertSetting = await AsyncStorage.getItem("contactByEmail");

    // Retrieve saved relatives from AsyncStorage
    let relativesEmails: string[] = [];
    try {
      const relativesData = await AsyncStorage.getItem("relativesData");
      if (relativesData) {
        const relatives: Relative[] = JSON.parse(relativesData);
        relativesEmails = relatives
          .map((relative: Relative) => relative.email)
          .filter(Boolean);
      }
    } catch (error) {
      console.error("❌ Error retrieving relatives:", error);
    }

    // Send email to relatives
    if (relativesEmails.length > 0) {
      for (const email of relativesEmails) {
        const emailDataRelatives = {
          personalizations: [{ to: [{ email }] }],
          from: { email: "noreply.trackear@gmail.com" },
          subject: subjectRelatives,
          content: [{ type: "text/plain", value: `${bodyRelatives.trim()}` }],
        };

        try {
          const response = await fetch(SENDGRID_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${SENDGRID_API_KEY}`,
            },
            body: JSON.stringify(emailDataRelatives),
          });

          if (response.ok) {
            console.log(`✅ Email successfully sent to relative: ${email}`);
          } else {
            console.error(`❌ Email send error: ${await response.text()}`);
          }
        } catch (error) {
          console.error(`❌ Network error sending email to ${email}:`, error);
        }
      }
    }

    // Send email to user if enabled in the app settings
    if (userEmail && emailAlertSetting === "true") {
      const emailDataUser = {
        personalizations: [{ to: [{ email: userEmail }] }],
        from: { email: "noreply.trackear@gmail.com" },
        subject: subjectUser,
        content: [{ type: "text/plain", value: `${bodyUser.trim()}` }],
      };

      try {
        const response = await fetch(SENDGRID_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SENDGRID_API_KEY}`,
          },
          body: JSON.stringify(emailDataUser),
        });

        if (response.ok) {
          console.log("✅ Email successfully sent to user:", userEmail);
        } else {
          console.error(
            `❌ Error sending email to user: ${await response.text()}`
          );
        }
      } catch (error) {
        console.error("❌ Network error sending email to user:", error);
      }
    }
  };

  /* ##########################################################
   ###########     DEVICE SCAN     ###############
   ########################################################## */

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

  /* ##########################################################
   ###########     DEVICE CONNECTION     ###############
   ########################################################## */

  // Connect to a BLE device
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

  /* ##########################################################
   ###########     DEVICE DISCONNECTION     ###############
   ########################################################## */

  // Disconnect from a BLE device
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

  /* ##########################################################
   ###########     DEVICE RECONNECTION     ###############
   ########################################################## */

  // Automatic reconnection in case of lost connection with the device
  useEffect(() => {
    const reconnectDevice = async () => {
      const storedDeviceId = await AsyncStorage.getItem("connectedDevice");
      if (storedDeviceId && !connectedDevice) {
        try {
          const device = await manager.connectToDevice(storedDeviceId);
          setConnectedDevice(device);
          console.log("Reconnected to the device:", device.name);
        } catch (error) {
          console.warn("Failed reconnection:", error);
        }
      }
    };

    reconnectDevice();

    const subscription = connectedDevice
      ? manager.onDeviceDisconnected(connectedDevice.id, reconnectDevice)
      : null;

    return () => subscription?.remove();
  }, [connectedDevice]);

  /* ##########################################################
   ###########     DEVICE COMMUNICATION     ###############
   ########################################################## */

  // Effect to retrieve the UID in the background of the app
  useEffect(() => {
    const startBackgroundTask = async () => {
      BackgroundTimer.runBackgroundTimer(async () => {
        if (connectedDevice) {
          await monitorDeviceUID(connectedDevice);
        }
      }, 5000); // Every 5s
    };

    startBackgroundTask();

    return () => {
      BackgroundTimer.stopBackgroundTimer();
    };
  }, [connectedDevice]);

  // Monitor the device's UID and read its value
  const monitorDeviceUID = async (device: Device) => {
    try {
      if (!device.isConnected) {
        console.warn("The device is no longer connected.");
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
              console.log("Value of the retrieved UID:", boolValue);
            }
          }
        }
      }
    } catch (error) {
      console.warn("Error while reading UID in background:", error);
    }
  };

  // Stop the background timer when there is no connected device
  useEffect(() => {
    if (!connectedDevice) {
      BackgroundTimer.stopBackgroundTimer();
    }
  }, [connectedDevice]);

  // Check periodically if the device is lost by reading its UID
  const startAidLostMonitor = (device: Device) => {
    let lastStoredAidLost: boolean | null = null;
    let lastStoredDoubleValue: number | null = null;

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
            // Reading the aidLost characteristic (boolean)
            if (
              char.uuid === "12345678-1234-5678-1234-56789abcdef1" &&
              char.isReadable
            ) {
              const charValue = await char.read();
              if (charValue.value) {
                const boolValue =
                  Buffer.from(charValue.value, "base64").readUInt8(0) === 1;

                if (boolValue !== lastStoredAidLost) {
                  lastStoredAidLost = boolValue;
                  setAidLost(boolValue);
                  console.log("🔹 Retrieved aidLost value:", boolValue);
                  await AsyncStorage.setItem(
                    "aidLost",
                    JSON.stringify(boolValue)
                  );
                }
              }
            }

            // Reading the distance characteristic (double)
            if (
              char.uuid === "12345678-1234-5678-1234-56789abcdef2" &&
              char.isReadable
            ) {
              const charValue = await char.read();
              if (charValue.value) {
                const buffer = Buffer.from(charValue.value, "base64");

                // Check if the buffer is large enough for a double (8 bytes)
                if (buffer.length >= 8) {
                  const doubleValue = buffer.readDoubleLE(0);

                  if (doubleValue !== lastStoredDoubleValue) {
                    lastStoredDoubleValue = doubleValue;
                    console.log(
                      "🔹 Value of the double UID retrieved:",
                      doubleValue
                    );
                    await AsyncStorage.setItem(
                      "doubleValue",
                      JSON.stringify(doubleValue)
                    );
                  }
                } else {
                  console.warn(
                    "⚠️ Insufficient buffer size for a double:",
                    buffer.length
                  );
                }
              }
            }
          }
        }
      } catch (error) {
        console.warn("❌ Error while reading the data:", error);
      }
    }, 5000);
  };

  /* ##########################################################
   ###########     PERMISSIONS     ###############
   ########################################################## */

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

  /* ##########################################################
   ###########     NOTIFICATION MANAGEMENT     ###############
   ########################################################## */

  // Configure the notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  // Get the current time formatted
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Send notification with location and time
  const sendNotificationWithDetails = async (location: LocationType) => {
    // Checks that notifications are enabled in the app settings
    const notificationsSetting = await AsyncStorage.getItem(
      "notificationsEnabled"
    );
    if (notificationsSetting !== "true") {
      console.log("Notifications disabled, send cancelled.");
      return;
    }

    const currentTime = getCurrentTime();
    const notificationData = {
      timestamp: currentTime,
      latitude: location.latitude.toFixed(5),
      longitude: location.longitude.toFixed(5),
    };

    // Retrieve old notifications
    const storedNotifications = await AsyncStorage.getItem("notifications");
    const notificationsArray = storedNotifications
      ? JSON.parse(storedNotifications)
      : [];

    // Add new notification
    notificationsArray.unshift(notificationData);

    // Limit the history to 20 notifications maximum
    if (notificationsArray.length > 20) {
      notificationsArray.pop();
    }

    // Save to AsyncStorage
    await AsyncStorage.setItem(
      "notifications",
      JSON.stringify(notificationsArray)
    );

    // Send notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: I18n.t("aidLostNotificationTitle"),
        body: `${I18n.t("aidLostDetected")} ${currentTime} - ${I18n.t(
          "latitude"
        )}: ${notificationData.latitude}, ${I18n.t("longitude")}: ${
          notificationData.longitude
        }`,
      },
      trigger: null, // Immediate notification
    });
  };

  // Check if the hearing aid is lost and send a notification
  useEffect(() => {
    const checkAidLost = async () => {
      // Retrieving stored settings in AsyncStorage
      const notificationsSetting = await AsyncStorage.getItem(
        "notificationsEnabled"
      );
      const emailAlertSetting = await AsyncStorage.getItem("contactByEmail");
      const userEmail = await AsyncStorage.getItem("profileEmail");

      const storedValue = await AsyncStorage.getItem("aidLost"); // Current value
      const lastState = await AsyncStorage.getItem("lastAidState"); // Last saved state
      const lastNotification = await AsyncStorage.getItem(
        "lastNotificationSent"
      );
      const lastEmailSent = await AsyncStorage.getItem("lastEmailSent");

      // If "True" is detected and the previous state was "False", an alert is triggered
      if (storedValue === "true" && lastState !== "true") {
        console.log("📢 First 'True' detected, sending alerts...");

        const location = await Location.getCurrentPositionAsync({});
        const userLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        // Sending a single notification if not sent yet
        if (!lastNotification && notificationsSetting === "true") {
          await sendNotificationWithDetails(userLocation);
          await AsyncStorage.setItem("lastNotificationSent", "true");
        }

        // Sending a single email if enabled in settings and not already sent
        if (!lastEmailSent && emailAlertSetting === "true" && userEmail) {
          await sendEmailAlert(userEmail);
          await AsyncStorage.setItem("lastEmailSent", "true");
        }
      }

      // If "False" is detected, the alerts are reset
      if (storedValue === "false" && lastState !== "false") {
        console.log("✅ Hearing aid found, reset alerts.");
        await AsyncStorage.removeItem("lastNotificationSent");
        await AsyncStorage.removeItem("lastEmailSent");
      }

      // Update of the last known status
      if (storedValue !== null) {
        await AsyncStorage.setItem("lastAidState", storedValue);
      }
    };

    const interval = setInterval(checkAidLost, 5000);
    return () => clearInterval(interval);
  }, []);

  /* ##########################################################
   ###########     ASYNCSTORAGE     ###############
   ########################################################## */

  // Load the last connected Bluetooth device from AsyncStorage and attempts to reconnect
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

  // Request necessary Bluetooth permissions & loads the previously connected device from AsyncStorage
  useEffect(() => {
    if (Platform.OS === "android") {
      requestAndroidPermissions();
    }
    loadStoredDevice(); // Attempt to reconnect to the last connected device
    return () => {
      manager.stopDeviceScan(); // Stop any ongoing Bluetooth scans
    };
  }, []);

  // Regular update of AsyncStorage avoiding differences between the stored state and the real state
  useEffect(() => {
    const monitorConnection = setInterval(async () => {
      if (connectedDevice) {
        const isConnected = await connectedDevice.isConnected();
        if (!isConnected) {
          setConnectedDevice(null);
          await AsyncStorage.removeItem("connectedDevice");
          console.warn("Connection lost. Status updated.");
        }
      }
    }, 5000); // Every 5s

    return () => clearInterval(monitorConnection);
  }, [connectedDevice]);

  // Discover all services and characteristics of the connected Bluetooth device
  const discoverDeviceServices = async (device: Device) => {
    try {
      const services = await device.discoverAllServicesAndCharacteristics();
      console.log("Discovered services:", services);
    } catch (error) {
      console.error("Error during service discovery:", error);
    }
  };

  // Discover automatically the available services and characteristics of the connected device
  useEffect(() => {
    if (connectedDevice) {
      discoverDeviceServices(connectedDevice);
    }
  }, [connectedDevice]);

  /* ##########################################################
   ###########       UI RENDERING       ##############
   ########################################################## */

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
