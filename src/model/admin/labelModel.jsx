import React, { useState, useEffect } from "react";
import Barcode from "react-barcode";
import QRCode from "react-qr-code";
import { Package, X } from "lucide-react";
import axios from "axios";
import {
  pdf,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import JsBarcode from "jsbarcode";
import { Logo } from "../../assets/common";
import FragileIcon from "../../assets/product/fragile.png";
import UprightIcon from "../../assets/product/upright.png";
import FoodIcon from "../../assets/product/food-product.png";


const Base_Url = import.meta.env.VITE_BASE_URL;

// ── PDF styles (4×6 inch = 288×432 pt) ─────────────────────────────────────
const pt = StyleSheet.create({
  page: {
    width: 288,
    // height: 432,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#111111",
    // padding: 10,
    padding: 5,
  },
  border: {
    border: "1.5 solid #111111",
    // flex: 1,
  },
  // ── FROM / DELIVERY row ──
  topRow: {
    flexDirection: "row",
    borderBottom: "1 solid #111111",
  },
  fromBox: {
    width: "50%",
    padding: 5,
    borderRight: "1 solid #111111",
  },
  deliveryBox: {
    width: "50%",
  },
  deliveryTop: {
    padding: 4,
    alignItems: "center",
    borderBottom: "1 solid #111111",
  },
  deliveryTopText: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },
  paymentText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginTop: 1,
  },
  deliveryBottom: {
    padding: 5,
  },
  orderLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
  },
  orderNumber: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginTop: 1,
  },
  sectionLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  boldText: {
    fontFamily: "Helvetica-Bold",
  },
  normalText: {
    fontSize: 7.5,
    lineHeight: 1.4,
  },
  // ── TO / BARCODE row ──
  toRow: {
    flexDirection: "row",
    borderBottom: "1 solid #111111",
  },
  toBox: {
    width: "55%",
    padding: 5,
    borderRight: "1 solid #111111",
  },
  barcodeBox: {
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  barcodeImage: {
    width: 110,
    height: 55,
  },
  // ── INFO ROW ──
  infoRow: {
    flexDirection: "row",
    borderBottom: "1 solid #111111",
  },
  infoCell: {
    flex: 1,
    padding: 4,
    alignItems: "center",
    borderRight: "1 solid #111111",
  },
  infoCellLast: {
    flex: 1,
    padding: 4,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginTop: 2,
  },
  // ── DELIVERY ADDRESS / QR row ──
  addrRow: {
    flexDirection: "row",
    borderBottom: "1 solid #111111",
  },
  addrBox: {
    width: "55%",
    padding: 5,
    borderRight: "1 solid #111111",
  },
  qrBox: {
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  qrImage: {
    width: 50,
    height: 50,
  },
  qrCaption: {
    fontSize: 5.5,
    marginTop: 3,
    textAlign: "center",
    color: "#444444",
  },
  // ── PRODUCT row ──
  productRow: {
    flexDirection: "column",
    borderBottom: "1 solid #111111",
    padding: 4,
  },

  productLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  productText: {
    fontSize: 7.5,
    lineHeight: 1.4,
    // react-pdf wraps text within its parent width automatically in column layout
  },
  // ── HANDLING row ──
  handlingRow: {
    borderBottom: "1 solid #111111",
    padding: 4,
  },
  handlingTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  handlingIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  handlingItem: {
    alignItems: "center",
    width: 60,
  },
  handlingEmoji: {
    fontSize: 14,
  },
  handlingImage: {
    width: 20,
    height: 20,
    marginBottom: 4,
  },

  handlingImageArrow: {
    width: 16,
    height: 16,
    marginBottom: 6,
    marginTop: 2,
  },
  handlingLabel: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    marginTop: 2,
    textAlign: "center",
  },
  handlingSub: {
    fontSize: 5.5,
    textAlign: "center",
    color: "#444444",
  },
  // ── FOOTER ──
  footer: {
    padding: 4,
    alignItems: "center",
  },
  footerText: {
    fontSize: 6.5,
    color: "#555555",
  },
});

// ── Generate barcode as base64 PNG via JsBarcode ────────────────────────────
function generateBarcodeDataUrl(value) {
  try {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, String(value), {
      format: "CODE128",
      width: 2,
      height: 60,
      displayValue: true,
      fontSize: 10,
      margin: 4,
    });
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

// ── Generate QR as base64 PNG via canvas ────────────────────────────────────
async function generateQRDataUrl(value) {
  try {
    const QRCode = await import("qrcode");
    return await QRCode.toDataURL(value, { width: 140, margin: 1 });
  } catch {
    return null;
  }
}


function LabelPDF({ orderData, barcodeDataUrl, qrDataUrl }) {
  const addr = orderData?.address;
  const addressLines = addr
    ? [
      addr.flatNo ? `Flat No. ${addr.flatNo}` : "",
      addr.buildingName || "",
      addr.streetName || "",
      addr.city || "",
      addr.state || "",
      addr.pincode ? `PIN: ${addr.pincode}` : "",
    ].filter(Boolean)
    : ["Address Not Available"];

  const customerName = orderData?.user?.name || "Customer";
  const phone = orderData?.user?.mobileNumber || orderData?.address?.mobileNumber || "N/A";
  const orderId = orderData?.orderId || "000000";
  const paymentType = orderData?.paymentMethod?.toLowerCase() === "cod" ? "COD" : "PREPAID";

  const totalWeight =
    orderData?.items?.reduce((acc, item) => {
      const weight = parseFloat(item?.variant?.weight?.replace(/[^\d.]/g, "") || 0);
      return acc + weight * item.quantity;
    }, 0) || 0;

    const formatWeight = (weightInGrams) => {
      if (weightInGrams < 500) {
        return `${weightInGrams.toFixed(0)} GM`;
      }

      return `${(weightInGrams / 1000).toFixed(2).replace(/\.00$/, "")} KG`;
    };

  const productNames = orderData?.items
    ?.map((i) => i?.product?.productName)
    .filter(Boolean)
    .join(", ") || "Product";



  return (
    <Document title={`ShippingLabel-${orderId}`}>
      <Page size={[288, 432]} style={pt.page}>
        <View style={pt.border}>

          {/* FROM / DELIVERY */}
          <View style={pt.topRow}>
            <View style={pt.fromBox}>
              <Text style={pt.sectionLabel}>From:</Text>
              <Text style={[pt.normalText, pt.boldText]}>Melforesta</Text>
              <Text style={pt.normalText}>Maharashtra, India</Text>
              <Text style={pt.normalText}>support@melecom.com</Text>
            </View>
            <View style={pt.deliveryBox}>
              <View style={pt.deliveryTop}>
                <Text style={pt.deliveryTopText}>DELIVERY</Text>
                <Text style={pt.paymentText}>{paymentType}</Text>
              </View>
              <View style={pt.deliveryBottom}>
                <Text style={pt.orderLabel}>ORDER NO:</Text>
                <Text style={pt.orderNumber}>{orderId}</Text>
              </View>
            </View>
          </View>

          {/* TO / BARCODE */}
          <View style={pt.toRow}>
            <View style={pt.toBox}>
              <Text style={pt.sectionLabel}>To:</Text>
              <Text style={[pt.normalText, pt.boldText]}>{customerName}</Text>
              {/* {addressLines.map((line, i) => (
                <Text key={i} style={pt.normalText}>{line}</Text>
              ))} */}
              <Text style={pt.normalText}>{addressLines}</Text>
              <Text style={pt.normalText}>Ph: {phone}</Text>
            </View>
            <View style={pt.barcodeBox}>
              {barcodeDataUrl ? (
                <Image src={barcodeDataUrl} style={pt.barcodeImage} />
              ) : (
                <Text style={pt.normalText}>{orderId}</Text>
              )}
            </View>
          </View>

          {/* ORDER INFO */}
          <View style={pt.infoRow}>
            <View style={pt.infoCell}>
              <Text style={pt.infoLabel}>Order ID</Text>
              <Text style={pt.infoValue}>{orderId}</Text>
            </View>
            <View style={pt.infoCell}>
              <Text style={pt.infoLabel}>Weight</Text>
              <Text style={pt.infoValue}>{formatWeight(totalWeight)} KG</Text>
            </View>
            <View style={pt.infoCellLast}>
              <Text style={pt.infoLabel}>Payment</Text>
              <Text style={pt.infoValue}>{paymentType}</Text>
            </View>
          </View>

          {/* DELIVERY ADDRESS / QR */}
          <View style={pt.addrRow}>
            <View style={pt.addrBox}>
              <Text style={pt.sectionLabel}>Delivery Address:</Text>
              <Text style={[pt.normalText, pt.boldText]}>{customerName}</Text>
              {/* {addressLines.map((line, i) => (
                <Text key={i} style={pt.normalText}>{line}</Text>
              ))} */}
              <Text style={pt.normalText}>{addressLines}</Text>
              <Text style={pt.normalText}>Ph: {phone}</Text>
            </View>
            <View style={pt.qrBox}>
              <Text style={[pt.sectionLabel, { marginBottom: 4 }]}>Scan to Track</Text>
              {qrDataUrl ? (
                <Image src={qrDataUrl} style={pt.qrImage} />
              ) : null}
              <Text style={pt.qrCaption}>melecom.wesolutize.com</Text>
            </View>
          </View>

          {/* PRODUCTS */}
          {/* <View style={pt.productRow}>
            <Text style={[pt.normalText, pt.boldText]}>PRODUCTS: </Text>
            <Text style={pt.normalText}>{productNames}</Text>
          </View> */}

          <View style={pt.productRow}>
            <Text style={pt.productLabel}>Products:</Text>
            <Text style={pt.productText}>{productNames}</Text>
          </View>

          {/* HANDLING */}
          <View style={pt.handlingRow}>
            <Text style={pt.handlingTitle}>Handling Instructions</Text>
            <View style={pt.handlingIcons}>
              <View style={pt.handlingItem}>
                <Image src={FragileIcon} style={pt.handlingImage} />
                <Text style={pt.handlingLabel}>FRAGILE</Text>
                <Text style={pt.handlingSub}>Handle Carefully</Text>
              </View>
              <View style={pt.handlingItem}>
                <Image src={UprightIcon} style={pt.handlingImageArrow} />
                <Text style={pt.handlingLabel}>KEEP UPRIGHT</Text>
                <Text style={pt.handlingSub}>Do Not Tilt</Text>
              </View>
              <View style={pt.handlingItem}>
                <Image src={FoodIcon} style={pt.handlingImageArrow} />
                <Text style={pt.handlingLabel}>FOOD PRODUCT</Text>
                <Text style={pt.handlingSub}>Store Safely</Text>
              </View>
            </View>
          </View>

          {/* FOOTER */}
          <View style={pt.footer}>
            <Text style={pt.footerText}>Thank you for choosing Melforesta</Text>
          </View>

        </View>
      </Page>
    </Document>
  );
}

// ── Main Modal ───────────────────────────────────────────────────────────────
export default function LabelModel({ order, onClose }) {
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!order?.orderId) return;
      try {
        setIsLoading(true);
        setFetchError(null);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${Base_Url}/api/productOrder/getOrderDetails/${order.orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          setOrderData(res.data.data);
        } else {
          setFetchError(res.data.message || "Failed to fetch order details");
        }
      } catch (err) {
        console.error(err);
        setFetchError(err.response?.data?.message || "Failed to fetch order details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrderDetails();
  }, [order?.orderId]);

  if (!order) return null;

  const customerName = orderData?.user?.name || "Customer";
  const addr = orderData?.address;
  const addressSingleLine = addr
    ? [
        addr.flatNo ? `Flat No. ${addr.flatNo}` : "",
        addr.buildingName || "",
        addr.streetName || "",
        addr.city || "",
        addr.state || "",
        addr.pincode ? `- ${addr.pincode}` : "",
      ].filter(Boolean).join(", ")
    : "Address Not Available";

  const phone = orderData?.user?.mobileNumber || orderData?.address?.mobileNumber || "N/A";
  const orderId = orderData?.orderId || order?.orderId || "000000";

  const totalWeight =
    orderData?.items?.reduce((acc, item) => {
      const weight = parseFloat(item?.variant?.weight?.replace(/[^\d.]/g, "") || 0);
      return acc + weight * item.quantity;
    }, 0) || 0;

    const formatWeight = (weightInGrams) => {
      if (weightInGrams < 500) {
        return `${weightInGrams.toFixed(0)} GM`;
      }

      return `${(weightInGrams / 1000).toFixed(2).replace(/\.00$/, "")} KG`;
    };

  const paymentType = orderData?.paymentMethod?.toLowerCase() === "cod" ? "COD" : "Prepaid";

  const handleDownloadLabel = async () => {
    if (!orderData) return;
    try {
      setIsDownloading(true);
      const barcodeDataUrl = generateBarcodeDataUrl(orderId);
      const qrDataUrl = await generateQRDataUrl("https://melecom.wesolutize.com/");

      const blob = await pdf(
        <LabelPDF
          orderData={orderData}
          barcodeDataUrl={barcodeDataUrl}
          qrDataUrl={qrDataUrl}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ShippingLabel-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Label download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrintLabel = async () => {
      if (!orderData) return;
  
      try {
        const barcodeDataUrl = generateBarcodeDataUrl(orderId);
        const qrDataUrl = await generateQRDataUrl(
          "https://melecom.wesolutize.com/"
        );
  
        const blob = await pdf(
          <LabelPDF
            orderData={orderData}
            barcodeDataUrl={barcodeDataUrl}
            qrDataUrl={qrDataUrl}
          />
        ).toBlob();
  
        const blobUrl = URL.createObjectURL(blob);
  
        const printWindow = window.open(blobUrl);
  
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
          };
        }
      } catch (error) {
        console.error("Print failed:", error);
      }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-auto max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-end px-3 border-b">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-red-100">
            <X size={20} />
          </button>
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 font-medium">Loading order details...</p>
          </div>
        )}

        {/* ERROR */}
        {!isLoading && fetchError && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-red-600 font-medium">{fetchError}</p>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Close
            </button>
          </div>
        )}

        {/* CONTENT */}
        {!isLoading && !fetchError && orderData && (
        <div className="p-3 bg-white">
        <div className="flex justify-center">
          <div className="w-full max-w-[900px] scale-100 origin-top rounded-lg overflow-hidden px-2">
            <div className="border-2 border-black rounded-lg overflow-hidden">

              {/* TOP SECTION */}
              <div className="grid grid-cols-2 border-b border-black">
                <div className="p-2 border-r border-black">
                  <h2 className="font-bold text-lg mb-1">FROM:</h2>
                  <div className="text-base leading-5">
                    <p className="font-semibold">Melforesta</p>
                    <p>D-18, Emirate Hills, Old Mumbai - Pune highway, Somatne. Pune - 410506</p>
                    <p>skfoodsandspies@gmail.com</p>
                    <p>+91 7796695552</p>
                  </div>
                  
                </div>
                <div>
                  <div className="p-2 text-center border-b border-black">
                    <h1 className="font-black text-xl tracking-wider">DELIVERY</h1>
                    <p className="text-base font-semibold">{paymentType}</p>
                  </div>
                  <div className="p-2 text-center">
                    <p className="font-bold text-base">ORDER NO:</p>
                    <p className="text-xl font-black">{orderId}</p>
                  </div>
                </div>
              </div>

              {/* CUSTOMER + BARCODE */}
              <div className="grid grid-cols-2 border-b border-black">
                <div className="p-2 border-r border-black">
                  <h2 className="font-bold text-lg mb-1">TO:</h2>
                  <div className="text-base leading-5">
                    <p className="font-semibold">{customerName}</p>
                    <p>{addressSingleLine}</p>
                    <p>Phone: {phone}</p>
                  </div>
                </div>
                <div className="flex justify-center items-center p-2">
                  <Barcode value={String(orderId)} width={2} height={70} displayValue={true} />
                  
                </div>
              </div>

              {/* ORDER INFO */}
              <div className="grid grid-cols-3 border-b border-black">
                <div className="p-2 border-r border-black text-center">
                  <h3 className="font-bold text-base">ORDER ID</h3>
                  <p className="text-lg mt-1">{orderId}</p>
                </div>
                <div className="p-2 border-r border-black text-center">
                  <h3 className="font-bold text-base">WEIGHT</h3>
                  <p className="text-lg mt-1">{formatWeight(totalWeight)}</p>
                </div>
                <div className="p-2 text-center">
                  <h3 className="font-bold text-base">PAYMENT</h3>
                  <p className="text-lg mt-1">{paymentType}</p>
                </div>
              </div>

              {/* DELIVERY ADDRESS + QR */}
              <div className="grid grid-cols-2 border-b border-black divide-x">
              <div className="flex flex-col border-b border-black">
                <div className="p-2 border-black border-b">
                  <h3 className="font-bold text-lg mb-2">DELIVERY ADDRESS</h3>
                  <div className="text-base leading-5">
                    <p className="font-semibold">{customerName}</p>
                    {addr ? (
                      <p>{addressSingleLine}</p>
                    ) : (
                      <p>Address Not Available</p>
                    )}
                    <p className="mt-1">Phone: {phone}</p>
                  </div>
                </div>

               
                <div className="p-2  border-black">
                  <span className="font-bold">PRODUCTS: </span>
                  {orderData.items?.length > 0
                    ? orderData.items.map((item) => item?.product?.productName).filter(Boolean).join(", ")
                    : "Product"}
                </div>
              </div>

              {/* PRODUCT INFO */}
              <div className="flex flex-col border-b border-black">
                <div className="flex flex-col items-center justify-center p-2 border-b border-black">
                  <h3 className="font-bold text-lg mb-2">SCAN TO TRACK</h3>
                  <QRCode value="https://melforesta.com" size={90} />
                  <p className="mt-2 text-center text-sm">https://melforesta.com</p>
                </div>
                <div className="p-2 text-center">
                  <span className="font-bold text-base">INVOICE: </span>Attached
                </div>
              </div>
              </div>

              {/* HANDLING */}
              <div className="p-2 border-b border-black">
                <h3 className="font-bold text-center text-base mb-2">HANDLING INSTRUCTIONS</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-lg p-2 text-center">
                    <div className="text-2xl mb-1">⚠️</div>
                    <p className="font-semibold text-base">FRAGILE</p>
                    <p className="text-xs">Handle Carefully</p>
                  </div>
                  <div className="border rounded-lg p-2 text-center">
                    <div className="text-2xl mb-1">↑↑</div>
                    <p className="font-semibold">KEEP UPRIGHT</p>
                    <p className="text-xs">Do Not Tilt</p>
                  </div>
                  <div className="border rounded-lg p-2 text-center">
                    <div className="text-2xl mb-1">🍯</div>
                    <p className="font-semibold">FOOD PRODUCT</p>
                    <p className="text-xs">Store Safely</p>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="p-2 text-center">
                <p className="text-sm font-medium">Thank you for choosing Melforesta 🍯</p>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handlePrintLabel}
                className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
              >
                Print Label
              </button>
              <button
                onClick={handleDownloadLabel}
                disabled={isDownloading}
                className="px-5 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
              >
                {isDownloading ? "Downloading..." : "Download Label"}
              </button>
              <button onClick={onClose} className="px-5 py-2 rounded-lg border">
                Close
              </button>
            </div>
          </div>
        </div>
        </div>
        )}
      </div>
    </div>
  );
}