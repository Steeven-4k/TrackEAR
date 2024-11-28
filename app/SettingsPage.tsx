import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

import { styles } from "./SettingsPage.style";

export default function SettingsPage() {
  const router = useRouter(); // Utilise le hook useRouter

  // States for notifications, vibration, email and phone
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [contactByEmail, setContactByEmail] = useState(true);
  const [contactByPhone, setContactByPhone] = useState(true);

  const languages = [
    { label: "Français", value: "fr", flag: "🇫🇷" },
    { label: "English", value: "en", flag: "🇬🇧" },
    { label: "Español", value: "es", flag: "🇪🇸" },
    { label: "Deutsch", value: "de", flag: "🇩🇪" },
    { label: "Italiano", value: "it", flag: "🇮🇹" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  return (
    <View style={styles.container}>
      {/* Titre */}
      <View style={styles.titleContainer}>
        <Image
          source={require("../assets/images/settings-icon.png")}
          style={styles.titleIcon}
        />
        <Text style={styles.title}>SETTINGS</Text>
      </View>

      {/* Notifications */}
      <View style={styles.settingRow}>
        <Text style={styles.label}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={(value) => setNotificationsEnabled(value)}
        />
      </View>

      {/* Vibration */}
      <View style={styles.settingRow}>
        <Text style={styles.label}>Enable Vibration</Text>
        <Switch
          value={vibrationEnabled}
          onValueChange={(value) => setVibrationEnabled(value)}
        />
      </View>

      {/* Contact Preferences */}
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Contact Preferences</Text>
        <TouchableOpacity
          style={styles.hintButton}
          onPress={() =>
            Alert.alert(
              "Contact Preferences",
              "Choose how you prefer to be contacted in case of loss: by email or phone."
            )
          }
        >
          <Text style={styles.hintText}>?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Contact by Email</Text>
        <Switch
          value={contactByEmail}
          onValueChange={(value) => setContactByEmail(value)}
        />
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Contact by Phone</Text>
        <Switch
          value={contactByPhone}
          onValueChange={(value) => setContactByPhone(value)}
        />
      </View>

      {/* Language choice */}
      <Text style={styles.sectionTitle}>Language</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedLanguage(itemValue)
          }
          style={styles.picker}
        >
          {languages.map((lang, index) => (
            <Picker.Item
              key={index}
              label={`${lang.flag} ${lang.label}`}
              value={lang.value}
            />
          ))}
        </Picker>
      </View>

      {/* Bouton de retour */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/ProfilePage")} // Navigue vers SettingsPage
      >
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}
