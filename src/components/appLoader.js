import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Constants from '../constants/index';

import AmlakModal from './modal';
import Loader from './loader';
import { connect } from 'react-redux';


class AppLoader extends Component {
  render() {
    return (
      <AmlakModal isVisible={this.props.isLoading}>
        <View style={styles.container} >
          <Loader style={styles.loaderStyle} />
        </View>
      </AmlakModal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: Constants.Colors.black,
    opacity: 0.5,
  },
  loaderStyle: {
    zIndex: 1
  }
})

const mapStateToProps = (state) => ({
  isLoading: state.common.isLoading
});

export default connect(mapStateToProps, null)(AppLoader)