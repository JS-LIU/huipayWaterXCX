class Logger{
  constructor() {
    this.listenerEvents = {};
    this.unListenerEvents = {};
    // this.loginState = false;
  }
  trigger(event) {

    if (this.listenerEvents[event]) {
      console.log('=====fffffff======', this.listenerEvents[event])
      for (let i = 0; i < this.listenerEvents[event].length; i++) {
        this.listenerEvents[event][i]();
      }
    } else {
      this.unListenerEvents[event] = [];
    }

  }
  listen(event, func) {
    if (this.unListenerEvents[event]) {
      func();
    } else {
      if (!this.listenerEvents[event]) {
        this.listenerEvents[event] = [];
      }
      this.listenerEvents[event].push(func);
    }

  }
}
module.exports = Logger;