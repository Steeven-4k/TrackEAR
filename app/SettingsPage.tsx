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
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { styles } from "./SettingsPage.style";
import i18n from "../constants/i18n";

export default function SettingsPage() {
  const router = useRouter(); // Router for navigation

  // States for various settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
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

  // Function to change the app's language
  const changeLanguage = async (lang: string) => {
    i18n.locale = lang; // Update i18n locale
    setSelectedLanguage(lang); // Update state
    await AsyncStorage.setItem("selectedLanguage", lang); // Persist language selection
    setModalVisible(false); // Close modal after selection
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Titre */}
          <View style={styles.titleContainer}>
            <Image
              source={require("../assets/images/settings-icon.png")}
              style={styles.titleIcon}
            />
            <Text style={styles.title}>{i18n.t("settings")}</Text>
          </View>

          {/* Notifications */}
          <View style={styles.settingRow}>
            <Text style={styles.label}>{i18n.t("enableNotifications")}</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={(value) => setNotificationsEnabled(value)}
            />
          </View>

          {/* Vibration */}
          <View style={styles.settingRow}>
            <Text style={styles.label}>{i18n.t("enableVibration")}</Text>
            <Switch
              value={vibrationEnabled}
              onValueChange={(value) => setVibrationEnabled(value)}
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
            <Switch
              value={contactByEmail}
              onValueChange={(value) => setContactByEmail(value)}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.label}>{i18n.t("contactByPhone")}</Text>
            <Switch
              value={contactByPhone}
              onValueChange={(value) => setContactByPhone(value)}
            />
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

          {/* Back Button */}
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
