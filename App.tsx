import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { Button, StyleSheet, Text,TouchableOpacity,View,Image } from "react-native";
import {Entypo} from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';

export default function App(){
  const [modo, setModo] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [foto,setFoto] = useState<string | null>(null);

  if(!permission){
    return <View/>
  }
  if(!permission.granted){
    return(
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos da sua permissão para mostrar a câmera </Text>
        <Button onPress={requestPermission} title='Conceder permissão'/>
      </View>
    )
  }

  function trocarCamera(){
    setModo(current =>(current === 'back' ? 'back' : 'back'));
  }

  async function compartilharFoto () {
    if(!foto){
      alert('Tire uma foto antes de compartilhar')
      return;
    }

    if (!(await Sharing.isAvailableAsync())){
      alert('Ops, o compartilhamento não está disponível na sua plataforma!')
      return;
    }

    await Sharing.shareAsync(foto);
  }

    return(
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={modo} ref={cameraRef}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={trocarCamera}>
            <Entypo name='cw' size={24} color={'white'}/>
            <Text style={styles.text}>Alternar Câmera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={async () =>{
            if (cameraRef.current){
              let photo = await cameraRef.current.takePictureAsync();
              console.log('foto', photo);
              setFoto(photo.uri)
            }
          }}>
            <Entypo name='camera' size={24} color={'white'}/>
            <Text style={styles.text}>Tirar Foto</Text>
          </TouchableOpacity>
        </View>
        </CameraView>
        {foto &&
        <View style={styles.previewContainer}>
          <Image source={{uri: foto}} style={styles.fotoView}/>
          <TouchableOpacity style={styles.shareButton} onPress={compartilharFoto}>
          <Entypo name='share' size={24} color={'white'}/>
          <Text style={styles.shareText}>Compartilhar Foto</Text>
          </TouchableOpacity>
          </View>
        }
      </View>
    )
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
    marginTop: 5,
    position: 'absolute',
    bottom: 50,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 5,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  fotoView: {
    width: 200,
    height: 200,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FF6347',
    marginLeft: 10,
    borderRadius: 5,
  },
  shareText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 5,
  }
});
