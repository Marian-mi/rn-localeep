import { StyleSheet } from 'react-native';
import { colors, gaps, fontFamilies, dpi } from '../../../../../global-styles';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.colorDefault200,
        paddingStart: gaps.g4,
        paddingEnd: gaps.g4,
        paddingTop: gaps.g1,
        paddingBottom: gaps.g1,
    },
    itemsContainer: {
        flex: 9,
        backgroundColor: colors.colorDefault100
    },
    baseText: {
        fontFamily: fontFamilies.primary,
        textAlign: 'justify',
    },
    displayNameText: {
        fontSize: dpi <= 320 ? 15 : 18,
        marginBottom: gaps.g1
    },
    usernameText: {
        fontSize: dpi <= 320 ? 13 : 15,
        color: colors.colorDefault400
    },
});
