import {
  FETCH_PINCODE_FAILURE,
  FETCH_PINCODE_SUCCESS,
} from "../actionTypes";

const initialState = {
  pincodes: [],
  error: null,
  message: null,
  totalPages: 1,
  totalRecords : 0,
  currentPage: 1,
};

export const pincodeReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PINCODE_SUCCESS:
      return {
         ...state,
        pincodes: action.payload.pincodes,
        message: action.payload.message,
        totalPages:action.payload.totalPages,
        currentPage: action.payload.currentPage,
        totalRecords:action.payload.totalRecords,
     };

    case FETCH_PINCODE_FAILURE:
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
