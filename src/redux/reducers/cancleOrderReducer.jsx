import {
  FETCH_CANCLEORDERS_SUCCESS,
  FETCH_CANCLEORDERS_FAILURE,
} from "../actionTypes";

const initialState = {
  canceledproduct: [],
  error: null,
  message: null,
  totalPages: 1,
  totalRecords : 0,
  currentPage: 1,
};

export const canceledProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CANCLEORDERS_SUCCESS:
      return {
         ...state,
        canceledproduct: action.payload.canceledproduct,
        message: action.payload.message,
        totalPages:action.payload.totalPages,
        currentPage: action.payload.currentPage,
        totalRecords:action.payload.totalRecords,
     };

    case FETCH_CANCLEORDERS_FAILURE:
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
