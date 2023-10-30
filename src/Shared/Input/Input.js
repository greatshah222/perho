import React, { useReducer, useEffect } from 'react';
import { validate } from '../Validation/Validator';
import classes from './Input.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const inputReducer = (state, action) => {
  const { type, value, validators } = action;
  switch (type) {
    case 'CHANGE':
      return {
        ...state,
        value,
        isValid: validate(value, validators),
      };
    case 'TOUCH':
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

export const Input = ({
  onInput,
  id,
  validators,

  type,
  element,
  placeholder,
  rows,
  errorText,
  label,
  initialValid,
  initialValue,
  iconName,
  selectData,
  disabled,
}) => {
  const initialState = {
    value: initialValue || '',
    isValid: initialValid || false,
    isTouched: false,
  };
  const [state, dispatch] = useReducer(inputReducer, initialState);

  const { value, isValid, isTouched } = state;
  // as soon as the Input element is loaded it takes the value from the state and sends to the onInput which is our
  useEffect(() => {
    // if the function onInput is called it will the function InputHandler in form-hook(for validity check). ALl the data will be passed from here. This function Inputs all handle one input whereas onInput which in returns InputHandler is responsible for handling all the form
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);
  const changehandler = (e) => {
    dispatch({
      type: 'CHANGE',
      value: e.target.value,
      validators,
    });
  };
  const touchedHandler = () => {
    dispatch({ type: 'TOUCH' });
  };
  let elements;

  if (element === 'input') {
    elements = (
      <div
        className={`${classes.formInput} ${
          !isValid && isTouched && classes.formInputInvalid
        } `}
      >
        {!iconName ? (
          <p>{label}</p>
        ) : (
          <p>
            {<FontAwesomeIcon icon={iconName} className={classes.iconColor} />}
          </p>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          onChange={changehandler}
          onBlur={touchedHandler}
          value={value}
          disabled={disabled}
        />
      </div>
    );
  } else if (element === 'textarea') {
    elements = (
      <textarea
        id={id}
        onChange={changehandler}
        onBlur={touchedHandler}
        value={value}
        rows={rows || 3}
      />
    );
  } else if (element === 'select') {
    elements = (
      <div
        className={`${classes.formInput} ${
          !isValid && isTouched && classes.formInputInvalid
        } `}
      >
        {!iconName ? (
          <p>{label}</p>
        ) : (
          <p>
            {<FontAwesomeIcon icon={iconName} className={classes.iconColor} />}
          </p>
        )}
        <select value={value} onChange={changehandler} onBlur={touchedHandler}>
          <option value={placeholder} />
          {selectData.map((el) => (
            <option key={el} value={el}>
              {el}
            </option>
          ))}
        </select>
      </div>
    );
  } else if (element === 'select') {
    elements = (
      <div
        className={`${classes.formInput} ${
          !isValid && isTouched && classes.formInputInvalid
        } `}
      >
        {!iconName ? (
          <p>{label}</p>
        ) : (
          <p>
            {<FontAwesomeIcon icon={iconName} className={classes.iconColor} />}
          </p>
        )}
        <select value={value} onChange={changehandler} onBlur={touchedHandler}>
          <option value={placeholder} />
          {selectData.map((el) => (
            <option key={el} value={el}>
              {el}
            </option>
          ))}
        </select>
      </div>
    );
  }
  return (
    <>
      {elements}
      {!isValid && isTouched && (
        <p
          className={classes.errorText}
          // style={{
          //   marginTop: '-30px',
          //   textAlign: 'center',
          //   padding: '3px',
          //   color: 'red',
          //   fontSize: '80%',
          // }}
        >
          {errorText}
        </p>
      )}
    </>
  );
};
