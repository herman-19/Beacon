import http from "./http-common";

const getMyProfile = async () => {
  http.defaults.headers.common["x-auth-token"] = localStorage.token;
  const res = await http.get(`/api/profiles/me`);
  return res.data;
};

const getAllProfiles = async () => {
  http.defaults.headers.common["x-auth-token"] = localStorage.token;
  const res = await http.get("/api/profiles/");
  return res.data;
};

const updateMyProfile = async (formData) => {
  http.defaults.headers.common["x-auth-token"] = localStorage.token;
  const res = await http.post("/api/profiles/", formData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

const deleteTask = async (taskId) => {
  http.defaults.headers.common["x-auth-token"] = localStorage.token;
  await http.delete(`/api/profiles/task/${taskId}`);
  return;
};

const userLogin = async (loginCredentials) => {
  http.defaults.headers.common["x-auth-token"] = localStorage.token;
  const res = await http.post("/api/auth/", loginCredentials, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

const userRegistration = async (registrationData) => {
  const res = await http.post("/api/users/", registrationData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

const getUserProfileById = async (userId) => {
  http.defaults.headers.common["x-auth-token"] = localStorage.token;
  const res = await http.get(`/api/profiles/user/${userId}`);
  return res.data;
};

export {
  getMyProfile,
  getAllProfiles,
  updateMyProfile,
  deleteTask,
  userLogin,
  userRegistration,
  getUserProfileById,
};
