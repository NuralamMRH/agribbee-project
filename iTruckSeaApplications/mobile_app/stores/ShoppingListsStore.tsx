import React, { useCallback } from "react";
import { randomUUID } from "expo-crypto";
import * as UiReact from "tinybase/ui-react/with-schemas";
import { createMergeableStore, NoValuesSchema } from "tinybase/with-schemas";
import { useCreateClientPersisterAndStart } from "@/stores/persistence/useCreateClientPersisterAndStart";
import { useUser } from "@clerk/clerk-expo";
import ShoppingListStore from "./ShoppingListStore";
import { useCreateServerSynchronizerAndStart } from "./synchronization/useCreateServerSynchronizerAndStart";

const STORE_ID_PREFIX = "shoppingListsStore-";

const TABLES_SCHEMA = {
  lists: {
    id: { type: "string" },
    initialContentJson: { type: "string" },
  },
} as const;

const {
  useCreateMergeableStore,
  useDelRowCallback,
  useProvideStore,
  useRowIds,
  useStore,
  useTable,
  useRow,
} = UiReact as UiReact.WithSchemas<[typeof TABLES_SCHEMA, NoValuesSchema]>;

const useStoreId = () => `${STORE_ID_PREFIX}${useUser().user.id}`;

// Returns a callback that adds a new shopping list to the store.
export const useAddShoppingListCallback = () => {
  const store = useStore(useStoreId());
  return useCallback(
    (
      name: string,
      classify: string,
      district: string,
      address: string,
      province: string,
      ward: string,
      contactNumber: string,
      coordinateLocation: string,
      averageShipSize: string,
      dockingDepth: string,
      stationPosition: string,
      intelDepth: string,
      intelDirection: string,
      lengthOfWharf: string,
      loadingCapacity: string
    ) => {
      const id = randomUUID();
      const portId = randomUUID();
      store.setRow("lists", id, {
        id,
        initialContentJson: JSON.stringify([
          {},
          {
            id,
            portId,
            name,
            classify,
            district,
            address,
            province,
            ward,
            contactNumber,
            coordinateLocation,
            averageShipSize,
            dockingDepth,
            stationPosition,
            intelDepth,
            intelDirection,
            lengthOfWharf,
            loadingCapacity,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]),
      });
      return id;
    },
    [store]
  );
};

// Returns a callback that adds an existing shopping list to the store.
export const useJoinShoppingListCallback = () => {
  const store = useStore(useStoreId());
  return useCallback(
    (listId: string) => {
      store.setRow("lists", listId, {
        id: listId,
        initialContentJson: JSON.stringify([{}, {}]),
      });
    },
    [store]
  );
};

// Returns a callback that deletes a shopping list from the store.
export const useDelShoppingListCallback = (id: string) =>
  useDelRowCallback("lists", id, useStoreId());

// Returns the IDs of all shopping lists in the store.
export const useShoppingListIds = () => useRowIds("lists", useStoreId());
export const useShoppingLists = () => useTable("lists", useStoreId());

// Create, persist, and sync a store containing the IDs of the shopping lists.
export default function ShoppingListsStore() {
  const storeId = useStoreId();
  const store = useCreateMergeableStore(() =>
    createMergeableStore().setTablesSchema(TABLES_SCHEMA)
  );
  useCreateClientPersisterAndStart(storeId, store);
  useCreateServerSynchronizerAndStart(storeId, store);
  useProvideStore(storeId, store);

  // In turn 'render' (i.e. create) all of the shopping lists themselves.
  return Object.entries(useTable("lists", storeId)).map(
    ([listId, { initialContentJson }]) => (
      <ShoppingListStore
        listId={listId}
        initialContentJson={initialContentJson}
        key={listId}
      />
    )
  );
}
