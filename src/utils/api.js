const BASE_URL = process.env.REACT_APP_API_URL;

export const api = async (endpoint, options = {}) => {
  try {
    const token = sessionStorage.getItem("token");

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    // 🔐 Handle Unauthorized (Auto logout)
    if (res.status === 401) {
      sessionStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    const data = await res.json();

    // ❌ Handle API errors
    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;

  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};