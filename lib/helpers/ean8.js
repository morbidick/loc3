ean8 = {
  prefix: Meteor.settings.public.ean_prefix,

  isValid: function(input) {
    try {
      this.checkLength(input);
      this.checkIsNumeric(input);
      this.checkPrefix(input);
      this.checkChecksum(input);
    } catch(error) {
      throw error;
    }
    return true;
  },
  create: function(id) {
    id = id.toString();
    this.checkIsNumeric(id);
    this.checkIsNumeric(this.prefix);

    var fill_length = 7 - id.length - this.prefix.length;
    if(fill_length < 0) {
      throw new Meteor.Error("invalid-length", "id + prefix is to long");
    }

    var fill = "";
    for (var i = 0; i < fill_length; i++) {
      fill += "0"
    }
    var temp = this.prefix + fill + id;
    return temp + this.calcChecksum(temp);
  },
  calcChecksum: function(code) {
    code = code.toString();

    this.checkLength(code,7);
    this.checkIsNumeric(code);

    var sum1 = parseInt(code[1]) + parseInt(code[3]) + parseInt(code[5]) 
    var sum2 = 3 * (parseInt(code[0]) + parseInt(code[2]) + parseInt(code[4]) + parseInt(code[6]));
    var checksum_value = sum1 + sum2;

    var checksum_digit = 10 - (checksum_value % 10);
    if (checksum_digit == 10) {
      checksum_digit = 0;
    }

    return checksum_digit;

  },
  checkChecksum: function(input) {
    input = input.toString();

    this.checkLength(input);
    this.checkIsNumeric(input);

    code = input.slice(0,7);
    checksum = parseInt(input[7]);

    if (checksum === this.calcChecksum(code)) {
      return true;
    } else {
      throw new Meteor.Error("checksum-mismatch", "the calculated checksum doesnt match");
    }
  },
  checkLength: function(input, length) {
    var length = length || 8
    if (input.length !== length) {
      throw new Meteor.Error("invalid-input", "expects a 7 digit input");
    }
  },
  checkIsNumeric: function(input) {
    if (!validate.isNumeric(input)) {
      throw new Meteor.Error("invalid-input", "expects a numeric input");
    }
  },
  checkPrefix: function(input) {
    var temp = input.slice(0,this.prefix.length);
    if (temp !== this.prefix) {
      throw new Meteor.Error("invalid-input", "prefix doesnt match");
    }
    return true;
  }
}
