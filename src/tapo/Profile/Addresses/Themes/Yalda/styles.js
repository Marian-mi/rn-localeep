import { StyleSheet } from 'react-native';
import { gaps, colors } from '../../../../../global-styles'

export const styles = StyleSheet.create({
    btnContainer:{
        alignItems:"center",
        marginTop:gaps.g3,
        marginBottom:gaps.g3,
    },
    btn:{
        backgroundColor:colors.colorSuccess500
    }
});