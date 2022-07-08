import React, {ReactElement} from 'react';
import {Image, ImageStyle} from 'react-native';

import {DangerLevel} from '@app/api/avalanche/Types';

export interface AvalancheDangerIconProps {
  style: ImageStyle;
  level: DangerLevel;
}

interface size {
  width: number;
  height: number;
}

export const AvalancheDangerIcon: React.FunctionComponent<
  AvalancheDangerIconProps
> = ({style, level}: AvalancheDangerIconProps) => {
  const sizes: Record<DangerLevel, size> = {};
  sizes[DangerLevel.GeneralInformation] = Image.resolveAssetSource(
    require('@app/images/danger-icons/0.png'),
  );
  sizes[DangerLevel.None] = Image.resolveAssetSource(
    require('@app/images/danger-icons/0.png'),
  );
  sizes[DangerLevel.Low] = Image.resolveAssetSource(
    require('@app/images/danger-icons/1.png'),
  );
  sizes[DangerLevel.Moderate] = Image.resolveAssetSource(
    require('@app/images/danger-icons/2.png'),
  );
  sizes[DangerLevel.Considerable] = Image.resolveAssetSource(
    require('@app/images/danger-icons/3.png'),
  );
  sizes[DangerLevel.Extreme] = Image.resolveAssetSource(
    require('@app/images/danger-icons/4.png'),
  );

  const images: Record<DangerLevel, {(s: ImageStyle): ReactElement}> = {};
  images[DangerLevel.GeneralInformation] = (s: ImageStyle) => {
    return (
      <Image style={s} source={require('@app/images/danger-icons/0.png')} />
    );
  };
  images[DangerLevel.None] = (s: ImageStyle) => {
    return (
      <Image style={s} source={require('@app/images/danger-icons/0.png')} />
    );
  };
  images[DangerLevel.Low] = (s: ImageStyle) => {
    return (
      <Image style={s} source={require('@app/images/danger-icons/1.png')} />
    );
  };
  images[DangerLevel.Moderate] = (s: ImageStyle) => {
    return (
      <Image style={s} source={require('@app/images/danger-icons/2.png')} />
    );
  };
  images[DangerLevel.Considerable] = (s: ImageStyle) => {
    return (
      <Image style={s} source={require('@app/images/danger-icons/3.png')} />
    );
  };
  images[DangerLevel.Extreme] = (s: ImageStyle) => {
    return (
      <Image style={s} source={require('@app/images/danger-icons/4.png')} />
    );
  };
  let actualStyle: ImageStyle = {...style};
  actualStyle.width = undefined;
  actualStyle.aspectRatio = sizes[level].width / sizes[level].height;
  return images[level](actualStyle);
};
