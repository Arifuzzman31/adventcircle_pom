export const DONATION_STRINGS = {
    MAIN: "DONATION FLOW TEST",
    TESTS: {
        CREATE_DONATION: "Church can create a donation",
        BLANK_FIELDS: "Should show validation errors for blank mandatory fields",
        ASTERISK_INDICATORS: "Should validate mandatory fields with asterisk indicators",
        MISSING_TITLE: "Should not allow submission with only title filled",
        MISSING_GOAL: "Should not allow submission with missing goal amount",
        MISSING_PHONE: "Should not allow submission with missing phone number",
        MISSING_DETAILS: "Should not allow submission with missing details",
        OPTIONAL_EMAIL: "Should allow submission without email (optional field)"
    },
    MESSAGES: {
        VALIDATION_SUCCESS: "✅ Mandatory field validation working - form prevents submission with blank fields",
        ASTERISK_SUCCESS: "✅ Asterisk indicators are correctly displayed for mandatory fields",
        INCOMPLETE_FIELDS: "✅ Form validation prevents submission with incomplete mandatory fields",
        MISSING_GOAL_SUCCESS: "✅ Form validation prevents submission without goal amount",
        MISSING_PHONE_SUCCESS: "✅ Form validation prevents submission without phone number",
        MISSING_DETAILS_SUCCESS: "✅ Form validation prevents submission without details",
        OPTIONAL_EMAIL_SUCCESS: "✅ Form allows submission without optional email field"
    }
};
