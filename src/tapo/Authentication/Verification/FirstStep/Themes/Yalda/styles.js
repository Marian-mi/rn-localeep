import { StyleSheet } from 'react-native';
import { gaps, colors, fontFamilies, dpi } from '../../../../../../global-styles'

export const styles = StyleSheet.create({
    masterView: {
        justifyContent: 'flex-start',
        paddingTop: gaps.g10,
    },
    animationContainer: {
        height: dpi <= 320 ? 220 : 260,
        justifyContent: 'center',
        alignItems: "center",
        marginTop: 0,
        // marginBottom: gaps.g6,
        // backgroundColor:"red"
    },
    headingContainer: {
        marginBottom: gaps.g7,
        marginTop: gaps.g6,
        justifyContent: 'center',
        alignItems: 'center',
        padding: gaps.g2,
        borderRadius: 4,
        backgroundColor: colors.colorInfo100
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
        marginBottom: gaps.g7,
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
    }
});