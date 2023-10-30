import { useHistory } from "react-router-dom";
import { getImageByKey } from "../../../scripts/getImageByKey";
import { useTranslation } from "react-i18next";
import * as classes from './GuidesBar.module.css';

const GuidesBar = (props) => {

    const { t } = useTranslation();

    const history = useHistory();

    return (
        <div className={classes.GuidesBar}>
            <div
                className={classes.GuidesBarItemContainer}
                onClick={() => history.push(`/${props.routes.guidesDesktop}`)}
            >
                <img
                    className={classes.GuidesBarImage}
                    src={getImageByKey("guidesDesktop")}
                    title={t("Desktop")}
                    alt="Desktop"
                />
                <div
                    className={classes.GuidesBarItemText1}
                >
                    {t("Desktop")}
                </div>
                <div
                    className={classes.GuidesBarItemText2}
                >
                    {t("Read more")}
                </div>
            </div>

            <div
                className={classes.GuidesBarItemContainer}
                onClick={() => history.push(`/${props.routes.guidesMobile}`)}
            >
                <img
                    className={classes.GuidesBarImage}
                    src={getImageByKey("guidesMobile")}
                    title={t("Mobile")}
                    alt="Mobile"

                    style={props?.styles?.navBar}
                />
                <div
                    className={classes.GuidesBarItemText1}
                >
                    {t("Mobile")}
                </div>
                <div
                    className={classes.GuidesBarItemText2}
                >
                    {t("Read more")}
                </div>
            </div>

            <div
                className={classes.GuidesBarItemContainer}
                onClick={() => history.push(`/${props.routes.guidesChromecast}`)}
            >
                <img
                    className={classes.GuidesBarImage}
                    src={getImageByKey("guidesChromecast")}
                    title={t("Chromecast")}
                    alt="Chromecast"

                    style={props?.styles?.navBar}
                />
                <div
                    className={classes.GuidesBarItemText1}
                >
                    {t("Chromecast")}
                </div>
                <div
                    className={classes.GuidesBarItemText2}
                >
                    {t("Read more")}
                </div>
            </div>
        </div >
    );
}

export default GuidesBar;