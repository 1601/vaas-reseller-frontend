import React, { useState, useEffect } from 'react';
import { ButtonBase, Card, CardContent } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// import GlobalIcon from "../../../assets/svg/logos/global_icon.png"

const VortexProductBrandCard = ({ title = '', image, onClick = () => {} }) => {
  const [imgUrl, setImgUrl] = useState(image);

  useEffect(() => {
    let mounted = true;
    console.log(imgUrl);

    if (mounted)
      if (title === 'ROW') setImgUrl('https://upload.wikimedia.org/wikipedia/commons/0/0b/Blue_globe_icon.svg');

    return () => {
      mounted = false;
    };
  }, []);
  return (
    <div>
      <Card
        sx={{
          margin: '0.5em',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
          borderRadius: '8px', 
        }}
      >
        <ButtonBase
          onClick={() => {
            onClick();
          }}
        >
          <LazyLoadImage
            src={imgUrl}
            alt={'Vortex Brand Image'}
            width={90}
            height={90}
            onError={(e) => {
              console.log('asdfajsdfajkdjfs');
              console.log(e);
              setImgUrl('https://upload.wikimedia.org/wikipedia/commons/0/0b/Blue_globe_icon.svg');
            }}
          />
        </ButtonBase>
      </Card>
    </div>
  );
};

export default VortexProductBrandCard;
