import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Login with either email or phone number.
 * @param {Object} credentials - Login credentials.
 * @param {string} credentials.identifier - Email or phone number.
 * @param {string} credentials.password - Password.
 */
export async function loginWithEmail({ login, password }) {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, {
      login,
      password,
    });

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Login failed. Please try again.";
    throw new Error(message);
  }
}




  
// Keep existing OTP functions
export async function sendOTP(mobile) {
  const res = await axios.post(`${BASE_URL}/users/send-otp`, { mobile });
  return res.data;
}

export async function verifyOTP(mobile, otp) {
  const res = await axios.post(`${BASE_URL}/users/verify-otp`, { mobile, otp });
  return res.data;
}
  