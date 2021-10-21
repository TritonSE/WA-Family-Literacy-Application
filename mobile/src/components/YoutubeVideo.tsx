import React from 'react';
import { Platform } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

type YoutubeVideoProps = {
  url: string;
  width: number;
  height: number;
};

const VIDEO_ID_REGEX = new RegExp('^(?:https?:)?//[^/]*(?:youtube(?:-nocookie)?.com|youtu.be).*[=/]([-\\w]{11})(?:\\?|=|&|$)');

/**
 * Wrapper for react-native-youtube-iframe/YoutubePlayer to:
 *  - automatically parse the ID from a youtube.com or youtu.be URL
 *  - fix a bug on Android when navigating away from a screen with a YoutubePlayer
 */
export const YoutubeVideo: React.FC<YoutubeVideoProps> = ({ url, width, height }) => {
  const urlMatch = url.match(VIDEO_ID_REGEX);
  if (!urlMatch) {
    return <></>;
  }
  const id = urlMatch[1];

  return <YoutubePlayer
    height={height}
    width={width}
    videoId={id}
    webViewStyle={{
      opacity: 0.99, // fix for crash on Android when navigating to a new screen, see https://github.com/LonelyCpp/react-native-youtube-iframe/issues/110
    }}
    webViewProps={{
      androidLayerType: Platform.OS === 'android' && Platform.Version <= 22 ? 'hardware' : 'none', // same as above
    }}
  />;
};
