//HomeNavigation.js

import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native';
import Home from '../components/Home'
import LogoutScreen from '../components/Logout'

const Drawer = createDrawerNavigator()


const HomeNavigation = () => {
	return (
		
		<Drawer.Navigator initialRouteName="Home">
			<Drawer.Screen name="Home" component={Home} />
			<Drawer.Screen name="Logout" component={LogoutScreen} />
		</Drawer.Navigator>
		
		)
}

export default HomeNavigation