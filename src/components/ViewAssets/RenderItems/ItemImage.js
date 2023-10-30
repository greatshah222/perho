import { getImageByKey } from "../../../scripts/getImageByKey";

// Renders image of props item
const ItemImage = (props) => {

    const pickImage = (item) => {
        if (item.serie) {
            return item.serie.coverImageSmall;
        } else {
            return item.coverImageSmall ? item.coverImageSmall : item.thumbnailSmall;
        }
    };

    return (
        <img
            effect="blur"
            className="categoryItemImg"
            src={pickImage(props.item) ? pickImage(props.item) : getImageByKey("comingSoon")}
            alt=""
        />
    );
}

export default ItemImage;
