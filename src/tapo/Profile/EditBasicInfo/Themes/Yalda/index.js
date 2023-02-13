import React, { useState, useEffect, useContext, useMemo } from "react"
import { View, ScrollView } from "react-native"
import { Input } from "@ui-kitten/components"
import { withNavigation } from "react-navigation"
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from "react-native-simple-radio-button"
import Nav__R from "../../../../../Fragments/TopNavigations/Yalda/Nav__R"
import Loader from "../../../../Shared/loader"
import Button from "../../../../Shared/button"
import Icon from "../../../../Shared/icon"
import Snack from "../../../../Shared/snackbar"
import DatePicker from "../../../../Shared/date-picker"
import Autocomplete from "../../../../Shared/autocomplete"
import { helper, isValidNationalCode, isValidEmail, isValidMobile, isValidNumber } from "../../../../../utility"
import { updateDisplayName } from "../../../../../@Realm/Controllers/user.controller"

import { getProfileFields, updateProfile } from "../../api"
import { UserContext } from "../../../../../appContext"

import { colors, baseStyles, dpi, isRtl } from "../../../../../global-styles"
import { styles } from "./styles"
import reactotron from "reactotron-react-native"
import useLocalized from "../../../../../Hooks/useLocalizedStrings"

function EditBasicInfo_Yalda(props) {
    const navigation = props.navigation
    const userContext = useContext(UserContext)
    const [formFields, setFormFields] = useState([])
    const [loading, setLoading] = useState(true)

    const { strings } = useLocalized()

    const [state, setState] = useState({
        formData: {
            UserID: userContext.User.UserId,
        },
        fieldsStatus: {},
        validations: [],
    })

    const generateIcon = icon => <Icon size={dpi <= 320 ? 20 : 24} color={styles.inputIconStyle.color} name={icon} />

    useEffect(() => {
        getProfileFields(userContext.User).then(res => {
            console.log(userContext.User)
            if (res.status == 200) {
                setFormFields(res.data)
            }

            setLoading(false)
        })
    }, [])

    const generateState = useMemo(() => {
        let formData = { ...state.formData }
        let fieldsStatus = { ...state.fieldsStatus }
        let validations = []

        formFields.map((field, i) => {
            if (field.Required) validations.push({ Title: "required", Value: "", Field: field.Name })

            if (field.MaxLen > 0) validations.push({ Title: "maxLen", Value: field.MaxLen, Field: field.Name })

            if (field.DataCheckify != null && field.DataCheckify.length > 0) {
                let itemValidations = field.DataCheckify.split(",")

                itemValidations.forEach(e => {
                    let itemValidation = e.split("=")

                    if (itemValidation.length > 1)
                        validations.push({
                            Title: itemValidation[0],
                            Value: itemValidation[1],
                            Field: field.Name,
                        })
                    else validations.push({ Title: itemValidation[0], Value: "", Field: field.Name })
                })
            }

            if (field.Type != "location" && field.Type != "radio-button")
                formData = { ...formData, [field.Name]: field.DefaultValue }

            if (field.Type == "radio-button")
                formData = {
                    ...formData,
                    [field.Name]:
                        field.DefaultValue != null && field.DefaultValue.length > 0
                            ? helper.normalizeIfBoolean(field.DefaultValue)
                            : field.Options[0].ID,
                }

            if (field.Type == "select") {
                var currentOption = field.Options.filter(e => e.ID == field.DefaultValue)
                formData = {
                    ...formData,
                    [field.Name + "Title"]: currentOption.length > 0 ? currentOption[0].Title : "",
                }
            }

            fieldsStatus = { ...fieldsStatus, [field.Name]: "basic" }
        })

        setState({ formData, fieldsStatus, validations })
    }, [formFields])

    const generateForm = () => {
        let output = formFields.map((item, i) => {
            switch (item.Type) {
                case "text":
                    return (
                        <Input
                            value={state.formData[item.Name]}
                            style={styles.baseInput}
                            textStyle={[baseStyles.baseTextInput, baseStyles.mediumTextInput, baseStyles.textInputPosition]}
                            placeholder={
                                item.Required
                                    ? strings[helper.unCapitalize(item.Name)] + strings.required
                                    : strings[helper.unCapitalize(item.Name)]
                            }
                            icon={() => generateIcon(item.AppIcon)}
                            onChangeText={value =>
                                setState({
                                    ...state,
                                    formData: { ...state.formData, [item.Name]: value },
                                })
                            }
                            status={state.fieldsStatus[item.Name] != "basic" && "danger"}
                            caption={
                                state.fieldsStatus[item.Name] != "basic" &&
                                state.fieldsStatus[item.Name] != "danger" &&
                                strings.validation[state.fieldsStatus[item.Name]]
                            }
                        />
                    )
                case "textarea":
                    if (item.Name != "Address")
                        return (
                            <Input
                                value={state.formData[item.Name]}
                                style={styles.baseInput}
                                textStyle={[baseStyles.baseTextInput, baseStyles.mediumTextInput, baseStyles.textInputPosition]}
                                placeholder={
                                    item.Required
                                        ? strings[helper.unCapitalize(item.Name)] + strings.required
                                        : strings[helper.unCapitalize(item.Name)]
                                }
                                icon={() => generateIcon(item.AppIcon)}
                                multiline={true}
                                onChangeText={value =>
                                    setState({
                                        ...state,
                                        formData: { ...state.formData, [item.Name]: value },
                                    })
                                }
                                status={state.fieldsStatus[item.Name] != "basic" && "danger"}
                                caption={
                                    state.fieldsStatus[item.Name] != "basic" &&
                                    state.fieldsStatus[item.Name] != "danger" &&
                                    strings.validation[state.fieldsStatus[item.Name]]
                                }
                            />
                        )
                    else break

                case "date":
                    return (
                        <DatePicker
                            placeHolderText={item.Required ? strings[item.Name] + strings["Required"] : strings[item.Name]}
                            date={state.formData[item.Name]}
                            onChange={value =>
                                setState({
                                    ...state,
                                    formData: { ...state.formData, [item.Name]: value },
                                })
                            }
                            status={state.fieldsStatus[item.Name] == "basic" ? "basic" : "danger"}
                        />
                    )

                case "radio-button":
                    return (
                        <View style={styles.genderContainer}>
                            <RadioForm animation={true} formHorizontal={true}>
                                {helper.format4RadioButton(item.Options, "ID", "Title").map((optionItem, i) => {
                                    optionItem.label = strings[helper.unCapitalize(optionItem.label)]

                                    return (
                                        <RadioButton labelHorizontal={true} key={i}>
                                            <RadioButtonInput
                                                obj={optionItem}
                                                index={optionItem.value}
                                                isSelected={state.formData[item.Name] == optionItem.value}
                                                onPress={value =>
                                                    setState({
                                                        ...state,
                                                        formData: {
                                                            ...state.formData,
                                                            [item.Name]: value,
                                                        },
                                                    })
                                                }
                                                borderWidth={2}
                                                buttonInnerColor={colors.colorDefault400}
                                                buttonOuterColor={colors.colorDefault400}
                                                buttonSize={dpi <= 320 ? 10 : 12}
                                                buttonOuterSize={dpi <= 320 ? 20 : 22}
                                            />
                                            <RadioButtonLabel
                                                obj={optionItem}
                                                index={optionItem.value}
                                                labelHorizontal={true}
                                                onPress={value =>
                                                    setState({
                                                        ...state,
                                                        formData: {
                                                            ...state.formData,
                                                            [item.Name]: value,
                                                        },
                                                    })
                                                }
                                                labelStyle={styles.genderLabel}
                                            />
                                        </RadioButton>
                                    )
                                })}
                            </RadioForm>
                        </View>
                    )

                case "select":
                    return (
                        <Autocomplete
                            placeHolderText={
                                item.Required
                                    ? strings[helper.unCapitalize(item.Name)] + strings["Required"]
                                    : strings[helper.unCapitalize(item.Name)]
                            }
                            isSearchEnable={true}
                            dataTitle="Title"
                            iconName={item.AppIcon}
                            iconColor={styles.inputIconStyle.color}
                            isValid={state.fieldsStatus[item.Name] == "basic"}
                            items={item.Options}
                            selectedItem={state.formData[item.Name + "Title"]}
                            onItemSelect={selectedItem =>
                                setState({
                                    ...state,
                                    formData: {
                                        ...state.formData,
                                        [item.Name]: selectedItem.ID,
                                        [item.Name + "Title"]: selectedItem.Title,
                                    },
                                })
                            }
                        />
                    )

                default:
                    return
            }
        })

        return output
    }

    const submit = () => {
        let isValid = true
        let tempFieldStatus = { ...state.fieldsStatus }
        tempFieldStatus = helper.initializeObject(tempFieldStatus, "basic")

        formFields.map((field, i) => {
            let tempValidations = state.validations.filter(item => item.Field == field.Name)

            tempValidations.forEach(curValidation => {
                switch (curValidation.Title) {
                    case "required":
                        if (state.formData[field.Name] == "") {
                            tempFieldStatus[field.Name] = "danger"
                            isValid = false
                        }
                        break

                    case "minlen":
                        if (
                            state.formData[field.Name] != null &&
                            state.formData[field.Name].length > 0 &&
                            state.formData[field.Name].length < curValidation.Value
                        ) {
                            tempFieldStatus[field.Name] = `minLen,${curValidation.Value}`
                            isValid = false
                        }
                        break

                    case "maxLen":
                        if (
                            state.formData[field.Name] != null &&
                            state.formData[field.Name].length > 0 &&
                            state.formData[field.Name].length > curValidation.Value
                        ) {
                            tempFieldStatus[field.Name] = `maxLen,${curValidation.Value}`
                            isValid = false
                        }
                        break

                    case "email":
                        if (
                            state.formData[field.Name] != null &&
                            state.formData[field.Name].length > 0 &&
                            !isValidEmail(state.formData[field.Name])
                        ) {
                            tempFieldStatus[field.Name] = `email`
                            isValid = false
                        }
                        break

                    case "number":
                        if (
                            state.formData[field.Name] != null &&
                            state.formData[field.Name].length > 0 &&
                            !isValidNumber(state.formData[field.Name])
                        ) {
                            tempFieldStatus[field.Name] = `number`
                            isValid = false
                        }
                        break

                    case "mobile":
                        if (
                            state.formData[field.Name] != null &&
                            state.formData[field.Name].length > 0 &&
                            !isValidMobile(state.formData[field.Name])
                        ) {
                            tempFieldStatus[field.Name] = `mobile`
                            isValid = false
                        }
                        break

                    case "nationalCode":
                        if (
                            state.formData[field.Name] != null &&
                            state.formData[field.Name].length > 0 &&
                            !isValidNationalCode(state.formData[field.Name])
                        ) {
                            tempFieldStatus[field.Name] = `nationalCode`
                            isValid = false
                        }
                        break

                    default:
                        break
                }
            })
        })

        if (isValid) {
            setLoading(true)
            updateProfile(userContext.User, state.formData).then(res => {
                if (res.status == 200) {
                    userContext.SetDisplayname(res.data)
                    updateDisplayName(res.data)

                    setTimeout(() => {
                        navigation.goBack()
                        Snack.success(strings.notif.accountInfoSubmit)
                    }, 100)
                }

                setLoading(false)
            })
        } else setState({ ...state, fieldsStatus: tempFieldStatus })
    }

    return (
        <Nav__R title={strings.personalInfo} backIcon={isRtl ? "forward" : "back"} containerStyle={{ borderBottomWidth: 0 }}>
            {loading ? (
                <Loader />
            ) : (
                <View style={styles.container}>
                    <ScrollView style={styles.formContainer}>
                        {
                            <>
                                {generateState}
                                {generateForm()}
                            </>
                        }
                        <Button
                            title={strings.submit}
                            wrapperStyle={styles.btnSubmitContainer}
                            containerStyle={styles.btnSubmit}
                            onPress={submit}
                            pressInBG={colors.colorSuccess400}
                            pressOutBG={colors.colorSuccess600}
                        />
                    </ScrollView>
                </View>
            )}
        </Nav__R>
    )
}

export default withNavigation(EditBasicInfo_Yalda)
