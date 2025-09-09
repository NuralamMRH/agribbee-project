import { randomUUID } from "expo-crypto";
import { useUserIdAndNickname } from "@/hooks/useNickname";
import { useRemoteRowId } from "tinybase/ui-react";
import { useCreateClientPersisterAndStart } from "@/stores/persistence/useCreateClientPersisterAndStart";
import { useCreateServerSynchronizerAndStart } from "./synchronization/useCreateServerSynchronizerAndStart";
import * as UiReact from "tinybase/ui-react/with-schemas";
import {
  Cell,
  createMergeableStore,
  createRelationships,
  Value,
} from "tinybase/with-schemas";
import { useCallback } from "react";

const STORE_ID_PREFIX = "PortListStore-";


const VALUES_SCHEMA = {
  id: { type: "string" },
  portId: { type: "string" },
  name: { type: "string" },
  address: { type: "string" },
  classify: { type: "string" },
  province: { type: "string" },
  district: { type: "string" },
  ward: { type: "string" },
  phone: { type: "string" },
  description: { type: "string" },
  isActive: { type: "boolean", default: false },
  createdAt: { type: "string" },
  updatedAt: { type: "string" },
} as const;

const TABLES_SCHEMA = {
  ports: {
    id: { type: "string" },
    portId: { type: "string" },
    name: { type: "string" },
    address: { type: "string" },
    classify: { type: "string" },
    province: { type: "string" },
    district: { type: "string" },
    ward: { type: "string" },
    contactNumber: { type: "string" },
    coordinateLocation: { type: "string" },
    averageShipSize: { type: "string" },
    dockingDepth: { type: "string" },
    stationPosition: { type: "string" },
    intelDepth: { type: "string" },
    intelDirection: { type: "string" },
    lengthOfWharf: { type: "string" },
    loadingCapacity: { type: "string" },
    description: { type: "string" },
    isActive: { type: "boolean", default: false },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
  },
  vessels: {
    vesselId: { type: "string" },
    name: { type: "string" },
    boatType: { type: "string" },
    registrationNumber: { type: "string" },
    portId: { type: "string" },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
  },
  trips: {
    tripId: { type: "string" },
    portId: { type: "string" },
    vesselId: { type: "string" },
    name: { type: "string" },
    crews: { type: "number" },
    dateOfDeparture: { type: "string" },
    boatOwner: { type: "string" },
    boatType: { type: "string" },
    fishingZone: { type: "string" },
    planDuration: { type: "string" },
    address: { type: "string" },
    province: { type: "string" },
    placeOfDeparture: { type: "string" },
    ward: { type: "string" },
    phone: { type: "string" },
    status: { type: "string", default: "Departure" },
    departureReason: { type: "string" },
    isFishingLogBook: { type: "boolean", default: false },
    isTradingLogBook: { type: "boolean", default: false },
    isExploration: { type: "boolean", default: false },
    catchWeight: { type: "string" },
    sellAvailableWeight: { type: "string", default: 0 },
    forShareWeight: { type: "string" },
    createdBy: { type: "string" },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
  },
  catchDetails: {
    catchId: { type: "string" },
    tripId: { type: "string" },
    tankId: { type: "string" },
    fishName: { type: "string" },
    catchingZone: { type: "string" },
    storedAmount: { type: "number" },
    storedTime: { type: "string" },
    catchingWeight: { type: "number" },
    createdAt: { type: "string" },
  },
  transhipments: {
    transhipmentId: { type: "string" },
    tripId: { type: "string" },
    shipmentId: { type: "string" },
    tankId: { type: "string" },
    catchedItems: [], // catchDetails array
    sharedAmount: { type: "number" },
    shareTime: { type: "string" },
    shareWeight: { type: "number" },
    shipmentType: { type: "string" },
    createdAt: { type: "string" },
    status: { type: "string", default: "pending" },
  },
  shipments: {
    shipmentId: { type: "string" },
    poId: { type: "string" },
    tripId: { type: "string" },
    vesselId: { type: "string" },
    totalWeight: { type: "number" },
    status: { type: "string", default: "Pending" },
    createdBy: { type: "string" },
    createdAt: { type: "string" },
    paymentMethod: { type: "string" },
    deliveryToPortStatus: { type: "string", default: "ongoing" },
  },
  collaborators: {
    nickname: { type: "string" },
  },
} as const;



type Schemas = [typeof TABLES_SCHEMA, typeof VALUES_SCHEMA];
type PortListValueId = keyof typeof VALUES_SCHEMA;
type PortListTripCellId = keyof (typeof TABLES_SCHEMA)["trips"];
type TripListCatchCellId = keyof (typeof TABLES_SCHEMA)["catchDetails"];
type TripListTranshipmentCellId = keyof (typeof TABLES_SCHEMA)["transhipments"];
type TripListShipmentsCellId = keyof (typeof TABLES_SCHEMA)["shipments"];

const {
  useCell,
  useCreateMergeableStore,
  useDelRowCallback,
  useProvideRelationships,
  useProvideStore,
  useRowCount,
  useSetCellCallback,
  useSetValueCallback,
  useSortedRowIds,
  useStore,
  useCreateRelationships,
  useTable,
  useValue,
} = UiReact as UiReact.WithSchemas<Schemas>;

// ID Generation Utilities
const generateTripId = (boatType: string, portId: string, vesselId: string) => {
  const date = new Date();
  const datePart = `${date.getDate().toString().padStart(2, "0")}${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${date.getFullYear().toString().slice(-2)}`;
  return `${boatType}${portId}${vesselId}${datePart}-${randomUUID().slice(
    0,
    4
  )}`;
};

const generatePOId = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `SH-${date}-${randomUUID().slice(0, 4)}`;
};

const useStoreId = (listId: string) => STORE_ID_PREFIX + listId;

export const useAddPortListTripCallback = (portId: string) => {
  const store = useStore(useStoreId(portId));
  const [userId] = useUserIdAndNickname();
  return useCallback(
    (
      vesselId: string,
      name: string,
      crews: number,
      dateOfDeparture: string,
      boatOwner: string,
      boatType: string,
      portId: string,
      fishingZone: string,
      planDuration: string,
      address: string,
      province: string,
      placeOfDeparture: string,
      ward: string,
      phone: string,
      status: string,
      departureReason: string,
      isFishingLogBook: boolean,
      isTradingLogBook: boolean,
      isExploration: boolean,
      catchWeight: string,
      sellAvailableWeight: string,
      forShareWeight: string
    ) => {
      const tripId = generateTripId(boatType, portId, vesselId);
      store.setRow("trips", tripId, {
        tripId,
        name,
        crews,
        dateOfDeparture,
        boatOwner,
        boatType,
        portId,
        fishingZone,
        planDuration,
        address,
        province,
        placeOfDeparture,
        ward,
        phone,
        status,
        departureReason,
        isFishingLogBook,
        isTradingLogBook,
        isExploration,
        catchWeight,
        sellAvailableWeight,
        forShareWeight,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return tripId;
    },
    [store, portId]
  );
};

export const useDelPortListTripCallback = (portId: string, tripId: string) =>
  useDelRowCallback("trips", portId, useStoreId(portId));

export const usePortListValue = <ValueId extends PortListValueId>(
  portId: string,
  valueId: ValueId
): [
  Value<Schemas[1], ValueId>,
  (value: Value<Schemas[1], ValueId>) => void
] => [
  useValue(valueId, useStoreId(portId)),
  useSetValueCallback(
    valueId,
    (value: Value<Schemas[1], ValueId>) => value,
    [],
    useStoreId(portId)
  ),
];

export const usePortListTripIds = (
  portId: string,
  cellId: PortListTripCellId = "createdAt",
  descending?: boolean,
  offset?: number,
  limit?: number
) =>
  useSortedRowIds(
    "trips",
    cellId,
    descending,
    offset,
    limit,
    useStoreId(portId)
  );

export const usePortListTripCount = (portId: string) =>
  useRowCount("trips", useStoreId(portId));

export const usePortListTripCell = <CellId extends PortListTripCellId>(
  portId: string,
  tripId: string,
  cellId: CellId
): [
  Cell<Schemas[0], "trips", CellId>,
  (cell: Cell<Schemas[0], "trips", CellId>) => void
] => [
  useCell("trips", tripId, cellId, useStoreId(portId)),
  useSetCellCallback(
    "trips",
    tripId,
    cellId,
    (cell: Cell<Schemas[0], "trips", CellId>) => cell,
    [],
    useStoreId(portId)
  ),
];

export const usePortListTripCreatedByNickname = (
  portId: string,
  tripId: string
) => {
  const userId = useRemoteRowId(
    "createdByNickname",
    portId,
    useStoreId(portId)
  );
  return useCell("collaborators", userId, "nickname", useStoreId(tripId));
};

export const usePortListUserNicknames = (portId: string) =>
  Object.entries(useTable("collaborators", useStoreId(portId))).map(
    ([, { nickname }]) => nickname
  );

// PostItem Component
export default function PostItemStore({ postId, initialContentJson }) {
  const storeId = `${STORE_ID_PREFIX}${postId}`;
  const [userId, nickname] = useUserIdAndNickname();

  const store = useCreateMergeableStore(() =>
    createMergeableStore().setSchema(TABLES_SCHEMA, VALUES_SCHEMA)
  );

  useCreateClientPersisterAndStart(storeId, store, initialContentJson, () =>
    store.setRow("collaborators", userId, { nickname })
  );
  useCreateServerSynchronizerAndStart(storeId, store);
  useProvideStore(storeId, store);

  const relationships = createRelationships(store)
    .setRelationshipDefinition("vesselTrips", "trips", "vessels", "vesselId")
    .setRelationshipDefinition("tripShipments", "shipments", "trips", "tripId")
    .setRelationshipDefinition(
      "tripTranshipments",
      "transhipments",
      "trips",
      "tripId"
    );

  useProvideRelationships(storeId, relationships);

  return null;
}
