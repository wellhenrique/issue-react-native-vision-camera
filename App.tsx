import React, { useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Camera, Code, useCodeScanner } from 'react-native-vision-camera';

import { MyCamera } from './my-camera';

type Props = {};

const App: React.FC<Props> = () => {
  const [isActive, setIsActive] = React.useState<boolean>(false);
  const [scanValue, setScanValue] = React.useState('')
  const [orientationIsReady, setOrientationIsReady] = React.useState(false);

  const codeScanner = useCodeScanner({
    codeTypes: ['code-128'],
    onCodeScanned: (codes) => handleScanBarcode(codes[0]),
  });

  async function handleActiveBarcodeScan() {
    setIsActive(!isActive)
    setScanValue('')
  }

  async function lockOrientationToLandscape() {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.DEFAULT,
    );

    if (!orientationIsReady) setOrientationIsReady(true);
  }

  async function lockOrientationToPortrait() {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP,
    );

    if (!orientationIsReady) setOrientationIsReady(true);
  }

  useEffect(() => {
    requestCameraPermission();
  }, []);

  useEffect(() => {
    lockOrientationToLandscape();

    return () => {
      lockOrientationToPortrait();
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      await Camera.requestCameraPermission();
    } catch (error) {
      console.warn('Error requesting camera permission:', error);
    }
  };

  async function handleScanBarcode(code: Code) {
    if (code.value) setScanValue(code.value)
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>

      {isActive && <MyCamera codeScanner={codeScanner} />}


      <View style={{
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }}>
        <Text style={styles.text}>{scanValue}</Text>
        {isActive && (
          <BarcodeMask
            width={'95%'}
            height={120}
            showAnimatedLine={false}
          />
        )}

        <Pressable style={styles.button} onPress={handleActiveBarcodeScan}>
          <Text style={styles.text}>SCAN</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 300,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#363636',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 0.25,
  },
});

export default App;