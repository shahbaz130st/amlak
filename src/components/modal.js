import React from 'react';
import { StatusBar, Platform, Dimensions } from 'react-native';
import Modal from "react-native-modal";

import * as Constant from '../constants/index';

export default (props) => {
    const deviceWidth = Dimensions.get("window").width;
    const deviceHeight = Platform.OS === "ios"
        ? Dimensions.get("window").height
        : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

    return (
        <Modal
            {...props}
            style={{ margin: 0 }}
            animationIn='fadeIn'
            animationOut='fadeOut'
            animationInTiming={200}
            backdropOpacity = {0.70}
            backdropColor = 'black'
            deviceHeight={props.height ? props.height : deviceHeight}
            deviceWidth={deviceWidth}
            isVisible={props.isVisible}>
            {/* <StatusBar backgroundColor={Constant.Colors.modalStatusBar} /> */}
            {props.children}
        </Modal>
    )
}
