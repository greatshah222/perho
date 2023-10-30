import { useTranslation } from "react-i18next";
import { useMyContext } from "../../../contexts/StateHolder";
import PackageComponent from "../PackageComponent/PackageComponent";
import * as classes from "./PackagesView.module.css";

//prints title and all the packages
const PackagesView = (props) => {
  const { buyButtonAction, profileData } = props;
  const { packages } = useMyContext();

  const { t } = useTranslation();

  return (
    <div className={classes.packagesView}>
      <div className={classes.packageHelp}>
        <div className={classes.packageHelpTitle}>{t("packages.PackageHelpTitle")}</div>
        <div className={classes.packageHelpText}>
          {t("packages.PackageHelpText")}
          <br />
          <br />
          {t("packages.PackageHelpText2")}
        </div>
      </div>
      <div key="packages" className={classes.packages}>
        {Object.values(packages).map((value) => (
          <PackageComponent
            key={value.id}
            pkg={value}
            buyButtonAction={buyButtonAction}
            userPackages={profileData.buyerProducts ? profileData.buyerProducts : []}
          />
        ))}
      </div>
    </div>
  );
};

export default PackagesView;
