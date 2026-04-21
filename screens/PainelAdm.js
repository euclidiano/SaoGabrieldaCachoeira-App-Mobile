import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import styles from './styles';

const FIREBASE_BASE_URL =
  'https://firestore.googleapis.com/v1/projects/cmsgc-6b72a/databases/(default)/documents';

export default function PainelAdmin() {
  const [alunos, setAlunos] = useState([]); 
  const [usuarios, setUsuarios] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [editFieldsUsuarios, setEditFieldsUsuarios] = useState({});
  const [editFieldsAlunos, setEditFieldsAlunos] = useState({});

  const buscarColecao = async (nomeColecao, setter) => {
    try {
      const response = await fetch(`${FIREBASE_BASE_URL}/${nomeColecao}`);
      const data = await response.json();

      if (data.documents) {
        const itens = data.documents.map((doc) => {
          const f = doc.fields || {};
          return {
            id: doc.name.split('/').pop(),
            nome: f.nome?.stringValue || '',
            ddn: f.ddn?.stringValue || '',
            end: f.end?.stringValue || '',
            nr: f.nr?.stringValue || '',
            sacra: f.sacra?.stringValue || '',
            tef: f.tef?.stringValue || '',
            idade: f.idade?.stringValue || f.idade?.integerValue || '',
            usuario: f.usuario?.stringValue || '',
            senha: f.senha?.stringValue || f.senha?.integerValue || '',
          };
        });
        setter(itens);
      } else {
        setter([]);
      }
    } catch (error) {
      console.error('Erro ao buscar coleção:', nomeColecao, error);
      setter([]);
    }
  };

  useEffect(() => {
    const carregarDados = async () => {
      await Promise.all([
        buscarColecao('alunosC', setAlunos),
        buscarColecao('usuario', setUsuarios),
      ]);
      setLoading(false);
    };
    carregarDados();
  }, []);

  const excluirItem = async (colecao, id, setter) => {
    if (!id) {
      Alert.alert('Erro', 'ID inválido para exclusão.');
      return;
    }

    try {
      const resposta = await fetch(`${FIREBASE_BASE_URL}/${colecao}/${id}`, {
        method: 'DELETE',
      });

      if (resposta.ok) {
        setter((prev) => prev.filter((item) => item.id !== id));
        Alert.alert('Sucesso', 'Item excluído com sucesso.');
      } else {
        Alert.alert('Erro', `Falha ao excluir item (status ${resposta.status}).`);
      }
    } catch (erro) {
      console.error('Erro ao excluir item:', erro);
      Alert.alert('Erro', 'Não foi possível realizar a exclusão.');
    }
  };


  const atualizarItem = async (colecao, id, campos, setter) => {
    if (!id) {
      Alert.alert('Erro', 'ID inválido para atualização.');
      return;
    }

    const fieldsPayload = {};
    Object.entries(campos).forEach(([key, value]) => {
      if (value !== undefined) {
        fieldsPayload[key] = { stringValue: String(value) };
      }
    });

    try {
      const resposta = await fetch(
        `${FIREBASE_BASE_URL}/${colecao}/${id}?updateMask.fieldPaths=${Object.keys(
          campos
        ).join('&updateMask.fieldPaths=')}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fields: fieldsPayload }),
        }
      );

      if (resposta.ok) {
        setter((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...campos } : item))
        );
        Alert.alert('Sucesso', 'Alterações salvas com sucesso.');
      } else {
        const texto = await resposta.text();
        console.error('Erro resposta PATCH:', resposta.status, texto);
        Alert.alert('Erro', `Falha ao atualizar item (status ${resposta.status}).`);
      }
    } catch (erro) {
      console.error('Erro ao atualizar item:', erro);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeAreaBox}>



          <Text style={styles.paragraph}>Usuários</Text>
          <FlatList
            data={usuarios}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const editState =
                editFieldsUsuarios[item.id] || {
                  usuario: item.usuario,
                  senha: item.senha,
                };

              return (
                <View style={styles.card}>
                  <Text style={styles.cardText}>Usuário atual: {item.usuario}</Text>
                  <Text style={styles.cardText}>Senha atual: {item.senha}</Text>

                  <Text style={{ marginTop: 8 }}>Editar Usuário:</Text>
                  <TextInput
                    value={editState.usuario}
                    onChangeText={(text) =>
                      setEditFieldsUsuarios((prev) => ({
                        ...prev,
                        [item.id]: { ...prev[item.id], usuario: text },
                      }))
                    }
                    placeholder="Novo usuario"
                    placeholderTextColor="#888888"
                    style={styles.input}
                    autoCapitalize="none"
                  />

                  <Text>Editar Senha:</Text>
                  <TextInput
                    value={editState.senha}
                    onChangeText={(text) =>
                      setEditFieldsUsuarios((prev) => ({
                        ...prev,
                        [item.id]: { ...prev[item.id], senha: text },
                      }))
                    }
                    placeholder="Nova senha"
                    placeholderTextColor="#888888"
                    secureTextEntry
                    style={styles.input}
                  />

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        atualizarItem(
                          'usuario',
                          item.id,
                          {
                            usuario:
                              editFieldsUsuarios[item.id]?.usuario ?? item.usuario,
                            senha:
                              editFieldsUsuarios[item.id]?.senha ?? item.senha,
                          },
                          setUsuarios
                        )
                      }
                      style={[
                        styles.botoes,
                        { backgroundColor: '#0066cc', marginRight: 8 },
                      ]}
                    >
                      <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                        Salvar alterações
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        excluirItem('usuario', item.id, setUsuarios)
                      }
                      style={[
                        styles.botoes,
                        { backgroundColor: '#e62233' },
                      ]}
                    >
                      <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                        Excluir dado de usuario
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />

          <Text style={styles.paragraph}>Alunos</Text>
          <FlatList
            data={alunos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const editState =
                editFieldsAlunos[item.id] || {
                  nome: item.nome,
                  ddn: item.ddn,
                  end: item.end,
                  nr: item.nr,
                  sacra: item.sacra,
                  tef: item.tef,
                  idade: item.idade,
                };

              return (
                <View style={styles.card}>
                  <Text style={styles.cardText}>Nome: {item.nome}</Text>
                  <Text style={styles.cardText}>
                    Data de nascimento: {item.ddn}
                  </Text>
                  <Text style={styles.cardText}>Endereço: {item.end}</Text>
                  <Text style={styles.cardText}>Responsáveis: {item.nr}</Text>
                  <Text style={styles.cardText}>Sacramento: {item.sacra}</Text>
                  <Text style={styles.cardText}>Telefone: {item.tef}</Text>
                  <Text style={styles.cardText}>Idade: {item.idade}</Text>

                  <Text style={{ marginTop: 8 }}>Editar Nome:</Text>
                  <TextInput
                    value={editState.nome}
                    onChangeText={(text) =>
                      setEditFieldsAlunos((prev) => ({
                        ...prev,
                        [item.id]: { ...prev[item.id], nome: text },
                      }))
                    }
                    placeholder="Nome"
                    placeholderTextColor="#888888"
                    style={styles.input}
                  />

                  <Text>Editar Data de nascimento:</Text>
                  <TextInput
                    value={editState.ddn}
                    onChangeText={(text) =>
                      setEditFieldsAlunos((prev) => ({
                        ...prev,
                        [item.id]: { ...prev[item.id], ddn: text },
                      }))
                    }
                    placeholder="DDN"
                    placeholderTextColor="#888888"
                    style={styles.input}
                  />

                  <Text>Editar Endereço:</Text>
                  <TextInput
                    value={editState.end}
                    onChangeText={(text) =>
                      setEditFieldsAlunos((prev) => ({
                        ...prev,
                        [item.id]: { ...prev[item.id], end: text },
                      }))
                    }
                    placeholder="Endereço"
                    placeholderTextColor="#888888"
                    style={styles.input}
                  />

                  <Text>Editar Responsáveis:</Text>
                  <TextInput
                    value={editState.nr}
                    onChangeText={(text) =>
                      setEditFieldsAlunos((prev) => ({
                        ...prev,
                        [item.id]: { ...prev[item.id], nr: text },
                      }))
                    }
                    placeholder="Responsáveis"
                    placeholderTextColor="#888888"
                    style={styles.input}
                  />

                  <Text>Editar Sacramento:</Text>
                  <TextInput
                    value={editState.sacra}
                    onChangeText={(text) =>
                      setEditFieldsAlunos((prev) => ({
                        ...prev,
                        [item.id]: { ...prev[item.id], sacra: text },
                      }))
                    }
                    placeholder="Sacramento"
                    placeholderTextColor="#888888"
                    style={styles.input}
                  />

                  <Text>Editar Telefone:</Text>
                  <TextInput
                    value={editState.tef}
                    onChangeText={(text) =>
                      setEditFieldsAlunos((prev) => ({
                        ...prev,
                        [item.id]: { ...prev[item.id], tef: text },
                      }))
                    }
                    placeholder="Telefone"
                    placeholderTextColor="#888888"
                    style={styles.input}
                    keyboardType="phone-pad"
                  />

                  <Text>Editar Idade:</Text>
                  <TextInput
                    value={editState.idade}
                    onChangeText={(text) =>
                      setEditFieldsAlunos((prev) => ({
                        ...prev,
                        [item.id]: { ...prev[item.id], idade: text },
                      }))
                    }
                    placeholder="Idade"
                    placeholderTextColor="#888888"
                    style={styles.input}
                    keyboardType="numeric"
                  />

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        atualizarItem(
                          'alunosC',
                          item.id,
                          {
                            nome:editFieldsAlunos[item.id]?.nome ?? item.nome,
                            ddn: editFieldsAlunos[item.id]?.ddn ?? item.ddn,
                            end: editFieldsAlunos[item.id]?.end ?? item.end,
                            nr: editFieldsAlunos[item.id]?.nr ?? item.nr,
                            sacra:editFieldsAlunos[item.id]?.sacra ?? item.sacra,
                            tef: editFieldsAlunos[item.id]?.tef ?? item.tef,
                            idade:editFieldsAlunos[item.id]?.idade ?? item.idade,
                          },
                          setAlunos
                        )
                      }
                      style={[
                        styles.botoes,
                        { backgroundColor: '#0066cc', marginRight: 8 },
                      ]}
                    >
                      <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                        Salvar alterações
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        excluirItem('alunosC', item.id, setAlunos)
                      }
                      style={[
                        styles.botoes,
                        { backgroundColor: '#e62233' },
                      ]}
                    >
                      <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                        Excluir dado de aluno
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />

      </SafeAreaView>
    </SafeAreaProvider>
  );
}
