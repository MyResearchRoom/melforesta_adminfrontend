import {
  FETCH_COUPONS_SUCCESS,
  FETCH_COUPONS_FAILURE,
} from "../actionTypes";

const initialState = {
  coupons: [],
  error: null,
  message: null,
  totalPages: 1,
  totalRecords : 0,
  currentPage: 1,
};


export const couponReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_COUPONS_SUCCESS:
      return {
         ...state,
        coupons: action.payload.coupons,
        message: action.payload.message,
        totalPages:action.payload.totalPages,
        currentPage: action.payload.currentPage,
        totalRecords:action.payload.totalRecords,
     };

    case FETCH_COUPONS_FAILURE:
      return { 
        ...state,
        error: action.payload,
        message:null,
        totalPages: 1,
        totalRecords : 0,
        currentPage: 1,
    };

    default:
      return state;
  }
};
