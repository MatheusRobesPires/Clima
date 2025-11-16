import {View, Image, Pressable, StyleSheet} from 'react-native'
import { useNavigation } from '@react-navigation/native'

export default function Rodape({img1, img2}) {
    const navigation = useNavigation()

    return(
        <View style={styles.container}>
            <Pressable style={styles.botao} onPress={()=>navigation.navigate('biscoito', {nome: 'Rodrigo', idade: 30})}>
                <Image source={img1} style={styles.icone} />
            </Pressable>
            <Pressable style={styles.botao} onPress={()=>navigation.navigate('notas')}>
                <Image source={img2} style={styles.icone} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // coloca os ícones lado a lado
    justifyContent: 'space-around', // espaço igual entre botões
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white', // azul barra inferior
    borderTopWidth: 5,
    borderTopColor:  '#1976d2',
    // fixa no rodapé
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%'
  },
  botao: {
    padding: 10,
    borderRadius: 10,
  },
  icone: {
    width: 40,
    height: 40, // deixa o ícone branco (se for PNG com transparência)
  },
})