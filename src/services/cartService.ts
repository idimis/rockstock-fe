import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchCartItems = async (accessToken: string | null) => {
    if (!accessToken) throw new Error("Unauthorized: No token provided");
  
    try {
      const response = await axios.get(`${API_BASE_URL}/carts/active/products`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      // If response contains "Item not found" or data is null, return an empty array
      if (!response.data.success || response.data.data === null) {
        return [];
      }
  
      return response.data.data;
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return []; // Return an empty array to prevent the component from breaking
    }
  };
  

export const increaseCartItemQuantity = async (productId: number, accessToken: string | null) => {
  if (!accessToken) throw new Error("Unauthorized: No token provided");

  await axios.put(`${API_BASE_URL}/carts/add`, {}, {
    params: { productId },
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  window.dispatchEvent(new Event("storage"));
};

export const decreaseCartItemQuantity = async (productId: number, currentQuantity: number, accessToken: string | null) => {
  if (currentQuantity === 1 || !accessToken) return;

  await axios.put(`${API_BASE_URL}/carts/subtract`, {}, {
    params: { productId },
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  window.dispatchEvent(new Event("storage"));
};

export const removeCartItem = async (cartItemId: number, accessToken: string | null) => {
  if (!accessToken) throw new Error("Unauthorized: No token provided");

  await axios.delete(`${API_BASE_URL}/carts/remove`, {
    params: { cartItemId },
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  window.dispatchEvent(new Event("storage"));
};
