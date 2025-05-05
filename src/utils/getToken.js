export const getToken = () => {
  try {
    const token = localStorage.getItem("token");
    return token || null;
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};
