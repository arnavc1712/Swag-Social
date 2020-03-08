import React, { Component } from 'react';
import { Container, Content, Header, Left, Right, Body, Title, Text, Button, Card, CardItem } from 'native-base';
import {NativeEventEmitter,NativeModules} from 'react-native'
import firestore from '@react-native-firebase/firestore';

const ChirpSDK = NativeModules.ChirpSDK;
const ChirpSDKEmitter = new NativeEventEmitter(ChirpSDK);

const key = '9EB2beE82ba3Ee44dDdFEfC3f';
const secret = 'F5FEaeD8D64eee5fD3f0f6EDEbEe00c4CE8F6a63bc134aeFB3';
const config = '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';
import SuccessModalContent from "./successModal"
import Modal from "react-native-modal";

 class Home extends Component {

    constructor(props){
        super(props)
        // console.log(props.route.params)
        this.state = {
            currentUser:null,
            status:null,
            'showSuccessModal':false,
            'currentUser':null
        }
        this.route = props.route
        this.navigation = props.navigation
        this.firebase = this.route.params.firebase
    }


    async componentDidMount(){

        this.unsubscriber = this.firebase.auth().onAuthStateChanged((user) => {
          if (user && user.emailVerified){
            this.setState({user:true });
            this.setState({currentUser:user})
          }
          else{
            this.setState({isLoggedIn:false });
          }
        });

        // this.onStateChanged = ChirpSDKEmitter.addListener(
        // 'onStateChanged',
        //     (event) => {
        //       if (event.status === ChirpSDK.CHIRP_SDK_STATE_STOPPED) {
        //         this.setState({ status: 'Stopped' });
        //       } else if (event.status === ChirpSDK.CHIRP_SDK_STATE_RUNNING) {
        //         this.setState({ status: 'Running' });
        //       } else if (event.status === ChirpSDK.CHIRP_SDK_STATE_SENDING) {
        //         this.setState({ status: 'Sending' });
        //       } else if (event.status === ChirpSDK.CHIRP_SDK_STATE_RECEIVING) {
        //         this.setState({ status: 'Receiving' });
        //       }
        //     }
        // );

        // this.onReceived = ChirpSDKEmitter.addListener(
        // 'onReceived',
        //     (event) => {
        //     if (event.data.length) {
        //         this.setState({ data: event.data });
        //         }

        //     fetch('https://socket-server-270005.appspot.com/api/takeAttendance/', {
        //         method: 'POST',
        //         headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json',
        //         },
        //     body: JSON.stringify({
        //         firstName: 'Arnav',
        //         lastName: 'Chakravarthy',
        //     }),
        //     }).then(response => response.json()).then(response => {
        //         console.log(response)
        //         alert("Attendance taken")
        //     })
        //     }
        // )

        // this.onError = ChirpSDKEmitter.addListener(
        //     'onError', (event) => { console.warn(event.message) }
        // )

        // try {
        //     ChirpSDK.init(key, secret);
        //     ChirpSDK.setConfig(config);
        //     ChirpSDK.start();
        //     this.setState({ initialised: true })
        // } catch(e) {
        //     console.warn(e.message);
        // }
     
    }

    async componentWillUnmount(){
        this.onStateChanged.remove();
        this.onReceived.remove();
        this.onError.remove();
        ChirpSDK.stop();
        if (this.unsubscriber){
            this.unsubscriber()
        }
    }

    timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  async sleep(fn, ...args) {
      await this.timeout(1500);
      this.setState({showSuccessModal:false});
  }



    render() {
        return (
            <Container>
                <Header>
                    <Left />
                    <Body>
                        <Title>Welcome</Title>
                    </Body>
                    <Right />
                </Header>
                <Content contentContainerStyle= {{justifyContent: 'center', alignItems: 'center', paddingTop: 40, paddingHorizontal: 10}}>

            <Modal
            testID={'modal'}
            isVisible={this.state.showSuccessModal}
            backdropColor="#B4B3DB"
            backdropOpacity={0.8}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}>
            <SuccessModalContent icon="check" text="Your attendance has been taken"/>
            </Modal>
                <Card>
                        <CardItem>
                            <Text>
                                Welcome to Candy Land Folks ;)
                            </Text>
                        </CardItem>
                        <CardItem>
                            <Text>
                                Press Button to fetch Github Repos
                            </Text>
                        </CardItem>
                    </Card>
                <Button dark block onPress= {() =>{fetch('https://chirp-server-dot-socket-server-270005.appspot.com/api/addattendance', {
                  method: 'POST',
                  headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  },
              body: JSON.stringify({
                  name: this.state.currentUser.firstName + " " + this.state.currentUser.lastName,
                  id: this.state.currentUser.email,
                  class:"cse545"

              }),
              }).then(response => response.json()).then(async (response) => {
                console.log(this.state.currentUser)
                  if(response.success){
                    this.setState({'showSuccessModal':true})
                    await this.sleep()
                  }
              })}} style= {{marginTop: 40}}>
                      <Text> Fetch Github Repos </Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

export default Home;
