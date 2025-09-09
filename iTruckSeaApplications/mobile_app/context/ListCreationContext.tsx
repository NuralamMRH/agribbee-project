import React, { createContext, useContext, useState, ReactNode } from "react"

// Define the type for the context value
type ListCreationContextType = {
  selectedColor: string
  setSelectedColor: (color: string) => void
  selectSeaPort: string
  setSelectSeaPort: (port: string) => void
  province: string
  setProvince: (province: string) => void
  district: string
  setDistrict: (district: string) => void
  fishingZone: string
  setFishingZone: (zone: string) => void
  tripId: string
  setTripId: (trip: string) => void
  catchIds: string[]
  setCatchIds: (catchIds: string[]) => void
  shipmentId: string
  setShipmentId: (shipment: string) => void
  tripStatus: string
  setTripStatus: (status: string) => void
  transhipmentId: string
  setTranshipmentId: (transhipment: string) => void
  tankId: string
  setTankId: (tank: string) => void
  vesselId: string
  setVesselId: (vessel: string) => void
  shipmentStatus: string
  setShipmentStatus: (status: string) => void
  scanReport: string
  setScanReport: (scan: string) => void
}

// Create the context with a default value of undefined
const ListCreationContext = createContext<ListCreationContextType | undefined>(
  undefined
)

// Provider component to wrap the part of the app that needs access to this context
export function ListCreationProvider({ children }: { children: ReactNode }) {
  const [selectedColor, setSelectedColor] = useState("#9CCAFF")
  const [selectSeaPort, setSelectSeaPort] = useState("")
  const [province, setProvince] = useState("")
  const [district, setDistrict] = useState("")
  const [fishingZone, setFishingZone] = useState("")
  const [tripId, setTripId] = useState("")
  const [catchIds, setCatchIds] = useState<string[]>([])
  const [shipmentId, setShipmentId] = useState("")
  const [tripStatus, setTripStatus] = useState("")
  const [transhipmentId, setTranshipmentId] = useState("")
  const [tankId, setTankId] = useState("")
  const [vesselId, setVesselId] = useState("")
  const [shipmentStatus, setShipmentStatus] = useState("")
  const [scanReport, setScanReport] = useState("")

  return (
    <ListCreationContext.Provider
      value={{
        selectedColor,
        setSelectedColor,
        selectSeaPort,
        setSelectSeaPort,
        province,
        setProvince,
        district,
        setDistrict,
        fishingZone,
        setFishingZone,
        tripId,
        setTripId,
        catchIds,
        setCatchIds,
        shipmentId,
        setShipmentId,
        tripStatus,
        setTripStatus,
        transhipmentId,
        setTranshipmentId,
        tankId,
        setTankId,
        vesselId,
        setVesselId,
        shipmentStatus,
        setShipmentStatus,
        scanReport,
        setScanReport,
      }}
    >
      {children}
    </ListCreationContext.Provider>
  )
}

// Custom hook to use the ListCreationContext
export function useListCreation() {
  const context = useContext(ListCreationContext)
  if (context === undefined) {
    throw new Error(
      "useListCreation must be used within a ListCreationProvider"
    )
  }
  return context
}
