import MainApix from "../../../api/MainApix";
export const AuthApi = {
  signUp: (formData) => {
    return MainApix.post("/api/v1/register", formData);
  },
  signIn: (formData) => {
    return MainApix.post("/api/v1/auth/login", formData);
  },
  signInEmail: (formData) => {
    return MainApix.post("/api/v1/login", formData);
  },
};
