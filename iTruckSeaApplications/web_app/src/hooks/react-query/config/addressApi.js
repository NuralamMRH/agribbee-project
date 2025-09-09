import MainApi from "../../../api/MainApix";

export const AddressApi = {
  addressList: () => MainApi.get("/api/v1/me/address/list"),
  editAddress: (formData) =>
    MainApi.put(`/api/v1/me/address/update/${formData?.id}`, formData),
  addNewAddress: (formData) => MainApi.post("/api/v1/me/address/add", formData),
  deleteAddress: (addressId) =>
    MainApi.delete(`/api/v1/me/address/delete/${addressId}`),
};
