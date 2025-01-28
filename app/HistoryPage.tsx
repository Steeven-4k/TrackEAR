import React, { useState, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./HistoryPage.style";
import i18n from "../constants/i18n";

export default function HistoryPage() {
  const [notifications, setNotifications] = useState<string[]>([]);
  const navigation = useNavigation();

  // Load notifications from AsyncStorage
  const loadNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem("notifications");
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error("Error while loading notifications :", error);
    }
  };

  // Effect to update the dynamic title
  useEffect(() => {
    navigation.setOptions({
      title: i18n.t("historic"),
    });
  }, [i18n.locale]); // Responds to language change

  // Effect to refresh every 5 seconds
  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications(); // Reload notifications every 5 seconds
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Save notifications in AsyncStorage
  const saveNotifications = async (newNotifications: string[]) => {
    try {
      await AsyncStorage.setItem(
        "notifications",
        JSON.stringify(newNotifications)
      );
      setNotifications(newNotifications);
    } catch (error) {
      console.error("Error while saving notifications :", error);
    }
  };

  // Delete all notifications
  const clearNotifications = () => {
    Alert.alert(
      i18n.t("clearAllNotifications"),
      i18n.t("clearAllConfirmation"),
      [
        { text: i18n.t("cancel"), style: "cancel" },
        {
          text: i18n.t("delete"),
          style: "destructive",
          onPress: async () => {
            await saveNotifications([]);
          },
        },
      ]
    );
  };

  // Delete a specific notification
  const removeNotification = (index: number) => {
    Alert.alert(i18n.t("deleteNotification"), i18n.t("deleteConfirmation"), [
      { text: i18n.t("cancel"), style: "cancel" },
      {
        text: i18n.t("delete"),
        style: "destructive",
        onPress: () => {
          const updatedNotifications = notifications.filter(
            (_, i) => i !== index
          );
          saveNotifications(updatedNotifications);
        },
      },
    ]);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>{i18n.t("historyPageTitle")}</Text>
          {notifications.length === 0 ? (
            <Text style={styles.notificationText}>
              {i18n.t("noNotifications")}
            </Text>
          ) : (
            <FlatList
              data={notifications}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.notificationItem}>
                  <Text style={styles.notificationText}>
                    {`${i18n.t("aidLostDetected")} ${item.timestamp} - ${i18n.t(
                      "latitude"
                    )}: ${item.latitude}, ${i18n.t("longitude")}: ${
                      item.longitude
                    }`}
                  </Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeNotification(index)}
                  >
                    <Text style={styles.deleteButtonText}>
                      {i18n.t("deleteNotification")}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearNotifications}
          >
            <Text style={styles.clearButtonText}>
              {i18n.t("clearAllNotifications")}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
