import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function FindWalker() {
  return (
    <View>
      <Text style={styles.text}>Find Walker</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    
    text: {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 20,
    }
})