import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";

import { styles } from "./SettingsPage.style";
import i18n from "../constants/i18n";

export default function SettingsPage() {
  const router = useRouter(); // Router for navigation

  // States for various settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [contactByEmail, setContactByEmail] = useState(true);
  const [contactByPhone, setContactByPhone] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Available languages
  const languages = [
    { label: "Français", value: "fr", flag: "🇫🇷" },
    { label: "English", value: "en", flag: "🇬🇧" },
    { label: "Español", value: "es", flag: "🇪🇸" },
    { label: "Deutsch", value: "de", flag: "🇩🇪" },
    { label: "Italiano", value: "it", flag: "🇮🇹" },
  ];

  // Load the saved language preference
  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem("selectedLanguage");
      if (savedLanguage) {
        setSelectedLanguage(savedLanguage); // Set selected language
        i18n.locale = savedLanguage; // Update i18n locale
      }
    };
    loadLanguage();
  }, []);

  // Check notification permissions
  useEffect(() => {
    const checkNotificationPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status === "granted") {
        setNotificationsEnabled(true); // Activate if already granted
      } else {
        setNotificationsEnabled(false); // Deactivated if denied
      }
    };
    checkNotificationPermission();
  }, []);

  // Sauvegarde des choix des switch
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await AsyncStorage.multiGet([
          "notificationsEnabled",
          "vibrationEnabled",
          "contactByEmail",
          "contactByPhone",
        ]);

        setNotificationsEnabled(JSON.parse(settings[0][1]) ?? false);
        setVibrationEnabled(JSON.parse(settings[1][1]) ?? true);
        setContactByEmail(JSON.parse(settings[2][1]) ?? true);
        setContactByPhone(JSON.parse(settings[3][1]) ?? true);
      } catch (error) {
        console.error("Erreur lors du chargement des paramètres :", error);
      }
    };

    loadSettings();
  }, []);

  // Function to handle notification permission request
  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          i18n.t("permissionsDenied"),
          i18n.t("notificationPermissionDenied"),
          [
            {
              text: i18n.t("cancel"),
              style: "cancel",
            },
            {
              text: i18n.t("openSettings"),
              onPress: () => {
                if (Platform.OS === "android") {
                  Linking.openSettings();
                } else {
                  Linking.openURL("app-settings:");
                }
              },
            },
          ]
        );
        setNotificationsEnabled(false);
        await AsyncStorage.setItem(
          "notificationsEnabled",
          JSON.stringify(value)
        );
        return;
      }
      Alert.alert(
        i18n.t("enableNotifications"),
        i18n.t("notificationsActivated")
      );
    }
    setNotificationsEnabled(value);
    await AsyncStorage.setItem("notificationsEnabled", JSON.stringify(value));
  };

  const handleVibrationToggle = async (value: boolean) => {
    setVibrationEnabled(value);
    await AsyncStorage.setItem("vibrationEnabled", JSON.stringify(value));
  };

  const handleEmailToggle = async (value: boolean) => {
    setContactByEmail(value);
    await AsyncStorage.setItem("contactByEmail", JSON.stringify(value));
  };

  const handlePhoneToggle = async (value: boolean) => {
    setContactByPhone(value);
    await AsyncStorage.setItem("contactByPhone", JSON.stringify(value));
  };

  // Function to change the app's language
  const changeLanguage = async (lang: string) => {
    i18n.locale = lang; // Update i18n locale
    setSelectedLanguage(lang); // Update state
    await AsyncStorage.setItem("selectedLanguage", lang); // Persist language selection
    setModalVisible(false); // Close modal after selection
  };

  useEffect(() => {
    console.log("État actuel des paramètres:");
    console.log("Notifications:", notificationsEnabled);
    console.log("Vibration:", vibrationEnabled);
    console.log("Contact Email:", contactByEmail);
    console.log("Contact Téléphone:", contactByPhone);
  }, [notificationsEnabled, vibrationEnabled, contactByEmail, contactByPhone]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Title */}
          <View style={styles.titleContainer}>
            <Image
              source={require("../assets/images/settings-icon.png")}
              style={styles.titleIcon}
            />
            <Text style={styles.title}>{i18n.t("settingsTitle")}</Text>
          </View>

          {/* Notifications */}
          <View style={styles.settingRow}>
            <Text style={styles.label}>{i18n.t("enableNotifications")}</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
            />
          </View>

          {/* Vibration */}
          <View style={styles.settingRow}>
            <Text style={styles.label}>{i18n.t("enableVibration")}</Text>
            <Switch
              value={vibrationEnabled}
              onValueChange={handleVibrationToggle}
            />
          </View>

          {/* Contact Preferences */}
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>
              {i18n.t("contactPreferences")}
            </Text>
            <TouchableOpacity
              style={styles.hintButton}
              onPress={() =>
                Alert.alert(i18n.t("contactPreferences"), i18n.t("hintText"))
              }
            >
              <Text style={styles.hintText}>?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.label}>{i18n.t("contactByEmail")}</Text>
            <Switch value={contactByEmail} onValueChange={handleEmailToggle} />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.label}>{i18n.t("contactByPhone")}</Text>
            <Switch value={contactByPhone} onValueChange={handlePhoneToggle} />
          </View>

          {/* Language Selection */}
          <Text style={styles.sectionTitle}>{i18n.t("language")}</Text>
          <TouchableOpacity
            style={styles.languageSelector}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.languageText}>
              {languages.find((lang) => lang.value === selectedLanguage)?.flag}{" "}
              {languages.find((lang) => lang.value === selectedLanguage)?.label}
            </Text>
          </TouchableOpacity>

          {/* Modal for language selection */}
          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <SafeAreaProvider>
                <SafeAreaView style={styles.modalSafeArea}>
                  <FlatList
                    data={languages}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.languageOption}
                        onPress={() => changeLanguage(item.value)}
                      >
                        <Text style={styles.languageOptionText}>
                          {item.flag} {item.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </SafeAreaView>
              </SafeAreaProvider>
            </View>
          </Modal>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/ProfilePage")}
          >
            <Text style={styles.backButtonText}>{i18n.t("save")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
