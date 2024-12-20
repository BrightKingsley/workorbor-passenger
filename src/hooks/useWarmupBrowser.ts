import * as WebBrowser from 'expo-web-browser';
import {useEffect} from 'react';
import {Platform} from 'react-native';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS === 'web') return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};
