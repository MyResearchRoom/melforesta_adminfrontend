import {
  FETCH_ENQUIRIES_SUCCESS ,
  FETCH_ENQUIRIES_FAILURE
} from "../actionTypes";

const initialState = {
  enquiry: [],
  error: null,
  message: null,
  totalPages: 1,
  totalRecords : 0,
  currentPage: 1,
};

export const enquiryReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ENQUIRIES_SUCCESS:
      return {
         ...state,
        enquiry: action.payload.enquiry,
        message: action.payload.message,
        totalPages:action.payload.totalPages,
        currentPage: action.payload.currentPage,
        totalRecords:action.payload.totalRecords,
     };

    case FETCH_ENQUIRIES_FAILURE:
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
