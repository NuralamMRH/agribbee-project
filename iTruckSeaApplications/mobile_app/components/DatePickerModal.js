import React, { useState } from "react"
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native"
import DatePicker from "react-native-modern-datepicker"
import { COLORS } from "@/constants"

const DatePickerModal = ({
  open = false,
  startDate = "",
  selectedDate = "",
  onClose = () => {},
  onChangeStartDate = () => {},
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState(selectedDate)

  const handleDateChange = (date) => {
    setSelectedStartDate(date)
    onChangeStartDate(date)
  }

  return (
    <Modal visible={open} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Date</Text>
          <DatePicker
            mode="calendar"
            selected={selectedStartDate}
            onDateChange={handleDateChange}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 16,
  },
})

export default DatePickerModal
