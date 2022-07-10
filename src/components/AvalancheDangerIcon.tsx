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
  const sizes: Record<DangerLevel, size> = {
    [DangerLevel.GeneralInformation]: Image.resolveAssetSource(
      require('@app/images/danger-icons/0.png'),
    ),
    [DangerLevel.None]: Image.resolveAssetSource(
      require('@app/images/danger-icons/0.png'),
    ),
    [DangerLevel.Low]: Image.resolveAssetSource(
      require('@app/images/danger-icons/1.png'),
    ),
    [DangerLevel.Moderate]: Image.resolveAssetSource(
      require('@app/images/danger-icons/2.png'),
    ),
    [DangerLevel.Considerable]: Image.resolveAssetSource(
      require('@app/images/danger-icons/3.png'),
    ),
    [DangerLevel.High]: Image.resolveAssetSource(
      require('@app/images/danger-icons/4.png'),
    ),
    [DangerLevel.Extreme]: Image.resolveAssetSource(
      require('@app/images/danger-icons/5.png'),
    ),
  };

  const images: Record<DangerLevel, {(s: ImageStyle): ReactElement}> = {
    [DangerLevel.GeneralInformation]: (s: ImageStyle) => {
      return (
        <Image style={s} source={require('@app/images/danger-icons/0.png')} />
      );
    },
    [DangerLevel.None]: (s: ImageStyle) => {
      return (
        <Image style={s} source={require('@app/images/danger-icons/0.png')} />
      );
    },
    [DangerLevel.Low]: (s: ImageStyle) => {
      return (
        <Image style={s} source={require('@app/images/danger-icons/1.png')} />
      );
    },
    [DangerLevel.Moderate]: (s: ImageStyle) => {
      return (
        <Image style={s} source={require('@app/images/danger-icons/2.png')} />
      );
    },
    [DangerLevel.Considerable]: (s: ImageStyle) => {
      return (
        <Image style={s} source={require('@app/images/danger-icons/3.png')} />
      );
    },
    [DangerLevel.High]: (s: ImageStyle) => {
      return (
        <Image style={s} source={require('@app/images/danger-icons/4.png')} />
      );
    },
    [DangerLevel.Extreme]: (s: ImageStyle) => {
      return (
        <Image style={s} source={require('@app/images/danger-icons/5.png')} />
      );
    },
  };
  let actualStyle: ImageStyle = {...style};
  actualStyle.width = undefined;
  actualStyle.aspectRatio = sizes[level].width / sizes[level].height;
  return images[level](actualStyle);
};
