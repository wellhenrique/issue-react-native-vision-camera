import { MutableRefObject, forwardRef, useEffect } from 'react';
import { Alert, StyleSheet } from 'react-native';
import {
  Camera,
  CameraPosition,
  CameraProps,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

type MyCameraProps = Omit<CameraProps, 'device' | 'isActive'> & {
  position?: CameraPosition;
};

function MyCameraComponent(
  props: MyCameraProps,
  ref: MutableRefObject<Camera>,
) {
  const { position, ...rest } = props;

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice(position ?? 'back', {
    physicalDevices: ['wide-angle-camera', 'telephoto-camera'],
  });

  async function verifyCameraPermission() {
    if (hasPermission) return;

    const requestPermissionResponse = await requestPermission();
    if (!requestPermissionResponse) {
      return Alert.alert(
        'Permissão de Câmera negada!',
        'Precisamos de acesso a câmera para tirar fotos, ler código de barras e qrcode.',
      );
    }
  }

  useEffect(() => {
    verifyCameraPermission();
  }, []);

  if (!hasPermission || device == null) return null;

  return (
    <Camera
      key={device.id}
      ref={ref}
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      {...rest}
    />
  );
}

export const MyCamera = forwardRef(MyCameraComponent as any);
