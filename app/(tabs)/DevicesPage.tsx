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
  // Définition du type des proches
  type Relative = {
    email: string;
  };

  // Définition du type de l'objet Location
  type LocationType = {
    latitude: number;
    longitude: number;
  };

  // States to manage devices and scanning status
  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [aidLost, setAidLost] = useState<boolean | null>(null);

  /* ##########################################################
   ###########    SEND AN EMAIL   ##############
   ########################################################## */

  // Fonction d'envoi d'email
  const sendEmailAlert = async (userEmail: string | null) => {
    const SENDGRID_API_KEY =
      "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";
    const SENDGRID_URL = "https://api.sendgrid.com/v3/mail/send";

    // Récupérer la langue actuelle de l'application
    const userLanguage = I18n.locale.split("-")[0];

    // Email pour l'utilisateur
    const subjectUser = I18n.t("emailSubjectUser", { locale: userLanguage });
    const bodyUser = I18n.t("emailBodyUser", { locale: userLanguage });

    // Email pour les proches
    const subjectRelatives = I18n.t("emailSubjectRelatives", {
      locale: userLanguage,
    });
    const bodyRelatives = I18n.t("emailBodyRelatives", {
      locale: userLanguage,
    });

    // Vérifier si l'utilisateur souhaite être alerté par email
    const emailAlertSetting = await AsyncStorage.getItem("contactByEmail");

    // Récupérer les proches enregistrés dans AsyncStorage
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
      console.error("❌ Erreur lors de la récupération des proches:", error);
    }

    // **Envoi de l'email aux proches (TOUJOURS envoyé, indépendamment du switch utilisateur)**
    if (relativesEmails.length > 0) {
      console.log("📩 [DEBUG] Envoi des emails aux proches :", relativesEmails);

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
            console.log(
              `✅ [DEBUG] Email envoyé avec succès au proche : ${email}`
            );
          } else {
            console.error(
              `❌ [DEBUG] Erreur lors de l'envoi de l'email au proche ${email} :`,
              await response.text()
            );
          }
        } catch (error) {
          console.error(`❌ [DEBUG] Erreur réseau (proche ${email}) :`, error);
        }
      }
    } else {
      console.log("⚠️ [DEBUG] Aucun proche renseigné, pas d'email envoyé.");
    }

    // **Envoi de l'email à l'utilisateur seulement si le switch est activé**
    if (userEmail && emailAlertSetting === "true") {
      console.log("📩 [DEBUG] Envoi de l'email à l'utilisateur :", userEmail);

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
          console.log(
            "✅ [DEBUG] Email envoyé avec succès à l'utilisateur :",
            userEmail
          );
        } else {
          console.error(
            "❌ [DEBUG] Erreur lors de l'envoi de l'email utilisateur :",
            await response.text()
          );
        }
      } catch (error) {
        console.error("❌ [DEBUG] Erreur réseau (utilisateur) :", error);
      }
    } else {
      console.log(
        "⚠️ [DEBUG] Le switch 'contact par email' est désactivé, pas d'email envoyé à l'utilisateur."
      );
    }
  };

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
  const monitorDeviceUID = async (device: Device) => {
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
  const sendNotificationWithDetails = async (location: LocationType) => {
    // Vérifie que les notifications sont activées dans les paramètres de l'application
    const notificationsSetting = await AsyncStorage.getItem(
      "notificationsEnabled"
    );
    if (notificationsSetting !== "true") {
      console.log("Notifications désactivées, envoi annulé.");
      return;
    }

    const currentTime = getCurrentTime();
    const notificationData = {
      timestamp: currentTime,
      latitude: location.latitude.toFixed(5),
      longitude: location.longitude.toFixed(5),
    };

    // Récupérer les anciennes notifications
    const storedNotifications = await AsyncStorage.getItem("notifications");
    const notificationsArray = storedNotifications
      ? JSON.parse(storedNotifications)
      : [];

    // Ajouter la nouvelle notification
    notificationsArray.unshift(notificationData);

    // Limiter l'historique à 20 notifications maximum
    if (notificationsArray.length > 20) {
      notificationsArray.pop();
    }

    // Sauvegarder dans AsyncStorage
    await AsyncStorage.setItem(
      "notifications",
      JSON.stringify(notificationsArray)
    );

    // Envoyer la notification (toujours dans la langue actuelle)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: I18n.t("aidLostNotificationTitle"),
        body: `${I18n.t("aidLostDetected")} ${currentTime} - ${I18n.t(
          "latitude"
        )}: ${notificationData.latitude}, ${I18n.t("longitude")}: ${
          notificationData.longitude
        }`,
      },
      trigger: null, // Notification immédiate
    });
  };

  // Vérifier si la prothèse est perdue et envoyer une seule notification
  useEffect(() => {
    const checkAidLost = async () => {
      // Récupération des paramètres stockés
      const notificationsSetting = await AsyncStorage.getItem(
        "notificationsEnabled"
      );
      const emailAlertSetting = await AsyncStorage.getItem("contactByEmail");
      const userEmail = await AsyncStorage.getItem("profileEmail");

      const storedValue = await AsyncStorage.getItem("aidLost"); // Valeur actuelle
      const lastState = await AsyncStorage.getItem("lastAidState"); // Dernier état enregistré
      const lastNotification = await AsyncStorage.getItem(
        "lastNotificationSent"
      );
      const lastEmailSent = await AsyncStorage.getItem("lastEmailSent");

      // Si "True" est détecté et que l'état précédent était "False", on déclenche une alerte
      if (storedValue === "true" && lastState !== "true") {
        console.log("📢 Premier True détecté, envoi des alertes...");

        const location = await Location.getCurrentPositionAsync({});
        const userLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        // Envoi d'une seule notification si elle n'a pas été envoyée
        if (!lastNotification && notificationsSetting === "true") {
          await sendNotificationWithDetails(userLocation);
          await AsyncStorage.setItem("lastNotificationSent", "true");
        }

        // Envoi d'un seul email si activé et non déjà envoyé
        if (!lastEmailSent && emailAlertSetting === "true" && userEmail) {
          await sendEmailAlert(userEmail);
          await AsyncStorage.setItem("lastEmailSent", "true");
        }
      }

      // Si "False" est détecté, on réinitialise les alertes
      if (storedValue === "false" && lastState !== "false") {
        console.log("✅ Prothèse retrouvée, réinitialisation des alertes.");
        await AsyncStorage.removeItem("lastNotificationSent");
        await AsyncStorage.removeItem("lastEmailSent");
      }

      // Mise à jour du dernier état connu
      if (storedValue !== null) {
        await AsyncStorage.setItem("lastAidState", storedValue);
      } else {
        console.warn("⚠️ [DEBUG] storedValue est null, aucun état mis à jour.");
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
            // Lecture de la caractéristique aidLost (booléen)
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
                  console.log("🔹 Valeur aidLost récupérée :", boolValue);
                  await AsyncStorage.setItem(
                    "aidLost",
                    JSON.stringify(boolValue)
                  );
                }
              }
            }

            // Lecture de la caractéristique double
            if (
              char.uuid === "12345678-1234-5678-1234-56789abcdef2" &&
              char.isReadable
            ) {
              const charValue = await char.read();
              if (charValue.value) {
                const buffer = Buffer.from(charValue.value, "base64");

                // Vérifie si le buffer a bien une taille suffisante pour un double (8 octets)
                if (buffer.length >= 8) {
                  const doubleValue = buffer.readDoubleLE(0); // Lecture correcte d'un double

                  if (doubleValue !== lastStoredDoubleValue) {
                    lastStoredDoubleValue = doubleValue;
                    console.log(
                      "🔹 Valeur de l'UID double récupérée :",
                      doubleValue
                    );
                    await AsyncStorage.setItem(
                      "doubleValue",
                      JSON.stringify(doubleValue)
                    );
                  }
                } else {
                  console.warn(
                    "⚠️ Taille du buffer insuffisante pour un double :",
                    buffer.length
                  );
                }
              }
            }
          }
        }
      } catch (error) {
        console.warn(
          "❌ Erreur lors de la lecture des caractéristiques :",
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

  // Reconnexion automatique en cas de connexion perdue avec la prothèse auditive
  useEffect(() => {
    const reconnectDevice = async () => {
      const storedDeviceId = await AsyncStorage.getItem("connectedDevice");
      if (storedDeviceId && !connectedDevice) {
        try {
          const device = await manager.connectToDevice(storedDeviceId);
          setConnectedDevice(device);
          console.log("Reconnecté à l'appareil:", device.name);
        } catch (error) {
          console.warn("Échec de la reconnexion:", error);
        }
      }
    };

    reconnectDevice();

    const subscription = connectedDevice
      ? manager.onDeviceDisconnected(connectedDevice.id, reconnectDevice)
      : null;

    return () => subscription?.remove();
  }, [connectedDevice]);

  // Mise à jour régulière de l'AsyncStorage en évitant les incohérences entre l'état stocké et l'état réel
  useEffect(() => {
    const monitorConnection = setInterval(async () => {
      if (connectedDevice) {
        const isConnected = await connectedDevice.isConnected();
        if (!isConnected) {
          setConnectedDevice(null);
          await AsyncStorage.removeItem("connectedDevice");
          console.warn("Connexion perdue. Mise à jour de l'état.");
        }
      }
    }, 5000); // Vérification toutes les 5 secondes

    return () => clearInterval(monitorConnection);
  }, [connectedDevice]);

  // Redécouverte des services et caractéristiques lors de la reconnexion de la prothèse auditive
  const discoverDeviceServices = async (device: Device) => {
    try {
      const services = await device.discoverAllServicesAndCharacteristics();
      console.log("Services découverts:", services);
    } catch (error) {
      console.error("Erreur lors de la découverte des services:", error);
    }
  };

  useEffect(() => {
    if (connectedDevice) {
      discoverDeviceServices(connectedDevice);
    }
  }, [connectedDevice]);

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
