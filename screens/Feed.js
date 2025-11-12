import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  TouchableOpacity,
  Alert,
  Animated,
  StyleSheet,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles";

export default function Feed({ route, navigation }) {
  const { usuario, role } = route.params || {};
  const [fotos, setFotos] = useState([]);
  const [menuVisivel, setMenuVisivel] = useState(false);



  useEffect(() => {
    const carregarFotos = async () => {
      try {
        const dados = await AsyncStorage.getItem("fotos");
        if (dados) setFotos(JSON.parse(dados));
      } catch (e) {
        console.warn("Erro carregando fotos:", e);
      }
    };
    carregarFotos();
  }, []);



  useEffect(() => {
    AsyncStorage.setItem("fotos", JSON.stringify(fotos)).catch((e) =>
      console.warn("Erro salvando fotos:", e)
    );
  }, [fotos]);






  const adicionarImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão negada para acessar as fotos!");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    const cancelled = resultado.canceled ?? resultado.cancelled ?? false;
    const assets = resultado.assets ?? resultado;

    if (!cancelled) {
      const agora = new Date();
      const uri = (assets && assets[0] && assets[0].uri) || resultado.uri;
      const novaFoto = {
        id: Date.now().toString(),
        uri,
        hora: agora.toLocaleString("pt-BR"),
        likes: 0,
      
      };
      setFotos((prev) => [novaFoto, ...prev]);
    }
  };

  const removerFoto = (id) => {
    Alert.alert(
      "Excluir foto",
      "Tem certeza que deseja excluir esta foto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            setFotos((prev) => prev.filter((foto) => foto.id !== id));
          },
        },
      ],
      { cancelable: true }
    );
  };

  const curtirFoto = (id) => {
    setFotos((prev) =>
      prev.map((foto) =>
        foto.id === id ? { ...foto, likes: (foto.likes || 0) + 1 } : foto
      )
    );
  };

  const animarBotao = () => {
    Animated.sequence([
      Animated.spring(anim, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea ?? { flex: 1 }, { flex: 1 }]}>
        <FlatList
          data={fotos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100, margin: 12 }}
          renderItem={({ item }) => (
            <View style={styles.post ?? { margin: 12, position: "relative" }}>
              {role === "admin" && (
                <TouchableOpacity
                  onPress={() => removerFoto(item.id)}
                  style={{
                    position: "absolute",
                    top: 15,
                    right: 10,
                    backgroundColor: "rgba(255,0,0,0.85)",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                    zIndex: 10,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>X</Text>
                </TouchableOpacity>
              )}

              <Image
                source={{ uri: item.uri }}
                style={
                  styles.imagem ?? { width: "100%", height: 300, borderRadius: 12 }
                }
                resizeMode="cover"
              />

              <Text style={styles.hora ?? { margin: 12, color: "#555" }}>
                {item.hora}
              </Text>

              <View
                style={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={styles.curtida ?? { marginRight: 8, bottom: 8 }}>
                  {item.likes ?? 0}
                </Text>

                <TouchableOpacity
                  onPress={() => curtirFoto(item.id)}
                  style={{
                    backgroundColor: "#4CAF50",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                    top: 6,
                    bottom: 8,
                  }}
                >
                  <Text style={{ color: "white" }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            alignItems: "flex-end",
          }}
        >
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
                backgroundColor: "white",
                borderRadius: 10,
                padding: 8,
                width: 180,
                elevation: 6,
                shadowOffset:6,
              }}
            >
              {role === "admin" && (
                <TouchableOpacity
                  onPress={() => {
                    setMenuVisivel(false);
                    navigation.navigate("pa");
                  }}
                  style={{ paddingVertical: 8 }}
                >
                  <Text style={{ fontWeight: "600", color: "#222" }}>
                    Painel Admin
                  </Text>
                </TouchableOpacity>
              )}



                <TouchableOpacity
                  onPress={() => {
                    setMenuVisivel(false);
                    navigation.navigate("ver");
                  }}
                  style={{ paddingVertical: 8 }}
                >
                  <Text style={{ fontWeight: "600", color: "#222" }}>
                    Versiculos
                  </Text>
                </TouchableOpacity>


              <TouchableOpacity
                onPress={() => {
                  setMenuVisivel(false);
                  navigation.navigate("cat");
                }}
                style={{ paddingVertical: 8 }}
              >
                <Text style={{ fontWeight: "600", color: "#222" }}>
                  Catequese
                </Text>
              </TouchableOpacity>

              {role === "admin" && (
                <TouchableOpacity
                  onPress={() => {
                    setMenuVisivel(false);
                    adicionarImagem();
                  }}
                  style={{ paddingVertical: 8 }}
                >
                  <Text style={{ fontWeight: "600", color: "#222" }}>
                    Adicionar Imagem
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}


            <Pressable
              android_ripple={{ color: "#555", borderless: true }}
              onPress={() => {
                setMenuVisivel((v) => !v);
              }}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#111",
                alignItems: "center",
                justifyContent: "center",
                elevation: 6,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
            >
              <Text style={{ color: "white", fontSize: 28, lineHeight: 30 }}>
                彡
              </Text>
            </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}