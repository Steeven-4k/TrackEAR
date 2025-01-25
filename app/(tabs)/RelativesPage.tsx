import React, { useState, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./RelativesPage.style";
import i18n from "../../constants/i18n";

export default function RelativesPage() {
  // State to store the list of relatives
  const [relatives, setRelatives] = useState<
    {
      id: number;
      firstname: string;
      lastname: string;
      alias: string;
      email: string;
      phone: string;
    }[]
  >([]);

  type Relative = {
    id: number;
    firstname: string;
    lastname: string;
    alias: string;
    email: string;
    phone: string;
  };

  // State to control form visibility
  const [isAdding, setIsAdding] = useState(false);

  // State to hold current relative being edited or added
  const [currentRelative, setCurrentRelative] = useState<{
    id: number;
    firstname: string;
    lastname: string;
    alias: string;
    email: string;
    phone: string;
  } | null>(null);

  // State to manage form validation errors
  const [errors, setErrors] = useState({
    firstname: false,
    lastname: false,
    alias: false,
    email: false,
    phone: false,
  });

  // Email validation function
  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Phone number validation function (digits only)
  const validatePhoneNumber = (phone: string): boolean => /^\d+$/.test(phone);

  // Load relatives from AsyncStorage
  useEffect(() => {
    const loadRelativesData = async () => {
      try {
        const savedData = await AsyncStorage.getItem("relativesData");
        if (savedData) {
          setRelatives(JSON.parse(savedData));
        }
      } catch (error) {
        console.error("Failed to load relatives data", error);
      }
    };

    loadRelativesData();
  }, []);

  // Save relatives to AsyncStorage
  const saveRelativesData = async (data: Relative[]) => {
    try {
      await AsyncStorage.setItem("relativesData", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save relatives data", error);
    }
  };

  useEffect(() => {
    saveRelativesData(relatives);
  }, [relatives]);

  // Function to handle adding a new relative
  const handleAddRelative = () => {
    if (relatives.length >= 10) {
      Alert.alert(i18n.t("error"), i18n.t("limitRelatives"));
      return;
    }
    setIsAdding(true);
    setCurrentRelative({
      id: -1, // Temporary ID for a new relative
      firstname: "",
      lastname: "",
      alias: "",
      email: "",
      phone: "",
    });
  };

  // Function to handle saving a relative
  const handleSaveRelative = () => {
    if (!currentRelative) {
      return;
    }

    // Perform validation checks
    const newErrors = {
      firstname: !currentRelative.firstname,
      lastname: !currentRelative.lastname,
      alias: !currentRelative.alias,
      email: !currentRelative.email
        ? i18n.t("emailRequired")
        : !validateEmail(currentRelative.email)
        ? i18n.t("invalidEmail")
        : null,
      phone: !currentRelative.phone
        ? i18n.t("phoneRequired")
        : !validatePhoneNumber(currentRelative.phone)
        ? i18n.t("invalidPhone")
        : null,
    };

    setErrors(newErrors);

    // Show error alert if validation fails
    if (Object.values(newErrors).some((error) => error)) {
      Alert.alert(i18n.t("error"), i18n.t("allFieldsRequired"));
      return;
    }

    // Adding or updating the relative
    if (currentRelative.id === -1) {
      setRelatives((prev) => [...prev, { ...currentRelative, id: Date.now() }]);
    } else {
      // Add a new relative
      setRelatives((prev) =>
        prev.map((relative) =>
          relative.id === currentRelative.id ? currentRelative : relative
        )
      );
    }

    Alert.alert(i18n.t("success"), i18n.t("relativeSaved"));
    setIsAdding(false);
    setCurrentRelative(null);
    setErrors({
      firstname: false,
      lastname: false,
      alias: false,
      email: false,
      phone: false,
    });
  };

  // Function to edit an existing relative
  const handleEditRelative = (relative: {
    id: number;
    firstname: string;
    lastname: string;
    alias: string;
    email: string;
    phone: string;
  }) => {
    setIsAdding(true);
    setCurrentRelative(relative);
  };

  // Function to delete a relative
  const handleDeleteRelative = (id: number) => {
    Alert.alert(
      i18n.t("confirmDelete"),
      i18n.t("deleteConfirmation"),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("delete"),
          style: "destructive",
          onPress: () => {
            setRelatives((prev) =>
              prev.filter((relative) => relative.id !== id)
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Function to truncate text to avoid overflow
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "..."; // Adds "..." if the text is too long
    }
    return text;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {isAdding ? (
            <View style={styles.addContainer}>
              <Text style={styles.title}>
                {currentRelative && currentRelative.id !== -1
                  ? i18n.t("editRelative")
                  : i18n.t("addRelative")}
              </Text>
              <Text style={styles.subtitle}>
                {currentRelative && currentRelative.id !== -1
                  ? i18n.t("editRelativeSubtitle")
                  : i18n.t("addRelativeSubtitle")}
              </Text>

              {/* Firstname input */}
              <TextInput
                style={[styles.input, errors.firstname && styles.inputError]}
                placeholder={i18n.t("firstname")}
                placeholderTextColor="#888"
                value={currentRelative?.firstname || ""}
                onChangeText={(text) =>
                  setCurrentRelative((prev) => ({
                    ...prev!,
                    firstname:
                      text.charAt(0).toUpperCase() +
                      text.slice(1).toLowerCase(),
                  }))
                }
                returnKeyType="done"
                maxLength={30}
              />
              {errors.firstname && (
                <Text style={styles.errorText}>
                  {i18n.t("firstnameRequired")}
                </Text>
              )}

              {/* Lastname input */}
              <TextInput
                style={[styles.input, errors.lastname && styles.inputError]}
                placeholder={i18n.t("lastname")}
                placeholderTextColor="#888"
                value={currentRelative?.lastname || ""}
                autoCapitalize="characters"
                onChangeText={(text) =>
                  setCurrentRelative((prev) => ({ ...prev!, lastname: text }))
                }
                returnKeyType="done"
                maxLength={50}
              />
              {errors.lastname && (
                <Text style={styles.errorText}>
                  {i18n.t("lastnameRequired")}
                </Text>
              )}

              {/* Alias input */}
              <TextInput
                style={[styles.input, errors.alias && styles.inputError]}
                placeholder={i18n.t("alias")}
                placeholderTextColor="#888"
                value={currentRelative?.alias || ""}
                onChangeText={(text) =>
                  setCurrentRelative((prev) => ({ ...prev!, alias: text }))
                }
                returnKeyType="done"
                maxLength={20}
              />
              {errors.alias && (
                <Text style={styles.errorText}>{i18n.t("aliasRequired")}</Text>
              )}

              {/* Email input */}
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder={i18n.t("email")}
                placeholderTextColor="#888"
                value={currentRelative?.email || ""}
                onChangeText={(text) =>
                  setCurrentRelative((prev) => ({ ...prev!, email: text }))
                }
                keyboardType="email-address"
                returnKeyType="done"
                maxLength={50}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              {/* Phone input */}
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder={i18n.t("phone")}
                placeholderTextColor="#888"
                value={currentRelative?.phone || ""}
                onChangeText={(text) =>
                  setCurrentRelative((prev) => ({
                    ...prev!,
                    phone: text.replace(/[^0-9]/g, ""),
                  }))
                }
                maxLength={10}
                keyboardType="number-pad"
                returnKeyType="done"
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}

              {/* Save button */}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleSaveRelative}
              >
                <Text style={styles.actionText}>
                  {currentRelative?.id === -1
                    ? i18n.t("save")
                    : i18n.t("update")}
                </Text>
              </TouchableOpacity>

              {/* Cancel button */}
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => {
                  setIsAdding(false);
                  setCurrentRelative(null);
                  // Reset errors
                  setErrors({
                    firstname: false,
                    lastname: false,
                    alias: false,
                    email: false,
                    phone: false,
                  });
                }}
              >
                <Text style={styles.actionText}>{i18n.t("cancel")}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.listContainer}>
              <Text style={styles.title}>{i18n.t("relativesPageTitle")}</Text>
              <Text style={styles.subtitle}>
                {i18n.t("relativesPageSubtitle")}
              </Text>

              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddRelative}
              >
                <Text style={styles.addButtonText}>
                  {i18n.t("addRelativeButton")}
                </Text>
              </TouchableOpacity>

              {relatives.length > 0 && (
                <Text style={styles.listSubtitle}>
                  {i18n.t("listOfRelatives")}
                </Text>
              )}

              <FlatList
                data={relatives}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.relativeItem}>
                    {/* Truncate the firstname and lastname if too long */}
                    <Text style={styles.relativeName}>
                      {truncateText(item.firstname, 13)}{" "}
                      {truncateText(item.lastname, 12)}
                    </Text>
                    <View style={styles.buttonGroup}>
                      <TouchableOpacity
                        style={styles.detailButton}
                        onPress={() => handleEditRelative(item)}
                      >
                        <Text style={styles.detailText}>ℹ️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDeleteRelative(item.id)}
                      >
                        <Text style={styles.actionText}>
                          {i18n.t("delete")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
