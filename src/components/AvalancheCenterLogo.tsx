import React, {ReactElement} from 'react';
import {Image, ImageStyle} from 'react-native';

export interface AvalancheCenterLogoProps {
  style: ImageStyle;
  centerId: string;
}

interface size {
  width: number;
  height: number;
}

export const AvalancheCenterLogo: React.FunctionComponent<AvalancheCenterLogoProps> = ({style, centerId}: AvalancheCenterLogoProps) => {
  const sizes: Record<string, size> = {
    ['BTAC']: Image.resolveAssetSource(require('@app/images/logos/BTAC.png')),
    ['CNFAIC']: Image.resolveAssetSource(require('@app/images/logos/CNFAIC.png')),
    ['FAC']: Image.resolveAssetSource(require('@app/images/logos/FAC.png')),
    ['GNFAC']: Image.resolveAssetSource(require('@app/images/logos/GNFAC.png')),
    ['IPAC']: Image.resolveAssetSource(require('@app/images/logos/IPAC.png')),
    ['NWAC']: Image.resolveAssetSource(require('@app/images/logos/NWAC.png')),
    ['MSAC']: Image.resolveAssetSource(require('@app/images/logos/MSAC.png')),
    ['MWAC']: Image.resolveAssetSource(require('@app/images/logos/MWAC.png')),
    ['PAC']: Image.resolveAssetSource(require('@app/images/logos/PAC.png')),
    ['SNFAC']: Image.resolveAssetSource(require('@app/images/logos/SNFAC.png')),
    ['SAC']: Image.resolveAssetSource(require('@app/images/logos/SAC.png')),
    ['WCMAC']: Image.resolveAssetSource(require('@app/images/logos/WCMAC.svg')),
    ['CAIC']: Image.resolveAssetSource(require('@app/images/logos/CAIC.jpg')),
    ['COAA']: Image.resolveAssetSource(require('@app/images/logos/COAA.png')),
    ['CBAC']: Image.resolveAssetSource(require('@app/images/logos/CBAC.png')),
    ['ESAC']: Image.resolveAssetSource(require('@app/images/logos/ESAC.png')),
    ['WAC']: Image.resolveAssetSource(require('@app/images/logos/WAC.png')),
  };

  const images: Record<string, {(s: ImageStyle): ReactElement}> = {
    ['BTAC']: (s: ImageStyle) => {
      return <Image style={s} source={require('@app/images/logos/BTAC.png')} />;
    },
    ['CNFAIC']: (s: ImageStyle) => {
      return <Image style={s} source={require('@app/images/logos/CNFAIC.png')} />;
    },
    ['FAC']: (s: ImageStyle) => {
      return <Image style={s} source={require('@app/images/logos/FAC.png')} />;
    },
    ['GNFAC']: (s: ImageStyle) => {
      return <Image style={s} source={require('@app/images/logos/GNFAC.png')} />;
    },
    ['IPAC']: (s: ImageStyle) => {
      return <Image style={s} source={require('@app/images/logos/IPAC.png')} />;
    },
    ['NWAC']: (s: ImageStyle) => {
      return <Image style={s} source={require('@app/images/logos/NWAC.png')} />;
    },
    ['MSAC']: (s: ImageStyle) => {
      return <Image style={s} source={require('@app/images/logos/MSAC.png')} />;
    },
    ['MWAC']: (s: ImageStyle) => {
      return <Image style={s} source={require('@app/images/logos/MWAC.png')} />;
    },
    ['PAC']: (s: ImageStyle) => {
      return <Image style={s} source={require('@app/images/logos/PAC.png')} />;
    },
    ['SNFAC']: (s: ImageStyle) => {
      return <Image style={s} source={require('@app/images/logos/SNFAC.png')} />;
    },
    ['SAC']: (s: ImageStyle) => {
      return <Image style={s} source={require('@app/images/logos/SAC.png')} />;
    },
    ['WCMAC']: (s: ImageStyle) => {
      return <Image style={s} source={require('@app/images/logos/WCMAC.svg')} />;
    },
    ['CAIC']: (s: ImageStyle) => {
      return <Image style={s} source={require('@app/images/logos/CAIC.jpg')} />;
    },
    ['COAA']: (s: ImageStyle) => {
      return <Image style={s} source={require('@app/images/logos/COAA.png')} />;
    },
    ['CBAC']: (s: ImageStyle) => {
      return <Image style={s} source={require('@app/images/logos/CBAC.png')} />;
    },
    ['ESAC']: (s: ImageStyle) => {
      return <Image style={s} source={require('@app/images/logos/ESAC.png')} />;
    },
    ['WAC']: (s: ImageStyle) => {
      return <Image style={s} source={require('@app/images/logos/WAC.png')} />;
    },
  };
  let actualStyle: ImageStyle = {...style};
  if (actualStyle.height) {
    actualStyle.width = undefined;
  } else {
    actualStyle.height = undefined;
  }
  actualStyle.aspectRatio = sizes[centerId].width / sizes[centerId].height;
  return images[centerId](actualStyle);
};
