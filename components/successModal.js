import React from 'react';
import {StyleSheet,View} from 'react-native';
import {Container,Button,Text} from 'native-base'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheckSquare, faCoffee,faCheck,faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faCoffee);
library.add(faCheck)
library.add(faTimesCircle)

type Props = {
  onPress: () => any;
};

const SuccessModalContent = (props) => {

    return(
      <View style={styles.content}>
        <FontAwesomeIcon icon={props.icon} size={32} style={{color:'white',marginBottom:10}}/>
        <Text style={styles.contentTitle}>{props.text}</Text>
        
      </View>
  )
};

const styles = StyleSheet.create({
  content: {
    height:'auto',
    width:'auto',
    alignSelf:'center',
    backgroundColor: '#009688',
    padding: 22,
    height:'20%',
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
    color:'white'
  },
});

export default SuccessModalContent;