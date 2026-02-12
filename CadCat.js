import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import styles from './styles';

const FIREBASE_URL =
  'https://firestore.googleapis.com/v1/projects/cmsgc-6b72a/databases/(default)/documents/alunosC';

export default function App() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nome, setNome] = useState('');
  const [ddn, setDdn] = useState('');
  const [end, setEnd] = useState('');
  const [nr, setNr] = useState('');
  const [sacra, setSacra] = useState('');
  const [tef, setTef] = useState('');
  const [idade, setIdade] = useState('');
  const [mot, setMot] = useState('');

  const buscarAlunos = async () => {
    try {
      const resposta = await fetch(FIREBASE_URL);
      const dados = await resposta.json();

      const lista =
        dados.documents?.map((doc) => ({
          id: doc.name.split('/').pop(),
          nome: doc.fields.nome.stringValue,
          ddn: doc.fields.ddn.stringValue,
          end: doc.fields.end.stringValue,
          nr: doc.fields.nr.stringValue,
          sacra: doc.fields.sacra.stringValue,
          tef: doc.fields.tef.stringValue,
          idade: doc.fields.idade.stringValue,
          mot: doc.fields.mot.stringValue,
          
        })) || [];

      setAlunos(lista);
    } catch (erro) {
      console.error('Erro ao buscar alunos:', erro);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarAlunos();
  }, []);

  const adicionarAlunos = async () => {
    if (!nome || !ddn || !end || !nr || !sacra || !tef || !idade || !mot) {
      Alert.alert('Preencha todos os campos!');
      return;
    }

    const novoAluno = {
      fields: {
        nome: { stringValue: nome },
        ddn: { stringValue: ddn },
        end: { stringValue: end },
        nr: { stringValue: nr },
        sacra: { stringValue: sacra },
        tef: { stringValue: tef },
        idade: { stringValue: idade },
        mot: { stringValue: mot },
      },
    };

    try {
      const resposta = await fetch(FIREBASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoAluno),
      });

      if (resposta.ok) {
        setNome('');
        setDdn('');
        setEnd('');
        setNr('');
        setTef('');
        setIdade('');
        setSacra('');
        setMot('');
        buscarAlunos();
        Alert.alert('Aluno cadastrado com sucesso!');
      } else {
        Alert.alert('Erro ao cadastrar aluno.');
      }
    } catch (erro) {
      console.error('Erro ao adicionar aluno:', erro);
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
    <SafeAreaProvider style={{backgroundColor: '#f2f2f2',}}>
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
          
            <View>
              <Text>Nome</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Alex"
                placeholderTextColor="#888888"
                value={nome}
                onChangeText={setNome}
              />

              <Text>Data de nascimento</Text>
              <MaskedTextInput
                mask="99/99/9999"
                onChangeText={setDdn}
                value={ddn}
                keyboardType="numeric"
                placeholder="Ex: 29/10/2025"
                placeholderTextColor="#888888"
                style={styles.input}
              />

              <Text>Idade</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 10"
                placeholderTextColor="#888888"
                value={idade}
                onChangeText={setIdade}
              />

              <Text>Nome dos responsáveis</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Pedro, Julia"
                placeholderTextColor="#888888"
                value={nr}
                onChangeText={setNr}
              />

              <Text>Telefone de contato</Text>
              <MaskedTextInput
                mask="(99) 99999-9999"
                onChangeText={setTef}
                value={tef}
                keyboardType="numeric"
                placeholder="Ex: (99) 99999-9999"
                placeholderTextColor="#888888"
                style={styles.input}
              />

              <Text>Endereço</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Rua Caixa Prego, 44"
                placeholderTextColor="#888888"
                value={end}
                onChangeText={setEnd}
              />

              <Text>Possui sacramento?</Text>
              <TextInput
                style={styles.input}
                placeholder="(batismo, eucaristia, crisma, matrimônio)"
                placeholderTextColor="#888888"
                value={sacra}
                onChangeText={setSacra}
              />

              <Text>Motivo da inscrição?</Text>
              <TextInput
                style={styles.input}
                placeholder="( catequese, crisma, coroinha e casamento)"
                placeholderTextColor="#888888"
                value={mot}
                onChangeText={setMot}
              />

              <TouchableOpacity
                onPress={adicionarAlunos}
                style={[styles.botoes, { backgroundColor: '#fa412f' }]}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                  Cadastrar aluno
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
