// screens/HomeScreen.js
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import styles from './styles';

const FIREBASE_URL =
  'https://firestore.googleapis.com/v1/projects/cmsgc-6b72a/databases/(default)/documents/usuario';

export default function Cadastro({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  const buscarUsuarios = async () => {
    try {
      const resposta = await fetch(FIREBASE_URL);
      const dados = await resposta.json();

      const lista =
        dados.documents?.map((doc) => ({
          id: doc.name.split('/').pop(),
          usuario: doc.fields.usuario.stringValue,
          senha: doc.fields.senha.stringValue,
        })) || [];

      setUsuarios(lista);
    } catch (erro) {
      console.error('Erro ao buscar usuários:', erro);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarUsuarios();
  }, []);

  const adicionarUsuarios = async () => {
    if (!usuario || !senha) {
      Alert.alert('Preencha todos os campos!');
      return;
    }

    const novoUsuario = {
      fields: {
        usuario: { stringValue: usuario },
        senha: { stringValue: senha },
      },
    };

    try {
      const resposta = await fetch(FIREBASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoUsuario),
      });

      if (resposta.ok) {
        setUsuario('');
        setSenha('');
        buscarUsuarios();
        Alert.alert('Usuário cadastrado com sucesso!');
        navigation.navigate('log');
      } else {
        Alert.alert('Erro ao cadastrar usuário.');
      }
    } catch (erro) {
      console.error('Erro ao adicionar usuário:', erro);
      Alert.alert('Erro na requisição');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
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
              />
              <TouchableOpacity
                onPress={() => adicionarUsuarios()}
                style={[styles.botoes, { backgroundColor: '#fa412f' }]}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                  Cadastrar
                </Text>
              </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
