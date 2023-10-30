import { useMyContextFunctions } from "../../contexts/ContextFunctions";
import { useMyContext } from "../../contexts/StateHolder";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, Link } from "react-router-dom";
import { getImageByKey } from "../../scripts/getImageByKey";
import { useForm } from '../../Shared/Hooks/form-hook';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL
} from '../../Shared/Validation/Validator';
import { Input } from '../../Shared/Input/Input';
import * as classes from './LoginForm.module.css';

// Renders contentRatings of chosen item
const LoginForm = (props) => {

  // Bring contextFunctions from context
  const { authProcess } = useMyContextFunctions();

  // Bring contextFunctions from context
  const { goBackToPrevious, setGoBackToPrevious, user } = useMyContext();

  const [loginMessage, setLoginMessage] = useState("");

  // we need to import UseForm hook and pass the initial inputs and initialFormValidity to userform
  const [state, InputHandler] = useForm(
    {
      EMAIL: {
        value: '',
        isValid: false,
      },
      PASSWORD: {
        value: '',
        isValid: false,
      }
    },
    false
    // the last false defines if the whole form is valid or not ( since we have set all isvalid to false so our total form validity will also be false)
  );

  const { t } = useTranslation();

  const history = useHistory();

  useEffect(() => {

    // If user is already loggedIn and comes back to /login -route, redirect user to props redirect route
    if(user.loggedIn) {
      history.push(`${props.redirectRoute}`)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle the click of "Next" button
  const formSubmitHandler = async (e) => {

    e.preventDefault();

    console.log(state.inputs.EMAIL.value, state.inputs.PASSWORD.value)

    try {
      // Do the signUp/login process
      const authResponse = await authProcess(state.inputs.EMAIL.value, state.inputs.PASSWORD.value);

      if (authResponse.data.status === "error") {
        setLoginMessage(authResponse.data.message);
      } else {
        // Set goBackToPrevious to it's default state
        setGoBackToPrevious(false);
        // If user entered to this page from somewhere where he needs to be taken back, use goBack. Otherwise redirect to home route
        goBackToPrevious ? history.goBack() : history.push(`${props.redirectRoute}`)
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="loginViewBackground"
      style={{ backgroundImage: `url(${getImageByKey("signUpBackground")})` }}
    >
      <div className="loginViewContainer">

        <div className={classes.formPrimary}>
          <div className={classes.formSecondary}>
            <div className="loginMessage">{loginMessage}</div>
            <form className={classes.formBlog} onSubmit={formSubmitHandler}>
              <h2 className={classes.formHeader}>{t("Login")}</h2>

              <Input
                id='EMAIL'
                label='EMAIL'
                placeholder={t('Enter your email here')}
                type='text'
                element='input'
                validators={[VALIDATOR_EMAIL(), VALIDATOR_REQUIRE()]}
                errorText={t("IncorrectEmailAddress")}
                onInput={InputHandler}
                iconName='envelope'

              />
              <Input
                id='PASSWORD'
                label='PASSWORD'
                placeholder={t('Enter your password here')}
                type='Password'
                element='input'
                validators={[VALIDATOR_REQUIRE()]}
                errorText={t("Please check your password and try again")}
                onInput={InputHandler}
                iconName='lock'
              />

              <button
                className={classes.loginFormBTN}
                disabled={!state.isValid}
              >
                {t("Login")}
              </button>

              <div className={classes.loginRow}>{`${t("New user in site?")} `} <Link to={`${props.routes.signUp}`}>{t("SignUp now")}</Link></div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;