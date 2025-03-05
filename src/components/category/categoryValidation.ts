// validation/categoryValidation.ts
import * as Yup from "yup";

const categoryValidationSchema = Yup.object({
  categoryName: Yup.string().required("Category name is required"),
});

export default categoryValidationSchema;