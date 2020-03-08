import React, { Component } from 'react';
import { Container, Header, Content,List,ListItem, View, Text, Icon, Button,Body,Title,Left,Right } from 'native-base';
import { FlatList,StyleSheet } from 'react-native'
import Modal from "react-native-modal";

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheckSquare, faCoffee,faCheck,faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import ClassInfoModalContent from './classInfoModal'
import firestore from '@react-native-firebase/firestore';
library.add(faCoffee);
library.add(faCheck)
library.add(faArrowRight)


export default class App extends Component {
  constructor(props) {
    super(props)
    this.ref = firestore().collection('classes');
    this.state = { data:[
                        { key: 1, value: 'CSE 545' }, 
                        { key: 2, value: 'CSE 345' }, 
                        { key: 3, value: 'CSE 219' },
                        ],
                   showClassModal:false,
                   professorName:null,
                   courseName:null,
                   attendance:null
                }
  }

  removeItem(key) {
    let data = this.state.data
    data = data.filter((item) => item.key !== key)
    this.setState({ data })
  }

  fetchClassDets(value){
    try{
    const depName = value.split(' ')[0].toLowerCase();
    const classID = parseInt(value.split(' ')[1] )
    const classDetails = this.ref.where('classID','==',classID).get();
    classDetails.then((data) => {
                                  data = data._docs[0]._data
                                  this.setState({professorName:data.professorName,
                                                 courseName:data.courseName,
                                                  showClassModal:true})
                                })
    }
    catch(error){
      alert("Something went wrong. Please Try again")
      console.log(error)
    }
    
  }

  closeModal(){
    this.setState({professorName:null,
                   courseName:null,
                    showClassModal:false})
  }



  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Classes</Title>
          </Body>
        </Header>
        <Content scrollEnabled={true}>
          <Modal
            testID={'modal'}
            isVisible={this.state.showClassModal}
            backdropColor="#B4B3DB"
            backdropOpacity={0.8}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}>
            <ClassInfoModalContent professorName={this.state.professorName} courseName={this.state.courseName} closeModal={this.closeModal.bind(this)}/>
            </Modal>
          <List dataArray={this.state.data}
          renderRow={(item) => <ListItem onPress={()=>this.fetchClassDets(item.value)} key={item.key} style={styles.listItem}>
              <Left>
                <Text style={{fontSize:18,fontWeight:'bold',color:'#00796B'}}>{item.value}</Text>
              </Left>
              <Right>
                <FontAwesomeIcon icon='arrow-right' size={18} style={{color:'#FF1744',marginBottom:10}}/>
              </Right>
            </ListItem>}>
           
          </List>
        </Content>
      </Container>
    );
  }
}


const styles = StyleSheet.create({
  listItem:{
    borderBottomWidth:1,
    height:100
  }

})