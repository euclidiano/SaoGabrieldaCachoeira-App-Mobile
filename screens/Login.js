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
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function login() {
    try {
      const response = await fetch(FIREBASE_URL);
      const data = await response.json();

      const usuarios = data.documents || [];
      const usuarioEncontrado = usuarios.find(u => {
        const uEmail = u.fields.email.stringValue;
        const uSenha = u.fields.senha.stringValue;
        return uEmail === email && uSenha === senha;
      });

      if (usuarioEncontrado) {
        const role = (email === 'adm' && senha === '123') ? 'admin' : 'usuario';
        navigation.navigate('feed', { role });
      } else {
        Alert.alert('Erro', 'Email ou senha incorretos');
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
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              placeholder="Senha"
              style={styles.input}
              value={senha}
              keyboardType="numeric"
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
