import { StyleSheet, StatusBar } from 'react-native';

export default StyleSheet.create({
  safeAreaBox: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingTop: StatusBar.currentHeight,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  
  paragraph: {
    marginVertical: 16,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    alignItems: 'center',
    flex: 1,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    color: '#595959',
  },

  card: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    overflow: 'hidden',
  },

  cardText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#222',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  logo: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginBottom: 25,
    marginTop: 25,
  },


  highlight: {
    marginVertical: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0066cc',
  },

  post: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingBottom: 5,
  },

  curtida: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 5,
    top: 6,
  },

  imagem: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 12,
    marginBottom: 6,  // Adiciona um pequeno espaçamento entre a borda e o conteúdo
    flex: 1,
    
  },

  hora: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },

  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  botoes: {
    alignItems: 'center',
    padding: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginHorizontal: 4,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  containerLink: {
    padding: 20,
  },

  tituloLink: {
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
    fontWeight: "500",
  },

  inputLink: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    color: "#000",
  },

  botoesLink: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  textoBotaoLink: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});