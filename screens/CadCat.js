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
  TouchableOpacity
} from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import styles from './styles';

const FIREBASE_URL = 'https://firestore.googleapis.com/v1/projects/appalunos-1149a/databases/(default)/documents/alunosC';

export default function App() {
  // Busca e carregamento
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nome, setNome] = useState('');
  const [ddn, setDdn] = useState('');
  const [end, setEnd] = useState('');
  const [nr, setNr] = useState('');
  const [sacra, setSacra] = useState('');
  const [tef, setTef] = useState('');
  const [idade, setIdade] = useState('');

  // Buscar Aluno no Firestore
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

  // Adicionar novo aluno
  const adicionarAlunos = async () => {
    if (!nome || !ddn || !end || !nr || !sacra || !tef || !idade) {
      Alert.alert('Preencha todos os campos!');
      return;
    }

    const novoAluno = {
      fields: {
      nome:{stringValue: nome},
      ddn:{stringValue: ddn},
      end:{stringValue: end},
      nr:{stringValue: nr},
      sacra:{stringValue: sacra},
      tef:{stringValue: tef},
      idade:{stringValue: idade},
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

  // Excluir aluno
  const excluirAlunos = async (id) => {
    if (!id) {
      Alert.alert('ID inválido para exclusão');
      return;
    }

    try {
      const resposta = await fetch(`${FIREBASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (resposta.ok) {
        await buscarAlunos();
        Alert.alert('Aluno excluído com sucesso!');
      } else {
        Alert.alert(`Erro ao excluir aluno (status: ${resposta.status})`);
      }
    } catch (erro) {
      console.error('Erro no DELETE:', erro);
      Alert.alert('Erro na requisição');
    }
  };

  // Tela de carregamento
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
        <View style={styles.container}>
          <View style={styles.form}>
            <Text /*style={styles.paragraph}*/>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Alex"
              value={nome}
              onChangeText={setNome}
            />

            <Text /*style={styles.paragraph}*/>Data de nascimento</Text>
            <MaskedTextInput
              mask="99/99/9999"
              onChangeText={setDdn}
              value={ddn}
              keyboardType="numeric"
              placeholder="Ex: 29/10/2025"
              style={styles.input}
            />

            <Text /*style={styles.paragraph}*/>Idade</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 10"
              value={idade}
              onChangeText={setIdade}
            />

            <Text /*style={styles.paragraph}*/>Nome dos responsáveis</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Pedro, Julia"
              value={nr}
              onChangeText={setNr}
            />

            <Text /*style={styles.paragraph}*/>Telefone de contato</Text>
            <MaskedTextInput
              mask="(99) 99999-9999"
              onChangeText={setTef}
              value={tef}
              keyboardType="numeric"
              placeholder="Ex: (99) 99999-9999"
              style={styles.input}
            />

            <Text /*style={styles.paragraph}*/>Endereço</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Rua Caixa Prego, 44"
              value={end}
              onChangeText={setEnd}
            />

            <Text /*style={styles.paragraph}*/>Possui sacramento?</Text>
            <TextInput
              style={styles.input}
              placeholder="(batismo, eucaristia, crisma, matrimônio)"
              value={sacra}
              onChangeText={setSacra}
            />

            <TouchableOpacity
              onPress={adicionarAlunos} // chama a função de cadastro
              style={[styles.botoes, { backgroundColor: '#fa412f' }]}
            >
            <Text style={{ color: "#FFF", fontWeight: "bold", }}>
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
