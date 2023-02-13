import { StyleSheet } from 'react-native';
import { gaps, colors, fontFamilies, dpi } from '../../../../../global-styles'

export default function (isSuccess) {
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center'
        },
        animationContainer: {
            height: dpi <= 320 ? 180 : 220,
            justifyContent: 'center',
            alignItems: "center",
            marginTop: gaps.g4,
            marginBottom: gaps.g4
        },
        formContainer: {
            flex: 1,
            width: '80%',
            marginBottom: gaps.g3,
        },
        headingContainer: {
            marginBottom: gaps.g7,
            marginTop: gaps.g6,
            justifyContent: 'center',
            alignItems: 'center',
            padding: gaps.g2,
            borderRadius: 4,
            backgroundColor: isSuccess ? colors.colorSuccess300 : colors.colorInfo100
        },
        baseInput: {
            marginBottom: gaps.g1,
        },
        btnSubmitContainer: {
            width: '100%',
            marginTop: gaps.g5
        },
        btnSubmit: {
            height: dpi <= 320 ? 45 : 50,
        },
    });
}