import { FETCH_COUNTS_SUCCESS, FETCH_COUNTS_FAILURE } from "../actionTypes";

const initialState = {
  counts: {},
  error: null,
};

export const countReducer = (state = initialState, action) => {
  switch(action.type) {
    case FETCH_COUNTS_SUCCESS:
      return { ...state, counts: action.payload, error: null };
    case FETCH_COUNTS_FAILURE:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
