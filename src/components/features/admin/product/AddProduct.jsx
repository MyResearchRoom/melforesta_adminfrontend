import React, { useState ,useEffect} from 'react'
import InputField from "../../../common/InputField";
import { FaFileUpload } from 'react-icons/fa';
import DynamicFields from '../../../common/admin/dynamicFields';
import { toast } from 'react-toastify';
import { saveProduct } from "../../../../services/saveProduct";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../../../redux/actions/categoryActions';
import axios from "axios";
import { MdDelete } from 'react-icons/md';
const Base_Url = import.meta.env.VITE_BASE_URL;
export default function AddProduct({ productId = null, onSubmit }) {
  const isEditMode = !!productId;
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    originalPrice: "",
    discountPrice: "",
    discountPercent: "",
    gstpercent:"",
    handlingCharge:"",
    images: [],
  });
  const [specifications, setSpecifications] = useState([]);
  const [prices, setPrices] = useState([]);


  const dispatch=useDispatch();

  const {categories=[],error}=useSelector((state)=>state.categoryState);

  useEffect(()=>{
      dispatch(fetchCategories());
  },[dispatch,categories.length]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);

  useEffect(() => {
  const fetchProductDetails = async () => {
    if (!productId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${Base_Url}/api/product/getProductDetails/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        const product = res.data.data;
        setFormData({
          name: product.productName || "",
          category: product.categoryId || "",
          description: product.description || "",
          gstpercent: Number(product.gstPercent) || 0,
          handlingCharge: Number(product.handlingCharges) || 0,
          // images: (product.images || []).map(img => img.image || ""),
          images: (product.images || []).map(img => ({
            id: img.id,
            image: img.image,
            isExisting: true,
          })),
          });
        setSpecifications(product?.specifications || []);
        setPrices(product?.variants || []);
      } else {
        toast.error(res.data.message || "Failed to fetch product details");
      }
    } catch (err) {
      console.error("❌ Fetch product error:", err);
      toast.error(err.response?.data?.message || "Failed to load product details");
    }
  };
  fetchProductDetails();
  }, [productId]);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      // const newFiles = Array.from(files);
      const newFiles = Array.from(files).map(file => ({
        file,
        image: URL.createObjectURL(file),
        isExisting: false,
      }));

      setFormData((prev) => {
        const merged = [...prev.images, ...newFiles];
        if (merged.length > 5) {
          toast.warn("You can upload max 5 images.");
          return prev;
        }
        return { ...prev, images: merged };
      });
      return;
    }

    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === "discountPercent" || name === "originalPrice") {
        const original = parseFloat(updated.originalPrice) || 0;
        const percent = parseFloat(updated.discountPercent) || 0;

        updated.discountPrice = percent > 0 ? original - (original * percent) / 100 : "";
      }

      return updated;
    });
  };

  const validate = () => {
  const newErrors = {};
  const requiredFields = [
    "name",
    "category",
    "images",
    "gstpercent",
    "handlingCharge",
  ];

  requiredFields.forEach((field) => {
     if (
      formData[field] === null ||
      formData[field] === undefined ||
      formData[field] === ""
    ) {newErrors[field] = "This field is required"};
  });

  if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Invalid email format";
  }

  if (formData.gstpercent && isNaN(Number(formData.gstpercent))) {
    newErrors.gstpercent = "GST percent must be a number";
  }

  if (formData.handlingCharge && isNaN(Number(formData.handlingCharge))) {
    newErrors.handlingCharge = "Handling Charge must be a number";
  }

  if (specifications.length === 0){
      return toast.error("At least one specification is required")
  }


  if (prices.length === 0) {
    return toast.error("At least one price variant is required");
  }

  for (let p of prices) {
    if (!p.weight || !p.price) {
      return toast.error("Each variant must have weight and price");
    }
  }

  if (formData.images.length === 0){
      return toast.error("At least one image is required")
  }

  return newErrors;
  }

  const buildFormData = () => {
    let fd = new FormData();

    fd.append("productName", formData.name);
    fd.append("categoryId", formData.category);
    fd.append("description", formData.description);
    fd.append("originalPrice", formData.originalPrice);
    fd.append("discountPercent", formData.discountPercent);
    fd.append("gstPercent", formData.gstpercent);
    fd.append("handlingCharges", formData.handlingCharge);

    fd.append("specifications", JSON.stringify(specifications));
    fd.append("prices", JSON.stringify(prices));
    // fd.append("attributes", JSON.stringify(attributes));
    // fd.append("metadata", JSON.stringify({}));
    if(isEditMode) {
      fd.append("deletedImageIds", JSON.stringify(deletedImageIds));
    }

    formData.images.forEach((img) => {
      if (!img.isExisting) { 
        fd.append("images", img.file);
      }
    });

    return fd;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const formErrors = validate();
  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    return;
  }
  const data = buildFormData();
  const token = localStorage.getItem("token");

  // console.log("FormData contents:");
  // for (let [key, value] of data.entries()) {
  //   if (value instanceof File) {
  //     console.log(key, ":", value.name);
  //   } else {
  //     console.log(key, ":", value);
  //   }
  // }
  try {
    await saveProduct({ productId, data, token });
    if (onSubmit) onSubmit();
  } catch (err) {
    console.error("Save product failed:", err);
  }

  if (onSubmit) {
    onSubmit();  
  } 
  };

  return (
  <div className="flex flex-col px-4 pt-3 py-5 bg-white w-full">
    <h2 className="text-xl xl:text-2xl font-bold mb-4 text-center">   {isEditMode ? "Edit Product" : "Add Product"}
    </h2> 
    {error && <p className="text-red-500">Error from category: {error}</p>}  
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-base xl:text-lg font-semibold">Basic Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 ">
        <InputField
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          error={errors.name}
        />

        <InputField
          label="Select Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          isSelect
          options={categories.map((item) => ({ value: item.id, label: item.name }))} 
          required
          error={errors.category}
        />

        <InputField
          label="Description "
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
        />

        <InputField
          label="GST Percent"
          name="gstpercent"
          value={formData.gstpercent}
          onChange={handleChange}
          required
          error={errors.gstpercent}
        />

        <InputField
          label="Handling Charges"
          name="handlingCharge"
          value={formData.handlingCharge}
          onChange={handleChange}
          required
          error={errors.handlingCharge}
        />
      </div>

      <div className='pt-5'>
        <DynamicFields
          type="Specifications"
          value={specifications}
          onChange={setSpecifications}
        />
      </div>

      <div className="pt-5">
        <div className='flex flex-col md:flex-row justify-between pb-3'>
          <h3 className="text-base xl:text-lg font-semibold mb-2">
            Product Variants (Weight & Price)
          </h3>
          <button
            type="button"
            onClick={() =>
              setPrices([...prices, { weight: "", price: "", discountPercent: "" }])
            }
            className="bg-custom-gradient2 text-white px-4 py-2 rounded"
          >
            + Add Variant
          </button>
        </div>
        

        {prices.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5 shadow-lg rounded-md border border-gray-400 p-3 items-start">

            <InputField
              label="Enter weight"
              name="weight"
              value={item.weight}
              placeholder="Weight (e.g. 250g)"
              onChange={(e) => {
                const updated = [...prices];
                updated[index].weight = e.target.value;
                setPrices(updated);
              }}
              required
            />

            <InputField
              type="number"
              placeholder="Price"
              label="Enter price"
              name="price"
              value={item.price}
              onChange={(e) => {
                const updated = [...prices];
                updated[index].price = e.target.value;
                setPrices(updated);
              }}
              required
            />

            <InputField
              type="number"
              placeholder="Discount %"
              label="Enter discount percent"
              name="discountPercent"
              value={item.discountPercent}
              onChange={(e) => {
                const updated = [...prices];
                updated[index].discountPercent = e.target.value;
                setPrices(updated);
              }}
              required
            />

            <button
              type="button"
              onClick={() => {
                const updated = prices.filter((_, i) => i !== index);
                setPrices(updated);
              }}
              className="mt-auto border border-red-500 text-white rounded p-3 flex items-center justify-center"
            >
              <MdDelete className='text-red-600 text-lg'/>
            </button>
          </div>
        ))}

        
      </div>


      <h3 className="text-base xl:text-lg font-semibold">Media</h3>
      <div className="grid grid-cols-2 gap-x-5 gap-y-4"> 
        <div className="w-full flex flex-col md:flex-row gap-4 col-span-2 px-6">
          <div className="md:w-1/3">
            <label className="block mb-2 font-medium text-sm xl:text-base">
              Upload Photos
            </label>
  
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-primary rounded-md p-2 xl:p-4 cursor-pointer hover:border-gray-400 transition-all">
              <FaFileUpload className="text-3xl text-gray-500 mb-2" />
              <p className=" text-gray-500 text-center">
                Click to upload images
              </p>
    
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>
          {formData.images.length > 0 && (
          <div className="flex flex-row gap-1 md:gap-4 md:w-2/3 md:pt-8 xl:pt-10">
            {formData.images.map((file, index) => {
              return (
              <div key={index} className="relative w-14 h-14 md:w-16 md:h-16 xl:h-20 xl:w-20">
                <img
                  // src={imageUrl}
                  src={file.image}
                  alt={`preview-${index}`}
                  className="w-full h-full object-cover rounded border"
                />
                <button
                  type="button"
                  // onClick={() => {
                  // setFormData((prev) => {
                  //   const updatedFiles = [...prev.images];
                  //   updatedFiles.splice(index, 1);
                  //   return {
                  //     ...prev,
                  //     images: updatedFiles,
                  //   };
                  // });
                  // }}

                  onClick={async () => {
                    const image = formData.images[index];
                      if (image.isExisting) {
                        setDeletedImageIds(prev => [...prev, image.id]);
                      }

                      setFormData(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index),
                      }));
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white text-center rounded-full w-4 h-4 text-xs"
                >
                  ×
                </button>
              </div>
              );
            })}
          </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-3 text-sm xl:text-base">
        <button
          type="button"
          onClick={() => window.location.reload()} 
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded"
        >
          {isEditMode ? "Update" : "Save"}
        </button>
      </div>
    </form>
  </div>
  )
}
