import { StyleSheet } from 'react-native';
import { gaps, colors, fontFamilies, dpi } from '../../../../../global-styles'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    formContainer: {
        flex: 1,
        width: '85%',
        marginTop: gaps.g6,
        marginBottom: gaps.g3
    },
    baseInput: {
        marginBottom: gaps.g1,
    },
    btnSubmitContainer: {
        width: '100%',
        marginTop: gaps.g6
    },
    btnSubmit: {
        height: 45,
        backgroundColor: colors.colorSuccess500,
        borderRadius: 0
    },
    genderContainer: {
        marginBottom: gaps.g1
    },
    genderLabel: {
        fontFamily: fontFamilies.primary,
        fontSize: dpi <= 320 ? 13 : 15,
        marginEnd: gaps.g2,
        marginStart: gaps.g2,
    },
    inputIconStyle: {
        color: colors.colorIcons
    }
});