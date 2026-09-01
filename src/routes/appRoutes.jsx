import { Route, Routes } from "react-router-dom";
import {ADMIN,PRODUCT_MANAGER} from "../constants/role";
import { Suspense } from "react";
import ProtectedRoute from "./protectedRoutes";
import AdminDashboard from "../pages/admin/dashboard";
import ProductManagerDashboard from "../pages/product-manager/dashboard";
import UnauthorizedPage from "../pages/unauthrizedPage";
import Staff from "../pages/admin/staff";
import Category from "../pages/admin/category";
import Product from "../pages/admin/product";
import ProductManagerCategory from "../pages/product-manager/category";
import ProductManagerProduct from "../pages/product-manager/product";
import ProductManagerOrder from "../pages/product-manager/order";
import ViewProcess from "../components/features/product manager/process/viewProcess";
import ProductManagerCancellledOrders from "../pages/product-manager/cancelledOrders";
import CancelOrderViewDetail from "../components/features/product manager/cancleOrder/ViewDetail";
import ProductManageReturnOrders from "../pages/product-manager/returnOrders";
import ReturnOrderViewDetail from "../components/features/product manager/returnOrder/viewDetail";
import StockPage from "../pages/admin/stock";
import ViewStock from "../components/features/admin/stock/viewStock";
import AdminEnquiry from "../pages/admin/enquiry";
import ProfilePage from "../pages/profilePage";
import SettingPage from "../pages/setting";
import AdminProcess from "../pages/admin/process";
import AdminCancelOrders from "../pages/admin/cancelOrders";
import AdminRetuneOrders from "../pages/admin/retuneOrders";
import AdminCancelOrderViewDetail from "../components/features/admin/cancle-Order/ViewDetail";
import AdminReturnOrderViewDetail from "../components/features/admin/return-Order/viewDetail";
import AdminViewProcess from "../components/features/admin/process/viewProcess";
import PincodePage from "../pages/admin/pincode";
import AdminBulkOrders from "../pages/admin/bulkOrders";
import ProductDetails from "../components/features/admin/product/productDetails";
import Account from "../pages/admin/account";
import PaymentTransactionDetails from "../components/features/admin/Account/viewDetails";
import CouponsPage from "../pages/admin/coupons";

const AppRoutes = () => {
  const userData = localStorage.getItem("adminuser");
  const user = userData ? JSON.parse(userData) : null;

  return (
  <Suspense fallback={<div>Loading...</div>}>
  <Routes>
    <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[ADMIN]}
            element={<AdminDashboard />}
          />
        }
      />

      <Route
        path="/admin/staff"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[ADMIN]}
            element={<Staff />}
          />
        }
      />

      <Route
        path="/admin/category"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[ADMIN]}
            element={<Category />}
          />
        }
      />

      <Route
        path="/admin/product"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[ADMIN]}
            element={<Product />}
          />
        }
      />
      <Route
        path="/product-details/:id"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[ADMIN,PRODUCT_MANAGER]}
            element={<ProductDetails />}
          />
        }
      />

      <Route
        path="/product-manager/dashboard"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[PRODUCT_MANAGER]}
            element={<ProductManagerDashboard/>}
          />
        }
      />
      <Route
        path="/product-manager/category"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[PRODUCT_MANAGER]}
            element={<ProductManagerCategory/>}
          />
        }
      />
      <Route
        path="/product-manager/product"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[PRODUCT_MANAGER]}
            element={<ProductManagerProduct/>}
          />
        }
      />

      <Route
        path="/product-manager/order"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[PRODUCT_MANAGER]}
            element={<ProductManagerOrder/>}
          />
        }
      />
      <Route
        path="/product-manager/processview/:id"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[PRODUCT_MANAGER]}
            element={<ViewProcess/>}
          />
        }
      />
      <Route
        path="/product-manager/cancelled-order"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[PRODUCT_MANAGER]}
            element={<ProductManagerCancellledOrders/>}
          />
        }
      />
      <Route
        path="/product-manager/cancelled-order-details/:id"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[PRODUCT_MANAGER]}
            element={<CancelOrderViewDetail/>}
          />
        }
      />
      <Route
        path="/product-manager/return-order"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[PRODUCT_MANAGER]}
            element={<ProductManageReturnOrders/>}
          />
        }
      />
      <Route
        path="/product-manager/return-order-Product-detail/:id"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[PRODUCT_MANAGER]}
            element={<ReturnOrderViewDetail/>}
          />
        }
      />

      <Route
        path="/stock"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[PRODUCT_MANAGER,ADMIN]}
            element={<StockPage/>}
          />
        }
      />
      

      <Route
        path="/stockview/:productId/:variantId"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[PRODUCT_MANAGER,ADMIN]}
            element={<ViewStock/>}
          />
        }
      />

      <Route
        path="/pincode"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[PRODUCT_MANAGER,ADMIN]}
            element={<PincodePage/>}
          />
        }
      />

      <Route
        path="/bulk-orders"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[ADMIN,PRODUCT_MANAGER]}
            element={<AdminBulkOrders/>}
          />
        }
      />

      <Route 
      path="/accounts"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[ADMIN,PRODUCT_MANAGER]}
            element={<Account/>}
          />
        }
      />

      <Route
        path="/enquiries"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[ADMIN]}
            element={<AdminEnquiry/>}
          />
        }
      />

      <Route
        path="/payment-history-details"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[ADMIN,PRODUCT_MANAGER]}
            element={<PaymentTransactionDetails/>}
          />
        }
      />

      <Route
        path="/coupons"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[ADMIN, PRODUCT_MANAGER]}
            element={<CouponsPage />}
          />
        }
      />
      

      <Route
        path="/profile"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[ADMIN,PRODUCT_MANAGER]}
            element={<ProfilePage/>}
          />
        }
      />

      <Route
        path="/setting"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[ADMIN,PRODUCT_MANAGER]}
            element={<SettingPage/>}
          />
        }
      />
      <Route
        path="/admin/process"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[ADMIN]}
            element={<AdminProcess/>}
          />
        }
      />
      <Route
        path="/admin/processview/:id"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[ADMIN]}
            element={<AdminViewProcess/>}
          />
        }
      />
      <Route
        path="/admin/cancel-orders"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[ADMIN]}
            element={<AdminCancelOrders/>}
          />
        }
      />
      <Route
        path="/admin/cancelled-order-details/:id"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[ADMIN]}
            element={<AdminCancelOrderViewDetail/>}
          />
        }
      />
      <Route
        path="/admin/return-orders"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[ADMIN]}
            element={<AdminRetuneOrders/>}
          />
        }
      />

      <Route
        path="/admin/return-order-Product-detail/:id"
        element={
          <ProtectedRoute
            user={user}
            allowedRole={[ADMIN]}
            element={<AdminReturnOrderViewDetail/>}
          />
        }
      />
      
  </Routes>
  </Suspense>
   
  );
};

export default AppRoutes;
