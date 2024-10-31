declare module "react-native-video-controls" {
  import { Component } from "react";
  import { ViewStyle, StyleProp } from "react-native";

  interface VideoPlayerProps {
    title: string;
    isFullscreen?: boolean;
    source: object;
    navigator?: object;
    seekColor?: string;
    controlTimeout?: number;
    disableBack?: boolean;
    disableVolume?: boolean;
    disableFullscreen?: boolean;
    fullScreen?: any;
    onBack?: any;
    onEnterFullscreen?: any;
    onExitFullscreen?: any;
    onEnd?: any;
    paused?: boolean;
    onLoad?: any;
    onProgress?: any;
    onError?: any;
    toggleResizeModeOnFullscreen?: boolean;
    controlAnimationTiming?: number;
    doubleTapTime?: number;
    style?: StyleProp<ViewStyle>;
  }

  export default class VideoPlayer extends Component<VideoPlayerProps> {}
}
