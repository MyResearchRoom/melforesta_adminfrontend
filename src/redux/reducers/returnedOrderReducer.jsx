import {
  FETCH_REURNEDORDERS_SUCCESS,
  FETCH_REURNEDORDERS_FAILURE,
} from "../actionTypes";

const initialState = {
  returnedproduct: [],
  error: null,
  message: null,
  totalPages: 1,
  totalRecords : 0,
  currentPage: 1,
};

export const returnedProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REURNEDORDERS_SUCCESS:
      return {
         ...state,
        returnedproduct: action.payload.returnedproduct,
        message: action.payload.message,
        totalPages:action.payload.totalPages,
        currentPage: action.payload.currentPage,
        totalRecords:action.payload.totalRecords,
     };

    case FETCH_REURNEDORDERS_FAILURE:
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
