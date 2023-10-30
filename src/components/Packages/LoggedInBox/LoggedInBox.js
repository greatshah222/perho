import { useMyContext } from "../../../contexts/StateHolder";
import { useTranslation } from "react-i18next";
import * as classes from "./LoggedInBox.module.css";

//this package just shows users email address if he is logged in
const LoggedInBox = (props) => {
  const { user } = useMyContext();

  const { t } = useTranslation();

  return (
    <div className={classes.loggedInContainer}>
      <div className={classes.loggedInMessage}>
        {t("packages.LoggedInAs")}:<br />
        <span className={classes.loggedInEmail}>{user.eMail}</span>
      </div>
    </div>
  );
};

export default LoggedInBox;
