const KEY_EVENTS = new Set(["keydown", "keyup", "keypress"]);
const KEY_PROPERTIES = ["onkeydown", "onkeyup", "onkeypress"];

const originalAddEventListener = EventTarget.prototype.addEventListener;

EventTarget.prototype.addEventListener = function (type, listener, options) {
  if (KEY_EVENTS.has(type)) {
    return;
  }

  return originalAddEventListener.call(this, type, listener, options);
};

function ignoreKeyHandlerProperties(prototype) {
  for (const property of KEY_PROPERTIES) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, property);
    if (!descriptor?.configurable) {
      continue;
    }

    Object.defineProperty(prototype, property, {
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable,
      get() {
        return descriptor.get?.call(this) ?? null;
      },
      set() {},
    });
  }
}

ignoreKeyHandlerProperties(Window.prototype);
ignoreKeyHandlerProperties(Document.prototype);
