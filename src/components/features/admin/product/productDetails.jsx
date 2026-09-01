import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { MdKeyboardBackspace } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import capitalizeFirstLetter from '../../../common/capitalizeFirstLetter';
import { FcOk } from 'react-icons/fc';
const Base_Url = import.meta.env.VITE_BASE_URL;

export default function ProductDetails() {
  const { id } = useParams();
  const navigate=useNavigate();
  const [loading,setLoading]=useState(false);
  const dispatch = useDispatch();
  const [currentProduct, setCurrentProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState();
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const token=localStorage.getItem("token");
        const res = await axios.get(
          `${Base_Url}/api/product/getProductDetails/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          const product = res.data.data;
          setCurrentProduct(product);
          if (product.images && product.images.length > 0) {
            setSelectedImage(product.images[0].image);
          }

          if (product.variants && product.variants.length > 0) {
            setSelectedVariant(product.variants[0]);
          }
        } else {
          toast.error(res.data.message || "Failed to fetch product details");
        }
      } catch (err) {
        console.error("❌ Fetch product error:", err);
        toast.error(err.response?.data?.message || "Failed to load product details");
      }finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) {
      return (
        <div className="text-center text-yellow-600 mt-10">Loading product details</div>
      );
  }
   if (!currentProduct) {
      return (
        <div className="text-center text-red-500 mt-10">Product not found</div>
      );
    }

  return (
    <section className="pr-5 py-5">

      <div className="flex flex-row justify-between items-center mb-5">
        <div
          className="flex flex-row space-x-2 items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <h2 className="text-base md:text-lg xl:text-xl hover:scale-105 flex items-center gap-1 duration-200 hover:text-yellow-600">
            {" "}
            <MdKeyboardBackspace className="text-base md:text-lg xl:text-xl"/>
            Back
          </h2>
        </div>
      </div>

      <div className="flex flex-col md:flex-row bg-white py-6 px-2 rounded shadow-lg h-auto">
        <div className="w-full md:w-1/2 flex-shrink-0 flex flex-col items-center">
            <div
                className="relative w-full md:px-5 lg:px-12 flex items-center justify-center h-[450px]"
            >
                <img
                    src={selectedImage || currentProduct.images[0]?.image}
                    alt={currentProduct.productName}
                    className="max-h-full max-w-full object-contain border border-yellow-600 rounded"
                />
            </div>

            <div className="flex gap-2 xl:gap-6 mt-4">
                {currentProduct.images.map((img, i) => (                                                           
                <img
                    key={i}
                    src={img.image}
                    onClick={() => setSelectedImage(img.image)}
                    className={`w-10 h-10 md:h-14 md:w-14 xl:h-20 xl:w-20 object-cover border border-gray-500 rounded cursor-pointer ${
                    selectedImage === img.image ? "border-2 border-yellow-600" : ""
                    }`}
                    alt={`thumb-${i}`}
                />
                ))}
            </div>
        </div>

        <div className="w-full lg:w-1/2 mt-6 md:mt-0 md:pl-9 space-y-5">
          <div className="flex flex-col space-y-4">
            <h2 className="text-yellow-600 text-xl">
              {" "}
              {capitalizeFirstLetter(currentProduct.category?.name)}
            </h2>
            <h1 className="text-base md:text-xl xl:text-3xl font-semibold flex flex-row flex-wrap text-[#3E2C1C] font-serif">
              <p>{capitalizeFirstLetter(currentProduct.productName)}</p>              
            </h1>
            <div>
              <p className="text-3xl font-semibold">
                ₹{Math.round(Number(selectedVariant?.discountedPrice || 0))}
              </p>

              {selectedVariant?.discountPercent > 0 && (
                <div className="flex items-center gap-2 text-sm mt-1">
                  <span className="line-through text-gray-400">
                    ₹{Math.round(Number(selectedVariant?.price || 0))}
                  </span>
                  <span className="text-green-600 font-medium">
                    {Number(selectedVariant.discountPercent)}% OFF
                  </span>
                </div>
              )}
            </div>

         
          </div> 

          <p className="capitalize">{currentProduct.description}</p>

          {currentProduct.specifications && (
          <div className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentProduct.specifications.map((spec) => (
              <div
                key={spec.key}
                className="flex items-start gap-2 p-2 pt-3 border border-primary/50 rounded-md bg-gray-50"
              >
                <FcOk size={20} />
                <div className="-mt-2 text-xs md:text-sm xl:text-base">
                  <p className="font-medium capitalize">
                    {capitalizeFirstLetter(spec.key)}
                  </p>

                  <p className="text-gray-600 capitalize">
                    {Array.isArray(spec.value)
                      ? spec.value.filter(v => v !== "").join(", ")
                      : spec.value
                    }
                  </p>
                </div>
              </div>
            ))}
            </div>
          </div>
          )}

          <div className="flex flex-row flex-wrap gap-4">
            {currentProduct.variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;

              return (
                <div
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`flex flex-col gap-1 border p-3 rounded-md px-4 cursor-pointer transition 
                  ${
                    isSelected
                      ? "border-yellow-500 bg-yellow-50 shadow-md"
                      : "border-gray-300 hover:border-yellow-400"
                  }`}
                >
                  <p className="font-medium text-gray-800">{variant.weight}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-[#3e2c1c]">
                     ₹{Math.round(Number(variant.discountedPrice))}
                    </p>
                    {variant.discountPercent > 0 && (
                      <p className="text-sm text-gray-400 line-through">
                        ₹{Math.round(Number(variant.price))}
                      </p>
                    )}
                  </div>
                  <p
                    className={`text-xs font-medium px-2 py-1 rounded-full w-fit capitalize ${
                      variant.stockStatus === "inStock"
                        ? "bg-green-100 text-green-700"
                        : variant.stockStatus === "lowStock"
                        ? "bg-yellow-100 text-yellow-700"
                        : variant.stockStatus === "outOfStock"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {variant.stockStatus}
                  </p>
                </div>
              );
            })}
          </div>
          
        </div>
      </div>

    </section>
  )
}
