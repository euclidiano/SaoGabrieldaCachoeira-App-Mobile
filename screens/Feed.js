import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import styles from './styles';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';

const LINKS_URL =
  'https://firestore.googleapis.com/v1/projects/cmsgc-6b72a/databases/(default)/documents/links';

export default function Feed({ route, navigation }) {
  const { role } = route.params || {};

  const [fotos, setFotos] = useState([]);
  const [links, setLinks] = useState([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [menuVisivel, setMenuVisivel] = useState(false);

  const buscarLinks = async () => {
    try {
      const res = await fetch(LINKS_URL);
      const json = await res.json();

      const lista =
        json.documents?.map((doc) => ({
          id: doc.name.split('/').pop(),
          titulo: doc.fields?.titulo?.stringValue ?? 'Sem título',
          url: doc.fields?.url?.stringValue ?? '',
          data: doc.fields?.data?.stringValue ?? 'Sem data',
        })) || [];

      lista.sort((a, b) => new Date(b.data) - new Date(a.data));
      setLinks(lista);
    } catch (e) {
      console.warn('Erro ao buscar links:', e);
    } finally {
      setLoadingLinks(false);
    }
  };

  useEffect(() => {
    buscarLinks();
  }, []);

  // 🔹 APENAS VISUALIZAR NO DRIVE
  const visualizarArquivo = async (url) => {
    if (!url) {
      Alert.alert('Link inválido');
      return;
    }

    const podeAbrir = await Linking.canOpenURL(url);
    if (!podeAbrir) {
      Alert.alert('Não foi possível abrir o link');
      return;
    }

    await Linking.openURL(url);
  };

  const excluirLink = async (id) => {
    try {
      await fetch(`${LINKS_URL}/${id}`, { method: 'DELETE' });
      buscarLinks();
    } catch (e) {
      console.warn('Erro ao excluir link:', e);
    }
  };

  useEffect(() => {
    AsyncStorage.getItem('fotos').then((dados) => {
      if (dados) setFotos(JSON.parse(dados));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('fotos', JSON.stringify(fotos));
  }, [fotos]);

  const adicionarImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!res.canceled) {
      const novaFoto = {
        id: Date.now().toString(),
        uri: res.assets[0].uri,
        hora: new Date().toLocaleString('pt-BR'),
        likes: 0,
      };
      setFotos((prev) => [novaFoto, ...prev]);
    }
  };

  const curtirFoto = (id) => {
    setFotos((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, likes: (f.likes || 0) + 1 } : f
      )
    );
  };

  const removerFoto = (id) => {
    setFotos((prev) => prev.filter((f) => f.id !== id));
  };

  const renderLinks = () => (
    <View style={{ margin: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
        Materiais
      </Text>

      {loadingLinks ? (
        <Text>Carregando...</Text>
      ) : links.length === 0 ? (
        <Text style={{ color: '#666' }}>Nenhum material disponível.</Text>
      ) : (
        links.map((item) => (
          <View
            key={item.id}
            style={{
              backgroundColor: '#fff',
              padding: 12,
              borderRadius: 10,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontWeight: '600' }}>{item.titulo}</Text>
            <Text style={{ color: '#666' }}>{item.data}</Text>

            <TouchableOpacity
              onPress={() => visualizarArquivo(item.url)}
              style={{
                backgroundColor: '#4CAF50',
                padding: 8,
                borderRadius: 6,
                marginTop: 6,
              }}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>
                Visualizar
              </Text>
            </TouchableOpacity>

            {role === 'admin' && (
              <TouchableOpacity onPress={() => excluirLink(item.id)}>
                <Text style={{ color: 'red', textAlign: 'center', marginTop: 4 }}>
                  Excluir
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      )}
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={fotos}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderLinks}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <View style={{ margin: 12 }}>
              <Image
                source={{ uri: item.uri }}
                style={{ width: '100%', height: 300, borderRadius: 12 }}
              />
              <Text style={{ marginTop: 6 }}>{item.hora}</Text>

              <TouchableOpacity
                onPress={() => curtirFoto(item.id)}
                style={{ marginTop: 4 }}
              >
                <Text>❤️ {item.likes}</Text>
              </TouchableOpacity>

              {role === 'admin' && (
                <TouchableOpacity onPress={() => removerFoto(item.id)}>
                  <Text style={{ color: 'red' }}>Excluir foto</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />

        {/* botão flutuante permanece igual */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
