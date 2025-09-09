import React, { useCallback } from "react"
import { randomUUID } from "expo-crypto"
import * as UiReact from "tinybase/ui-react/with-schemas"
import { createMergeableStore, NoValuesSchema } from "tinybase/with-schemas"
import PostItemStore from "./PostItemStore"
import { useUser } from "@clerk/clerk-expo"
import { useCreateClientPersisterAndStart } from "./persistence/useCreateClientPersisterAndStart"
import { useCreateServerSynchronizerAndStart } from "./synchronization/useCreateServerSynchronizerAndStart"

const STORE_ID_PREFIX = "PortListStore-"

const TABLES_SCHEMA = {
  ports: {
    id: { type: "string" },
    name: { type: "string" },
    classify: { type: "string" },
    district: { type: "string" },
    address: { type: "string" },
    province: { type: "string" },
    ward: { type: "string" },
    createdAt: { type: "string" },
  },
  trips: {
    tripId: { type: "string" },
    portId: { type: "string" },
    vesselId: { type: "string" },
    departureDate: { type: "string" },
    arrivalDate: { type: "string" },
    status: { type: "string" },
    createdAt: { type: "string" },
  },
  shipments: {
    shipmentId: { type: "string" },
    tripId: { type: "string" },
    vesselId: { type: "string" },
    totalWeight: { type: "number" },
    status: { type: "string", default: "Pending" },
    createdBy: { type: "string" },
    createdAt: { type: "string" },
  },
  transhipments: {
    transhipmentId: { type: "string" },
    tripId: { type: "string" },
    shipmentId: { type: "string" },
    tankId: { type: "string" },
    sharedAmount: { type: "number" },
    shareTime: { type: "string" },
    shareWeight: { type: "number" },
    shipmentType: { type: "string" },
    createdAt: { type: "string" },
  },
  collaborators: {
    nickname: { type: "string" },
  },
} as const

const {
  useCreateMergeableStore,
  useDelRowCallback,
  useProvideStore,
  useRowIds,
  useStore,
  useTable,
} = UiReact as UiReact.WithSchemas<[typeof TABLES_SCHEMA, NoValuesSchema]>

const useStoreId = () => `${STORE_ID_PREFIX}${useUser().user.id}`

export const useAddPostCallback = () => {
  const store = useStore(useStoreId())

  return useCallback(
    (type: string, data: Record<string, any>) => {
      const id = generateEntityId(type)
      const content = {
        ...data,
        createdAt: new Date().toISOString(),
        [type === "trip" ? "tripId" : "shipmentId"]: id,
      }
      store.setRow("ports", id, {
        id,
        type,
        contentJson: JSON.stringify(content),
        entityType: type,
      })
      return id
    },
    [store]
  )
}

export const useCompleteShipmentListCallback = () => {
  const store = useStore(useStoreId())
  return useCallback(
    (tripId: string, transhipmentId: string) => {
      const shipmentId = generateEntityId("shipment")
      store.setRow("shipments", shipmentId, {
        shipmentId,
        tripId,
        transhipmentId,
        status: "paid",
        createdAt: new Date().toISOString(),
      })
      store.setRow("transhipments", transhipmentId, {
        status: "complete",
      })
    },
    [store]
  )
}

export const useDelPortListCallback = (id: string) =>
  useDelRowCallback("ports", id, useStoreId())

export const usePortListIds = () => useRowIds("ports", useStoreId())

export const generateEntityId = (type: string) => {
  return `${type}-${Math.random().toString(36).substr(2, 9)}`
}

export default function PostsStore() {
  const storeId = useStoreId()
  const store = useCreateMergeableStore(() =>
    createMergeableStore().setTablesSchema(TABLES_SCHEMA)
  )
  useCreateClientPersisterAndStart(storeId, store)
  useCreateServerSynchronizerAndStart(storeId, store)
  useProvideStore(storeId, store)

  return Object.entries(useTable("ports", storeId)).map(([portId, port]) => (
    <PostItemStore
      key={portId}
      postId={portId}
      initialContentJson={port.contentJson}
    />
  ))
}
