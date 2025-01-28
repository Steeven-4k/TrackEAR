import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import MapView, { Marker, Circle, Polygon } from "react-native-maps";
import * as Location from "expo-location";
import { Linking, Platform } from "react-native";
import { Magnetometer } from "expo-sensors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./GeolocationPage.style";
import i18n from "@/constants/i18n";
import { useFocusEffect } from "@react-navigation/native";

export default function GeolocationPage() {
  // Suivre la valeur stockée de aidLost et mettre à jour la position du marqueur
  useEffect(() => {
    const updateHearingAidLocation = async () => {
      const aidLost = await AsyncStorage.getItem("aidLost");

      if (aidLost === "true") {
        const storedLocation = await AsyncStorage.getItem("lastKnownLocation");
        if (storedLocation) {
          const { latitude, longitude } = JSON.parse(storedLocation);

          setHearingAids((prevHearingAids) =>
            prevHearingAids.map((aid) =>
              aid.id === 1 &&
              (aid.latitude !== latitude || aid.longitude !== longitude)
                ? { ...aid, latitude, longitude }
                : aid
            )
          );
        }
      }
    };

    const interval = setInterval(updateHearingAidLocation, 5000);

    return () => clearInterval(interval);
  }, []);

  // State for storing user's current location coordinates
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
  });

  // State to store a list of predefined hearing aid locations
  const [hearingAids, setHearingAids] = useState([
    { id: 1, latitude: 48.857, longitude: 2.3525, title: "hearingAid1" },
    { id: 2, latitude: 48.858, longitude: 2.353, title: "hearingAid2" },
  ]);

  /// State for defining the map's visible region
  const [region, setRegion] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Loading state to show a spinner while fetching data
  const [loading, setLoading] = useState(true);

  // State to track device orientation using the magnetometer
  const [heading, setHeading] = useState<number | null>(null);

  // State to store the currently selected hearing aid
  const [selectedHearingAid, setSelectedHearingAid] =
    useState<HearingAid | null>(null);

  // State to track location permission status
  const [locationPermission, setLocationPermission] = useState(false);

  // Function to save location data to AsyncStorage
  const saveLocationData = async () => {
    try {
      const data = {
        currentLocation,
        hearingAids,
      };
      await AsyncStorage.setItem("geolocationData", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save geolocation data", error);
    }
  };

  // Function to load saved location data from AsyncStorage
  const loadLocationData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("geolocationData");
      if (storedData) {
        const { currentLocation, hearingAids } = JSON.parse(storedData);
        setCurrentLocation(currentLocation);
        setHearingAids(hearingAids);
      }
    } catch (error) {
      console.error("Failed to load geolocation data", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and get the user's current location
  useEffect(() => {
    //loadLocationData();
    getCurrentLocation();
  }, []);

  // Save location data whenever currentLocation or hearingAids change
  useEffect(() => {
    saveLocationData();
  }, [currentLocation, hearingAids]);

  // Compass subscription to track device orientation
  useEffect(() => {
    const subscribeToCompass = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        Magnetometer.addListener((data) => {
          let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
          if (angle < 0) {
            angle += 360;
          }
          setHeading(angle);
        });
      }
    };

    subscribeToCompass();

    return () => {
      Magnetometer.removeAllListeners();
    };
  }, []);

  // Increase the update interval to improve accuracy
  useEffect(() => {
    Magnetometer.setUpdateInterval(100);
  }, []);

  const THRESHOLD = 2; // Threshold to update compass heading

  // Subscribes to the device's magnetometer sensor
  useEffect(() => {
    let lastAngle: number | null = null;

    // Subscribe to the Magnetometer to get real-time orientation data
    const subscription = Magnetometer.addListener((data) => {
      let { x, y } = data;

      // Calculate the angle in degrees based on magnetometer x and y values
      let angle = Math.atan2(y, x) * (180 / Math.PI);

      // Convert negative angles to positive (0 to 360 degrees)
      angle = angle < 0 ? angle + 360 : angle;

      // Update heading state only if the change exceeds a defined threshold
      if (lastAngle === null || Math.abs(lastAngle - angle) > THRESHOLD) {
        setHeading(angle);
        lastAngle = angle;
      }
    });

    // Cleanup function to remove the listener when component unmounts
    return () => subscription.remove();
  }, []);

  // Refresh the page whenever it is revisited
  useFocusEffect(
    useCallback(() => {
      console.log("GeolocationPage refreshed");
      refreshGeolocationPage();
    }, [])
  );

  // Function to retrieve the current location
  const getCurrentLocation = async () => {
    // Check if permission is already granted
    const { status } = await Location.getForegroundPermissionsAsync();

    if (status !== "granted") {
      setLocationPermission(false);
      const { status: newStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (newStatus !== "granted") {
        setLocationPermission(false);
        Alert.alert(
          i18n.t("error"),
          i18n.t("locationPermissionDenied"),
          [
            {
              text: i18n.t("openSettings"),
              onPress: () => Linking.openSettings(),
            },
          ],
          { cancelable: false }
        );
        setLoading(false);
        return;
      } else {
        setLocationPermission(true);
      }
    } else {
      setLocationPermission(true);
    }

    // Get the user's current position
    const location = await Location.getCurrentPositionAsync({});
    setCurrentLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    setLoading(false);
  };

  // Type definition for hearing aids
  type HearingAid = {
    id: number;
    latitude: number;
    longitude: number;
    title: string;
  };

  // Function to focus the map on a selected hearing aid
  const focusOnHearingAid = (aid: HearingAid) => {
    setRegion({
      latitude: aid.latitude,
      longitude: aid.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  // Function to display a selection menu for hearing aids
  const selectHearingAid = () => {
    Alert.alert(i18n.t("selectHearingAid"), i18n.t("chooseAidToCenter"), [
      ...hearingAids.map((aid) => ({
        text: i18n.t(`hearingAid${aid.id}`),

        onPress: () => focusOnHearingAid(aid),
      })),
      { text: i18n.t("cancel"), style: "cancel" },
    ]);
  };

  // Function to calculate distance between two coordinates
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): string => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2); // Distance in km
  };

  // Calculate the vision cone based on heading
  const getVisionCone = () => {
    const centerLat = currentLocation.latitude;
    const centerLon = currentLocation.longitude;
    const radius = 0.001;
    const arcAngle = 60;
    const numPoints = 60;

    const conePoints = [];

    // Add the central point
    conePoints.push({ latitude: centerLat, longitude: centerLon });

    // Checks that the heading value is available
    const compassAngle = heading || 0;

    // Calculation of arc points
    for (let i = -arcAngle / 2; i <= arcAngle / 2; i += arcAngle / numPoints) {
      const angleRad = (compassAngle + i) * (Math.PI / 180);
      const newLat = centerLat + radius * Math.cos(angleRad);
      const newLon = centerLon + radius * Math.sin(angleRad);
      conePoints.push({ latitude: newLat, longitude: newLon });
    }

    // Close the polygon
    conePoints.push({ latitude: centerLat, longitude: centerLon });

    return conePoints;
  };

  // Function to refresh the geolocation page
  const refreshGeolocationPage = async () => {
    setLoading(true);
    setSelectedHearingAid(null);
    await getCurrentLocation();
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#F00"
          style={styles.activityIndicator}
        />
      ) : !locationPermission ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {i18n.t("locationPermissionDenied")}
          </Text>
        </View>
      ) : (
        <>
          <MapView
            style={styles.map}
            region={region}
            onPress={() => {
              if (selectedHearingAid) {
                setSelectedHearingAid(null);
              }
            }}
          >
            {/* User's current location marker */}
            <Marker
              coordinate={currentLocation}
              title={i18n.t("yourLocation")}
              pinColor="blue"
              anchor={{ x: 0.5, y: 0.5 }}
              rotation={heading || 0}
              flat={true}
            />
            <Circle
              center={currentLocation}
              radius={100}
              fillColor="rgba(0, 150, 255, 0.3)"
              strokeColor="rgba(0, 150, 255, 0.5)"
            />

            {/* Hearing aid markers */}
            {hearingAids.map((device) => (
              <Marker
                key={device.id}
                coordinate={{
                  latitude: device.latitude,
                  longitude: device.longitude,
                }}
                title={`${i18n.t("hearingAid")} ${device.id}`}
                description={`${i18n.t("distance")}: ${calculateDistance(
                  currentLocation.latitude,
                  currentLocation.longitude,
                  device.latitude,
                  device.longitude
                )} km`}
                onPress={() => setSelectedHearingAid(device)}
              />
            ))}

            {/* Display visual cone for orientation */}
            <Polygon
              coordinates={getVisionCone()}
              fillColor="rgba(255,0,0,0.3)"
              strokeColor="red"
              strokeWidth={1}
            />
          </MapView>

          {/* Image bubble for selected marker */}
          {Platform.OS === "ios" && selectedHearingAid && (
            <View style={styles.imageBubble}>
              <Text style={styles.imageText}>
                {i18n.t("hearingAid")} {selectedHearingAid.id}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  const aidTitle = encodeURIComponent(
                    i18n.t("hearingAid") + ` ${selectedHearingAid?.id}`
                  );
                  const url = `maps://?q=${aidTitle}&ll=${selectedHearingAid?.latitude},${selectedHearingAid?.longitude}`;
                  Linking.openURL(url).catch((err) =>
                    console.error("Failed to open Maps", err)
                  );
                }}
              >
                <Image
                  source={require("@/assets/images/map-preview.jpg")}
                  style={styles.mapPreview}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setRegion({
                  latitude: currentLocation.latitude + 0.00001,
                  longitude: currentLocation.longitude + 0.00001,
                  latitudeDelta: region.latitudeDelta,
                  longitudeDelta: region.longitudeDelta,
                });
                setTimeout(() => {
                  setRegion({
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: region.latitudeDelta,
                    longitudeDelta: region.longitudeDelta,
                  });
                }, 100);
              }}
            >
              <Text style={styles.buttonText}>{i18n.t("centerOnMe")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={selectHearingAid}>
              <Text style={styles.buttonText}>{i18n.t("centerOnAids")}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
