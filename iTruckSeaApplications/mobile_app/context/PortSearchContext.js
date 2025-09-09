import React, { useState, useEffect, createContext, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useListCreation } from "../../context/ListCreationContext";
import { useTheme } from "../../theme";

// Create Context for search results
const PortSearchContext = createContext();

export const usePortSearch = () => useContext(PortSearchContext);

export const PortSearchProvider = ({ children }) => {
  const [filteredPorts, setFilteredPorts] = useState([]);
  return (
    <PortSearchContext.Provider value={{ filteredPorts, setFilteredPorts }}>
      {children}
    </PortSearchContext.Provider>
  );
};

function PortSearch({ seaPortList }) {
  const [name, setName] = useState("");
  const [classify, setClassify] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [ward, setWard] = useState("");
  const { province } = useListCreation();
  const { setFilteredPorts } = usePortSearch();
  const { dark } = useTheme();

  useEffect(() => {
    handlePortSearch();
  }, [name, classify, district, address, ward, province]);

  const handlePortSearch = () => {
    const filtered = seaPortList.filter(
      (port) =>
        (!name || port.name.toLowerCase().includes(name.toLowerCase())) &&
        (!classify ||
          port.classify.toLowerCase().includes(classify.toLowerCase())) &&
        (!district ||
          port.district.toLowerCase().includes(district.toLowerCase())) &&
        (!address ||
          port.address.toLowerCase().includes(address.toLowerCase())) &&
        (!ward || port.ward?.toLowerCase().includes(ward.toLowerCase())) &&
        (!province ||
          port.province.toLowerCase().includes(province.toLowerCase()))
    );
    setFilteredPorts(filtered);
  };

  return (
    <View>
      <TextInput
        placeholder="Seaport Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Classify"
        value={classify}
        onChangeText={setClassify}
        style={styles.input}
      />
      <TextInput
        placeholder="District"
        value={district}
        onChangeText={setDistrict}
        style={styles.input}
      />
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      <TextInput
        placeholder="Ward"
        value={ward}
        onChangeText={setWard}
        style={styles.input}
      />
      <Button title="Search" onPress={handlePortSearch} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
