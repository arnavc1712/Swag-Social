//AuthNavigation.js
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native';
import SignupScreen from '../components/Signup'

const Drawer = createDrawerNavigator()


const AuthNavigation = () => {
	return (
		
		<Drawer.Navigator initialRouteName="Signup">
			<Drawer.Screen name="Signup" component={SignupScreen} />
		</Drawer.Navigator>
		
		)
}

export default AuthNavigation