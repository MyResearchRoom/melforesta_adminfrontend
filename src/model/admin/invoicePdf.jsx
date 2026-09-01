// import React from "react";
// import {
//   Document,
//   Image,
//   Page,
//   StyleSheet,
//   Text,
//   View,
// } from "@react-pdf/renderer";
// import { Logo } from "../../assets/common";

// function formatNumber(value) {
//   return Math.round(Number(value || 0)).toLocaleString("en-IN");
// }

// function formatDate(value) {
//   return value ? new Date(value).toLocaleDateString("en-IN") : "";
// }

// function buildAddress(address = {}) {
//   return [
//     address.flatNo ? `FLAT NO. ${address.flatNo}` : "",
//     address.buildingName || "",
//     address.streetName || "",
//     address.city || "",
//     address.state && address.pincode
//       ? `${address.state} - ${address.pincode}`
//       : address.state || address.pincode || "",
//   ]
//     .filter(Boolean)
//     .join(", ");
// }

// function Money({ value, negative = false }) {
//   return (
//     <Text>
//       {negative ? "-" : ""}Rs. {formatNumber(value)}
//     </Text>
//   );
// }

// const styles = StyleSheet.create({
//   page: {
//     backgroundColor: "#ffffff",
//     color: "#111111",
//     fontFamily: "Helvetica",
//     fontSize: 9.5,
//     padding: 24,
//     flexDirection: "column",
//   },

//   // ── HEADER ─────────────────────────────────────────────────────────────────
//   header: {
//     border: "1 solid #111111",
//     marginBottom: 10,
//   },
//   topHeader: {
//     minHeight: 52,
//     padding: 8,
//     borderBottom: "1 solid #111111",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   brandBlock: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   logo: {
//     width: 38,
//     height: 38,
//     objectFit: "contain",
//   },
//   brandName: {
//     fontSize: 15,
//     fontFamily: "Helvetica-Bold",
//     textTransform: "uppercase",
//   },
//   tagline: {
//     marginTop: 2,
//     fontSize: 8.5,
//   },
//   invoiceTitle: {
//     textAlign: "right",
//   },
//   titleText: {
//     fontSize: 14,
//     fontFamily: "Helvetica-Bold",
//   },
//   mutedSmall: {
//     marginTop: 2,
//     fontSize: 8,
//     color: "#444444",
//   },
//   repeatInfo: {
//     padding: 7,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 10,
//   },
//   repeatText: {
//     fontSize: 8.5,
//   },

//   // ── BODY SHELL ─────────────────────────────────────────────────────────────
//   invoiceShell: {
//     border: "1 solid #111111",
//     flex: 1,
//     flexDirection: "column",
//   },

//   // ── COMMON ─────────────────────────────────────────────────────────────────
//   twoCol: {
//     flexDirection: "row",
//     borderBottom: "1 solid #111111",
//   },
//   cellHalf: {
//     width: "50%",
//     padding: 6,
//   },
//   cellHalfBorder: {
//     width: "50%",
//     padding: 6,
//     borderRight: "1 solid #111111",
//   },
//   sectionTitle: {
//     marginBottom: 4,
//     fontSize: 9,
//     fontFamily: "Helvetica-Bold",
//     textTransform: "uppercase",
//   },
//   sellerName: {
//     marginBottom: 3,
//     fontSize: 9,
//     fontFamily: "Helvetica-Bold",
//     textTransform: "uppercase",
//   },
//   line: {
//     marginBottom: 3,
//     lineHeight: 1.3,
//     fontSize: 9,
//   },
//   label: {
//     fontFamily: "Helvetica-Bold",
//   },
//   customerName: {
//     marginBottom: 3,
//     fontSize: 9,
//     fontFamily: "Helvetica-Bold",
//     textTransform: "uppercase",
//   },
//   address: {
//     lineHeight: 1.4,
//     textTransform: "uppercase",
//     fontSize: 9,
//   },

//   // ── TABLE ──────────────────────────────────────────────────────────────────
//   table: {
//     width: "100%",
//     borderBottom: "1 solid #111111",
//   },
//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: "#f1f1f1",
//     borderBottom: "1 solid #111111",
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottom: "1 solid #111111",
//     minHeight: 24,
//   },
//   th: {
//     padding: 5,
//     fontFamily: "Helvetica-Bold",
//     textAlign: "center",
//     borderRight: "1 solid #111111",
//     fontSize: 9,
//   },
//   td: {
//     padding: 5,
//     borderRight: "1 solid #111111",
//     lineHeight: 1.3,
//     fontSize: 9,
//   },
//   tdCenter: {
//     padding: 5,
//     textAlign: "center",
//     borderRight: "1 solid #111111",
//     fontSize: 9,
//   },
//   tdRight: {
//     padding: 5,
//     textAlign: "right",
//     borderRight: "1 solid #111111",
//     fontSize: 9,
//   },
//   noRightBorder: {
//     borderRightWidth: 0,
//   },
//   colSr: { width: "6%" },
//   colProduct: { width: "36%" },
//   colQty: { width: "8%" },
//   colVariant: { width: "10%" },
//   colPrice: { width: "12%" },
//   colDiscount: { width: "12%" },
//   colGst: { width: "8%" },
//   colTotal: { width: "8%" },
//   productName: {
//     fontFamily: "Helvetica-Bold",
//     fontSize: 9,
//   },

//   // ── TOTALS ─────────────────────────────────────────────────────────────────
//   totalsWrap: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     borderBottom: "1 solid #111111",
//   },
//   totalsBox: {
//     width: 220,
//     borderLeft: "1 solid #111111",
//   },
//   totalLine: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 5,
//     borderBottom: "1 solid #111111",
//     fontSize: 9,
//   },
//   grandTotal: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 6,
//     fontSize: 11,
//     fontFamily: "Helvetica-Bold",
//   },

//   // ── DECLARATION (pinned to bottom) ─────────────────────────────────────────
//   declaration: {
//     flexDirection: "row",
//     borderTop: "1 solid #111111",
//     marginTop: "auto",
//   },
//   declarationLeft: {
//     width: "60%",
//     padding: 9,
//     borderRight: "1 solid #111111",
//   },
//   declarationLeftTitle: {
//     fontSize: 9,
//     fontFamily: "Helvetica-Bold",
//     marginBottom: 4,
//     textTransform: "uppercase",
//   },
//   declarationLeftText: {
//     fontSize: 8.5,
//     lineHeight: 1.5,
//     color: "#333333",
//   },
//   declarationRight: {
//     width: "40%",
//     padding: 9,
//     alignItems: "flex-end",
//     justifyContent: "space-between",
//   },
//   signatureTitle: {
//     fontSize: 9,
//     fontFamily: "Helvetica-Bold",
//     textTransform: "uppercase",
//   },
//   signatureSpace: {
//     height: 48,
//   },
//   signatureLine: {
//     paddingTop: 4,
//     borderTop: "1 solid #111111",
//     fontSize: 8.5,
//     width: "100%",
//     textAlign: "right",
//   },

//   // ── PAGE FOOTER ────────────────────────────────────────────────────────────
//   pageFooter: {
//     marginTop: 8,
//     textAlign: "center",
//     fontSize: 7.5,
//     color: "#777777",
//   },
// });

// export default function InvoicePDF({ orderData }) {
//   const address = buildAddress(orderData?.address);

//   return (
//     <Document title={`Invoice-${orderData?.orderId || ""}`}>
//       <Page size="A4" style={styles.page}>

//         {/* ── HEADER ── */}
//         <View style={styles.header}>
//           <View style={styles.topHeader}>
//             <View style={styles.brandBlock}>
//               <Image src={Logo} style={styles.logo} />
//               <View>
//                 <Text style={styles.brandName}>Melforesta</Text>
//                 <Text style={styles.tagline}>From Hives To Home</Text>
//               </View>
//             </View>
//             <View style={styles.invoiceTitle}>
//               <Text style={styles.titleText}>TAX INVOICE</Text>
//               <Text style={styles.mutedSmall}>Original For Recipient</Text>
//             </View>
//           </View>
//           <View style={styles.repeatInfo}>
//             <Text style={styles.repeatText}>
//               Invoice No: INV-{orderData?.orderId}
//             </Text>
//             <Text style={styles.repeatText}>
//               Order ID: #{orderData?.orderId}
//             </Text>
//             <Text style={styles.repeatText}>
//               Invoice Date: {formatDate(orderData?.createdAt)}
//             </Text>
//           </View>
//         </View>

//         {/* ── BODY SHELL ── */}
//         <View style={styles.invoiceShell}>

//           {/* Seller */}
//           <View style={styles.twoCol}>
//             <View style={styles.cellHalfBorder}>
//               <Text style={styles.sectionTitle}>Sold By / Seller</Text>
//               <Text style={styles.sellerName}>
//                 SK FOODS AND SPICES PRIVATE LIMITED
//               </Text>
//               <Text style={styles.line}>
//                 SHOP NO 02 BUILDING A KONARK TOWER II BALEWADI, Pune City,
//                 Maharashtra, India - 411045.
//               </Text>
//             </View>
//             <View style={styles.cellHalf}>
//               <Text style={styles.line}>
//                 <Text style={styles.label}>GSTIN: </Text>
//               </Text>
//               <Text style={styles.line}>
//                 <Text style={styles.label}>CIN: </Text>
//                 U01400PN2016PTC167284
//               </Text>
//               <Text style={styles.line}>
//                 <Text style={styles.label}>PAN: </Text>
//               </Text>
//             </View>
//           </View>

//           {/* Bill To / Ship To */}
//           <View style={styles.twoCol}>
//             <View style={styles.cellHalfBorder}>
//               <Text style={styles.sectionTitle}>Bill To</Text>
//               <Text style={styles.customerName}>
//                 {orderData?.user?.name || ""}
//               </Text>
//               <Text style={styles.address}>{address}</Text>
//               <Text style={[styles.line, { marginTop: 4 }]}>
//                 <Text style={styles.label}>Mobile: </Text>
//                 {orderData?.user?.mobileNumber || ""}
//               </Text>
//               <Text style={styles.line}>
//                 <Text style={styles.label}>Email: </Text>
//                 {orderData?.user?.email || ""}
//               </Text>
//             </View>
//             <View style={styles.cellHalf}>
//               <Text style={styles.sectionTitle}>Ship To</Text>
//               <Text style={styles.customerName}>
//                 {orderData?.user?.name || ""}
//               </Text>
//               <Text style={styles.address}>{address}</Text>
//               <Text style={[styles.line, { marginTop: 4 }]}>
//                 <Text style={styles.label}>Mobile: </Text>
//                 {orderData?.user?.mobileNumber || ""}
//               </Text>
//             </View>
//           </View>

//           {/* Items Table */}
//           <View style={styles.table}>
//             <View style={styles.tableHeader}>
//               <Text style={[styles.th, styles.colSr]}>Sr.</Text>
//               <Text style={[styles.th, styles.colProduct]}>
//                 Product Description
//               </Text>
//               <Text style={[styles.th, styles.colQty]}>Qty</Text>
//               <Text style={[styles.th, styles.colVariant]}>Variant</Text>
//               <Text style={[styles.th, styles.colPrice]}>Price</Text>
//               <Text style={[styles.th, styles.colDiscount]}>Discount</Text>
//               <Text style={[styles.th, styles.colGst]}>GST</Text>
//               <Text style={[styles.th, styles.colTotal, styles.noRightBorder]}>
//                 Total
//               </Text>
//             </View>

//             {orderData?.items?.map((item, index) => (
//               <View
//                 key={`${item.product?.productName}-${index}`}
//                 style={styles.tableRow}
//                 wrap={false}
//               >
//                 <Text style={[styles.tdCenter, styles.colSr]}>
//                   {index + 1}
//                 </Text>
//                 <View style={[styles.td, styles.colProduct]}>
//                   <Text style={styles.productName}>
//                     {item.product?.productName || ""}
//                   </Text>
//                 </View>
//                 <Text style={[styles.tdCenter, styles.colQty]}>
//                   {item.quantity}
//                 </Text>
//                 <Text style={[styles.tdCenter, styles.colVariant]}>
//                   {item.variant?.weight || "—"}
//                 </Text>
//                 <Text style={[styles.tdRight, styles.colPrice]}>
//                   <Money value={item.price} />
//                 </Text>
//                 <Text style={[styles.tdRight, styles.colDiscount]}>
//                   <Money value={item.discount} />
//                 </Text>
//                 <Text style={[styles.tdCenter, styles.colGst]}>
//                   {item.product?.gstPercent ?? 0}%
//                 </Text>
//                 <Text
//                   style={[
//                     styles.tdRight,
//                     styles.colTotal,
//                     styles.noRightBorder,
//                   ]}
//                 >
//                   <Money value={item.totalPrice} />
//                 </Text>
//               </View>
//             ))}
//           </View>

//           {/* Totals */}
//           <View style={styles.totalsWrap} wrap={false}>
//             <View style={styles.totalsBox}>
//               <View style={styles.totalLine}>
//                 <Text>Subtotal</Text>
//                 <Money value={orderData?.subTotal} />
//               </View>
//               <View style={styles.totalLine}>
//                 <Text>GST</Text>
//                 <Money value={orderData?.gstAmount} />
//               </View>
//               <View style={styles.totalLine}>
//                 <Text>Handling Charges</Text>
//                 <Money value={orderData?.handlingCharges} />
//               </View>
//               <View style={styles.totalLine}>
//                 <Text>Discount</Text>
//                 <Money value={orderData?.discountAmount} negative />
//               </View>
//               <View style={styles.grandTotal}>
//                 <Text>Total Paid</Text>
//                 <Money value={orderData?.totalAmount} />
//               </View>
//             </View>
//           </View>

//           {/* Declaration — pushed to bottom via marginTop: auto on parent */}
//           <View style={styles.declaration} wrap={false}>
//             <View style={styles.declarationLeft}>
//               <Text style={styles.declarationLeftTitle}>Declaration</Text>
//               <Text style={styles.declarationLeftText}>
//                 We declare that this invoice shows the actual price of the goods
//                 described and that all particulars are true and correct.
//               </Text>
//               <Text style={[styles.declarationLeftText, { marginTop: 6 }]}>
//                 Thank you for shopping with Melforesta.
//               </Text>
//             </View>
//             <View style={styles.declarationRight}>
//               <Text style={styles.signatureTitle}>For Melforesta</Text>
//               <View style={styles.signatureSpace} />
//               <Text style={styles.signatureLine}>Authorized Signature</Text>
//             </View>
//           </View>

//         </View>

//         {/* ── PAGE FOOTER ── */}
//         <Text style={styles.pageFooter}>
//           This is a computer generated invoice. No signature required.
//         </Text>

//       </Page>
//     </Document>
//   );
// }

import React from "react";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { Logo } from "../../assets/common";

function formatNumber(value) {
  return Math.round(Number(value || 0)).toLocaleString("en-IN");
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString("en-IN") : "";
}

function buildAddress(address = {}) {
  return [
    address.flatNo ? `FLAT NO. ${address.flatNo}` : "",
    address.buildingName || "",
    address.streetName || "",
    address.city || "",
    address.state && address.pincode
      ? `${address.state} - ${address.pincode}`
      : address.state || address.pincode || "",
  ]
    .filter(Boolean)
    .join(", ");
}

function Money({ value, negative = false }) {
  return (
    <Text>
      {negative ? "-" : ""}Rs. {formatNumber(value)}
    </Text>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    color: "#111111",
    fontFamily: "Helvetica",
    fontSize: 9.5,
    padding: 24,
    flexDirection: "column",
  },

  // ── HEADER ─────────────────────────────────────────────────────────────────
  header: {
    border: "1 solid #111111",
    marginBottom: 10,
  },
  topHeader: {
    minHeight: 52,
    padding: 8,
    borderBottom: "1 solid #111111",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    width: 38,
    height: 38,
    objectFit: "contain",
  },
  brandName: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  tagline: {
    marginTop: 2,
    fontSize: 8.5,
  },
  invoiceTitle: {
    textAlign: "right",
  },
  titleText: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  mutedSmall: {
    marginTop: 2,
    fontSize: 8,
    color: "#444444",
  },
  repeatInfo: {
    padding: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  repeatText: {
    fontSize: 8.5,
  },

  // ── BODY SHELL ─────────────────────────────────────────────────────────────
  invoiceShell: {
    border: "1 solid #111111",
    flex: 1,
    flexDirection: "column",
  },

  // ── COMMON ─────────────────────────────────────────────────────────────────
  twoCol: {
    flexDirection: "row",
    borderBottom: "1 solid #111111",
  },
  cellHalf: {
    width: "50%",
    padding: 6,
  },
  cellHalfBorder: {
    width: "50%",
    padding: 6,
    borderRight: "1 solid #111111",
  },
  sectionTitle: {
    marginBottom: 4,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  sellerName: {
    marginBottom: 3,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  line: {
    marginBottom: 3,
    lineHeight: 1.3,
    fontSize: 9,
  },
  label: {
    fontFamily: "Helvetica-Bold",
  },
  customerName: {
    marginBottom: 3,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  address: {
    lineHeight: 1.4,
    textTransform: "uppercase",
    fontSize: 9,
  },

  // ── TABLE ──────────────────────────────────────────────────────────────────
  table: {
    width: "100%",
    borderBottom: "1 solid #111111",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    borderBottom: "1 solid #111111",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #111111",
    minHeight: 24,
  },
  th: {
    padding: 5,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    borderRight: "1 solid #111111",
    fontSize: 9,
  },
  td: {
    padding: 5,
    borderRight: "1 solid #111111",
    lineHeight: 1.3,
    fontSize: 9,
  },
  tdCenter: {
    padding: 5,
    textAlign: "center",
    borderRight: "1 solid #111111",
    fontSize: 9,
  },
  tdRight: {
    padding: 5,
    textAlign: "right",
    borderRight: "1 solid #111111",
    fontSize: 9,
  },
  noRightBorder: {
    borderRightWidth: 0,
  },
  colSr: { width: "6%" },
  colProduct: { width: "36%" },
  colQty: { width: "8%" },
  colVariant: { width: "10%" },
  colPrice: { width: "12%" },
  colDiscount: { width: "12%" },
  colGst: { width: "8%" },
  colTotal: { width: "8%" },
  productName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },

  // ── TOTALS ─────────────────────────────────────────────────────────────────
  totalsWrap: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderBottom: "1 solid #111111",
  },
  totalsBox: {
    width: 220,
    borderLeft: "1 solid #111111",
  },
  totalLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    borderBottom: "1 solid #111111",
    fontSize: 9,
  },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },

  // ── DECLARATION (pinned to bottom) ─────────────────────────────────────────
  declaration: {
    flexDirection: "row",
    borderTop: "1 solid #111111",
    marginTop: "auto",
  },
  declarationLeft: {
    width: "60%",
    padding: 9,
    borderRight: "1 solid #111111",
  },
  declarationLeftTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  declarationLeftText: {
    fontSize: 8.5,
    lineHeight: 1.5,
    color: "#333333",
  },
  declarationRight: {
    width: "40%",
    padding: 9,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  signatureTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  signatureSpace: {
    height: 48,
  },
  signatureLine: {
    paddingTop: 4,
    borderTop: "1 solid #111111",
    fontSize: 8.5,
    width: "100%",
    textAlign: "right",
  },

  // ── PAGE FOOTER ────────────────────────────────────────────────────────────
  pageFooter: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 7.5,
    color: "#777777",
  },
});

export default function InvoicePDF({ orderData }) {
  const address = buildAddress(orderData?.address);

  return (
    <Document title={`Invoice-${orderData?.orderId || ""}`}>
      <Page size="A4" style={styles.page}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View style={styles.topHeader}>
            <View style={styles.brandBlock}>
              <Image src={Logo} style={styles.logo} />
              <View>
                <Text style={styles.brandName}>Melforesta</Text>
                <Text style={styles.tagline}>From Hives To Home</Text>
              </View>
            </View>
            <View style={styles.invoiceTitle}>
              <Text style={styles.titleText}>TAX INVOICE</Text>
              <Text style={styles.mutedSmall}>Original For Recipient</Text>
            </View>
          </View>
          <View style={styles.repeatInfo}>
            <Text style={styles.repeatText}>
              Invoice No: INV-{orderData?.orderId}
            </Text>
            <Text style={styles.repeatText}>
              Order ID: #{orderData?.orderId}
            </Text>
            <Text style={styles.repeatText}>
              Invoice Date: {formatDate(orderData?.createdAt)}
            </Text>
          </View>
        </View>

        {/* ── BODY SHELL ── */}
        <View style={styles.invoiceShell}>

          {/* Seller */}
          <View style={styles.twoCol}>
            <View style={styles.cellHalfBorder}>
              <Text style={styles.sectionTitle}>Sold By / Seller</Text>
              <Text style={styles.sellerName}>
                SK FOODS AND SPICES PRIVATE LIMITED
              </Text>
              <Text style={styles.line}>
                D-18, Emirate Hills, Old Mumbai - Pune highway, Somatne. Pune - 410506
              </Text>
              <Text style={styles.line}>
                Mobile: +91 7796695552
              </Text>
              
            </View>
            <View style={styles.cellHalf}>
              <Text style={styles.line}>
                <Text style={styles.label}>GSTIN: </Text>
                27AAXCS8258E2ZK
              </Text>
              <Text style={styles.line}>
                <Text style={styles.label}>CIN: </Text>
                U01400PN2016PTC167284
              </Text>
              {/* <Text style={styles.line}>
                <Text style={styles.label}>PAN: </Text>
              </Text> */}
            </View>
          </View>

          {/* Bill To / Ship To */}
          <View style={styles.twoCol}>
            <View style={styles.cellHalfBorder}>
              <Text style={styles.sectionTitle}>Bill To</Text>
              <Text style={styles.customerName}>
                {orderData?.user?.name || ""}
              </Text>
              <Text style={styles.address}>{address}</Text>
              <Text style={[styles.line, { marginTop: 4 }]}>
                <Text style={styles.label}>Mobile: </Text>
                {orderData?.user?.mobileNumber || ""}
              </Text>
              <Text style={styles.line}>
                <Text style={styles.label}>Email: </Text>
                {orderData?.user?.email || ""}
              </Text>
            </View>
            <View style={styles.cellHalf}>
              <Text style={styles.sectionTitle}>Ship To</Text>
              <Text style={styles.customerName}>
                {orderData?.user?.name || ""}
              </Text>
              <Text style={styles.address}>{address}</Text>
              <Text style={[styles.line, { marginTop: 4 }]}>
                <Text style={styles.label}>Mobile: </Text>
                {orderData?.user?.mobileNumber || ""}
              </Text>
            </View>
          </View>

          {/* Items Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, styles.colSr]}>Sr.</Text>
              <Text style={[styles.th, styles.colProduct]}>
                Product Description
              </Text>
              <Text style={[styles.th, styles.colQty]}>Qty</Text>
              <Text style={[styles.th, styles.colVariant]}>Variant</Text>
              <Text style={[styles.th, styles.colPrice]}>Price</Text>
              <Text style={[styles.th, styles.colDiscount]}>Discount</Text>
              <Text style={[styles.th, styles.colGst]}>GST</Text>
              <Text style={[styles.th, styles.colTotal, styles.noRightBorder]}>
                Total
              </Text>
            </View>

            {orderData?.items?.map((item, index) => (
              <View
                key={`${item.product?.productName}-${index}`}
                style={styles.tableRow}
                wrap={false}
              >
                <Text style={[styles.tdCenter, styles.colSr]}>
                  {index + 1}
                </Text>
                <View style={[styles.td, styles.colProduct]}>
                  <Text style={styles.productName}>
                    {item.product?.productName || ""}
                  </Text>
                </View>
                <Text style={[styles.tdCenter, styles.colQty]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.tdCenter, styles.colVariant]}>
                  {item.variant?.weight || "—"}
                </Text>
                <Text style={[styles.tdRight, styles.colPrice]}>
                  <Money value={item.price} />
                </Text>
                <Text style={[styles.tdRight, styles.colDiscount]}>
                  <Money value={item.discount} />
                </Text>
                <Text style={[styles.tdCenter, styles.colGst]}>
                  {Number(item.product?.gstPercent) ?? 0}%
                </Text>
                <Text
                  style={[
                    styles.tdRight,
                    styles.colTotal,
                    styles.noRightBorder,
                  ]}
                >
                  <Money value={item.totalPrice} />
                </Text>
              </View>
            ))}
          </View>

          {/* Totals */}
          <View style={styles.totalsWrap} wrap={false}>
            <View style={styles.totalsBox}>
              <View style={styles.totalLine}>
                <Text>Subtotal</Text>
                <Money value={orderData?.subTotal} />
              </View>
              <View style={styles.totalLine}>
                <Text>GST</Text>
                <Money value={orderData?.gstAmount} />
              </View>
              <View style={styles.totalLine}>
                <Text>Handling Charges</Text>
                <Money value={orderData?.handlingCharges} />
              </View>
              <View style={styles.totalLine}>
                <Text>Discount</Text>
                <Money value={orderData?.discountAmount} negative />
              </View>
              <View style={styles.grandTotal}>
                <Text>Total Paid</Text>
                <Money value={orderData?.totalAmount} />
              </View>
            </View>
          </View>

          {/* Declaration — pushed to bottom via marginTop: auto on parent */}
          <View style={styles.declaration} wrap={false}>
            <View style={styles.declarationLeft}>
              <Text style={styles.declarationLeftTitle}>Declaration</Text>
              <Text style={styles.declarationLeftText}>
                We declare that this invoice shows the actual price of the goods
                described and that all particulars are true and correct.
              </Text>
              <Text style={[styles.declarationLeftText, { marginTop: 6 }]}>
                Thank you for shopping with Melforesta.
              </Text>
            </View>
            <View style={styles.declarationRight}>
              <Text style={styles.signatureTitle}>For Melforesta</Text>
              <View style={styles.signatureSpace} />
              <Text style={styles.signatureLine}>Authorized Signature</Text>
            </View>
          </View>

        </View>

        {/* ── PAGE FOOTER ── */}
        <Text style={styles.pageFooter}>
          This is a computer generated invoice. No signature required.
        </Text>

      </Page>
    </Document>
  );
}