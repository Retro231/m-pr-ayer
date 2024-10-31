import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Button,
} from "react-native";
import WheelPickerExpo from "react-native-wheel-picker-expo";

const windowWidth = Dimensions.get("window").width;

const ITEM_HEIGHT = 50; // Height of each picker item

const ManualCorrectionModal = ({ prevValue = 0, visible, onClose }: any) => {
  const [selectedMinute, setSelectedMinute] = useState(0);

  // Create an array of minutes from -60 to +60 for demonstration
  const minutes = Array.from({ length: 121 }, (_, index) => index - 60);

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Manual corrections</Text>

          {/* Scrollable picker with three visible items */}
          <WheelPickerExpo
            initialSelectedIndex={prevValue}
            items={minutes.map((name) => ({
              label: `${name} minutes`,
              value: name,
            }))}
            selectedStyle={{
              borderColor: "blue",
            }}
            onChange={({ item }) => {
              setSelectedMinute(item.value);
            }}
          />

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <Button title="CANCEL" onPress={() => onClose(null)} />
            <Button title="Done" onPress={() => onClose(selectedMinute)} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: windowWidth * 0.8,
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  pickerContainer: {
    alignItems: "center",
    paddingVertical: ITEM_HEIGHT * 1.5, // This ensures the padding for first and last items
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
  },
  deemItem: {
    opacity: 0.3, // Dim non-focused items
  },
  focusedItem: {
    opacity: 1, // Highlight the focused item
  },
  itemText: {
    fontSize: 24,
    textAlign: "center",
  },
  deemText: {
    color: "#888",
  },
  focusedText: {
    color: "#000",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 20,
  },
  buttonText: {
    color: "#6200EE",
    fontSize: 16,
  },
});

export default ManualCorrectionModal;
