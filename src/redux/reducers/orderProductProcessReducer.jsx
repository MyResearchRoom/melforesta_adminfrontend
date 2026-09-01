import {
  FETCH_PROCESSORDERS_SUCCESS,
  FETCH_PROCESSORDERS_FAILURE,
} from "../actionTypes";

const initialState = {
  processedproducts: [],
  error: null,
  message: null,
  totalPages: 1,
  totalRecords : 0,
  currentPage: 1,
};

export const orderProductProcessReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROCESSORDERS_SUCCESS:
      return {
         ...state,
        processedproducts: action.payload.processedproducts,
        message: action.payload.message,
        totalPages:action.payload.totalPages,
        currentPage: action.payload.currentPage,
        totalRecords:action.payload.totalRecords,
     };

    case FETCH_PROCESSORDERS_FAILURE:
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
