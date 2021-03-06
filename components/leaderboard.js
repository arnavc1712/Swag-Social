import {View,StyleSheet,Image} from 'react-native';
import React, {Component} from 'react';
import {Container,Text,Content,Header, Icon, Picker, Body,Title,Form,Button,Item,Input} from 'native-base';
import Leaderboard from 'react-native-leaderboard';
import Constants from 'expo-constants';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';


const ordinal_suffix_of = (i) => {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

class Scoreboard extends Component{

	constructor(props){
		super(props)
		this.state = {
	    leaderboardData: [],
	    userRank: 1,
        user: {
            score: 69
        }
        ,
        currentUser:null
	}
		this.ref = firestore().collection('Complaints')
	}

	componentDidMount() {

	this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
      if (user && user.emailVerified){
        this.setState({currentUser:user})
      }
    });

    // simulate new users being added to leaderboard

    this.ref.onSnapshot(querySnapshot => {
        let data = {}
        let leaderboardData = []
        querySnapshot.forEach(doc => {
          const {lat,lon,status,type,userid} = doc.data()
          if (userid in data){
            data[userid]+=1
          }
          else{
            data[userid]=1
          }
        })

        for (let key of Object.keys(data)) {
		  leaderboardData.push({
			    name: key,
			    score: parseInt(data[key]),
			    iconUrl:
			      "https://landofblogging.files.wordpress.com/2014/01/bitstripavatarprofilepic.jpeg?w=300&h=300"
			  }) // John, then 30
		}


        this.setState({leaderboardData:leaderboardData})
        let temp = this.state.leaderboardData.sort((a, b) => (a.score <b.score) ? 1 : -1)
        if(this.state.currentUser!=null){
        	// console.log(this.state.currentUser)
	    for (var i = 0; i < temp.length; i++) {
	    	console.log(temp[i])
	    	console.log()
		    if (temp[i].name == this.state.currentUser.email){

		    	this.setState({userRank:i+1,
		    				   user:{score:temp[i].score}})
		    	
		    	break;
		    }
		    //Do something
		}
		}
      })


    

   	
  }

 

  	async componentWillUnmount(){
        if (this.unsubscriber){
            this.unsubscriber()
        }
    }

	renderHeader() {
        return (
            <View colors={[, '#1da2c6', '#1695b7']}
                style={{ backgroundColor: '#00BFA5', padding: 15, paddingTop: 35, alignItems: 'center' }}>
                <Text style={{ fontSize: 25, color: 'white', }}>Leaderboard</Text>
                <View style={{
                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                    marginBottom: 15, marginTop: 20
                }}>
                    <Text style={{ color: 'white', fontSize: 25, flex: 1, textAlign: 'right', marginRight: 40 }}>
                        {ordinal_suffix_of(this.state.userRank)}
                    </Text>
                    <Image style={{ flex: .66, height: 60, width: 60, borderRadius: 60 / 2 }}
                        source={{ uri: 'https://www.shareicon.net/data/128x128/2016/09/15/829473_man_512x512.png' }} />
                    <Text style={{ color: 'white', fontSize: 25, flex: 1, marginLeft: 40 }}>
                        {this.state.user.score}pts
                    </Text>
                </View>

           
            </View>
        )
    }

	render(){

		const props = {
      labelBy: "name",
      sortBy: "score",
      data: this.state.leaderboardData,
      icon: "iconUrl",
      onRowPress: (item, index) => {
        console.log(item)
      },
     labelStyle:{fontSize:18}

    };

		return (
		// <Container style={{ paddingTop: Constants.statusBarHeight }}>
  //       <Header style={{backgroundColor:'#FF5252'}}>
  //         <Body>
  //           <Title>Leaderboard</Title>
  //         </Body>
  //       </Header>
  //       <Content>
      <View style={{ flex: 1 }}>
        {/* Ghetto Header */}
       	{this.renderHeader()}
        <Leaderboard {...props} />
      </View>
     
        )
	}
}
const DATA = [
  {
    name: "We Tu Lo",
    score: null,
    iconUrl:
      "https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg"
  },
  {
    name: "Adam Savage",
    score: 12,
    iconUrl:
      "https://www.shareicon.net/data/128x128/2016/09/15/829473_man_512x512.png"
  },
  {
    name: "Derek Black",
    score: 244,
    iconUrl: "http://ttsbilisim.com/wp-content/uploads/2014/09/20120807.png"
  },
  {
    name: "Erika White",
    score: 0,
    iconUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr27ZFBaclzKcxg2FgJh6xi3Z5-9vP_U1DPcB149bYXxlPKqv-"
  },
  {
    name: "Jimmy John",
    score: 20,
    iconUrl: "https://static.witei.com/static/img/profile_pics/avatar4.png"
  },
  {
    name: "Joe Roddy",
    score: 69,
    iconUrl: "https://static.witei.com/static/img/profile_pics/avatar4.png"
  },
  {
    name: "Ericka Johannesburg",
    score: 101,
    iconUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShPis8NLdplTV1AJx40z-KS8zdgaSPaCfNINLtQ-ENdPvrtMWz"
  },
  {
    name: "Tim Thomas",
    score: 41,
    iconUrl: "http://ttsbilisim.com/wp-content/uploads/2014/09/20120807.png"
  },
  {
    name: "John Davis",
    score: 80,
    iconUrl:
      "https://cdn.dribbble.com/users/223408/screenshots/2134810/me-dribbble-size-001-001_1x.png"
  },
  {
    name: "Tina Turner",
    score: 22,
    iconUrl:
      "https://cdn.dribbble.com/users/223408/screenshots/2134810/me-dribbble-size-001-001_1x.png"
  },
  {
    name: "Harry Reynolds",
    score: null,
    iconUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsSlzi6GEickw2Ft62IdJTfXWsDFrOIbwXhzddXXt4FvsbNGhp"
  },
  {
    name: "Betty Davis",
    score: 25,
    iconUrl:
      "https://landofblogging.files.wordpress.com/2014/01/bitstripavatarprofilepic.jpeg?w=300&h=300"
  },
  {
    name: "Lauren Leonard",
    score: 30,
    iconUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr27ZFBaclzKcxg2FgJh6xi3Z5-9vP_U1DPcB149bYXxlPKqv-"
  }
];

export default Scoreboard