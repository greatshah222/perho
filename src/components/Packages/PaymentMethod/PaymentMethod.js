import { getImageByKey } from "../../../scripts/getImageByKey";
import * as classes from "./PaymentMethod.module.css";

//single payment method
const PaymentMethod = (props) => {
  const { paymentMethod, buyFunction } = props;

  const imageKey = "paymentMethod" + paymentMethod.name;

  return (
    <div className={classes.paymentMethodContainer}>
      <div
        className={classes.paymentMethodBuy}
        onClick={() => buyFunction(paymentMethod.id, paymentMethod.key)}
      >
        <img
          className={classes.paymentMethodImage}
          src={getImageByKey(imageKey)}
          alt={paymentMethod.name}
        />
      </div>
    </div>
  );
};

export default PaymentMethod;
