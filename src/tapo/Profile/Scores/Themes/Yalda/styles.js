import { StyleSheet } from 'react-native';
import { gaps, colors } from '../../../../../global-styles'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    alertContainer: {
        padding: gaps.g2,
        marginBottom: gaps.g2,
        backgroundColor: colors.colorDefault500
    },
    alertScoreContainer: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: colors.colorDefault,
        marginTop: gaps.g2,
        paddingTop: gaps.g1
    },
    infoTextColor: {
        color: colors.colorDefault
    },
    scoreText: {
        marginEnd: gaps.g8
    }
});