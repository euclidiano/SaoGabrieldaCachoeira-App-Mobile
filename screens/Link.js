import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import styles from "./styles";

const LINKS_URL =
  'https://firestore.googleapis.com/v1/projects/cmsgc-6b72a/databases/(default)/documents/links';

export default function Link() {
  const [titulo, setTitulo] = useState('');
  const [url, setUrl] = useState('');

  const salvar = async () => {
    if (!titulo || !url) {
      Alert.alert('Preencha tudo');
      return;
    }

    const body = {
      fields: {
        titulo: { stringValue: titulo.trim() },
        url: { stringValue: url.trim() },
        data: { timestampValue: new Date().toISOString() },
      },
    };

    try {
      await fetch(LINKS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      setTitulo('');
      setUrl('');
      Alert.alert('Link cadastrado com sucesso');
    } catch (e) {
      Alert.alert('Erro ao salvar');
    }
  };

  return (
  <SafeAreaProvider>
    <SafeAreaView style={{ flex: 1 }}>
       <View style={styles.containerLink}>
          
          <TextInput
            placeholder="Título do link"
            placeholderTextColor="#888"
            style={[styles.inputLink, { color: "#000" }]}
            value={titulo}
            onChangeText={setTitulo}
          />

          <TextInput
            placeholder="URL do link"
            placeholderTextColor="#888"
            style={[styles.inputLink, { color: "#000" }]}
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />

          <TouchableOpacity
            onPress={salvar}
            style={[styles.botoesLink, { backgroundColor: '#2f76fa' }]}
          >
            <Text style={styles.textoBotaoLink}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

 