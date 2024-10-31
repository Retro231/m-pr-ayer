import React, { useState } from "react";
import { View, TextInput, StyleSheet, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps extends TextInputProps {
  placeholder?: string;
  onSearchTextChange?: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  onSearchTextChange,
  ...props
}) => {
  const [searchText, setSearchText] = useState("");

  const handleTextChange = (text: string) => {
    setSearchText(text);
    if (onSearchTextChange) {
      onSearchTextChange(text);
    }
  };
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="gray" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder || "What do you want to read?"}
        value={searchText}
        onChangeText={handleTextChange}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    borderRadius: 15,
    padding: 10,
    margin: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "black",
  },
});

export default SearchBar;
