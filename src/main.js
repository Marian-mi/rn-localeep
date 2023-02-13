const parser = require("@babel/parser");
const generator = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;
const fs = require("fs");
const {
    format,
    createNode,
    recursiveReadDir,
    createKeyContainer,
    createKeyContainerForLogicalExp,
    persianAlphabetCodes,
    reviseText,
} = require("./util");

function translateDirector(path, i18Object) {
    const files = recursiveReadDir(path, /.js$/);

    files.forEach((file) => {
        const ast = createTree(file);

        const hasReplacedAny = replaceTexts(ast, i18Object);

        if (hasReplacedAny == false) return;

        inject(ast);

        astToCode(ast);
    });
}

function createTree(path) {
    return parser.parse(fs.readFileSync(path, { encoding: "utf-8" }), {
        plugins: ["jsx"],
        sourceType: "module",
    });
}

function replaceTexts(ast, i18Object) {
    let any = false;

    traverse(ast, {
        // JSXElement: (item) => {
        //     if (item.node.openingElement.name.name !== "Text") return;

        //     let ModifiedNodeArr = [];
        //     let repalcedNodesCount = 0;
        //     item.node.children.forEach((child, ind) => {
        //         if (child.type === "JSXText") {
        //             const { result, extra } = reviseText(child.value);
        //             if (i18Object.hasOwnProperty(result)) {
        //                 ModifiedNodeArr = ModifiedNodeArr.concat(
        //                     createKeyContainer(child.loc.start.line, i18Object[result], extra)
        //                 );
        //                 repalcedNodesCount++;
        //             } else ModifiedNodeArr.push(child);
        //         }

        //         if (child.type === "JSXExpressionContainer") {
        //             if (child.expression.type === "StringLiteral") {
        //                 const { result, extra } = reviseText(child.expression.value);
        //                 if (i18Object.hasOwnProperty(result)) {
        //                     ModifiedNodeArr = ModifiedNodeArr.concat(
        //                         createKeyContainer(child.loc.start.line, i18Object[result], extra)
        //                     );
        //                     repalcedNodesCount++;
        //                 } else ModifiedNodeArr.push(child);
        //             }
        //             if (child.expression.type === "LogicalExpression" && child.expression.operator.match(/^\?\?$|^\&\&$/)) {
        //                 if (i18Object.hasOwnProperty(child.expression.right.value)) {
        //                     ModifiedNodeArr = ModifiedNodeArr.concat(
        //                         createKeyContainerForLogicalExp(i18Object, child.expression)
        //                     );
        //                     repalcedNodesCount++;
        //                 } else ModifiedNodeArr.push(child);
        //             }
        //         }
        //     });

        //     if (repalcedNodesCount > 0) any = true;

        //     item.node.children = ModifiedNodeArr;
        // },
        // JSXAttribute: (item) => {
        //     if (item.node.value.type === "StringLiteral") {
        //         const { result, extra } = reviseText(item.node.value.value);
        //         if (i18Object.hasOwnProperty(result)) {
        //             item.node.value = createKeyContainer(item.node.loc.start.line, i18Object[result], extra)[0];
        //             any = true;
        //         }
        //     }
        //     if (item.node.value.type === "JSXExpressionContainer") {
        //         const { result, extra } = reviseText(item.node.value.expression.value);
        //         if (i18Object.hasOwnProperty(result)) {
        //             item.node.value = createKeyContainer(item.node.loc.start.line, i18Object[result], extra)[0];
        //             any = true;
        //         }
        //     }
        // },
        StringLiteral: (item) => {
            let parent = item.parent;

            const { result, extra } = reviseText(item.node.value);

            if (i18Object.hasOwnProperty(result)) {
                const nodesToInsert = createKeyContainer(item.node.loc.start.line, i18Object[result], extra);

                switch (parent.type) {
                    case "JSXAttribute":
                    case "ObjectProperty":
                        parent.value = nodesToInsert[0];
                        break;

                    case "BinaryExpression":
                        parent.right = nodesToInsert[0];

                    case "JSXExpressionContainer":
                        parent.expression = nodesToInsert[0].expression;

                    case "ConditionalExpression": {
                        if (parent.consequent === item.node) parent.consequent = nodesToInsert[0].expression;
                        if (parent.alternate === item.node) parent.alternate = nodesToInsert[0].expression;
                    }

                    default:
                        break;
                }

                any = true;
            }
        },
        JSXElement: (item) => {
            if (item.node.openingElement.name.name !== "Text") return;

            let ModifiedNodeArr = [];
            let repalcedNodesCount = 0;

            
            item.node.children.forEach((child, ind) => {
                const noooode = item.node
                if (child.type === "JSXText") {
                    const { result, extra } = reviseText(child.value);
                    if (i18Object.hasOwnProperty(result)) {
                        ModifiedNodeArr = ModifiedNodeArr.concat(
                            createKeyContainer(child.loc.start.line, i18Object[result], extra)
                        );
                        repalcedNodesCount++;
                    } else ModifiedNodeArr.push(child);
                }

                if (child.type === "JSXExpressionContainer") {
                    if (child.expression.type === "StringLiteral") {
                        const { result, extra } = reviseText(child.expression.value);
                        if (i18Object.hasOwnProperty(result)) {
                            ModifiedNodeArr = ModifiedNodeArr.concat(
                                createKeyContainer(child.loc.start.line, i18Object[result], extra)
                            );
                            repalcedNodesCount++;
                        } else ModifiedNodeArr.push(child);
                    }
                    else if (child.expression.type === "LogicalExpression" && child.expression.operator.match(/^\?\?$|^\&\&$/)) {
                        if (i18Object.hasOwnProperty(child.expression.right.value)) {
                            ModifiedNodeArr = ModifiedNodeArr.concat(
                                createKeyContainerForLogicalExp(i18Object, child.expression)
                            );
                            repalcedNodesCount++;
                        } else ModifiedNodeArr.push(child);
                    }
                    else ModifiedNodeArr.push(child);
                }
            });

            if (repalcedNodesCount > 0) any = true;

            item.node.children = ModifiedNodeArr;
        },
    });

    return any;
}

function inject(ast) {
    traverse(ast, {
        Program: (item) => {
            let i = 0;

            while (item.node.body[i].type === "ImportDeclaration") {
                lastImportDec = item.node.body[i];
                i++;
            }

            const importHookNode = createNode("import { useLocalized } from 'react'", 0);

            item.node.body.splice(i, 0, importHookNode);

            let mainFunctionNode, mainFunctionBlock, exportDefaultDeclarationName;

            let exportDefaultDeclaration = item.node.body.find((x) => x.type === "ExportDefaultDeclaration");

            if (exportDefaultDeclaration.declaration?.type === "FunctionDeclaration") {
                mainFunctionBlock = exportDefaultDeclaration.declaration.body;
            } else {
                if (exportDefaultDeclaration.declaration.arguments) {
                    exportDefaultDeclarationName = item.node.body.find((x) => x.type === "ExportDefaultDeclaration").declaration
                        .arguments[0].name;
                } else exportDefaultDeclarationName = exportDefaultDeclarationName.declaration.name;

                mainFunctionNode = item.node.body.find((x) => {
                    if (x.type !== "VariableDeclaration") return false;

                    const declaration = x.declarations[0];

                    if (declaration === null) return false;

                    if (declaration.id.name === exportDefaultDeclarationName) return true;

                    return false;
                });

                if (mainFunctionNode === undefined) {
                    mainFunctionNode = item.node.body.find((x) => {
                        if (x.type === "FunctionDeclaration") {
                            if (x.id.name === exportDefaultDeclarationName) return true;
                        }

                        return false;
                    });

                    mainFunctionBlock = mainFunctionNode.body;
                } else mainFunctionBlock = mainFunctionNode.declarations[0].init.body;
            }

            const useHookNode = createNode("const { strings } = useLocalized()", mainFunctionBlock.loc.start.line + 1);

            mainFunctionBlock.body.splice(0, 0, useHookNode);
        },
    });
}

function astToCode(ast, path) {
    const { code } = generator(ast, {
        retainLines: true,
        retainFunctionParens: true,
    });

    fs.writeFileSync("./src/out.js", format(code), { encoding: "utf-8" });
}

const resources = {
    address: "آدرس",
    affiliateCode: "کد معرف",
    city: "شهر",
    confirmPassword: "تکرار رمز عبور",
    dateOfMarriage: "تاریخ ازدواج",
    doB: "تاریخ تولد",
    email: "ایمیل",
    female: "زن",
    firstName: "نام",
    gender: "جنسیت",
    instagram: "اینستاگرام",
    introductionMethod: "نحوه آشنایی",
    job: "شغل",
    lastName: "نام خانوادگی",
    male: "مرد",
    maritalStatus: "وضعیت تاهل",
    married: "متاهل",
    nationalCode: "کد ملی",
    password: "رمز عبور",
    phone: "شماره تلفن ثابت",
    postalCode: "کد پستی",
    required: "(الزامی)",
    single: "مجرد",
    state: "استان",
    selectState: "انتخاب استان",
    selectCity: "انتخاب شهر",
    telegram: "تلگرام",
    username: "نام کاربری",
    whatsApp: "واتس اپ",
    home: "خانه",
    productCategory: "دسته بندی محصولات",
    cart: "سبد خرید",
    articles: "مقالات سایت",
    faq: "سوالات متداول",
    contactUs: "ارتباط ما",
    aboutUs: "درباره ما",
    aboutPublisher: "درباره سازنده",
    selectLanguage: "انتخاب زبان",
    share: "اشتراک گذاری",
    userProfile: "پروفایل کاربری",
    signin: "ورود و ثبت نام",
    version: "ویرایش",
    showMore: "نمایش بیشتر",
    search: "جستجو",
    empty: "اطلاعاتی جهت نمایش وجود ندارد",
    rulesEmpty: "قوانینی برای فروشگاه ثبت نشده است.",
    attributesEmpty: "مشخصاتی برای این محصول ثبت نشده است.",
    addressEmpty: "لیست آدرس های شما خالی می باشد",
    cartEmpty: "سبد خرید شما خالی میباشد",
    productCommentsEmpty: "دیدگاهی برای این محصول ثبت نشده است",
    ordersEmpty: "لیست سفارشات خالی می باشد",
    scoresEmpty: "امتیازی برای شما ثبت نشده است",
    yourCart: "سبد خرید شما",
    discountCoupon: "کد تخفیف",
    deleteCoupon: "حذف کد",
    submitCoupon: "ثبت کد",
    useScores: "استفاده از امتیازات",
    checkout: "خرید خود را نهایی کنید",
    totalPrice: "قیمت مجموع",
    totalDiscount: "مجموع تخفیف",
    postalPrice: "هزینه ارسال",
    payablePrice: "مبلغ قابل پرداخت",
    quantity: "تعداد",
    productPrice: "قیمت محصول",
    delete: "حذف",
    addNote: "ثبت توضیحات",
    originalPrice: "قیمت اصلی",
    unavailable: "تمام شد",
    email: "ایمیل",
    mobile: "شماره همراه",
    invalidEmailErr: "لطفا یک ایمیل معتبر وارد نمایید",
    invalidMobileErr: "لطفا یک شماره همراه معتبر وارد نمایید",
    invalidPasswordErr: "رمز عبور نامعتبر است، رمز عبور حداقل 7 کاراکتر بوده و شامل حروف انگلیسی و اعداد می باشد",
    welcome: "خوش آمدید",
    login: "ورود به سیستم",
    invalidInput: (name) => `لطفا ${name} را به صورت صحیح وارد کنید`,
    password: "کلمه عبور",
    enterPassword: "لطفا کلمه عبور را وارد کنید",
    showPassword: "نمایش کلمه عبور",
    forgotPassword: "کلمه عبور را فراموش کرده ام",
    signupAct: "ثبت نام",
    loginAct: "ورود",
    confirm: (text) => `آیا برای ${text} اطمینان دارید؟`,
    exitApp: "خروج از اپلیکیشن",
    exitAct: "خروج",
    cancel: "انصراف",
    viewAll: "مشاهده همه",
    addToCart: "افزودن به سبد خرید",
    filterAct: "فیلتر کردن",
    filterCaption: "رنگ, نوع, قیمت و...",
    sortAct: "مرتب سازی",
    filterProducts: "فیلتر کردن محصولات",
    priceRange: "محدوده قیمت",
    clearAct: "پاک کردن",
    availables: "موجود",
    scoresOnPurchase: (amount) => `با خرید این کالا ${amount} امتیاز دریافت میکنید`,
    attributes: "مشخصات",
    userComments: "نظرات کاربران",
    review: "نقد و بررسی",
    productFiles: "فایل های مرتبط",
    productAttributes: "مشخصات محصول",
    yes: "بله",
    no: "خیر",
    submitComment: "ثبت دیدگاه",
    loginNeeded: "این امکان تنهای برای اعضا در دسترسی است",
    personalInfo: "ویرایش اطلاعات",
    userOrders: "سفارشات من",
    userFavorites: "لیست مورد علاقه",
    userAddresses: "آدرس های من",
    userPoints: "امتیازات",
    changePassword: "تغییر رمزعبور",
    submit: "ثبت اطلاعات",
    trackingCode: "کد رهگیری",
    purchaseDate: "تاریخ خرید",
    paymentStatus: "وضعیت پرداخت",
    orderStatus: "وضعیت سفارش",
    details: "جزییات",
    pay: "تکمیل پرداخت",
    cancelOrder: "لغو سفارش",
    newAddressAct: "افزودن آدرس",
    name: "نام",
    action: "عملیات",
    editAct: "ویرایش",
    selectAddressAct: "انتخاب آدرس",
    submitAddress: "ثبت آدرس",
    oldPassword: "رمز عبور قبلی",
    newPassword: "رمز عبور جدید",
    repeatNewPassword: "تکرار رمز عبور جدید",
    generalInfo: "اطلاعات عمومی",
    orderItems: "محصولات خریداری شده",
    paymentInfo: "اطلاعات پرداخت",
    fullName: "نام و نام خانوادگی",
    totalTax: "جمع کل مالیات",
    postalMethod: "روش ارسال",
    paymentMethod: "روش پرداخت",
    notes: "توضیحات",
    postalTrackingCode: "کد پیگیری مرسوله پستی",
    updatePaymentMethod: "بروزرسانی روش پرداخت",
    orderDetails: "جزئیات سفارش",
    status: "وضعیت",
    sellerName: "کاربر سلر",
    unitPrice: "قیمت واحد",
    cardLastFourDigits: "چهار رقم پایانی کارت",
    paidPrice: "مبلغ پرداخت شده",
    paymentDate: "تاریخ پرداخت",
    referenceNumber: "شماره ارجاع",
    selectCardRequired: "انتخاب یکی از کارت ها ضروری است",
    depositedTo: "واریز شده به",
    creditCard: "کارت",
    bank: "بانک",
    creditCardOwnder: "به نام",
    second: "ثانیه",
    minute: "دقیقه",
    hour: "ساعت",
    deletePrevPaymentInfo: "در صورتی که میخواهید اطلاعات پرداختی جدیدی ثبت نمایید ابتدا می بایست اطلاعات قبلی را حذف نمایید.",
    bankAccount: "حساب بانکی",
    transactionInfo: "اطلاعات تراکنش",
    webite: "وبسایت",
    paymentGateway: "درگاه پرداخت",
    postalPaymentMethod: "روش ارسال و پرداخت",
    select: "انتخاب",
    nextStep: "مرحله بعد",
    orderReview: "بازبینی سفارش",
    viewRulesAct: "مشاهده قوانین",
    agreeToRulesAct: "با شرایط و قوانین سایت موافق هستم",
    submitOrder: "ثبت سفارش",
    shopRules: "قوانین فروشگاه",
    payment: "پرداخت",
    COD: "پرداخت سفارش در محل",
    orderSuccess: "سفارش شما با موفقیت ثبت گردید",
    paidAlready: "پرداخت شده",
    similarProducts: "محصولات مشابه",
    relatedProducts: "محصولات مرتبط",
    recoverPassword: "فراموشی رمزعبور",
    userNameHinted: "نام کاربری (شماره موبایل یا ایمیل)",
    sendRequest: "ارسال درخواست",
    backToPage: (name) => `بازگشت به صفحه ${name}`,
    fillInUserInformation: "لطفا اطلاعات کاربری خود را کامل کنید",
    displayName: "نام نمایشی",
    wrongUserOrPass: "نام کاربری یا رمزعبور اشتباه است",
    minOrder: (amount) => `حداقل میزان سفارش از این کالا برای شما ${amount} عدد میباشد`,
    maxOrder: (amount) => `حداکثر میزان سفارش از این کالا برای شما ${amount} عدد میباشد`,
    cartUpdateError: "خطا در بروزرسانی سبد خرید",
    cartUpdated: "سبد خرید با موفقیت بروزرسانی شد",
    exceedStockCount: "مقدار درخواستی شما از موجودی کالا بیشتر است",
    cartItemDeleted: "حذف از سبد خرید با موفقیت انجام شد",
    validation: {
        number: "مقدار عددی می باشد",
        mobile: "شماره همراه معتبر نمی باشد",
        nationalCode: "کد ملی معتبر نمی باشد",
        email: "ایمیل غیر معتبر می باشد",
        username: "نام کاربری نامعتبر می باشد",
        password: "رمز عبور نامعتبر است، رمز عبور حداقل 7 کاراکتر بوده و شامل حروف انگلیسی و اعداد می باشد",
        confirmPassword: "رمز عبور و تکرار آن برابر نمی باشد",
        samePassword: "رمزعبور قبلی نمیتواند با رمزعبور جدید یکسان باشد",
    },
};

function formatres() {
    const newp = Object.entries(resources).reduce((pv, [key, val]) => {
        if (key === "validation") {
            Object.entries(resources.validation).forEach(([key, val]) => {
                pv[val] = key + "_v";
            });
        } else pv[val] = key;

        return pv;
    }, {});

    return newp;
}

translateDirector("./src/tapo", formatres(resources));

module.exports = {
    default: translateDirector,
};
