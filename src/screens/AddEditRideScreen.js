import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import db from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";

const AddEditRideScreen = ({ navigation }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [allowStops, setAllowStops] = useState(false);
  const [time, setTime] = useState("");
  const [passengerLimit, setPassengerLimit] = useState("");
  const [driver, setDriver] = useState(null);
  const [price, setPrice] = useState("");

  useEffect(() => {
    const currentUser = auth().currentUser;

    if (currentUser) {
      const uid = currentUser.uid;
      const userRef = db().ref(`/users/${uid}/name`);

      userRef
        .once("value")
        .then((snapshot) => {
          const userName = snapshot.val();
          if (userName) {
            setDriver(userName);
          } else {
            console.log("User name is not set in the database.");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data: ", error);
        });
    }
  }, []);

  const addRide = async () => {
    // Validate input data and ensure a driver is set
    if (!from || !to || !time || !passengerLimit || !driver || !price) {
      Alert.alert(
        "Error",
        "Please fill out all fields and ensure you're logged in."
      );
      return;
    }

    // Add ride to Firebase Database
    const newRideRef = db().ref("/rides").push();
    try {
      await newRideRef.set({
        from,
        to,
        allowStops,
        time,
        passengerLimit,
        driver, // Add the driver's UID to the ride data
        price,
      });
      Alert.alert("Success", "Ride added successfully.");
      // Navigate to the 'Drive' screen or reset the form as needed
      navigation.navigate("GlideDriveTabs", { screen: "Drive" });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.warningText}>
        This ride has 3 books editing will cancel all
      </Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="From"
          value={from}
          onChangeText={setFrom}
        />
        <TextInput
          style={styles.input}
          placeholder="To"
          value={to}
          onChangeText={setTo}
        />

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Allow stops:</Text>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              allowStops ? styles.toggleButtonActive : null,
            ]}
            onPress={() => setAllowStops(true)}
          >
            <Text
              style={[
                styles.toggleButtonText,
                allowStops ? styles.toggleButtonTextActive : null,
              ]}
            >
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              !allowStops ? styles.toggleButtonActive : null,
            ]}
            onPress={() => setAllowStops(false)}
          >
            <Text
              style={[
                styles.toggleButtonText,
                !allowStops ? styles.toggleButtonTextActive : null,
              ]}
            >
              No
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Time"
          value={time}
          onChangeText={setTime}
        />
        <TextInput
          style={styles.input}
          placeholder="Passenger limit"
          keyboardType="numeric"
          value={passengerLimit}
          onChangeText={(text) =>
            setPassengerLimit(text.replace(/[^0-9]/g, ""))
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Price"
          keyboardType="numeric"
          value={price}
          onChangeText={(text) => setPrice(text)}
        />

        <TouchableOpacity style={styles.confirmButton} onPress={addRide}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  warningText: {
    textAlign: "center",
    marginTop: 30,
    margin: 10,
    color: "red",
  },
  form: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  toggleLabel: {
    fontSize: 16,
  },
  toggleButton: {
    backgroundColor: "#eee", // Change as needed
    padding: 10,
    borderRadius: 5,
  },
  toggleButtonActive: {
    backgroundColor: "blue",
  },
  toggleButtonTextActive: {
    // styles for when the button text is active/selected
    color: "white", // just an example, use your own color
  },
  earningsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f7f7f7", // Change as needed
    borderRadius: 5,
    marginBottom: 10,
  },
  earningsText: {
    fontSize: 16,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#21d111", // Change as needed
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  safetyTipsButton: {
    padding: 15,
    backgroundColor: "#ddd", // Change as needed
    alignItems: "center",
    marginBottom: 10,
  },
  safetyTipsText: {
    fontSize: 16,
  },
  // Add more styles as needed
});

export default AddEditRideScreen;
