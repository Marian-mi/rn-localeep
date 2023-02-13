import { StyleSheet } from 'react-native';
import { gaps, colors } from '../../../../../global-styles'

export const styles = StyleSheet.create({
    container: {
        margin: gaps.g5
    },
    btn: {
        backgroundColor: colors.colorSuccess500
    },
    baseInput: {
        marginBottom: gaps.g1,
    },
    saveBtn: {
        marginTop: gaps.g10,
        backgroundColor: colors.colorSuccess500
    }
});