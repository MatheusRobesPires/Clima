import {Text, TextInput, View, StyleSheet} from 'react-native'

export default function Form({texto, funcao}) {
    return(
        <View style={styles.container}>
            <Text style={styles.label}>{texto}</Text>
            <TextInput 
                style={styles.input}
                placeholder='Insira notas de 0 a 10'
                onChangeText={(text)=>funcao(parseFloat(text))}
            />
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch', // ocupa largura disponível, alinhado à esquerda
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
    textAlign: 'left',
  },
  input: {
    paddingVertical: 8,
    fontSize: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#999',
  },
})