import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import axiosInstance from "@/utils/axiosInstance";

const router = useRouter();

const createDraftMutation = useMutation({
  mutationFn: async () => {
    const response = await axiosInstance.post("/draft");
    return response.data; // Expecting { productId }
  },
  onSuccess: (data) => {
    router.push(`/draft/${data.productId}`);
  },
  onError: (error) => {
    console.error("Error creating draft:", error);
  },
});