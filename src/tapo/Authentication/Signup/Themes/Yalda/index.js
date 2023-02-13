import React, { useState, useEffect, useContext, useMemo } from "react"
import { View, Text, ScrollView } from "react-native"
import { Input } from "@ui-kitten/components"
import { withNavigation } from "react-navigation"
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from "react-native-simple-radio-button"
import Nav__R_Cart from "../../../../../Fragments/TopNavigations/Yalda/Nav__R_Cart"
import Loader from "../../../../Shared/loader"
import Button from "../../../../Shared/button"
import Icon from "../../../../Shared/icon"
import Autocomplete from "../../../../Shared/autocomplete"
import Reactotron from "reactotron-react-native"
import DatePicker from "../../../../Shared/date-picker"
import { helper, isValidEmail, isValidNumber, isValidMobile, isValidNationalCode, isValidPassword } from "../../../../../utility"
import useDidMountEffect from "../../../../../Hooks/useEffectAfterUpdate"

import { getStates, getCities, register } from "../../api"
import { StatesContext, CitiesContext, ShopConfigContext } from "../../../../../appContext"

import { colors, baseStyles, dpi, isRtl } from "../../../../../global-styles"
import { styles } from "./styles"
import useLocalized from "../../../../../Hooks/useLocalizedStrings"

function Signup_Yalda(props) {
    const navigation = props.navigation
    const statesContext = useContext(StatesContext)
    const citiesContext = useContext(CitiesContext)
    const configContext = useContext(ShopConfigContext)
    const formFields = configContext.ShopConfigs.AdminConfig.FORM_FIELDS
    const quickRegistration = configContext.ShopConfigs.SuperUserConfig.QUICK_REGISTRATION
    const registerLocalConfig = configContext.ShopConfigs.LocalConfig.CustomRegister
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [loading, setLoading] = useState(true)
    const [citiesVisible, setCitiesVisible] = useState(false)

    const [state, setState] = useState({
        formData: {
            StateID: "",
            StateName: "",
            LocationID: "",
            LocationName: "",
            Username: "",
            Password: "",
            ConfirmPassword: "",
        },
        fieldsStatus: {
            StateID: "basic",
            LocationID: "basic",
            Username: "basic",
            Password: "basic",
            ConfirmPassword: "basic",
        },
        validations: [],
    })

    const { strings } = useLocalized()

    const generateIcon = icon => <Icon size={dpi <= 320 ? 20 : 24} color={styles.inputIconStyle.color} name={icon} />

    const reloadCities = stateId => {
        getCities(stateId).then(res => {
            if (res.status == 200) {
                citiesContext.SetCities(res.data)
                setCities(res.data)

                setCitiesVisible(true)
            }
        })
    }

    const submit = () => {
        let isValid = true
        let tempFieldStatus = { ...state.fieldsStatus }
        tempFieldStatus = helper.initializeObject(tempFieldStatus, "basic")

        if (!quickRegistration) {
            formFields
                .filter(field => field.VisibleRegister)
                .map((field, i) => {
                    let tempValidations = state.validations.filter(item => item.Field == field.Name)

                    tempValidations.forEach(curValidation => {
                        switch (curValidation.Title) {
                            case "required":
                                if (
                                    field.Type == "location" &&
                                    (state.formData["StateID"] == "" || state.formData["LocationID"] == "")
                                ) {
                                    tempFieldStatus[field.Name] = "danger"
                                    isValid = false
                                } else if (state.formData[field.Name] == "") {
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
        }

        //#region username validation
        if (registerLocalConfig.UsernameType == "Email") {
            if (!isValidEmail(state.formData["Username"])) {
                tempFieldStatus["Username"] = "username"
                isValid = false
            }

            if (state.formData["Username"].length > 100) {
                tempFieldStatus["Username"] = "username"
                isValid = false
            }
        } else {
            if (!isValidMobile(state.formData["Username"])) {
                tempFieldStatus["Username"] = "username"
                isValid = false
            }

            if (state.formData["Username"].length > 11) {
                tempFieldStatus["Username"] = "username"
                isValid = false
            }
        }

        if (state.formData["Username"] === "") {
            tempFieldStatus["Username"] = "danger"
            isValid = false
        }
        //#endregion username validation

        //#region password validation
        if (!registerLocalConfig.RandomPassword) {
            if (!isValidPassword(state.formData["Password"])) {
                tempFieldStatus["Password"] = "password"
                isValid = false
            }

            if (state.formData["ConfirmPassword"] != state.formData["Password"]) {
                tempFieldStatus["ConfirmPassword"] = "confirm-password"
                isValid = false
            }
        }
        //#endregion password validation

        if (isValid) {
            setLoading(true)
            register(state.formData, navigation).then(res => {
                setLoading(false)
            })
        } else setState({ ...state, fieldsStatus: tempFieldStatus })
    }

    const generateState = useMemo(() => {
        let formData = { ...state.formData }
        let fieldsStatus = { ...state.fieldsStatus }
        let validations = []

        Reactotron.log(formFields)

        formFields
            .filter(field => field.VisibleRegister)
            .map((field, i) => {
                if (field.Required) validations.push({ Title: "required", Value: "", Field: field.Name })

                if (field.MaxLen > 0) validations.push({ Title: "maxLen", Value: field.MaxLen, Field: field.Name })

                if (field.DataCheckify != null && field.DataCheckify.length > 0) {
                    let itemValidations = field.DataCheckify.split(",")

                    itemValidations.forEach(e => {
                        let itemValidation = e.split("=")

                        if (itemValidation.length > 1)
                            validations.push({ Title: itemValidation[0], Value: itemValidation[1], Field: field.Name })
                        else validations.push({ Title: itemValidation[0], Value: "", Field: field.Name })
                    })
                }

                if (field.Type != "location" && field.Type != "radio-button") formData = { ...formData, [field.Name]: "" }

                if (field.Type == "radio-button") formData = { ...formData, [field.Name]: field.Options[0].ID }

                if (field.Type == "select") formData = { ...formData, [field.Name + "Title"]: "" }

                fieldsStatus = { ...fieldsStatus, [field.Name]: "basic" }
            })

        setState({ formData, fieldsStatus, validations })
    }, [formFields])

    const generateForm = () => {
        let output = formFields
            .filter(item => item.VisibleRegister)
            .map((item, i) => {
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
                                    textStyle={[
                                        baseStyles.baseTextInput,
                                        baseStyles.mediumTextInput,
                                        baseStyles.textInputPosition,
                                    ]}
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

    useEffect(() => {
        if (!quickRegistration) {
            getStates().then(res => {
                if (res.status == 200) {
                    statesContext.SetStates(res.data)
                    setStates(res.data)

                    setLoading(false)
                }
            })
        } else setLoading(false)
    }, [])

    useDidMountEffect(() => {
        reloadCities(state.formData["StateID"])
    }, [state.formData["StateID"]])

    return (
        <Nav__R_Cart title={strings.signupAct} backIcon={isRtl ? "forward" : "back"} containerStyle={{ borderBottomWidth: 0 }}>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <ScrollView>
                        <View style={styles.container}>
                            <View style={styles.formContainer}>
                                <View style={styles.headingContainer}>
                                    <Text style={[baseStyles.baseText, { color: colors.colorDefault400 }]}>
                                        {strings.fillInUserInformation}
                                    </Text>
                                </View>
                                {!quickRegistration && (
                                    <>
                                        {generateState}
                                        {generateForm()}
                                    </>
                                )}

                                <Input
                                    value={state.formData["Username"]}
                                    style={styles.baseInput}
                                    textStyle={[
                                        baseStyles.baseTextInput,
                                        baseStyles.mediumTextInput,
                                        baseStyles.textInputPosition,
                                    ]}
                                    placeholder={
                                        registerLocalConfig.UsernameType == "Email"
                                            ? strings.username +
                                              "(" +
                                              strings.email +
                                              strings.required +
                                              ")"
                                            : strings.username +
                                              "(" +
                                              strings.mobile +
                                              strings.required +
                                              ")"
                                    }
                                    icon={() =>
                                        registerLocalConfig.UsernameType == "Email"
                                            ? generateIcon("email")
                                            : generateIcon("mobile")
                                    }
                                    keyboardType={registerLocalConfig.UsernameType == "Email" ? "email-address" : "number-pad"}
                                    onChangeText={value =>
                                        setState({ ...state, formData: { ...state.formData, Username: value } })
                                    }
                                    status={state.fieldsStatus["Username"] != "basic" && "danger"}
                                    caption={
                                        state.fieldsStatus["Username"] != "basic" &&
                                        state.fieldsStatus["Username"] != "danger" &&
                                        strings.validation.username
                                    }
                                />

                                {!registerLocalConfig.RandomPassword && (
                                    <>
                                        <Input
                                            value={state.formData["Password"]}
                                            style={styles.baseInput}
                                            textStyle={[
                                                baseStyles.baseTextInput,
                                                baseStyles.mediumTextInput,
                                                baseStyles.textInputPosition,
                                            ]}
                                            placeholder={`${strings.password} ${strings.required}`}
                                            icon={() => generateIcon("key")}
                                            onChangeText={value =>
                                                setState({ ...state, formData: { ...state.formData, Password: value } })
                                            }
                                            status={state.fieldsStatus["Password"] != "basic" && "danger"}
                                            caption={
                                                state.fieldsStatus["Password"] != "basic" &&
                                                state.fieldsStatus["Password"] != "danger" &&
                                                strings.validation.password
                                            }
                                        />

                                        <Input
                                            value={state.formData["ConfirmPassword"]}
                                            style={styles.baseInput}
                                            textStyle={[
                                                baseStyles.baseTextInput,
                                                baseStyles.mediumTextInput,
                                                baseStyles.textInputPosition,
                                            ]}
                                            placeholder={`${strings.confirmPassword} ${strings.required}`}
                                            icon={() => generateIcon("key")}
                                            onChangeText={value =>
                                                setState({ ...state, formData: { ...state.formData, ConfirmPassword: value } })
                                            }
                                            status={state.fieldsStatus["ConfirmPassword"] != "basic" && "danger"}
                                            caption={
                                                state.fieldsStatus["ConfirmPassword"] != "basic" &&
                                                state.fieldsStatus["ConfirmPassword"] != "danger" &&
                                                strings.validation.confirmPassword
                                            }
                                        />
                                    </>
                                )}
                            </View>
                        </View>
                    </ScrollView>
                    <Button
                        title={strings.submit}
                        wrapperStyle={styles.btnSubmitContainer}
                        containerStyle={styles.btnSubmit}
                        onPress={submit}
                        pressInBG={colors.colorInfo400}
                        pressOutBG={colors.colorInfo500}
                    />
                </>
            )}
        </Nav__R_Cart>
    )
}

export default withNavigation(Signup_Yalda)
