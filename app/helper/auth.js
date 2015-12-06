var alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
var length = 10;

function makeSalt() {
    var result = '';
    for (var i = length; i > 0; --i) result += alphabet[Math.round(Math.random() * (alphabet.length - 1))];
    return result;
}