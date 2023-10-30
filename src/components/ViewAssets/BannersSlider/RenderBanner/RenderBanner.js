export default function RenderBanner({ item, clickItem }) {
  return (
    <img
      className='bannerItem'
      key={item.id}
      onClick={() => clickItem(item)}
      src={item.bannerImageSmall}
      alt=''
    />
  );
}
