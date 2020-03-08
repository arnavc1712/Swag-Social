import React, { Component } from 'react';
import Constants from 'expo-constants';
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
  Toast,
  Spinner
} from 'native-base';

import {StyleSheet,View, AsyncStorage} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Modal from "react-native-modal";
import auth from '@react-native-firebase/auth';

import SignupModalContent from "./SignupModalContent"
import SuccessModalContent from "./successModal"


class SignupScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      email:'',
      password:'',
      showModal:false,
      currentUser:null,
      loading:false
    }
    this.navigation = props.navigation
    this.route = props.route
    this.listener = null
    this.setLoggedIn = this.route.params.setLoggedIn
    this.firebase = this.route.params.firebase


  }



  async componentDidMount(){
    	try {
    		this.listener = this.navigation.addListener('focus', () => {
      		this.setState({email:'',password:''})
      	});

        this.unsubscriber = auth().onAuthStateChanged((user) => {
          this.setState({currentUser:user });
        
        });
  	   }

    	catch(error){
    		console.log(error)
    	}	

    }

  // async componentWillUnmount() {
  // 	delete this.listener
  //   if (this.unsubscriber){
  //     this.unsubscriber()
  //   }
  // }


  async onLogin(){
    try {
      this.setState({loading:true})
      const currentUser = await auth().signInWithEmailAndPassword(this.state.email.trim(),this.state.password)
      this.setState({currentUser:currentUser.user})
      if (!currentUser.user.emailVerified){
        this.setState({showModal:true})
      }
      
    }
    catch(error){
      console.log(error)
      Toast.show({text:error.toString().split("Error:")[1].trim(),buttonText:"Okay",duration:3000})
      this.setState({loading:false})


    }
    finally{
      this.setState({loading:false})

    }
  }

  async onVerifyEmail(){
    try{
      this.setState({showModal:false})
      this.setState({loading:true})
      if(this.state.currentUser){
        const currentUser = this.state.currentUser
        await this.firebase.auth().currentUser.sendEmailVerification()
        Toast.show({text:"A verfication email has been sent to "+currentUser.email,buttonText:"Okay",duration:3000})

      }

    }
    catch(error){
      console.log(error)
      this.setState({loading:false})
      Toast.show({text:error.toString().split("Error:")[1].trim(),buttonText:"Okay",duration:3000})
    }
    finally{
      
      this.setState({loading:false})
    }

  }

  async onSignup(){
    try {
      // await AsyncStorage.setItem("firstName",this.state.firstName)
      this.setState({loading:true})
      const currentUser = await auth().createUserWithEmailAndPassword(this.state.email,this.state.password)

      await auth().currentUser.sendEmailVerification()
      Toast.show({text:"A verfication email has been sent to "+currentUser.user.email,buttonText:"Okay",duration:3000})
    
      
    }
    catch(error){
      console.log(error)
      Toast.show({text:error.toString().split("Error:")[1].trim(),buttonText:"Okay",duration:3000})
      // alert("Something went wrong.\n Please try again")
    }

    finally{
      this.setState({email:'',password:''})
      this.setState({loading:false})
    }
  }


  render() {


    return (
      <Container style={{ paddingTop: Constants.statusBarHeight }}>
        <Header style={{backgroundColor:'#00695C'}}>
          <Body>
            <Title>Signup</Title>
          </Body>
        </Header>
        <Content padder contentContainerStyle={styles.form}>
       
         
        
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
            <SignupModalContent onPress={this.onVerifyEmail.bind(this)}/>
            </Modal>

          <Form>
            <FormItem floatingLabel style={styles.item}>
              <Label>Email ID</Label>
              <Input value={this.state.email} onChangeText={val => this.setState({email:val})} />
            </FormItem>
            <FormItem floatingLabel last style={styles.item}>
              <Label>Password</Label>
              <Input value={this.state.password} secureTextEntry={true} onChangeText={val => this.setState({password:val})}/>
            </FormItem>

              
            <Button full rounded style={styles.button} onPress={this.onLogin.bind(this)}><Text> Login </Text></Button>
            <Button full rounded style={styles.button} onPress={this.onSignup.bind(this)}><Text> Sign Up </Text></Button>
       
          </Form>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
	form:{
    flex:1,
    justifyContent : 'center'
	},
  item:{
    borderBottomWidth:2,
    borderColor:'#009688'
  },
  button:{
    marginTop:15,
    width:"50%",
    alignSelf:'center',
    backgroundColor:'#009688'
    // flexDirection:'row'
  }

})

export default SignupScreen