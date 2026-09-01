import {
  FETCH_LOGGEDUSER_FAILURE,
  FETCH_LOGGEDUSER_SUCCESS,
} from "../actionTypes";

const initialState = {
  user: null,
  error: null,
  message: null,
};

export const loggedUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LOGGEDUSER_SUCCESS:
      return {
        ...state,
        user: action.payload.user, 
        message: action.payload.message,
        error: null,
      };
    case FETCH_LOGGEDUSER_FAILURE:
      return {
        ...state,
        user: null,
        error: action.payload,     
        message: null,
      };
    default:
      return state;
  }
};


