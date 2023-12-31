import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import db from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";

const DriveHistory = ({ navigation }) => {
  const [userDrives, setUserDrives] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch the current user's details
  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      const userRef = db().ref(`/users/${user.uid}/name`);
      userRef.once("value").then((snapshot) => {
        setCurrentUser(snapshot.val()); // This will contain the user's name
      });
    }
  }, []);

  // Query for rides once the current user's name is set
  useEffect(() => {
    if (currentUser) {
      const ridesRef = db().ref("/rides");
      ridesRef.once("value", (snapshot) => {
        const ridesData = snapshot.val();
        const ridesList = Object.keys(ridesData)
          .map((key) => {
            const ride = ridesData[key];
            if (ride.driver === currentUser && ride.status !== "Open") {
              return {
                id: key,
                from: ride.from, // From the ride data
                to: ride.to, // From the ride data
                time: ride.time, // From the ride data
                driver: ride.driver, // From the ride data
                rider: ride.rider, // From the ride data
                price: ride.price, // From the ride data
                allowStops: ride.allowStops, // From the ride data
                passengerLimit: ride.passengerLimit, // From the ride data
                status: ride.status, // From the ride data
                dateTimeString: ride.dateTimeString,
              };
            } else {
              return null;
            }
          })
          .filter((ride) => ride !== null); // Filter out the null entries
        setUserDrives(ridesList);
      });
    }
  }, [currentUser]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Your Drives</Text>
      <ScrollView style={styles.activityList}>
        {userDrives.map((ride) => (
          <View key={ride.id} style={styles.rideItem}>
            <View style={styles.rideDetails}>
              {/* You'll need to handle date formatting */}
              <Text style={styles.date}>
                {ride.from} - {ride.to}
              </Text>
              <Text style={styles.time}>
                Departure: {ride.timeDate} on {ride.dateTimeString}
              </Text>
              <Text style={styles.time}>Estimated Duration: {ride.time}h</Text>
              <Text style={styles.location}>
                Passenger Limit: {ride.passengerLimit}
              </Text>
              <Text style={styles.location}>
                Allow Stops: {ride.allowStops ? "Yes" : "No"}
              </Text>
              <Text style={styles.location}>Driver: {ride.driver}</Text>
              <Text style={styles.location}>Rider: {ride.rider}</Text>
              <Text style={styles.location}>Status: {ride.status}</Text>
            </View>
            <View style={styles.buttonsColumn}>
              <Text style={styles.fare}>Fare: ${ride.price}</Text>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() =>
                  navigation.navigate("ChatScreen", { rideId: ride.id })
                }
              >
                <Text style={styles.buttonText}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.startRideButton}
                onPress={() =>
                  navigation.navigate("StartRide", { rideId: ride.id })
                }
              >
                <Text style={styles.buttonText}>
                  {ride.status === "Open" ? "Start Ride" : "Ride Status"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    paddingLeft: 16,
  },
  activityList: {
    flex: 1,
  },
  rideItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 16,
  },
  rideDetails: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
  },
  time: {
    color: "#888",
    marginTop: 4,
  },
  location: {
    color: "#888",
    marginTop: 4,
  },
  fare: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginTop: 8,
    paddingRight: 16,
  },
  chatButton: {
    backgroundColor: "#17920b", // Choose a color that fits your app's design
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  chatButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },

  startRideButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 8,
    marginTop: 10,
  },

  buttonsColumn: {
    flexDirection: "column",
    alignItems: "flex-end",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DriveHistory;
