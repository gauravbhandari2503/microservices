const axios = require("axios");

const USER_SERVICE_URL = "http://user-service:8000";

const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

module.exports = { getUserById };
