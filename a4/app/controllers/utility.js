var validate = require("validate.js");
var constraints = {
    email: {
        presence: true,
        email: {
            message: "is not valid"
        }
    },
    password: {
        presence: true,
        length: {
            minimum: 6,
            message: "must be at least 6 characters"
        }
    }
};

exports.isValidInfo = function(user_info) {
    valid = validate(user_info, constraints, { format: "flat" });
    if (user_info.password.indexOf(' ') >= 0)
        if (valid == undefined)
            return { valid: false, msg: ["Password can not contain whitespaces"]};
        else{
            valid.push("Password can not contain whitespaces")
            return { valid: false, msg: valid};
        }
    if (valid == undefined)
        return { valid: true, msg: null };
    else
        return { valid: false, msg: valid };
}
