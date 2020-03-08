import {View,StyleSheet,Image} from 'react-native';
import React, {Component} from 'react';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import {Container,Text,Content,Header, Icon, Picker, Form,Button,Item,Input} from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheckSquare, faCoffee,faCheck,faMapMarkerAlt,faLocation } from '@fortawesome/free-solid-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import Geocoder from 'react-native-geocoding';
library.add(faCoffee);
library.add(faCheck)
library.add(faMapMarkerAlt)


// selectedComplaint
// onValueChange
// complaintTypes
// selectedAddress
// setAddress
// loading
// firstLetCapital
// navNewAddress


class RegisterComplaint extends Component{
	constructor(props){
		super(props)
		this.state = {
			loading:props.loading
		}
	}

	


	render(){
		let renderComp;

    if(!this.props.loading){
      renderComp = 
      	
            <Form>
              <Item style={styles.picker}>
                <Picker
                  mode="dropdown"
                  // iosIcon={<Icon name="arrow-down" />}
                  placeholder="Select your SIM"
                  placeholderStyle={{ color: "black" }}
                  placeholderIconColor="#007aff"
                  
                  selectedValue={this.props.selectedComplaint}
                  onValueChange={this.props.onValueChange}
                >
                  {this.props.complaintTypes.map((item,index) =>{
                    return <Picker.Item label={this.props.firstLetCapital(item)} value={item} key={index} />
                  })}
                  
                </Picker>
                </Item>
              
                <Item style={styles.address} >
                <Input placeholder="Enter Address" value={this.props.selectedAddress} onChangeText={val => this.props.setAddress(val)}/>
                <Button transparent onPress={this.props.navNewAddress} class="float-right" style={{margin:0,padding:0,height:'auto',width:'auto'}}>
                	<FontAwesomeIcon icon="map-marker-alt" size={32} style={{color:'#FF1744'}}/>
                </Button>
                </Item>

                <Button full rounded style={styles.button} onPress={this.props.submitComplaint} ><Text> Register Complaint </Text></Button>
              </Form>  
          
    }

    else{
      renderComp = <Container style={{alignSelf:'center'}}><Bars style={{width:'100%'}} size={75} color="#26A69A" /></Container>
    }

    return (
    	<React.Fragment>
    	{renderComp}
    	</React.Fragment>)
	}
}

const styles = StyleSheet.create({
	picker:{
  width: "50%",
  alignSelf:'center',
  justifyContent:'center',
  alignItems:'center',
  marginTop:20,
  borderColor: '#009688',
  borderBottomWidth:2
 },
 address:{
  marginTop:20,
  width:'70%',
  alignSelf:'center',
  flexDirection:'row',
  borderColor: '#009688',
  borderBottomWidth:2
 },
 button:{
  marginTop:20,
  width:'50%',
  alignSelf:'center',
  backgroundColor:'#009688'
 },
 locButton:{

 	marginLeft:20
 },
 input:{
  borderColor: '#009688',
  borderBottomWidth:2
 }
})

export default RegisterComplaint;