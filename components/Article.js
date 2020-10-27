import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Foundation from 'react-native-vector-icons/Foundation';
import {formatDistanceToNow} from 'date-fns/formatDistanceToNow';
import {articles} from './components/data.js';

export function Article({item = articles[0]}) {
  return <Text>{formatDistanceToNow(new Date(item.publishedAt))}</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
