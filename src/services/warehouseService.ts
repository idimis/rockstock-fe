import axios from "axios";
import { Warehouse } from "@/types/warehouse";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchWarehouses = async (attempt = 1): Promise<{ warehouses: Warehouse[] }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/warehouses`);
    return { warehouses: response.data?.data || [] };
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } }; message?: string };
    const errorMessage = error.response?.data?.message || error.message || "Unknown error";
    console.error("Error fetching warehouses:", errorMessage);

    if (errorMessage.includes("JDBC")) {
      const retryDelay = Math.min(2 ** attempt * 1000, 30000);
      console.warn(`Retrying fetchWarehouses in ${retryDelay / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      return fetchWarehouses(attempt + 1);
    } else {
      throw new Error("Failed to fetch warehouses");
    }
  }
};
