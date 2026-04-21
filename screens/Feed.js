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
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
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
        json.documents?.map((doc) => {
          // Pegando o timestamp e convertendo para formato legível
          const dataTimestamp = doc.fields?.data?.timestampValue;
          const dataFormatada = dataTimestamp
            ? new Date(dataTimestamp).toLocaleString('pt-BR')
            : 'Sem data';

          return {
            id: doc.name.split('/').pop(),
            titulo: doc.fields?.titulo?.stringValue ?? 'Sem título',
            url: doc.fields?.url?.stringValue ?? '',
            data: dataFormatada,
          };
        }) || [];

      lista.sort((a, b) => new Date(b.data) - new Date(a.data));
      setLinks(lista);
    } catch (e) {
      console.warn('Erro ao buscar links:', e);
    } finally {
      setLoadingLinks(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      buscarLinks();
    }, [])
  );


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
      {loadingLinks ? (
        <Text>Carregando...</Text>
      ) : links.length === 0 ? (
        <Text style={{ color: '#666' }}>Nenhum Link disponível.</Text>
      ) : (
        links.map((item) => (
          
          <View
            key={item.id}
            style={{
              backgroundColor: '#fff',
              padding: 12,
              borderRadius: 10,
              marginBottom: 8,
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
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
        />

        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            alignItems: 'flex-end',
          }}>
          {menuVisivel && (
            <Pressable
              onPress={() => setMenuVisivel(false)}
              style={StyleSheet.absoluteFillObject}
            />
          )}

          {menuVisivel && (
            <View
              style={{
                marginBottom: 10,
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 8,
                width: 180,
                elevation: 6,
                shadowOffset: 6,
              }}>
              {role === 'admin' && (
                <TouchableOpacity
                  onPress={() => {
                    setMenuVisivel(false);
                    navigation.navigate('pa');
                  }}
                  style={{ paddingVertical: 8 }}>
                  <Text style={{ fontWeight: '600', color: '#222' }}>
                    Painel Admin
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ver');
                }}
                style={{ paddingVertical: 8 }}>
                <Text style={{ fontWeight: '600', color: '#222' }}>
                  Versiculos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setMenuVisivel(false);
                  navigation.navigate('cat');
                }}
                style={{ paddingVertical: 8 }}>
                <Text style={{ fontWeight: '600', color: '#222' }}>
                  Catequese
                </Text>
              </TouchableOpacity>

              {role === 'admin' && (
              <TouchableOpacity
                onPress={() => {
                  setMenuVisivel(false);
                  navigation.navigate('link'); 
                }}
                style={{ paddingVertical: 8 }}>
                <Text style={{ fontWeight: '600', color: '#222' }}>
                  Adicionar Link
                </Text>
              </TouchableOpacity>
              )}
            </View>
          )}

          <Pressable
            android_ripple={{ color: '#555', borderless: true }}
            onPress={() => {
              setMenuVisivel((v) => !v);
            }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: '#111',
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 6,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4, 
            }}>
            <Text style={{ color: 'white', fontSize: 28, lineHeight: 30 }}>
              彡
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
