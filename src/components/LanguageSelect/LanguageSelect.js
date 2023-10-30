import { getImageByKey } from "../../scripts/getImageByKey";
import { useTranslation } from 'react-i18next';
import { useMyContext } from "../../contexts/StateHolder";

const LanguageSelect = () => {

    // Bring stateholders from context
    const { setLanguage } = useMyContext();

    const { t, i18n } = useTranslation();

    const changeLanguage = lang => {
        i18n.changeLanguage(lang);
        setLanguage(lang);
    };

    return (

        <div className="languageSelect">
            <img
                className="langFlag"
                src={getImageByKey("flag_fi")}
                title={t("languageSelect.finnish")}
                alt={t("languageSelect.finnish")}
                onClick={() => changeLanguage("fi_FI")}
            />
            <img
                className="langFlag"
                src={getImageByKey("flag_en")}
                title={t("languageSelect.english")}
                alt={t("languageSelect.english")}
                onClick={() => changeLanguage("en_US")}
            />
            <img
                className="langFlag"
                src={getImageByKey("flag_sv")}
                title={t("languageSelect.swedish")}
                alt={t("languageSelect.swedish")}
                onClick={() => changeLanguage("sv_SE")}
            />
            <img
                className="langFlag"
                src={getImageByKey("flag_sv")}
                title={t("languageSelect.greek")}
                alt={t("languageSelect.greek")}
                onClick={() => changeLanguage("el_GR")}
            />
        </div>
    );
}

export default LanguageSelect;