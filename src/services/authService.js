import API from '../api/config/axios';

/**
 * Login with either email or phone number.
 * @param {Object} credentials - Login credentials.
 * @param {string} credentials.login - Email or phone number.
 * @param {string} credentials.password - Password.
 */
export async function loginWithEmail({ login, password }) {
  try {
    const response = await API.post('/users/login', {
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

/**
 * Send OTP to mobile number
 * @param {string} mobile - Mobile number
 * @returns {Promise} API response
 */
export async function sendOTP(mobile) {
  const res = await API.post('/users/send-otp', { mobile });
  return res.data;
}

/**
 * Verify OTP
 * @param {string} mobile - Mobile number
 * @param {string} otp - OTP code
 * @returns {Promise} API response
 */
export async function verifyOTP(mobile, otp) {
  const res = await API.post('/users/verify-otp', { mobile, otp });
  return res.data;
}
  