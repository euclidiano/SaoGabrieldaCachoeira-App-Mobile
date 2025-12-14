import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

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
    <View style={{ padding: 20 }}>
      <Text>Título</Text>
      <TextInput
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text>URL do Google Drive</Text>
      <TextInput
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
      />

      <TouchableOpacity onPress={salvar}>
        <Text style={{ marginTop: 20 }}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}
