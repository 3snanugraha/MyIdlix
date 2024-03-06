import React, { useRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';

const BlockedWebView = () => {
  const webViewRef = useRef(null);

  const blockPopupsAndElements = `
    window.open = function() {};

    // Daftar kelas yang akan dihapus
    var classesToRemove = ['module_single_ads', 'module_home_ads'];

    // Hapus setiap kelas dari elemen
    classesToRemove.forEach(function(className) {
      var elements = document.getElementsByClassName(className);
      for (var i = 0; i < elements.length; i++) {
        elements[i].remove();
      }
    });

    // Blokir popups
    setTimeout(function() {
      var open = window.open;
      window.open = function(url, name, features) {
        return null;
      };
    }, 1000);
  `;

  const handleBlockPopupsAndElements = useCallback(() => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(blockPopupsAndElements);
    }
  }, [webViewRef, blockPopupsAndElements]);

  const handleNavigationStateChange = useCallback((navState) => {
    if (navState.url !== 'about:blank') {
      handleBlockPopupsAndElements();
    }
  }, [handleBlockPopupsAndElements]);

  const handleReload = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const handleGoHome = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
    }
  };

  const handleCloseApp = () => {
    BackHandler.exitApp();
  };

  const handleShouldStartLoadWithRequest = (event) => {
    const { url, navigationType } = event;
  
    // Check if the request is for opening a new window
    if (navigationType === 'click' && !url.startsWith('https://tv.idlixofficial.co/')) {
      // Block the new window request
      return false;
    }
  
    // Allow all other requests
    return true;
  };
  

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="red" barStyle="light-content" />
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://tv.idlixofficial.co/' }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoad={handleBlockPopupsAndElements}
        onNavigationStateChange={handleNavigationStateChange}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest} // Add this line
        useWebKit={true}
        allowsFullscreenVideo={true}
      />
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity style={[styles.button, { opacity: 0.8 }]} onPress={handleGoHome}>
          <Icon name="home" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { opacity: 0.8 }]} onPress={handleReload}>
          <Icon name="refresh" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { opacity: 0.8 }]} onPress={handleCloseApp}>
          <Icon name="times" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 30,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

export default BlockedWebView;
