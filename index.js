const providerCodes = {
    "0162|162":"032",
    "0163|163":"033",
    "0164|164":"034",
    "0165|165":"035",
    "0166|166":"036",
    "0167|167":"037",
    "0168|168":"038",
    "0169|169":"039",
    "0123|123":"083",
    "0124|124":"084",
    "0125|125":"085",
    "0127|127":"081",
    "0129|129":"082",
    "0120|120":"070",
    "0121|121":"079",
    "0122|122":"077",
    "0126|126":"076",
    "0128|128":"078",
    "0186|186":"056",
    "0188|188":"058",
    "0199|199":"059"
};
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
/**
 *
 * @param phoneNumber {String}
 * @param regionCode {String}
 * @returns {Object}: ex : {
                status: true,
                message: "2323232"
            }
 */ module.exports = function(phoneNumber, regionCode = 'VN') {
    try {
        // Parse number with country code and keep raw input.
        regionCode = regionCode ? regionCode.toString().toUpperCase(): "VN";
        phoneNumber = phoneNumber ? phoneNumber.toString().trim() : "";
        let t3rdCharacters = phoneNumber.slice(0,3);
        console.log(t3rdCharacters);
        const number = phoneUtil.parseAndKeepRawInput(phoneNumber, regionCode);
        let isValidNumber = phoneUtil.isValidNumberForRegion(number,regionCode)
        if(t3rdCharacters=='086'){
            isValidNumber = true;
        }
        if (!isValidNumber) {
            return {
                status: false,
                message: `Phone number is invalid for the region ${regionCode}.`
            };
        }
        if (regionCode === "VN") {
            //ex: '202-456-1414'  => 2024561414
            let newNumber = number.getNationalNumber();
            newNumber = newNumber.toString();
            if (newNumber.length > 9) {
                Object.keys(providerCodes).map(key => {
                    const reg = new RegExp('^('+key+')(\\d+)', 'gm');
                    if (reg.test(newNumber)) {
                        newNumber = newNumber.replace(reg, providerCodes[key]+'$2');
                    }
                });
            }
            return {
                status: true,
                value: newNumber.toString(),
                message : ""
            };
        }

        return {
            status: true,
            value: number.toString(),
            message: ""
        };
    } catch(e) {
        return {
            status: false,
            message: e.toString()
        };
    }
}