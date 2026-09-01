import {
  FETCH_STOCK_SUCCESS,
  FETCH_STOCK_FAILURE
} from "../actionTypes";

const initialState = {
  stock: [],
  error: null,
  message: null,
  totalPages: 1,
  totalRecords : 0,
  currentPage: 1,
};

export const stockReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_STOCK_SUCCESS:
      return {
         ...state,
        stock: action.payload.stock,
        message: action.payload.message,
        totalPages:action.payload.totalPages,
        currentPage: action.payload.currentPage,
        totalRecords:action.payload.totalRecords,
     };

    case FETCH_STOCK_FAILURE:
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
