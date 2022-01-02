
export default {
  formatPrice (amount, currency) {
    var formatted = Number(amount.replace(',', '.')).toFixed(2);
    if(currency) formatted += " €";
    return formatted;
  },
  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  toDate: function (timestamp) {
    return timestamp.toDate().toLocaleDateString()
  },
  toLocaleDateTimeString: function (d) {
    var hours = d.getHours();
    if(hours<10)
      hours = '0' + hours;
    var mins = d.getMinutes();
    if(mins < 10)
      mins = '0' + mins;
    var datetime = d.toLocaleDateString() + " ";
    datetime += hours + ":" + mins;
    return datetime;
  },
  toDateTime: function (timestamp) {
    var ts = timestamp.toDate();
    var hours = ts.getHours();
    if(hours<10)
      hours = '0' + hours;
    var mins = ts.getMinutes();
    if(mins < 10)
      mins = '0' + mins;
    var datetime = ts.toLocaleDateString() + " ";
    datetime += hours + ":" + mins;
    return datetime;
  },
  daysInMonth: function (date) {
    return new Date(date.getFullYear(), date.getMonth(), 0).getDate()
  },
  addDays: function (date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
  diffDays: function (date1, date2) {
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  },
  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  },
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  },
  rgbToHex(r, g, b) {
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  },
  hexToRgb(hex, alpha) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(result) {
      var r = parseInt(result[1], 16);
      var g = parseInt(result[2], 16);
      var b = parseInt(result[3], 16);
  
      return "rgb(" + r + "," + g + "," + b + "," + alpha + ")";
    } else {
      return "";
    }
  }
}
