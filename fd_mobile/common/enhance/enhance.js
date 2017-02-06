String.prototype.stripTags =  function() {
  return this.replace(/<\/?[^>]+>/gi, '');
};

String.prototype.trim = function(s) {
  if (s === undefined || s === null || s === '') {
    return this.replace(/(^\s*)|(\s*$)/g, '');
  }
  var res = this;
  while (res.endsWith(s)) {
    res = res.substring(0, res.length - s.length);
  }
  while (res.startsWith(s)) {
    res = res.substring(s.length, res.length);
  }
  return res;
};

String.prototype.contains = function(s) {
  return this.indexOf(s) !== -1;
};

String.prototype.startsWith = function(prefix) {
  return prefix === undefined || prefix === null || prefix === '' ? false : this.slice(0, prefix.length) === prefix;
};

String.prototype.endsWith = function(suffix) {
  return suffix === undefined || suffix === null || suffix === '' ? false : this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.containAll = function() {
  var args = arguments[0] instanceof Array ? arguments[0] : arguments;
  for (var i = 0; i < args.length; i++) {
    if (!this.contains(args[i])) {
      return false;
    }
  }
  return true;
};

String.prototype.containAny = function() {
  var args = arguments[0] instanceof Array ? arguments[0] : arguments;
  for (var i = 0; i < args.length; i++) {
    if (this.contains(args[i])) {
      return true;
    }
  }
  return false;
};
