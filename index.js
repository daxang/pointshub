export function shortAddress(_address) {
    if(!_address) {
      return "-";
    }
  
    const _firstChars = _address.substring(0, 5);
    const _lastChars = _address.substr(_address.length - 5);
    return _firstChars.concat('-', _lastChars);
  }