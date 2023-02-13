import { StyleSheet } from 'react-native';
import { gaps, colors, fontFamilies, dpi } from '../../../../../global-styles'

export const styles = StyleSheet.create({
    masterView: {
        justifyContent: 'flex-start',
        paddingTop:dpi <= 320 ? gaps.g5 : gaps.g10,
    },
    animationContainer: {
        height: dpi <= 320 ? 160 : 260,
        justifyContent: 'center',
        alignItems: "center",
        marginTop: 0,
        marginBottom: gaps.g6
    },
    formContainer: {
        width: "80%",
        alignSelf: "center"
    },
    loginButton: {
        flexDirection: 'row-reverse',
        borderRadius: 0,
        width: '100%',
    },
    baseInput: {
        marginBottom: gaps.g1,
        textAlign: "justify"
    },
    btnSubmitContainer: {
        width: '100%',
    },
    btnSubmit: {
        height: dpi <= 320 ? 45 : 50,
        backgroundColor: colors.colorInfo500,
        borderRadius: 0
    },
    btnSubmitText: {
        fontSize: dpi <= 320 ? 17 : 20,
        marginEnd: gaps.g4
    },
    btnSimpleContainer: {
        marginTop: dpi <= 320 ? gaps.g4 : gaps.g10,
        marginBottom: dpi <= 320 ? gaps.g1 : gaps.g5,
    },
    btnSimple: {
        height: 50,
        backgroundColor: colors.colorDefault,
        borderRadius: 0
    },
    btnSimpleText: {
        fontSize: dpi <= 320 ? 13 : 15,
        color: colors.colorDefault400
    },
    checkboxContainer: {
        flexDirection: "row",
    },
    checkbox: {
        alignSelf: "center",
    },
    exitModalContainer: {
        width: "100%",
        height: dpi <= 320 ? 130 : 150,
        backgroundColor: colors.colorDefault,
        borderRadius: 10,
        paddingStart: gaps.g8,
        paddingEnd:gaps.g8,
        paddingTop: gaps.g4,
        paddingBottom: gaps.g6
    },
    exitModalText: {
        flex: 3
    },
    exitModalBtnContainer: {
        flex: 1,
        justifyContent:"space-between",
        flexDirection: "row",
    },
    cancelBtnPressInBG: {
        backgroundColor: colors.colorInfo400,
    },
    cancelBtnPressOutBG: {
        backgroundColor: colors.colorInfo500,
    },
    exitBtnPressInBG: {
        backgroundColor: colors.colorDanger400,
    },
    exitBtnPressOutBG: {
        backgroundColor: colors.colorDanger500
    }
});