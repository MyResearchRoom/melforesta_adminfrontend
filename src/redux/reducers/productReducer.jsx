import {
  FETCH_PRODUCT_SUCCESS,
  FETCH_PRODUCT_FAILURE,
} from "../actionTypes";

const initialState = {
  product: [],
  error: null,
  message: null,
  totalPages: 1,
  totalRecords : 0,
  currentPage: 1,
};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCT_SUCCESS:
      return {
         ...state,
        product: action.payload.product,
        message: action.payload.message,
        totalPages:action.payload.totalPages,
        currentPage: action.payload.currentPage,
        totalRecords:action.payload.totalRecords,
     };

    case FETCH_PRODUCT_FAILURE:
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
