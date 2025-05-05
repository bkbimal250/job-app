
export async function loginWithEmail(email, password) {
  const response = await fetch("http://localhost:5000/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  const data = await response.json();



  // Optional: console.log(data) to inspect the result
  return {
    name: `${data.firstname} ${data.lastname}`,
    email: data.email,
    role: data.role,
    token: data.token,
  };
}


  
  export async function sendOTP(mobile) {
    console.log("Sending OTP to:", mobile);
    return true; // Simulated success
  }
  
  export async function verifyOTP(mobile, otp) {
    if (mobile === "9876543210" && otp === "123456") {
      return {
        name: "Admin User",
        mobile,
        role: "admin",
        token: "demo-admin-token",
      };
    }
    throw new Error("Invalid OTP");
  }
  