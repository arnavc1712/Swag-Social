import React, { Component } from 'react';
import Constants from 'expo-constants';
import Modal from "react-native-modal";
import {StyleSheet,View, AsyncStorage} from 'react-native';

import {
  Container,
  Content,
  Header,
  Button,
  Text,
  Body,
  Form,
  Item as FormItem,
  Input,
  Label,
  Title,
  Toast
} from 'native-base';


class LogoutScreen extends Component {
	constructor(props){
		super(props);
		this.navigation = props.navigation
		this.route = props.route
    this.firebase = this.route.params.firebase
    this.setLoggedIn = this.route.params.setLoggedIn
    this.state={
      showModal:false
    }
	}

  componentDidMount(){
    const unsubscribe = this.navigation.addListener('focus', () => {
      this.setState({showModal:true})
    });
  }

	async onLogout(){
		try {
			await this.firebase.auth().signOut()
			Toast.show({text:"Successfully Logged Out",buttonText:"Okay",duration:750})
   //    this.setLoggedIn(false)
   //    this.forceUpdate()
			// this.navigation.navigate("Signup")
		}

		catch(error) {
			Toast.show({text:error.toString().split("Error:")[1].trim(),buttonText:"Okay",duration:3000})
			console.log(error)
		}


	}



	render() {
		return (
		<Container style={{ paddingTop: Constants.statusBarHeight }}>
      <Modal
            testID={'modal'}
            isVisible={this.state.showModal}
            backdropColor="#B4B3DB"
            backdropOpacity={0.8}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}>
            <View style={styles.content}>
            <Button full rounded style={styles.button} onPress={this.onLogout.bind(this)}>
            <Text style={styles.contentTitle}> Logout </Text>
          </Button>
          </View>
      </Modal>
        
        <Content padder contentContainerStyle={styles.form}>
          
        </Content>
      </Container>
      )
	}
}

const styles = StyleSheet.create({
	form:{
    flex:1,
    justifyContent : 'center'
	},
  button:{
    marginTop:10,
    width:"70%",
    alignSelf:'center',
    backgroundColor:'white'
    // flexDirection:'row'
  },
  content: {
    height:'auto',
    width:'auto',
    alignSelf:'center',
    backgroundColor: '#009688',
    padding: 22,
    height:'20%',
    // width:'50%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: 'rgba(0, 0, 0, 0.1)',


  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 5,
    justifyContent:'center',
    alignSelf:'center',
    alignItems:'center',
    color:'#009688'
  },

})


export default LogoutScreen