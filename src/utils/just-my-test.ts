let activeEffect = null;

class Dep {
  constructor(value) {
    this.subscribers = new Set();
    this._value = value;
  }
  get value() {
    this.depend();
    return this._value;
  }
  set value(newValue) {
    this._value = newValue;
    this.notify();
  }
  depend() {
    if (activeEffect) {
      this.subscribers.add(activeEffect);
    }
  }
  notify() {
    this.subscribers.forEach(effect => effect());
  }
}

function watchEffect(effect) {
  activeEffect = effect;
  effect();
  activeEffect = null;
}

const a = new Dep(true);
const b = new Dep('test');

watchEffect(() => {
  if (a.value) {
    console.log(b.value);
  } else {
    console.log('a false');
  }
});
