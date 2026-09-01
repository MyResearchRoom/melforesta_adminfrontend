import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import InputField from "../../../common/InputField";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../../redux/actions/categoryActions";
import { getProductsByCategory, getVarientsByProduct } from "../../../../services/productByCategory";
import { saveStock } from "../../../../services/saveStock";
import axios from "axios";
const Base_Url = import.meta.env.VITE_BASE_URL;
export default function AddStock({onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    supplierName: "",
    lowStockThreshold: 0,
    currentStockPricePerUnit: "",
    currentStock: "",
    restockQuantity: "",
    restockDate:"",
    variantId:"",
    document:[],
  });

  const [productsByCategoryList, setProductsByCategoryList] = useState([]);
  const [variantsByProduct, setVariantsByProduct] = useState([]);

  useEffect(() => {
  const fetchProducts = async () => {
    if (formData.category) {
      try {
        const products = await getProductsByCategory(formData.category);
        setProductsByCategoryList(products);
        setFormData(prev => ({ ...prev, name: "", model: "" })); 
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch products");
      }
    } else {
      setProductsByCategoryList([]);
    }
  };

  fetchProducts();
  }, [formData.category]);

  useEffect(() => {
  const fetchVarinets = async () => {
    if (formData.name) {
      try {
        const varients = await getVarientsByProduct(formData.name);
        setVariantsByProduct(varients);
        setFormData(prev => ({ ...prev, variantId: "" })); 
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch product variants");
      }
    } else {
      setVariantsByProduct([]);
    }
  };

  fetchVarinets();
  }, [formData.name]);

  const dispatch=useDispatch();
  const {categories=[],error}=useSelector((state)=>state.categoryState);

  useEffect(()=>{
    dispatch(fetchCategories());
  },[dispatch,categories.length]);

  
  useEffect(() => {
  const fetchStockData = async () => {
    if (formData.variantId) {
      try {
        const token = localStorage.getItem("token"); 
        const res = await axios.get(`${Base_Url}/api/stock/totalStock/${formData.name}/${formData.variantId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const data = res.data.data;
          setFormData((prev) => ({
            ...prev,
            currentStock: data.totalStock || 0,
            lowStockThreshold: data.lowStockThreshold || 0,
          }));
        } else {
          console.error(res.data.message || "Failed to fetch products");
        }
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to fetch products");
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        currentStock: 0,
        lowStockThreshold: 0,
      }));
    }
  };

  fetchStockData();
 }, [formData.variantId]);


  const [errors, setErrors] = useState({});

const handleChange = (e) => {
  const { name, type, files, value } = e.target;

  if (type === "file" && files && files.length > 0) {
  const newFiles = Array.from(files).map(file => ({
    name: file.name,
    url: URL.createObjectURL(file),
    file, 
   }));
  setFormData(prev => ({
    ...prev,
    [name]: [...prev[name], ...newFiles],
  }));
  } else {
    setFormData((prev) => {
      if (name === "category") {
        return { ...prev, category: value, name: "" ,variantId:""};
      }
      return { ...prev, [name]: value };
    });
  }
};

const totalPrice = 
  Number(formData.restockQuantity || 0) * Number(formData.currentStockPricePerUnit || 0);

  const validate = () => {
  const newErrors = {};
  const requiredFields = [
    "name",
    "category",
    "variantId",
    "supplierName",
    "lowStockThreshold",
    "document",
    "currentStockPricePerUnit",
    "currentStock",
    "restockQuantity",
    "restockDate",  
  ];

   requiredFields.forEach((field) => {
    const value = formData[field];
    if (value === undefined || value === null || value === "") {
      newErrors[field] = "This field is required";
    }
    });

    if (formData.document && formData.document.length > 0) {
      if (formData.document.length > 5) {
        newErrors.document = "You can upload a maximum of 5 documents only";
      }

      const imageFiles = formData.document.filter(
        (doc) =>
          doc.file && doc.file.type.startsWith("image/")
      );
      if (imageFiles.length > 0) {
        newErrors.document = "Images are not allowed. Please upload valid documents only";
      }
    }
  return newErrors;
};

 const handleSubmit = async (e) => {
  e.preventDefault();
  const formErrors = validate();
  if (Object.keys(formErrors).length > 0) {
  console.log("Validation failed:", formErrors); 
  setErrors(formErrors);
  return;
  }

      const data = new FormData();
        data.append("categoryId", formData.category);
        data.append("productId", formData.name);
        data.append("variantId", formData.variantId);
        data.append("supplierName", formData.supplierName);
        data.append("lowStockThreshold", formData.lowStockThreshold);
        data.append("restockQuantity", formData.restockQuantity);
        data.append("pricePerUnit", formData.currentStockPricePerUnit);
        data.append("restockDate", formData.restockDate);  
        formData.document.forEach((doc) => {
          if (doc.file) {
            data.append("documents", doc.file);
          }
        }); 
        const token = localStorage.getItem("token");
        try {
          await saveStock({ data, token });
          dispatch(fetchCategories()); 
          if (onSubmit) onSubmit();
        } catch (err) {
          console.error("Save Stock failed:", err);
          toast.error(`Save Stock failed: ${err.response?.data?.message || err.message || "Unknown error"}`);
        }

};


return (
<div className="flex flex-col px-4 pt-3 py-5 bg-white w-full">
<h2 className="text-xl xl:text-2xl font-bold mb-4 text-center">Add Stock</h2>
{error && <p className="text-red-500">Error from category: {error}</p>}
<form onSubmit={handleSubmit} className="space-y-6">

  <h3 className="text-base xl:text-lg font-semibold">Stock Information</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">

    <InputField
      label="Category"
      name="category"
      value={formData.category}
      onChange={handleChange}
      isSelect
      options={categories.map((item) => ({ value: item.id, label: item.name }))} 
      required
      error={errors.category}
    />

    <InputField
      label="Product Name"
      name="name"
      value={formData.name}
      onChange={handleChange}
      isSelect
      options={productsByCategoryList.map((prod) => ({
        value: prod.id,          
        label: prod.productName,   
      }))}
    />

    <InputField
      label="Product variant"
      name="variantId"
      value={formData.variantId}
      onChange={handleChange}
      isSelect
      options={variantsByProduct.map((variant) => ({
        value: variant.id,          
        label: variant.weight,   
      }))}
    />

    {/* <InputField
      label="Product Model"
      name="model"
      value={formData.model}
      onChange={handleChange}
      isSelect
      options={
        formData.name
        ? productsByCategoryList
          .filter((prod) => prod.id === Number(formData.name))
          .map((prod) => ({
            value: prod.model,   
            label: prod.model,   
          }))
        : []
      }
    /> */}


    <InputField
      label="Supplier name"
      name="supplierName"
      value={formData.supplierName}
      onChange={handleChange}
      required
      error={errors.supplierName}
    />

    <InputField
      label="Current Stock"
      name="currentStock"
      value={formData.currentStock}
      onChange={handleChange}
      readOnly
      required
      error={errors.currentStock}
    />

    <InputField
      label="Low stock threshould"
      name="lowStockThreshold"
      value={formData.lowStockThreshold}
      onChange={handleChange}
      required
      error={errors.lowStockThreshold}
    />

    <InputField
      label="Restock Quantity"
      name="restockQuantity"
      value={formData.restockQuantity}
      onChange={handleChange}
      required
      error={errors.restockQuantity}
    />

    <InputField
      label="Price per unit"
      name="currentStockPricePerUnit"
      value={formData.currentStockPricePerUnit}
      onChange={handleChange}
      required
      error={errors.currentStockPricePerUnit}
    />

    <InputField
      label="Restock Date"
      name="restockDate"
      type="date"
      value={formData.restockDate}
      onChange={handleChange}
      required
      error={errors.restockDate}
    />

    <InputField
      label="Upload Document"
      name="document"
      type="file"
      multiple
      value={formData.document}
      onChange={handleChange}
      error={errors.document}
    />

  </div>

  <div className="flex flex-col md:flex-row gap-3 justify-between items-end px-6">
    <div className=" text-sm xl:text-base border rounded-md bg-gray-200 w-1/2 px-3 items-center justify-center py-2">
        <p>Total price : {totalPrice}</p>
    </div>
    <div className=" text-xs xl:text-sm flex flex-row justify-end space-x-3 w-1/2">
      <button
        type="button"
        onClick={() => window.location.reload()} 
        className="bg-gray-400 text-white px-4 py-2 rounded"
      >
        Cancel
      </button>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >Save
      </button>
    </div>
  </div>
</form>

  
</div>
  );
}


