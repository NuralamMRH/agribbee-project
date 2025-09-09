import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { Table, TableWrapper, Row } from "react-native-table-component";

const DataTableComponent = ({
  data,
  headers,
  subHeaders = [],
  widthArr,
  onRowPress,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <View>
          {/* Main Header */}
          <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
            <Row
              data={headers}
              widthArr={widthArr}
              style={styles.header}
              textStyle={styles.headerText}
            />
          </Table>

          {/* Sub Header (Optional) */}
          {subHeaders.length > 0 && (
            <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
              <Row
                data={subHeaders}
                widthArr={widthArr}
                style={styles.subHeader}
                textStyle={styles.subHeaderText}
              />
            </Table>
          )}

          {/* Data Rows */}
          <View style={styles.dataWrapper}>
            <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
              {data.map((rowData, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => onRowPress(rowData)}
                >
                  <Row
                    data={rowData}
                    widthArr={widthArr}
                    style={styles.row}
                    textStyle={styles.text}
                  />
                </TouchableOpacity>
              ))}
            </Table>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  header: {
    height: 70,
    backgroundColor: "#180a94",
  },
  headerText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 12,
  },
  subHeader: {
    height: 35,
    backgroundColor: "#180a94",
  },
  subHeaderText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
  },
  dataWrapper: { marginTop: -1 },
  row: {
    height: 50,
    backgroundColor: "#eee",
    borderBottomWidth: 0.4,
  },
  alternateRow: {
    backgroundColor: "#eee",
    borderBottomWidth: 0.4,
  },
  text: {
    textAlign: "center",
    color: "#000",
    fontWeight: "400",
    fontSize: 11,
  },
});

export default DataTableComponent;
