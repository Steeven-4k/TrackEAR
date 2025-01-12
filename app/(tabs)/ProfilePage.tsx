import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { styles } from "./ProfilePage.style";
import i18n from "../../constants/i18n";

export default function ProfilePage() {
  const router = useRouter(); // Hook to navigate between pages

  // State variables to handle user data and UI interactions
  const [name, setName] = useState("Firstname LASTNAME");
  const [email, setEmail] = useState("your-mail@address.com");
  const [phone, setPhone] = useState("XXXXXXXXXX");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({
    name,
    email,
    phone,
    avatar,
  }); // Backup of data to restore if edits are canceled

  // States for input validation errors
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  // Validation functions for email and phone number inputs
  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhoneNumber = (phone: string): boolean => /^\d+$/.test(phone);

  // Load saved profile data from local storage
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const savedData = await AsyncStorage.getItem("profileData");
        if (savedData) {
          const { name, email, phone, avatar } = JSON.parse(savedData);
          setName(name || "Firstname LASTNAME");
          setEmail(email || "your-mail@address.com");
          setPhone(phone || "XXXXXXXXXX");
          setAvatar(avatar || null);
        }
      } catch (error) {
        console.error("Failed to load profile data", error);
      }
    };
    loadProfileData();
  }, [i18n.locale]); // Reload data when the language changes

  // Save the current profile data to local storage
  const saveProfileData = async () => {
    try {
      await AsyncStorage.setItem(
        "profileData",
        JSON.stringify({ name, email, phone, avatar })
      );
    } catch (error) {
      console.error("Failed to save profile data", error);
    }
  };

  // Handle saving changes
  const handleSave = async () => {
    let hasError = false;

    // Validate all inputs and set errors if invalid
    if (!validateEmail(email)) {
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }

    if (!validatePhoneNumber(phone)) {
      setPhoneError(true);
      hasError = true;
    } else {
      setPhoneError(false);
    }

    if (!name.trim()) {
      setNameError(true);
      hasError = true;
    } else {
      setNameError(false);
    }

    // Show error message if validation fails
    if (hasError) {
      Alert.alert(i18n.t("error"), i18n.t("allFieldsRequired"));
      return;
    }

    await saveProfileData(); // Save changes
    setOriginalData({ name, email, phone, avatar }); // Update backup
    setIsEditing(false); // Exit editing mode
    Alert.alert(i18n.t("saveChanges"), i18n.t("profileUpdated"));
  };

  // Open the image picker to select an avatar
  const pickImage = async () => {
    if (isEditing) {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert(i18n.t("permissionDenied")); // Permission error
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setAvatar(result.assets[0].uri); // Set the selected image
      }
    }
  };

  // Handle canceling changes and restoring original data
  const handleCancel = () => {
    setName(originalData.name);
    setEmail(originalData.email);
    setPhone(originalData.phone);
    setAvatar(originalData.avatar);
    // Clear error states
    setNameError(false);
    setEmailError(false);
    setPhoneError(false);
    setIsEditing(false); // Exit editing mode
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Indicateur de mode édition */}
          {isEditing && (
            <View style={styles.editIndicatorContainer}>
              <Text style={styles.editIndicator}>{i18n.t("editingMode")}</Text>
            </View>
          )}

          {/* Avatar section */}
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={
                  avatar
                    ? { uri: avatar }
                    : require("../../assets/images/avatar.png")
                }
                style={styles.avatar}
              />
            </TouchableOpacity>

            {/* Editing Icon */}
            {!isEditing && (
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() => {
                  setOriginalData({ name, email, phone, avatar });
                  setIsEditing(true);
                }}
              >
                <Text style={styles.editText}>✏️</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Name section */}
          {isEditing ? (
            <>
              <TextInput
                style={[
                  styles.name,
                  styles.editingName,
                  nameError && styles.inputError,
                ]}
                value={name}
                onChangeText={(text) => {
                  setName(text.replace(/[^a-zA-Z\s]/g, ""));
                  setNameError(false);
                }}
                placeholder={i18n.t("enterName")}
                placeholderTextColor="#888"
                maxLength={30}
              />
              {nameError && (
                <Text style={styles.errorText}>{i18n.t("nameRequired")}</Text>
              )}
            </>
          ) : (
            <Text style={styles.name}>{name}</Text>
          )}

          {/* Email Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{i18n.t("email")}</Text>
              {isEditing ? (
                <>
                  <TextInput
                    style={[
                      styles.input,
                      styles.inputValue,
                      emailError && styles.inputError,
                    ]} // Add padding and red border in case of error
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setEmailError(false);
                    }}
                    placeholder={i18n.t("enterEmail")}
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    maxLength={50}
                  />
                </>
              ) : (
                <Text
                  style={[styles.value, styles.textValue]} // Add some space between label and value
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {email}
                </Text>
              )}
            </View>
            <>
              {emailError && (
                <Text style={styles.errorText}>{i18n.t("invalidEmail")}</Text>
              )}
            </>

            {/* Phone Section */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>{i18n.t("phone")}</Text>
              {isEditing ? (
                <>
                  <TextInput
                    style={[
                      styles.input,
                      styles.inputValue,
                      phoneError && styles.inputError,
                    ]}
                    value={phone}
                    onChangeText={(text) => {
                      setPhone(text.replace(/[^0-9]/g, ""));
                      setPhoneError(false);
                    }}
                    placeholder={i18n.t("enterPhone")}
                    placeholderTextColor="#888"
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </>
              ) : (
                <Text
                  style={[styles.value, styles.textValue]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {phone}
                </Text>
              )}
            </View>
            <>
              {phoneError && (
                <Text style={styles.errorText}>{i18n.t("invalidPhone")}</Text>
              )}
            </>
          </View>

          {/* Buttons section */}
          {!isEditing && (
            <View style={styles.actionSection}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>{i18n.t("historic")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push("/SettingsPage")} // Go to Settings Page
              >
                <Text style={styles.actionText}>{i18n.t("settings")}</Text>
              </TouchableOpacity>
            </View>
          )}

          {isEditing && (
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>{i18n.t("saveChanges")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.buttonText}>{i18n.t("cancelChanges")}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
