//import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMyContext } from "../../../contexts/StateHolder";
import { convertCurrency } from "../../../scripts/utils";
import * as classes from "./SelectedPackage.module.css";

//just prints selected PAckage data. It is used in both receipt and paymentMethods views
const SelectedPackage = () => {
  const { selectedPackage } = useMyContext();

  const { t } = useTranslation();

  if (Object.keys(selectedPackage).length === 0) {
    return null;
  } else {
    const taxPerc = selectedPackage.taxRate;
    const taxType = selectedPackage.taxType;

    return (
      <div className={classes.selectedPackage}>
        <div className={classes.selectedPackageRow}>
          <div className={classes.selectedPackageName}>
            {selectedPackage.name}
          </div>
          <div className={classes.selectedPackagePrice}>
            {selectedPackage.price} {convertCurrency(selectedPackage.currency)}
          </div>
        </div>
        <div className={classes.selectedPackageRow}>
          <div className={classes.selectedPackageCol}></div>
          <div className={classes.selectedPackageVat}>
            {t("packages.IncludeVat", { taxPerc, taxType })}
          </div>
        </div>
      </div>
    );
  }
};

export default SelectedPackage;
