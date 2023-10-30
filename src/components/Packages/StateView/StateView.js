import { useTranslation } from "react-i18next";
import * as classes from "./StateView.module.css";

const StateView = (props) => {
  const { pageState, changePageState } = props;

  const { t } = useTranslation();

  return (
    <div className={classes.stateViewContainer}>
      <div
        className={`${classes.stateView} ${
          pageState === "packages" ? classes.stateViewSelected : ""
        }`}
        onClick={() => changePageState("packages")}
      >
        {t("packages.PackageChoosePackage")}
      </div>
      <div
        className={`${classes.stateView} ${
          pageState === "payment" ? classes.stateViewSelected : ""
        }`}
      >
        {t("packages.PackagePayment")}
      </div>
      <div
        className={`${classes.stateView} ${
          pageState === "receipt" ? classes.stateViewSelected : ""
        }`}
      >
        {t("packages.PackageReceipt")}
      </div>
    </div>
  );
};

export default StateView;
