import { StyleSheet, StatusBar } from 'react-native';

export default StyleSheet.create({
  safeAreaBox: {
    flex: 1,
    backgroundColor: '#ecf0f1',
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
    backgroundColor: '#f8f8f8',
    margin: 12,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    bottom: 5,
    
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
    flex: 1,
    marginHorizontal: 4,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  inputText: { 
    fontSize: 16, 
    color: '#595959'
  },
  placeholderText: { 
    fontSize: 16, 
    color: '#999' // Cor de placeholder comum
  },
  checklistContainer: { 
    marginBottom: 15,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  checkItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  checkbox: { 
    marginRight: 8
  }, 
  checkLabel: { 
    fontSize: 16, 
    color: '#333' 
  },
});
