import { useReducer, useCallback } from 'react';
import {
  CHECK_FORM_VALIDITY,
  INPUT_CHANGE,
  FETCH_DATA_SUCCESS,
} from '../Reducer/actionTypes';

const formReducer = (state, action) => {
  const { type, id, value, isValid } = action;

  switch (type) {
    case INPUT_CHANGE:
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [id]: { value, isValid },
        },
      };
    case CHECK_FORM_VALIDITY:
      const totalFormValid = Object.values(state.inputs).every(
        (el) => el.isValid
      );
      return {
        ...state,
        isValid: totalFormValid,
      };

    default:
      return state;
  }
};

export const useForm = (inputs, isValid) => {
  const initialState = {
    inputs,
    isValid,
  };
  const [state, dispatch] = useReducer(formReducer, initialState);

  const InputHandler = useCallback((id, value, isValid) => {
    // change the state input value
    dispatch({
      type: INPUT_CHANGE,
      id,
      value,
      isValid,
    });
    // check whole form validity
    dispatch({
      type: CHECK_FORM_VALIDITY,
      isValid,
    });
  }, []);

  // our data are not fetched instantly from the backend so we cannot use the useForm hook directly cause we are expecting value and also we cannot set useForm in any if or loops. to overcome this problem we will set our state of updatePlace to invalid data and as soon as we fetch the data from the back end we have to update the state
  const setFormData = useCallback((inputs, isValid) => {
    dispatch({
      type: FETCH_DATA_SUCCESS,
      inputs,
      isValid,
    });
  }, []);

  return [state, InputHandler, setFormData];
};