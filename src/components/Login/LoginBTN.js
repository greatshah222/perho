import { useMyContext } from "../../contexts/StateHolder";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCookies } from 'react-cookie';

// Renders contentRatings of chosen item
const Login = (props) => {

  // Bring stateholders from context
  const { user, setUser } = useMyContext();

  const history = useHistory();

  const { t } = useTranslation();

  const [cookies, removeCookie] = useCookies("");

  const logOut = () => {
    // Set userdata by forming new object from old userData, so react understands state change.
    let usr = { ...user };

    // Change user's loggedIn status to false and clear userToken
    //usr.loggedIn = false;
    //usr.userToken = "";
    usr = {};

    // Update user into context values
    setUser(usr);

    // If there's cookie with userData, remove it
    if (cookies?.userData) {
      removeCookie("userData")
    }
  };

  const clickProfile = () => {
    history.push(`/${props.routes.profile}`)
  };

  return (
    <div className="loginContainer">
      <div
        className="profileBTN"
        onClick={() => clickProfile()}
        style={user.loggedIn ? { display: "flex" } : { display: "none" }}
      >
        {t("Profile")}
      </div>

      <div className="loginBTN"
        onClick={() => { user.loggedIn ? logOut() : history.push(`/${props.routes.login}`) }}
      >
        {user.loggedIn ? t("Logout") : t("Login")}
      </div>
    </div>
  );
}

export default Login;

