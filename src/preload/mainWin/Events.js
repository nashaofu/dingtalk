export default class Events {
  static noConflict () {
    return Events
  }
  getListeners (event) {
    let listener
    let events = this._getEvents()
    if (event instanceof RegExp) {
      listener = {}
      Object.keys(events).forEach(key => {
        if (event.test(key)) {
          listener[key] = events[key]
        }
      })
    } else {
      listener = events[event] || []
    }
    return listener
  }

  flattenListeners (events) {
    return events.map(({ listener }) => listener)
  }

  getListenersAsObject (event) {
    const listener = this.getListeners(event)
    let listenerAsObject = {}
    if (listener instanceof Array) {
      listenerAsObject[event] = listener
    } else {
      listenerAsObject = listener
    }
    return listenerAsObject
  }
  addListener (event, listener) {
    const isObject = typeof listener === 'object'
    const listenerAsObject = this.getListenersAsObject(event)
    Object.keys(listenerAsObject).forEach(key => {
      const index = listenerAsObject[key].findIndex(item => item.listener === listener)
      if (index !== -1) {
        listenerAsObject[key].push(isObject ? listener : { listener, once: false })
      }
    })
    return this
  }

  on (event, listener) {
    return this.addListener(event, listener)
  }

  addOnceListener (event, listener) {
    return this.addListener(event, {
      listener,
      once: true
    })
  }
  once (event, listener) {
    return this.addOnceListener(event, listener)
  }
  defineEvent (event) {
    this.getListeners(event)
    return this
  }
  defineEvents (events) {
    events.forEach(event => this.defineEvent(event))
    return this
  }

  removeListener (event, listener) {
    const listenerAsObject = this.getListenersAsObject(event)
    Object.keys(listenerAsObject).forEach(key => {
      const index = listenerAsObject[key].findIndex(item => item.listener === listener)
      if (index !== -1) {
        listenerAsObject[key].splice(index, 1)
      }
    })
    return this
  }

  off (event, listener) {
    return this.removeListener(event, listener)
  }

  addListeners (event, listener) {
    return this.manipulateListeners(false, event, listener)
  }

  removeListeners (event, listener) {
    return this.manipulateListeners(true, event, listener)
  }

  manipulateListeners (is, events, listeners) {
    const single = is
      ? this.removeListener
      : this.addListener
    const manipulate = is
      ? this.removeListeners
      : this.addListeners
    if (typeof events !== 'object' || events instanceof RegExp) {
      listeners.forEach(listener => single.call(this, events, listener))
    } else {
      Object.keys(events).forEach(key => {
        const listener = events[key]
        if (typeof listener === 'function') {
          single.call(this, key, listener)
        } else {
          manipulate.call(this, key, listener)
        }
      })
    }
    return this
  }

  removeEvent (event) {
    const events = this._getEvents()
    if (typeof event === 'string') {
      delete events[event]
    } else if (event instanceof RegExp) {
      Object.keys(events).forEach(key => {
        if (event.test(key)) delete events[key]
      })
    } else {
      delete this._events
    }
    return this
  }

  removeAllListeners (event) {
    return this.removeEvent(event)
  }

  emitEvent (event, args) {
    let listenersAsObject = this.getListenersAsObject(event)
    Object.keys(listenersAsObject).forEach(key => {
      listenersAsObject[key].forEach(listener => {
        if (listener.once) {
          this.removeListener(event, listener)
        }
        if (listener.apply(this, args || []) === this._getOnceReturnValue()) {
          this.removeListener(event, listener)
        }
      })
    })
    return this
  }

  trigger (event, args) {
    return this.emitEvent(event, args)
  }

  emit (event, ...args) {
    return this.emitEvent(event, args)
  }

  setOnceReturnValue (val) {
    this._onceReturnValue = val
    return this
  }

  _getOnceReturnValue = function () {
    return !this.hasOwnProperty('_onceReturnValue') || this._onceReturnValue
  }

  _getEvents = function () {
    return this._events || {}
  }
}
