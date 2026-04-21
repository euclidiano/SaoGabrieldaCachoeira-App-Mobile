import React, { useState } from 'react';
import {
  View,
  TextInput,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import styles from "./styles";

const FIREBASE_URL =
  'https://firestore.googleapis.com/v1/projects/cmsgc-6b72a/databases/(default)/documents/usuario';

export default function Login({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  async function login() {
    try {
      const response = await fetch(FIREBASE_URL);
      const data = await response.json();

      const usuarios = data.documents || [];
      const usuarioEncontrado = usuarios.find(u => {
        const uUsuario = u.fields.usuario.stringValue;
        const uSenha = u.fields.senha.stringValue;
        return uUsuario === usuario && uSenha === senha;
      });

      if (usuarioEncontrado) {
        const role = (usuario === 'adm' && senha === '123c@m456') ? 'admin' : 'usuario';
        navigation.navigate('feed', { role });
      } else {
        Alert.alert('Erro', 'Usuario ou senha incorretos');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível conectar ao banco de dados');
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View >
              <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
                accessible
                accessibilityLabel="Logo do aplicativo"
              />
          </View>

          <View style={styles.container}>
            <TextInput
              placeholder="Usuário"
              placeholderTextColor="#888888"
              style={styles.input}
              value={usuario}
              onChangeText={setUsuario}
            />
            <TextInput
              placeholder="Senha"
              placeholderTextColor="#888888"
              style={styles.input}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />

            <TouchableOpacity
              onPress={() => login()}
              style={[styles.botoes, { backgroundColor: '#2f76fa' }]}
            >
              <Text style={{ color: "#FFF", fontWeight: "bold" }}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('cad')}
              style={{ alignItems: 'center', marginTop: 12 }}
            >
              <Text style={{ color: "#4b8ef2", fontWeight: "bold", textDecorationLine: 'underline' }}>
                Ainda não possui login? Cadastre-se
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
