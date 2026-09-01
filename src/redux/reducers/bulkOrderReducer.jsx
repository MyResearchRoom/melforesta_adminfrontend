import {
  FETCH_BULKORDERS_FAILURE ,
  FETCH_BULKORDERS_SUCCESS
} from "../actionTypes";

const initialState = {
  bulkOrders: [],
  error: null,
  message: null,
  totalPages: 1,
  totalRecords : 0,
  currentPage: 1,
};

export const bulkOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BULKORDERS_SUCCESS:
      return {
         ...state,
        bulkOrders: action.payload.bulkOrders,
        message: action.payload.message,
        totalPages:action.payload.totalPages,
        currentPage: action.payload.currentPage,
        totalRecords:action.payload.totalRecords,
     };

    case FETCH_BULKORDERS_FAILURE:
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
