import React, { useEffect, useState, useCallback, useRef } from "react";
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
  /* ##########################################################
   ###########    STATES & GLOBAL VARIABLES   ##############
   ########################################################## */

  // Type definition for hearing aids
  type HearingAid = {
    id: number;
    latitude: number;
    longitude: number;
    title: string;
  };

  // State for storing user's current location coordinates
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // State to store a list of predefined hearing aid locations
  const [hearingAids, setHearingAids] = useState<HearingAid[]>([]);

  /// State for defining the map's visible region
  const [region, setRegion] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Reference for the map
  const mapRef = useRef<MapView | null>(null);

  // Loading state to show a spinner while fetching data
  const [loading, setLoading] = useState(true);

  // State to track device orientation using the magnetometer
  const [heading, setHeading] = useState<number | null>(null);

  // State to store the currently selected hearing aid
  const [selectedHearingAid, setSelectedHearingAid] =
    useState<HearingAid | null>(null);

  // State to track location permission status
  const [locationPermission, setLocationPermission] = useState(false);

  // Boolean state to indicate whether a hearing aid has been marked as lost
  const [aidLost, setAidLost] = useState(false);

  // State to store the ID of the lost hearing aid
  const [lostAidId, setLostAidId] = useState<number | null>(null);

  // State to store the GPS coordinates of the last known location of the lost hearing aid
  const [lostAidPosition, setLostAidPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  /* ##########################################################
   ###############    LOCATION MANAGEMENT   #################
   ########################################################## */

  // Function to retrieve the current location
  const getCurrentLocation = async () => {
    try {
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
        }
      }
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
    } catch (error) {
      console.error("Error fetching location", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data and get the user's current location
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Update every 2s of the user’s marker
  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startLocationTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationPermission(false);
        return;
      }

      setLocationPermission(true);

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 1, // Update if moving at least 1 meter
        },
        (location) => {
          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      );
    };

    startLocationTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  // Center the map on the user
  const centerOnUser = () => {
    if (mapRef.current && currentLocation) {
      mapRef.current.animateToRegion(
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );
    }
  };

  /* ##########################################################
   ###########    HEARING AID POSITION MANAGEMENT   #########
   ########################################################## */

  // Setting of hearing aids' location, based on the user position
  useEffect(() => {
    if (currentLocation) {
      setHearingAids([
        {
          id: 1,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          title: "hearingAid1",
        },
        {
          id: 2,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          title: "hearingAid2",
        },
      ]);
    }
  }, [currentLocation]);

  // Focus the map on a selected hearing aid
  const focusOnHearingAid = (aid: HearingAid) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: aid.latitude,
          longitude: aid.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );
    }
    setSelectedHearingAid(aid);
  };

  // Display a selection menu for hearing aids
  const selectHearingAid = () => {
    Alert.alert(i18n.t("selectHearingAid"), i18n.t("chooseAidToCenter"), [
      ...hearingAids.map((aid) => ({
        text: i18n.t(`hearingAid${aid.id}`),

        onPress: () => focusOnHearingAid(aid),
      })),
      { text: i18n.t("cancel"), style: "cancel" },
    ]);
  };

  // Freeze one of the hearing aid marker/position when it is considered as lost, the other continues to follow the user's position
  useEffect(() => {
    if (!currentLocation) return;

    const updateHearingAidPosition = async () => {
      const aidLostStatus = await AsyncStorage.getItem("aidLost");
      const isAidLost = aidLostStatus === "true";
      setAidLost(isAidLost);

      let newLostPosition = lostAidPosition;

      if (isAidLost && !newLostPosition) {
        const savedPosition = await AsyncStorage.getItem("lostAidPosition");
        if (savedPosition) {
          newLostPosition = JSON.parse(savedPosition);
        } else {
          newLostPosition = {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          };
          AsyncStorage.setItem(
            "lostAidPosition",
            JSON.stringify(newLostPosition)
          );
        }
        setLostAidPosition(newLostPosition);
      }

      // Immediate update of the hearing aid position
      setHearingAids((prevHearingAids) =>
        prevHearingAids.map((aid) => ({
          ...aid,
          latitude:
            isAidLost && aid.id === 1
              ? newLostPosition?.latitude ?? currentLocation.latitude
              : currentLocation.latitude,
          longitude:
            isAidLost && aid.id === 1
              ? newLostPosition?.longitude ?? currentLocation.longitude
              : currentLocation.longitude,
        }))
      );
    };

    updateHearingAidPosition();
    const interval = setInterval(updateHearingAidPosition, 2000);
    return () => clearInterval(interval);
  }, [currentLocation, lostAidPosition, aidLost]);

  // Retrieve the last known position of the lost hearing aid & update the position in AsyncStorage
  useEffect(() => {
    const loadLostAidPosition = async () => {
      const savedPosition = await AsyncStorage.getItem("lostAidPosition");
      if (savedPosition) {
        setLostAidPosition(JSON.parse(savedPosition));
      }
    };

    if (aidLost) {
      loadLostAidPosition();
    }
  }, [aidLost]);

  // Set the hearing aid position back to the user's once it is found
  const restoreLostAid = () => {
    setAidLost(false);
    setLostAidId(null);
    setLostAidPosition(null);
    AsyncStorage.removeItem("aidLost");
    AsyncStorage.removeItem("lostAidPosition");

    setHearingAids((prevHearingAids) =>
      prevHearingAids.map((aid) => ({
        ...aid,
        latitude:
          (currentLocation?.latitude ?? 0) + (aid.id === 2 ? 0.0001 : 0),
        longitude:
          (currentLocation?.longitude ?? 0) + (aid.id === 2 ? 0.0001 : 0),
      }))
    );
  };

  // Calculate distance between two coordinates (user position & hearing aid)
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

  /* ##########################################################
   ###############    ORIENTATION & MAGNETOMETER   ##########
   ########################################################## */

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
          angle = (angle + 180) % 360;
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

  // Calculate the vision cone based on heading
  const getVisionCone = () => {
    if (!currentLocation) {
      return [{ latitude: 0, longitude: 0 }];
    }

    const centerLat = currentLocation.latitude;
    const centerLon = currentLocation.longitude;
    const radius = 0.001;
    const arcAngle = 60;
    const numPoints = 60;

    const conePoints = [];
    conePoints.push({ latitude: centerLat, longitude: centerLon });

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

  /* ##########################################################
   ###############    ASYNCSTORAGE   ##########
   ########################################################## */

  // Save location data to AsyncStorage
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

  // Save location data whenever currentLocation or hearingAids change
  useEffect(() => {
    saveLocationData();
  }, [currentLocation, hearingAids]);

  /* ##########################################################
   ###############    PAGE REFRESH   ##########
   ########################################################## */

  // Refresh the geolocation page
  const refreshGeolocationPage = async () => {
    setLoading(true);
    setSelectedHearingAid(null);
    await getCurrentLocation();
    setLoading(false);
  };

  // Refresh the page whenever it is revisited
  useFocusEffect(
    useCallback(() => {
      console.log("GeolocationPage refreshed");
      refreshGeolocationPage();
    }, [])
  );

  /* ##########################################################
   ###########    MAP & UI ELEMENTS    ######################
   ########################################################## */

  return (
    <View style={styles.container}>
      {/* Load header */}
      {loading && (
        <View style={styles.loadingHeader}>
          <ActivityIndicator size="small" color="#ffffff" />
          <Text style={styles.loadingText}>{i18n.t("loading")}</Text>
        </View>
      )}

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onPress={() => {
          if (selectedHearingAid) {
            setSelectedHearingAid(null);
          }
        }}
      >
        {/* User's current location marker */}
        {currentLocation && (
          <>
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
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
          </>
        )}

        {/* Hearing aid markers */}
        {currentLocation &&
          hearingAids.map((device) => (
            <Marker
              key={device.id}
              coordinate={{
                latitude: device.latitude,
                longitude: device.longitude,
              }}
              title={`${i18n.t("hearingAid")} ${device.id}`}
              description={
                currentLocation
                  ? `Distance: ${calculateDistance(
                      currentLocation.latitude,
                      currentLocation.longitude,
                      device.latitude,
                      device.longitude
                    )} km`
                  : "Estimation..."
              }
              pinColor={aidLost && device.id === 1 ? "green" : "red"}
              onPress={() => {
                setSelectedHearingAid(device);
              }}
            />
          ))}

        {/* Visual cone for orientation */}
        {currentLocation && getVisionCone().length > 1 && (
          <Polygon
            coordinates={getVisionCone()}
            fillColor="rgba(255,0,0,0.3)"
            strokeColor="red"
            strokeWidth={1}
          />
        )}
      </MapView>

      {aidLost && selectedHearingAid && selectedHearingAid.id === 1 && (
        <TouchableOpacity style={styles.restoreButton} onPress={restoreLostAid}>
          <Text style={styles.buttonText}>{i18n.t("foundAid")}</Text>
        </TouchableOpacity>
      )}

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
        {currentLocation && (
          <>
            <TouchableOpacity style={styles.button} onPress={centerOnUser}>
              <Text style={styles.buttonText}>{i18n.t("centerOnMe")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={selectHearingAid}>
              <Text style={styles.buttonText}>{i18n.t("centerOnAids")}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
