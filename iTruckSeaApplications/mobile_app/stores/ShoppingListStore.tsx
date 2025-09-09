import { useCallback } from "react";
import { randomUUID } from "expo-crypto";
import { useRemoteRowId } from "tinybase/ui-react";
import * as UiReact from "tinybase/ui-react/with-schemas";
import {
  Cell,
  createMergeableStore,
  createRelationships,
  Value,
} from "tinybase/with-schemas";
import { useUserIdAndNickname } from "@/hooks/useNickname";
import { useCreateClientPersisterAndStart } from "@/stores/persistence/useCreateClientPersisterAndStart";
import { useCreateServerSynchronizerAndStart } from "./synchronization/useCreateServerSynchronizerAndStart";

const STORE_ID_PREFIX = "shoppingListStore-";

const VALUES_SCHEMA = {
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
} as const;

const TABLES_SCHEMA = {
  products: {
    id: { type: "string" },
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
type ShoppingListValueId = keyof typeof VALUES_SCHEMA;
type ShoppingListProductCellId = keyof (typeof TABLES_SCHEMA)["products"];

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

const useStoreId = (listId: string) => STORE_ID_PREFIX + listId;
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
// Returns a callback that adds a new product to the shopping list.
export const useAddShoppingListProductCallback = (listId: string) => {
  const store = useStore(useStoreId(listId));
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
      const id = generateTripId(boatType, portId, vesselId);
      const tripId = generateTripId(boatType, portId, vesselId);
      store.setRow("products", id, {
        id,
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
      return id;
    },
    [store, listId]
  );
};

// Returns a callback that deletes a product from the shopping list.
export const useDelShoppingListProductCallback = (
  listId: string,
  productId: string
) => useDelRowCallback("products", productId, useStoreId(listId));

// Returns a pair of 1) a property of the shopping list, 2) a callback that
// updates it, similar to the React useState pattern.
export const useShoppingListValue = <ValueId extends ShoppingListValueId>(
  listId: string,
  valueId: ValueId
): [
  Value<Schemas[1], ValueId>,
  (value: Value<Schemas[1], ValueId>) => void
] => [
  useValue(valueId, useStoreId(listId)),
  useSetValueCallback(
    valueId,
    (value: Value<Schemas[1], ValueId>) => value,
    [],
    useStoreId(listId)
  ),
];

// Returns the product IDs of the shopping list, sorted by the specified cell.
export const useShoppingListProductIds = (
  listId: string,
  cellId: ShoppingListProductCellId = "createdAt",
  descending?: boolean,
  offset?: number,
  limit?: number
) =>
  useSortedRowIds(
    "products",
    cellId,
    descending,
    offset,
    limit,
    useStoreId(listId)
  );

// Returns the number of products in the shopping list.
export const useShoppingListProductCount = (listId: string) =>
  useRowCount("products", useStoreId(listId));

// Returns a pair of 1) a property of a product in the shopping list, 2) a
// callback that updates it, similar to the React useState pattern.
export const useShoppingListProductCell = <
  CellId extends ShoppingListProductCellId
>(
  listId: string,
  productId: string,
  cellId: CellId
): [
  Cell<Schemas[0], "products", CellId>,
  (cell: Cell<Schemas[0], "products", CellId>) => void
] => [
  useCell("products", productId, cellId, useStoreId(listId)),
  useSetCellCallback(
    "products",
    productId,
    cellId,
    (cell: Cell<Schemas[0], "products", CellId>) => cell,
    [],
    useStoreId(listId)
  ),
];

// Returns the nickname of the person who created the product.
export const useShoppingListProductCreatedByNickname = (
  listId: string,
  productId: string
) => {
  const userId = useRemoteRowId(
    "createdByNickname",
    productId,
    useStoreId(listId)
  );
  return useCell("collaborators", userId, "nickname", useStoreId(listId));
};

// Returns the nicknames of people involved in this shopping list.
export const useShoppingListUserNicknames = (listId: string) =>
  Object.entries(useTable("collaborators", useStoreId(listId))).map(
    ([, { nickname }]) => nickname
  );

// Create, persist, and sync a store containing the shopping list and products.
export default function ShoppingListStore({
  listId,
  initialContentJson,
}: {
  listId: string;
  initialContentJson: string;
}) {
  const storeId = useStoreId(listId);
  const [userId, nickname] = useUserIdAndNickname();
  const store = useCreateMergeableStore(() =>
    createMergeableStore().setSchema(TABLES_SCHEMA, VALUES_SCHEMA)
  );
  // Persist store (with initial content if it hasn't been saved before), then
  // ensure the current user is added as a collaborator.
  useCreateClientPersisterAndStart(storeId, store, initialContentJson, () =>
    store.setRow("collaborators", userId, { nickname })
  );
  useCreateServerSynchronizerAndStart(storeId, store);
  useProvideStore(storeId, store);

  // Create relationship between products (createdBy) and collaborators tables.
  const relationships = useCreateRelationships(store, (store) =>
    createRelationships(store).setRelationshipDefinition(
      "createdByNickname",
      "products",
      "collaborators",
      "createdBy"
    )
  );
  useProvideRelationships(storeId, relationships);

  return null;
}
