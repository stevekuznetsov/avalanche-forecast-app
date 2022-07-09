import React from 'react';
import {WebView, WebViewMessageEvent, WebViewProps} from 'react-native-webview';

export interface HTMLBodyViewProps {
  body: string;
  props?: WebViewProps;
}

// TODO: many fields in the api.avalanche.org responses contain inline HTML, like
// the forecast summary, bottom line, discussions, etc. The WebView component *seems*
// like the correct thing to use when rendering them into the app, but we are presented
// with a couple of problems:
// - inline HTML must be wrapped in a <html> tag with a <head>, along with metadata
//   to generate the correct viewport, or the rendering will be nonsensical
// - the WebView component does not support auto-height settings for inline HTML, for
//   what reason I cannot tell ... the suggested solution is to
//   a) use a React.useState() call and a message passing implementation to resize
//      the component dynamically once it has been rendered
//   b) use the react-native-webview-auto-height package
//
// Unfortunately, both approaches do not work. I can't figure out how to get the former
// approach to *not* render some small view with a scroll-bar, and the latter is broken
// on our version of React Native with this issue:
// https://github.com/iou90/react-native-autoheight-webview/issues/228
//
// So, long term ... what to do? Entirely unclear. We can go upstream to fix the issue
// with the deprecated import, that's easy. Perhaps what we get with Expo will be more
// sensible if the version of React Native changes? Who knows.

export const HTMLBodyView: React.FunctionComponent<HTMLBodyViewProps> = ({
  body,
  props,
}: HTMLBodyViewProps) => {
  const [viewHeight, setViewHeight] = React.useState<number>();
  const updateHeight = (event: WebViewMessageEvent) => {
    setViewHeight(Number(event.nativeEvent.data));
  };

  let actualProps: WebViewProps = {...props};
  actualProps.source = {
    html: `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-size: 100%;
        word-wrap: break-word;
        overflow-wrap: break-word;
        height: 100%;
        overflow: scroll;
        background-color: transparent;
      }
    </style>
  </head>
  <body>
    ${body}
  </body>
</html>`,
  };
  actualProps.injectedJavaScript =
    'window.ReactNativeWebView.postMessage(document.body.scrollHeight)';
  actualProps.onMessage = updateHeight;
  actualProps.scrollEnabled = false;
  return (
    <WebView
      {...actualProps}
      originWhitelist={['*']}
      style={{height: viewHeight}}
    />
  );
};
