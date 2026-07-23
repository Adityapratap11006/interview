let addToastFn = null

export function toast(message, type = 'success') {
  if (addToastFn) addToastFn({ id: Date.now(), message, type })
}

export function setToastHandler(fn) {
  addToastFn = fn
}
