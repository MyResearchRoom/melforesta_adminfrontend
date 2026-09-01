import { combineReducers } from "redux";
import { loggedUserReducer } from "./loggedUderReducer";
import { categoryReducer } from "./categoryReducer";
import { productReducer } from "./productReducer";
import { stockReducer } from "./stockReducer";
import { enquiryReducer } from "./enquiriesReducer";
import { countReducer } from "./countReducer";
import { orderProductProcessReducer } from "./orderProductProcessReducer";
import { canceledProductReducer } from "./cancleOrderReducer";
import { returnedProductReducer } from "./returnedOrderReducer";
import { pincodeReducer } from "./pincodeReducer";
import { bulkOrderReducer } from "./bulkOrderReducer";
import { accountReducer } from "./accountReducer";
import { couponReducer } from "./couponsReducer";

const rootReducer = combineReducers({
  loggedUserState: loggedUserReducer,
  categoryState:categoryReducer,
  productState:productReducer,
  stockState: stockReducer,
  enquiryState:enquiryReducer,
  countState: countReducer,
  processProductState:orderProductProcessReducer,
  cancleProductState:canceledProductReducer,
  returnProductState:returnedProductReducer,
  pincodestate:pincodeReducer,
  bulkOrderState:bulkOrderReducer,
  accountState:accountReducer,
  couponState:couponReducer,
});

export default rootReducer;
