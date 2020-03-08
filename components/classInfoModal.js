import React from 'react';
import {StyleSheet,View} from 'react-native';
import {Container,Button,Text,Left,Right} from 'native-base'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheckSquare, faCoffee,faCheck } from '@fortawesome/free-solid-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import { Col, Row, Grid } from "react-native-easy-grid";
library.add(faCoffee);
library.add(faCheck)


type Props = {
  onPress: () => any;
};

const ClassInfoModalContent = (props) => {

    return(
        <React.Fragment>

        <Grid style={styles.content}>
        <Row size={1} style={styles.row}>
          <Left style={{}}><Text style={Object.assign({fontWeight:'bold',fontSize:40},styles.contentTitle)}>Course Name</Text></Left>
          <Right><Text style={styles.contentTitle}>{props.courseName}</Text></Right>
        </Row>
        <Row size={1} style={styles.row}>
          <Left><Text style={Object.assign({fontWeight:'bold'},styles.contentTitle)}>Professor</Text></Left>
          <Left><Text style={styles.contentTitle}>{props.professorName}</Text></Left>
        </Row>
         <Row size={1} style={styles.row}>
          <Left><Text style={Object.assign({fontWeight:'bold'},styles.contentTitle)}>Attendance</Text></Left>
          <Left><Text style={styles.contentTitle}>{props.attendance}</Text></Left>
        </Row>
        <Row size={1}>
          <Button full rounded testID={'close-button'} onPress={props.closeModal} style={{backgroundColor:'#009688',width:'30%'}}><Text style={{color:'white',fontSize:14}}>Close</Text></Button>
        </Row>
        </Grid>
        </React.Fragment>
      
  )
};

const styles = StyleSheet.create({
  content: {
    // height:'auto',
    // width:'auto',
    flex:1,
    alignSelf:'center',
    backgroundColor: 'white',
    // padding: 22,
    height:'20%',
    maxHeight:'50%',
    // width:'90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    padding:0


  },
  row:{
    justifyContent: 'center',
    alignItems: 'center',
    margin:0,
    padding:0,
    height:30
  },
  contentTitle: {
    fontSize: 15,
    justifyContent:'center',
    alignSelf:'flex-start',
    paddingLeft:20,
    // alignItems:'center',
    color:'#009688',
    margin:0,
    padding:0
  },
});

export default ClassInfoModalContent;