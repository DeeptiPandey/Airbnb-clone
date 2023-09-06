export default function Image({src,...rest}) {
    src = src && src.includes('https://')
      ? src
      : 'https://deepti1399-airbnb-clone.mdbgo.io/uploads/'+src;
    return (
      <img {...rest} src={src} alt={''} />
    );
  }