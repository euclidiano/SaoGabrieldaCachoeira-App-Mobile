import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from './styles';

export default function Versiculo({ navigation }) {
  const frases = [
    "E todos nós, que com a face descoberta contemplamos a glória do Senhor, segundo a sua imagem estamos sendo transformados com glória cada vez maior, a qual vem do Senhor, que é o Espírito.2 Coríntios 3:18",
    
    "Então Jesus foi com seus discípulos para um lugar chamado Getsêmani e lhes disse: 'Sentem-se aqui enquanto vou ali orar'. Indo um pouco mais adiante, prostrou-se com o rosto em terra e orou: 'Meu Pai, se for possível, afasta de mim este cálice; contudo, não seja como eu quero, mas sim como tu queres'.Mateus 26:36-39",
    "Não que eu já tenha obtido tudo isso ou tenha sido aperfeiçoado, mas prossigo para alcançá-lo, pois para isso também fui alcançado por Cristo Jesus.Filipenses 3:12",

    "Prestem atenção! Hoje estou pondo diante de vocês a bênção e a maldição. Vocês terão bênção se obedecerem aos mandamentos do Senhor, o seu Deus, que hoje estou dando a vocês; mas terão maldição se desobedecerem aos mandamentos do Senhor, o seu Deus, e se afastarem do caminho que hoje ordeno a vocês, para seguir deuses desconhecidos.- Deuteronômio 11:26-28",

    "Cristo nos redimiu da maldição da Lei quando se tornou maldição em nosso lugar, pois está escrito: 'Maldito todo aquele que for pendurado num madeiro'. Isso para que em Cristo Jesus a bênção de Abraão chegasse também aos gentios, para que recebêssemos a promessa do Espírito mediante a fé.- Gálatas 3:13-14",
    
    "Porque um menino nos nasceu,um filho nos foi dado,e o governo está sobre os seus ombros.E ele será chamado Maravilhoso Conselheiro, Deus Podero­so,Pai Eterno, Príncipe da Paz.- Isaías 9:6",

    "E não nos cansemos de fazer o bem, pois no tempo próprio colheremos, se não desanimarmos.- Gálatas 6:9",

    "Todavia, como está escrito: ‘Olho nenhum viu, ouvido nenhum ouviu, mente nenhuma imaginou o que Deus preparou para aqueles que o amam’;1 Coríntios 2:9",


    "Não furtarás. Êxodo 20:15",
    
    "Não há salvação em nenhum outro, pois, debaixo do céu não há nenhum outro nome dado aos homens pelo qual devamos ser salvos.Atos dos Apóstolos 4:12",
    "Mas acumulem para vocês tesouros nos céus, onde a traça e a ferrugem não destroem e onde os ladrões não arrombam nem furtam. Mateus 6:20",

  "'Assim diz o Senhor, o seu redentor, que o formou no ventre: 'Eu sou o Senhor, que fiz todas as coisas, que sozinho estendi os céus, que espalhei a terra por mim mesmo,'Isaías 44:24",
"Respondeu Jesus: Eu sou o caminho, a verdade e a vida. Ninguém vem ao Pai, a não ser por mim.João 14:6",
  "Pois derramarei água na terra sedenta, e torrentes na terra seca; derramarei meu Espírito sobre sua prole e minha bênção sobre seus descendentes.Isaías 44:3",
"Pois estou convencido de que nem morte nem vida, nem anjos nem demônios, nem o presente nem o futuro, nem quaisquer poderes, Nem altura nem profundidade, nem qualquer outra coisa na criação será capaz de nos separar do amor de Deus que está em Cristo Jesus, nosso Senhor.Romanos 8:38-39"

  ];

  const [frase, setFrase] = useState("");

  useEffect(() => {
    const ALEATORIA = frases[Math.floor(Math.random() * frases.length)];
    setFrase(ALEATORIA);
  }, []);


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.paragraph}>{frase}</Text>

              <TouchableOpacity
                onPress={() => {const nova = frases[Math.floor(Math.random() * frases.length)];
              setFrase(nova);}}

                style={[styles.botoes, { backgroundColor: '#65b043' }]}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize:16 }}>
                  Novo versiculo
                </Text>
              </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

