import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile</Text>
    </View>
  )
}

const styles = StyleSheet.create({
   container:{
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
   } 
  ,
    text: {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 20,
    }
})