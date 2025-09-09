import { icons } from "@/constants/map-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Modal, View, Text, Platform } from "react-native";
import MapView, { Marker, Polygon, PROVIDER_DEFAULT } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Button from "./Button";
import * as Location from "expo-location";
// import vietnamMap from '../utils/vietnam-map.json'
const directionsAPI = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;
const lightMapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#523735",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f1e6",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#000000",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#000000",
      },
    ],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#dddddd",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#fdfcf8",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#333333",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#777777",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#92998d",
      },
    ],
  },
];

const parseCoordinates = (coordinateString) => {
  const coordinatePairs = coordinateString.match(/\(([^)]+)\)/g);
  return coordinatePairs.map((pair) => {
    const [latitude, longitude] = pair
      .replace(/[()]/g, "")
      .split(",")
      .map(Number);
    return { latitude, longitude };
  });
};

export const parseGeoJSONCoordinates = (geoJSON) => {
  const coordinates = geoJSON.features[0].geometry.coordinates;
  const flattenedCoordinates = coordinates.flat(2); // Flatten the nested arrays
  return flattenedCoordinates.map(([longitude, latitude]) => ({
    latitude,
    longitude,
  }));
};

const isPointInPolygon = (point, polygon) => {
  const { latitude, longitude } = point;
  let isInside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].latitude,
      yi = polygon[i].longitude;
    const xj = polygon[j].latitude,
      yj = polygon[j].longitude;

    const intersect =
      yi > longitude !== yj > longitude &&
      latitude < ((xj - xi) * (longitude - yi)) / (yj - yi) + xi;
    if (intersect) isInside = !isInside;
  }
  return isInside;
};

// coordinates: [
//             { latitude: 20.85, longitude: 106.5 },
//             { latitude: 20.9, longitude: 107.0 },
//             { latitude: 20.7, longitude: 107.1 },
//             { latitude: 20.6, longitude: 106.6 },
//         ],

const fishingZones = [
  {
    id: "1",
    name: "Hai Phong - Quang Ninh",
    latitude: 18.523362067677,
    longitude: 107.07784431443,
    background: "#e99d9d",
    markerColor: "#e66d6d",
    coordinates: `
            (18.356606289452,111.60421150193), (17.100887627942,112.30733650193), (16.385494399074,107.73702400193), (17.142885310509,106.85811775193), (18.897966703799,105.40792243943), (19.686034418521,105.75948493943), (20.717065705797,106.77022712693), (21.577757612276,108.04464118943), (20.305473596752,108.83565681443), (19.396135788065,107.56124275193), (18.189689315264,107.91280525193), (17.436602128781,108.92354743943), (17.687983871809,109.89034431443), 
        `,
  },
  {
    id: "2",
    name: "Quan Dao Hoang Sa",
    latitude: 16.428842020532,
    longitude: 111.83319351408,
    background: "#7DDBFF",
    markerColor: "#4192B1",
    coordinates: `(13.594945559276,109.29679101171), (13.936409562411,116.67960351171), (17.740521594489,115.66886132421), (16.396246351756,107.80265038671), (15.551285516224,108.63761132421), (14.66033225312,109.20890038671),`,
  },
  {
    id: "3",
    name: "Ninh Thuan - Binh Thuan - BR. Vung Tau",
    latitude: 11.871208244382,
    longitude: 111.09834750996,
    background: "#e4b44f",
    markerColor: "#e4b45f",
    coordinates: `(13.818647638913, 109.15259653953),
            (11.976762409829, 109.10865122703),
            (10.87839009666, 107.87818247703),
            (10.662534435478, 107.26294810203),
            (9.0389388826893, 109.41626841453),
            (8.226845477498, 110.99152256986),
            (10.092311968004, 113.14484288236),
            (12.741217233509, 113.56232335111),
            (14.151619829099, 113.12287022611),`,
  },
  {
    id: "4",
    name: "Ca Mau - Kien Giang",
    latitude: 8.4545375927712,
    longitude: 107.08833774434,
    background: "#ffbea9",
    markerColor: "#ffbea2",
    coordinates: `(10.477863407236, 107.1511924818),
            (9.4390816160959, 106.1404502943),
            (8.6579160864585, 104.9099815443),
            (8.5927436419811, 104.7342002943),
            (9.157190475546, 104.9099815443),
            (9.6341024624198, 104.9099815443),
            (10.002166143502, 105.10773545055),
            (10.261725885121, 104.8660362318),
            (10.283346333422, 104.62433701305),
            (10.434647862468, 104.49250107555),
            (9.6774252120262, 103.0642784193),
            (8.6796377306601, 102.38312607555),
            (7.047241556157, 104.36066513805),
            (6.1741876035069, 106.2722862318),
            (6.3925940724564, 108.6453331068),
            (7.5267342718638, 110.4470909193),
            (8.1144753714618, 110.8425987318),
            (8.2667150139108, 110.95246201305),`,
  },
];

const Map = () => {
  // const [errorMsg, setErrorMsg] = useState(null)
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [userActivity, setUserActivity] = useState(false);
  const userLatitude = 20.7; // Example user location in Zone 1
  const userLongitude = 107.1;

  const [modalVisible, setModalVisible] = useState(false);

  async function loadMap() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setModalVisible(true);
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation.coords);
  }
  useEffect(() => {
    loadMap();
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // Generate 20 markers per zone
    const generateMarkers = fishingZones.flatMap((zone) =>
      Array.from({ length: 20 }, (_, index) => ({
        id: `${zone.id}-marker-${index + 1}`,
        latitude: zone.latitude + Math.random() * 0.3 - 0.15,
        longitude: zone.longitude + Math.random() * 0.3 - 0.15,
        title: `Boat ${index + 1}`,
        description: `${zone.name} fishing zone`,
        color: zone.markerColor,
      }))
    );
    setMarkers(generateMarkers);
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // Check if user is in any zone
    const userPoint = { latitude: userLatitude, longitude: userLongitude };
    const inAnyZone = fishingZones.some((zone) =>
      isPointInPolygon(userPoint, zone.coordinates)
    );
    setUserActivity(inAnyZone);
  }, [userLatitude, userLongitude]);

  if (!location) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // Default zoom region for 200ft/50m
  const region = {
    latitude: userLatitude,
    longitude: userLongitude,
    latitudeDelta: 100, // Approximate for 200ft/50m
    longitudeDelta: 100, // Approximate for 200ft/50m
  };

  const destinationLatitude = 9.0389388826893;
  const destinationLongitude = 109.41626841453;

  // const geoJSONCoordinates = parseGeoJSONCoordinates(vietnamMap)

  return (
    <View
      style={{
        flex: 1,
        height: "100%",
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      <MapView
        provider={PROVIDER_DEFAULT}
        style={{ flex: 1 }}
        tintColor="white"
        userInterfaceStyle="white"
        // mapType="satelliteFlyover"
        // mapType="mutedStandard"
        mapType={Platform.OS == "android" ? "satellite" : "satelliteFlyover"}
        customMapStyle={lightMapStyle}
        showsPointsOfInterest={false}
        initialRegion={region}
        showsUserLocation={true}
        zoomControlEnabled={true}
      >
        {/* Render fishing zones */}
        {fishingZones.map((zone) => (
          <Polygon
            key={zone.id}
            coordinates={
              Array.isArray(zone.coordinates)
                ? zone.coordinates
                : parseCoordinates(zone.coordinates)
            }
            fillColor={`${zone.markerColor}50`} // 80% transparency
            strokeColor={zone.markerColor}
            borderRadius={5}
          />
        ))}

        {/* Render markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={marker.description}
            icon={icons.boat}
          />
        ))}

        {/* <MapViewDirections
          origin={{
            latitude: 13.818647638913,
            longitude: 109.15259653953,
          }}
          destination={{
            latitude: destinationLatitude,
            longitude: destinationLongitude,
          }}
          apikey={directionsAPI || "ab4258babd174a148c2c058258e517e3"}
          strokeColor="#0286FF"
          strokeWidth={2}
        /> */}

        {/* <Marker
                coordinate={{
                    latitude: userLatitude,
                    longitude: userLongitude,
                }}
            /> */}

        {/* User activity indicator in Zone 1 */}
        {userActivity && (
          <Marker
            key="destination"
            coordinate={{
              latitude: userLatitude,
              longitude: userLongitude,
            }}
            title="You are in Zone 1"
            image={icons.pin}
          />
        )}
      </MapView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000000",
          }}
        >
          <View
            style={{
              backgroundColor: "#ffffff",
              padding: 5,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 5,
              }}
            >
              Location Permission Required
            </Text>
            <Text style={{ marginBottom: 4 }}>
              This app needs access to your location to show your position on
              the map.
            </Text>
            <Button
              title="Enable Location"
              onPress={async () => {
                let { status } =
                  await Location.requestForegroundPermissionsAsync();
                if (status === "granted") {
                  setModalVisible(false);
                }
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Map;
