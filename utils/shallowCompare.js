
function areEqualShallow(a, b) {
  for (let key in a) {
    if (a.hasOwnProperty(key) && (!(key in b) || a[key] !== b[key])) {
        return false;
    }
  }
  for (let key in b) {
    if (b.hasOwnProperty(key) && !(key in a)) {
      return false;
    }
  }
  return true;
}

export default areEqualShallow;
