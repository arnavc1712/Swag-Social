//index.js
import { createSwitchNavigator, createAppContainer } from '@react-navigation/native'
import HomeNavigation from './HomeNav'
import AuthNavigation from './Auth'

const SwitchNavigator = createSwitchNavigator(
  {
    Auth: AuthNavigation,
    Home: HomeNavigation
  },
  {
    initialRouteName: 'Auth'
  }
)

const AppContainer = createAppContainer(SwitchNavigator)

export default AppContainer