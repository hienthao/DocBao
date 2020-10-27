import React, {useEffect, useState, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  FlatList,
  View,
  Platform,
  ActivityIndicator,
  Linking,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';

import {Divider, Image, Text, Header} from 'react-native-elements';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const OpenURLButton = ({url, children}) => {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);
  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.titleName}>{children}</Text>
    </TouchableOpacity>
  );
};

const App = () => {
  const [articleAPIs, setarticleAPIs] = useState([]);
  const [page, setPage] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);

  const renderFooter = () => {
    if (!isLoading) return null;
    console.log('Footer');
    return <ActivityIndicator style={{color: '#000'}} />;
  };

  const renderItem = ({item, index}) => (
    <View style={styles.articleView}>
      <Image
        source={{
          uri: item.urlToImage
            ? item.urlToImage
            : 'https://jortour.com/wp-content/uploads/2018/08/ph_product.jpg',
        }}
        style={{width: 150, height: 150}}
        PlaceholderContent={<ActivityIndicator />}
      />
      <View style={styles.titleView}>
        <OpenURLButton
          url={item.url ? item.url : 'https;//google.com.vn'}
          children={item.title}></OpenURLButton>
        <Text style={styles.publishAt}>
          {formatDistanceToNow(new Date(item.publishedAt))}
        </Text>
      </View>
    </View>
  );

  const onRefresh = async () => {
    setIsRefreshing(true);
    setPage(1);
    try {
      const reponse = await fetch(
        `https://newsapi.org/v2/top-headlines?q=trump&apiKey=4e382803377547209998a2eb4f2dafb8`,
        //`https://newsapi.org/v2/top-headlines?q=trump&apiKey=5da191d4c0ed460894997711bdc380d6`,
      );
      const jsonData = await reponse.json();
      setarticleAPIs(jsonData.articles);
      setIsRefreshing(false);
      console.log('Refresh');
    } catch (error) {
      setIsRefreshing(false);
    }
  };

  const fetchData = async () => {
    setIsError(false);
    setIsLoading(true);
    try {
      const reponse = await fetch(
        `https://newsapi.org/v2/top-headlines?q=trump&apiKey=4e382803377547209998a2eb4f2dafb8&page=${page}`,
        //`https://newsapi.org/v2/top-headlines?q=trump&apiKey=5da191d4c0ed460894997711bdc380d6&page=${page}`,
      );
      const jsonData = await reponse.json();
      setarticleAPIs((prevArticles) => prevArticles.concat(jsonData.articles));
      console.log(`Fetch Data Page ${page}`);
    } catch (error) {
      setIsError(true);
    }
    setIsLoading(false);
  };

  const handleLoadMore = () => {
    if (!isLoading) {
      setPage((prevPage) => ++prevPage);
      //fetchData();
      console.log('Load More');
    }
  };

  useEffect(() => {
    console.log('useEffect');
    fetchData();
  }, [page]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Header
          placement="left"
          leftComponent={{icon: 'menu', color: '#fff'}}
          centerComponent={{text: 'US NEWS', style: {color: '#fff'}}}
          rightComponent={{icon: 'home', color: '#fff'}}
        />
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            ItemSeparatorComponent={
              Platform.OS !== 'android' &&
              (({highlighted}) => (
                <View
                  style={[styles.separator, highlighted && {marginLeft: 0}]}
                />
              ))
            }
            ListFooterComponent={renderFooter}
            data={articleAPIs}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            enableEmptySections={true}
            style={styles.flatListView}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.2}
          />
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  articleView: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  separator: {
    height: 1,
    borderWidth: 1,
    borderColor: '#2089DC',
  },

  titleView: {
    margin: 5,
    flex: 1,
    justifyContent: 'space-between',
  },
  titleName: {
    color: 'black',
    textAlign: 'left',
    fontSize: 20,
  },
  textDivider: {
    width: '100%',
  },
  publishAt: {
    color: 'grey',
    fontSize: 12,
  },
  flatListView: {
    //flex: 1,
    //height: 400,
    margin: 10,
    //backgroundColor: 'black',
  },
});

export default App;
