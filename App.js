import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Cadastro from './screens/Cadastro';
import Feed from './screens/Feed';
import Login from './screens/Login';
import Catequese from './screens/CadCat';
import PainelAdmin from './screens/PainelAdm';
import Versiculo from './screens/versiculo.js'
import Link from './screens/Link.js'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="log">
        <Stack.Screen
          name="cad"
          component={Cadastro}
          options={{ title: 'Cadastro' }}
        />
        <Stack.Screen
          name="log"
          component={Login}
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="feed"
          component={Feed}
          options={{ title: 'Feed' }}
        />
        <Stack.Screen
          name="pa"
          component={PainelAdmin}
          options={{ title: 'Painel do Admin' }}
        />
        <Stack.Screen
          name="ver"
          component={Versiculo}
          options={{ title: 'Versiculos' }}
        />
        <Stack.Screen
          name="link"
          component={Link}
          options={{ title: 'Link' }}
        />
        <Stack.Screen
          name="cat"
          component={Catequese}
          options={{ title: 'Cadastro da Catequese' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
