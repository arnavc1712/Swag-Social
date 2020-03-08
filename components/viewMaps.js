import MapView, { PROVIDER_GOOGLE,Marker,Callout,AnimatedRegion, Animated } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {View,StyleSheet,Image} from 'react-native';
import React, {Component} from 'react';
import {Container,Text,Content,Header, Icon, Picker, Form,Button,Item,Input} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import firestore from '@react-native-firebase/firestore';

import RegisterComplaint from './registerComplaint'
import Geocoder from 'react-native-geocoding';
import GetLocation from 'react-native-get-location'
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import firebase from '@react-native-firebase/app';
import SuccessModalContent from "./successModal"
import Modal from "react-native-modal";


Geocoder.init("AIzaSyBfnMT32j2IPKOiQBkmnfEEUWiLiNKRo0o");



const styles = StyleSheet.create({
 container: {
   // ...StyleSheet.absoluteFillObject,
   // flex:1,
   // justifyContent: 'flex-end',
   // alignItems: 'center',
 },
 map: {
   ...StyleSheet.absoluteFillObject,

 },
 // button
 picker:{
  width: "50%",
  alignSelf:'center',
  justifyContent:'center',
  alignItems:'center',
  marginTop:20
 },
 address:{
  marginTop:20,
  width:'50%',
  alignSelf:'center'
 },
 button:{
  marginTop:20,
  width:'50%',
  alignSelf:'center'
 },
 input:{
  borderColor: '#009688'
 }
});

const mapStyle = [
    {
        "featureType": "administrative.country",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "hue": "#ff0000"
            }
        ]
    }
]

   

class ViewMaps extends Component {

  constructor(props){
    super(props)

    this.state = {
      complaintTypes:[],
      selectedComplaint:null,
      coordinate:{latitude: 33.427204,
      longitude: -111.939896},
      selectedAddress:null,
      loading:true,
      currentUser:null,
      showSuccessModal:false,
      markers:[]
    }
    // INITIALIZING COMPLAINT TYPES
    this.refTypes = firestore().collection('Types');

    this.refComplaints = firestore().collection('Complaints')
  }

  async componentDidMount(){
    try{
      this.renderTypes()

      const location = await GetLocation.getCurrentPosition({enableHighAccuracy: true,timeout: 15000})
      // this.animate({})
      const address = await Geocoder.from({latitude: location.latitude,
               longitude: location.longitude})

      // USER AUTH
      this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
          if (user && user.emailVerified){
            this.setState({currentUser:user})
          }
        });

      

      this.animate({
          longitude:location.longitude,
          latitude: location.latitude
        })
      this.setState({selectedAddress:address.results[0].formatted_address})
      this.setState({coordinate:{latitude: location.latitude,
               longitude: location.longitude}})
      this.setState({loading:false})





      // Listening for any Complaint Updates
      this.refComplaints.onSnapshot(querySnapshot => {
        const complaints = []
        querySnapshot.forEach(doc => {
          const {lat,lon,status,type} = doc.data()
          complaints.push({coordinate:{latitude:parseFloat(lat),longitude:parseFloat(lon)},type:type})
        })
        this.setState({markers:complaints})

      })

    }
    catch(error){
      console.log(error)
    }
  

    // this.setState({longitude:location.longitude,
    //                 latitude: location.latitude})
    

  }

  setAddress(val){
    this.setState({selectedAddress:val})
  }

  timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  async sleep(fn, ...args) {
      await this.timeout(1500);
      this.setState({showSuccessModal:false});
  }


  async navNewAddress(){
    try{
      
    let location = await Geocoder.from(this.state.selectedAddress)
    location = location.results[0].geometry.location
    this.animate({
          longitude:location.lng,
          latitude: location.lat
        })
    
    this.setState({coordinate:{latitude: location.lat,
               longitude: location.lng}})
    }


    catch(error){
      console.log(error)
    }
  }

  renderTypes(){
    const types = this.refTypes.get()
    let complaintTypes = []
    types.then((data) => {
      data._docs.forEach((item,index) => {
        complaintTypes.push(item._data.type)
        // console.log()
      })
      this.setState({complaintTypes:complaintTypes})
      this.setState({selectedComplaint:complaintTypes[1]})
      
    })
    

  }

  // getInitalRegion(){
  //   return new AnimatedRegion({
     
  //   })
  // }

  async geocodingAddress(address){
    try {
      const json = await Geocoder.from(address)
      const location = json.results[0].geometry.location;
      // this.setState({latitude:this.state.lat,
      //                 longitude:this.state.lng})
    }
    catch(err){
      alert("Something went wrong, Please Try again ")
    }
    
  }

  firstLetCapital(item){
    return item.toLowerCase()
                      .split(' ')
                      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                      .join(' ')
  }



  onValueChange(item){
    this.setState({selectedComplaint:item})
  }

  async submitComplaint(){
    console.log(this.state.currentUser)
    fetch('https://socioproj-server-dot-socket-server-270005.appspot.com/api/addComplaint', {
                  method: 'POST',
                  headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  },
              body: JSON.stringify({
                  type:this.state.selectedComplaint,
                  lat: this.state.coordinate.latitude,
                  lon:this.state.coordinate.longitude,
                  userid:this.state.currentUser.email


              }),
              }).then(response => response.json()).then((response) => {
                // console.log(this.state.currentUser)
                  if(response.success){
                    this.setState({'showSuccessModal':true,
                                   'modalIcon':'check',
                                    'modalText':"Your comlaint has been submitted!"})
                    this.sleep()
                  }
              }).catch((error) => {
                // console.log(error)
                this.setState({'showSuccessModal':true,
                                   'modalIcon':'times-circle',
                                    'modalText':"There seems to be something wrong"})
                    this.sleep()
              })

  }

  animate(newCoordinate) {
    const { coordinate } = this.state;
      
    if (this.map){
      this.map.animateToRegion({latitude: newCoordinate.latitude,
                 longitude: newCoordinate.longitude,
                 latitudeDelta: 0.015,
                 longitudeDelta: 0.0121,},1000)
    }
      if (Platform.OS === 'android') {
        if (this.marker) {
          this.marker._component.animateMarkerToCoordinate(newCoordinate, 1000);
        }
      } else {
        coordinate.timing(newCoordinate).start();
      }
    }

  async componentWillUnmount(){
        if (this.unsubscriber){
            this.unsubscriber()
        }
    }

  render(){
    

    return(
      <React.Fragment>
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
            <SuccessModalContent icon={this.state.modalIcon} text={this.state.modalText}/>
            </Modal>
       <Container style={styles.container}>

        <Grid>
        <Row size={1}>
         <MapView
         // showUserLocation={true}
         ref={(map) => { this.map = map; }}
          customMapStyle={mapStyle}
           provider={PROVIDER_GOOGLE} // remove if not using Google Maps
           style={styles.map}
           initialRegion={{
             latitude: this.state.coordinate.latitude,
             longitude: this.state.coordinate.longitude,
             latitudeDelta: 0.015,
             longitudeDelta: 0.0121,
           }}
         >
         <Marker.Animated
         ref={marker => { this.marker = marker }}
         style={{zIndex:1}}
         draggable
         flat={true}
          coordinate={this.state.coordinate}
          title={this.state.selectedComplaint?this.firstLetCapital(this.state.selectedComplaint):this.state.selectedComplaint}
          description={"something "}
        /> 
        {this.state.markers.map(mark => (
        <Marker 
          coordinate={mark.coordinate}
          title={mark.type}
          pinColor="#00B8D4"
        />
      ))}
         </MapView>
          </Row>
          <Row size={1} >
          <Container>
            <RegisterComplaint selectedComplaint={this.state.selectedComplaint}
onValueChange={this.onValueChange.bind(this)}
complaintTypes={this.state.complaintTypes}
selectedAddress={this.state.selectedAddress}
submitComplaint={this.submitComplaint.bind(this)}
coordinate={this.state.coordinate}
setAddress={this.setAddress.bind(this)}
loading={this.state.loading}
firstLetCapital={this.firstLetCapital}
navNewAddress={this.navNewAddress.bind(this)} />
          </Container>
          </Row>
          
        </Grid>

       </Container>

       </React.Fragment>
   )
 }
}

export default ViewMaps;