import { StyleSheet } from 'react-native';
import { gaps, colors, fontFamilies, dpi } from '../../../../../global-styles'
import { Dimensions } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        marginTop: gaps.g3,
        paddingBottom: gaps.g12,
    },
    scene: {
        flex: 1,
    },
    tabbar: {
        backgroundColor: colors.colorDefault400,
        borderBottomWidth: 1,
        borderBottomColor: colors.colorDefault300,
        elevation: 8,
        paddingTop: dpi <= 320 ? 0 : gaps.g1,
        paddingBottom: dpi <= 320 ? 0 : gaps.g1,
    },
    tab: {
        width: Dimensions.get('window').width / 3,
    },
    indicator: {
        backgroundColor: colors.colorDefault,
        height: 3
    },
    tabLabel: {
        textAlign: "center",
        lineHeight: 23,
        fontFamily: fontFamilies.primaryFD,
        fontSize: dpi <= 320 ? 14 : 17
    }
});