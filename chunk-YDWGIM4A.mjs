import "./polyfills.server.mjs";
import { a as J, b as Je, d as ca, h as Rr } from "./chunk-VVCT4QZE.mjs";
var nm = null;
var mu = 1,
  rm = Symbol("SIGNAL");
function It(t) {
  let e = nm;
  return (nm = t), e;
}
var im = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function Rw(t) {
  if (!(vu(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === mu)) {
    if (!t.producerMustRecompute(t) && !gu(t)) {
      (t.dirty = !1), (t.lastCleanEpoch = mu);
      return;
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = mu);
  }
}
function sm(t) {
  return t && (t.nextProducerIndex = 0), It(t);
}
function om(t, e) {
  if (
    (It(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (vu(t))
      for (let n = t.nextProducerIndex; n < t.producerNode.length; n++)
        yu(t.producerNode[n], t.producerIndexOfThis[n]);
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop();
  }
}
function gu(t) {
  la(t);
  for (let e = 0; e < t.producerNode.length; e++) {
    let n = t.producerNode[e],
      r = t.producerLastReadVersion[e];
    if (r !== n.version || (Rw(n), r !== n.version)) return !0;
  }
  return !1;
}
function am(t) {
  if ((la(t), vu(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      yu(t.producerNode[e], t.producerIndexOfThis[e]);
  (t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0);
}
function yu(t, e) {
  if ((Ow(t), la(t), t.liveConsumerNode.length === 1))
    for (let r = 0; r < t.producerNode.length; r++)
      yu(t.producerNode[r], t.producerIndexOfThis[r]);
  let n = t.liveConsumerNode.length - 1;
  if (
    ((t.liveConsumerNode[e] = t.liveConsumerNode[n]),
    (t.liveConsumerIndexOfThis[e] = t.liveConsumerIndexOfThis[n]),
    t.liveConsumerNode.length--,
    t.liveConsumerIndexOfThis.length--,
    e < t.liveConsumerNode.length)
  ) {
    let r = t.liveConsumerIndexOfThis[e],
      i = t.liveConsumerNode[e];
    la(i), (i.producerIndexOfThis[r] = e);
  }
}
function vu(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0;
}
function la(t) {
  (t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= []);
}
function Ow(t) {
  (t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= []);
}
function kw() {
  throw new Error();
}
var Lw = kw;
function cm(t) {
  Lw = t;
}
function pe(t) {
  return typeof t == "function";
}
function fi(t) {
  let n = t((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var ua = fi(
  (t) =>
    function (n) {
      t(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, i) => `${i + 1}) ${r.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = n);
    }
);
function gs(t, e) {
  if (t) {
    let n = t.indexOf(e);
    0 <= n && t.splice(n, 1);
  }
}
var rt = class t {
  constructor(e) {
    (this.initialTeardown = e),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let e;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: n } = this;
      if (n)
        if (((this._parentage = null), Array.isArray(n)))
          for (let s of n) s.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if (pe(r))
        try {
          r();
        } catch (s) {
          e = s instanceof ua ? s.errors : [s];
        }
      let { _finalizers: i } = this;
      if (i) {
        this._finalizers = null;
        for (let s of i)
          try {
            lm(s);
          } catch (o) {
            (e = e ?? []),
              o instanceof ua ? (e = [...e, ...o.errors]) : e.push(o);
          }
      }
      if (e) throw new ua(e);
    }
  }
  add(e) {
    var n;
    if (e && e !== this)
      if (this.closed) lm(e);
      else {
        if (e instanceof t) {
          if (e.closed || e._hasParent(this)) return;
          e._addParent(this);
        }
        (this._finalizers =
          (n = this._finalizers) !== null && n !== void 0 ? n : []).push(e);
      }
  }
  _hasParent(e) {
    let { _parentage: n } = this;
    return n === e || (Array.isArray(n) && n.includes(e));
  }
  _addParent(e) {
    let { _parentage: n } = this;
    this._parentage = Array.isArray(n) ? (n.push(e), n) : n ? [n, e] : e;
  }
  _removeParent(e) {
    let { _parentage: n } = this;
    n === e ? (this._parentage = null) : Array.isArray(n) && gs(n, e);
  }
  remove(e) {
    let { _finalizers: n } = this;
    n && gs(n, e), e instanceof t && e._removeParent(this);
  }
};
rt.EMPTY = (() => {
  let t = new rt();
  return (t.closed = !0), t;
})();
var Eu = rt.EMPTY;
function da(t) {
  return (
    t instanceof rt ||
    (t && "closed" in t && pe(t.remove) && pe(t.add) && pe(t.unsubscribe))
  );
}
function lm(t) {
  pe(t) ? t() : t.unsubscribe();
}
var Zt = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var hi = {
  setTimeout(t, e, ...n) {
    let { delegate: r } = hi;
    return r?.setTimeout ? r.setTimeout(t, e, ...n) : setTimeout(t, e, ...n);
  },
  clearTimeout(t) {
    let { delegate: e } = hi;
    return (e?.clearTimeout || clearTimeout)(t);
  },
  delegate: void 0,
};
function fa(t) {
  hi.setTimeout(() => {
    let { onUnhandledError: e } = Zt;
    if (e) e(t);
    else throw t;
  });
}
function ys() {}
var um = bu("C", void 0, void 0);
function dm(t) {
  return bu("E", void 0, t);
}
function fm(t) {
  return bu("N", t, void 0);
}
function bu(t, e, n) {
  return { kind: t, value: e, error: n };
}
var Or = null;
function pi(t) {
  if (Zt.useDeprecatedSynchronousErrorHandling) {
    let e = !Or;
    if ((e && (Or = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: n, error: r } = Or;
      if (((Or = null), n)) throw r;
    }
  } else t();
}
function hm(t) {
  Zt.useDeprecatedSynchronousErrorHandling &&
    Or &&
    ((Or.errorThrown = !0), (Or.error = t));
}
var kr = class extends rt {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), da(e) && e.add(this))
          : (this.destination = jw);
    }
    static create(e, n, r) {
      return new mi(e, n, r);
    }
    next(e) {
      this.isStopped ? Du(fm(e), this) : this._next(e);
    }
    error(e) {
      this.isStopped
        ? Du(dm(e), this)
        : ((this.isStopped = !0), this._error(e));
    }
    complete() {
      this.isStopped ? Du(um, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(e) {
      this.destination.next(e);
    }
    _error(e) {
      try {
        this.destination.error(e);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  Pw = Function.prototype.bind;
function wu(t, e) {
  return Pw.call(t, e);
}
var _u = class {
    constructor(e) {
      this.partialObserver = e;
    }
    next(e) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(e);
        } catch (r) {
          ha(r);
        }
    }
    error(e) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(e);
        } catch (r) {
          ha(r);
        }
      else ha(e);
    }
    complete() {
      let { partialObserver: e } = this;
      if (e.complete)
        try {
          e.complete();
        } catch (n) {
          ha(n);
        }
    }
  },
  mi = class extends kr {
    constructor(e, n, r) {
      super();
      let i;
      if (pe(e) || !e)
        i = { next: e ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let s;
        this && Zt.useDeprecatedNextContext
          ? ((s = Object.create(e)),
            (s.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: e.next && wu(e.next, s),
              error: e.error && wu(e.error, s),
              complete: e.complete && wu(e.complete, s),
            }))
          : (i = e);
      }
      this.destination = new _u(i);
    }
  };
function ha(t) {
  Zt.useDeprecatedSynchronousErrorHandling ? hm(t) : fa(t);
}
function Fw(t) {
  throw t;
}
function Du(t, e) {
  let { onStoppedNotification: n } = Zt;
  n && hi.setTimeout(() => n(t, e));
}
var jw = { closed: !0, next: ys, error: Fw, complete: ys };
var gi = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function Mt(t) {
  return t;
}
function Tu(...t) {
  return Su(t);
}
function Su(t) {
  return t.length === 0
    ? Mt
    : t.length === 1
    ? t[0]
    : function (n) {
        return t.reduce((r, i) => i(r), n);
      };
}
var Ae = (() => {
  class t {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new t();
      return (r.source = this), (r.operator = n), r;
    }
    subscribe(n, r, i) {
      let s = Bw(n) ? n : new mi(n, r, i);
      return (
        pi(() => {
          let { operator: o, source: a } = this;
          s.add(
            o ? o.call(s, a) : a ? this._subscribe(s) : this._trySubscribe(s)
          );
        }),
        s
      );
    }
    _trySubscribe(n) {
      try {
        return this._subscribe(n);
      } catch (r) {
        n.error(r);
      }
    }
    forEach(n, r) {
      return (
        (r = pm(r)),
        new r((i, s) => {
          let o = new mi({
            next: (a) => {
              try {
                n(a);
              } catch (c) {
                s(c), o.unsubscribe();
              }
            },
            error: s,
            complete: i,
          });
          this.subscribe(o);
        })
      );
    }
    _subscribe(n) {
      var r;
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(n);
    }
    [gi]() {
      return this;
    }
    pipe(...n) {
      return Su(n)(this);
    }
    toPromise(n) {
      return (
        (n = pm(n)),
        new n((r, i) => {
          let s;
          this.subscribe(
            (o) => (s = o),
            (o) => i(o),
            () => r(s)
          );
        })
      );
    }
  }
  return (t.create = (e) => new t(e)), t;
})();
function pm(t) {
  var e;
  return (e = t ?? Zt.Promise) !== null && e !== void 0 ? e : Promise;
}
function Hw(t) {
  return t && pe(t.next) && pe(t.error) && pe(t.complete);
}
function Bw(t) {
  return (t && t instanceof kr) || (Hw(t) && da(t));
}
function Cu(t) {
  return pe(t?.lift);
}
function Me(t) {
  return (e) => {
    if (Cu(e))
      return e.lift(function (n) {
        try {
          return t(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function Ce(t, e, n, r, i) {
  return new Iu(t, e, n, r, i);
}
var Iu = class extends kr {
  constructor(e, n, r, i, s, o) {
    super(e),
      (this.onFinalize = s),
      (this.shouldUnsubscribe = o),
      (this._next = n
        ? function (a) {
            try {
              n(a);
            } catch (c) {
              e.error(c);
            }
          }
        : super._next),
      (this._error = i
        ? function (a) {
            try {
              i(a);
            } catch (c) {
              e.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              e.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var e;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this;
      super.unsubscribe(),
        !n && ((e = this.onFinalize) === null || e === void 0 || e.call(this));
    }
  }
};
function yi() {
  return Me((t, e) => {
    let n = null;
    t._refCount++;
    let r = Ce(e, void 0, void 0, void 0, () => {
      if (!t || t._refCount <= 0 || 0 < --t._refCount) {
        n = null;
        return;
      }
      let i = t._connection,
        s = n;
      (n = null), i && (!s || i === s) && i.unsubscribe(), e.unsubscribe();
    });
    t.subscribe(r), r.closed || (n = t.connect());
  });
}
var vi = class extends Ae {
  constructor(e, n) {
    super(),
      (this.source = e),
      (this.subjectFactory = n),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      Cu(e) && (this.lift = e.lift);
  }
  _subscribe(e) {
    return this.getSubject().subscribe(e);
  }
  getSubject() {
    let e = this._subject;
    return (
      (!e || e.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: e } = this;
    (this._subject = this._connection = null), e?.unsubscribe();
  }
  connect() {
    let e = this._connection;
    if (!e) {
      e = this._connection = new rt();
      let n = this.getSubject();
      e.add(
        this.source.subscribe(
          Ce(
            n,
            void 0,
            () => {
              this._teardown(), n.complete();
            },
            (r) => {
              this._teardown(), n.error(r);
            },
            () => this._teardown()
          )
        )
      ),
        e.closed && ((this._connection = null), (e = rt.EMPTY));
    }
    return e;
  }
  refCount() {
    return yi()(this);
  }
};
var mm = fi(
  (t) =>
    function () {
      t(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    }
);
var mt = (() => {
    class t extends Ae {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(n) {
        let r = new pa(this, this);
        return (r.operator = n), r;
      }
      _throwIfClosed() {
        if (this.closed) throw new mm();
      }
      next(n) {
        pi(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        pi(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        pi(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: n } = this;
            for (; n.length; ) n.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var n;
        return (
          ((n = this.observers) === null || n === void 0 ? void 0 : n.length) >
          0
        );
      }
      _trySubscribe(n) {
        return this._throwIfClosed(), super._trySubscribe(n);
      }
      _subscribe(n) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(n),
          this._innerSubscribe(n)
        );
      }
      _innerSubscribe(n) {
        let { hasError: r, isStopped: i, observers: s } = this;
        return r || i
          ? Eu
          : ((this.currentObservers = null),
            s.push(n),
            new rt(() => {
              (this.currentObservers = null), gs(s, n);
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: i, isStopped: s } = this;
        r ? n.error(i) : s && n.complete();
      }
      asObservable() {
        let n = new Ae();
        return (n.source = this), n;
      }
    }
    return (t.create = (e, n) => new pa(e, n)), t;
  })(),
  pa = class extends mt {
    constructor(e, n) {
      super(), (this.destination = e), (this.source = n);
    }
    next(e) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.next) ===
        null ||
        r === void 0 ||
        r.call(n, e);
    }
    error(e) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.error) ===
        null ||
        r === void 0 ||
        r.call(n, e);
    }
    complete() {
      var e, n;
      (n =
        (e = this.destination) === null || e === void 0
          ? void 0
          : e.complete) === null ||
        n === void 0 ||
        n.call(e);
    }
    _subscribe(e) {
      var n, r;
      return (r =
        (n = this.source) === null || n === void 0
          ? void 0
          : n.subscribe(e)) !== null && r !== void 0
        ? r
        : Eu;
    }
  };
var lt = class extends mt {
  constructor(e) {
    super(), (this._value = e);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(e) {
    let n = super._subscribe(e);
    return !n.closed && e.next(this._value), n;
  }
  getValue() {
    let { hasError: e, thrownError: n, _value: r } = this;
    if (e) throw n;
    return this._throwIfClosed(), r;
  }
  next(e) {
    super.next((this._value = e));
  }
};
var $t = new Ae((t) => t.complete());
function gm(t) {
  return t && pe(t.schedule);
}
function ym(t) {
  return t[t.length - 1];
}
function ma(t) {
  return pe(ym(t)) ? t.pop() : void 0;
}
function tr(t) {
  return gm(ym(t)) ? t.pop() : void 0;
}
function Em(t, e, n, r) {
  function i(s) {
    return s instanceof n
      ? s
      : new n(function (o) {
          o(s);
        });
  }
  return new (n || (n = Promise))(function (s, o) {
    function a(u) {
      try {
        l(r.next(u));
      } catch (d) {
        o(d);
      }
    }
    function c(u) {
      try {
        l(r.throw(u));
      } catch (d) {
        o(d);
      }
    }
    function l(u) {
      u.done ? s(u.value) : i(u.value).then(a, c);
    }
    l((r = r.apply(t, e || [])).next());
  });
}
function vm(t) {
  var e = typeof Symbol == "function" && Symbol.iterator,
    n = e && t[e],
    r = 0;
  if (n) return n.call(t);
  if (t && typeof t.length == "number")
    return {
      next: function () {
        return (
          t && r >= t.length && (t = void 0), { value: t && t[r++], done: !t }
        );
      },
    };
  throw new TypeError(
    e ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function Lr(t) {
  return this instanceof Lr ? ((this.v = t), this) : new Lr(t);
}
function bm(t, e, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = n.apply(t, e || []),
    i,
    s = [];
  return (
    (i = {}),
    o("next"),
    o("throw"),
    o("return"),
    (i[Symbol.asyncIterator] = function () {
      return this;
    }),
    i
  );
  function o(m) {
    r[m] &&
      (i[m] = function (b) {
        return new Promise(function (I, N) {
          s.push([m, b, I, N]) > 1 || a(m, b);
        });
      });
  }
  function a(m, b) {
    try {
      c(r[m](b));
    } catch (I) {
      d(s[0][3], I);
    }
  }
  function c(m) {
    m.value instanceof Lr
      ? Promise.resolve(m.value.v).then(l, u)
      : d(s[0][2], m);
  }
  function l(m) {
    a("next", m);
  }
  function u(m) {
    a("throw", m);
  }
  function d(m, b) {
    m(b), s.shift(), s.length && a(s[0][0], s[0][1]);
  }
}
function wm(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var e = t[Symbol.asyncIterator],
    n;
  return e
    ? e.call(t)
    : ((t = typeof vm == "function" ? vm(t) : t[Symbol.iterator]()),
      (n = {}),
      r("next"),
      r("throw"),
      r("return"),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(s) {
    n[s] =
      t[s] &&
      function (o) {
        return new Promise(function (a, c) {
          (o = t[s](o)), i(a, c, o.done, o.value);
        });
      };
  }
  function i(s, o, a, c) {
    Promise.resolve(c).then(function (l) {
      s({ value: l, done: a });
    }, o);
  }
}
var ga = (t) => t && typeof t.length == "number" && typeof t != "function";
function ya(t) {
  return pe(t?.then);
}
function va(t) {
  return pe(t[gi]);
}
function Ea(t) {
  return Symbol.asyncIterator && pe(t?.[Symbol.asyncIterator]);
}
function ba(t) {
  return new TypeError(
    `You provided ${
      t !== null && typeof t == "object" ? "an invalid object" : `'${t}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function Uw() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var wa = Uw();
function Da(t) {
  return pe(t?.[wa]);
}
function _a(t) {
  return bm(this, arguments, function* () {
    let n = t.getReader();
    try {
      for (;;) {
        let { value: r, done: i } = yield Lr(n.read());
        if (i) return yield Lr(void 0);
        yield yield Lr(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function Ta(t) {
  return pe(t?.getReader);
}
function et(t) {
  if (t instanceof Ae) return t;
  if (t != null) {
    if (va(t)) return Vw(t);
    if (ga(t)) return $w(t);
    if (ya(t)) return qw(t);
    if (Ea(t)) return Dm(t);
    if (Da(t)) return zw(t);
    if (Ta(t)) return Gw(t);
  }
  throw ba(t);
}
function Vw(t) {
  return new Ae((e) => {
    let n = t[gi]();
    if (pe(n.subscribe)) return n.subscribe(e);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function $w(t) {
  return new Ae((e) => {
    for (let n = 0; n < t.length && !e.closed; n++) e.next(t[n]);
    e.complete();
  });
}
function qw(t) {
  return new Ae((e) => {
    t.then(
      (n) => {
        e.closed || (e.next(n), e.complete());
      },
      (n) => e.error(n)
    ).then(null, fa);
  });
}
function zw(t) {
  return new Ae((e) => {
    for (let n of t) if ((e.next(n), e.closed)) return;
    e.complete();
  });
}
function Dm(t) {
  return new Ae((e) => {
    Ww(t, e).catch((n) => e.error(n));
  });
}
function Gw(t) {
  return Dm(_a(t));
}
function Ww(t, e) {
  var n, r, i, s;
  return Em(this, void 0, void 0, function* () {
    try {
      for (n = wm(t); (r = yield n.next()), !r.done; ) {
        let o = r.value;
        if ((e.next(o), e.closed)) return;
      }
    } catch (o) {
      i = { error: o };
    } finally {
      try {
        r && !r.done && (s = n.return) && (yield s.call(n));
      } finally {
        if (i) throw i.error;
      }
    }
    e.complete();
  });
}
function wt(t, e, n, r = 0, i = !1) {
  let s = e.schedule(function () {
    n(), i ? t.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((t.add(s), !i)) return s;
}
function Sa(t, e = 0) {
  return Me((n, r) => {
    n.subscribe(
      Ce(
        r,
        (i) => wt(r, t, () => r.next(i), e),
        () => wt(r, t, () => r.complete(), e),
        (i) => wt(r, t, () => r.error(i), e)
      )
    );
  });
}
function Ca(t, e = 0) {
  return Me((n, r) => {
    r.add(t.schedule(() => n.subscribe(r), e));
  });
}
function _m(t, e) {
  return et(t).pipe(Ca(e), Sa(e));
}
function Tm(t, e) {
  return et(t).pipe(Ca(e), Sa(e));
}
function Sm(t, e) {
  return new Ae((n) => {
    let r = 0;
    return e.schedule(function () {
      r === t.length
        ? n.complete()
        : (n.next(t[r++]), n.closed || this.schedule());
    });
  });
}
function Cm(t, e) {
  return new Ae((n) => {
    let r;
    return (
      wt(n, e, () => {
        (r = t[wa]()),
          wt(
            n,
            e,
            () => {
              let i, s;
              try {
                ({ value: i, done: s } = r.next());
              } catch (o) {
                n.error(o);
                return;
              }
              s ? n.complete() : n.next(i);
            },
            0,
            !0
          );
      }),
      () => pe(r?.return) && r.return()
    );
  });
}
function Ia(t, e) {
  if (!t) throw new Error("Iterable cannot be null");
  return new Ae((n) => {
    wt(n, e, () => {
      let r = t[Symbol.asyncIterator]();
      wt(
        n,
        e,
        () => {
          r.next().then((i) => {
            i.done ? n.complete() : n.next(i.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function Im(t, e) {
  return Ia(_a(t), e);
}
function Mm(t, e) {
  if (t != null) {
    if (va(t)) return _m(t, e);
    if (ga(t)) return Sm(t, e);
    if (ya(t)) return Tm(t, e);
    if (Ea(t)) return Ia(t, e);
    if (Da(t)) return Cm(t, e);
    if (Ta(t)) return Im(t, e);
  }
  throw ba(t);
}
function Ye(t, e) {
  return e ? Mm(t, e) : et(t);
}
function de(...t) {
  let e = tr(t);
  return Ye(t, e);
}
function Ei(t, e) {
  let n = pe(t) ? t : () => t,
    r = (i) => i.error(n());
  return new Ae(e ? (i) => e.schedule(r, 0, i) : r);
}
function Mu(t) {
  return !!t && (t instanceof Ae || (pe(t.lift) && pe(t.subscribe)));
}
var An = fi(
  (t) =>
    function () {
      t(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    }
);
function Ee(t, e) {
  return Me((n, r) => {
    let i = 0;
    n.subscribe(
      Ce(r, (s) => {
        r.next(t.call(e, s, i++));
      })
    );
  });
}
var { isArray: Kw } = Array;
function Qw(t, e) {
  return Kw(e) ? t(...e) : t(e);
}
function Ma(t) {
  return Ee((e) => Qw(t, e));
}
var { isArray: Yw } = Array,
  { getPrototypeOf: Zw, prototype: Xw, keys: Jw } = Object;
function Na(t) {
  if (t.length === 1) {
    let e = t[0];
    if (Yw(e)) return { args: e, keys: null };
    if (eD(e)) {
      let n = Jw(e);
      return { args: n.map((r) => e[r]), keys: n };
    }
  }
  return { args: t, keys: null };
}
function eD(t) {
  return t && typeof t == "object" && Zw(t) === Xw;
}
function Aa(t, e) {
  return t.reduce((n, r, i) => ((n[r] = e[i]), n), {});
}
function xa(...t) {
  let e = tr(t),
    n = ma(t),
    { args: r, keys: i } = Na(t);
  if (r.length === 0) return Ye([], e);
  let s = new Ae(tD(r, e, i ? (o) => Aa(i, o) : Mt));
  return n ? s.pipe(Ma(n)) : s;
}
function tD(t, e, n = Mt) {
  return (r) => {
    Nm(
      e,
      () => {
        let { length: i } = t,
          s = new Array(i),
          o = i,
          a = i;
        for (let c = 0; c < i; c++)
          Nm(
            e,
            () => {
              let l = Ye(t[c], e),
                u = !1;
              l.subscribe(
                Ce(
                  r,
                  (d) => {
                    (s[c] = d), u || ((u = !0), a--), a || r.next(n(s.slice()));
                  },
                  () => {
                    --o || r.complete();
                  }
                )
              );
            },
            r
          );
      },
      r
    );
  };
}
function Nm(t, e, n) {
  t ? wt(n, t, e) : e();
}
function Am(t, e, n, r, i, s, o, a) {
  let c = [],
    l = 0,
    u = 0,
    d = !1,
    m = () => {
      d && !c.length && !l && e.complete();
    },
    b = (N) => (l < r ? I(N) : c.push(N)),
    I = (N) => {
      s && e.next(N), l++;
      let F = !1;
      et(n(N, u++)).subscribe(
        Ce(
          e,
          (x) => {
            i?.(x), s ? b(x) : e.next(x);
          },
          () => {
            F = !0;
          },
          void 0,
          () => {
            if (F)
              try {
                for (l--; c.length && l < r; ) {
                  let x = c.shift();
                  o ? wt(e, o, () => I(x)) : I(x);
                }
                m();
              } catch (x) {
                e.error(x);
              }
          }
        )
      );
    };
  return (
    t.subscribe(
      Ce(e, b, () => {
        (d = !0), m();
      })
    ),
    () => {
      a?.();
    }
  );
}
function it(t, e, n = 1 / 0) {
  return pe(e)
    ? it((r, i) => Ee((s, o) => e(r, s, i, o))(et(t(r, i))), n)
    : (typeof e == "number" && (n = e), Me((r, i) => Am(r, i, t, n)));
}
function Nu(t = 1 / 0) {
  return it(Mt, t);
}
function xm() {
  return Nu(1);
}
function bi(...t) {
  return xm()(Ye(t, tr(t)));
}
function Ra(t) {
  return new Ae((e) => {
    et(t()).subscribe(e);
  });
}
function nD(...t) {
  let e = ma(t),
    { args: n, keys: r } = Na(t),
    i = new Ae((s) => {
      let { length: o } = n;
      if (!o) {
        s.complete();
        return;
      }
      let a = new Array(o),
        c = o,
        l = o;
      for (let u = 0; u < o; u++) {
        let d = !1;
        et(n[u]).subscribe(
          Ce(
            s,
            (m) => {
              d || ((d = !0), l--), (a[u] = m);
            },
            () => c--,
            void 0,
            () => {
              (!c || !d) && (l || s.next(r ? Aa(r, a) : a), s.complete());
            }
          )
        );
      }
    });
  return e ? i.pipe(Ma(e)) : i;
}
function Nt(t, e) {
  return Me((n, r) => {
    let i = 0;
    n.subscribe(Ce(r, (s) => t.call(e, s, i++) && r.next(s)));
  });
}
function xn(t) {
  return Me((e, n) => {
    let r = null,
      i = !1,
      s;
    (r = e.subscribe(
      Ce(n, void 0, void 0, (o) => {
        (s = et(t(o, xn(t)(e)))),
          r ? (r.unsubscribe(), (r = null), s.subscribe(n)) : (i = !0);
      })
    )),
      i && (r.unsubscribe(), (r = null), s.subscribe(n));
  });
}
function Rm(t, e, n, r, i) {
  return (s, o) => {
    let a = n,
      c = e,
      l = 0;
    s.subscribe(
      Ce(
        o,
        (u) => {
          let d = l++;
          (c = a ? t(c, u, d) : ((a = !0), u)), r && o.next(c);
        },
        i &&
          (() => {
            a && o.next(c), o.complete();
          })
      )
    );
  };
}
function nr(t, e) {
  return pe(e) ? it(t, e, 1) : it(t, 1);
}
function rr(t) {
  return Me((e, n) => {
    let r = !1;
    e.subscribe(
      Ce(
        n,
        (i) => {
          (r = !0), n.next(i);
        },
        () => {
          r || n.next(t), n.complete();
        }
      )
    );
  });
}
function Rn(t) {
  return t <= 0
    ? () => $t
    : Me((e, n) => {
        let r = 0;
        e.subscribe(
          Ce(n, (i) => {
            ++r <= t && (n.next(i), t <= r && n.complete());
          })
        );
      });
}
function Au(t) {
  return Ee(() => t);
}
function Oa(t = rD) {
  return Me((e, n) => {
    let r = !1;
    e.subscribe(
      Ce(
        n,
        (i) => {
          (r = !0), n.next(i);
        },
        () => (r ? n.complete() : n.error(t()))
      )
    );
  });
}
function rD() {
  return new An();
}
function Pr(t) {
  return Me((e, n) => {
    try {
      e.subscribe(n);
    } finally {
      n.add(t);
    }
  });
}
function Xt(t, e) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      t ? Nt((i, s) => t(i, s, r)) : Mt,
      Rn(1),
      n ? rr(e) : Oa(() => new An())
    );
}
function wi(t) {
  return t <= 0
    ? () => $t
    : Me((e, n) => {
        let r = [];
        e.subscribe(
          Ce(
            n,
            (i) => {
              r.push(i), t < r.length && r.shift();
            },
            () => {
              for (let i of r) n.next(i);
              n.complete();
            },
            void 0,
            () => {
              r = null;
            }
          )
        );
      });
}
function xu(t, e) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      t ? Nt((i, s) => t(i, s, r)) : Mt,
      wi(1),
      n ? rr(e) : Oa(() => new An())
    );
}
function Ru(t, e) {
  return Me(Rm(t, e, arguments.length >= 2, !0));
}
function Ou(...t) {
  let e = tr(t);
  return Me((n, r) => {
    (e ? bi(t, n, e) : bi(t, n)).subscribe(r);
  });
}
function At(t, e) {
  return Me((n, r) => {
    let i = null,
      s = 0,
      o = !1,
      a = () => o && !i && r.complete();
    n.subscribe(
      Ce(
        r,
        (c) => {
          i?.unsubscribe();
          let l = 0,
            u = s++;
          et(t(c, u)).subscribe(
            (i = Ce(
              r,
              (d) => r.next(e ? e(c, d, u, l++) : d),
              () => {
                (i = null), a();
              }
            ))
          );
        },
        () => {
          (o = !0), a();
        }
      )
    );
  });
}
function ku(t) {
  return Me((e, n) => {
    et(t).subscribe(Ce(n, () => n.complete(), ys)), !n.closed && e.subscribe(n);
  });
}
function tt(t, e, n) {
  let r = pe(t) || e || n ? { next: t, error: e, complete: n } : t;
  return r
    ? Me((i, s) => {
        var o;
        (o = r.subscribe) === null || o === void 0 || o.call(r);
        let a = !0;
        i.subscribe(
          Ce(
            s,
            (c) => {
              var l;
              (l = r.next) === null || l === void 0 || l.call(r, c), s.next(c);
            },
            () => {
              var c;
              (a = !1),
                (c = r.complete) === null || c === void 0 || c.call(r),
                s.complete();
            },
            (c) => {
              var l;
              (a = !1),
                (l = r.error) === null || l === void 0 || l.call(r, c),
                s.error(c);
            },
            () => {
              var c, l;
              a && ((c = r.unsubscribe) === null || c === void 0 || c.call(r)),
                (l = r.finalize) === null || l === void 0 || l.call(r);
            }
          )
        );
      })
    : Mt;
}
var wg = "https://g.co/ng/security#xss",
  z = class extends Error {
    constructor(e, n) {
      super(Ec(e, n)), (this.code = e);
    }
  };
function Ec(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ": " + e : ""}`;
}
function He(t) {
  for (let e in t) if (t[e] === He) return e;
  throw Error("Could not find renamed property on target object.");
}
function iD(t, e) {
  for (let n in e) e.hasOwnProperty(n) && !t.hasOwnProperty(n) && (t[n] = e[n]);
}
function Dt(t) {
  if (typeof t == "string") return t;
  if (Array.isArray(t)) return "[" + t.map(Dt).join(", ") + "]";
  if (t == null) return "" + t;
  if (t.overriddenName) return `${t.overriddenName}`;
  if (t.name) return `${t.name}`;
  let e = t.toString();
  if (e == null) return "" + e;
  let n = e.indexOf(`
`);
  return n === -1 ? e : e.substring(0, n);
}
function Om(t, e) {
  return t == null || t === ""
    ? e === null
      ? ""
      : e
    : e == null || e === ""
    ? t
    : t + " " + e;
}
var sD = He({ __forward_ref__: He });
function Dg(t) {
  return (
    (t.__forward_ref__ = Dg),
    (t.toString = function () {
      return Dt(this());
    }),
    t
  );
}
function gt(t) {
  return _g(t) ? t() : t;
}
function _g(t) {
  return (
    typeof t == "function" && t.hasOwnProperty(sD) && t.__forward_ref__ === Dg
  );
}
function Tg(t) {
  return t && !!t.ɵproviders;
}
var oD = He({ ɵcmp: He }),
  aD = He({ ɵdir: He }),
  cD = He({ ɵpipe: He }),
  lD = He({ ɵmod: He }),
  Ga = He({ ɵfac: He }),
  vs = He({ __NG_ELEMENT_ID__: He }),
  km = He({ __NG_ENV_ID__: He });
function bc(t) {
  return typeof t == "string" ? t : t == null ? "" : String(t);
}
function uD(t) {
  return typeof t == "function"
    ? t.name || t.toString()
    : typeof t == "object" && t != null && typeof t.type == "function"
    ? t.type.name || t.type.toString()
    : bc(t);
}
function dD(t, e) {
  let n = e ? `. Dependency path: ${e.join(" > ")} > ${t}` : "";
  throw new z(-200, t);
}
function Bd(t, e) {
  throw new z(-201, !1);
}
function te(t) {
  return {
    token: t.token,
    providedIn: t.providedIn || null,
    factory: t.factory,
    value: void 0,
  };
}
function zr(t) {
  return { providers: t.providers || [], imports: t.imports || [] };
}
function wc(t) {
  return Lm(t, Cg) || Lm(t, Ig);
}
function Sg(t) {
  return wc(t) !== null;
}
function Lm(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null;
}
function fD(t) {
  let e = t && (t[Cg] || t[Ig]);
  return e || null;
}
function Pm(t) {
  return t && (t.hasOwnProperty(Fm) || t.hasOwnProperty(hD)) ? t[Fm] : null;
}
var Cg = He({ ɵprov: He }),
  Fm = He({ ɵinj: He }),
  Ig = He({ ngInjectableDef: He }),
  hD = He({ ngInjectorDef: He }),
  we = (function (t) {
    return (
      (t[(t.Default = 0)] = "Default"),
      (t[(t.Host = 1)] = "Host"),
      (t[(t.Self = 2)] = "Self"),
      (t[(t.SkipSelf = 4)] = "SkipSelf"),
      (t[(t.Optional = 8)] = "Optional"),
      t
    );
  })(we || {}),
  Zu;
function pD() {
  return Zu;
}
function qt(t) {
  let e = Zu;
  return (Zu = t), e;
}
function Mg(t, e, n) {
  let r = wc(t);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & we.Optional) return null;
  if (e !== void 0) return e;
  Bd(t, "Injector");
}
var Ci = globalThis;
var ae = class {
  constructor(e, n) {
    (this._desc = e),
      (this.ngMetadataName = "InjectionToken"),
      (this.ɵprov = void 0),
      typeof n == "number"
        ? (this.__NG_ELEMENT_ID__ = n)
        : n !== void 0 &&
          (this.ɵprov = te({
            token: this,
            providedIn: n.providedIn || "root",
            factory: n.factory,
          }));
  }
  get multi() {
    return this;
  }
  toString() {
    return `InjectionToken ${this._desc}`;
  }
};
var mD = {},
  _s = mD,
  Xu = "__NG_DI_FLAG__",
  Wa = "ngTempTokenPath",
  gD = "ngTokenPath",
  yD = /\n/gm,
  vD = "\u0275",
  jm = "__source",
  Es;
function ir(t) {
  let e = Es;
  return (Es = t), e;
}
function ED(t, e = we.Default) {
  if (Es === void 0) throw new z(-203, !1);
  return Es === null
    ? Mg(t, void 0, e)
    : Es.get(t, e & we.Optional ? null : void 0, e);
}
function se(t, e = we.Default) {
  return (pD() || ED)(gt(t), e);
}
function G(t, e = we.Default) {
  return se(t, Dc(e));
}
function Dc(t) {
  return typeof t > "u" || typeof t == "number"
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4);
}
function Ju(t) {
  let e = [];
  for (let n = 0; n < t.length; n++) {
    let r = gt(t[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new z(900, !1);
      let i,
        s = we.Default;
      for (let o = 0; o < r.length; o++) {
        let a = r[o],
          c = bD(a);
        typeof c == "number" ? (c === -1 ? (i = a.token) : (s |= c)) : (i = a);
      }
      e.push(se(i, s));
    } else e.push(se(r));
  }
  return e;
}
function Ng(t, e) {
  return (t[Xu] = e), (t.prototype[Xu] = e), t;
}
function bD(t) {
  return t[Xu];
}
function wD(t, e, n, r) {
  let i = t[Wa];
  throw (
    (e[jm] && i.unshift(e[jm]),
    (t.message = DD(
      `
` + t.message,
      i,
      n,
      r
    )),
    (t[gD] = i),
    (t[Wa] = null),
    t)
  );
}
function DD(t, e, n, r = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == vD
      ? t.slice(2)
      : t;
  let i = Dt(e);
  if (Array.isArray(e)) i = e.map(Dt).join(" -> ");
  else if (typeof e == "object") {
    let s = [];
    for (let o in e)
      if (e.hasOwnProperty(o)) {
        let a = e[o];
        s.push(o + ":" + (typeof a == "string" ? JSON.stringify(a) : Dt(a)));
      }
    i = `{${s.join(", ")}}`;
  }
  return `${n}${r ? "(" + r + ")" : ""}[${i}]: ${t.replace(
    yD,
    `
  `
  )}`;
}
function Us(t) {
  return { toString: t }.toString();
}
var Ag = (function (t) {
    return (t[(t.OnPush = 0)] = "OnPush"), (t[(t.Default = 1)] = "Default"), t;
  })(Ag || {}),
  tn = (function (t) {
    return (
      (t[(t.Emulated = 0)] = "Emulated"),
      (t[(t.None = 2)] = "None"),
      (t[(t.ShadowDom = 3)] = "ShadowDom"),
      t
    );
  })(tn || {}),
  Mi = {},
  xt = [],
  or = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.SignalBased = 1)] = "SignalBased"),
      (t[(t.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      t
    );
  })(or || {});
function xg(t, e, n) {
  let r = t.length;
  for (;;) {
    let i = t.indexOf(e, n);
    if (i === -1) return i;
    if (i === 0 || t.charCodeAt(i - 1) <= 32) {
      let s = e.length;
      if (i + s === r || t.charCodeAt(i + s) <= 32) return i;
    }
    n = i + 1;
  }
}
function ed(t, e, n) {
  let r = 0;
  for (; r < n.length; ) {
    let i = n[r];
    if (typeof i == "number") {
      if (i !== 0) break;
      r++;
      let s = n[r++],
        o = n[r++],
        a = n[r++];
      t.setAttribute(e, o, a, s);
    } else {
      let s = i,
        o = n[++r];
      TD(s) ? t.setProperty(e, s, o) : t.setAttribute(e, s, o), r++;
    }
  }
  return r;
}
function _D(t) {
  return t === 3 || t === 4 || t === 6;
}
function TD(t) {
  return t.charCodeAt(0) === 64;
}
function Ts(t, e) {
  if (!(e === null || e.length === 0))
    if (t === null || t.length === 0) t = e.slice();
    else {
      let n = -1;
      for (let r = 0; r < e.length; r++) {
        let i = e[r];
        typeof i == "number"
          ? (n = i)
          : n === 0 ||
            (n === -1 || n === 2
              ? Hm(t, n, i, null, e[++r])
              : Hm(t, n, i, null, null));
      }
    }
  return t;
}
function Hm(t, e, n, r, i) {
  let s = 0,
    o = t.length;
  if (e === -1) o = -1;
  else
    for (; s < t.length; ) {
      let a = t[s++];
      if (typeof a == "number") {
        if (a === e) {
          o = -1;
          break;
        } else if (a > e) {
          o = s - 1;
          break;
        }
      }
    }
  for (; s < t.length; ) {
    let a = t[s];
    if (typeof a == "number") break;
    if (a === n) {
      if (r === null) {
        i !== null && (t[s + 1] = i);
        return;
      } else if (r === t[s + 1]) {
        t[s + 2] = i;
        return;
      }
    }
    s++, r !== null && s++, i !== null && s++;
  }
  o !== -1 && (t.splice(o, 0, e), (s = o + 1)),
    t.splice(s++, 0, n),
    r !== null && t.splice(s++, 0, r),
    i !== null && t.splice(s++, 0, i);
}
var Rg = "ng-template";
function SD(t, e, n) {
  let r = 0,
    i = !0;
  for (; r < t.length; ) {
    let s = t[r++];
    if (typeof s == "string" && i) {
      let o = t[r++];
      if (n && s === "class" && xg(o.toLowerCase(), e, 0) !== -1) return !0;
    } else if (s === 1) {
      for (; r < t.length && typeof (s = t[r++]) == "string"; )
        if (s.toLowerCase() === e) return !0;
      return !1;
    } else typeof s == "number" && (i = !1);
  }
  return !1;
}
function Og(t) {
  return t.type === 4 && t.value !== Rg;
}
function CD(t, e, n) {
  let r = t.type === 4 && !n ? Rg : t.value;
  return e === r;
}
function ID(t, e, n) {
  let r = 4,
    i = t.attrs || [],
    s = AD(i),
    o = !1;
  for (let a = 0; a < e.length; a++) {
    let c = e[a];
    if (typeof c == "number") {
      if (!o && !Jt(r) && !Jt(c)) return !1;
      if (o && Jt(c)) continue;
      (o = !1), (r = c | (r & 1));
      continue;
    }
    if (!o)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (c !== "" && !CD(t, c, n)) || (c === "" && e.length === 1))
        ) {
          if (Jt(r)) return !1;
          o = !0;
        }
      } else {
        let l = r & 8 ? c : e[++a];
        if (r & 8 && t.attrs !== null) {
          if (!SD(t.attrs, l, n)) {
            if (Jt(r)) return !1;
            o = !0;
          }
          continue;
        }
        let u = r & 8 ? "class" : c,
          d = MD(u, i, Og(t), n);
        if (d === -1) {
          if (Jt(r)) return !1;
          o = !0;
          continue;
        }
        if (l !== "") {
          let m;
          d > s ? (m = "") : (m = i[d + 1].toLowerCase());
          let b = r & 8 ? m : null;
          if ((b && xg(b, l, 0) !== -1) || (r & 2 && l !== m)) {
            if (Jt(r)) return !1;
            o = !0;
          }
        }
      }
  }
  return Jt(r) || o;
}
function Jt(t) {
  return (t & 1) === 0;
}
function MD(t, e, n, r) {
  if (e === null) return -1;
  let i = 0;
  if (r || !n) {
    let s = !1;
    for (; i < e.length; ) {
      let o = e[i];
      if (o === t) return i;
      if (o === 3 || o === 6) s = !0;
      else if (o === 1 || o === 2) {
        let a = e[++i];
        for (; typeof a == "string"; ) a = e[++i];
        continue;
      } else {
        if (o === 4) break;
        if (o === 0) {
          i += 4;
          continue;
        }
      }
      i += s ? 1 : 2;
    }
    return -1;
  } else return xD(e, t);
}
function ND(t, e, n = !1) {
  for (let r = 0; r < e.length; r++) if (ID(t, e[r], n)) return !0;
  return !1;
}
function AD(t) {
  for (let e = 0; e < t.length; e++) {
    let n = t[e];
    if (_D(n)) return e;
  }
  return t.length;
}
function xD(t, e) {
  let n = t.indexOf(4);
  if (n > -1)
    for (n++; n < t.length; ) {
      let r = t[n];
      if (typeof r == "number") return -1;
      if (r === e) return n;
      n++;
    }
  return -1;
}
function Bm(t, e) {
  return t ? ":not(" + e.trim() + ")" : e;
}
function RD(t) {
  let e = t[0],
    n = 1,
    r = 2,
    i = "",
    s = !1;
  for (; n < t.length; ) {
    let o = t[n];
    if (typeof o == "string")
      if (r & 2) {
        let a = t[++n];
        i += "[" + o + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else r & 8 ? (i += "." + o) : r & 4 && (i += " " + o);
    else
      i !== "" && !Jt(o) && ((e += Bm(s, i)), (i = "")),
        (r = o),
        (s = s || !Jt(r));
    n++;
  }
  return i !== "" && (e += Bm(s, i)), e;
}
function OD(t) {
  return t.map(RD).join(",");
}
function kD(t) {
  let e = [],
    n = [],
    r = 1,
    i = 2;
  for (; r < t.length; ) {
    let s = t[r];
    if (typeof s == "string")
      i === 2 ? s !== "" && e.push(s, t[++r]) : i === 8 && n.push(s);
    else {
      if (!Jt(i)) break;
      i = s;
    }
    r++;
  }
  return { attrs: e, classes: n };
}
function kg(t) {
  return Us(() => {
    let e = Hg(t),
      n = Je(J({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === Ag.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || tn.Emulated,
        styles: t.styles || xt,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: "",
      });
    Bg(n);
    let r = t.dependencies;
    return (
      (n.directiveDefs = Vm(r, !1)), (n.pipeDefs = Vm(r, !0)), (n.id = FD(n)), n
    );
  });
}
function LD(t) {
  return ar(t) || Lg(t);
}
function PD(t) {
  return t !== null;
}
function Gr(t) {
  return Us(() => ({
    type: t.type,
    bootstrap: t.bootstrap || xt,
    declarations: t.declarations || xt,
    imports: t.imports || xt,
    exports: t.exports || xt,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }));
}
function Um(t, e) {
  if (t == null) return Mi;
  let n = {};
  for (let r in t)
    if (t.hasOwnProperty(r)) {
      let i = t[r],
        s,
        o,
        a = or.None;
      Array.isArray(i)
        ? ((a = i[0]), (s = i[1]), (o = i[2] ?? s))
        : ((s = i), (o = i)),
        e ? ((n[s] = a !== or.None ? [r, a] : r), (e[s] = o)) : (n[s] = r);
    }
  return n;
}
function Wr(t) {
  return Us(() => {
    let e = Hg(t);
    return Bg(e), e;
  });
}
function ar(t) {
  return t[oD] || null;
}
function Lg(t) {
  return t[aD] || null;
}
function Pg(t) {
  return t[cD] || null;
}
function Fg(t) {
  let e = ar(t) || Lg(t) || Pg(t);
  return e !== null ? e.standalone : !1;
}
function jg(t, e) {
  let n = t[lD] || null;
  if (!n && e === !0)
    throw new Error(`Type ${Dt(t)} does not have '\u0275mod' property.`);
  return n;
}
function Hg(t) {
  let e = {};
  return {
    type: t.type,
    providersResolver: null,
    factory: null,
    hostBindings: t.hostBindings || null,
    hostVars: t.hostVars || 0,
    hostAttrs: t.hostAttrs || null,
    contentQueries: t.contentQueries || null,
    declaredInputs: e,
    inputTransforms: null,
    inputConfig: t.inputs || Mi,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || xt,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: Um(t.inputs, e),
    outputs: Um(t.outputs),
    debugInfo: null,
  };
}
function Bg(t) {
  t.features?.forEach((e) => e(t));
}
function Vm(t, e) {
  if (!t) return null;
  let n = e ? Pg : LD;
  return () => (typeof t == "function" ? t() : t).map((r) => n(r)).filter(PD);
}
function FD(t) {
  let e = 0,
    n = [
      t.selectors,
      t.ngContentSelectors,
      t.hostVars,
      t.hostAttrs,
      t.consts,
      t.vars,
      t.decls,
      t.encapsulation,
      t.standalone,
      t.signals,
      t.exportAs,
      JSON.stringify(t.inputs),
      JSON.stringify(t.outputs),
      Object.getOwnPropertyNames(t.type.prototype),
      !!t.contentQueries,
      !!t.viewQuery,
    ].join("|");
  for (let i of n) e = (Math.imul(31, e) + i.charCodeAt(0)) << 0;
  return (e += 2147483648), "c" + e;
}
var Ze = 0,
  ye = 1,
  ue = 2,
  at = 3,
  en = 4,
  rn = 5,
  kn = 6,
  Ss = 7,
  nn = 8,
  Ni = 9,
  Ln = 10,
  qe = 11,
  Cs = 12,
  $m = 13,
  Fi = 14,
  Rt = 15,
  _c = 16,
  Di = 17,
  Is = 18,
  Tc = 19,
  Ug = 20,
  bs = 21,
  Lu = 22,
  jr = 23,
  nt = 25,
  Ud = 1,
  Ms = 6,
  Pn = 7,
  Ka = 8,
  Qa = 9,
  _t = 10,
  Vd = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      t
    );
  })(Vd || {});
function On(t) {
  return Array.isArray(t) && typeof t[Ud] == "object";
}
function Ot(t) {
  return Array.isArray(t) && t[Ud] === !0;
}
function $d(t) {
  return (t.flags & 4) !== 0;
}
function ji(t) {
  return t.componentOffset > -1;
}
function Sc(t) {
  return (t.flags & 1) === 1;
}
function cr(t) {
  return !!t.template;
}
function qd(t) {
  return (t[ue] & 512) !== 0;
}
function jD(t) {
  return (t.type & 16) === 16;
}
function HD(t) {
  return (t[ue] & 32) === 32;
}
function Ai(t, e) {
  let n = t.hasOwnProperty(Ga);
  return n ? t[Ga] : null;
}
var td = class {
  constructor(e, n, r) {
    (this.previousValue = e), (this.currentValue = n), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function Vg(t, e, n, r) {
  e !== null ? e.applyValueToInputSignal(e, r) : (t[n] = r);
}
function Cc() {
  return $g;
}
function $g(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = UD), BD;
}
Cc.ngInherit = !0;
function BD() {
  let t = zg(this),
    e = t?.current;
  if (e) {
    let n = t.previous;
    if (n === Mi) t.previous = e;
    else for (let r in e) n[r] = e[r];
    (t.current = null), this.ngOnChanges(e);
  }
}
function UD(t, e, n, r, i) {
  let s = this.declaredInputs[r],
    o = zg(t) || VD(t, { previous: Mi, current: null }),
    a = o.current || (o.current = {}),
    c = o.previous,
    l = c[s];
  (a[s] = new td(l && l.currentValue, n, c === Mi)), Vg(t, e, i, n);
}
var qg = "__ngSimpleChanges__";
function zg(t) {
  return t[qg] || null;
}
function VD(t, e) {
  return (t[qg] = e);
}
var qm = null;
var fn = function (t, e, n) {
    qm?.(t, e, n);
  },
  $D = "svg",
  qD = "math",
  zD = !1;
function GD() {
  return zD;
}
function st(t) {
  for (; Array.isArray(t); ) t = t[Ze];
  return t;
}
function Gg(t) {
  for (; Array.isArray(t); ) {
    if (typeof t[Ud] == "object") return t;
    t = t[Ze];
  }
  return null;
}
function Wg(t, e) {
  return st(e[t]);
}
function zt(t, e) {
  return st(e[t.index]);
}
function Kg(t, e) {
  return t.data[e];
}
function dr(t, e) {
  let n = e[t];
  return On(n) ? n : n[Ze];
}
function zd(t) {
  return (t[ue] & 128) === 128;
}
function WD(t) {
  return Ot(t[at]);
}
function xi(t, e) {
  return e == null ? null : t[e];
}
function Qg(t) {
  t[Di] = 0;
}
function KD(t) {
  t[ue] & 1024 || ((t[ue] |= 1024), zd(t) && Ns(t));
}
function QD(t, e) {
  for (; t > 0; ) (e = e[Fi]), t--;
  return e;
}
function Gd(t) {
  return !!(t[ue] & 9216 || t[jr]?.dirty);
}
function nd(t) {
  Gd(t)
    ? Ns(t)
    : t[ue] & 64 &&
      (GD()
        ? ((t[ue] |= 1024), Ns(t))
        : t[Ln].changeDetectionScheduler?.notify());
}
function Ns(t) {
  t[Ln].changeDetectionScheduler?.notify();
  let e = As(t);
  for (; e !== null && !(e[ue] & 8192 || ((e[ue] |= 8192), !zd(e))); )
    e = As(e);
}
function YD(t, e) {
  if ((t[ue] & 256) === 256) throw new z(911, !1);
  t[bs] === null && (t[bs] = []), t[bs].push(e);
}
function As(t) {
  let e = t[at];
  return Ot(e) ? e[at] : e;
}
var Ie = {
  lFrame: ry(null),
  bindingsEnabled: !0,
  skipHydrationRootTNode: null,
};
function ZD() {
  return Ie.lFrame.elementDepthCount;
}
function XD() {
  Ie.lFrame.elementDepthCount++;
}
function JD() {
  Ie.lFrame.elementDepthCount--;
}
function Yg() {
  return Ie.bindingsEnabled;
}
function Vs() {
  return Ie.skipHydrationRootTNode !== null;
}
function e_(t) {
  return Ie.skipHydrationRootTNode === t;
}
function t_(t) {
  Ie.skipHydrationRootTNode = t;
}
function n_() {
  Ie.skipHydrationRootTNode = null;
}
function Ke() {
  return Ie.lFrame.lView;
}
function kt() {
  return Ie.lFrame.tView;
}
function Lt() {
  let t = Zg();
  for (; t !== null && t.type === 64; ) t = t.parent;
  return t;
}
function Zg() {
  return Ie.lFrame.currentTNode;
}
function r_() {
  let t = Ie.lFrame,
    e = t.currentTNode;
  return t.isParent ? e : e.parent;
}
function Kr(t, e) {
  let n = Ie.lFrame;
  (n.currentTNode = t), (n.isParent = e);
}
function Wd() {
  return Ie.lFrame.isParent;
}
function Xg() {
  Ie.lFrame.isParent = !1;
}
function i_(t) {
  return (Ie.lFrame.bindingIndex = t);
}
function Jg() {
  return Ie.lFrame.bindingIndex++;
}
function s_(t) {
  let e = Ie.lFrame,
    n = e.bindingIndex;
  return (e.bindingIndex = e.bindingIndex + t), n;
}
function o_() {
  return Ie.lFrame.inI18n;
}
function a_(t, e) {
  let n = Ie.lFrame;
  (n.bindingIndex = n.bindingRootIndex = t), rd(e);
}
function c_() {
  return Ie.lFrame.currentDirectiveIndex;
}
function rd(t) {
  Ie.lFrame.currentDirectiveIndex = t;
}
function l_(t) {
  let e = Ie.lFrame.currentDirectiveIndex;
  return e === -1 ? null : t[e];
}
function ey(t) {
  Ie.lFrame.currentQueryIndex = t;
}
function u_(t) {
  let e = t[ye];
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[rn] : null;
}
function ty(t, e, n) {
  if (n & we.SkipSelf) {
    let i = e,
      s = t;
    for (; (i = i.parent), i === null && !(n & we.Host); )
      if (((i = u_(s)), i === null || ((s = s[Fi]), i.type & 10))) break;
    if (i === null) return !1;
    (e = i), (t = s);
  }
  let r = (Ie.lFrame = ny());
  return (r.currentTNode = e), (r.lView = t), !0;
}
function Kd(t) {
  let e = ny(),
    n = t[ye];
  (Ie.lFrame = e),
    (e.currentTNode = n.firstChild),
    (e.lView = t),
    (e.tView = n),
    (e.contextLView = t),
    (e.bindingIndex = n.bindingStartIndex),
    (e.inI18n = !1);
}
function ny() {
  let t = Ie.lFrame,
    e = t === null ? null : t.child;
  return e === null ? ry(t) : e;
}
function ry(t) {
  let e = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: t,
    child: null,
    inI18n: !1,
  };
  return t !== null && (t.child = e), e;
}
function iy() {
  let t = Ie.lFrame;
  return (Ie.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t;
}
var sy = iy;
function Qd() {
  let t = iy();
  (t.isParent = !0),
    (t.tView = null),
    (t.selectedIndex = -1),
    (t.contextLView = null),
    (t.elementDepthCount = 0),
    (t.currentDirectiveIndex = -1),
    (t.currentNamespace = null),
    (t.bindingRootIndex = -1),
    (t.bindingIndex = -1),
    (t.currentQueryIndex = 0);
}
function d_(t) {
  return (Ie.lFrame.contextLView = QD(t, Ie.lFrame.contextLView))[nn];
}
function Hi() {
  return Ie.lFrame.selectedIndex;
}
function Hr(t) {
  Ie.lFrame.selectedIndex = t;
}
function oy() {
  let t = Ie.lFrame;
  return Kg(t.tView, t.selectedIndex);
}
function ay() {
  return Ie.lFrame.currentNamespace;
}
var cy = !0;
function Ic() {
  return cy;
}
function fr(t) {
  cy = t;
}
function f_(t, e, n) {
  let { ngOnChanges: r, ngOnInit: i, ngDoCheck: s } = e.type.prototype;
  if (r) {
    let o = $g(e);
    (n.preOrderHooks ??= []).push(t, o),
      (n.preOrderCheckHooks ??= []).push(t, o);
  }
  i && (n.preOrderHooks ??= []).push(0 - t, i),
    s &&
      ((n.preOrderHooks ??= []).push(t, s),
      (n.preOrderCheckHooks ??= []).push(t, s));
}
function Mc(t, e) {
  for (let n = e.directiveStart, r = e.directiveEnd; n < r; n++) {
    let s = t.data[n].type.prototype,
      {
        ngAfterContentInit: o,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: l,
        ngOnDestroy: u,
      } = s;
    o && (t.contentHooks ??= []).push(-n, o),
      a &&
        ((t.contentHooks ??= []).push(n, a),
        (t.contentCheckHooks ??= []).push(n, a)),
      c && (t.viewHooks ??= []).push(-n, c),
      l &&
        ((t.viewHooks ??= []).push(n, l), (t.viewCheckHooks ??= []).push(n, l)),
      u != null && (t.destroyHooks ??= []).push(n, u);
  }
}
function Ba(t, e, n) {
  ly(t, e, 3, n);
}
function Ua(t, e, n, r) {
  (t[ue] & 3) === n && ly(t, e, n, r);
}
function Pu(t, e) {
  let n = t[ue];
  (n & 3) === e && ((n &= 16383), (n += 1), (t[ue] = n));
}
function ly(t, e, n, r) {
  let i = r !== void 0 ? t[Di] & 65535 : 0,
    s = r ?? -1,
    o = e.length - 1,
    a = 0;
  for (let c = i; c < o; c++)
    if (typeof e[c + 1] == "number") {
      if (((a = e[c]), r != null && a >= r)) break;
    } else
      e[c] < 0 && (t[Di] += 65536),
        (a < s || s == -1) &&
          (h_(t, n, e, c), (t[Di] = (t[Di] & 4294901760) + c + 2)),
        c++;
}
function zm(t, e) {
  fn(4, t, e);
  let n = It(null);
  try {
    e.call(t);
  } finally {
    It(n), fn(5, t, e);
  }
}
function h_(t, e, n, r) {
  let i = n[r] < 0,
    s = n[r + 1],
    o = i ? -n[r] : n[r],
    a = t[o];
  i
    ? t[ue] >> 14 < t[Di] >> 16 &&
      (t[ue] & 3) === e &&
      ((t[ue] += 16384), zm(a, s))
    : zm(a, s);
}
var Ii = -1,
  Br = class {
    constructor(e, n, r) {
      (this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r);
    }
  };
function p_(t) {
  return t instanceof Br;
}
function m_(t) {
  return (
    t != null &&
    typeof t == "object" &&
    (t.insertBeforeIndex === null ||
      typeof t.insertBeforeIndex == "number" ||
      Array.isArray(t.insertBeforeIndex))
  );
}
function g_(t) {
  return (t.flags & 8) !== 0;
}
function y_(t) {
  return (t.flags & 16) !== 0;
}
function uy(t) {
  return t !== Ii;
}
function Ya(t) {
  return t & 32767;
}
function v_(t) {
  return t >> 16;
}
function Za(t, e) {
  let n = v_(t),
    r = e;
  for (; n > 0; ) (r = r[Fi]), n--;
  return r;
}
var id = !0;
function Gm(t) {
  let e = id;
  return (id = t), e;
}
var E_ = 256,
  dy = E_ - 1,
  fy = 5,
  b_ = 0,
  hn = {};
function w_(t, e, n) {
  let r;
  typeof n == "string"
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(vs) && (r = n[vs]),
    r == null && (r = n[vs] = b_++);
  let i = r & dy,
    s = 1 << i;
  e.data[t + (i >> fy)] |= s;
}
function Xa(t, e) {
  let n = hy(t, e);
  if (n !== -1) return n;
  let r = e[ye];
  r.firstCreatePass &&
    ((t.injectorIndex = e.length),
    Fu(r.data, t),
    Fu(e, null),
    Fu(r.blueprint, null));
  let i = Yd(t, e),
    s = t.injectorIndex;
  if (uy(i)) {
    let o = Ya(i),
      a = Za(i, e),
      c = a[ye].data;
    for (let l = 0; l < 8; l++) e[s + l] = a[o + l] | c[o + l];
  }
  return (e[s + 8] = i), s;
}
function Fu(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
}
function hy(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex;
}
function Yd(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex;
  let n = 0,
    r = null,
    i = e;
  for (; i !== null; ) {
    if (((r = vy(i)), r === null)) return Ii;
    if ((n++, (i = i[Fi]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return Ii;
}
function sd(t, e, n) {
  w_(t, e, n);
}
function py(t, e, n) {
  if (n & we.Optional || t !== void 0) return t;
  Bd(e, "NodeInjector");
}
function my(t, e, n, r) {
  if (
    (n & we.Optional && r === void 0 && (r = null), !(n & (we.Self | we.Host)))
  ) {
    let i = t[Ni],
      s = qt(void 0);
    try {
      return i ? i.get(e, r, n & we.Optional) : Mg(e, r, n & we.Optional);
    } finally {
      qt(s);
    }
  }
  return py(r, e, n);
}
function gy(t, e, n, r = we.Default, i) {
  if (t !== null) {
    if (e[ue] & 2048 && !(r & we.Self)) {
      let o = C_(t, e, n, r, hn);
      if (o !== hn) return o;
    }
    let s = yy(t, e, n, r, hn);
    if (s !== hn) return s;
  }
  return my(e, n, r, i);
}
function yy(t, e, n, r, i) {
  let s = T_(n);
  if (typeof s == "function") {
    if (!ty(e, t, r)) return r & we.Host ? py(i, n, r) : my(e, n, r, i);
    try {
      let o;
      if (((o = s(r)), o == null && !(r & we.Optional))) Bd(n);
      else return o;
    } finally {
      sy();
    }
  } else if (typeof s == "number") {
    let o = null,
      a = hy(t, e),
      c = Ii,
      l = r & we.Host ? e[Rt][rn] : null;
    for (
      (a === -1 || r & we.SkipSelf) &&
      ((c = a === -1 ? Yd(t, e) : e[a + 8]),
      c === Ii || !Km(r, !1)
        ? (a = -1)
        : ((o = e[ye]), (a = Ya(c)), (e = Za(c, e))));
      a !== -1;

    ) {
      let u = e[ye];
      if (Wm(s, a, u.data)) {
        let d = D_(a, e, n, o, r, l);
        if (d !== hn) return d;
      }
      (c = e[a + 8]),
        c !== Ii && Km(r, e[ye].data[a + 8] === l) && Wm(s, a, e)
          ? ((o = u), (a = Ya(c)), (e = Za(c, e)))
          : (a = -1);
    }
  }
  return i;
}
function D_(t, e, n, r, i, s) {
  let o = e[ye],
    a = o.data[t + 8],
    c = r == null ? ji(a) && id : r != o && (a.type & 3) !== 0,
    l = i & we.Host && s === a,
    u = __(a, o, n, c, l);
  return u !== null ? Ri(e, o, u, a) : hn;
}
function __(t, e, n, r, i) {
  let s = t.providerIndexes,
    o = e.data,
    a = s & 1048575,
    c = t.directiveStart,
    l = t.directiveEnd,
    u = s >> 20,
    d = r ? a : a + u,
    m = i ? a + u : l;
  for (let b = d; b < m; b++) {
    let I = o[b];
    if ((b < c && n === I) || (b >= c && I.type === n)) return b;
  }
  if (i) {
    let b = o[c];
    if (b && cr(b) && b.type === n) return c;
  }
  return null;
}
function Ri(t, e, n, r) {
  let i = t[n],
    s = e.data;
  if (p_(i)) {
    let o = i;
    o.resolving && dD(uD(s[n]));
    let a = Gm(o.canSeeViewProviders);
    o.resolving = !0;
    let c,
      l = o.injectImpl ? qt(o.injectImpl) : null,
      u = ty(t, r, we.Default);
    try {
      (i = t[n] = o.factory(void 0, s, t, r)),
        e.firstCreatePass && n >= r.directiveStart && f_(n, s[n], e);
    } finally {
      l !== null && qt(l), Gm(a), (o.resolving = !1), sy();
    }
  }
  return i;
}
function T_(t) {
  if (typeof t == "string") return t.charCodeAt(0) || 0;
  let e = t.hasOwnProperty(vs) ? t[vs] : void 0;
  return typeof e == "number" ? (e >= 0 ? e & dy : S_) : e;
}
function Wm(t, e, n) {
  let r = 1 << t;
  return !!(n[e + (t >> fy)] & r);
}
function Km(t, e) {
  return !(t & we.Self) && !(t & we.Host && e);
}
var Fr = class {
  constructor(e, n) {
    (this._tNode = e), (this._lView = n);
  }
  get(e, n, r) {
    return gy(this._tNode, this._lView, e, Dc(r), n);
  }
};
function S_() {
  return new Fr(Lt(), Ke());
}
function Zd(t) {
  return Us(() => {
    let e = t.prototype.constructor,
      n = e[Ga] || od(e),
      r = Object.prototype,
      i = Object.getPrototypeOf(t.prototype).constructor;
    for (; i && i !== r; ) {
      let s = i[Ga] || od(i);
      if (s && s !== n) return s;
      i = Object.getPrototypeOf(i);
    }
    return (s) => new s();
  });
}
function od(t) {
  return _g(t)
    ? () => {
        let e = od(gt(t));
        return e && e();
      }
    : Ai(t);
}
function C_(t, e, n, r, i) {
  let s = t,
    o = e;
  for (; s !== null && o !== null && o[ue] & 2048 && !(o[ue] & 512); ) {
    let a = yy(s, o, n, r | we.Self, hn);
    if (a !== hn) return a;
    let c = s.parent;
    if (!c) {
      let l = o[Ug];
      if (l) {
        let u = l.get(n, hn, r);
        if (u !== hn) return u;
      }
      (c = vy(o)), (o = o[Fi]);
    }
    s = c;
  }
  return i;
}
function vy(t) {
  let e = t[ye],
    n = e.type;
  return n === 2 ? e.declTNode : n === 1 ? t[rn] : null;
}
var ka = "__parameters__";
function I_(t) {
  return function (...n) {
    if (t) {
      let r = t(...n);
      for (let i in r) this[i] = r[i];
    }
  };
}
function Ey(t, e, n) {
  return Us(() => {
    let r = I_(e);
    function i(...s) {
      if (this instanceof i) return r.apply(this, s), this;
      let o = new i(...s);
      return (a.annotation = o), a;
      function a(c, l, u) {
        let d = c.hasOwnProperty(ka)
          ? c[ka]
          : Object.defineProperty(c, ka, { value: [] })[ka];
        for (; d.length <= u; ) d.push(null);
        return (d[u] = d[u] || []).push(o), c;
      }
    }
    return (
      n && (i.prototype = Object.create(n.prototype)),
      (i.prototype.ngMetadataName = t),
      (i.annotationCls = i),
      i
    );
  });
}
function M_(t) {
  let e = Ci.ng;
  if (e && e.ɵcompilerFacade) return e.ɵcompilerFacade;
  throw new Error("JIT compiler unavailable");
}
function N_(t) {
  return typeof t == "function";
}
function Xd(t, e) {
  t.forEach((n) => (Array.isArray(n) ? Xd(n, e) : e(n)));
}
function by(t, e, n) {
  e >= t.length ? t.push(n) : t.splice(e, 0, n);
}
function Ja(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
}
function A_(t, e, n, r) {
  let i = t.length;
  if (i == e) t.push(n, r);
  else if (i === 1) t.push(r, t[0]), (t[0] = n);
  else {
    for (i--, t.push(t[i - 1], t[i]); i > e; ) {
      let s = i - 2;
      (t[i] = t[s]), i--;
    }
    (t[e] = n), (t[e + 1] = r);
  }
}
function x_(t, e, n) {
  let r = $s(t, e);
  return r >= 0 ? (t[r | 1] = n) : ((r = ~r), A_(t, r, e, n)), r;
}
function ju(t, e) {
  let n = $s(t, e);
  if (n >= 0) return t[n | 1];
}
function $s(t, e) {
  return R_(t, e, 1);
}
function R_(t, e, n) {
  let r = 0,
    i = t.length >> n;
  for (; i !== r; ) {
    let s = r + ((i - r) >> 1),
      o = t[s << n];
    if (e === o) return s << n;
    o > e ? (i = s) : (r = s + 1);
  }
  return ~(i << n);
}
var qs = Ng(Ey("Optional"), 8);
var wy = Ng(Ey("SkipSelf"), 4);
function O_(t) {
  let e = [],
    n = new Map();
  function r(i) {
    let s = n.get(i);
    if (!s) {
      let o = t(i);
      n.set(i, (s = o.then(F_)));
    }
    return s;
  }
  return (
    ec.forEach((i, s) => {
      let o = [];
      i.templateUrl &&
        o.push(
          r(i.templateUrl).then((l) => {
            i.template = l;
          })
        );
      let a = typeof i.styles == "string" ? [i.styles] : i.styles || [];
      if (((i.styles = a), i.styleUrl && i.styleUrls?.length))
        throw new Error(
          "@Component cannot define both `styleUrl` and `styleUrls`. Use `styleUrl` if the component has one stylesheet, or `styleUrls` if it has multiple"
        );
      if (i.styleUrls?.length) {
        let l = i.styles.length,
          u = i.styleUrls;
        i.styleUrls.forEach((d, m) => {
          a.push(""),
            o.push(
              r(d).then((b) => {
                (a[l + m] = b),
                  u.splice(u.indexOf(d), 1),
                  u.length == 0 && (i.styleUrls = void 0);
              })
            );
        });
      } else
        i.styleUrl &&
          o.push(
            r(i.styleUrl).then((l) => {
              a.push(l), (i.styleUrl = void 0);
            })
          );
      let c = Promise.all(o).then(() => j_(s));
      e.push(c);
    }),
    L_(),
    Promise.all(e).then(() => {})
  );
}
var ec = new Map(),
  k_ = new Set();
function L_() {
  let t = ec;
  return (ec = new Map()), t;
}
function P_() {
  return ec.size === 0;
}
function F_(t) {
  return typeof t == "string" ? t : t.text();
}
function j_(t) {
  k_.delete(t);
}
var Ur = new ae(""),
  Dy = new ae("", -1),
  _y = new ae(""),
  tc = class {
    get(e, n = _s) {
      if (n === _s) {
        let r = new Error(`NullInjectorError: No provider for ${Dt(e)}!`);
        throw ((r.name = "NullInjectorError"), r);
      }
      return n;
    }
  };
function mn(t) {
  return { ɵproviders: t };
}
function H_(...t) {
  return { ɵproviders: Ty(!0, t), ɵfromNgModule: !0 };
}
function Ty(t, ...e) {
  let n = [],
    r = new Set(),
    i,
    s = (o) => {
      n.push(o);
    };
  return (
    Xd(e, (o) => {
      let a = o;
      ad(a, s, [], r) && ((i ||= []), i.push(a));
    }),
    i !== void 0 && Sy(i, s),
    n
  );
}
function Sy(t, e) {
  for (let n = 0; n < t.length; n++) {
    let { ngModule: r, providers: i } = t[n];
    Jd(i, (s) => {
      e(s, r);
    });
  }
}
function ad(t, e, n, r) {
  if (((t = gt(t)), !t)) return !1;
  let i = null,
    s = Pm(t),
    o = !s && ar(t);
  if (!s && !o) {
    let c = t.ngModule;
    if (((s = Pm(c)), s)) i = c;
    else return !1;
  } else {
    if (o && !o.standalone) return !1;
    i = t;
  }
  let a = r.has(i);
  if (o) {
    if (a) return !1;
    if ((r.add(i), o.dependencies)) {
      let c =
        typeof o.dependencies == "function" ? o.dependencies() : o.dependencies;
      for (let l of c) ad(l, e, n, r);
    }
  } else if (s) {
    if (s.imports != null && !a) {
      r.add(i);
      let l;
      try {
        Xd(s.imports, (u) => {
          ad(u, e, n, r) && ((l ||= []), l.push(u));
        });
      } finally {
      }
      l !== void 0 && Sy(l, e);
    }
    if (!a) {
      let l = Ai(i) || (() => new i());
      e({ provide: i, useFactory: l, deps: xt }, i),
        e({ provide: _y, useValue: i, multi: !0 }, i),
        e({ provide: Ur, useValue: () => se(i), multi: !0 }, i);
    }
    let c = s.providers;
    if (c != null && !a) {
      let l = t;
      Jd(c, (u) => {
        e(u, l);
      });
    }
  } else return !1;
  return i !== t && t.providers !== void 0;
}
function Jd(t, e) {
  for (let n of t)
    Tg(n) && (n = n.ɵproviders), Array.isArray(n) ? Jd(n, e) : e(n);
}
var B_ = He({ provide: String, useValue: He });
function Cy(t) {
  return t !== null && typeof t == "object" && B_ in t;
}
function U_(t) {
  return !!(t && t.useExisting);
}
function V_(t) {
  return !!(t && t.useFactory);
}
function Oi(t) {
  return typeof t == "function";
}
function $_(t) {
  return !!t.useClass;
}
var Nc = new ae(""),
  Va = {},
  q_ = {},
  Hu;
function ef() {
  return Hu === void 0 && (Hu = new tc()), Hu;
}
var Tt = class {},
  xs = class extends Tt {
    get destroyed() {
      return this._destroyed;
    }
    constructor(e, n, r, i) {
      super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = i),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        ld(e, (o) => this.processProvider(o)),
        this.records.set(Dy, _i(void 0, this)),
        i.has("environment") && this.records.set(Tt, _i(void 0, this));
      let s = this.records.get(Nc);
      s != null && typeof s.value == "string" && this.scopes.add(s.value),
        (this.injectorDefTypes = new Set(this.get(_y, xt, we.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      try {
        for (let n of this._ngOnDestroyHooks) n.ngOnDestroy();
        let e = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let n of e) n();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear();
      }
    }
    onDestroy(e) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(e),
        () => this.removeOnDestroy(e)
      );
    }
    runInContext(e) {
      this.assertNotDestroyed();
      let n = ir(this),
        r = qt(void 0),
        i;
      try {
        return e();
      } finally {
        ir(n), qt(r);
      }
    }
    get(e, n = _s, r = we.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(km))) return e[km](this);
      r = Dc(r);
      let i,
        s = ir(this),
        o = qt(void 0);
      try {
        if (!(r & we.SkipSelf)) {
          let c = this.records.get(e);
          if (c === void 0) {
            let l = Q_(e) && wc(e);
            l && this.injectableDefInScope(l)
              ? (c = _i(cd(e), Va))
              : (c = null),
              this.records.set(e, c);
          }
          if (c != null) return this.hydrate(e, c);
        }
        let a = r & we.Self ? ef() : this.parent;
        return (n = r & we.Optional && n === _s ? null : n), a.get(e, n);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[Wa] = a[Wa] || []).unshift(Dt(e)), s)) throw a;
          return wD(a, e, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        qt(o), ir(s);
      }
    }
    resolveInjectorInitializers() {
      let e = ir(this),
        n = qt(void 0),
        r;
      try {
        let i = this.get(Ur, xt, we.Self);
        for (let s of i) s();
      } finally {
        ir(e), qt(n);
      }
    }
    toString() {
      let e = [],
        n = this.records;
      for (let r of n.keys()) e.push(Dt(r));
      return `R3Injector[${e.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new z(205, !1);
    }
    processProvider(e) {
      e = gt(e);
      let n = Oi(e) ? e : gt(e && e.provide),
        r = G_(e);
      if (!Oi(e) && e.multi === !0) {
        let i = this.records.get(n);
        i ||
          ((i = _i(void 0, Va, !0)),
          (i.factory = () => Ju(i.multi)),
          this.records.set(n, i)),
          (n = e),
          i.multi.push(e);
      }
      this.records.set(n, r);
    }
    hydrate(e, n) {
      return (
        n.value === Va && ((n.value = q_), (n.value = n.factory())),
        typeof n.value == "object" &&
          n.value &&
          K_(n.value) &&
          this._ngOnDestroyHooks.add(n.value),
        n.value
      );
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1;
      let n = gt(e.providedIn);
      return typeof n == "string"
        ? n === "any" || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(e) {
      let n = this._onDestroyHooks.indexOf(e);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function cd(t) {
  let e = wc(t),
    n = e !== null ? e.factory : Ai(t);
  if (n !== null) return n;
  if (t instanceof ae) throw new z(204, !1);
  if (t instanceof Function) return z_(t);
  throw new z(204, !1);
}
function z_(t) {
  if (t.length > 0) throw new z(204, !1);
  let n = fD(t);
  return n !== null ? () => n.factory(t) : () => new t();
}
function G_(t) {
  if (Cy(t)) return _i(void 0, t.useValue);
  {
    let e = Iy(t);
    return _i(e, Va);
  }
}
function Iy(t, e, n) {
  let r;
  if (Oi(t)) {
    let i = gt(t);
    return Ai(i) || cd(i);
  } else if (Cy(t)) r = () => gt(t.useValue);
  else if (V_(t)) r = () => t.useFactory(...Ju(t.deps || []));
  else if (U_(t)) r = () => se(gt(t.useExisting));
  else {
    let i = gt(t && (t.useClass || t.provide));
    if (W_(t)) r = () => new i(...Ju(t.deps));
    else return Ai(i) || cd(i);
  }
  return r;
}
function _i(t, e, n = !1) {
  return { factory: t, value: e, multi: n ? [] : void 0 };
}
function W_(t) {
  return !!t.deps;
}
function K_(t) {
  return (
    t !== null && typeof t == "object" && typeof t.ngOnDestroy == "function"
  );
}
function Q_(t) {
  return typeof t == "function" || (typeof t == "object" && t instanceof ae);
}
function ld(t, e) {
  for (let n of t)
    Array.isArray(n) ? ld(n, e) : n && Tg(n) ? ld(n.ɵproviders, e) : e(n);
}
function jn(t, e) {
  t instanceof xs && t.assertNotDestroyed();
  let n,
    r = ir(t),
    i = qt(void 0);
  try {
    return e();
  } finally {
    ir(r), qt(i);
  }
}
function Qm(t, e = null, n = null, r) {
  let i = My(t, e, n, r);
  return i.resolveInjectorInitializers(), i;
}
function My(t, e = null, n = null, r, i = new Set()) {
  let s = [n || xt, H_(t)];
  return (
    (r = r || (typeof t == "object" ? void 0 : Dt(t))),
    new xs(s, e || ef(), r || null, i)
  );
}
var sn = (() => {
  let e = class e {
    static create(r, i) {
      if (Array.isArray(r)) return Qm({ name: "" }, i, r, "");
      {
        let s = r.name ?? "";
        return Qm({ name: s }, r.parent, r.providers, s);
      }
    }
  };
  (e.THROW_IF_NOT_FOUND = _s),
    (e.NULL = new tc()),
    (e.ɵprov = te({ token: e, providedIn: "any", factory: () => se(Dy) })),
    (e.__NG_ELEMENT_ID__ = -1);
  let t = e;
  return t;
})();
var ud;
function Ac(t) {
  ud = t;
}
function xc() {
  if (ud !== void 0) return ud;
  if (typeof document < "u") return document;
  throw new z(210, !1);
}
var Bi = new ae("", { providedIn: "root", factory: () => Y_ }),
  Y_ = "ng",
  zs = new ae(""),
  Pt = new ae("", { providedIn: "platform", factory: () => "unknown" });
var tf = new ae(""),
  nf = new ae("", {
    providedIn: "root",
    factory: () =>
      xc().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
      null,
  });
function Z_(t) {
  return t.ownerDocument.body;
}
function Ny(t) {
  return t instanceof Function ? t() : t;
}
function La(t) {
  return (t ?? G(sn)).get(Pt) === "browser";
}
var Rs = "ngSkipHydration",
  X_ = "ngskiphydration";
function Ay(t) {
  let e = t.mergedAttrs;
  if (e === null) return !1;
  for (let n = 0; n < e.length; n += 2) {
    let r = e[n];
    if (typeof r == "number") return !1;
    if (typeof r == "string" && r.toLowerCase() === X_) return !0;
  }
  return !1;
}
function xy(t) {
  return t.hasAttribute(Rs);
}
function nc(t) {
  return (t.flags & 128) === 128;
}
function rc(t) {
  if (nc(t)) return !0;
  let e = t.parent;
  for (; e; ) {
    if (nc(t) || Ay(e)) return !0;
    e = e.parent;
  }
  return !1;
}
var Fn = (function (t) {
    return (
      (t[(t.Important = 1)] = "Important"),
      (t[(t.DashCase = 2)] = "DashCase"),
      t
    );
  })(Fn || {}),
  J_ = /^>|^->|<!--|-->|--!>|<!-$/g,
  eT = /(<|>)/g,
  tT = "\u200B$1\u200B";
function nT(t) {
  return t.replace(J_, (e) => e.replace(eT, tT));
}
var Ry = new Map(),
  rT = 0;
function iT() {
  return rT++;
}
function sT(t) {
  Ry.set(t[Tc], t);
}
function oT(t) {
  Ry.delete(t[Tc]);
}
var Ym = "__ngContext__";
function lr(t, e) {
  On(e) ? ((t[Ym] = e[Tc]), sT(e)) : (t[Ym] = e);
}
var aT;
function rf(t, e) {
  return aT(t, e);
}
function Ti(t, e, n, r, i) {
  if (r != null) {
    let s,
      o = !1;
    Ot(r) ? (s = r) : On(r) && ((o = !0), (r = r[Ze]));
    let a = st(r);
    t === 0 && n !== null
      ? i == null
        ? Hy(e, n, a)
        : ic(e, n, a, i || null, !0)
      : t === 1 && n !== null
      ? ic(e, n, a, i || null, !0)
      : t === 2
      ? Uy(e, a, o)
      : t === 3 && e.destroyNode(a),
      s != null && _T(e, t, s, n, i);
  }
}
function Oy(t, e) {
  return t.createText(e);
}
function cT(t, e, n) {
  t.setValue(e, n);
}
function ky(t, e) {
  return t.createComment(nT(e));
}
function sf(t, e, n) {
  return t.createElement(e, n);
}
function lT(t, e) {
  Ly(t, e), (e[Ze] = null), (e[rn] = null);
}
function uT(t, e, n, r, i, s) {
  (r[Ze] = i), (r[rn] = e), Oc(t, r, n, 1, i, s);
}
function Ly(t, e) {
  Oc(t, e, e[qe], 2, null, null);
}
function dT(t) {
  let e = t[Cs];
  if (!e) return Bu(t[ye], t);
  for (; e; ) {
    let n = null;
    if (On(e)) n = e[Cs];
    else {
      let r = e[_t];
      r && (n = r);
    }
    if (!n) {
      for (; e && !e[en] && e !== t; ) On(e) && Bu(e[ye], e), (e = e[at]);
      e === null && (e = t), On(e) && Bu(e[ye], e), (n = e && e[en]);
    }
    e = n;
  }
}
function fT(t, e, n, r) {
  let i = _t + r,
    s = n.length;
  r > 0 && (n[i - 1][en] = e),
    r < s - _t
      ? ((e[en] = n[i]), by(n, _t + r, e))
      : (n.push(e), (e[en] = null)),
    (e[at] = n);
  let o = e[_c];
  o !== null && n !== o && hT(o, e);
  let a = e[Is];
  a !== null && a.insertView(t), nd(e), (e[ue] |= 128);
}
function hT(t, e) {
  let n = t[Qa],
    i = e[at][at][Rt];
  e[Rt] !== i && (t[ue] |= Vd.HasTransplantedViews),
    n === null ? (t[Qa] = [e]) : n.push(e);
}
function Py(t, e) {
  let n = t[Qa],
    r = n.indexOf(e);
  n.splice(r, 1);
}
function dd(t, e) {
  if (t.length <= _t) return;
  let n = _t + e,
    r = t[n];
  if (r) {
    let i = r[_c];
    i !== null && i !== t && Py(i, r), e > 0 && (t[n - 1][en] = r[en]);
    let s = Ja(t, _t + e);
    lT(r[ye], r);
    let o = s[Is];
    o !== null && o.detachView(s[ye]),
      (r[at] = null),
      (r[en] = null),
      (r[ue] &= -129);
  }
  return r;
}
function Fy(t, e) {
  if (!(e[ue] & 256)) {
    let n = e[qe];
    n.destroyNode && Oc(t, e, n, 3, null, null), dT(e);
  }
}
function Bu(t, e) {
  if (!(e[ue] & 256)) {
    (e[ue] &= -129),
      (e[ue] |= 256),
      e[jr] && am(e[jr]),
      mT(t, e),
      pT(t, e),
      e[ye].type === 1 && e[qe].destroy();
    let n = e[_c];
    if (n !== null && Ot(e[at])) {
      n !== e[at] && Py(n, e);
      let r = e[Is];
      r !== null && r.detachView(t);
    }
    oT(e);
  }
}
function pT(t, e) {
  let n = t.cleanup,
    r = e[Ss];
  if (n !== null)
    for (let s = 0; s < n.length - 1; s += 2)
      if (typeof n[s] == "string") {
        let o = n[s + 3];
        o >= 0 ? r[o]() : r[-o].unsubscribe(), (s += 2);
      } else {
        let o = r[n[s + 1]];
        n[s].call(o);
      }
  r !== null && (e[Ss] = null);
  let i = e[bs];
  if (i !== null) {
    e[bs] = null;
    for (let s = 0; s < i.length; s++) {
      let o = i[s];
      o();
    }
  }
}
function mT(t, e) {
  let n;
  if (t != null && (n = t.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let i = e[n[r]];
      if (!(i instanceof Br)) {
        let s = n[r + 1];
        if (Array.isArray(s))
          for (let o = 0; o < s.length; o += 2) {
            let a = i[s[o]],
              c = s[o + 1];
            fn(4, a, c);
            try {
              c.call(a);
            } finally {
              fn(5, a, c);
            }
          }
        else {
          fn(4, i, s);
          try {
            s.call(i);
          } finally {
            fn(5, i, s);
          }
        }
      }
    }
}
function jy(t, e, n) {
  return gT(t, e.parent, n);
}
function gT(t, e, n) {
  let r = e;
  for (; r !== null && r.type & 40; ) (e = r), (r = e.parent);
  if (r === null) return n[Ze];
  {
    let { componentOffset: i } = r;
    if (i > -1) {
      let { encapsulation: s } = t.data[r.directiveStart + i];
      if (s === tn.None || s === tn.Emulated) return null;
    }
    return zt(r, n);
  }
}
function ic(t, e, n, r, i) {
  t.insertBefore(e, n, r, i);
}
function Hy(t, e, n) {
  t.appendChild(e, n);
}
function Zm(t, e, n, r, i) {
  r !== null ? ic(t, e, n, r, i) : Hy(t, e, n);
}
function yT(t, e, n, r) {
  t.removeChild(e, n, r);
}
function of(t, e) {
  return t.parentNode(e);
}
function vT(t, e) {
  return t.nextSibling(e);
}
function ET(t, e, n) {
  return wT(t, e, n);
}
function bT(t, e, n) {
  return t.type & 40 ? zt(t, n) : null;
}
var wT = bT,
  Xm;
function Rc(t, e, n, r) {
  let i = jy(t, r, e),
    s = e[qe],
    o = r.parent || e[rn],
    a = ET(o, r, e);
  if (i != null)
    if (Array.isArray(n))
      for (let c = 0; c < n.length; c++) Zm(s, i, n[c], a, !1);
    else Zm(s, i, n, a, !1);
  Xm !== void 0 && Xm(s, r, e, n, i);
}
function ws(t, e) {
  if (e !== null) {
    let n = e.type;
    if (n & 3) return zt(e, t);
    if (n & 4) return fd(-1, t[e.index]);
    if (n & 8) {
      let r = e.child;
      if (r !== null) return ws(t, r);
      {
        let i = t[e.index];
        return Ot(i) ? fd(-1, i) : st(i);
      }
    } else {
      if (n & 32) return rf(e, t)() || st(t[e.index]);
      {
        let r = By(t, e);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let i = As(t[Rt]);
          return ws(i, r);
        } else return ws(t, e.next);
      }
    }
  }
  return null;
}
function By(t, e) {
  if (e !== null) {
    let r = t[Rt][rn],
      i = e.projection;
    return r.projection[i];
  }
  return null;
}
function fd(t, e) {
  let n = _t + t + 1;
  if (n < e.length) {
    let r = e[n],
      i = r[ye].firstChild;
    if (i !== null) return ws(r, i);
  }
  return e[Pn];
}
function Uy(t, e, n) {
  let r = of(t, e);
  r && yT(t, r, e, n);
}
function Vy(t) {
  t.textContent = "";
}
function af(t, e, n, r, i, s, o) {
  for (; n != null; ) {
    let a = r[n.index],
      c = n.type;
    if (
      (o && e === 0 && (a && lr(st(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (c & 8) af(t, e, n.child, r, i, s, !1), Ti(e, t, i, a, s);
      else if (c & 32) {
        let l = rf(n, r),
          u;
        for (; (u = l()); ) Ti(e, t, i, u, s);
        Ti(e, t, i, a, s);
      } else c & 16 ? DT(t, e, r, n, i, s) : Ti(e, t, i, a, s);
    n = o ? n.projectionNext : n.next;
  }
}
function Oc(t, e, n, r, i, s) {
  af(n, r, t.firstChild, e, i, s, !1);
}
function DT(t, e, n, r, i, s) {
  let o = n[Rt],
    c = o[rn].projection[r.projection];
  if (Array.isArray(c))
    for (let l = 0; l < c.length; l++) {
      let u = c[l];
      Ti(e, t, i, u, s);
    }
  else {
    let l = c,
      u = o[at];
    nc(r) && (l.flags |= 128), af(t, e, l, u, i, s, !0);
  }
}
function _T(t, e, n, r, i) {
  let s = n[Pn],
    o = st(n);
  s !== o && Ti(e, t, r, s, i);
  for (let a = _t; a < n.length; a++) {
    let c = n[a];
    Oc(c[ye], c, t, e, r, s);
  }
}
function TT(t, e, n, r, i) {
  if (e) i ? t.addClass(n, r) : t.removeClass(n, r);
  else {
    let s = r.indexOf("-") === -1 ? void 0 : Fn.DashCase;
    i == null
      ? t.removeStyle(n, r, s)
      : (typeof i == "string" &&
          i.endsWith("!important") &&
          ((i = i.slice(0, -10)), (s |= Fn.Important)),
        t.setStyle(n, r, i, s));
  }
}
function ST(t, e, n) {
  t.setAttribute(e, "style", n);
}
function $y(t, e, n) {
  n === "" ? t.removeAttribute(e, "class") : t.setAttribute(e, "class", n);
}
function qy(t, e, n) {
  let { mergedAttrs: r, classes: i, styles: s } = n;
  r !== null && ed(t, e, r),
    i !== null && $y(t, e, i),
    s !== null && ST(t, e, s);
}
var sc = class {
  constructor(e) {
    this.changingThisBreaksApplicationSecurity = e;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${wg})`;
  }
};
function kc(t) {
  return t instanceof sc ? t.changingThisBreaksApplicationSecurity : t;
}
function zy(t, e) {
  let n = CT(t);
  if (n != null && n !== e) {
    if (n === "ResourceURL" && e === "URL") return !0;
    throw new Error(`Required a safe ${e}, got a ${n} (see ${wg})`);
  }
  return n === e;
}
function CT(t) {
  return (t instanceof sc && t.getTypeName()) || null;
}
var IT = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function Gy(t) {
  return (t = String(t)), t.match(IT) ? t : "unsafe:" + t;
}
var cf = (function (t) {
  return (
    (t[(t.NONE = 0)] = "NONE"),
    (t[(t.HTML = 1)] = "HTML"),
    (t[(t.STYLE = 2)] = "STYLE"),
    (t[(t.SCRIPT = 3)] = "SCRIPT"),
    (t[(t.URL = 4)] = "URL"),
    (t[(t.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    t
  );
})(cf || {});
function zP(t) {
  let e = MT();
  return e ? e.sanitize(cf.URL, t) || "" : zy(t, "URL") ? kc(t) : Gy(bc(t));
}
function MT() {
  let t = Ke();
  return t && t[Ln].sanitizer;
}
var Os = class {};
function NT() {
  let t = new gn();
  return G(Pt) === "browser" && (t.store = AT(xc(), G(Bi))), t;
}
var gn = (() => {
  let e = class e {
    constructor() {
      (this.store = {}), (this.onSerializeCallbacks = {});
    }
    get(r, i) {
      return this.store[r] !== void 0 ? this.store[r] : i;
    }
    set(r, i) {
      this.store[r] = i;
    }
    remove(r) {
      delete this.store[r];
    }
    hasKey(r) {
      return this.store.hasOwnProperty(r);
    }
    get isEmpty() {
      return Object.keys(this.store).length === 0;
    }
    onSerialize(r, i) {
      this.onSerializeCallbacks[r] = i;
    }
    toJson() {
      for (let r in this.onSerializeCallbacks)
        if (this.onSerializeCallbacks.hasOwnProperty(r))
          try {
            this.store[r] = this.onSerializeCallbacks[r]();
          } catch (i) {
            console.warn("Exception in onSerialize callback: ", i);
          }
      return JSON.stringify(this.store).replace(/</g, "\\u003C");
    }
  };
  e.ɵprov = te({ token: e, providedIn: "root", factory: NT });
  let t = e;
  return t;
})();
function AT(t, e) {
  let n = t.getElementById(e + "-state");
  if (n?.textContent)
    try {
      return JSON.parse(n.textContent);
    } catch (r) {
      console.warn("Exception while restoring TransferState for app " + e, r);
    }
  return {};
}
var lf = "h",
  uf = "b",
  ks = (function (t) {
    return (t.FirstChild = "f"), (t.NextSibling = "n"), t;
  })(ks || {}),
  hd = "e",
  pd = "t",
  Ls = "c",
  oc = "x",
  ki = "r",
  md = "i",
  gd = "n",
  $a = "d",
  xT = "__nghData__",
  df = xT,
  Ds = "ngh",
  ff = "nghm",
  Wy = () => null;
function RT(t, e, n = !1) {
  let r = t.getAttribute(Ds);
  if (r == null) return null;
  let [i, s] = r.split("|");
  if (((r = n ? s : i), !r)) return null;
  let o = s ? `|${s}` : "",
    a = n ? i : o,
    c = {};
  if (r !== "") {
    let u = e.get(gn, null, { optional: !0 });
    u !== null && (c = u.get(df, [])[Number(r)]);
  }
  let l = { data: c, firstChild: t.firstChild ?? null };
  return (
    n && ((l.firstChild = t), Lc(l, 0, t.nextSibling)),
    a ? t.setAttribute(Ds, a) : t.removeAttribute(Ds),
    l
  );
}
function OT() {
  Wy = RT;
}
function hf(t, e, n = !1) {
  return Wy(t, e, n);
}
function Ky(t) {
  let e = t._lView;
  return e[ye].type === 2 ? null : (qd(e) && (e = e[nt]), e);
}
function kT(t) {
  return t.textContent?.replace(/\s/gm, "");
}
function LT(t) {
  let e = xc(),
    n = e.createNodeIterator(t, NodeFilter.SHOW_COMMENT, {
      acceptNode(s) {
        let o = kT(s);
        return o === "ngetn" || o === "ngtns"
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }),
    r,
    i = [];
  for (; (r = n.nextNode()); ) i.push(r);
  for (let s of i)
    s.textContent === "ngetn"
      ? s.replaceWith(e.createTextNode(""))
      : s.remove();
}
function Lc(t, e, n) {
  (t.segmentHeads ??= {}), (t.segmentHeads[e] = n);
}
function yd(t, e) {
  return t.segmentHeads?.[e] ?? null;
}
function PT(t, e) {
  let n = t.data,
    r = n[hd]?.[e] ?? null;
  return r === null && n[Ls]?.[e] && (r = pf(t, e)), r;
}
function Qy(t, e) {
  return t.data[Ls]?.[e] ?? null;
}
function pf(t, e) {
  let n = Qy(t, e) ?? [],
    r = 0;
  for (let i of n) r += i[ki] * (i[oc] ?? 1);
  return r;
}
function Pc(t, e) {
  if (typeof t.disconnectedNodes > "u") {
    let n = t.data[$a];
    t.disconnectedNodes = n ? new Set(n) : null;
  }
  return !!t.disconnectedNodes?.has(e);
}
var vd = class {},
  ac = class {};
function FT(t) {
  let e = Error(`No component factory found for ${Dt(t)}.`);
  return (e[jT] = t), e;
}
var jT = "ngComponent";
var Ed = class {
    resolveComponentFactory(e) {
      throw FT(e);
    }
  },
  Fc = (() => {
    let e = class e {};
    e.NULL = new Ed();
    let t = e;
    return t;
  })();
function HT() {
  return jc(Lt(), Ke());
}
function jc(t, e) {
  return new Hc(zt(t, e));
}
var Hc = (() => {
  let e = class e {
    constructor(r) {
      this.nativeElement = r;
    }
  };
  e.__NG_ELEMENT_ID__ = HT;
  let t = e;
  return t;
})();
var Vr = class {},
  Gs = (() => {
    let e = class e {
      constructor() {
        this.destroyNode = null;
      }
    };
    e.__NG_ELEMENT_ID__ = () => BT();
    let t = e;
    return t;
  })();
function BT() {
  let t = Ke(),
    e = Lt(),
    n = dr(e.index, t);
  return (On(n) ? n : t)[qe];
}
var UT = (() => {
    let e = class e {};
    e.ɵprov = te({ token: e, providedIn: "root", factory: () => null });
    let t = e;
    return t;
  })(),
  Uu = {};
function Yy(t) {
  return $T(t)
    ? Array.isArray(t) || (!(t instanceof Map) && Symbol.iterator in t)
    : !1;
}
function VT(t, e) {
  if (Array.isArray(t)) for (let n = 0; n < t.length; n++) e(t[n]);
  else {
    let n = t[Symbol.iterator](),
      r;
    for (; !(r = n.next()).done; ) e(r.value);
  }
}
function $T(t) {
  return t !== null && (typeof t == "function" || typeof t == "object");
}
var bd = class {
    constructor() {}
    supports(e) {
      return Yy(e);
    }
    create(e) {
      return new wd(e);
    }
  },
  qT = (t, e) => e,
  wd = class {
    constructor(e) {
      (this.length = 0),
        (this._linkedRecords = null),
        (this._unlinkedRecords = null),
        (this._previousItHead = null),
        (this._itHead = null),
        (this._itTail = null),
        (this._additionsHead = null),
        (this._additionsTail = null),
        (this._movesHead = null),
        (this._movesTail = null),
        (this._removalsHead = null),
        (this._removalsTail = null),
        (this._identityChangesHead = null),
        (this._identityChangesTail = null),
        (this._trackByFn = e || qT);
    }
    forEachItem(e) {
      let n;
      for (n = this._itHead; n !== null; n = n._next) e(n);
    }
    forEachOperation(e) {
      let n = this._itHead,
        r = this._removalsHead,
        i = 0,
        s = null;
      for (; n || r; ) {
        let o = !r || (n && n.currentIndex < Jm(r, i, s)) ? n : r,
          a = Jm(o, i, s),
          c = o.currentIndex;
        if (o === r) i--, (r = r._nextRemoved);
        else if (((n = n._next), o.previousIndex == null)) i++;
        else {
          s || (s = []);
          let l = a - i,
            u = c - i;
          if (l != u) {
            for (let m = 0; m < l; m++) {
              let b = m < s.length ? s[m] : (s[m] = 0),
                I = b + m;
              u <= I && I < l && (s[m] = b + 1);
            }
            let d = o.previousIndex;
            s[d] = u - l;
          }
        }
        a !== c && e(o, a, c);
      }
    }
    forEachPreviousItem(e) {
      let n;
      for (n = this._previousItHead; n !== null; n = n._nextPrevious) e(n);
    }
    forEachAddedItem(e) {
      let n;
      for (n = this._additionsHead; n !== null; n = n._nextAdded) e(n);
    }
    forEachMovedItem(e) {
      let n;
      for (n = this._movesHead; n !== null; n = n._nextMoved) e(n);
    }
    forEachRemovedItem(e) {
      let n;
      for (n = this._removalsHead; n !== null; n = n._nextRemoved) e(n);
    }
    forEachIdentityChange(e) {
      let n;
      for (n = this._identityChangesHead; n !== null; n = n._nextIdentityChange)
        e(n);
    }
    diff(e) {
      if ((e == null && (e = []), !Yy(e))) throw new z(900, !1);
      return this.check(e) ? this : null;
    }
    onDestroy() {}
    check(e) {
      this._reset();
      let n = this._itHead,
        r = !1,
        i,
        s,
        o;
      if (Array.isArray(e)) {
        this.length = e.length;
        for (let a = 0; a < this.length; a++)
          (s = e[a]),
            (o = this._trackByFn(a, s)),
            n === null || !Object.is(n.trackById, o)
              ? ((n = this._mismatch(n, s, o, a)), (r = !0))
              : (r && (n = this._verifyReinsertion(n, s, o, a)),
                Object.is(n.item, s) || this._addIdentityChange(n, s)),
            (n = n._next);
      } else
        (i = 0),
          VT(e, (a) => {
            (o = this._trackByFn(i, a)),
              n === null || !Object.is(n.trackById, o)
                ? ((n = this._mismatch(n, a, o, i)), (r = !0))
                : (r && (n = this._verifyReinsertion(n, a, o, i)),
                  Object.is(n.item, a) || this._addIdentityChange(n, a)),
              (n = n._next),
              i++;
          }),
          (this.length = i);
      return this._truncate(n), (this.collection = e), this.isDirty;
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      );
    }
    _reset() {
      if (this.isDirty) {
        let e;
        for (e = this._previousItHead = this._itHead; e !== null; e = e._next)
          e._nextPrevious = e._next;
        for (e = this._additionsHead; e !== null; e = e._nextAdded)
          e.previousIndex = e.currentIndex;
        for (
          this._additionsHead = this._additionsTail = null, e = this._movesHead;
          e !== null;
          e = e._nextMoved
        )
          e.previousIndex = e.currentIndex;
        (this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null);
      }
    }
    _mismatch(e, n, r, i) {
      let s;
      return (
        e === null ? (s = this._itTail) : ((s = e._prev), this._remove(e)),
        (e =
          this._unlinkedRecords === null
            ? null
            : this._unlinkedRecords.get(r, null)),
        e !== null
          ? (Object.is(e.item, n) || this._addIdentityChange(e, n),
            this._reinsertAfter(e, s, i))
          : ((e =
              this._linkedRecords === null
                ? null
                : this._linkedRecords.get(r, i)),
            e !== null
              ? (Object.is(e.item, n) || this._addIdentityChange(e, n),
                this._moveAfter(e, s, i))
              : (e = this._addAfter(new Dd(n, r), s, i))),
        e
      );
    }
    _verifyReinsertion(e, n, r, i) {
      let s =
        this._unlinkedRecords === null
          ? null
          : this._unlinkedRecords.get(r, null);
      return (
        s !== null
          ? (e = this._reinsertAfter(s, e._prev, i))
          : e.currentIndex != i &&
            ((e.currentIndex = i), this._addToMoves(e, i)),
        e
      );
    }
    _truncate(e) {
      for (; e !== null; ) {
        let n = e._next;
        this._addToRemovals(this._unlink(e)), (e = n);
      }
      this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null);
    }
    _reinsertAfter(e, n, r) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(e);
      let i = e._prevRemoved,
        s = e._nextRemoved;
      return (
        i === null ? (this._removalsHead = s) : (i._nextRemoved = s),
        s === null ? (this._removalsTail = i) : (s._prevRemoved = i),
        this._insertAfter(e, n, r),
        this._addToMoves(e, r),
        e
      );
    }
    _moveAfter(e, n, r) {
      return (
        this._unlink(e), this._insertAfter(e, n, r), this._addToMoves(e, r), e
      );
    }
    _addAfter(e, n, r) {
      return (
        this._insertAfter(e, n, r),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = e)
          : (this._additionsTail = this._additionsTail._nextAdded = e),
        e
      );
    }
    _insertAfter(e, n, r) {
      let i = n === null ? this._itHead : n._next;
      return (
        (e._next = i),
        (e._prev = n),
        i === null ? (this._itTail = e) : (i._prev = e),
        n === null ? (this._itHead = e) : (n._next = e),
        this._linkedRecords === null && (this._linkedRecords = new cc()),
        this._linkedRecords.put(e),
        (e.currentIndex = r),
        e
      );
    }
    _remove(e) {
      return this._addToRemovals(this._unlink(e));
    }
    _unlink(e) {
      this._linkedRecords !== null && this._linkedRecords.remove(e);
      let n = e._prev,
        r = e._next;
      return (
        n === null ? (this._itHead = r) : (n._next = r),
        r === null ? (this._itTail = n) : (r._prev = n),
        e
      );
    }
    _addToMoves(e, n) {
      return (
        e.previousIndex === n ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = e)
            : (this._movesTail = this._movesTail._nextMoved = e)),
        e
      );
    }
    _addToRemovals(e) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new cc()),
        this._unlinkedRecords.put(e),
        (e.currentIndex = null),
        (e._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = e),
            (e._prevRemoved = null))
          : ((e._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = e)),
        e
      );
    }
    _addIdentityChange(e, n) {
      return (
        (e.item = n),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = e)
          : (this._identityChangesTail =
              this._identityChangesTail._nextIdentityChange =
                e),
        e
      );
    }
  },
  Dd = class {
    constructor(e, n) {
      (this.item = e),
        (this.trackById = n),
        (this.currentIndex = null),
        (this.previousIndex = null),
        (this._nextPrevious = null),
        (this._prev = null),
        (this._next = null),
        (this._prevDup = null),
        (this._nextDup = null),
        (this._prevRemoved = null),
        (this._nextRemoved = null),
        (this._nextAdded = null),
        (this._nextMoved = null),
        (this._nextIdentityChange = null);
    }
  },
  _d = class {
    constructor() {
      (this._head = null), (this._tail = null);
    }
    add(e) {
      this._head === null
        ? ((this._head = this._tail = e),
          (e._nextDup = null),
          (e._prevDup = null))
        : ((this._tail._nextDup = e),
          (e._prevDup = this._tail),
          (e._nextDup = null),
          (this._tail = e));
    }
    get(e, n) {
      let r;
      for (r = this._head; r !== null; r = r._nextDup)
        if ((n === null || n <= r.currentIndex) && Object.is(r.trackById, e))
          return r;
      return null;
    }
    remove(e) {
      let n = e._prevDup,
        r = e._nextDup;
      return (
        n === null ? (this._head = r) : (n._nextDup = r),
        r === null ? (this._tail = n) : (r._prevDup = n),
        this._head === null
      );
    }
  },
  cc = class {
    constructor() {
      this.map = new Map();
    }
    put(e) {
      let n = e.trackById,
        r = this.map.get(n);
      r || ((r = new _d()), this.map.set(n, r)), r.add(e);
    }
    get(e, n) {
      let r = e,
        i = this.map.get(r);
      return i ? i.get(e, n) : null;
    }
    remove(e) {
      let n = e.trackById;
      return this.map.get(n).remove(e) && this.map.delete(n), e;
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function Jm(t, e, n) {
  let r = t.previousIndex;
  if (r === null) return r;
  let i = 0;
  return n && r < n.length && (i = n[r]), r + e + i;
}
function eg() {
  return new mf([new bd()]);
}
var mf = (() => {
  let e = class e {
    constructor(r) {
      this.factories = r;
    }
    static create(r, i) {
      if (i != null) {
        let s = i.factories.slice();
        r = r.concat(s);
      }
      return new e(r);
    }
    static extend(r) {
      return {
        provide: e,
        useFactory: (i) => e.create(r, i || eg()),
        deps: [[e, new wy(), new qs()]],
      };
    }
    find(r) {
      let i = this.factories.find((s) => s.supports(r));
      if (i != null) return i;
      throw new z(901, !1);
    }
  };
  e.ɵprov = te({ token: e, providedIn: "root", factory: eg });
  let t = e;
  return t;
})();
function Ps(t, e, n, r, i = !1) {
  for (; n !== null; ) {
    let s = e[n.index];
    s !== null && r.push(st(s)), Ot(s) && Zy(s, r);
    let o = n.type;
    if (o & 8) Ps(t, e, n.child, r);
    else if (o & 32) {
      let a = rf(n, e),
        c;
      for (; (c = a()); ) r.push(c);
    } else if (o & 16) {
      let a = By(e, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let c = As(e[Rt]);
        Ps(c[ye], c, a, r, !0);
      }
    }
    n = i ? n.projectionNext : n.next;
  }
  return r;
}
function Zy(t, e) {
  for (let n = _t; n < t.length; n++) {
    let r = t[n],
      i = r[ye].firstChild;
    i !== null && Ps(r[ye], r, i, e);
  }
  t[Pn] !== t[Ze] && e.push(t[Pn]);
}
var Xy = [];
function zT(t) {
  return t[jr] ?? GT(t);
}
function GT(t) {
  let e = Xy.pop() ?? Object.create(KT);
  return (e.lView = t), e;
}
function WT(t) {
  t.lView[jr] !== t && ((t.lView = null), Xy.push(t));
}
var KT = Je(J({}, im), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (t) => {
    Ns(t.lView);
  },
  consumerOnSignalRead() {
    this.lView[jr] = this;
  },
});
function Jy(t) {
  return tv(t[Cs]);
}
function ev(t) {
  return tv(t[en]);
}
function tv(t) {
  for (; t !== null && !Ot(t); ) t = t[en];
  return t;
}
var QT = "ngOriginalError";
function Vu(t) {
  return t[QT];
}
var pn = class {
    constructor() {
      this._console = console;
    }
    handleError(e) {
      let n = this._findOriginalError(e);
      this._console.error("ERROR", e),
        n && this._console.error("ORIGINAL ERROR", n);
    }
    _findOriginalError(e) {
      let n = e && Vu(e);
      for (; n && Vu(n); ) n = Vu(n);
      return n || null;
    }
  },
  nv = new ae("", {
    providedIn: "root",
    factory: () => G(pn).handleError.bind(void 0),
  }),
  Si = new ae(""),
  rv = !1,
  iv = new ae("", { providedIn: "root", factory: () => rv });
var Qr = {};
function GP(t = 1) {
  sv(kt(), Ke(), Hi() + t, !1);
}
function sv(t, e, n, r) {
  if (!r)
    if ((e[ue] & 3) === 3) {
      let s = t.preOrderCheckHooks;
      s !== null && Ba(e, s, n);
    } else {
      let s = t.preOrderHooks;
      s !== null && Ua(e, s, 0, n);
    }
  Hr(n);
}
function St(t, e = we.Default) {
  let n = Ke();
  if (n === null) return se(t, e);
  let r = Lt();
  return gy(r, n, gt(t), e);
}
function ov(t, e, n, r, i, s) {
  let o = It(null);
  try {
    let a = null;
    i & or.SignalBased && (a = e[r][rm]),
      a !== null && a.transformFn !== void 0 && (s = a.transformFn(s)),
      i & or.HasDecoratorInputTransform &&
        (s = t.inputTransforms[r].call(e, s)),
      t.setInput !== null ? t.setInput(e, a, s, n, r) : Vg(e, a, r, s);
  } finally {
    It(o);
  }
}
function YT(t, e) {
  let n = t.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let i = n[r];
        if (i < 0) Hr(~i);
        else {
          let s = i,
            o = n[++r],
            a = n[++r];
          a_(o, s);
          let c = e[s];
          a(2, c);
        }
      }
    } finally {
      Hr(-1);
    }
}
function Bc(t, e, n, r, i, s, o, a, c, l, u) {
  let d = e.blueprint.slice();
  return (
    (d[Ze] = i),
    (d[ue] = r | 4 | 128 | 8 | 64),
    (l !== null || (t && t[ue] & 2048)) && (d[ue] |= 2048),
    Qg(d),
    (d[at] = d[Fi] = t),
    (d[nn] = n),
    (d[Ln] = o || (t && t[Ln])),
    (d[qe] = a || (t && t[qe])),
    (d[Ni] = c || (t && t[Ni]) || null),
    (d[rn] = s),
    (d[Tc] = iT()),
    (d[kn] = u),
    (d[Ug] = l),
    (d[Rt] = e.type == 2 ? t[Rt] : d),
    d
  );
}
function Ws(t, e, n, r, i) {
  let s = t.data[e];
  if (s === null) (s = ZT(t, e, n, r, i)), o_() && (s.flags |= 32);
  else if (s.type & 64) {
    (s.type = n), (s.value = r), (s.attrs = i);
    let o = r_();
    s.injectorIndex = o === null ? -1 : o.injectorIndex;
  }
  return Kr(s, !0), s;
}
function ZT(t, e, n, r, i) {
  let s = Zg(),
    o = Wd(),
    a = o ? s : s && s.parent,
    c = (t.data[e] = rS(t, a, n, e, r, i));
  return (
    t.firstChild === null && (t.firstChild = c),
    s !== null &&
      (o
        ? s.child == null && c.parent !== null && (s.child = c)
        : s.next === null && ((s.next = c), (c.prev = s))),
    c
  );
}
function av(t, e, n, r) {
  if (n === 0) return -1;
  let i = e.length;
  for (let s = 0; s < n; s++) e.push(r), t.blueprint.push(r), t.data.push(null);
  return i;
}
function cv(t, e, n, r, i) {
  let s = Hi(),
    o = r & 2;
  try {
    Hr(-1), o && e.length > nt && sv(t, e, nt, !1), fn(o ? 2 : 0, i), n(r, i);
  } finally {
    Hr(s), fn(o ? 3 : 1, i);
  }
}
function gf(t, e, n) {
  if ($d(e)) {
    let r = It(null);
    try {
      let i = e.directiveStart,
        s = e.directiveEnd;
      for (let o = i; o < s; o++) {
        let a = t.data[o];
        a.contentQueries && a.contentQueries(1, n[o], o);
      }
    } finally {
      It(r);
    }
  }
}
function yf(t, e, n) {
  Yg() && (lS(t, e, n, zt(n, e)), (n.flags & 64) === 64 && hv(t, e, n));
}
function vf(t, e, n = zt) {
  let r = e.localNames;
  if (r !== null) {
    let i = e.index + 1;
    for (let s = 0; s < r.length; s += 2) {
      let o = r[s + 1],
        a = o === -1 ? n(e, t) : t[o];
      t[i++] = a;
    }
  }
}
function lv(t) {
  let e = t.tView;
  return e === null || e.incompleteFirstPass
    ? (t.tView = Ef(
        1,
        null,
        t.template,
        t.decls,
        t.vars,
        t.directiveDefs,
        t.pipeDefs,
        t.viewQuery,
        t.schemas,
        t.consts,
        t.id
      ))
    : e;
}
function Ef(t, e, n, r, i, s, o, a, c, l, u) {
  let d = nt + r,
    m = d + i,
    b = XT(d, m),
    I = typeof l == "function" ? l() : l;
  return (b[ye] = {
    type: t,
    blueprint: b,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: e,
    data: b.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: m,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof s == "function" ? s() : s,
    pipeRegistry: typeof o == "function" ? o() : o,
    firstChild: null,
    schemas: c,
    consts: I,
    incompleteFirstPass: !1,
    ssrId: u,
  });
}
function XT(t, e) {
  let n = [];
  for (let r = 0; r < e; r++) n.push(r < t ? null : Qr);
  return n;
}
function JT(t, e, n, r) {
  let s = r.get(iv, rv) || n === tn.ShadowDom,
    o = t.selectRootElement(e, s);
  return eS(o), o;
}
function eS(t) {
  uv(t);
}
var uv = () => null;
function tS(t) {
  xy(t) ? Vy(t) : LT(t);
}
function nS() {
  uv = tS;
}
function rS(t, e, n, r, i, s) {
  let o = e ? e.injectorIndex : -1,
    a = 0;
  return (
    Vs() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: o,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: i,
      attrs: s,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: e,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function tg(t, e, n, r, i) {
  for (let s in e) {
    if (!e.hasOwnProperty(s)) continue;
    let o = e[s];
    if (o === void 0) continue;
    r ??= {};
    let a,
      c = or.None;
    Array.isArray(o) ? ((a = o[0]), (c = o[1])) : (a = o);
    let l = s;
    if (i !== null) {
      if (!i.hasOwnProperty(s)) continue;
      l = i[s];
    }
    t === 0 ? ng(r, n, l, a, c) : ng(r, n, l, a);
  }
  return r;
}
function ng(t, e, n, r, i) {
  let s;
  t.hasOwnProperty(n) ? (s = t[n]).push(e, r) : (s = t[n] = [e, r]),
    i !== void 0 && s.push(i);
}
function iS(t, e, n) {
  let r = e.directiveStart,
    i = e.directiveEnd,
    s = t.data,
    o = e.attrs,
    a = [],
    c = null,
    l = null;
  for (let u = r; u < i; u++) {
    let d = s[u],
      m = n ? n.get(d) : null,
      b = m ? m.inputs : null,
      I = m ? m.outputs : null;
    (c = tg(0, d.inputs, u, c, b)), (l = tg(1, d.outputs, u, l, I));
    let N = c !== null && o !== null && !Og(e) ? vS(c, u, o) : null;
    a.push(N);
  }
  c !== null &&
    (c.hasOwnProperty("class") && (e.flags |= 8),
    c.hasOwnProperty("style") && (e.flags |= 16)),
    (e.initialInputs = a),
    (e.inputs = c),
    (e.outputs = l);
}
function sS(t) {
  return t === "class"
    ? "className"
    : t === "for"
    ? "htmlFor"
    : t === "formaction"
    ? "formAction"
    : t === "innerHtml"
    ? "innerHTML"
    : t === "readonly"
    ? "readOnly"
    : t === "tabindex"
    ? "tabIndex"
    : t;
}
function dv(t, e, n, r, i, s, o, a) {
  let c = zt(e, n),
    l = e.inputs,
    u;
  !a && l != null && (u = l[r])
    ? (wf(t, n, u, r, i), ji(e) && oS(n, e.index))
    : e.type & 3
    ? ((r = sS(r)),
      (i = o != null ? o(i, e.value || "", r) : i),
      s.setProperty(c, r, i))
    : e.type & 12;
}
function oS(t, e) {
  let n = dr(e, t);
  n[ue] & 16 || (n[ue] |= 64);
}
function bf(t, e, n, r) {
  if (Yg()) {
    let i = r === null ? null : { "": -1 },
      s = dS(t, n),
      o,
      a;
    s === null ? (o = a = null) : ([o, a] = s),
      o !== null && fv(t, e, n, o, i, a),
      i && fS(n, r, i);
  }
  n.mergedAttrs = Ts(n.mergedAttrs, n.attrs);
}
function fv(t, e, n, r, i, s) {
  for (let l = 0; l < r.length; l++) sd(Xa(n, e), t, r[l].type);
  pS(n, t.data.length, r.length);
  for (let l = 0; l < r.length; l++) {
    let u = r[l];
    u.providersResolver && u.providersResolver(u);
  }
  let o = !1,
    a = !1,
    c = av(t, e, r.length, null);
  for (let l = 0; l < r.length; l++) {
    let u = r[l];
    (n.mergedAttrs = Ts(n.mergedAttrs, u.hostAttrs)),
      mS(t, n, e, c, u),
      hS(c, u, i),
      u.contentQueries !== null && (n.flags |= 4),
      (u.hostBindings !== null || u.hostAttrs !== null || u.hostVars !== 0) &&
        (n.flags |= 64);
    let d = u.type.prototype;
    !o &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((t.preOrderHooks ??= []).push(n.index), (o = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((t.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
      c++;
  }
  iS(t, n, s);
}
function aS(t, e, n, r, i) {
  let s = i.hostBindings;
  if (s) {
    let o = t.hostBindingOpCodes;
    o === null && (o = t.hostBindingOpCodes = []);
    let a = ~e.index;
    cS(o) != a && o.push(a), o.push(n, r, s);
  }
}
function cS(t) {
  let e = t.length;
  for (; e > 0; ) {
    let n = t[--e];
    if (typeof n == "number" && n < 0) return n;
  }
  return 0;
}
function lS(t, e, n, r) {
  let i = n.directiveStart,
    s = n.directiveEnd;
  ji(n) && gS(e, n, t.data[i + n.componentOffset]),
    t.firstCreatePass || Xa(n, e),
    lr(r, e);
  let o = n.initialInputs;
  for (let a = i; a < s; a++) {
    let c = t.data[a],
      l = Ri(e, t, a, n);
    if ((lr(l, e), o !== null && yS(e, a - i, l, c, n, o), cr(c))) {
      let u = dr(n.index, e);
      u[nn] = Ri(e, t, a, n);
    }
  }
}
function hv(t, e, n) {
  let r = n.directiveStart,
    i = n.directiveEnd,
    s = n.index,
    o = c_();
  try {
    Hr(s);
    for (let a = r; a < i; a++) {
      let c = t.data[a],
        l = e[a];
      rd(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          uS(c, l);
    }
  } finally {
    Hr(-1), rd(o);
  }
}
function uS(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e);
}
function dS(t, e) {
  let n = t.directiveRegistry,
    r = null,
    i = null;
  if (n)
    for (let s = 0; s < n.length; s++) {
      let o = n[s];
      if (ND(e, o.selectors, !1))
        if ((r || (r = []), cr(o)))
          if (o.findHostDirectiveDefs !== null) {
            let a = [];
            (i = i || new Map()),
              o.findHostDirectiveDefs(o, a, i),
              r.unshift(...a, o);
            let c = a.length;
            Td(t, e, c);
          } else r.unshift(o), Td(t, e, 0);
        else
          (i = i || new Map()), o.findHostDirectiveDefs?.(o, r, i), r.push(o);
    }
  return r === null ? null : [r, i];
}
function Td(t, e, n) {
  (e.componentOffset = n), (t.components ??= []).push(e.index);
}
function fS(t, e, n) {
  if (e) {
    let r = (t.localNames = []);
    for (let i = 0; i < e.length; i += 2) {
      let s = n[e[i + 1]];
      if (s == null) throw new z(-301, !1);
      r.push(e[i], s);
    }
  }
}
function hS(t, e, n) {
  if (n) {
    if (e.exportAs)
      for (let r = 0; r < e.exportAs.length; r++) n[e.exportAs[r]] = t;
    cr(e) && (n[""] = t);
  }
}
function pS(t, e, n) {
  (t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + n),
    (t.providerIndexes = e);
}
function mS(t, e, n, r, i) {
  t.data[r] = i;
  let s = i.factory || (i.factory = Ai(i.type, !0)),
    o = new Br(s, cr(i), St);
  (t.blueprint[r] = o), (n[r] = o), aS(t, e, r, av(t, n, i.hostVars, Qr), i);
}
function gS(t, e, n) {
  let r = zt(e, t),
    i = lv(n),
    s = t[Ln].rendererFactory,
    o = 16;
  n.signals ? (o = 4096) : n.onPush && (o = 64);
  let a = Uc(
    t,
    Bc(t, i, null, o, r, e, null, s.createRenderer(r, n), null, null, null)
  );
  t[e.index] = a;
}
function yS(t, e, n, r, i, s) {
  let o = s[e];
  if (o !== null)
    for (let a = 0; a < o.length; ) {
      let c = o[a++],
        l = o[a++],
        u = o[a++],
        d = o[a++];
      ov(r, n, c, l, u, d);
    }
}
function vS(t, e, n) {
  let r = null,
    i = 0;
  for (; i < n.length; ) {
    let s = n[i];
    if (s === 0) {
      i += 4;
      continue;
    } else if (s === 5) {
      i += 2;
      continue;
    }
    if (typeof s == "number") break;
    if (t.hasOwnProperty(s)) {
      r === null && (r = []);
      let o = t[s];
      for (let a = 0; a < o.length; a += 3)
        if (o[a] === e) {
          r.push(s, o[a + 1], o[a + 2], n[i + 1]);
          break;
        }
    }
    i += 2;
  }
  return r;
}
function pv(t, e, n, r) {
  return [t, !0, 0, e, null, r, null, n, null, null];
}
function mv(t, e) {
  let n = t.contentQueries;
  if (n !== null) {
    let r = It(null);
    try {
      for (let i = 0; i < n.length; i += 2) {
        let s = n[i],
          o = n[i + 1];
        if (o !== -1) {
          let a = t.data[o];
          ey(s), a.contentQueries(2, e[o], o);
        }
      }
    } finally {
      It(r);
    }
  }
}
function Uc(t, e) {
  return t[Cs] ? (t[$m][en] = e) : (t[Cs] = e), (t[$m] = e), e;
}
function Sd(t, e, n) {
  ey(0);
  let r = It(null);
  try {
    e(t, n);
  } finally {
    It(r);
  }
}
function ES(t) {
  return t[Ss] || (t[Ss] = []);
}
function bS(t) {
  return t.cleanup || (t.cleanup = []);
}
function gv(t, e) {
  let n = t[Ni],
    r = n ? n.get(pn, null) : null;
  r && r.handleError(e);
}
function wf(t, e, n, r, i) {
  for (let s = 0; s < n.length; ) {
    let o = n[s++],
      a = n[s++],
      c = n[s++],
      l = e[o],
      u = t.data[o];
    ov(u, l, r, a, c, i);
  }
}
function wS(t, e, n) {
  let r = Wg(e, t);
  cT(t[qe], r, n);
}
var yv = 100;
function vv(t, e = !0, n = 0) {
  let r = t[Ln],
    i = r.rendererFactory,
    s = !1;
  s || i.begin?.();
  try {
    DS(t, n);
  } catch (o) {
    throw (e && gv(t, o), o);
  } finally {
    s || (i.end?.(), r.inlineEffectRunner?.flush());
  }
}
function DS(t, e) {
  Cd(t, e);
  let n = 0;
  for (; Gd(t); ) {
    if (n === yv) throw new z(103, !1);
    n++, Cd(t, 1);
  }
}
function _S(t, e, n, r) {
  let i = e[ue];
  if ((i & 256) === 256) return;
  let s = !1;
  !s && e[Ln].inlineEffectRunner?.flush(), Kd(e);
  let o = null,
    a = null;
  !s && TS(t) && ((a = zT(e)), (o = sm(a)));
  try {
    Qg(e), i_(t.bindingStartIndex), n !== null && cv(t, e, n, 2, r);
    let c = (i & 3) === 3;
    if (!s)
      if (c) {
        let d = t.preOrderCheckHooks;
        d !== null && Ba(e, d, null);
      } else {
        let d = t.preOrderHooks;
        d !== null && Ua(e, d, 0, null), Pu(e, 0);
      }
    if ((SS(e), Ev(e, 0), t.contentQueries !== null && mv(t, e), !s))
      if (c) {
        let d = t.contentCheckHooks;
        d !== null && Ba(e, d);
      } else {
        let d = t.contentHooks;
        d !== null && Ua(e, d, 1), Pu(e, 1);
      }
    YT(t, e);
    let l = t.components;
    l !== null && wv(e, l, 0);
    let u = t.viewQuery;
    if ((u !== null && Sd(2, u, r), !s))
      if (c) {
        let d = t.viewCheckHooks;
        d !== null && Ba(e, d);
      } else {
        let d = t.viewHooks;
        d !== null && Ua(e, d, 2), Pu(e, 2);
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[Lu])) {
      for (let d of e[Lu]) d();
      e[Lu] = null;
    }
    s || (e[ue] &= -73);
  } catch (c) {
    throw (Ns(e), c);
  } finally {
    a !== null && (om(a, o), WT(a)), Qd();
  }
}
function TS(t) {
  return t.type !== 2;
}
function Ev(t, e) {
  for (let n = Jy(t); n !== null; n = ev(n))
    for (let r = _t; r < n.length; r++) {
      let i = n[r];
      bv(i, e);
    }
}
function SS(t) {
  for (let e = Jy(t); e !== null; e = ev(e)) {
    if (!(e[ue] & Vd.HasTransplantedViews)) continue;
    let n = e[Qa];
    for (let r = 0; r < n.length; r++) {
      let i = n[r],
        s = i[at];
      KD(i);
    }
  }
}
function CS(t, e, n) {
  let r = dr(e, t);
  bv(r, n);
}
function bv(t, e) {
  zd(t) && Cd(t, e);
}
function Cd(t, e) {
  let r = t[ye],
    i = t[ue],
    s = t[jr],
    o = !!(e === 0 && i & 16);
  if (
    ((o ||= !!(i & 64 && e === 0)),
    (o ||= !!(i & 1024)),
    (o ||= !!(s?.dirty && gu(s))),
    s && (s.dirty = !1),
    (t[ue] &= -9217),
    o)
  )
    _S(r, t, r.template, t[nn]);
  else if (i & 8192) {
    Ev(t, 1);
    let a = r.components;
    a !== null && wv(t, a, 1);
  }
}
function wv(t, e, n) {
  for (let r = 0; r < e.length; r++) CS(t, e[r], n);
}
function Df(t) {
  for (t[Ln].changeDetectionScheduler?.notify(); t; ) {
    t[ue] |= 64;
    let e = As(t);
    if (qd(t) && !e) return t;
    t = e;
  }
  return null;
}
var $r = class {
    get rootNodes() {
      let e = this._lView,
        n = e[ye];
      return Ps(n, e, n.firstChild, []);
    }
    constructor(e, n, r = !0) {
      (this._lView = e),
        (this._cdRefInjectingView = n),
        (this.notifyErrorHandler = r),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[nn];
    }
    set context(e) {
      this._lView[nn] = e;
    }
    get destroyed() {
      return (this._lView[ue] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let e = this._lView[at];
        if (Ot(e)) {
          let n = e[Ka],
            r = n ? n.indexOf(this) : -1;
          r > -1 && (dd(e, r), Ja(n, r));
        }
        this._attachedToViewContainer = !1;
      }
      Fy(this._lView[ye], this._lView);
    }
    onDestroy(e) {
      YD(this._lView, e);
    }
    markForCheck() {
      Df(this._cdRefInjectingView || this._lView);
    }
    detach() {
      this._lView[ue] &= -129;
    }
    reattach() {
      nd(this._lView), (this._lView[ue] |= 128);
    }
    detectChanges() {
      (this._lView[ue] |= 1024), vv(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new z(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      (this._appRef = null), Ly(this._lView[ye], this._lView);
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new z(902, !1);
      (this._appRef = e), nd(this._lView);
    }
  },
  Vc = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = IS;
    let t = e;
    return t;
  })();
function IS(t) {
  return MS(Lt(), Ke(), (t & 16) === 16);
}
function MS(t, e, n) {
  if (ji(t) && !n) {
    let r = dr(t.index, e);
    return new $r(r, r);
  } else if (t.type & 47) {
    let r = e[Rt];
    return new $r(r, e);
  }
  return null;
}
var rg = new Set();
function Ks(t) {
  rg.has(t) ||
    (rg.add(t),
    performance?.mark?.("mark_feature_usage", { detail: { feature: t } }));
}
var Id = class extends mt {
  constructor(e = !1) {
    super(), (this.__isAsync = e);
  }
  emit(e) {
    super.next(e);
  }
  subscribe(e, n, r) {
    let i = e,
      s = n || (() => null),
      o = r;
    if (e && typeof e == "object") {
      let c = e;
      (i = c.next?.bind(c)), (s = c.error?.bind(c)), (o = c.complete?.bind(c));
    }
    this.__isAsync && ((s = $u(s)), i && (i = $u(i)), o && (o = $u(o)));
    let a = super.subscribe({ next: i, error: s, complete: o });
    return e instanceof rt && e.add(a), a;
  }
};
function $u(t) {
  return (e) => {
    setTimeout(t, void 0, e);
  };
}
var yt = Id;
function ig(...t) {}
function NS() {
  let t = typeof Ci.requestAnimationFrame == "function",
    e = Ci[t ? "requestAnimationFrame" : "setTimeout"],
    n = Ci[t ? "cancelAnimationFrame" : "clearTimeout"];
  if (typeof Zone < "u" && e && n) {
    let r = e[Zone.__symbol__("OriginalDelegate")];
    r && (e = r);
    let i = n[Zone.__symbol__("OriginalDelegate")];
    i && (n = i);
  }
  return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: n };
}
var je = class t {
    constructor({
      enableLongStackTrace: e = !1,
      shouldCoalesceEventChangeDetection: n = !1,
      shouldCoalesceRunChangeDetection: r = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new yt(!1)),
        (this.onMicrotaskEmpty = new yt(!1)),
        (this.onStable = new yt(!1)),
        (this.onError = new yt(!1)),
        typeof Zone > "u")
      )
        throw new z(908, !1);
      Zone.assertZonePatched();
      let i = this;
      (i._nesting = 0),
        (i._outer = i._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
        e &&
          Zone.longStackTraceZoneSpec &&
          (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
        (i.shouldCoalesceEventChangeDetection = !r && n),
        (i.shouldCoalesceRunChangeDetection = r),
        (i.lastRequestAnimationFrameId = -1),
        (i.nativeRequestAnimationFrame = NS().nativeRequestAnimationFrame),
        RS(i);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get("isAngularZone") === !0;
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new z(909, !1);
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new z(909, !1);
    }
    run(e, n, r) {
      return this._inner.run(e, n, r);
    }
    runTask(e, n, r, i) {
      let s = this._inner,
        o = s.scheduleEventTask("NgZoneEvent: " + i, e, AS, ig, ig);
      try {
        return s.runTask(o, n, r);
      } finally {
        s.cancelTask(o);
      }
    }
    runGuarded(e, n, r) {
      return this._inner.runGuarded(e, n, r);
    }
    runOutsideAngular(e) {
      return this._outer.run(e);
    }
  },
  AS = {};
function _f(t) {
  if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable)
    try {
      t._nesting++, t.onMicrotaskEmpty.emit(null);
    } finally {
      if ((t._nesting--, !t.hasPendingMicrotasks))
        try {
          t.runOutsideAngular(() => t.onStable.emit(null));
        } finally {
          t.isStable = !0;
        }
    }
}
function xS(t) {
  t.isCheckStableRunning ||
    t.lastRequestAnimationFrameId !== -1 ||
    ((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(
      Ci,
      () => {
        t.fakeTopEventTask ||
          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
            "fakeTopEventTask",
            () => {
              (t.lastRequestAnimationFrameId = -1),
                Md(t),
                (t.isCheckStableRunning = !0),
                _f(t),
                (t.isCheckStableRunning = !1);
            },
            void 0,
            () => {},
            () => {}
          )),
          t.fakeTopEventTask.invoke();
      }
    )),
    Md(t));
}
function RS(t) {
  let e = () => {
    xS(t);
  };
  t._inner = t._inner.fork({
    name: "angular",
    properties: { isAngularZone: !0 },
    onInvokeTask: (n, r, i, s, o, a) => {
      if (OS(a)) return n.invokeTask(i, s, o, a);
      try {
        return sg(t), n.invokeTask(i, s, o, a);
      } finally {
        ((t.shouldCoalesceEventChangeDetection && s.type === "eventTask") ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          og(t);
      }
    },
    onInvoke: (n, r, i, s, o, a, c) => {
      try {
        return sg(t), n.invoke(i, s, o, a, c);
      } finally {
        t.shouldCoalesceRunChangeDetection && e(), og(t);
      }
    },
    onHasTask: (n, r, i, s) => {
      n.hasTask(i, s),
        r === i &&
          (s.change == "microTask"
            ? ((t._hasPendingMicrotasks = s.microTask), Md(t), _f(t))
            : s.change == "macroTask" &&
              (t.hasPendingMacrotasks = s.macroTask));
    },
    onHandleError: (n, r, i, s) => (
      n.handleError(i, s), t.runOutsideAngular(() => t.onError.emit(s)), !1
    ),
  });
}
function Md(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.lastRequestAnimationFrameId !== -1)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1);
}
function sg(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
}
function og(t) {
  t._nesting--, _f(t);
}
var Nd = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new yt()),
      (this.onMicrotaskEmpty = new yt()),
      (this.onStable = new yt()),
      (this.onError = new yt());
  }
  run(e, n, r) {
    return e.apply(n, r);
  }
  runGuarded(e, n, r) {
    return e.apply(n, r);
  }
  runOutsideAngular(e) {
    return e();
  }
  runTask(e, n, r, i) {
    return e.apply(n, r);
  }
};
function OS(t) {
  return !Array.isArray(t) || t.length !== 1
    ? !1
    : t[0].data?.__ignore_ng_zone__ === !0;
}
function kS(t = "zone.js", e) {
  return t === "noop" ? new Nd() : t === "zone.js" ? new je(e) : t;
}
var Dv = (() => {
  let e = class e {
    constructor() {
      (this.handler = null), (this.internalCallbacks = []);
    }
    execute() {
      let r = [...this.internalCallbacks];
      this.internalCallbacks.length = 0;
      for (let i of r) i();
      this.handler?.execute();
    }
    ngOnDestroy() {
      this.handler?.destroy(),
        (this.handler = null),
        (this.internalCallbacks.length = 0);
    }
  };
  e.ɵprov = te({ token: e, providedIn: "root", factory: () => new e() });
  let t = e;
  return t;
})();
function LS(t, e) {
  let n = dr(e, t),
    r = n[ye];
  PS(r, n);
  let i = n[Ze];
  i !== null && n[kn] === null && (n[kn] = hf(i, n[Ni])), Tf(r, n, n[nn]);
}
function PS(t, e) {
  for (let n = e.length; n < t.blueprint.length; n++) e.push(t.blueprint[n]);
}
function Tf(t, e, n) {
  Kd(e);
  try {
    let r = t.viewQuery;
    r !== null && Sd(1, r, n);
    let i = t.template;
    i !== null && cv(t, e, i, 1, n),
      t.firstCreatePass && (t.firstCreatePass = !1),
      t.staticContentQueries && mv(t, e),
      t.staticViewQueries && Sd(2, t.viewQuery, n);
    let s = t.components;
    s !== null && FS(e, s);
  } catch (r) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      r)
    );
  } finally {
    (e[ue] &= -5), Qd();
  }
}
function FS(t, e) {
  for (let n = 0; n < e.length; n++) LS(t, e[n]);
}
function lc(t, e, n) {
  let r = n ? t.styles : null,
    i = n ? t.classes : null,
    s = 0;
  if (e !== null)
    for (let o = 0; o < e.length; o++) {
      let a = e[o];
      if (typeof a == "number") s = a;
      else if (s == 1) i = Om(i, a);
      else if (s == 2) {
        let c = a,
          l = e[++o];
        r = Om(r, c + ": " + l + ";");
      }
    }
  n ? (t.styles = r) : (t.stylesWithoutHost = r),
    n ? (t.classes = i) : (t.classesWithoutHost = i);
}
var uc = class extends Fc {
  constructor(e) {
    super(), (this.ngModule = e);
  }
  resolveComponentFactory(e) {
    let n = ar(e);
    return new Fs(n, this.ngModule);
  }
};
function ag(t) {
  let e = [];
  for (let n in t) {
    if (!t.hasOwnProperty(n)) continue;
    let r = t[n];
    r !== void 0 &&
      e.push({ propName: Array.isArray(r) ? r[0] : r, templateName: n });
  }
  return e;
}
function jS(t) {
  let e = t.toLowerCase();
  return e === "svg" ? $D : e === "math" ? qD : null;
}
var Ad = class {
    constructor(e, n) {
      (this.injector = e), (this.parentInjector = n);
    }
    get(e, n, r) {
      r = Dc(r);
      let i = this.injector.get(e, Uu, r);
      return i !== Uu || n === Uu ? i : this.parentInjector.get(e, n, r);
    }
  },
  Fs = class extends ac {
    get inputs() {
      let e = this.componentDef,
        n = e.inputTransforms,
        r = ag(e.inputs);
      if (n !== null)
        for (let i of r)
          n.hasOwnProperty(i.propName) && (i.transform = n[i.propName]);
      return r;
    }
    get outputs() {
      return ag(this.componentDef.outputs);
    }
    constructor(e, n) {
      super(),
        (this.componentDef = e),
        (this.ngModule = n),
        (this.componentType = e.type),
        (this.selector = OD(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n);
    }
    create(e, n, r, i) {
      i = i || this.ngModule;
      let s = i instanceof Tt ? i : i?.injector;
      s &&
        this.componentDef.getStandaloneInjector !== null &&
        (s = this.componentDef.getStandaloneInjector(s) || s);
      let o = s ? new Ad(e, s) : e,
        a = o.get(Vr, null);
      if (a === null) throw new z(407, !1);
      let c = o.get(UT, null),
        l = o.get(Dv, null),
        u = o.get(Os, null),
        d = {
          rendererFactory: a,
          sanitizer: c,
          inlineEffectRunner: null,
          afterRenderEventManager: l,
          changeDetectionScheduler: u,
        },
        m = a.createRenderer(null, this.componentDef),
        b = this.componentDef.selectors[0][0] || "div",
        I = r ? JT(m, r, this.componentDef.encapsulation, o) : sf(m, b, jS(b)),
        N = 512;
      this.componentDef.signals
        ? (N |= 4096)
        : this.componentDef.onPush || (N |= 16);
      let F = null;
      I !== null && (F = hf(I, o, !0));
      let x = Ef(0, null, null, 1, 0, null, null, null, null, null, null),
        _ = Bc(null, x, null, N, null, null, d, m, o, null, F);
      Kd(_);
      let w, T;
      try {
        let E = this.componentDef,
          ee,
          ne = null;
        E.findHostDirectiveDefs
          ? ((ee = []),
            (ne = new Map()),
            E.findHostDirectiveDefs(E, ee, ne),
            ee.push(E))
          : (ee = [E]);
        let me = HS(_, I),
          q = BS(me, I, E, ee, _, d, m);
        (T = Kg(x, nt)),
          I && $S(m, E, I, r),
          n !== void 0 && qS(T, this.ngContentSelectors, n),
          (w = VS(q, E, ee, ne, _, [zS])),
          Tf(x, _, null);
      } finally {
        Qd();
      }
      return new xd(this.componentType, w, jc(T, _), _, T);
    }
  },
  xd = class extends vd {
    constructor(e, n, r, i, s) {
      super(),
        (this.location = r),
        (this._rootLView = i),
        (this._tNode = s),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new $r(i, void 0, !1)),
        (this.componentType = e);
    }
    setInput(e, n) {
      let r = this._tNode.inputs,
        i;
      if (r !== null && (i = r[e])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(e) &&
            Object.is(this.previousInputValues.get(e), n))
        )
          return;
        let s = this._rootLView;
        wf(s[ye], s, i, e, n), this.previousInputValues.set(e, n);
        let o = dr(this._tNode.index, s);
        Df(o);
      }
    }
    get injector() {
      return new Fr(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(e) {
      this.hostView.onDestroy(e);
    }
  };
function HS(t, e) {
  let n = t[ye],
    r = nt;
  return (t[r] = e), Ws(n, r, 2, "#host", null);
}
function BS(t, e, n, r, i, s, o) {
  let a = i[ye];
  US(r, t, e, o);
  let c = null;
  e !== null && (c = hf(e, i[Ni]));
  let l = s.rendererFactory.createRenderer(e, n),
    u = 16;
  n.signals ? (u = 4096) : n.onPush && (u = 64);
  let d = Bc(i, lv(n), null, u, i[t.index], t, s, l, null, null, c);
  return (
    a.firstCreatePass && Td(a, t, r.length - 1), Uc(i, d), (i[t.index] = d)
  );
}
function US(t, e, n, r) {
  for (let i of t) e.mergedAttrs = Ts(e.mergedAttrs, i.hostAttrs);
  e.mergedAttrs !== null &&
    (lc(e, e.mergedAttrs, !0), n !== null && qy(r, n, e));
}
function VS(t, e, n, r, i, s) {
  let o = Lt(),
    a = i[ye],
    c = zt(o, i);
  fv(a, i, o, n, null, r);
  for (let u = 0; u < n.length; u++) {
    let d = o.directiveStart + u,
      m = Ri(i, a, d, o);
    lr(m, i);
  }
  hv(a, i, o), c && lr(c, i);
  let l = Ri(i, a, o.directiveStart + o.componentOffset, o);
  if (((t[nn] = i[nn] = l), s !== null)) for (let u of s) u(l, e);
  return gf(a, o, t), l;
}
function $S(t, e, n, r) {
  if (r) ed(t, n, ["ng-version", "17.1.3"]);
  else {
    let { attrs: i, classes: s } = kD(e.selectors[0]);
    i && ed(t, n, i), s && s.length > 0 && $y(t, n, s.join(" "));
  }
}
function qS(t, e, n) {
  let r = (t.projection = []);
  for (let i = 0; i < e.length; i++) {
    let s = n[i];
    r.push(s != null ? Array.from(s) : null);
  }
}
function zS() {
  let t = Lt();
  Mc(Ke()[ye], t);
}
function GS(t) {
  return Object.getPrototypeOf(t.prototype).constructor;
}
function WS(t) {
  let e = GS(t.type),
    n = !0,
    r = [t];
  for (; e; ) {
    let i;
    if (cr(t)) i = e.ɵcmp || e.ɵdir;
    else {
      if (e.ɵcmp) throw new z(903, !1);
      i = e.ɵdir;
    }
    if (i) {
      if (n) {
        r.push(i);
        let o = t;
        (o.inputs = Pa(t.inputs)),
          (o.inputTransforms = Pa(t.inputTransforms)),
          (o.declaredInputs = Pa(t.declaredInputs)),
          (o.outputs = Pa(t.outputs));
        let a = i.hostBindings;
        a && XS(t, a);
        let c = i.viewQuery,
          l = i.contentQueries;
        if (
          (c && YS(t, c),
          l && ZS(t, l),
          KS(t, i),
          iD(t.outputs, i.outputs),
          cr(i) && i.data.animation)
        ) {
          let u = t.data;
          u.animation = (u.animation || []).concat(i.data.animation);
        }
      }
      let s = i.features;
      if (s)
        for (let o = 0; o < s.length; o++) {
          let a = s[o];
          a && a.ngInherit && a(t), a === WS && (n = !1);
        }
    }
    e = Object.getPrototypeOf(e);
  }
  QS(r);
}
function KS(t, e) {
  for (let n in e.inputs) {
    if (!e.inputs.hasOwnProperty(n) || t.inputs.hasOwnProperty(n)) continue;
    let r = e.inputs[n];
    if (
      r !== void 0 &&
      ((t.inputs[n] = r),
      (t.declaredInputs[n] = e.declaredInputs[n]),
      e.inputTransforms !== null)
    ) {
      let i = Array.isArray(r) ? r[0] : r;
      if (!e.inputTransforms.hasOwnProperty(i)) continue;
      (t.inputTransforms ??= {}), (t.inputTransforms[i] = e.inputTransforms[i]);
    }
  }
}
function QS(t) {
  let e = 0,
    n = null;
  for (let r = t.length - 1; r >= 0; r--) {
    let i = t[r];
    (i.hostVars = e += i.hostVars),
      (i.hostAttrs = Ts(i.hostAttrs, (n = Ts(n, i.hostAttrs))));
  }
}
function Pa(t) {
  return t === Mi ? {} : t === xt ? [] : t;
}
function YS(t, e) {
  let n = t.viewQuery;
  n
    ? (t.viewQuery = (r, i) => {
        e(r, i), n(r, i);
      })
    : (t.viewQuery = e);
}
function ZS(t, e) {
  let n = t.contentQueries;
  n
    ? (t.contentQueries = (r, i, s) => {
        e(r, i, s), n(r, i, s);
      })
    : (t.contentQueries = e);
}
function XS(t, e) {
  let n = t.hostBindings;
  n
    ? (t.hostBindings = (r, i) => {
        e(r, i), n(r, i);
      })
    : (t.hostBindings = e);
}
var Rd = "<-- AT THIS LOCATION";
function JS(t) {
  switch (t) {
    case 4:
      return "view container";
    case 2:
      return "element";
    case 8:
      return "ng-container";
    case 32:
      return "icu";
    case 64:
      return "i18n";
    case 16:
      return "projection";
    case 1:
      return "text";
    default:
      return "<unknown>";
  }
}
function eC(t, e) {
  let n = `During serialization, Angular was unable to find an element in the DOM:

`,
    r = `${sC(t, e, !1)}

`,
    i = aC();
  throw new z(-502, n + r + i);
}
function tC(t) {
  let e =
      "During serialization, Angular detected DOM nodes that were created outside of Angular context and provided as projectable nodes (likely via `ViewContainerRef.createComponent` or `createComponent` APIs). Hydration is not supported for such cases, consider refactoring the code to avoid this pattern or using `ngSkipHydration` on the host element of the component.\n\n",
    n = `${oC(t)}

`,
    r = e + n + cC();
  return new z(-503, r);
}
function nC(t) {
  let e = [];
  if (t.attrs)
    for (let n = 0; n < t.attrs.length; ) {
      let r = t.attrs[n++];
      if (typeof r == "number") break;
      let i = t.attrs[n++];
      e.push(`${r}="${dc(i)}"`);
    }
  return e.join(" ");
}
var rC = new Set(["ngh", "ng-version", "ng-server-context"]);
function iC(t) {
  let e = [];
  for (let n = 0; n < t.attributes.length; n++) {
    let r = t.attributes[n];
    rC.has(r.name) || e.push(`${r.name}="${dc(r.value)}"`);
  }
  return e.join(" ");
}
function qu(t, e = "\u2026") {
  switch (t.type) {
    case 1:
      return `#text${t.value ? `(${t.value})` : ""}`;
    case 2:
      let r = nC(t),
        i = t.value.toLowerCase();
      return `<${i}${r ? " " + r : ""}>${e}</${i}>`;
    case 8:
      return "<!-- ng-container -->";
    case 4:
      return "<!-- container -->";
    default:
      return `#node(${JS(t.type)})`;
  }
}
function qa(t, e = "\u2026") {
  let n = t;
  switch (n.nodeType) {
    case Node.ELEMENT_NODE:
      let r = n.tagName.toLowerCase(),
        i = iC(n);
      return `<${r}${i ? " " + i : ""}>${e}</${r}>`;
    case Node.TEXT_NODE:
      let s = n.textContent ? dc(n.textContent) : "";
      return `#text${s ? `(${s})` : ""}`;
    case Node.COMMENT_NODE:
      return `<!-- ${dc(n.textContent ?? "")} -->`;
    default:
      return `#node(${n.nodeType})`;
  }
}
function sC(t, e, n) {
  let r = "  ",
    i = "";
  e.prev
    ? ((i +=
        r +
        `\u2026
`),
      (i +=
        r +
        qu(e.prev) +
        `
`))
    : e.type &&
      e.type & 12 &&
      (i +=
        r +
        `\u2026
`),
    n
      ? ((i +=
          r +
          qu(e) +
          `
`),
        (i +=
          r +
          `<!-- container -->  ${Rd}
`))
      : (i +=
          r +
          qu(e) +
          `  ${Rd}
`),
    (i +=
      r +
      `\u2026
`);
  let s = e.type ? jy(t[ye], e, t) : null;
  return (
    s &&
      (i = qa(
        s,
        `
` + i
      )),
    i
  );
}
function oC(t) {
  let e = "  ",
    n = "",
    r = t;
  return (
    r.previousSibling &&
      ((n +=
        e +
        `\u2026
`),
      (n +=
        e +
        qa(r.previousSibling) +
        `
`)),
    (n +=
      e +
      qa(r) +
      `  ${Rd}
`),
    t.nextSibling &&
      (n +=
        e +
        `\u2026
`),
    t.parentNode &&
      (n = qa(
        r.parentNode,
        `
` + n
      )),
    n
  );
}
function aC(t) {
  return `To fix this problem:
  * check ${
    t ? `the "${t}"` : "corresponding"
  } component for hydration-related issues
  * check to see if your template has valid HTML structure
  * or skip hydration by adding the \`ngSkipHydration\` attribute to its host node in a template

`;
}
function cC() {
  return `Note: attributes are only displayed to better represent the DOM but have no effect on hydration mismatches.

`;
}
function lC(t) {
  return t.replace(/\s+/gm, "");
}
function dc(t, e = 50) {
  return t
    ? ((t = lC(t)), t.length > e ? `${t.substring(0, e - 1)}\u2026` : t)
    : "";
}
function _v(t) {
  let e = t[Ms] ?? [],
    r = t[at][qe];
  for (let i of e) uC(i, r);
  t[Ms] = xt;
}
function uC(t, e) {
  let n = 0,
    r = t.firstChild;
  if (r) {
    let i = t.data[ki];
    for (; n < i; ) {
      let s = r.nextSibling;
      Uy(e, r, !1), (r = s), n++;
    }
  }
}
function Tv(t) {
  _v(t);
  for (let e = _t; e < t.length; e++) fc(t[e]);
}
function fc(t) {
  let e = t[ye];
  for (let n = nt; n < e.bindingStartIndex; n++)
    if (Ot(t[n])) {
      let r = t[n];
      Tv(r);
    } else On(t[n]) && fc(t[n]);
}
function dC(t) {
  let e = t._views;
  for (let n of e) {
    let r = Ky(n);
    if (r !== null && r[Ze] !== null)
      if (On(r)) fc(r);
      else {
        let i = r[Ze];
        fc(i), Tv(r);
      }
  }
}
var fC = new RegExp(`^(\\d+)*(${uf}|${lf})*(.*)`);
function hC(t, e) {
  let n = [t];
  for (let r of e) {
    let i = n.length - 1;
    if (i > 0 && n[i - 1] === r) {
      let s = n[i] || 1;
      n[i] = s + 1;
    } else n.push(r, "");
  }
  return n.join("");
}
function pC(t) {
  let e = t.match(fC),
    [n, r, i, s] = e,
    o = r ? parseInt(r, 10) : i,
    a = [];
  for (let [c, l, u] of s.matchAll(/(f|n)(\d*)/g)) {
    let d = parseInt(u, 10) || 1;
    a.push(l, d);
  }
  return [o, ...a];
}
function mC(t) {
  return !t.prev && t.parent?.type === 8;
}
function zu(t) {
  return t.index - nt;
}
function js(t, e) {
  return !(t.type & 16) && !!e[t.index] && !st(e[t.index])?.isConnected;
}
function $c(t, e, n, r) {
  let i = null,
    s = zu(r),
    o = t.data[gd];
  if (o?.[s]) i = yC(o[s], n);
  else if (e.firstChild === r) i = t.firstChild;
  else {
    let a = r.prev === null,
      c = r.prev ?? r.parent;
    if (mC(r)) {
      let l = zu(r.parent);
      i = yd(t, l);
    } else {
      let l = zt(c, n);
      if (a) i = l.firstChild;
      else {
        let u = zu(c),
          d = yd(t, u);
        if (c.type === 2 && d) {
          let b = pf(t, u) + 1;
          i = qc(b, d);
        } else i = l.nextSibling;
      }
    }
  }
  return i;
}
function qc(t, e) {
  let n = e;
  for (let r = 0; r < t; r++) n = n.nextSibling;
  return n;
}
function gC(t, e) {
  let n = t;
  for (let r = 0; r < e.length; r += 2) {
    let i = e[r],
      s = e[r + 1];
    for (let o = 0; o < s; o++)
      switch (i) {
        case ks.FirstChild:
          n = n.firstChild;
          break;
        case ks.NextSibling:
          n = n.nextSibling;
          break;
      }
  }
  return n;
}
function yC(t, e) {
  let [n, ...r] = pC(t),
    i;
  if (n === lf) i = e[Rt][Ze];
  else if (n === uf) i = Z_(e[Rt][Ze]);
  else {
    let s = Number(n);
    i = st(e[s + nt]);
  }
  return gC(i, r);
}
function Od(t, e) {
  if (t === e) return [];
  if (t.parentElement == null || e.parentElement == null) return null;
  if (t.parentElement === e.parentElement) return vC(t, e);
  {
    let n = e.parentElement,
      r = Od(t, n),
      i = Od(n.firstChild, e);
    return !r || !i ? null : [...r, ks.FirstChild, ...i];
  }
}
function vC(t, e) {
  let n = [],
    r = null;
  for (r = t; r != null && r !== e; r = r.nextSibling) n.push(ks.NextSibling);
  return r == null ? null : n;
}
function cg(t, e, n) {
  let r = Od(t, e);
  return r === null ? null : hC(n, r);
}
function EC(t, e) {
  let n = t.parent,
    r,
    i,
    s;
  for (; n !== null && js(n, e); ) n = n.parent;
  n === null || !(n.type & 3)
    ? ((r = s = lf), (i = e[Rt][Ze]))
    : ((r = n.index), (i = st(e[r])), (s = bc(r - nt)));
  let o = st(e[t.index]);
  if (t.type & 12) {
    let c = ws(e, t);
    c && (o = c);
  }
  let a = cg(i, o, s);
  if (a === null && i !== o) {
    let c = i.ownerDocument.body;
    if (((a = cg(c, o, uf)), a === null)) throw eC(e, t);
  }
  return a;
}
function bC(t, e) {
  let n = [];
  for (let r of e)
    for (let i = 0; i < (r[oc] ?? 1); i++) {
      let s = { data: r, firstChild: null };
      r[ki] > 0 && ((s.firstChild = t), (t = qc(r[ki], t))), n.push(s);
    }
  return [t, n];
}
var Sv = () => null;
function wC(t, e) {
  let n = t[Ms];
  return !e || n === null || n.length === 0
    ? null
    : n[0].data[md] === e
    ? n.shift()
    : (_v(t), null);
}
function DC() {
  Sv = wC;
}
function lg(t, e) {
  return Sv(t, e);
}
function _C(t, e, n, r) {
  let i = e.tView,
    o = t[ue] & 4096 ? 4096 : 16,
    a = Bc(
      t,
      i,
      n,
      o,
      null,
      e,
      null,
      null,
      null,
      r?.injector ?? null,
      r?.dehydratedView ?? null
    ),
    c = t[e.index];
  a[_c] = c;
  let l = t[Is];
  return l !== null && (a[Is] = l.createEmbeddedView(i)), Tf(i, a, n), a;
}
function ug(t, e) {
  return !e || e.firstChild === null || nc(t);
}
function TC(t, e, n, r = !0) {
  let i = e[ye];
  if ((fT(i, e, t, n), r)) {
    let o = fd(n, t),
      a = e[qe],
      c = of(a, t[Pn]);
    c !== null && uT(i, t[rn], a, e, c, o);
  }
  let s = e[kn];
  s !== null && s.firstChild !== null && (s.firstChild = null);
}
var Yr = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = SC;
  let t = e;
  return t;
})();
function SC() {
  let t = Lt();
  return IC(t, Ke());
}
var CC = Yr,
  Cv = class extends CC {
    constructor(e, n, r) {
      super(),
        (this._lContainer = e),
        (this._hostTNode = n),
        (this._hostLView = r);
    }
    get element() {
      return jc(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new Fr(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let e = Yd(this._hostTNode, this._hostLView);
      if (uy(e)) {
        let n = Za(e, this._hostLView),
          r = Ya(e),
          i = n[ye].data[r + 8];
        return new Fr(i, n);
      } else return new Fr(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(e) {
      let n = dg(this._lContainer);
      return (n !== null && n[e]) || null;
    }
    get length() {
      return this._lContainer.length - _t;
    }
    createEmbeddedView(e, n, r) {
      let i, s;
      typeof r == "number"
        ? (i = r)
        : r != null && ((i = r.index), (s = r.injector));
      let o = lg(this._lContainer, e.ssrId),
        a = e.createEmbeddedViewImpl(n || {}, s, o);
      return this.insertImpl(a, i, ug(this._hostTNode, o)), a;
    }
    createComponent(e, n, r, i, s) {
      let o = e && !N_(e),
        a;
      if (o) a = n;
      else {
        let I = n || {};
        (a = I.index),
          (r = I.injector),
          (i = I.projectableNodes),
          (s = I.environmentInjector || I.ngModuleRef);
      }
      let c = o ? e : new Fs(ar(e)),
        l = r || this.parentInjector;
      if (!s && c.ngModule == null) {
        let N = (o ? l : this.parentInjector).get(Tt, null);
        N && (s = N);
      }
      let u = ar(c.componentType ?? {}),
        d = lg(this._lContainer, u?.id ?? null),
        m = d?.firstChild ?? null,
        b = c.create(l, i, m, s);
      return this.insertImpl(b.hostView, a, ug(this._hostTNode, d)), b;
    }
    insert(e, n) {
      return this.insertImpl(e, n, !0);
    }
    insertImpl(e, n, r) {
      let i = e._lView;
      if (WD(i)) {
        let a = this.indexOf(e);
        if (a !== -1) this.detach(a);
        else {
          let c = i[at],
            l = new Cv(c, c[rn], c[at]);
          l.detach(l.indexOf(e));
        }
      }
      let s = this._adjustIndex(n),
        o = this._lContainer;
      return TC(o, i, s, r), e.attachToViewContainerRef(), by(Gu(o), s, e), e;
    }
    move(e, n) {
      return this.insert(e, n);
    }
    indexOf(e) {
      let n = dg(this._lContainer);
      return n !== null ? n.indexOf(e) : -1;
    }
    remove(e) {
      let n = this._adjustIndex(e, -1),
        r = dd(this._lContainer, n);
      r && (Ja(Gu(this._lContainer), n), Fy(r[ye], r));
    }
    detach(e) {
      let n = this._adjustIndex(e, -1),
        r = dd(this._lContainer, n);
      return r && Ja(Gu(this._lContainer), n) != null ? new $r(r) : null;
    }
    _adjustIndex(e, n = 0) {
      return e ?? this.length + n;
    }
  };
function dg(t) {
  return t[Ka];
}
function Gu(t) {
  return t[Ka] || (t[Ka] = []);
}
function IC(t, e) {
  let n,
    r = e[t.index];
  return (
    Ot(r) ? (n = r) : ((n = pv(r, e, null, t)), (e[t.index] = n), Uc(e, n)),
    Iv(n, e, t, r),
    new Cv(n, t, e)
  );
}
function MC(t, e) {
  let n = t[qe],
    r = n.createComment(""),
    i = zt(e, t),
    s = of(n, i);
  return ic(n, s, r, vT(n, i), !1), r;
}
var Iv = Mv,
  Sf = () => !1;
function NC(t, e, n) {
  return Sf(t, e, n);
}
function Mv(t, e, n, r) {
  if (t[Pn]) return;
  let i;
  n.type & 8 ? (i = st(r)) : (i = MC(e, n)), (t[Pn] = i);
}
function AC(t, e, n) {
  if (t[Pn] && t[Ms]) return !0;
  let r = n[kn],
    i = e.index - nt;
  if (!r || rc(e) || Pc(r, i)) return !1;
  let o = yd(r, i),
    a = r.data[Ls]?.[i],
    [c, l] = bC(o, a);
  return (t[Pn] = c), (t[Ms] = l), !0;
}
function xC(t, e, n, r) {
  Sf(t, n, e) || Mv(t, e, n, r);
}
function RC() {
  (Iv = xC), (Sf = AC);
}
var ur = class {},
  Hs = class {};
var hc = class extends ur {
    constructor(e, n, r) {
      super(),
        (this._parent = n),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new uc(this));
      let i = jg(e);
      (this._bootstrapComponents = Ny(i.bootstrap)),
        (this._r3Injector = My(
          e,
          n,
          [
            { provide: ur, useValue: this },
            { provide: Fc, useValue: this.componentFactoryResolver },
            ...r,
          ],
          Dt(e),
          new Set(["environment"])
        )),
        this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(e));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let e = this._r3Injector;
      !e.destroyed && e.destroy(),
        this.destroyCbs.forEach((n) => n()),
        (this.destroyCbs = null);
    }
    onDestroy(e) {
      this.destroyCbs.push(e);
    }
  },
  pc = class extends Hs {
    constructor(e) {
      super(), (this.moduleType = e);
    }
    create(e) {
      return new hc(this.moduleType, e, []);
    }
  };
function OC(t, e, n) {
  return new hc(t, e, n);
}
var mc = class extends ur {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new uc(this)),
      (this.instance = null);
    let n = new xs(
      [
        ...e.providers,
        { provide: ur, useValue: this },
        { provide: Fc, useValue: this.componentFactoryResolver },
      ],
      e.parent || ef(),
      e.debugName,
      new Set(["environment"])
    );
    (this.injector = n),
      e.runEnvironmentInitializers && n.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(e) {
    this.injector.onDestroy(e);
  }
};
function Cf(t, e, n = null) {
  return new mc({
    providers: t,
    parent: e,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
var Ui = (() => {
  let e = class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new lt(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let r = this.taskId++;
      return this.pendingTasks.add(r), r;
    }
    remove(r) {
      this.pendingTasks.delete(r),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = te({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function If(t, e, n) {
  let r = t[e];
  return Object.is(r, n) ? !1 : ((t[e] = n), !0);
}
function kC(t, e, n, r, i, s, o, a, c) {
  let l = e.consts,
    u = Ws(e, t, 4, o || null, xi(l, a));
  bf(e, n, u, xi(l, c)), Mc(e, u);
  let d = (u.tView = Ef(
    2,
    u,
    r,
    i,
    s,
    e.directiveRegistry,
    e.pipeRegistry,
    null,
    e.schemas,
    l,
    null
  ));
  return (
    e.queries !== null &&
      (e.queries.template(e, u), (d.queries = e.queries.embeddedTView(u))),
    u
  );
}
function LC(t, e, n, r, i, s, o, a) {
  let c = Ke(),
    l = kt(),
    u = t + nt,
    d = l.firstCreatePass ? kC(u, l, c, e, n, r, i, s, o) : l.data[u];
  Kr(d, !1);
  let m = Nv(l, c, d, t);
  Ic() && Rc(l, c, m, d), lr(m, c);
  let b = pv(m, c, m, d);
  return (
    (c[u] = b),
    Uc(c, b),
    NC(b, d, c),
    Sc(d) && yf(l, c, d),
    o != null && vf(c, d, a),
    LC
  );
}
var Nv = Av;
function Av(t, e, n, r) {
  return fr(!0), e[qe].createComment("");
}
function PC(t, e, n, r) {
  let i = e[kn],
    s = !i || Vs() || Pc(i, r);
  if ((fr(s), s)) return Av(t, e, n, r);
  let o = i.data[pd]?.[r] ?? null;
  o !== null &&
    n.tView !== null &&
    n.tView.ssrId === null &&
    (n.tView.ssrId = o);
  let a = $c(i, t, e, n);
  Lc(i, r, a);
  let c = pf(i, r);
  return qc(c, a);
}
function FC() {
  Nv = PC;
}
function xv(t, e, n, r) {
  return If(t, Jg(), n) ? e + bc(n) + r : Qr;
}
function Fa(t, e) {
  return (t << 17) | (e << 2);
}
function qr(t) {
  return (t >> 17) & 32767;
}
function jC(t) {
  return (t & 2) == 2;
}
function HC(t, e) {
  return (t & 131071) | (e << 17);
}
function kd(t) {
  return t | 2;
}
function Li(t) {
  return (t & 131068) >> 2;
}
function Wu(t, e) {
  return (t & -131069) | (e << 2);
}
function BC(t) {
  return (t & 1) === 1;
}
function Ld(t) {
  return t | 1;
}
function UC(t, e, n, r, i, s) {
  let o = s ? e.classBindings : e.styleBindings,
    a = qr(o),
    c = Li(o);
  t[r] = n;
  let l = !1,
    u;
  if (Array.isArray(n)) {
    let d = n;
    (u = d[1]), (u === null || $s(d, u) > 0) && (l = !0);
  } else u = n;
  if (i)
    if (c !== 0) {
      let m = qr(t[a + 1]);
      (t[r + 1] = Fa(m, a)),
        m !== 0 && (t[m + 1] = Wu(t[m + 1], r)),
        (t[a + 1] = HC(t[a + 1], r));
    } else
      (t[r + 1] = Fa(a, 0)), a !== 0 && (t[a + 1] = Wu(t[a + 1], r)), (a = r);
  else
    (t[r + 1] = Fa(c, 0)),
      a === 0 ? (a = r) : (t[c + 1] = Wu(t[c + 1], r)),
      (c = r);
  l && (t[r + 1] = kd(t[r + 1])),
    fg(t, u, r, !0),
    fg(t, u, r, !1),
    VC(e, u, t, r, s),
    (o = Fa(a, c)),
    s ? (e.classBindings = o) : (e.styleBindings = o);
}
function VC(t, e, n, r, i) {
  let s = i ? t.residualClasses : t.residualStyles;
  s != null &&
    typeof e == "string" &&
    $s(s, e) >= 0 &&
    (n[r + 1] = Ld(n[r + 1]));
}
function fg(t, e, n, r) {
  let i = t[n + 1],
    s = e === null,
    o = r ? qr(i) : Li(i),
    a = !1;
  for (; o !== 0 && (a === !1 || s); ) {
    let c = t[o],
      l = t[o + 1];
    $C(c, e) && ((a = !0), (t[o + 1] = r ? Ld(l) : kd(l))),
      (o = r ? qr(l) : Li(l));
  }
  a && (t[n + 1] = r ? kd(i) : Ld(i));
}
function $C(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == "string"
    ? $s(t, e) >= 0
    : !1;
}
function qC(t, e, n) {
  let r = Ke(),
    i = Jg();
  if (If(r, i, e)) {
    let s = kt(),
      o = oy();
    dv(s, o, r, t, e, r[qe], n, !1);
  }
  return qC;
}
function hg(t, e, n, r, i) {
  let s = e.inputs,
    o = i ? "class" : "style";
  wf(t, n, s[o], o, r);
}
function zC(t, e) {
  return GC(t, e, null, !0), zC;
}
function GC(t, e, n, r) {
  let i = Ke(),
    s = kt(),
    o = s_(2);
  if ((s.firstUpdatePass && KC(s, t, o, r), e !== Qr && If(i, o, e))) {
    let a = s.data[Hi()];
    JC(s, a, i, i[qe], t, (i[o + 1] = e1(e, n)), r, o);
  }
}
function WC(t, e) {
  return e >= t.expandoStartIndex;
}
function KC(t, e, n, r) {
  let i = t.data;
  if (i[n + 1] === null) {
    let s = i[Hi()],
      o = WC(t, n);
    t1(s, r) && e === null && !o && (e = !1),
      (e = QC(i, s, e, r)),
      UC(i, s, e, n, o, r);
  }
}
function QC(t, e, n, r) {
  let i = l_(t),
    s = r ? e.residualClasses : e.residualStyles;
  if (i === null)
    (r ? e.classBindings : e.styleBindings) === 0 &&
      ((n = Ku(null, t, e, n, r)), (n = Bs(n, e.attrs, r)), (s = null));
  else {
    let o = e.directiveStylingLast;
    if (o === -1 || t[o] !== i)
      if (((n = Ku(i, t, e, n, r)), s === null)) {
        let c = YC(t, e, r);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = Ku(null, t, e, c[1], r)),
          (c = Bs(c, e.attrs, r)),
          ZC(t, e, r, c));
      } else s = XC(t, e, r);
  }
  return (
    s !== void 0 && (r ? (e.residualClasses = s) : (e.residualStyles = s)), n
  );
}
function YC(t, e, n) {
  let r = n ? e.classBindings : e.styleBindings;
  if (Li(r) !== 0) return t[qr(r)];
}
function ZC(t, e, n, r) {
  let i = n ? e.classBindings : e.styleBindings;
  t[qr(i)] = r;
}
function XC(t, e, n) {
  let r,
    i = e.directiveEnd;
  for (let s = 1 + e.directiveStylingLast; s < i; s++) {
    let o = t[s].hostAttrs;
    r = Bs(r, o, n);
  }
  return Bs(r, e.attrs, n);
}
function Ku(t, e, n, r, i) {
  let s = null,
    o = n.directiveEnd,
    a = n.directiveStylingLast;
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < o && ((s = e[a]), (r = Bs(r, s.hostAttrs, i)), s !== t);

  )
    a++;
  return t !== null && (n.directiveStylingLast = a), r;
}
function Bs(t, e, n) {
  let r = n ? 1 : 2,
    i = -1;
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let o = e[s];
      typeof o == "number"
        ? (i = o)
        : i === r &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ["", t]),
          x_(t, o, n ? !0 : e[++s]));
    }
  return t === void 0 ? null : t;
}
function JC(t, e, n, r, i, s, o, a) {
  if (!(e.type & 3)) return;
  let c = t.data,
    l = c[a + 1],
    u = BC(l) ? pg(c, e, n, i, Li(l), o) : void 0;
  if (!gc(u)) {
    gc(s) || (jC(l) && (s = pg(c, null, n, i, a, o)));
    let d = Wg(Hi(), n);
    TT(r, o, d, i, s);
  }
}
function pg(t, e, n, r, i, s) {
  let o = e === null,
    a;
  for (; i > 0; ) {
    let c = t[i],
      l = Array.isArray(c),
      u = l ? c[1] : c,
      d = u === null,
      m = n[i + 1];
    m === Qr && (m = d ? xt : void 0);
    let b = d ? ju(m, r) : u === r ? m : void 0;
    if ((l && !gc(b) && (b = ju(c, r)), gc(b) && ((a = b), o))) return a;
    let I = t[i + 1];
    i = o ? qr(I) : Li(I);
  }
  if (e !== null) {
    let c = s ? e.residualClasses : e.residualStyles;
    c != null && (a = ju(c, r));
  }
  return a;
}
function gc(t) {
  return t !== void 0;
}
function e1(t, e) {
  return (
    t == null ||
      t === "" ||
      (typeof e == "string"
        ? (t = t + e)
        : typeof t == "object" && (t = Dt(kc(t)))),
    t
  );
}
function t1(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0;
}
function n1(t, e, n, r, i, s) {
  let o = e.consts,
    a = xi(o, i),
    c = Ws(e, t, 2, r, a);
  return (
    bf(e, n, c, xi(o, s)),
    c.attrs !== null && lc(c, c.attrs, !1),
    c.mergedAttrs !== null && lc(c, c.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, c),
    c
  );
}
function Rv(t, e, n, r) {
  let i = Ke(),
    s = kt(),
    o = nt + t,
    a = i[qe],
    c = s.firstCreatePass ? n1(o, s, i, e, n, r) : s.data[o],
    l = kv(s, i, c, a, e, t);
  i[o] = l;
  let u = Sc(c);
  return (
    Kr(c, !0),
    qy(a, l, c),
    (c.flags & 32) !== 32 && Ic() && Rc(s, i, l, c),
    ZD() === 0 && lr(l, i),
    XD(),
    u && (yf(s, i, c), gf(s, c, i)),
    r !== null && vf(i, c),
    Rv
  );
}
function Ov() {
  let t = Lt();
  Wd() ? Xg() : ((t = t.parent), Kr(t, !1));
  let e = t;
  e_(e) && n_(), JD();
  let n = kt();
  return (
    n.firstCreatePass && (Mc(n, t), $d(t) && n.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      g_(e) &&
      hg(n, e, Ke(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      y_(e) &&
      hg(n, e, Ke(), e.stylesWithoutHost, !1),
    Ov
  );
}
function Mf(t, e, n, r) {
  return Rv(t, e, n, r), Ov(), Mf;
}
var kv = (t, e, n, r, i, s) => (fr(!0), sf(r, i, ay()));
function r1(t, e, n, r, i, s) {
  let o = e[kn],
    a = !o || Vs() || Pc(o, s);
  if ((fr(a), a)) return sf(r, i, ay());
  let c = $c(o, t, e, n);
  return (
    Qy(o, s) && Lc(o, s, c.nextSibling),
    o && (Ay(n) || xy(c)) && ji(n) && (t_(n), Vy(c)),
    c
  );
}
function i1() {
  kv = r1;
}
function s1(t, e, n, r, i) {
  let s = e.consts,
    o = xi(s, r),
    a = Ws(e, t, 8, "ng-container", o);
  o !== null && lc(a, o, !0);
  let c = xi(s, i);
  return bf(e, n, a, c), e.queries !== null && e.queries.elementStart(e, a), a;
}
function o1(t, e, n) {
  let r = Ke(),
    i = kt(),
    s = t + nt,
    o = i.firstCreatePass ? s1(s, i, r, e, n) : i.data[s];
  Kr(o, !0);
  let a = Lv(i, r, o, t);
  return (
    (r[s] = a),
    Ic() && Rc(i, r, a, o),
    lr(a, r),
    Sc(o) && (yf(i, r, o), gf(i, o, r)),
    n != null && vf(r, o),
    o1
  );
}
function a1() {
  let t = Lt(),
    e = kt();
  return (
    Wd() ? Xg() : ((t = t.parent), Kr(t, !1)),
    e.firstCreatePass && (Mc(e, t), $d(t) && e.queries.elementEnd(t)),
    a1
  );
}
var Lv = (t, e, n, r) => (fr(!0), ky(e[qe], ""));
function c1(t, e, n, r) {
  let i,
    s = e[kn],
    o = !s || Vs();
  if ((fr(o), o)) return ky(e[qe], "");
  let a = $c(s, t, e, n),
    c = PT(s, r);
  return Lc(s, r, a), (i = qc(c, a)), i;
}
function l1() {
  Lv = c1;
}
var Pi = "en-US";
var u1 = Pi;
function Pv(t) {
  typeof t == "string" && (u1 = t.toLowerCase().replace(/_/g, "-"));
}
function Qs(t) {
  return !!t && typeof t.then == "function";
}
function Fv(t) {
  return !!t && typeof t.subscribe == "function";
}
function jv(t, e, n, r) {
  let i = Ke(),
    s = kt(),
    o = Lt();
  return f1(s, i, i[qe], o, t, e, r), jv;
}
function d1(t, e, n, r) {
  let i = t.cleanup;
  if (i != null)
    for (let s = 0; s < i.length - 1; s += 2) {
      let o = i[s];
      if (o === n && i[s + 1] === r) {
        let a = e[Ss],
          c = i[s + 2];
        return a.length > c ? a[c] : null;
      }
      typeof o == "string" && (s += 2);
    }
  return null;
}
function f1(t, e, n, r, i, s, o) {
  let a = Sc(r),
    l = t.firstCreatePass && bS(t),
    u = e[nn],
    d = ES(e),
    m = !0;
  if (r.type & 3 || o) {
    let N = zt(r, e),
      F = o ? o(N) : N,
      x = d.length,
      _ = o ? (T) => o(st(T[r.index])) : r.index,
      w = null;
    if ((!o && a && (w = d1(t, e, i, r.index)), w !== null)) {
      let T = w.__ngLastListenerFn__ || w;
      (T.__ngNextListenerFn__ = s), (w.__ngLastListenerFn__ = s), (m = !1);
    } else {
      s = gg(r, e, u, s, !1);
      let T = n.listen(F, i, s);
      d.push(s, T), l && l.push(i, _, x, x + 1);
    }
  } else s = gg(r, e, u, s, !1);
  let b = r.outputs,
    I;
  if (m && b !== null && (I = b[i])) {
    let N = I.length;
    if (N)
      for (let F = 0; F < N; F += 2) {
        let x = I[F],
          _ = I[F + 1],
          E = e[x][_].subscribe(s),
          ee = d.length;
        d.push(s, E), l && l.push(i, r.index, ee, -(ee + 1));
      }
  }
}
function mg(t, e, n, r) {
  try {
    return fn(6, e, n), n(r) !== !1;
  } catch (i) {
    return gv(t, i), !1;
  } finally {
    fn(7, e, n);
  }
}
function gg(t, e, n, r, i) {
  return function s(o) {
    if (o === Function) return r;
    let a = t.componentOffset > -1 ? dr(t.index, e) : e;
    Df(a);
    let c = mg(e, n, r, o),
      l = s.__ngNextListenerFn__;
    for (; l; ) (c = mg(e, n, l, o) && c), (l = l.__ngNextListenerFn__);
    return i && c === !1 && o.preventDefault(), c;
  };
}
function KP(t = 1) {
  return d_(t);
}
function h1(t, e, n) {
  return Hv(t, "", e, "", n), h1;
}
function Hv(t, e, n, r, i) {
  let s = Ke(),
    o = xv(s, e, n, r);
  if (o !== Qr) {
    let a = kt(),
      c = oy();
    dv(a, c, s, t, o, s[qe], i, !1);
  }
  return Hv;
}
var Ys = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = g1;
    let t = e;
    return t;
  })(),
  p1 = Ys,
  m1 = class extends p1 {
    constructor(e, n, r) {
      super(),
        (this._declarationLView = e),
        (this._declarationTContainer = n),
        (this.elementRef = r);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(e, n) {
      return this.createEmbeddedViewImpl(e, n);
    }
    createEmbeddedViewImpl(e, n, r) {
      let i = _C(this._declarationLView, this._declarationTContainer, e, {
        injector: n,
        dehydratedView: r,
      });
      return new $r(i);
    }
  };
function g1() {
  return y1(Lt(), Ke());
}
function y1(t, e) {
  return t.type & 4 ? new m1(e, t, jc(t, e)) : null;
}
function YP(t, e = "") {
  let n = Ke(),
    r = kt(),
    i = t + nt,
    s = r.firstCreatePass ? Ws(r, i, 1, e, null) : r.data[i],
    o = Bv(r, n, s, e, t);
  (n[i] = o), Ic() && Rc(r, n, o, s), Kr(s, !1);
}
var Bv = (t, e, n, r, i) => (fr(!0), Oy(e[qe], r));
function v1(t, e, n, r, i) {
  let s = e[kn],
    o = !s || Vs() || Pc(s, i);
  return fr(o), o ? Oy(e[qe], r) : $c(s, t, e, n);
}
function E1() {
  Bv = v1;
}
function b1(t) {
  return Uv("", t, ""), b1;
}
function Uv(t, e, n) {
  let r = Ke(),
    i = xv(r, t, e, n);
  return i !== Qr && wS(r, Hi(), i), Uv;
}
function w1(t, e, n) {
  let r = kt();
  if (r.firstCreatePass) {
    let i = cr(t);
    Pd(n, r.data, r.blueprint, i, !0), Pd(e, r.data, r.blueprint, i, !1);
  }
}
function Pd(t, e, n, r, i) {
  if (((t = gt(t)), Array.isArray(t)))
    for (let s = 0; s < t.length; s++) Pd(t[s], e, n, r, i);
  else {
    let s = kt(),
      o = Ke(),
      a = Lt(),
      c = Oi(t) ? t : gt(t.provide),
      l = Iy(t),
      u = a.providerIndexes & 1048575,
      d = a.directiveStart,
      m = a.providerIndexes >> 20;
    if (Oi(t) || !t.multi) {
      let b = new Br(l, i, St),
        I = Yu(c, e, i ? u : u + m, d);
      I === -1
        ? (sd(Xa(a, o), s, c),
          Qu(s, t, e.length),
          e.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          n.push(b),
          o.push(b))
        : ((n[I] = b), (o[I] = b));
    } else {
      let b = Yu(c, e, u + m, d),
        I = Yu(c, e, u, u + m),
        N = b >= 0 && n[b],
        F = I >= 0 && n[I];
      if ((i && !F) || (!i && !N)) {
        sd(Xa(a, o), s, c);
        let x = T1(i ? _1 : D1, n.length, i, r, l);
        !i && F && (n[I].providerFactory = x),
          Qu(s, t, e.length, 0),
          e.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          n.push(x),
          o.push(x);
      } else {
        let x = Vv(n[i ? I : b], l, !i && r);
        Qu(s, t, b > -1 ? b : I, x);
      }
      !i && r && F && n[I].componentProviders++;
    }
  }
}
function Qu(t, e, n, r) {
  let i = Oi(e),
    s = $_(e);
  if (i || s) {
    let c = (s ? gt(e.useClass) : e).prototype.ngOnDestroy;
    if (c) {
      let l = t.destroyHooks || (t.destroyHooks = []);
      if (!i && e.multi) {
        let u = l.indexOf(n);
        u === -1 ? l.push(n, [r, c]) : l[u + 1].push(r, c);
      } else l.push(n, c);
    }
  }
}
function Vv(t, e, n) {
  return n && t.componentProviders++, t.multi.push(e) - 1;
}
function Yu(t, e, n, r) {
  for (let i = n; i < r; i++) if (e[i] === t) return i;
  return -1;
}
function D1(t, e, n, r) {
  return Fd(this.multi, []);
}
function _1(t, e, n, r) {
  let i = this.multi,
    s;
  if (this.providerFactory) {
    let o = this.providerFactory.componentProviders,
      a = Ri(n, n[ye], this.providerFactory.index, r);
    (s = a.slice(0, o)), Fd(i, s);
    for (let c = o; c < a.length; c++) s.push(a[c]);
  } else (s = []), Fd(i, s);
  return s;
}
function Fd(t, e) {
  for (let n = 0; n < t.length; n++) {
    let r = t[n];
    e.push(r());
  }
  return e;
}
function T1(t, e, n, r, i) {
  let s = new Br(t, n, St);
  return (
    (s.multi = []),
    (s.index = e),
    (s.componentProviders = 0),
    Vv(s, i, r && !n),
    s
  );
}
function ZP(t, e = []) {
  return (n) => {
    n.providersResolver = (r, i) => w1(r, i ? i(t) : t, e);
  };
}
var S1 = (() => {
  let e = class e {
    constructor(r) {
      (this._injector = r), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(r) {
      if (!r.standalone) return null;
      if (!this.cachedInjectors.has(r)) {
        let i = Ty(!1, r.type),
          s =
            i.length > 0
              ? Cf([i], this._injector, `Standalone[${r.type.name}]`)
              : null;
        this.cachedInjectors.set(r, s);
      }
      return this.cachedInjectors.get(r);
    }
    ngOnDestroy() {
      try {
        for (let r of this.cachedInjectors.values()) r !== null && r.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
  };
  e.ɵprov = te({
    token: e,
    providedIn: "environment",
    factory: () => new e(se(Tt)),
  });
  let t = e;
  return t;
})();
function $v(t) {
  Ks("NgStandalone"),
    (t.getStandaloneInjector = (e) =>
      e.get(S1).getOrCreateStandaloneInjector(t));
}
var ja = null;
function C1(t) {
  (ja !== null &&
    (t.defaultEncapsulation !== ja.defaultEncapsulation ||
      t.preserveWhitespaces !== ja.preserveWhitespaces)) ||
    (ja = t);
}
var zc = (() => {
    let e = class e {
      log(r) {
        console.log(r);
      }
      warn(r) {
        console.warn(r);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  jd = class {
    constructor(e, n) {
      (this.ngModuleFactory = e), (this.componentFactories = n);
    }
  },
  Nf = (() => {
    let e = class e {
      compileModuleSync(r) {
        return new pc(r);
      }
      compileModuleAsync(r) {
        return Promise.resolve(this.compileModuleSync(r));
      }
      compileModuleAndAllComponentsSync(r) {
        let i = this.compileModuleSync(r),
          s = jg(r),
          o = Ny(s.declarations).reduce((a, c) => {
            let l = ar(c);
            return l && a.push(new Fs(l)), a;
          }, []);
        return new jd(i, o);
      }
      compileModuleAndAllComponentsAsync(r) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(r));
      }
      clearCache() {}
      clearCacheFor(r) {}
      getModuleId(r) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  I1 = new ae("");
var Gc = new ae(""),
  qv = new ae(""),
  Af = (() => {
    let e = class e {
      constructor(r, i, s) {
        (this._ngZone = r),
          (this.registry = i),
          (this._pendingCount = 0),
          (this._isZoneStable = !0),
          (this._callbacks = []),
          (this.taskTrackingZone = null),
          xf || (M1(s), s.addToWindow(i)),
          this._watchAngularEvents(),
          r.run(() => {
            this.taskTrackingZone =
              typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone");
          });
      }
      _watchAngularEvents() {
        this._ngZone.onUnstable.subscribe({
          next: () => {
            this._isZoneStable = !1;
          },
        }),
          this._ngZone.runOutsideAngular(() => {
            this._ngZone.onStable.subscribe({
              next: () => {
                je.assertNotInAngularZone(),
                  queueMicrotask(() => {
                    (this._isZoneStable = !0), this._runCallbacksIfReady();
                  });
              },
            });
          });
      }
      increasePendingRequestCount() {
        return (this._pendingCount += 1), this._pendingCount;
      }
      decreasePendingRequestCount() {
        if (((this._pendingCount -= 1), this._pendingCount < 0))
          throw new Error("pending async requests below zero");
        return this._runCallbacksIfReady(), this._pendingCount;
      }
      isStable() {
        return (
          this._isZoneStable &&
          this._pendingCount === 0 &&
          !this._ngZone.hasPendingMacrotasks
        );
      }
      _runCallbacksIfReady() {
        if (this.isStable())
          queueMicrotask(() => {
            for (; this._callbacks.length !== 0; ) {
              let r = this._callbacks.pop();
              clearTimeout(r.timeoutId), r.doneCb();
            }
          });
        else {
          let r = this.getPendingTasks();
          this._callbacks = this._callbacks.filter((i) =>
            i.updateCb && i.updateCb(r) ? (clearTimeout(i.timeoutId), !1) : !0
          );
        }
      }
      getPendingTasks() {
        return this.taskTrackingZone
          ? this.taskTrackingZone.macroTasks.map((r) => ({
              source: r.source,
              creationLocation: r.creationLocation,
              data: r.data,
            }))
          : [];
      }
      addCallback(r, i, s) {
        let o = -1;
        i &&
          i > 0 &&
          (o = setTimeout(() => {
            (this._callbacks = this._callbacks.filter(
              (a) => a.timeoutId !== o
            )),
              r();
          }, i)),
          this._callbacks.push({ doneCb: r, timeoutId: o, updateCb: s });
      }
      whenStable(r, i, s) {
        if (s && !this.taskTrackingZone)
          throw new Error(
            'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
          );
        this.addCallback(r, i, s), this._runCallbacksIfReady();
      }
      getPendingRequestCount() {
        return this._pendingCount;
      }
      registerApplication(r) {
        this.registry.registerApplication(r, this);
      }
      unregisterApplication(r) {
        this.registry.unregisterApplication(r);
      }
      findProviders(r, i, s) {
        return [];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(se(je), se(zv), se(qv));
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  zv = (() => {
    let e = class e {
      constructor() {
        this._applications = new Map();
      }
      registerApplication(r, i) {
        this._applications.set(r, i);
      }
      unregisterApplication(r) {
        this._applications.delete(r);
      }
      unregisterAllApplications() {
        this._applications.clear();
      }
      getTestability(r) {
        return this._applications.get(r) || null;
      }
      getAllTestabilities() {
        return Array.from(this._applications.values());
      }
      getAllRootElements() {
        return Array.from(this._applications.keys());
      }
      findTestabilityInTree(r, i = !0) {
        return xf?.findTestabilityInTree(this, r, i) ?? null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })();
function M1(t) {
  xf = t;
}
var xf,
  Gv = new ae(""),
  Rf = (() => {
    let e = class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((r, i) => {
            (this.resolve = r), (this.reject = i);
          })),
          (this.appInits = G(Gv, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let r = [];
        for (let s of this.appInits) {
          let o = s();
          if (Qs(o)) r.push(o);
          else if (Fv(o)) {
            let a = new Promise((c, l) => {
              o.subscribe({ complete: c, error: l });
            });
            r.push(a);
          }
        }
        let i = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(r)
          .then(() => {
            i();
          })
          .catch((s) => {
            this.reject(s);
          }),
          r.length === 0 && i(),
          (this.initialized = !0);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Vi = new ae("");
function N1(t, e, n) {
  let r = new pc(n);
  return Promise.resolve(r);
}
function Wv() {
  cm(() => {
    throw new z(600, !1);
  });
}
function A1(t) {
  return t.isBoundToModule;
}
function Kv(t, e, n) {
  try {
    let r = n();
    return Qs(r)
      ? r.catch((i) => {
          throw (e.runOutsideAngular(() => t.handleError(i)), i);
        })
      : r;
  } catch (r) {
    throw (e.runOutsideAngular(() => t.handleError(r)), r);
  }
}
function Qv(t, e) {
  return Array.isArray(e) ? e.reduce(Qv, t) : J(J({}, t), e);
}
var on = (() => {
  let e = class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = G(nv)),
        (this.afterRenderEffectManager = G(Dv)),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = G(Ui).hasPendingTasks.pipe(Ee((r) => !r))),
        (this._injector = G(Tt));
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(r, i) {
      let s = r instanceof ac;
      if (!this._injector.get(Rf).done) {
        let b = !s && Fg(r),
          I = !1;
        throw new z(405, I);
      }
      let a;
      s ? (a = r) : (a = this._injector.get(Fc).resolveComponentFactory(r)),
        this.componentTypes.push(a.componentType);
      let c = A1(a) ? void 0 : this._injector.get(ur),
        l = i || a.selector,
        u = a.create(sn.NULL, [], l, c),
        d = u.location.nativeElement,
        m = u.injector.get(Gc, null);
      return (
        m?.registerApplication(d),
        u.onDestroy(() => {
          this.detachView(u.hostView),
            za(this.components, u),
            m?.unregisterApplication(d);
        }),
        this._loadComponent(u),
        u
      );
    }
    tick() {
      if (this._runningTick) throw new z(101, !1);
      try {
        (this._runningTick = !0), this.detectChangesInAttachedViews();
      } catch (r) {
        this.internalErrorHandler(r);
      } finally {
        this._runningTick = !1;
      }
    }
    detectChangesInAttachedViews() {
      let r = 0;
      do {
        if (r === yv) throw new z(103, !1);
        let i = r === 0;
        for (let { _lView: s, notifyErrorHandler: o } of this._views)
          (!i && !vg(s)) || this.detectChangesInView(s, o, i);
        this.afterRenderEffectManager.execute(), r++;
      } while (this._views.some(({ _lView: i }) => vg(i)));
    }
    detectChangesInView(r, i, s) {
      let o;
      s ? ((o = 0), (r[ue] |= 1024)) : r[ue] & 64 ? (o = 0) : (o = 1),
        vv(r, i, o);
    }
    attachView(r) {
      let i = r;
      this._views.push(i), i.attachToAppRef(this);
    }
    detachView(r) {
      let i = r;
      za(this._views, i), i.detachFromAppRef();
    }
    _loadComponent(r) {
      this.attachView(r.hostView), this.tick(), this.components.push(r);
      let i = this._injector.get(Vi, []);
      [...this._bootstrapListeners, ...i].forEach((s) => s(r));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((r) => r()),
            this._views.slice().forEach((r) => r.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(r) {
      return (
        this._destroyListeners.push(r), () => za(this._destroyListeners, r)
      );
    }
    destroy() {
      if (this._destroyed) throw new z(406, !1);
      let r = this._injector;
      r.destroy && !r.destroyed && r.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = te({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function za(t, e) {
  let n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}
function yg(t) {
  for (let e = t.length - 1; e >= 0; e--) if (t[e] !== void 0) return t[e];
}
var Ha;
function Zs(t) {
  Ha ??= new WeakMap();
  let e = Ha.get(t);
  if (e) return e;
  let n = t.isStable
    .pipe(Xt((r) => r))
    .toPromise()
    .then(() => {});
  return Ha.set(t, n), t.onDestroy(() => Ha?.delete(t)), n;
}
function vg(t) {
  return Gd(t);
}
var x1 = (() => {
  let e = class e {
    constructor() {
      (this.zone = G(je)), (this.applicationRef = G(on));
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.zone.run(() => {
                this.applicationRef.tick();
              });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = te({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function Yv(t) {
  return [
    { provide: je, useFactory: t },
    {
      provide: Ur,
      multi: !0,
      useFactory: () => {
        let e = G(x1, { optional: !0 });
        return () => e.initialize();
      },
    },
    {
      provide: Ur,
      multi: !0,
      useFactory: () => {
        let e = G(k1);
        return () => {
          e.initialize();
        };
      },
    },
    { provide: nv, useFactory: R1 },
  ];
}
function R1() {
  let t = G(je),
    e = G(pn);
  return (n) => t.runOutsideAngular(() => e.handleError(n));
}
function O1(t) {
  let e = Yv(() => new je(Zv(t)));
  return mn([[], e]);
}
function Zv(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  };
}
var k1 = (() => {
  let e = class e {
    constructor() {
      (this.subscription = new rt()),
        (this.initialized = !1),
        (this.zone = G(je)),
        (this.pendingTasks = G(Ui));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let r = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (r = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              je.assertNotInAngularZone(),
                queueMicrotask(() => {
                  r !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(r), (r = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            je.assertInAngularZone(), (r ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = te({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function L1() {
  return (typeof $localize < "u" && $localize.locale) || Pi;
}
var Wc = new ae("", {
  providedIn: "root",
  factory: () => G(Wc, we.Optional | we.SkipSelf) || L1(),
});
var Of = new ae(""),
  Xv = (() => {
    let e = class e {
      constructor(r) {
        (this._injector = r),
          (this._modules = []),
          (this._destroyListeners = []),
          (this._destroyed = !1);
      }
      bootstrapModuleFactory(r, i) {
        let s = kS(
          i?.ngZone,
          Zv({
            eventCoalescing: i?.ngZoneEventCoalescing,
            runCoalescing: i?.ngZoneRunCoalescing,
          })
        );
        return s.run(() => {
          let o = OC(
              r.moduleType,
              this.injector,
              Yv(() => s)
            ),
            a = o.injector.get(pn, null);
          return (
            s.runOutsideAngular(() => {
              let c = s.onError.subscribe({
                next: (l) => {
                  a.handleError(l);
                },
              });
              o.onDestroy(() => {
                za(this._modules, o), c.unsubscribe();
              });
            }),
            Kv(a, s, () => {
              let c = o.injector.get(Rf);
              return (
                c.runInitializers(),
                c.donePromise.then(() => {
                  let l = o.injector.get(Wc, Pi);
                  return Pv(l || Pi), this._moduleDoBootstrap(o), o;
                })
              );
            })
          );
        });
      }
      bootstrapModule(r, i = []) {
        let s = Qv({}, i);
        return N1(this.injector, s, r).then((o) =>
          this.bootstrapModuleFactory(o, s)
        );
      }
      _moduleDoBootstrap(r) {
        let i = r.injector.get(on);
        if (r._bootstrapComponents.length > 0)
          r._bootstrapComponents.forEach((s) => i.bootstrap(s));
        else if (r.instance.ngDoBootstrap) r.instance.ngDoBootstrap(i);
        else throw new z(-403, !1);
        this._modules.push(r);
      }
      onDestroy(r) {
        this._destroyListeners.push(r);
      }
      get injector() {
        return this._injector;
      }
      destroy() {
        if (this._destroyed) throw new z(404, !1);
        this._modules.slice().forEach((i) => i.destroy()),
          this._destroyListeners.forEach((i) => i());
        let r = this._injector.get(Of, null);
        r && (r.forEach((i) => i()), r.clear()), (this._destroyed = !0);
      }
      get destroyed() {
        return this._destroyed;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(se(sn));
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  sr = null,
  Kc = new ae("");
function P1(t) {
  if (sr && !sr.get(Kc, !1)) throw new z(400, !1);
  Wv(), (sr = t);
  let e = t.get(Xv);
  return tE(t), e;
}
function Qc(t, e, n = []) {
  let r = `Platform: ${e}`,
    i = new ae(r);
  return (s = []) => {
    let o = eE();
    if (!o || o.injector.get(Kc, !1)) {
      let a = [...n, ...s, { provide: i, useValue: !0 }];
      t ? t(a) : P1(Jv(a, r));
    }
    return F1(i);
  };
}
function Jv(t = [], e) {
  return sn.create({
    name: e,
    providers: [
      { provide: Nc, useValue: "platform" },
      { provide: Of, useValue: new Set([() => (sr = null)]) },
      ...t,
    ],
  });
}
function F1(t) {
  let e = eE();
  if (!e) throw new z(401, !1);
  return e;
}
function eE() {
  return sr?.get(Xv) ?? null;
}
function j1(t = []) {
  if (sr) return sr;
  let e = Jv(t);
  return (sr = e), Wv(), tE(e), e;
}
function tE(t) {
  t.get(zs, null)?.forEach((n) => n());
}
var kf = Qc(null, "core", []);
function nE(t) {
  try {
    let { rootComponent: e, appProviders: n, platformProviders: r } = t,
      i = j1(r),
      s = [O1(), ...(n || [])],
      a = new mc({
        providers: s,
        parent: i,
        debugName: "",
        runEnvironmentInitializers: !1,
      }).injector,
      c = a.get(je);
    return c.run(() => {
      a.resolveInjectorInitializers();
      let l = a.get(pn, null),
        u;
      c.runOutsideAngular(() => {
        u = c.onError.subscribe({
          next: (b) => {
            l.handleError(b);
          },
        });
      });
      let d = () => a.destroy(),
        m = i.get(Of);
      return (
        m.add(d),
        a.onDestroy(() => {
          u.unsubscribe(), m.delete(d);
        }),
        Kv(l, c, () => {
          let b = a.get(Rf);
          return (
            b.runInitializers(),
            b.donePromise.then(() => {
              let I = a.get(Wc, Pi);
              Pv(I || Pi);
              let N = a.get(on);
              return e !== void 0 && N.bootstrap(e), N;
            })
          );
        })
      );
    });
  } catch (e) {
    return Promise.reject(e);
  }
}
var Hd = class {
    constructor() {
      (this.views = []), (this.indexByContent = new Map());
    }
    add(e) {
      let n = JSON.stringify(e);
      if (!this.indexByContent.has(n)) {
        let r = this.views.length;
        return this.views.push(e), this.indexByContent.set(n, r), r;
      }
      return this.indexByContent.get(n);
    }
    getAll() {
      return this.views;
    }
  },
  H1 = 0;
function rE(t) {
  return t.ssrId || (t.ssrId = `t${H1++}`), t.ssrId;
}
function iE(t, e, n) {
  let r = [];
  return Ps(t, e, n, r), r.length;
}
function B1(t) {
  let e = [];
  return Zy(t, e), e.length;
}
function sE(t, e) {
  let n = t[Ze];
  return n && !n.hasAttribute(Rs) ? vc(n, t, e) : null;
}
function oE(t, e) {
  let n = Gg(t[Ze]),
    r = sE(n, e),
    i = st(n[Ze]),
    s = t[at],
    o = vc(i, s, e),
    a = n[qe],
    c = `${r}|${o}`;
  a.setAttribute(i, Ds, c);
}
function aE(t, e) {
  let n = new Hd(),
    r = new Map(),
    i = t._views;
  for (let a of i) {
    let c = Ky(a);
    if (c !== null) {
      let l = { serializedViewCollection: n, corruptedTextNodes: r };
      Ot(c) ? oE(c, l) : sE(c, l), q1(r, e);
    }
  }
  let s = n.getAll();
  t.injector.get(gn).set(df, s);
}
function U1(t, e) {
  let n = [],
    r = "";
  for (let i = _t; i < t.length; i++) {
    let s = t[i],
      o,
      a,
      c;
    if (qd(s) && ((s = s[nt]), Ot(s))) {
      (a = B1(s) + 1), oE(s, e);
      let u = Gg(s[Ze]);
      c = { [md]: u[ye].ssrId, [ki]: a };
    }
    if (!c) {
      let u = s[ye];
      u.type === 1
        ? ((o = u.ssrId), (a = 1))
        : ((o = rE(u)), (a = iE(u, s, u.firstChild))),
        (c = J({ [md]: o, [ki]: a }, cE(t[i], e)));
    }
    let l = JSON.stringify(c);
    if (n.length > 0 && l === r) {
      let u = n[n.length - 1];
      (u[oc] ??= 1), u[oc]++;
    } else (r = l), n.push(c);
  }
  return n;
}
function yc(t, e, n) {
  let r = e.index - nt;
  (t[gd] ??= {}), (t[gd][r] = EC(e, n));
}
function Eg(t, e) {
  let n = e.index - nt;
  (t[$a] ??= []), t[$a].includes(n) || t[$a].push(n);
}
function cE(t, e) {
  let n = {},
    r = t[ye];
  for (let i = nt; i < r.bindingStartIndex; i++) {
    let s = r.data[i],
      o = i - nt;
    if (m_(s)) {
      if (js(s, t) && z1(s)) {
        Eg(n, s);
        continue;
      }
      if (Array.isArray(s.projection)) {
        for (let a of s.projection)
          if (a)
            if (!Array.isArray(a))
              !jD(a) && !rc(a) && (js(a, t) ? Eg(n, a) : yc(n, a, t));
            else throw tC(st(t[i]));
      }
      if ((V1(n, s, t), Ot(t[i]))) {
        let a = s.tView;
        a !== null && ((n[pd] ??= {}), (n[pd][o] = rE(a)));
        let c = t[i][Ze];
        if (Array.isArray(c)) {
          let l = st(c);
          l.hasAttribute(Rs) || vc(l, c, e);
        }
        (n[Ls] ??= {}), (n[Ls][o] = U1(t[i], e));
      } else if (Array.isArray(t[i])) {
        let a = st(t[i][Ze]);
        a.hasAttribute(Rs) || vc(a, t[i], e);
      } else if (s.type & 8) (n[hd] ??= {}), (n[hd][o] = iE(r, t, s.child));
      else if (s.type & 16) {
        let a = s.next;
        for (; a !== null && a.type & 16; ) a = a.next;
        a && !rc(a) && yc(n, a, t);
      } else if (s.type & 1) {
        let a = st(t[i]);
        a.textContent === ""
          ? e.corruptedTextNodes.set(a, "ngetn")
          : a.nextSibling?.nodeType === Node.TEXT_NODE &&
            e.corruptedTextNodes.set(a, "ngtns");
      }
    }
  }
  return n;
}
function V1(t, e, n) {
  e.projectionNext &&
    e.projectionNext !== e.next &&
    !rc(e.projectionNext) &&
    yc(t, e.projectionNext, n),
    e.prev === null &&
      e.parent !== null &&
      js(e.parent, n) &&
      !js(e, n) &&
      yc(t, e, n);
}
function $1(t) {
  let e = t[nn];
  return e?.constructor
    ? ar(e.constructor)?.encapsulation === tn.ShadowDom
    : !1;
}
function vc(t, e, n) {
  let r = e[qe];
  if (HD(e) || $1(e)) return r.setAttribute(t, Rs, ""), null;
  {
    let i = cE(e, n),
      s = n.serializedViewCollection.add(i);
    return r.setAttribute(t, Ds, s.toString()), s;
  }
}
function q1(t, e) {
  for (let [n, r] of t) n.after(e.createComment(r));
}
function z1(t) {
  let e = t;
  for (; e != null; ) {
    if (ji(e)) return !0;
    e = e.parent;
  }
  return !1;
}
var bg = !1;
function G1() {
  bg || ((bg = !0), OT(), i1(), E1(), l1(), FC(), RC(), DC(), nS());
}
function W1(t, e) {
  return Zs(t);
}
function lE() {
  return mn([
    {
      provide: Si,
      useFactory: () => {
        let t = !0;
        return (
          La() && (t = !!G(gn, { optional: !0 })?.get(df, null)),
          t && Ks("NgHydration"),
          t
        );
      },
    },
    {
      provide: Ur,
      useValue: () => {
        La() && G(Si) && (K1(), G1());
      },
      multi: !0,
    },
    { provide: iv, useFactory: () => La() && G(Si) },
    {
      provide: Vi,
      useFactory: () => {
        if (La() && G(Si)) {
          let t = G(on),
            e = G(sn);
          return () => {
            W1(t, e).then(() => {
              je.assertInAngularZone(), dC(t);
            });
          };
        }
        return () => {};
      },
      multi: !0,
    },
  ]);
}
function K1() {
  let t = xc(),
    e;
  for (let n of t.body.childNodes)
    if (n.nodeType === Node.COMMENT_NODE && n.textContent?.trim() === ff) {
      e = n;
      break;
    }
  if (!e) throw new z(-507, !1);
}
function uE(t) {
  return typeof t == "boolean" ? t : t != null && t !== "false";
}
function XP(...t) {
  return t.reduce(
    (e, n) =>
      Object.assign(e, n, { providers: [...e.providers, ...n.providers] }),
    { providers: [] }
  );
}
var pE = null;
function yn() {
  return pE;
}
function Xc(t) {
  pE ??= t;
}
var Yc = class {},
  Ve = new ae(""),
  Js = (() => {
    let e = class e {
      historyGo(r) {
        throw new Error("");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = te({
        token: e,
        factory: () => G(Z1),
        providedIn: "platform",
      }));
    let t = e;
    return t;
  })();
var Z1 = (() => {
  let e = class e extends Js {
    constructor() {
      super(),
        (this._doc = G(Ve)),
        (this._location = window.location),
        (this._history = window.history);
    }
    getBaseHrefFromDOM() {
      return yn().getBaseHref(this._doc);
    }
    onPopState(r) {
      let i = yn().getGlobalEventTarget(this._doc, "window");
      return (
        i.addEventListener("popstate", r, !1),
        () => i.removeEventListener("popstate", r)
      );
    }
    onHashChange(r) {
      let i = yn().getGlobalEventTarget(this._doc, "window");
      return (
        i.addEventListener("hashchange", r, !1),
        () => i.removeEventListener("hashchange", r)
      );
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(r) {
      this._location.pathname = r;
    }
    pushState(r, i, s) {
      this._history.pushState(r, i, s);
    }
    replaceState(r, i, s) {
      this._history.replaceState(r, i, s);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(r = 0) {
      this._history.go(r);
    }
    getState() {
      return this._history.state;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = te({
      token: e,
      factory: () => new e(),
      providedIn: "platform",
    }));
  let t = e;
  return t;
})();
function mE(t, e) {
  if (t.length == 0) return e;
  if (e.length == 0) return t;
  let n = 0;
  return (
    t.endsWith("/") && n++,
    e.startsWith("/") && n++,
    n == 2 ? t + e.substring(1) : n == 1 ? t + e : t + "/" + e
  );
}
function dE(t) {
  let e = t.match(/#|\?|$/),
    n = (e && e.index) || t.length,
    r = n - (t[n - 1] === "/" ? 1 : 0);
  return t.slice(0, r) + t.slice(n);
}
function Xr(t) {
  return t && t[0] !== "?" ? "?" + t : t;
}
var Jc = (() => {
    let e = class e {
      historyGo(r) {
        throw new Error("");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = te({ token: e, factory: () => G(gE), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  X1 = new ae(""),
  gE = (() => {
    let e = class e extends Jc {
      constructor(r, i) {
        super(),
          (this._platformLocation = r),
          (this._removeListenerFns = []),
          (this._baseHref =
            i ??
            this._platformLocation.getBaseHrefFromDOM() ??
            G(Ve).location?.origin ??
            "");
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(r) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(r),
          this._platformLocation.onHashChange(r)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(r) {
        return mE(this._baseHref, r);
      }
      path(r = !1) {
        let i =
            this._platformLocation.pathname + Xr(this._platformLocation.search),
          s = this._platformLocation.hash;
        return s && r ? `${i}${s}` : i;
      }
      pushState(r, i, s, o) {
        let a = this.prepareExternalUrl(s + Xr(o));
        this._platformLocation.pushState(r, i, a);
      }
      replaceState(r, i, s, o) {
        let a = this.prepareExternalUrl(s + Xr(o));
        this._platformLocation.replaceState(r, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(r = 0) {
        this._platformLocation.historyGo?.(r);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(se(Js), se(X1, 8));
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
var eo = (() => {
  let e = class e {
    constructor(r) {
      (this._subject = new yt()),
        (this._urlChangeListeners = []),
        (this._urlChangeSubscription = null),
        (this._locationStrategy = r);
      let i = this._locationStrategy.getBaseHref();
      (this._basePath = tI(dE(fE(i)))),
        this._locationStrategy.onPopState((s) => {
          this._subject.emit({
            url: this.path(!0),
            pop: !0,
            state: s.state,
            type: s.type,
          });
        });
    }
    ngOnDestroy() {
      this._urlChangeSubscription?.unsubscribe(),
        (this._urlChangeListeners = []);
    }
    path(r = !1) {
      return this.normalize(this._locationStrategy.path(r));
    }
    getState() {
      return this._locationStrategy.getState();
    }
    isCurrentPathEqualTo(r, i = "") {
      return this.path() == this.normalize(r + Xr(i));
    }
    normalize(r) {
      return e.stripTrailingSlash(eI(this._basePath, fE(r)));
    }
    prepareExternalUrl(r) {
      return (
        r && r[0] !== "/" && (r = "/" + r),
        this._locationStrategy.prepareExternalUrl(r)
      );
    }
    go(r, i = "", s = null) {
      this._locationStrategy.pushState(s, "", r, i),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(r + Xr(i)), s);
    }
    replaceState(r, i = "", s = null) {
      this._locationStrategy.replaceState(s, "", r, i),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(r + Xr(i)), s);
    }
    forward() {
      this._locationStrategy.forward();
    }
    back() {
      this._locationStrategy.back();
    }
    historyGo(r = 0) {
      this._locationStrategy.historyGo?.(r);
    }
    onUrlChange(r) {
      return (
        this._urlChangeListeners.push(r),
        (this._urlChangeSubscription ??= this.subscribe((i) => {
          this._notifyUrlChangeListeners(i.url, i.state);
        })),
        () => {
          let i = this._urlChangeListeners.indexOf(r);
          this._urlChangeListeners.splice(i, 1),
            this._urlChangeListeners.length === 0 &&
              (this._urlChangeSubscription?.unsubscribe(),
              (this._urlChangeSubscription = null));
        }
      );
    }
    _notifyUrlChangeListeners(r = "", i) {
      this._urlChangeListeners.forEach((s) => s(r, i));
    }
    subscribe(r, i, s) {
      return this._subject.subscribe({ next: r, error: i, complete: s });
    }
  };
  (e.normalizeQueryParams = Xr),
    (e.joinWithSlash = mE),
    (e.stripTrailingSlash = dE),
    (e.ɵfac = function (i) {
      return new (i || e)(se(Jc));
    }),
    (e.ɵprov = te({ token: e, factory: () => J1(), providedIn: "root" }));
  let t = e;
  return t;
})();
function J1() {
  return new eo(se(Jc));
}
function eI(t, e) {
  if (!t || !e.startsWith(t)) return e;
  let n = e.substring(t.length);
  return n === "" || ["/", ";", "?", "#"].includes(n[0]) ? n : e;
}
function fE(t) {
  return t.replace(/\/index.html$/, "");
}
function tI(t) {
  if (new RegExp("^(https?:)?//").test(t)) {
    let [, n] = t.split(/\/\/[^\/]+/);
    return n;
  }
  return t;
}
function el(t, e) {
  e = encodeURIComponent(e);
  for (let n of t.split(";")) {
    let r = n.indexOf("="),
      [i, s] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
    if (i.trim() === e) return decodeURIComponent(s);
  }
  return null;
}
var Lf = class {
    constructor(e, n, r, i) {
      (this.$implicit = e),
        (this.ngForOf = n),
        (this.index = r),
        (this.count = i);
    }
    get first() {
      return this.index === 0;
    }
    get last() {
      return this.index === this.count - 1;
    }
    get even() {
      return this.index % 2 === 0;
    }
    get odd() {
      return !this.even;
    }
  },
  TF = (() => {
    let e = class e {
      set ngForOf(r) {
        (this._ngForOf = r), (this._ngForOfDirty = !0);
      }
      set ngForTrackBy(r) {
        this._trackByFn = r;
      }
      get ngForTrackBy() {
        return this._trackByFn;
      }
      constructor(r, i, s) {
        (this._viewContainer = r),
          (this._template = i),
          (this._differs = s),
          (this._ngForOf = null),
          (this._ngForOfDirty = !0),
          (this._differ = null);
      }
      set ngForTemplate(r) {
        r && (this._template = r);
      }
      ngDoCheck() {
        if (this._ngForOfDirty) {
          this._ngForOfDirty = !1;
          let r = this._ngForOf;
          if (!this._differ && r)
            if (0)
              try {
              } catch {}
            else this._differ = this._differs.find(r).create(this.ngForTrackBy);
        }
        if (this._differ) {
          let r = this._differ.diff(this._ngForOf);
          r && this._applyChanges(r);
        }
      }
      _applyChanges(r) {
        let i = this._viewContainer;
        r.forEachOperation((s, o, a) => {
          if (s.previousIndex == null)
            i.createEmbeddedView(
              this._template,
              new Lf(s.item, this._ngForOf, -1, -1),
              a === null ? void 0 : a
            );
          else if (a == null) i.remove(o === null ? void 0 : o);
          else if (o !== null) {
            let c = i.get(o);
            i.move(c, a), hE(c, s);
          }
        });
        for (let s = 0, o = i.length; s < o; s++) {
          let c = i.get(s).context;
          (c.index = s), (c.count = o), (c.ngForOf = this._ngForOf);
        }
        r.forEachIdentityChange((s) => {
          let o = i.get(s.currentIndex);
          hE(o, s);
        });
      }
      static ngTemplateContextGuard(r, i) {
        return !0;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(St(Yr), St(Ys), St(mf));
    }),
      (e.ɵdir = Wr({
        type: e,
        selectors: [["", "ngFor", "", "ngForOf", ""]],
        inputs: {
          ngForOf: "ngForOf",
          ngForTrackBy: "ngForTrackBy",
          ngForTemplate: "ngForTemplate",
        },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
function hE(t, e) {
  t.context.$implicit = e.item;
}
var nI = !0,
  Zc = class {
    constructor(e, n) {
      (this._viewContainerRef = e),
        (this._templateRef = n),
        (this._created = !1);
    }
    create() {
      (this._created = !0),
        this._viewContainerRef.createEmbeddedView(this._templateRef);
    }
    destroy() {
      (this._created = !1), this._viewContainerRef.clear();
    }
    enforceState(e) {
      e && !this._created
        ? this.create()
        : !e && this._created && this.destroy();
    }
  },
  yE = (() => {
    let e = class e {
      constructor() {
        (this._defaultViews = []),
          (this._defaultUsed = !1),
          (this._caseCount = 0),
          (this._lastCaseCheckIndex = 0),
          (this._lastCasesMatched = !1);
      }
      set ngSwitch(r) {
        (this._ngSwitch = r),
          this._caseCount === 0 && this._updateDefaultCases(!0);
      }
      _addCase() {
        return this._caseCount++;
      }
      _addDefault(r) {
        this._defaultViews.push(r);
      }
      _matchCase(r) {
        let i = nI ? r === this._ngSwitch : r == this._ngSwitch;
        return (
          (this._lastCasesMatched ||= i),
          this._lastCaseCheckIndex++,
          this._lastCaseCheckIndex === this._caseCount &&
            (this._updateDefaultCases(!this._lastCasesMatched),
            (this._lastCaseCheckIndex = 0),
            (this._lastCasesMatched = !1)),
          i
        );
      }
      _updateDefaultCases(r) {
        if (this._defaultViews.length > 0 && r !== this._defaultUsed) {
          this._defaultUsed = r;
          for (let i of this._defaultViews) i.enforceState(r);
        }
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = Wr({
        type: e,
        selectors: [["", "ngSwitch", ""]],
        inputs: { ngSwitch: "ngSwitch" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })(),
  SF = (() => {
    let e = class e {
      constructor(r, i, s) {
        (this.ngSwitch = s), s._addCase(), (this._view = new Zc(r, i));
      }
      ngDoCheck() {
        this._view.enforceState(this.ngSwitch._matchCase(this.ngSwitchCase));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(St(Yr), St(Ys), St(yE, 9));
    }),
      (e.ɵdir = Wr({
        type: e,
        selectors: [["", "ngSwitchCase", ""]],
        inputs: { ngSwitchCase: "ngSwitchCase" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })(),
  CF = (() => {
    let e = class e {
      constructor(r, i, s) {
        s._addDefault(new Zc(r, i));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(St(Yr), St(Ys), St(yE, 9));
    }),
      (e.ɵdir = Wr({
        type: e,
        selectors: [["", "ngSwitchDefault", ""]],
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
var rI = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Gr({ type: e })),
      (e.ɵinj = zr({}));
    let t = e;
    return t;
  })(),
  jf = "browser",
  Hf = "server";
function iI(t) {
  return t === jf;
}
function Bf(t) {
  return t === Hf;
}
var Uf = (() => {
    let e = class e {};
    e.ɵprov = te({
      token: e,
      providedIn: "root",
      factory: () => (iI(G(Pt)) ? new Pf(G(Ve), window) : new Xs()),
    });
    let t = e;
    return t;
  })(),
  Pf = class {
    constructor(e, n) {
      (this.document = e), (this.window = n), (this.offset = () => [0, 0]);
    }
    setOffset(e) {
      Array.isArray(e) ? (this.offset = () => e) : (this.offset = e);
    }
    getScrollPosition() {
      return [this.window.scrollX, this.window.scrollY];
    }
    scrollToPosition(e) {
      this.window.scrollTo(e[0], e[1]);
    }
    scrollToAnchor(e) {
      let n = sI(this.document, e);
      n && (this.scrollToElement(n), n.focus());
    }
    setHistoryScrollRestoration(e) {
      this.window.history.scrollRestoration = e;
    }
    scrollToElement(e) {
      let n = e.getBoundingClientRect(),
        r = n.left + this.window.pageXOffset,
        i = n.top + this.window.pageYOffset,
        s = this.offset();
      this.window.scrollTo(r - s[0], i - s[1]);
    }
  };
function sI(t, e) {
  let n = t.getElementById(e) || t.getElementsByName(e)[0];
  if (n) return n;
  if (
    typeof t.createTreeWalker == "function" &&
    t.body &&
    typeof t.body.attachShadow == "function"
  ) {
    let r = t.createTreeWalker(t.body, NodeFilter.SHOW_ELEMENT),
      i = r.currentNode;
    for (; i; ) {
      let s = i.shadowRoot;
      if (s) {
        let o = s.getElementById(e) || s.querySelector(`[name="${e}"]`);
        if (o) return o;
      }
      i = r.nextNode();
    }
  }
  return null;
}
var Xs = class {
    setOffset(e) {}
    getScrollPosition() {
      return [0, 0];
    }
    scrollToPosition(e) {}
    scrollToAnchor(e) {}
    setHistoryScrollRestoration(e) {}
  },
  hr = class {};
var no = class {},
  rl = class {},
  mr = class t {
    constructor(e) {
      (this.normalizedNames = new Map()),
        (this.lazyUpdate = null),
        e
          ? typeof e == "string"
            ? (this.lazyInit = () => {
                (this.headers = new Map()),
                  e
                    .split(
                      `
`
                    )
                    .forEach((n) => {
                      let r = n.indexOf(":");
                      if (r > 0) {
                        let i = n.slice(0, r),
                          s = i.toLowerCase(),
                          o = n.slice(r + 1).trim();
                        this.maybeSetNormalizedName(i, s),
                          this.headers.has(s)
                            ? this.headers.get(s).push(o)
                            : this.headers.set(s, [o]);
                      }
                    });
              })
            : typeof Headers < "u" && e instanceof Headers
            ? ((this.headers = new Map()),
              e.forEach((n, r) => {
                this.setHeaderEntries(r, n);
              }))
            : (this.lazyInit = () => {
                (this.headers = new Map()),
                  Object.entries(e).forEach(([n, r]) => {
                    this.setHeaderEntries(n, r);
                  });
              })
          : (this.headers = new Map());
    }
    has(e) {
      return this.init(), this.headers.has(e.toLowerCase());
    }
    get(e) {
      this.init();
      let n = this.headers.get(e.toLowerCase());
      return n && n.length > 0 ? n[0] : null;
    }
    keys() {
      return this.init(), Array.from(this.normalizedNames.values());
    }
    getAll(e) {
      return this.init(), this.headers.get(e.toLowerCase()) || null;
    }
    append(e, n) {
      return this.clone({ name: e, value: n, op: "a" });
    }
    set(e, n) {
      return this.clone({ name: e, value: n, op: "s" });
    }
    delete(e, n) {
      return this.clone({ name: e, value: n, op: "d" });
    }
    maybeSetNormalizedName(e, n) {
      this.normalizedNames.has(n) || this.normalizedNames.set(n, e);
    }
    init() {
      this.lazyInit &&
        (this.lazyInit instanceof t
          ? this.copyFrom(this.lazyInit)
          : this.lazyInit(),
        (this.lazyInit = null),
        this.lazyUpdate &&
          (this.lazyUpdate.forEach((e) => this.applyUpdate(e)),
          (this.lazyUpdate = null)));
    }
    copyFrom(e) {
      e.init(),
        Array.from(e.headers.keys()).forEach((n) => {
          this.headers.set(n, e.headers.get(n)),
            this.normalizedNames.set(n, e.normalizedNames.get(n));
        });
    }
    clone(e) {
      let n = new t();
      return (
        (n.lazyInit =
          this.lazyInit && this.lazyInit instanceof t ? this.lazyInit : this),
        (n.lazyUpdate = (this.lazyUpdate || []).concat([e])),
        n
      );
    }
    applyUpdate(e) {
      let n = e.name.toLowerCase();
      switch (e.op) {
        case "a":
        case "s":
          let r = e.value;
          if ((typeof r == "string" && (r = [r]), r.length === 0)) return;
          this.maybeSetNormalizedName(e.name, n);
          let i = (e.op === "a" ? this.headers.get(n) : void 0) || [];
          i.push(...r), this.headers.set(n, i);
          break;
        case "d":
          let s = e.value;
          if (!s) this.headers.delete(n), this.normalizedNames.delete(n);
          else {
            let o = this.headers.get(n);
            if (!o) return;
            (o = o.filter((a) => s.indexOf(a) === -1)),
              o.length === 0
                ? (this.headers.delete(n), this.normalizedNames.delete(n))
                : this.headers.set(n, o);
          }
          break;
      }
    }
    setHeaderEntries(e, n) {
      let r = (Array.isArray(n) ? n : [n]).map((s) => s.toString()),
        i = e.toLowerCase();
      this.headers.set(i, r), this.maybeSetNormalizedName(e, i);
    }
    forEach(e) {
      this.init(),
        Array.from(this.normalizedNames.keys()).forEach((n) =>
          e(this.normalizedNames.get(n), this.headers.get(n))
        );
    }
  };
var $f = class {
  encodeKey(e) {
    return vE(e);
  }
  encodeValue(e) {
    return vE(e);
  }
  decodeKey(e) {
    return decodeURIComponent(e);
  }
  decodeValue(e) {
    return decodeURIComponent(e);
  }
};
function cI(t, e) {
  let n = new Map();
  return (
    t.length > 0 &&
      t
        .replace(/^\?/, "")
        .split("&")
        .forEach((i) => {
          let s = i.indexOf("="),
            [o, a] =
              s == -1
                ? [e.decodeKey(i), ""]
                : [e.decodeKey(i.slice(0, s)), e.decodeValue(i.slice(s + 1))],
            c = n.get(o) || [];
          c.push(a), n.set(o, c);
        }),
    n
  );
}
var lI = /%(\d[a-f0-9])/gi,
  uI = {
    40: "@",
    "3A": ":",
    24: "$",
    "2C": ",",
    "3B": ";",
    "3D": "=",
    "3F": "?",
    "2F": "/",
  };
function vE(t) {
  return encodeURIComponent(t).replace(lI, (e, n) => uI[n] ?? e);
}
function tl(t) {
  return `${t}`;
}
var pr = class t {
  constructor(e = {}) {
    if (
      ((this.updates = null),
      (this.cloneFrom = null),
      (this.encoder = e.encoder || new $f()),
      e.fromString)
    ) {
      if (e.fromObject)
        throw new Error("Cannot specify both fromString and fromObject.");
      this.map = cI(e.fromString, this.encoder);
    } else
      e.fromObject
        ? ((this.map = new Map()),
          Object.keys(e.fromObject).forEach((n) => {
            let r = e.fromObject[n],
              i = Array.isArray(r) ? r.map(tl) : [tl(r)];
            this.map.set(n, i);
          }))
        : (this.map = null);
  }
  has(e) {
    return this.init(), this.map.has(e);
  }
  get(e) {
    this.init();
    let n = this.map.get(e);
    return n ? n[0] : null;
  }
  getAll(e) {
    return this.init(), this.map.get(e) || null;
  }
  keys() {
    return this.init(), Array.from(this.map.keys());
  }
  append(e, n) {
    return this.clone({ param: e, value: n, op: "a" });
  }
  appendAll(e) {
    let n = [];
    return (
      Object.keys(e).forEach((r) => {
        let i = e[r];
        Array.isArray(i)
          ? i.forEach((s) => {
              n.push({ param: r, value: s, op: "a" });
            })
          : n.push({ param: r, value: i, op: "a" });
      }),
      this.clone(n)
    );
  }
  set(e, n) {
    return this.clone({ param: e, value: n, op: "s" });
  }
  delete(e, n) {
    return this.clone({ param: e, value: n, op: "d" });
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((e) => {
          let n = this.encoder.encodeKey(e);
          return this.map
            .get(e)
            .map((r) => n + "=" + this.encoder.encodeValue(r))
            .join("&");
        })
        .filter((e) => e !== "")
        .join("&")
    );
  }
  clone(e) {
    let n = new t({ encoder: this.encoder });
    return (
      (n.cloneFrom = this.cloneFrom || this),
      (n.updates = (this.updates || []).concat(e)),
      n
    );
  }
  init() {
    this.map === null && (this.map = new Map()),
      this.cloneFrom !== null &&
        (this.cloneFrom.init(),
        this.cloneFrom
          .keys()
          .forEach((e) => this.map.set(e, this.cloneFrom.map.get(e))),
        this.updates.forEach((e) => {
          switch (e.op) {
            case "a":
            case "s":
              let n = (e.op === "a" ? this.map.get(e.param) : void 0) || [];
              n.push(tl(e.value)), this.map.set(e.param, n);
              break;
            case "d":
              if (e.value !== void 0) {
                let r = this.map.get(e.param) || [],
                  i = r.indexOf(tl(e.value));
                i !== -1 && r.splice(i, 1),
                  r.length > 0
                    ? this.map.set(e.param, r)
                    : this.map.delete(e.param);
              } else {
                this.map.delete(e.param);
                break;
              }
          }
        }),
        (this.cloneFrom = this.updates = null));
  }
};
var qf = class {
  constructor() {
    this.map = new Map();
  }
  set(e, n) {
    return this.map.set(e, n), this;
  }
  get(e) {
    return (
      this.map.has(e) || this.map.set(e, e.defaultValue()), this.map.get(e)
    );
  }
  delete(e) {
    return this.map.delete(e), this;
  }
  has(e) {
    return this.map.has(e);
  }
  keys() {
    return this.map.keys();
  }
};
function dI(t) {
  switch (t) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "JSONP":
      return !1;
    default:
      return !0;
  }
}
function EE(t) {
  return typeof ArrayBuffer < "u" && t instanceof ArrayBuffer;
}
function bE(t) {
  return typeof Blob < "u" && t instanceof Blob;
}
function wE(t) {
  return typeof FormData < "u" && t instanceof FormData;
}
function fI(t) {
  return typeof URLSearchParams < "u" && t instanceof URLSearchParams;
}
var to = class t {
    constructor(e, n, r, i) {
      (this.url = n),
        (this.body = null),
        (this.reportProgress = !1),
        (this.withCredentials = !1),
        (this.responseType = "json"),
        (this.method = e.toUpperCase());
      let s;
      if (
        (dI(this.method) || i
          ? ((this.body = r !== void 0 ? r : null), (s = i))
          : (s = r),
        s &&
          ((this.reportProgress = !!s.reportProgress),
          (this.withCredentials = !!s.withCredentials),
          s.responseType && (this.responseType = s.responseType),
          s.headers && (this.headers = s.headers),
          s.context && (this.context = s.context),
          s.params && (this.params = s.params),
          (this.transferCache = s.transferCache)),
        (this.headers ??= new mr()),
        (this.context ??= new qf()),
        !this.params)
      )
        (this.params = new pr()), (this.urlWithParams = n);
      else {
        let o = this.params.toString();
        if (o.length === 0) this.urlWithParams = n;
        else {
          let a = n.indexOf("?"),
            c = a === -1 ? "?" : a < n.length - 1 ? "&" : "";
          this.urlWithParams = n + c + o;
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : EE(this.body) ||
          bE(this.body) ||
          wE(this.body) ||
          fI(this.body) ||
          typeof this.body == "string"
        ? this.body
        : this.body instanceof pr
        ? this.body.toString()
        : typeof this.body == "object" ||
          typeof this.body == "boolean" ||
          Array.isArray(this.body)
        ? JSON.stringify(this.body)
        : this.body.toString();
    }
    detectContentTypeHeader() {
      return this.body === null || wE(this.body)
        ? null
        : bE(this.body)
        ? this.body.type || null
        : EE(this.body)
        ? null
        : typeof this.body == "string"
        ? "text/plain"
        : this.body instanceof pr
        ? "application/x-www-form-urlencoded;charset=UTF-8"
        : typeof this.body == "object" ||
          typeof this.body == "number" ||
          typeof this.body == "boolean"
        ? "application/json"
        : null;
    }
    clone(e = {}) {
      let n = e.method || this.method,
        r = e.url || this.url,
        i = e.responseType || this.responseType,
        s = e.body !== void 0 ? e.body : this.body,
        o =
          e.withCredentials !== void 0
            ? e.withCredentials
            : this.withCredentials,
        a =
          e.reportProgress !== void 0 ? e.reportProgress : this.reportProgress,
        c = e.headers || this.headers,
        l = e.params || this.params,
        u = e.context ?? this.context;
      return (
        e.setHeaders !== void 0 &&
          (c = Object.keys(e.setHeaders).reduce(
            (d, m) => d.set(m, e.setHeaders[m]),
            c
          )),
        e.setParams &&
          (l = Object.keys(e.setParams).reduce(
            (d, m) => d.set(m, e.setParams[m]),
            l
          )),
        new t(n, r, s, {
          params: l,
          headers: c,
          context: u,
          reportProgress: a,
          responseType: i,
          withCredentials: o,
        })
      );
    }
  },
  $i = (function (t) {
    return (
      (t[(t.Sent = 0)] = "Sent"),
      (t[(t.UploadProgress = 1)] = "UploadProgress"),
      (t[(t.ResponseHeader = 2)] = "ResponseHeader"),
      (t[(t.DownloadProgress = 3)] = "DownloadProgress"),
      (t[(t.Response = 4)] = "Response"),
      (t[(t.User = 5)] = "User"),
      t
    );
  })($i || {}),
  ro = class {
    constructor(e, n = sl.Ok, r = "OK") {
      (this.headers = e.headers || new mr()),
        (this.status = e.status !== void 0 ? e.status : n),
        (this.statusText = e.statusText || r),
        (this.url = e.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  },
  zf = class t extends ro {
    constructor(e = {}) {
      super(e), (this.type = $i.ResponseHeader);
    }
    clone(e = {}) {
      return new t({
        headers: e.headers || this.headers,
        status: e.status !== void 0 ? e.status : this.status,
        statusText: e.statusText || this.statusText,
        url: e.url || this.url || void 0,
      });
    }
  },
  qi = class t extends ro {
    constructor(e = {}) {
      super(e),
        (this.type = $i.Response),
        (this.body = e.body !== void 0 ? e.body : null);
    }
    clone(e = {}) {
      return new t({
        body: e.body !== void 0 ? e.body : this.body,
        headers: e.headers || this.headers,
        status: e.status !== void 0 ? e.status : this.status,
        statusText: e.statusText || this.statusText,
        url: e.url || this.url || void 0,
      });
    }
  },
  il = class extends ro {
    constructor(e) {
      super(e, 0, "Unknown Error"),
        (this.name = "HttpErrorResponse"),
        (this.ok = !1),
        this.status >= 200 && this.status < 300
          ? (this.message = `Http failure during parsing for ${
              e.url || "(unknown url)"
            }`)
          : (this.message = `Http failure response for ${
              e.url || "(unknown url)"
            }: ${e.status} ${e.statusText}`),
        (this.error = e.error || null);
    }
  },
  sl = (function (t) {
    return (
      (t[(t.Continue = 100)] = "Continue"),
      (t[(t.SwitchingProtocols = 101)] = "SwitchingProtocols"),
      (t[(t.Processing = 102)] = "Processing"),
      (t[(t.EarlyHints = 103)] = "EarlyHints"),
      (t[(t.Ok = 200)] = "Ok"),
      (t[(t.Created = 201)] = "Created"),
      (t[(t.Accepted = 202)] = "Accepted"),
      (t[(t.NonAuthoritativeInformation = 203)] =
        "NonAuthoritativeInformation"),
      (t[(t.NoContent = 204)] = "NoContent"),
      (t[(t.ResetContent = 205)] = "ResetContent"),
      (t[(t.PartialContent = 206)] = "PartialContent"),
      (t[(t.MultiStatus = 207)] = "MultiStatus"),
      (t[(t.AlreadyReported = 208)] = "AlreadyReported"),
      (t[(t.ImUsed = 226)] = "ImUsed"),
      (t[(t.MultipleChoices = 300)] = "MultipleChoices"),
      (t[(t.MovedPermanently = 301)] = "MovedPermanently"),
      (t[(t.Found = 302)] = "Found"),
      (t[(t.SeeOther = 303)] = "SeeOther"),
      (t[(t.NotModified = 304)] = "NotModified"),
      (t[(t.UseProxy = 305)] = "UseProxy"),
      (t[(t.Unused = 306)] = "Unused"),
      (t[(t.TemporaryRedirect = 307)] = "TemporaryRedirect"),
      (t[(t.PermanentRedirect = 308)] = "PermanentRedirect"),
      (t[(t.BadRequest = 400)] = "BadRequest"),
      (t[(t.Unauthorized = 401)] = "Unauthorized"),
      (t[(t.PaymentRequired = 402)] = "PaymentRequired"),
      (t[(t.Forbidden = 403)] = "Forbidden"),
      (t[(t.NotFound = 404)] = "NotFound"),
      (t[(t.MethodNotAllowed = 405)] = "MethodNotAllowed"),
      (t[(t.NotAcceptable = 406)] = "NotAcceptable"),
      (t[(t.ProxyAuthenticationRequired = 407)] =
        "ProxyAuthenticationRequired"),
      (t[(t.RequestTimeout = 408)] = "RequestTimeout"),
      (t[(t.Conflict = 409)] = "Conflict"),
      (t[(t.Gone = 410)] = "Gone"),
      (t[(t.LengthRequired = 411)] = "LengthRequired"),
      (t[(t.PreconditionFailed = 412)] = "PreconditionFailed"),
      (t[(t.PayloadTooLarge = 413)] = "PayloadTooLarge"),
      (t[(t.UriTooLong = 414)] = "UriTooLong"),
      (t[(t.UnsupportedMediaType = 415)] = "UnsupportedMediaType"),
      (t[(t.RangeNotSatisfiable = 416)] = "RangeNotSatisfiable"),
      (t[(t.ExpectationFailed = 417)] = "ExpectationFailed"),
      (t[(t.ImATeapot = 418)] = "ImATeapot"),
      (t[(t.MisdirectedRequest = 421)] = "MisdirectedRequest"),
      (t[(t.UnprocessableEntity = 422)] = "UnprocessableEntity"),
      (t[(t.Locked = 423)] = "Locked"),
      (t[(t.FailedDependency = 424)] = "FailedDependency"),
      (t[(t.TooEarly = 425)] = "TooEarly"),
      (t[(t.UpgradeRequired = 426)] = "UpgradeRequired"),
      (t[(t.PreconditionRequired = 428)] = "PreconditionRequired"),
      (t[(t.TooManyRequests = 429)] = "TooManyRequests"),
      (t[(t.RequestHeaderFieldsTooLarge = 431)] =
        "RequestHeaderFieldsTooLarge"),
      (t[(t.UnavailableForLegalReasons = 451)] = "UnavailableForLegalReasons"),
      (t[(t.InternalServerError = 500)] = "InternalServerError"),
      (t[(t.NotImplemented = 501)] = "NotImplemented"),
      (t[(t.BadGateway = 502)] = "BadGateway"),
      (t[(t.ServiceUnavailable = 503)] = "ServiceUnavailable"),
      (t[(t.GatewayTimeout = 504)] = "GatewayTimeout"),
      (t[(t.HttpVersionNotSupported = 505)] = "HttpVersionNotSupported"),
      (t[(t.VariantAlsoNegotiates = 506)] = "VariantAlsoNegotiates"),
      (t[(t.InsufficientStorage = 507)] = "InsufficientStorage"),
      (t[(t.LoopDetected = 508)] = "LoopDetected"),
      (t[(t.NotExtended = 510)] = "NotExtended"),
      (t[(t.NetworkAuthenticationRequired = 511)] =
        "NetworkAuthenticationRequired"),
      t
    );
  })(sl || {});
function Vf(t, e) {
  return {
    body: e,
    headers: t.headers,
    context: t.context,
    observe: t.observe,
    params: t.params,
    reportProgress: t.reportProgress,
    responseType: t.responseType,
    withCredentials: t.withCredentials,
    transferCache: t.transferCache,
  };
}
var hI = (() => {
  let e = class e {
    constructor(r) {
      this.handler = r;
    }
    request(r, i, s = {}) {
      let o;
      if (r instanceof to) o = r;
      else {
        let l;
        s.headers instanceof mr ? (l = s.headers) : (l = new mr(s.headers));
        let u;
        s.params &&
          (s.params instanceof pr
            ? (u = s.params)
            : (u = new pr({ fromObject: s.params }))),
          (o = new to(r, i, s.body !== void 0 ? s.body : null, {
            headers: l,
            context: s.context,
            params: u,
            reportProgress: s.reportProgress,
            responseType: s.responseType || "json",
            withCredentials: s.withCredentials,
            transferCache: s.transferCache,
          }));
      }
      let a = de(o).pipe(nr((l) => this.handler.handle(l)));
      if (r instanceof to || s.observe === "events") return a;
      let c = a.pipe(Nt((l) => l instanceof qi));
      switch (s.observe || "body") {
        case "body":
          switch (o.responseType) {
            case "arraybuffer":
              return c.pipe(
                Ee((l) => {
                  if (l.body !== null && !(l.body instanceof ArrayBuffer))
                    throw new Error("Response is not an ArrayBuffer.");
                  return l.body;
                })
              );
            case "blob":
              return c.pipe(
                Ee((l) => {
                  if (l.body !== null && !(l.body instanceof Blob))
                    throw new Error("Response is not a Blob.");
                  return l.body;
                })
              );
            case "text":
              return c.pipe(
                Ee((l) => {
                  if (l.body !== null && typeof l.body != "string")
                    throw new Error("Response is not a string.");
                  return l.body;
                })
              );
            case "json":
            default:
              return c.pipe(Ee((l) => l.body));
          }
        case "response":
          return c;
        default:
          throw new Error(`Unreachable: unhandled observe type ${s.observe}}`);
      }
    }
    delete(r, i = {}) {
      return this.request("DELETE", r, i);
    }
    get(r, i = {}) {
      return this.request("GET", r, i);
    }
    head(r, i = {}) {
      return this.request("HEAD", r, i);
    }
    jsonp(r, i) {
      return this.request("JSONP", r, {
        params: new pr().append(i, "JSONP_CALLBACK"),
        observe: "body",
        responseType: "json",
      });
    }
    options(r, i = {}) {
      return this.request("OPTIONS", r, i);
    }
    patch(r, i, s = {}) {
      return this.request("PATCH", r, Vf(s, i));
    }
    post(r, i, s = {}) {
      return this.request("POST", r, Vf(s, i));
    }
    put(r, i, s = {}) {
      return this.request("PUT", r, Vf(s, i));
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(se(no));
  }),
    (e.ɵprov = te({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
function pI(t, e) {
  return e(t);
}
function mI(t, e, n) {
  return (r, i) => jn(n, () => e(r, (s) => t(s, i)));
}
var AE = new ae(""),
  al = new ae(""),
  gI = new ae("");
var DE = (() => {
  let e = class e extends no {
    constructor(r, i) {
      super(),
        (this.backend = r),
        (this.injector = i),
        (this.chain = null),
        (this.pendingTasks = G(Ui));
      let s = G(gI, { optional: !0 });
      this.backend = s ?? r;
    }
    handle(r) {
      if (this.chain === null) {
        let s = Array.from(
          new Set([...this.injector.get(AE), ...this.injector.get(al, [])])
        );
        this.chain = s.reduceRight((o, a) => mI(o, a, this.injector), pI);
      }
      let i = this.pendingTasks.add();
      return this.chain(r, (s) => this.backend.handle(s)).pipe(
        Pr(() => this.pendingTasks.remove(i))
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(se(rl), se(Tt));
  }),
    (e.ɵprov = te({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
var yI = /^\)\]\}',?\n/;
function vI(t) {
  return "responseURL" in t && t.responseURL
    ? t.responseURL
    : /^X-Request-URL:/m.test(t.getAllResponseHeaders())
    ? t.getResponseHeader("X-Request-URL")
    : null;
}
var _E = (() => {
    let e = class e {
      constructor(r) {
        this.xhrFactory = r;
      }
      handle(r) {
        if (r.method === "JSONP") throw new z(-2800, !1);
        let i = this.xhrFactory;
        return (i.ɵloadImpl ? Ye(i.ɵloadImpl()) : de(null)).pipe(
          At(
            () =>
              new Ae((o) => {
                let a = i.build();
                if (
                  (a.open(r.method, r.urlWithParams),
                  r.withCredentials && (a.withCredentials = !0),
                  r.headers.forEach((F, x) =>
                    a.setRequestHeader(F, x.join(","))
                  ),
                  r.headers.has("Accept") ||
                    a.setRequestHeader(
                      "Accept",
                      "application/json, text/plain, */*"
                    ),
                  !r.headers.has("Content-Type"))
                ) {
                  let F = r.detectContentTypeHeader();
                  F !== null && a.setRequestHeader("Content-Type", F);
                }
                if (r.responseType) {
                  let F = r.responseType.toLowerCase();
                  a.responseType = F !== "json" ? F : "text";
                }
                let c = r.serializeBody(),
                  l = null,
                  u = () => {
                    if (l !== null) return l;
                    let F = a.statusText || "OK",
                      x = new mr(a.getAllResponseHeaders()),
                      _ = vI(a) || r.url;
                    return (
                      (l = new zf({
                        headers: x,
                        status: a.status,
                        statusText: F,
                        url: _,
                      })),
                      l
                    );
                  },
                  d = () => {
                    let { headers: F, status: x, statusText: _, url: w } = u(),
                      T = null;
                    x !== sl.NoContent &&
                      (T =
                        typeof a.response > "u" ? a.responseText : a.response),
                      x === 0 && (x = T ? sl.Ok : 0);
                    let E = x >= 200 && x < 300;
                    if (r.responseType === "json" && typeof T == "string") {
                      let ee = T;
                      T = T.replace(yI, "");
                      try {
                        T = T !== "" ? JSON.parse(T) : null;
                      } catch (ne) {
                        (T = ee), E && ((E = !1), (T = { error: ne, text: T }));
                      }
                    }
                    E
                      ? (o.next(
                          new qi({
                            body: T,
                            headers: F,
                            status: x,
                            statusText: _,
                            url: w || void 0,
                          })
                        ),
                        o.complete())
                      : o.error(
                          new il({
                            error: T,
                            headers: F,
                            status: x,
                            statusText: _,
                            url: w || void 0,
                          })
                        );
                  },
                  m = (F) => {
                    let { url: x } = u(),
                      _ = new il({
                        error: F,
                        status: a.status || 0,
                        statusText: a.statusText || "Unknown Error",
                        url: x || void 0,
                      });
                    o.error(_);
                  },
                  b = !1,
                  I = (F) => {
                    b || (o.next(u()), (b = !0));
                    let x = { type: $i.DownloadProgress, loaded: F.loaded };
                    F.lengthComputable && (x.total = F.total),
                      r.responseType === "text" &&
                        a.responseText &&
                        (x.partialText = a.responseText),
                      o.next(x);
                  },
                  N = (F) => {
                    let x = { type: $i.UploadProgress, loaded: F.loaded };
                    F.lengthComputable && (x.total = F.total), o.next(x);
                  };
                return (
                  a.addEventListener("load", d),
                  a.addEventListener("error", m),
                  a.addEventListener("timeout", m),
                  a.addEventListener("abort", m),
                  r.reportProgress &&
                    (a.addEventListener("progress", I),
                    c !== null &&
                      a.upload &&
                      a.upload.addEventListener("progress", N)),
                  a.send(c),
                  o.next({ type: $i.Sent }),
                  () => {
                    a.removeEventListener("error", m),
                      a.removeEventListener("abort", m),
                      a.removeEventListener("load", d),
                      a.removeEventListener("timeout", m),
                      r.reportProgress &&
                        (a.removeEventListener("progress", I),
                        c !== null &&
                          a.upload &&
                          a.upload.removeEventListener("progress", N)),
                      a.readyState !== a.DONE && a.abort();
                  }
                );
              })
          )
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(se(hr));
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  xE = new ae(""),
  EI = "XSRF-TOKEN",
  bI = new ae("", { providedIn: "root", factory: () => EI }),
  wI = "X-XSRF-TOKEN",
  DI = new ae("", { providedIn: "root", factory: () => wI }),
  ol = class {},
  _I = (() => {
    let e = class e {
      constructor(r, i, s) {
        (this.doc = r),
          (this.platform = i),
          (this.cookieName = s),
          (this.lastCookieString = ""),
          (this.lastToken = null),
          (this.parseCount = 0);
      }
      getToken() {
        if (this.platform === "server") return null;
        let r = this.doc.cookie || "";
        return (
          r !== this.lastCookieString &&
            (this.parseCount++,
            (this.lastToken = el(r, this.cookieName)),
            (this.lastCookieString = r)),
          this.lastToken
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(se(Ve), se(Pt), se(bI));
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function TI(t, e) {
  let n = t.url.toLowerCase();
  if (
    !G(xE) ||
    t.method === "GET" ||
    t.method === "HEAD" ||
    n.startsWith("http://") ||
    n.startsWith("https://")
  )
    return e(t);
  let r = G(ol).getToken(),
    i = G(DI);
  return (
    r != null &&
      !t.headers.has(i) &&
      (t = t.clone({ headers: t.headers.set(i, r) })),
    e(t)
  );
}
function jF(...t) {
  let e = [
    hI,
    _E,
    DE,
    { provide: no, useExisting: DE },
    { provide: rl, useExisting: _E },
    { provide: AE, useValue: TI, multi: !0 },
    { provide: xE, useValue: !0 },
    { provide: ol, useClass: _I },
  ];
  for (let n of t) e.push(...n.ɵproviders);
  return mn(e);
}
var TE = "b",
  SE = "h",
  CE = "s",
  IE = "st",
  ME = "u",
  NE = "rt",
  nl = new ae(""),
  SI = ["GET", "HEAD"];
function CI(t, e) {
  let u = G(nl),
    { isCacheActive: n } = u,
    r = ca(u, ["isCacheActive"]),
    { transferCache: i, method: s } = t;
  if (
    !n ||
    (s === "POST" && !r.includePostRequests && !i) ||
    (s !== "POST" && !SI.includes(s)) ||
    i === !1 ||
    r.filter?.(t) === !1
  )
    return e(t);
  let o = G(gn),
    a = MI(t),
    c = o.get(a, null),
    l = r.includeHeaders;
  if ((typeof i == "object" && i.includeHeaders && (l = i.includeHeaders), c)) {
    let { [TE]: d, [NE]: m, [SE]: b, [CE]: I, [IE]: N, [ME]: F } = c,
      x = d;
    switch (m) {
      case "arraybuffer":
        x = new TextEncoder().encode(d).buffer;
        break;
      case "blob":
        x = new Blob([d]);
        break;
    }
    let _ = new mr(b);
    return de(
      new qi({ body: x, headers: _, status: I, statusText: N, url: F })
    );
  }
  return e(t).pipe(
    tt((d) => {
      d instanceof qi &&
        o.set(a, {
          [TE]: d.body,
          [SE]: II(d.headers, l),
          [CE]: d.status,
          [IE]: d.statusText,
          [ME]: d.url || "",
          [NE]: t.responseType,
        });
    })
  );
}
function II(t, e) {
  if (!e) return {};
  let n = {};
  for (let r of e) {
    let i = t.getAll(r);
    i !== null && (n[r] = i);
  }
  return n;
}
function MI(t) {
  let { params: e, method: n, responseType: r, url: i } = t,
    s = e
      .keys()
      .sort()
      .map((c) => `${c}=${e.getAll(c)}`)
      .join("&"),
    o = n + "." + r + "." + i + "?" + s,
    a = NI(o);
  return a;
}
function NI(t) {
  let e = 0;
  for (let n of t) e = (Math.imul(31, e) + n.charCodeAt(0)) << 0;
  return (e += 2147483648), e.toString();
}
function RE(t) {
  return [
    {
      provide: nl,
      useFactory: () => (
        Ks("NgHttpTransferCache"), J({ isCacheActive: !0 }, t)
      ),
    },
    { provide: al, useValue: CI, multi: !0, deps: [gn, nl] },
    {
      provide: Vi,
      multi: !0,
      useFactory: () => {
        let e = G(on),
          n = G(nl);
        return () => {
          Zs(e).then(() => {
            n.isCacheActive = !1;
          });
        };
      },
    },
  ];
}
var Kf = class extends Yc {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  so = class t extends Kf {
    static makeCurrent() {
      Xc(new t());
    }
    onAndCancel(e, n, r) {
      return (
        e.addEventListener(n, r),
        () => {
          e.removeEventListener(n, r);
        }
      );
    }
    dispatchEvent(e, n) {
      e.dispatchEvent(n);
    }
    remove(e) {
      e.parentNode && e.parentNode.removeChild(e);
    }
    createElement(e, n) {
      return (n = n || this.getDefaultDocument()), n.createElement(e);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(e) {
      return e.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(e) {
      return e instanceof DocumentFragment;
    }
    getGlobalEventTarget(e, n) {
      return n === "window"
        ? window
        : n === "document"
        ? e
        : n === "body"
        ? e.body
        : null;
    }
    getBaseHref(e) {
      let n = AI();
      return n == null ? null : xI(n);
    }
    resetBaseElement() {
      io = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(e) {
      return el(document.cookie, e);
    }
  },
  io = null;
function AI() {
  return (
    (io = io || document.querySelector("base")),
    io ? io.getAttribute("href") : null
  );
}
function xI(t) {
  return new URL(t, document.baseURI).pathname;
}
var RI = (() => {
    let e = class e {
      build() {
        return new XMLHttpRequest();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  oo = new ae(""),
  LE = (() => {
    let e = class e {
      constructor(r, i) {
        (this._zone = i),
          (this._eventNameToPlugin = new Map()),
          r.forEach((s) => {
            s.manager = this;
          }),
          (this._plugins = r.slice().reverse());
      }
      addEventListener(r, i, s) {
        return this._findPluginFor(i).addEventListener(r, i, s);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(r) {
        let i = this._eventNameToPlugin.get(r);
        if (i) return i;
        if (((i = this._plugins.find((o) => o.supports(r))), !i))
          throw new z(5101, !1);
        return this._eventNameToPlugin.set(r, i), i;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(se(oo), se(je));
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  zi = class {
    constructor(e) {
      this._doc = e;
    }
  },
  Gf = "ng-app-id",
  PE = (() => {
    let e = class e {
      constructor(r, i, s, o = {}) {
        (this.doc = r),
          (this.appId = i),
          (this.nonce = s),
          (this.platformId = o),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = Bf(o)),
          this.resetHostNodes();
      }
      addStyles(r) {
        for (let i of r)
          this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i);
      }
      removeStyles(r) {
        for (let i of r)
          this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i);
      }
      ngOnDestroy() {
        let r = this.styleNodesInDOM;
        r && (r.forEach((i) => i.remove()), r.clear());
        for (let i of this.getAllStyles()) this.onStyleRemoved(i);
        this.resetHostNodes();
      }
      addHost(r) {
        this.hostNodes.add(r);
        for (let i of this.getAllStyles()) this.addStyleToHost(r, i);
      }
      removeHost(r) {
        this.hostNodes.delete(r);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(r) {
        for (let i of this.hostNodes) this.addStyleToHost(i, r);
      }
      onStyleRemoved(r) {
        let i = this.styleRef;
        i.get(r)?.elements?.forEach((s) => s.remove()), i.delete(r);
      }
      collectServerRenderedStyles() {
        let r = this.doc.head?.querySelectorAll(`style[${Gf}="${this.appId}"]`);
        if (r?.length) {
          let i = new Map();
          return (
            r.forEach((s) => {
              s.textContent != null && i.set(s.textContent, s);
            }),
            i
          );
        }
        return null;
      }
      changeUsageCount(r, i) {
        let s = this.styleRef;
        if (s.has(r)) {
          let o = s.get(r);
          return (o.usage += i), o.usage;
        }
        return s.set(r, { usage: i, elements: [] }), i;
      }
      getStyleElement(r, i) {
        let s = this.styleNodesInDOM,
          o = s?.get(i);
        if (o?.parentNode === r) return s.delete(i), o.removeAttribute(Gf), o;
        {
          let a = this.doc.createElement("style");
          return (
            this.nonce && a.setAttribute("nonce", this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(Gf, this.appId),
            r.appendChild(a),
            a
          );
        }
      }
      addStyleToHost(r, i) {
        let s = this.getStyleElement(r, i),
          o = this.styleRef,
          a = o.get(i)?.elements;
        a ? a.push(s) : o.set(i, { elements: [s], usage: 1 });
      }
      resetHostNodes() {
        let r = this.hostNodes;
        r.clear(), r.add(this.doc.head);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(se(Ve), se(Bi), se(nf, 8), se(Pt));
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Wf = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/MathML/",
  },
  Zf = /%COMP%/g,
  FE = "%COMP%",
  OI = `_nghost-${FE}`,
  kI = `_ngcontent-${FE}`,
  LI = !0,
  PI = new ae("", { providedIn: "root", factory: () => LI });
function FI(t) {
  return kI.replace(Zf, t);
}
function jI(t) {
  return OI.replace(Zf, t);
}
function jE(t, e) {
  return e.map((n) => n.replace(Zf, t));
}
var cl = (() => {
    let e = class e {
      constructor(r, i, s, o, a, c, l, u = null) {
        (this.eventManager = r),
          (this.sharedStylesHost = i),
          (this.appId = s),
          (this.removeStylesOnCompDestroy = o),
          (this.doc = a),
          (this.platformId = c),
          (this.ngZone = l),
          (this.nonce = u),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = Bf(c)),
          (this.defaultRenderer = new ao(r, a, l, this.platformIsServer));
      }
      createRenderer(r, i) {
        if (!r || !i) return this.defaultRenderer;
        this.platformIsServer &&
          i.encapsulation === tn.ShadowDom &&
          (i = Je(J({}, i), { encapsulation: tn.Emulated }));
        let s = this.getOrCreateRenderer(r, i);
        return (
          s instanceof ll
            ? s.applyToHost(r)
            : s instanceof co && s.applyStyles(),
          s
        );
      }
      getOrCreateRenderer(r, i) {
        let s = this.rendererByCompId,
          o = s.get(i.id);
        if (!o) {
          let a = this.doc,
            c = this.ngZone,
            l = this.eventManager,
            u = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            m = this.platformIsServer;
          switch (i.encapsulation) {
            case tn.Emulated:
              o = new ll(l, u, i, this.appId, d, a, c, m);
              break;
            case tn.ShadowDom:
              return new Qf(l, u, r, i, a, c, this.nonce, m);
            default:
              o = new co(l, u, i, d, a, c, m);
              break;
          }
          s.set(i.id, o);
        }
        return o;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        se(LE),
        se(PE),
        se(Bi),
        se(PI),
        se(Ve),
        se(Pt),
        se(je),
        se(nf)
      );
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  ao = class {
    constructor(e, n, r, i) {
      (this.eventManager = e),
        (this.doc = n),
        (this.ngZone = r),
        (this.platformIsServer = i),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(e, n) {
      return n
        ? this.doc.createElementNS(Wf[n] || n, e)
        : this.doc.createElement(e);
    }
    createComment(e) {
      return this.doc.createComment(e);
    }
    createText(e) {
      return this.doc.createTextNode(e);
    }
    appendChild(e, n) {
      (OE(e) ? e.content : e).appendChild(n);
    }
    insertBefore(e, n, r) {
      e && (OE(e) ? e.content : e).insertBefore(n, r);
    }
    removeChild(e, n) {
      e && e.removeChild(n);
    }
    selectRootElement(e, n) {
      let r = typeof e == "string" ? this.doc.querySelector(e) : e;
      if (!r) throw new z(-5104, !1);
      return n || (r.textContent = ""), r;
    }
    parentNode(e) {
      return e.parentNode;
    }
    nextSibling(e) {
      return e.nextSibling;
    }
    setAttribute(e, n, r, i) {
      if (i) {
        n = i + ":" + n;
        let s = Wf[i];
        s ? e.setAttributeNS(s, n, r) : e.setAttribute(n, r);
      } else e.setAttribute(n, r);
    }
    removeAttribute(e, n, r) {
      if (r) {
        let i = Wf[r];
        i ? e.removeAttributeNS(i, n) : e.removeAttribute(`${r}:${n}`);
      } else e.removeAttribute(n);
    }
    addClass(e, n) {
      e.classList.add(n);
    }
    removeClass(e, n) {
      e.classList.remove(n);
    }
    setStyle(e, n, r, i) {
      i & (Fn.DashCase | Fn.Important)
        ? e.style.setProperty(n, r, i & Fn.Important ? "important" : "")
        : (e.style[n] = r);
    }
    removeStyle(e, n, r) {
      r & Fn.DashCase ? e.style.removeProperty(n) : (e.style[n] = "");
    }
    setProperty(e, n, r) {
      e != null && (e[n] = r);
    }
    setValue(e, n) {
      e.nodeValue = n;
    }
    listen(e, n, r) {
      if (
        typeof e == "string" &&
        ((e = yn().getGlobalEventTarget(this.doc, e)), !e)
      )
        throw new Error(`Unsupported event target ${e} for event ${n}`);
      return this.eventManager.addEventListener(
        e,
        n,
        this.decoratePreventDefault(r)
      );
    }
    decoratePreventDefault(e) {
      return (n) => {
        if (n === "__ngUnwrap__") return e;
        (this.platformIsServer ? this.ngZone.runGuarded(() => e(n)) : e(n)) ===
          !1 && n.preventDefault();
      };
    }
  };
function OE(t) {
  return t.tagName === "TEMPLATE" && t.content !== void 0;
}
var Qf = class extends ao {
    constructor(e, n, r, i, s, o, a, c) {
      super(e, s, o, c),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let l = jE(i.id, i.styles);
      for (let u of l) {
        let d = document.createElement("style");
        a && d.setAttribute("nonce", a),
          (d.textContent = u),
          this.shadowRoot.appendChild(d);
      }
    }
    nodeOrShadowRoot(e) {
      return e === this.hostEl ? this.shadowRoot : e;
    }
    appendChild(e, n) {
      return super.appendChild(this.nodeOrShadowRoot(e), n);
    }
    insertBefore(e, n, r) {
      return super.insertBefore(this.nodeOrShadowRoot(e), n, r);
    }
    removeChild(e, n) {
      return super.removeChild(this.nodeOrShadowRoot(e), n);
    }
    parentNode(e) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  co = class extends ao {
    constructor(e, n, r, i, s, o, a, c) {
      super(e, s, o, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = c ? jE(c, r.styles) : r.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  ll = class extends co {
    constructor(e, n, r, i, s, o, a, c) {
      let l = i + "-" + r.id;
      super(e, n, r, s, o, a, c, l),
        (this.contentAttr = FI(l)),
        (this.hostAttr = jI(l));
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, "");
    }
    createElement(e, n) {
      let r = super.createElement(e, n);
      return super.setAttribute(r, this.contentAttr, ""), r;
    }
  },
  HI = (() => {
    let e = class e extends zi {
      constructor(r) {
        super(r);
      }
      supports(r) {
        return !0;
      }
      addEventListener(r, i, s) {
        return (
          r.addEventListener(i, s, !1), () => this.removeEventListener(r, i, s)
        );
      }
      removeEventListener(r, i, s) {
        return r.removeEventListener(i, s);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(se(Ve));
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  kE = ["alt", "control", "meta", "shift"],
  BI = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  UI = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  VI = (() => {
    let e = class e extends zi {
      constructor(r) {
        super(r);
      }
      supports(r) {
        return e.parseEventName(r) != null;
      }
      addEventListener(r, i, s) {
        let o = e.parseEventName(i),
          a = e.eventCallback(o.fullKey, s, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => yn().onAndCancel(r, o.domEventName, a));
      }
      static parseEventName(r) {
        let i = r.toLowerCase().split("."),
          s = i.shift();
        if (i.length === 0 || !(s === "keydown" || s === "keyup")) return null;
        let o = e._normalizeKey(i.pop()),
          a = "",
          c = i.indexOf("code");
        if (
          (c > -1 && (i.splice(c, 1), (a = "code.")),
          kE.forEach((u) => {
            let d = i.indexOf(u);
            d > -1 && (i.splice(d, 1), (a += u + "."));
          }),
          (a += o),
          i.length != 0 || o.length === 0)
        )
          return null;
        let l = {};
        return (l.domEventName = s), (l.fullKey = a), l;
      }
      static matchEventFullKeyCode(r, i) {
        let s = BI[r.key] || r.key,
          o = "";
        return (
          i.indexOf("code.") > -1 && ((s = r.code), (o = "code.")),
          s == null || !s
            ? !1
            : ((s = s.toLowerCase()),
              s === " " ? (s = "space") : s === "." && (s = "dot"),
              kE.forEach((a) => {
                if (a !== s) {
                  let c = UI[a];
                  c(r) && (o += a + ".");
                }
              }),
              (o += s),
              o === i)
        );
      }
      static eventCallback(r, i, s) {
        return (o) => {
          e.matchEventFullKeyCode(o, r) && s.runGuarded(() => i(o));
        };
      }
      static _normalizeKey(r) {
        return r === "esc" ? "escape" : r;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(se(Ve));
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function r2(t, e) {
  return nE(J({ rootComponent: t }, $I(e)));
}
function $I(t) {
  return {
    appProviders: [...KI, ...(t?.providers ?? [])],
    platformProviders: WI,
  };
}
function qI() {
  so.makeCurrent();
}
function zI() {
  return new pn();
}
function GI() {
  return Ac(document), document;
}
var WI = [
  { provide: Pt, useValue: jf },
  { provide: zs, useValue: qI, multi: !0 },
  { provide: Ve, useFactory: GI, deps: [] },
];
var KI = [
  { provide: Nc, useValue: "root" },
  { provide: pn, useFactory: zI, deps: [] },
  { provide: oo, useClass: HI, multi: !0, deps: [Ve, je, Pt] },
  { provide: oo, useClass: VI, multi: !0, deps: [Ve] },
  cl,
  PE,
  LE,
  { provide: Vr, useExisting: cl },
  { provide: hr, useClass: RI, deps: [] },
  [],
];
var HE = (() => {
  let e = class e {
    constructor(r) {
      this._doc = r;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(r) {
      this._doc.title = r || "";
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(se(Ve));
  }),
    (e.ɵprov = te({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var Yf = (function (t) {
  return (
    (t[(t.NoHttpTransferCache = 0)] = "NoHttpTransferCache"),
    (t[(t.HttpTransferCacheOptions = 1)] = "HttpTransferCacheOptions"),
    t
  );
})(Yf || {});
function i2(...t) {
  let e = [],
    n = new Set(),
    r = n.has(Yf.HttpTransferCacheOptions);
  for (let { ɵproviders: i, ɵkind: s } of t) n.add(s), i.length && e.push(i);
  return mn([[], lE(), n.has(Yf.NoHttpTransferCache) || r ? [] : RE({}), e]);
}
var De = (function (t) {
    return (
      (t[(t.State = 0)] = "State"),
      (t[(t.Transition = 1)] = "Transition"),
      (t[(t.Sequence = 2)] = "Sequence"),
      (t[(t.Group = 3)] = "Group"),
      (t[(t.Animate = 4)] = "Animate"),
      (t[(t.Keyframes = 5)] = "Keyframes"),
      (t[(t.Style = 6)] = "Style"),
      (t[(t.Trigger = 7)] = "Trigger"),
      (t[(t.Reference = 8)] = "Reference"),
      (t[(t.AnimateChild = 9)] = "AnimateChild"),
      (t[(t.AnimateRef = 10)] = "AnimateRef"),
      (t[(t.Query = 11)] = "Query"),
      (t[(t.Stagger = 12)] = "Stagger"),
      t
    );
  })(De || {}),
  vn = "*";
function BE(t, e = null) {
  return { type: De.Sequence, steps: t, options: e };
}
function Xf(t) {
  return { type: De.Style, styles: t, offset: null };
}
var gr = class {
    constructor(e = 0, n = 0) {
      (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._onDestroyFns = []),
        (this._originalOnDoneFns = []),
        (this._originalOnStartFns = []),
        (this._started = !1),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._position = 0),
        (this.parentPlayer = null),
        (this.totalTime = e + n);
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((e) => e()),
        (this._onDoneFns = []));
    }
    onStart(e) {
      this._originalOnStartFns.push(e), this._onStartFns.push(e);
    }
    onDone(e) {
      this._originalOnDoneFns.push(e), this._onDoneFns.push(e);
    }
    onDestroy(e) {
      this._onDestroyFns.push(e);
    }
    hasStarted() {
      return this._started;
    }
    init() {}
    play() {
      this.hasStarted() || (this._onStart(), this.triggerMicrotask()),
        (this._started = !0);
    }
    triggerMicrotask() {
      queueMicrotask(() => this._onFinish());
    }
    _onStart() {
      this._onStartFns.forEach((e) => e()), (this._onStartFns = []);
    }
    pause() {}
    restart() {}
    finish() {
      this._onFinish();
    }
    destroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this.hasStarted() || this._onStart(),
        this.finish(),
        this._onDestroyFns.forEach((e) => e()),
        (this._onDestroyFns = []));
    }
    reset() {
      (this._started = !1),
        (this._finished = !1),
        (this._onStartFns = this._originalOnStartFns),
        (this._onDoneFns = this._originalOnDoneFns);
    }
    setPosition(e) {
      this._position = this.totalTime ? e * this.totalTime : 1;
    }
    getPosition() {
      return this.totalTime ? this._position / this.totalTime : 1;
    }
    triggerCallback(e) {
      let n = e == "start" ? this._onStartFns : this._onDoneFns;
      n.forEach((r) => r()), (n.length = 0);
    }
  },
  lo = class {
    constructor(e) {
      (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._finished = !1),
        (this._started = !1),
        (this._destroyed = !1),
        (this._onDestroyFns = []),
        (this.parentPlayer = null),
        (this.totalTime = 0),
        (this.players = e);
      let n = 0,
        r = 0,
        i = 0,
        s = this.players.length;
      s == 0
        ? queueMicrotask(() => this._onFinish())
        : this.players.forEach((o) => {
            o.onDone(() => {
              ++n == s && this._onFinish();
            }),
              o.onDestroy(() => {
                ++r == s && this._onDestroy();
              }),
              o.onStart(() => {
                ++i == s && this._onStart();
              });
          }),
        (this.totalTime = this.players.reduce(
          (o, a) => Math.max(o, a.totalTime),
          0
        ));
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((e) => e()),
        (this._onDoneFns = []));
    }
    init() {
      this.players.forEach((e) => e.init());
    }
    onStart(e) {
      this._onStartFns.push(e);
    }
    _onStart() {
      this.hasStarted() ||
        ((this._started = !0),
        this._onStartFns.forEach((e) => e()),
        (this._onStartFns = []));
    }
    onDone(e) {
      this._onDoneFns.push(e);
    }
    onDestroy(e) {
      this._onDestroyFns.push(e);
    }
    hasStarted() {
      return this._started;
    }
    play() {
      this.parentPlayer || this.init(),
        this._onStart(),
        this.players.forEach((e) => e.play());
    }
    pause() {
      this.players.forEach((e) => e.pause());
    }
    restart() {
      this.players.forEach((e) => e.restart());
    }
    finish() {
      this._onFinish(), this.players.forEach((e) => e.finish());
    }
    destroy() {
      this._onDestroy();
    }
    _onDestroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this._onFinish(),
        this.players.forEach((e) => e.destroy()),
        this._onDestroyFns.forEach((e) => e()),
        (this._onDestroyFns = []));
    }
    reset() {
      this.players.forEach((e) => e.reset()),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._started = !1);
    }
    setPosition(e) {
      let n = e * this.totalTime;
      this.players.forEach((r) => {
        let i = r.totalTime ? Math.min(1, n / r.totalTime) : 1;
        r.setPosition(i);
      });
    }
    getPosition() {
      let e = this.players.reduce(
        (n, r) => (n === null || r.totalTime > n.totalTime ? r : n),
        null
      );
      return e != null ? e.getPosition() : 0;
    }
    beforeDestroy() {
      this.players.forEach((e) => {
        e.beforeDestroy && e.beforeDestroy();
      });
    }
    triggerCallback(e) {
      let n = e == "start" ? this._onStartFns : this._onDoneFns;
      n.forEach((r) => r()), (n.length = 0);
    }
  },
  ul = "!";
function UE(t) {
  return new z(3e3, !1);
}
function YI() {
  return new z(3100, !1);
}
function ZI() {
  return new z(3101, !1);
}
function XI(t) {
  return new z(3001, !1);
}
function JI(t) {
  return new z(3003, !1);
}
function eM(t) {
  return new z(3004, !1);
}
function tM(t, e) {
  return new z(3005, !1);
}
function nM() {
  return new z(3006, !1);
}
function rM() {
  return new z(3007, !1);
}
function iM(t, e) {
  return new z(3008, !1);
}
function sM(t) {
  return new z(3002, !1);
}
function oM(t, e, n, r, i) {
  return new z(3010, !1);
}
function aM() {
  return new z(3011, !1);
}
function cM() {
  return new z(3012, !1);
}
function lM() {
  return new z(3200, !1);
}
function uM() {
  return new z(3202, !1);
}
function dM() {
  return new z(3013, !1);
}
function fM(t) {
  return new z(3014, !1);
}
function hM(t) {
  return new z(3015, !1);
}
function pM(t) {
  return new z(3016, !1);
}
function mM(t, e) {
  return new z(3404, !1);
}
function gM(t) {
  return new z(3502, !1);
}
function yM(t) {
  return new z(3503, !1);
}
function vM() {
  return new z(3300, !1);
}
function EM(t) {
  return new z(3504, !1);
}
function bM(t) {
  return new z(3301, !1);
}
function wM(t, e) {
  return new z(3302, !1);
}
function DM(t) {
  return new z(3303, !1);
}
function _M(t, e) {
  return new z(3400, !1);
}
function TM(t) {
  return new z(3401, !1);
}
function SM(t) {
  return new z(3402, !1);
}
function CM(t, e) {
  return new z(3505, !1);
}
function yr(t) {
  switch (t.length) {
    case 0:
      return new gr();
    case 1:
      return t[0];
    default:
      return new lo(t);
  }
}
function tb(t, e, n = new Map(), r = new Map()) {
  let i = [],
    s = [],
    o = -1,
    a = null;
  if (
    (e.forEach((c) => {
      let l = c.get("offset"),
        u = l == o,
        d = (u && a) || new Map();
      c.forEach((m, b) => {
        let I = b,
          N = m;
        if (b !== "offset")
          switch (((I = t.normalizePropertyName(I, i)), N)) {
            case ul:
              N = n.get(b);
              break;
            case vn:
              N = r.get(b);
              break;
            default:
              N = t.normalizeStyleValue(b, I, N, i);
              break;
          }
        d.set(I, N);
      }),
        u || s.push(d),
        (a = d),
        (o = l);
    }),
    i.length)
  )
    throw gM(i);
  return s;
}
function wh(t, e, n, r) {
  switch (e) {
    case "start":
      t.onStart(() => r(n && Jf(n, "start", t)));
      break;
    case "done":
      t.onDone(() => r(n && Jf(n, "done", t)));
      break;
    case "destroy":
      t.onDestroy(() => r(n && Jf(n, "destroy", t)));
      break;
  }
}
function Jf(t, e, n) {
  let r = n.totalTime,
    i = !!n.disabled,
    s = Dh(
      t.element,
      t.triggerName,
      t.fromState,
      t.toState,
      e || t.phaseName,
      r ?? t.totalTime,
      i
    ),
    o = t._data;
  return o != null && (s._data = o), s;
}
function Dh(t, e, n, r, i = "", s = 0, o) {
  return {
    element: t,
    triggerName: e,
    fromState: n,
    toState: r,
    phaseName: i,
    totalTime: s,
    disabled: !!o,
  };
}
function jt(t, e, n) {
  let r = t.get(e);
  return r || t.set(e, (r = n)), r;
}
function VE(t) {
  let e = t.indexOf(":"),
    n = t.substring(1, e),
    r = t.slice(e + 1);
  return [n, r];
}
var IM = typeof document > "u" ? null : document.documentElement;
function _h(t) {
  let e = t.parentNode || t.host || null;
  return e === IM ? null : e;
}
function MM(t) {
  return t.substring(1, 6) == "ebkit";
}
var Jr = null,
  $E = !1;
function NM(t) {
  Jr ||
    ((Jr = AM() || {}), ($E = Jr.style ? "WebkitAppearance" in Jr.style : !1));
  let e = !0;
  return (
    Jr.style &&
      !MM(t) &&
      ((e = t in Jr.style),
      !e &&
        $E &&
        (e = "Webkit" + t.charAt(0).toUpperCase() + t.slice(1) in Jr.style)),
    e
  );
}
function AM() {
  return typeof document < "u" ? document.body : null;
}
function nb(t, e) {
  for (; e; ) {
    if (e === t) return !0;
    e = _h(e);
  }
  return !1;
}
function rb(t, e, n) {
  if (n) return Array.from(t.querySelectorAll(e));
  let r = t.querySelector(e);
  return r ? [r] : [];
}
var Th = (() => {
    let e = class e {
      validateStyleProperty(r) {
        return NM(r);
      }
      matchesElement(r, i) {
        return !1;
      }
      containsElement(r, i) {
        return nb(r, i);
      }
      getParentElement(r) {
        return _h(r);
      }
      query(r, i, s) {
        return rb(r, i, s);
      }
      computeStyle(r, i, s) {
        return s || "";
      }
      animate(r, i, s, o, a, c = [], l) {
        return new gr(s, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Mh = class Mh {};
Mh.NOOP = new Th();
var ni = Mh,
  ri = class {};
var xM = 1e3,
  ib = "{{",
  RM = "}}",
  sb = "ng-enter",
  sh = "ng-leave",
  dl = "ng-trigger",
  gl = ".ng-trigger",
  qE = "ng-animating",
  oh = ".ng-animating";
function Hn(t) {
  if (typeof t == "number") return t;
  let e = t.match(/^(-?[\.\d]+)(m?s)/);
  return !e || e.length < 2 ? 0 : ah(parseFloat(e[1]), e[2]);
}
function ah(t, e) {
  switch (e) {
    case "s":
      return t * xM;
    default:
      return t;
  }
}
function yl(t, e, n) {
  return t.hasOwnProperty("duration") ? t : OM(t, e, n);
}
function OM(t, e, n) {
  let r =
      /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i,
    i,
    s = 0,
    o = "";
  if (typeof t == "string") {
    let a = t.match(r);
    if (a === null) return e.push(UE(t)), { duration: 0, delay: 0, easing: "" };
    i = ah(parseFloat(a[1]), a[2]);
    let c = a[3];
    c != null && (s = ah(parseFloat(c), a[4]));
    let l = a[5];
    l && (o = l);
  } else i = t;
  if (!n) {
    let a = !1,
      c = e.length;
    i < 0 && (e.push(YI()), (a = !0)),
      s < 0 && (e.push(ZI()), (a = !0)),
      a && e.splice(c, 0, UE(t));
  }
  return { duration: i, delay: s, easing: o };
}
function kM(t) {
  return t.length
    ? t[0] instanceof Map
      ? t
      : t.map((e) => new Map(Object.entries(e)))
    : [];
}
function En(t, e, n) {
  e.forEach((r, i) => {
    let s = Sh(i);
    n && !n.has(i) && n.set(i, t.style[s]), (t.style[s] = r);
  });
}
function ti(t, e) {
  e.forEach((n, r) => {
    let i = Sh(r);
    t.style[i] = "";
  });
}
function uo(t) {
  return Array.isArray(t) ? (t.length == 1 ? t[0] : BE(t)) : t;
}
function LM(t, e, n) {
  let r = e.params || {},
    i = ob(t);
  i.length &&
    i.forEach((s) => {
      r.hasOwnProperty(s) || n.push(XI(s));
    });
}
var ch = new RegExp(`${ib}\\s*(.+?)\\s*${RM}`, "g");
function ob(t) {
  let e = [];
  if (typeof t == "string") {
    let n;
    for (; (n = ch.exec(t)); ) e.push(n[1]);
    ch.lastIndex = 0;
  }
  return e;
}
function ho(t, e, n) {
  let r = `${t}`,
    i = r.replace(ch, (s, o) => {
      let a = e[o];
      return a == null && (n.push(JI(o)), (a = "")), a.toString();
    });
  return i == r ? t : i;
}
var PM = /-+([a-z0-9])/g;
function Sh(t) {
  return t.replace(PM, (...e) => e[1].toUpperCase());
}
function FM(t, e) {
  return t === 0 || e === 0;
}
function jM(t, e, n) {
  if (n.size && e.length) {
    let r = e[0],
      i = [];
    if (
      (n.forEach((s, o) => {
        r.has(o) || i.push(o), r.set(o, s);
      }),
      i.length)
    )
      for (let s = 1; s < e.length; s++) {
        let o = e[s];
        i.forEach((a) => o.set(a, Ch(t, a)));
      }
  }
  return e;
}
function Ft(t, e, n) {
  switch (e.type) {
    case De.Trigger:
      return t.visitTrigger(e, n);
    case De.State:
      return t.visitState(e, n);
    case De.Transition:
      return t.visitTransition(e, n);
    case De.Sequence:
      return t.visitSequence(e, n);
    case De.Group:
      return t.visitGroup(e, n);
    case De.Animate:
      return t.visitAnimate(e, n);
    case De.Keyframes:
      return t.visitKeyframes(e, n);
    case De.Style:
      return t.visitStyle(e, n);
    case De.Reference:
      return t.visitReference(e, n);
    case De.AnimateChild:
      return t.visitAnimateChild(e, n);
    case De.AnimateRef:
      return t.visitAnimateRef(e, n);
    case De.Query:
      return t.visitQuery(e, n);
    case De.Stagger:
      return t.visitStagger(e, n);
    default:
      throw eM(e.type);
  }
}
function Ch(t, e) {
  return window.getComputedStyle(t)[e];
}
var HM = new Set([
    "width",
    "height",
    "minWidth",
    "minHeight",
    "maxWidth",
    "maxHeight",
    "left",
    "top",
    "bottom",
    "right",
    "fontSize",
    "outlineWidth",
    "outlineOffset",
    "paddingTop",
    "paddingLeft",
    "paddingBottom",
    "paddingRight",
    "marginTop",
    "marginLeft",
    "marginBottom",
    "marginRight",
    "borderRadius",
    "borderWidth",
    "borderTopWidth",
    "borderLeftWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "textIndent",
    "perspective",
  ]),
  vl = class extends ri {
    normalizePropertyName(e, n) {
      return Sh(e);
    }
    normalizeStyleValue(e, n, r, i) {
      let s = "",
        o = r.toString().trim();
      if (HM.has(n) && r !== 0 && r !== "0")
        if (typeof r == "number") s = "px";
        else {
          let a = r.match(/^[+-]?[\d\.]+([a-z]*)$/);
          a && a[1].length == 0 && i.push(tM(e, r));
        }
      return o + s;
    }
  };
var El = "*";
function BM(t, e) {
  let n = [];
  return (
    typeof t == "string"
      ? t.split(/\s*,\s*/).forEach((r) => UM(r, n, e))
      : n.push(t),
    n
  );
}
function UM(t, e, n) {
  if (t[0] == ":") {
    let c = VM(t, n);
    if (typeof c == "function") {
      e.push(c);
      return;
    }
    t = c;
  }
  let r = t.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
  if (r == null || r.length < 4) return n.push(hM(t)), e;
  let i = r[1],
    s = r[2],
    o = r[3];
  e.push(zE(i, o));
  let a = i == El && o == El;
  s[0] == "<" && !a && e.push(zE(o, i));
}
function VM(t, e) {
  switch (t) {
    case ":enter":
      return "void => *";
    case ":leave":
      return "* => void";
    case ":increment":
      return (n, r) => parseFloat(r) > parseFloat(n);
    case ":decrement":
      return (n, r) => parseFloat(r) < parseFloat(n);
    default:
      return e.push(pM(t)), "* => *";
  }
}
var fl = new Set(["true", "1"]),
  hl = new Set(["false", "0"]);
function zE(t, e) {
  let n = fl.has(t) || hl.has(t),
    r = fl.has(e) || hl.has(e);
  return (i, s) => {
    let o = t == El || t == i,
      a = e == El || e == s;
    return (
      !o && n && typeof i == "boolean" && (o = i ? fl.has(t) : hl.has(t)),
      !a && r && typeof s == "boolean" && (a = s ? fl.has(e) : hl.has(e)),
      o && a
    );
  };
}
var ab = ":self",
  $M = new RegExp(`s*${ab}s*,?`, "g");
function cb(t, e, n, r) {
  return new lh(t).build(e, n, r);
}
var GE = "",
  lh = class {
    constructor(e) {
      this._driver = e;
    }
    build(e, n, r) {
      let i = new uh(n);
      return this._resetContextStyleTimingState(i), Ft(this, uo(e), i);
    }
    _resetContextStyleTimingState(e) {
      (e.currentQuerySelector = GE),
        (e.collectedStyles = new Map()),
        e.collectedStyles.set(GE, new Map()),
        (e.currentTime = 0);
    }
    visitTrigger(e, n) {
      let r = (n.queryCount = 0),
        i = (n.depCount = 0),
        s = [],
        o = [];
      return (
        e.name.charAt(0) == "@" && n.errors.push(nM()),
        e.definitions.forEach((a) => {
          if ((this._resetContextStyleTimingState(n), a.type == De.State)) {
            let c = a,
              l = c.name;
            l
              .toString()
              .split(/\s*,\s*/)
              .forEach((u) => {
                (c.name = u), s.push(this.visitState(c, n));
              }),
              (c.name = l);
          } else if (a.type == De.Transition) {
            let c = this.visitTransition(a, n);
            (r += c.queryCount), (i += c.depCount), o.push(c);
          } else n.errors.push(rM());
        }),
        {
          type: De.Trigger,
          name: e.name,
          states: s,
          transitions: o,
          queryCount: r,
          depCount: i,
          options: null,
        }
      );
    }
    visitState(e, n) {
      let r = this.visitStyle(e.styles, n),
        i = (e.options && e.options.params) || null;
      if (r.containsDynamicStyles) {
        let s = new Set(),
          o = i || {};
        r.styles.forEach((a) => {
          a instanceof Map &&
            a.forEach((c) => {
              ob(c).forEach((l) => {
                o.hasOwnProperty(l) || s.add(l);
              });
            });
        }),
          s.size && n.errors.push(iM(e.name, [...s.values()]));
      }
      return {
        type: De.State,
        name: e.name,
        style: r,
        options: i ? { params: i } : null,
      };
    }
    visitTransition(e, n) {
      (n.queryCount = 0), (n.depCount = 0);
      let r = Ft(this, uo(e.animation), n),
        i = BM(e.expr, n.errors);
      return {
        type: De.Transition,
        matchers: i,
        animation: r,
        queryCount: n.queryCount,
        depCount: n.depCount,
        options: ei(e.options),
      };
    }
    visitSequence(e, n) {
      return {
        type: De.Sequence,
        steps: e.steps.map((r) => Ft(this, r, n)),
        options: ei(e.options),
      };
    }
    visitGroup(e, n) {
      let r = n.currentTime,
        i = 0,
        s = e.steps.map((o) => {
          n.currentTime = r;
          let a = Ft(this, o, n);
          return (i = Math.max(i, n.currentTime)), a;
        });
      return (
        (n.currentTime = i),
        { type: De.Group, steps: s, options: ei(e.options) }
      );
    }
    visitAnimate(e, n) {
      let r = WM(e.timings, n.errors);
      n.currentAnimateTimings = r;
      let i,
        s = e.styles ? e.styles : Xf({});
      if (s.type == De.Keyframes) i = this.visitKeyframes(s, n);
      else {
        let o = e.styles,
          a = !1;
        if (!o) {
          a = !0;
          let l = {};
          r.easing && (l.easing = r.easing), (o = Xf(l));
        }
        n.currentTime += r.duration + r.delay;
        let c = this.visitStyle(o, n);
        (c.isEmptyStep = a), (i = c);
      }
      return (
        (n.currentAnimateTimings = null),
        { type: De.Animate, timings: r, style: i, options: null }
      );
    }
    visitStyle(e, n) {
      let r = this._makeStyleAst(e, n);
      return this._validateStyleAst(r, n), r;
    }
    _makeStyleAst(e, n) {
      let r = [],
        i = Array.isArray(e.styles) ? e.styles : [e.styles];
      for (let a of i)
        typeof a == "string"
          ? a === vn
            ? r.push(a)
            : n.errors.push(sM(a))
          : r.push(new Map(Object.entries(a)));
      let s = !1,
        o = null;
      return (
        r.forEach((a) => {
          if (
            a instanceof Map &&
            (a.has("easing") && ((o = a.get("easing")), a.delete("easing")), !s)
          ) {
            for (let c of a.values())
              if (c.toString().indexOf(ib) >= 0) {
                s = !0;
                break;
              }
          }
        }),
        {
          type: De.Style,
          styles: r,
          easing: o,
          offset: e.offset,
          containsDynamicStyles: s,
          options: null,
        }
      );
    }
    _validateStyleAst(e, n) {
      let r = n.currentAnimateTimings,
        i = n.currentTime,
        s = n.currentTime;
      r && s > 0 && (s -= r.duration + r.delay),
        e.styles.forEach((o) => {
          typeof o != "string" &&
            o.forEach((a, c) => {
              let l = n.collectedStyles.get(n.currentQuerySelector),
                u = l.get(c),
                d = !0;
              u &&
                (s != i &&
                  s >= u.startTime &&
                  i <= u.endTime &&
                  (n.errors.push(oM(c, u.startTime, u.endTime, s, i)),
                  (d = !1)),
                (s = u.startTime)),
                d && l.set(c, { startTime: s, endTime: i }),
                n.options && LM(a, n.options, n.errors);
            });
        });
    }
    visitKeyframes(e, n) {
      let r = { type: De.Keyframes, styles: [], options: null };
      if (!n.currentAnimateTimings) return n.errors.push(aM()), r;
      let i = 1,
        s = 0,
        o = [],
        a = !1,
        c = !1,
        l = 0,
        u = e.steps.map((x) => {
          let _ = this._makeStyleAst(x, n),
            w = _.offset != null ? _.offset : GM(_.styles),
            T = 0;
          return (
            w != null && (s++, (T = _.offset = w)),
            (c = c || T < 0 || T > 1),
            (a = a || T < l),
            (l = T),
            o.push(T),
            _
          );
        });
      c && n.errors.push(cM()), a && n.errors.push(lM());
      let d = e.steps.length,
        m = 0;
      s > 0 && s < d ? n.errors.push(uM()) : s == 0 && (m = i / (d - 1));
      let b = d - 1,
        I = n.currentTime,
        N = n.currentAnimateTimings,
        F = N.duration;
      return (
        u.forEach((x, _) => {
          let w = m > 0 ? (_ == b ? 1 : m * _) : o[_],
            T = w * F;
          (n.currentTime = I + N.delay + T),
            (N.duration = T),
            this._validateStyleAst(x, n),
            (x.offset = w),
            r.styles.push(x);
        }),
        r
      );
    }
    visitReference(e, n) {
      return {
        type: De.Reference,
        animation: Ft(this, uo(e.animation), n),
        options: ei(e.options),
      };
    }
    visitAnimateChild(e, n) {
      return n.depCount++, { type: De.AnimateChild, options: ei(e.options) };
    }
    visitAnimateRef(e, n) {
      return {
        type: De.AnimateRef,
        animation: this.visitReference(e.animation, n),
        options: ei(e.options),
      };
    }
    visitQuery(e, n) {
      let r = n.currentQuerySelector,
        i = e.options || {};
      n.queryCount++, (n.currentQuery = e);
      let [s, o] = qM(e.selector);
      (n.currentQuerySelector = r.length ? r + " " + s : s),
        jt(n.collectedStyles, n.currentQuerySelector, new Map());
      let a = Ft(this, uo(e.animation), n);
      return (
        (n.currentQuery = null),
        (n.currentQuerySelector = r),
        {
          type: De.Query,
          selector: s,
          limit: i.limit || 0,
          optional: !!i.optional,
          includeSelf: o,
          animation: a,
          originalSelector: e.selector,
          options: ei(e.options),
        }
      );
    }
    visitStagger(e, n) {
      n.currentQuery || n.errors.push(dM());
      let r =
        e.timings === "full"
          ? { duration: 0, delay: 0, easing: "full" }
          : yl(e.timings, n.errors, !0);
      return {
        type: De.Stagger,
        animation: Ft(this, uo(e.animation), n),
        timings: r,
        options: null,
      };
    }
  };
function qM(t) {
  let e = !!t.split(/\s*,\s*/).find((n) => n == ab);
  return (
    e && (t = t.replace($M, "")),
    (t = t
      .replace(/@\*/g, gl)
      .replace(/@\w+/g, (n) => gl + "-" + n.slice(1))
      .replace(/:animating/g, oh)),
    [t, e]
  );
}
function zM(t) {
  return t ? J({}, t) : null;
}
var uh = class {
  constructor(e) {
    (this.errors = e),
      (this.queryCount = 0),
      (this.depCount = 0),
      (this.currentTransition = null),
      (this.currentQuery = null),
      (this.currentQuerySelector = null),
      (this.currentAnimateTimings = null),
      (this.currentTime = 0),
      (this.collectedStyles = new Map()),
      (this.options = null),
      (this.unsupportedCSSPropertiesFound = new Set());
  }
};
function GM(t) {
  if (typeof t == "string") return null;
  let e = null;
  if (Array.isArray(t))
    t.forEach((n) => {
      if (n instanceof Map && n.has("offset")) {
        let r = n;
        (e = parseFloat(r.get("offset"))), r.delete("offset");
      }
    });
  else if (t instanceof Map && t.has("offset")) {
    let n = t;
    (e = parseFloat(n.get("offset"))), n.delete("offset");
  }
  return e;
}
function WM(t, e) {
  if (t.hasOwnProperty("duration")) return t;
  if (typeof t == "number") {
    let s = yl(t, e).duration;
    return eh(s, 0, "");
  }
  let n = t;
  if (n.split(/\s+/).some((s) => s.charAt(0) == "{" && s.charAt(1) == "{")) {
    let s = eh(0, 0, "");
    return (s.dynamic = !0), (s.strValue = n), s;
  }
  let i = yl(n, e);
  return eh(i.duration, i.delay, i.easing);
}
function ei(t) {
  return (
    t ? ((t = J({}, t)), t.params && (t.params = zM(t.params))) : (t = {}), t
  );
}
function eh(t, e, n) {
  return { duration: t, delay: e, easing: n };
}
function Ih(t, e, n, r, i, s, o = null, a = !1) {
  return {
    type: 1,
    element: t,
    keyframes: e,
    preStyleProps: n,
    postStyleProps: r,
    duration: i,
    delay: s,
    totalTime: i + s,
    easing: o,
    subTimeline: a,
  };
}
var po = class {
    constructor() {
      this._map = new Map();
    }
    get(e) {
      return this._map.get(e) || [];
    }
    append(e, n) {
      let r = this._map.get(e);
      r || this._map.set(e, (r = [])), r.push(...n);
    }
    has(e) {
      return this._map.has(e);
    }
    clear() {
      this._map.clear();
    }
  },
  KM = 1,
  QM = ":enter",
  YM = new RegExp(QM, "g"),
  ZM = ":leave",
  XM = new RegExp(ZM, "g");
function lb(t, e, n, r, i, s = new Map(), o = new Map(), a, c, l = []) {
  return new dh().buildKeyframes(t, e, n, r, i, s, o, a, c, l);
}
var dh = class {
    buildKeyframes(e, n, r, i, s, o, a, c, l, u = []) {
      l = l || new po();
      let d = new fh(e, n, l, i, s, u, []);
      d.options = c;
      let m = c.delay ? Hn(c.delay) : 0;
      d.currentTimeline.delayNextStep(m),
        d.currentTimeline.setStyles([o], null, d.errors, c),
        Ft(this, r, d);
      let b = d.timelines.filter((I) => I.containsAnimation());
      if (b.length && a.size) {
        let I;
        for (let N = b.length - 1; N >= 0; N--) {
          let F = b[N];
          if (F.element === n) {
            I = F;
            break;
          }
        }
        I &&
          !I.allowOnlyTimelineStyles() &&
          I.setStyles([a], null, d.errors, c);
      }
      return b.length
        ? b.map((I) => I.buildKeyframes())
        : [Ih(n, [], [], [], 0, m, "", !1)];
    }
    visitTrigger(e, n) {}
    visitState(e, n) {}
    visitTransition(e, n) {}
    visitAnimateChild(e, n) {
      let r = n.subInstructions.get(n.element);
      if (r) {
        let i = n.createSubContext(e.options),
          s = n.currentTimeline.currentTime,
          o = this._visitSubInstructions(r, i, i.options);
        s != o && n.transformIntoNewTimeline(o);
      }
      n.previousNode = e;
    }
    visitAnimateRef(e, n) {
      let r = n.createSubContext(e.options);
      r.transformIntoNewTimeline(),
        this._applyAnimationRefDelays([e.options, e.animation.options], n, r),
        this.visitReference(e.animation, r),
        n.transformIntoNewTimeline(r.currentTimeline.currentTime),
        (n.previousNode = e);
    }
    _applyAnimationRefDelays(e, n, r) {
      for (let i of e) {
        let s = i?.delay;
        if (s) {
          let o =
            typeof s == "number" ? s : Hn(ho(s, i?.params ?? {}, n.errors));
          r.delayNextStep(o);
        }
      }
    }
    _visitSubInstructions(e, n, r) {
      let s = n.currentTimeline.currentTime,
        o = r.duration != null ? Hn(r.duration) : null,
        a = r.delay != null ? Hn(r.delay) : null;
      return (
        o !== 0 &&
          e.forEach((c) => {
            let l = n.appendInstructionToTimeline(c, o, a);
            s = Math.max(s, l.duration + l.delay);
          }),
        s
      );
    }
    visitReference(e, n) {
      n.updateOptions(e.options, !0),
        Ft(this, e.animation, n),
        (n.previousNode = e);
    }
    visitSequence(e, n) {
      let r = n.subContextCount,
        i = n,
        s = e.options;
      if (
        s &&
        (s.params || s.delay) &&
        ((i = n.createSubContext(s)),
        i.transformIntoNewTimeline(),
        s.delay != null)
      ) {
        i.previousNode.type == De.Style &&
          (i.currentTimeline.snapshotCurrentStyles(), (i.previousNode = bl));
        let o = Hn(s.delay);
        i.delayNextStep(o);
      }
      e.steps.length &&
        (e.steps.forEach((o) => Ft(this, o, i)),
        i.currentTimeline.applyStylesToKeyframe(),
        i.subContextCount > r && i.transformIntoNewTimeline()),
        (n.previousNode = e);
    }
    visitGroup(e, n) {
      let r = [],
        i = n.currentTimeline.currentTime,
        s = e.options && e.options.delay ? Hn(e.options.delay) : 0;
      e.steps.forEach((o) => {
        let a = n.createSubContext(e.options);
        s && a.delayNextStep(s),
          Ft(this, o, a),
          (i = Math.max(i, a.currentTimeline.currentTime)),
          r.push(a.currentTimeline);
      }),
        r.forEach((o) => n.currentTimeline.mergeTimelineCollectedStyles(o)),
        n.transformIntoNewTimeline(i),
        (n.previousNode = e);
    }
    _visitTiming(e, n) {
      if (e.dynamic) {
        let r = e.strValue,
          i = n.params ? ho(r, n.params, n.errors) : r;
        return yl(i, n.errors);
      } else return { duration: e.duration, delay: e.delay, easing: e.easing };
    }
    visitAnimate(e, n) {
      let r = (n.currentAnimateTimings = this._visitTiming(e.timings, n)),
        i = n.currentTimeline;
      r.delay && (n.incrementTime(r.delay), i.snapshotCurrentStyles());
      let s = e.style;
      s.type == De.Keyframes
        ? this.visitKeyframes(s, n)
        : (n.incrementTime(r.duration),
          this.visitStyle(s, n),
          i.applyStylesToKeyframe()),
        (n.currentAnimateTimings = null),
        (n.previousNode = e);
    }
    visitStyle(e, n) {
      let r = n.currentTimeline,
        i = n.currentAnimateTimings;
      !i && r.hasCurrentStyleProperties() && r.forwardFrame();
      let s = (i && i.easing) || e.easing;
      e.isEmptyStep
        ? r.applyEmptyStep(s)
        : r.setStyles(e.styles, s, n.errors, n.options),
        (n.previousNode = e);
    }
    visitKeyframes(e, n) {
      let r = n.currentAnimateTimings,
        i = n.currentTimeline.duration,
        s = r.duration,
        a = n.createSubContext().currentTimeline;
      (a.easing = r.easing),
        e.styles.forEach((c) => {
          let l = c.offset || 0;
          a.forwardTime(l * s),
            a.setStyles(c.styles, c.easing, n.errors, n.options),
            a.applyStylesToKeyframe();
        }),
        n.currentTimeline.mergeTimelineCollectedStyles(a),
        n.transformIntoNewTimeline(i + s),
        (n.previousNode = e);
    }
    visitQuery(e, n) {
      let r = n.currentTimeline.currentTime,
        i = e.options || {},
        s = i.delay ? Hn(i.delay) : 0;
      s &&
        (n.previousNode.type === De.Style ||
          (r == 0 && n.currentTimeline.hasCurrentStyleProperties())) &&
        (n.currentTimeline.snapshotCurrentStyles(), (n.previousNode = bl));
      let o = r,
        a = n.invokeQuery(
          e.selector,
          e.originalSelector,
          e.limit,
          e.includeSelf,
          !!i.optional,
          n.errors
        );
      n.currentQueryTotal = a.length;
      let c = null;
      a.forEach((l, u) => {
        n.currentQueryIndex = u;
        let d = n.createSubContext(e.options, l);
        s && d.delayNextStep(s),
          l === n.element && (c = d.currentTimeline),
          Ft(this, e.animation, d),
          d.currentTimeline.applyStylesToKeyframe();
        let m = d.currentTimeline.currentTime;
        o = Math.max(o, m);
      }),
        (n.currentQueryIndex = 0),
        (n.currentQueryTotal = 0),
        n.transformIntoNewTimeline(o),
        c &&
          (n.currentTimeline.mergeTimelineCollectedStyles(c),
          n.currentTimeline.snapshotCurrentStyles()),
        (n.previousNode = e);
    }
    visitStagger(e, n) {
      let r = n.parentContext,
        i = n.currentTimeline,
        s = e.timings,
        o = Math.abs(s.duration),
        a = o * (n.currentQueryTotal - 1),
        c = o * n.currentQueryIndex;
      switch (s.duration < 0 ? "reverse" : s.easing) {
        case "reverse":
          c = a - c;
          break;
        case "full":
          c = r.currentStaggerTime;
          break;
      }
      let u = n.currentTimeline;
      c && u.delayNextStep(c);
      let d = u.currentTime;
      Ft(this, e.animation, n),
        (n.previousNode = e),
        (r.currentStaggerTime =
          i.currentTime - d + (i.startTime - r.currentTimeline.startTime));
    }
  },
  bl = {},
  fh = class t {
    constructor(e, n, r, i, s, o, a, c) {
      (this._driver = e),
        (this.element = n),
        (this.subInstructions = r),
        (this._enterClassName = i),
        (this._leaveClassName = s),
        (this.errors = o),
        (this.timelines = a),
        (this.parentContext = null),
        (this.currentAnimateTimings = null),
        (this.previousNode = bl),
        (this.subContextCount = 0),
        (this.options = {}),
        (this.currentQueryIndex = 0),
        (this.currentQueryTotal = 0),
        (this.currentStaggerTime = 0),
        (this.currentTimeline = c || new wl(this._driver, n, 0)),
        a.push(this.currentTimeline);
    }
    get params() {
      return this.options.params;
    }
    updateOptions(e, n) {
      if (!e) return;
      let r = e,
        i = this.options;
      r.duration != null && (i.duration = Hn(r.duration)),
        r.delay != null && (i.delay = Hn(r.delay));
      let s = r.params;
      if (s) {
        let o = i.params;
        o || (o = this.options.params = {}),
          Object.keys(s).forEach((a) => {
            (!n || !o.hasOwnProperty(a)) && (o[a] = ho(s[a], o, this.errors));
          });
      }
    }
    _copyOptions() {
      let e = {};
      if (this.options) {
        let n = this.options.params;
        if (n) {
          let r = (e.params = {});
          Object.keys(n).forEach((i) => {
            r[i] = n[i];
          });
        }
      }
      return e;
    }
    createSubContext(e = null, n, r) {
      let i = n || this.element,
        s = new t(
          this._driver,
          i,
          this.subInstructions,
          this._enterClassName,
          this._leaveClassName,
          this.errors,
          this.timelines,
          this.currentTimeline.fork(i, r || 0)
        );
      return (
        (s.previousNode = this.previousNode),
        (s.currentAnimateTimings = this.currentAnimateTimings),
        (s.options = this._copyOptions()),
        s.updateOptions(e),
        (s.currentQueryIndex = this.currentQueryIndex),
        (s.currentQueryTotal = this.currentQueryTotal),
        (s.parentContext = this),
        this.subContextCount++,
        s
      );
    }
    transformIntoNewTimeline(e) {
      return (
        (this.previousNode = bl),
        (this.currentTimeline = this.currentTimeline.fork(this.element, e)),
        this.timelines.push(this.currentTimeline),
        this.currentTimeline
      );
    }
    appendInstructionToTimeline(e, n, r) {
      let i = {
          duration: n ?? e.duration,
          delay: this.currentTimeline.currentTime + (r ?? 0) + e.delay,
          easing: "",
        },
        s = new hh(
          this._driver,
          e.element,
          e.keyframes,
          e.preStyleProps,
          e.postStyleProps,
          i,
          e.stretchStartingKeyframe
        );
      return this.timelines.push(s), i;
    }
    incrementTime(e) {
      this.currentTimeline.forwardTime(this.currentTimeline.duration + e);
    }
    delayNextStep(e) {
      e > 0 && this.currentTimeline.delayNextStep(e);
    }
    invokeQuery(e, n, r, i, s, o) {
      let a = [];
      if ((i && a.push(this.element), e.length > 0)) {
        (e = e.replace(YM, "." + this._enterClassName)),
          (e = e.replace(XM, "." + this._leaveClassName));
        let c = r != 1,
          l = this._driver.query(this.element, e, c);
        r !== 0 &&
          (l = r < 0 ? l.slice(l.length + r, l.length) : l.slice(0, r)),
          a.push(...l);
      }
      return !s && a.length == 0 && o.push(fM(n)), a;
    }
  },
  wl = class t {
    constructor(e, n, r, i) {
      (this._driver = e),
        (this.element = n),
        (this.startTime = r),
        (this._elementTimelineStylesLookup = i),
        (this.duration = 0),
        (this.easing = null),
        (this._previousKeyframe = new Map()),
        (this._currentKeyframe = new Map()),
        (this._keyframes = new Map()),
        (this._styleSummary = new Map()),
        (this._localTimelineStyles = new Map()),
        (this._pendingStyles = new Map()),
        (this._backFill = new Map()),
        (this._currentEmptyStepKeyframe = null),
        this._elementTimelineStylesLookup ||
          (this._elementTimelineStylesLookup = new Map()),
        (this._globalTimelineStyles = this._elementTimelineStylesLookup.get(n)),
        this._globalTimelineStyles ||
          ((this._globalTimelineStyles = this._localTimelineStyles),
          this._elementTimelineStylesLookup.set(n, this._localTimelineStyles)),
        this._loadKeyframe();
    }
    containsAnimation() {
      switch (this._keyframes.size) {
        case 0:
          return !1;
        case 1:
          return this.hasCurrentStyleProperties();
        default:
          return !0;
      }
    }
    hasCurrentStyleProperties() {
      return this._currentKeyframe.size > 0;
    }
    get currentTime() {
      return this.startTime + this.duration;
    }
    delayNextStep(e) {
      let n = this._keyframes.size === 1 && this._pendingStyles.size;
      this.duration || n
        ? (this.forwardTime(this.currentTime + e),
          n && this.snapshotCurrentStyles())
        : (this.startTime += e);
    }
    fork(e, n) {
      return (
        this.applyStylesToKeyframe(),
        new t(
          this._driver,
          e,
          n || this.currentTime,
          this._elementTimelineStylesLookup
        )
      );
    }
    _loadKeyframe() {
      this._currentKeyframe && (this._previousKeyframe = this._currentKeyframe),
        (this._currentKeyframe = this._keyframes.get(this.duration)),
        this._currentKeyframe ||
          ((this._currentKeyframe = new Map()),
          this._keyframes.set(this.duration, this._currentKeyframe));
    }
    forwardFrame() {
      (this.duration += KM), this._loadKeyframe();
    }
    forwardTime(e) {
      this.applyStylesToKeyframe(), (this.duration = e), this._loadKeyframe();
    }
    _updateStyle(e, n) {
      this._localTimelineStyles.set(e, n),
        this._globalTimelineStyles.set(e, n),
        this._styleSummary.set(e, { time: this.currentTime, value: n });
    }
    allowOnlyTimelineStyles() {
      return this._currentEmptyStepKeyframe !== this._currentKeyframe;
    }
    applyEmptyStep(e) {
      e && this._previousKeyframe.set("easing", e);
      for (let [n, r] of this._globalTimelineStyles)
        this._backFill.set(n, r || vn), this._currentKeyframe.set(n, vn);
      this._currentEmptyStepKeyframe = this._currentKeyframe;
    }
    setStyles(e, n, r, i) {
      n && this._previousKeyframe.set("easing", n);
      let s = (i && i.params) || {},
        o = JM(e, this._globalTimelineStyles);
      for (let [a, c] of o) {
        let l = ho(c, s, r);
        this._pendingStyles.set(a, l),
          this._localTimelineStyles.has(a) ||
            this._backFill.set(a, this._globalTimelineStyles.get(a) ?? vn),
          this._updateStyle(a, l);
      }
    }
    applyStylesToKeyframe() {
      this._pendingStyles.size != 0 &&
        (this._pendingStyles.forEach((e, n) => {
          this._currentKeyframe.set(n, e);
        }),
        this._pendingStyles.clear(),
        this._localTimelineStyles.forEach((e, n) => {
          this._currentKeyframe.has(n) || this._currentKeyframe.set(n, e);
        }));
    }
    snapshotCurrentStyles() {
      for (let [e, n] of this._localTimelineStyles)
        this._pendingStyles.set(e, n), this._updateStyle(e, n);
    }
    getFinalKeyframe() {
      return this._keyframes.get(this.duration);
    }
    get properties() {
      let e = [];
      for (let n in this._currentKeyframe) e.push(n);
      return e;
    }
    mergeTimelineCollectedStyles(e) {
      e._styleSummary.forEach((n, r) => {
        let i = this._styleSummary.get(r);
        (!i || n.time > i.time) && this._updateStyle(r, n.value);
      });
    }
    buildKeyframes() {
      this.applyStylesToKeyframe();
      let e = new Set(),
        n = new Set(),
        r = this._keyframes.size === 1 && this.duration === 0,
        i = [];
      this._keyframes.forEach((a, c) => {
        let l = new Map([...this._backFill, ...a]);
        l.forEach((u, d) => {
          u === ul ? e.add(d) : u === vn && n.add(d);
        }),
          r || l.set("offset", c / this.duration),
          i.push(l);
      });
      let s = [...e.values()],
        o = [...n.values()];
      if (r) {
        let a = i[0],
          c = new Map(a);
        a.set("offset", 0), c.set("offset", 1), (i = [a, c]);
      }
      return Ih(
        this.element,
        i,
        s,
        o,
        this.duration,
        this.startTime,
        this.easing,
        !1
      );
    }
  },
  hh = class extends wl {
    constructor(e, n, r, i, s, o, a = !1) {
      super(e, n, o.delay),
        (this.keyframes = r),
        (this.preStyleProps = i),
        (this.postStyleProps = s),
        (this._stretchStartingKeyframe = a),
        (this.timings = {
          duration: o.duration,
          delay: o.delay,
          easing: o.easing,
        });
    }
    containsAnimation() {
      return this.keyframes.length > 1;
    }
    buildKeyframes() {
      let e = this.keyframes,
        { delay: n, duration: r, easing: i } = this.timings;
      if (this._stretchStartingKeyframe && n) {
        let s = [],
          o = r + n,
          a = n / o,
          c = new Map(e[0]);
        c.set("offset", 0), s.push(c);
        let l = new Map(e[0]);
        l.set("offset", WE(a)), s.push(l);
        let u = e.length - 1;
        for (let d = 1; d <= u; d++) {
          let m = new Map(e[d]),
            b = m.get("offset"),
            I = n + b * r;
          m.set("offset", WE(I / o)), s.push(m);
        }
        (r = o), (n = 0), (i = ""), (e = s);
      }
      return Ih(
        this.element,
        e,
        this.preStyleProps,
        this.postStyleProps,
        r,
        n,
        i,
        !0
      );
    }
  };
function WE(t, e = 3) {
  let n = Math.pow(10, e - 1);
  return Math.round(t * n) / n;
}
function JM(t, e) {
  let n = new Map(),
    r;
  return (
    t.forEach((i) => {
      if (i === "*") {
        r ??= e.keys();
        for (let s of r) n.set(s, vn);
      } else for (let [s, o] of i) n.set(s, o);
    }),
    n
  );
}
function KE(t, e, n, r, i, s, o, a, c, l, u, d, m) {
  return {
    type: 0,
    element: t,
    triggerName: e,
    isRemovalTransition: i,
    fromState: n,
    fromStyles: s,
    toState: r,
    toStyles: o,
    timelines: a,
    queriedElements: c,
    preStyleProps: l,
    postStyleProps: u,
    totalTime: d,
    errors: m,
  };
}
var th = {},
  Dl = class {
    constructor(e, n, r) {
      (this._triggerName = e), (this.ast = n), (this._stateStyles = r);
    }
    match(e, n, r, i) {
      return eN(this.ast.matchers, e, n, r, i);
    }
    buildStyles(e, n, r) {
      let i = this._stateStyles.get("*");
      return (
        e !== void 0 && (i = this._stateStyles.get(e?.toString()) || i),
        i ? i.buildStyles(n, r) : new Map()
      );
    }
    build(e, n, r, i, s, o, a, c, l, u) {
      let d = [],
        m = (this.ast.options && this.ast.options.params) || th,
        b = (a && a.params) || th,
        I = this.buildStyles(r, b, d),
        N = (c && c.params) || th,
        F = this.buildStyles(i, N, d),
        x = new Set(),
        _ = new Map(),
        w = new Map(),
        T = i === "void",
        E = { params: ub(N, m), delay: this.ast.options?.delay },
        ee = u ? [] : lb(e, n, this.ast.animation, s, o, I, F, E, l, d),
        ne = 0;
      return (
        ee.forEach((me) => {
          ne = Math.max(me.duration + me.delay, ne);
        }),
        d.length
          ? KE(n, this._triggerName, r, i, T, I, F, [], [], _, w, ne, d)
          : (ee.forEach((me) => {
              let q = me.element,
                O = jt(_, q, new Set());
              me.preStyleProps.forEach((Y) => O.add(Y));
              let j = jt(w, q, new Set());
              me.postStyleProps.forEach((Y) => j.add(Y)), q !== n && x.add(q);
            }),
            KE(
              n,
              this._triggerName,
              r,
              i,
              T,
              I,
              F,
              ee,
              [...x.values()],
              _,
              w,
              ne
            ))
      );
    }
  };
function eN(t, e, n, r, i) {
  return t.some((s) => s(e, n, r, i));
}
function ub(t, e) {
  let n = J({}, e);
  return (
    Object.entries(t).forEach(([r, i]) => {
      i != null && (n[r] = i);
    }),
    n
  );
}
var ph = class {
  constructor(e, n, r) {
    (this.styles = e), (this.defaultParams = n), (this.normalizer = r);
  }
  buildStyles(e, n) {
    let r = new Map(),
      i = ub(e, this.defaultParams);
    return (
      this.styles.styles.forEach((s) => {
        typeof s != "string" &&
          s.forEach((o, a) => {
            o && (o = ho(o, i, n));
            let c = this.normalizer.normalizePropertyName(a, n);
            (o = this.normalizer.normalizeStyleValue(a, c, o, n)), r.set(a, o);
          });
      }),
      r
    );
  }
};
function tN(t, e, n) {
  return new mh(t, e, n);
}
var mh = class {
  constructor(e, n, r) {
    (this.name = e),
      (this.ast = n),
      (this._normalizer = r),
      (this.transitionFactories = []),
      (this.states = new Map()),
      n.states.forEach((i) => {
        let s = (i.options && i.options.params) || {};
        this.states.set(i.name, new ph(i.style, s, r));
      }),
      QE(this.states, "true", "1"),
      QE(this.states, "false", "0"),
      n.transitions.forEach((i) => {
        this.transitionFactories.push(new Dl(e, i, this.states));
      }),
      (this.fallbackTransition = nN(e, this.states, this._normalizer));
  }
  get containsQueries() {
    return this.ast.queryCount > 0;
  }
  matchTransition(e, n, r, i) {
    return this.transitionFactories.find((o) => o.match(e, n, r, i)) || null;
  }
  matchStyles(e, n, r) {
    return this.fallbackTransition.buildStyles(e, n, r);
  }
};
function nN(t, e, n) {
  let r = [(o, a) => !0],
    i = { type: De.Sequence, steps: [], options: null },
    s = {
      type: De.Transition,
      animation: i,
      matchers: r,
      options: null,
      queryCount: 0,
      depCount: 0,
    };
  return new Dl(t, s, e);
}
function QE(t, e, n) {
  t.has(e) ? t.has(n) || t.set(n, t.get(e)) : t.has(n) && t.set(e, t.get(n));
}
var rN = new po(),
  gh = class {
    constructor(e, n, r) {
      (this.bodyNode = e),
        (this._driver = n),
        (this._normalizer = r),
        (this._animations = new Map()),
        (this._playersById = new Map()),
        (this.players = []);
    }
    register(e, n) {
      let r = [],
        i = [],
        s = cb(this._driver, n, r, i);
      if (r.length) throw yM(r);
      i.length && void 0, this._animations.set(e, s);
    }
    _buildPlayer(e, n, r) {
      let i = e.element,
        s = tb(this._normalizer, e.keyframes, n, r);
      return this._driver.animate(i, s, e.duration, e.delay, e.easing, [], !0);
    }
    create(e, n, r = {}) {
      let i = [],
        s = this._animations.get(e),
        o,
        a = new Map();
      if (
        (s
          ? ((o = lb(
              this._driver,
              n,
              s,
              sb,
              sh,
              new Map(),
              new Map(),
              r,
              rN,
              i
            )),
            o.forEach((u) => {
              let d = jt(a, u.element, new Map());
              u.postStyleProps.forEach((m) => d.set(m, null));
            }))
          : (i.push(vM()), (o = [])),
        i.length)
      )
        throw EM(i);
      a.forEach((u, d) => {
        u.forEach((m, b) => {
          u.set(b, this._driver.computeStyle(d, b, vn));
        });
      });
      let c = o.map((u) => {
          let d = a.get(u.element);
          return this._buildPlayer(u, new Map(), d);
        }),
        l = yr(c);
      return (
        this._playersById.set(e, l),
        l.onDestroy(() => this.destroy(e)),
        this.players.push(l),
        l
      );
    }
    destroy(e) {
      let n = this._getPlayer(e);
      n.destroy(), this._playersById.delete(e);
      let r = this.players.indexOf(n);
      r >= 0 && this.players.splice(r, 1);
    }
    _getPlayer(e) {
      let n = this._playersById.get(e);
      if (!n) throw bM(e);
      return n;
    }
    listen(e, n, r, i) {
      let s = Dh(n, "", "", "");
      return wh(this._getPlayer(e), r, s, i), () => {};
    }
    command(e, n, r, i) {
      if (r == "register") {
        this.register(e, i[0]);
        return;
      }
      if (r == "create") {
        let o = i[0] || {};
        this.create(e, n, o);
        return;
      }
      let s = this._getPlayer(e);
      switch (r) {
        case "play":
          s.play();
          break;
        case "pause":
          s.pause();
          break;
        case "reset":
          s.reset();
          break;
        case "restart":
          s.restart();
          break;
        case "finish":
          s.finish();
          break;
        case "init":
          s.init();
          break;
        case "setPosition":
          s.setPosition(parseFloat(i[0]));
          break;
        case "destroy":
          this.destroy(e);
          break;
      }
    }
  },
  YE = "ng-animate-queued",
  iN = ".ng-animate-queued",
  nh = "ng-animate-disabled",
  sN = ".ng-animate-disabled",
  oN = "ng-star-inserted",
  aN = ".ng-star-inserted",
  cN = [],
  db = {
    namespaceId: "",
    setForRemoval: !1,
    setForMove: !1,
    hasAnimation: !1,
    removedBeforeQueried: !1,
  },
  lN = {
    namespaceId: "",
    setForMove: !1,
    setForRemoval: !1,
    hasAnimation: !1,
    removedBeforeQueried: !0,
  },
  an = "__ng_removed",
  mo = class {
    get params() {
      return this.options.params;
    }
    constructor(e, n = "") {
      this.namespaceId = n;
      let r = e && e.hasOwnProperty("value"),
        i = r ? e.value : e;
      if (((this.value = dN(i)), r)) {
        let s = e,
          { value: o } = s,
          a = ca(s, ["value"]);
        this.options = a;
      } else this.options = {};
      this.options.params || (this.options.params = {});
    }
    absorbOptions(e) {
      let n = e.params;
      if (n) {
        let r = this.options.params;
        Object.keys(n).forEach((i) => {
          r[i] == null && (r[i] = n[i]);
        });
      }
    }
  },
  fo = "void",
  rh = new mo(fo),
  yh = class {
    constructor(e, n, r) {
      (this.id = e),
        (this.hostElement = n),
        (this._engine = r),
        (this.players = []),
        (this._triggers = new Map()),
        (this._queue = []),
        (this._elementListeners = new Map()),
        (this._hostClassName = "ng-tns-" + e),
        Gt(n, this._hostClassName);
    }
    listen(e, n, r, i) {
      if (!this._triggers.has(n)) throw wM(r, n);
      if (r == null || r.length == 0) throw DM(n);
      if (!fN(r)) throw _M(r, n);
      let s = jt(this._elementListeners, e, []),
        o = { name: n, phase: r, callback: i };
      s.push(o);
      let a = jt(this._engine.statesByElement, e, new Map());
      return (
        a.has(n) || (Gt(e, dl), Gt(e, dl + "-" + n), a.set(n, rh)),
        () => {
          this._engine.afterFlush(() => {
            let c = s.indexOf(o);
            c >= 0 && s.splice(c, 1), this._triggers.has(n) || a.delete(n);
          });
        }
      );
    }
    register(e, n) {
      return this._triggers.has(e) ? !1 : (this._triggers.set(e, n), !0);
    }
    _getTrigger(e) {
      let n = this._triggers.get(e);
      if (!n) throw TM(e);
      return n;
    }
    trigger(e, n, r, i = !0) {
      let s = this._getTrigger(n),
        o = new go(this.id, n, e),
        a = this._engine.statesByElement.get(e);
      a ||
        (Gt(e, dl),
        Gt(e, dl + "-" + n),
        this._engine.statesByElement.set(e, (a = new Map())));
      let c = a.get(n),
        l = new mo(r, this.id);
      if (
        (!(r && r.hasOwnProperty("value")) && c && l.absorbOptions(c.options),
        a.set(n, l),
        c || (c = rh),
        !(l.value === fo) && c.value === l.value)
      ) {
        if (!mN(c.params, l.params)) {
          let N = [],
            F = s.matchStyles(c.value, c.params, N),
            x = s.matchStyles(l.value, l.params, N);
          N.length
            ? this._engine.reportError(N)
            : this._engine.afterFlush(() => {
                ti(e, F), En(e, x);
              });
        }
        return;
      }
      let m = jt(this._engine.playersByElement, e, []);
      m.forEach((N) => {
        N.namespaceId == this.id &&
          N.triggerName == n &&
          N.queued &&
          N.destroy();
      });
      let b = s.matchTransition(c.value, l.value, e, l.params),
        I = !1;
      if (!b) {
        if (!i) return;
        (b = s.fallbackTransition), (I = !0);
      }
      return (
        this._engine.totalQueuedPlayers++,
        this._queue.push({
          element: e,
          triggerName: n,
          transition: b,
          fromState: c,
          toState: l,
          player: o,
          isFallbackTransition: I,
        }),
        I ||
          (Gt(e, YE),
          o.onStart(() => {
            Gi(e, YE);
          })),
        o.onDone(() => {
          let N = this.players.indexOf(o);
          N >= 0 && this.players.splice(N, 1);
          let F = this._engine.playersByElement.get(e);
          if (F) {
            let x = F.indexOf(o);
            x >= 0 && F.splice(x, 1);
          }
        }),
        this.players.push(o),
        m.push(o),
        o
      );
    }
    deregister(e) {
      this._triggers.delete(e),
        this._engine.statesByElement.forEach((n) => n.delete(e)),
        this._elementListeners.forEach((n, r) => {
          this._elementListeners.set(
            r,
            n.filter((i) => i.name != e)
          );
        });
    }
    clearElementCache(e) {
      this._engine.statesByElement.delete(e), this._elementListeners.delete(e);
      let n = this._engine.playersByElement.get(e);
      n &&
        (n.forEach((r) => r.destroy()),
        this._engine.playersByElement.delete(e));
    }
    _signalRemovalForInnerTriggers(e, n) {
      let r = this._engine.driver.query(e, gl, !0);
      r.forEach((i) => {
        if (i[an]) return;
        let s = this._engine.fetchNamespacesByElement(i);
        s.size
          ? s.forEach((o) => o.triggerLeaveAnimation(i, n, !1, !0))
          : this.clearElementCache(i);
      }),
        this._engine.afterFlushAnimationsDone(() =>
          r.forEach((i) => this.clearElementCache(i))
        );
    }
    triggerLeaveAnimation(e, n, r, i) {
      let s = this._engine.statesByElement.get(e),
        o = new Map();
      if (s) {
        let a = [];
        if (
          (s.forEach((c, l) => {
            if ((o.set(l, c.value), this._triggers.has(l))) {
              let u = this.trigger(e, l, fo, i);
              u && a.push(u);
            }
          }),
          a.length)
        )
          return (
            this._engine.markElementAsRemoved(this.id, e, !0, n, o),
            r && yr(a).onDone(() => this._engine.processLeaveNode(e)),
            !0
          );
      }
      return !1;
    }
    prepareLeaveAnimationListeners(e) {
      let n = this._elementListeners.get(e),
        r = this._engine.statesByElement.get(e);
      if (n && r) {
        let i = new Set();
        n.forEach((s) => {
          let o = s.name;
          if (i.has(o)) return;
          i.add(o);
          let c = this._triggers.get(o).fallbackTransition,
            l = r.get(o) || rh,
            u = new mo(fo),
            d = new go(this.id, o, e);
          this._engine.totalQueuedPlayers++,
            this._queue.push({
              element: e,
              triggerName: o,
              transition: c,
              fromState: l,
              toState: u,
              player: d,
              isFallbackTransition: !0,
            });
        });
      }
    }
    removeNode(e, n) {
      let r = this._engine;
      if (
        (e.childElementCount && this._signalRemovalForInnerTriggers(e, n),
        this.triggerLeaveAnimation(e, n, !0))
      )
        return;
      let i = !1;
      if (r.totalAnimations) {
        let s = r.players.length ? r.playersByQueriedElement.get(e) : [];
        if (s && s.length) i = !0;
        else {
          let o = e;
          for (; (o = o.parentNode); )
            if (r.statesByElement.get(o)) {
              i = !0;
              break;
            }
        }
      }
      if ((this.prepareLeaveAnimationListeners(e), i))
        r.markElementAsRemoved(this.id, e, !1, n);
      else {
        let s = e[an];
        (!s || s === db) &&
          (r.afterFlush(() => this.clearElementCache(e)),
          r.destroyInnerAnimations(e),
          r._onRemovalComplete(e, n));
      }
    }
    insertNode(e, n) {
      Gt(e, this._hostClassName);
    }
    drainQueuedTransitions(e) {
      let n = [];
      return (
        this._queue.forEach((r) => {
          let i = r.player;
          if (i.destroyed) return;
          let s = r.element,
            o = this._elementListeners.get(s);
          o &&
            o.forEach((a) => {
              if (a.name == r.triggerName) {
                let c = Dh(
                  s,
                  r.triggerName,
                  r.fromState.value,
                  r.toState.value
                );
                (c._data = e), wh(r.player, a.phase, c, a.callback);
              }
            }),
            i.markedForDestroy
              ? this._engine.afterFlush(() => {
                  i.destroy();
                })
              : n.push(r);
        }),
        (this._queue = []),
        n.sort((r, i) => {
          let s = r.transition.ast.depCount,
            o = i.transition.ast.depCount;
          return s == 0 || o == 0
            ? s - o
            : this._engine.driver.containsElement(r.element, i.element)
            ? 1
            : -1;
        })
      );
    }
    destroy(e) {
      this.players.forEach((n) => n.destroy()),
        this._signalRemovalForInnerTriggers(this.hostElement, e);
    }
  },
  vh = class {
    _onRemovalComplete(e, n) {
      this.onRemovalComplete(e, n);
    }
    constructor(e, n, r, i) {
      (this.bodyNode = e),
        (this.driver = n),
        (this._normalizer = r),
        (this.scheduler = i),
        (this.players = []),
        (this.newHostElements = new Map()),
        (this.playersByElement = new Map()),
        (this.playersByQueriedElement = new Map()),
        (this.statesByElement = new Map()),
        (this.disabledNodes = new Set()),
        (this.totalAnimations = 0),
        (this.totalQueuedPlayers = 0),
        (this._namespaceLookup = {}),
        (this._namespaceList = []),
        (this._flushFns = []),
        (this._whenQuietFns = []),
        (this.namespacesByHostElement = new Map()),
        (this.collectedEnterElements = []),
        (this.collectedLeaveElements = []),
        (this.onRemovalComplete = (s, o) => {});
    }
    get queuedPlayers() {
      let e = [];
      return (
        this._namespaceList.forEach((n) => {
          n.players.forEach((r) => {
            r.queued && e.push(r);
          });
        }),
        e
      );
    }
    createNamespace(e, n) {
      let r = new yh(e, n, this);
      return (
        this.bodyNode && this.driver.containsElement(this.bodyNode, n)
          ? this._balanceNamespaceList(r, n)
          : (this.newHostElements.set(n, r), this.collectEnterElement(n)),
        (this._namespaceLookup[e] = r)
      );
    }
    _balanceNamespaceList(e, n) {
      let r = this._namespaceList,
        i = this.namespacesByHostElement;
      if (r.length - 1 >= 0) {
        let o = !1,
          a = this.driver.getParentElement(n);
        for (; a; ) {
          let c = i.get(a);
          if (c) {
            let l = r.indexOf(c);
            r.splice(l + 1, 0, e), (o = !0);
            break;
          }
          a = this.driver.getParentElement(a);
        }
        o || r.unshift(e);
      } else r.push(e);
      return i.set(n, e), e;
    }
    register(e, n) {
      let r = this._namespaceLookup[e];
      return r || (r = this.createNamespace(e, n)), r;
    }
    registerTrigger(e, n, r) {
      let i = this._namespaceLookup[e];
      i && i.register(n, r) && this.totalAnimations++;
    }
    destroy(e, n) {
      e &&
        (this.afterFlush(() => {}),
        this.afterFlushAnimationsDone(() => {
          let r = this._fetchNamespace(e);
          this.namespacesByHostElement.delete(r.hostElement);
          let i = this._namespaceList.indexOf(r);
          i >= 0 && this._namespaceList.splice(i, 1),
            r.destroy(n),
            delete this._namespaceLookup[e];
        }));
    }
    _fetchNamespace(e) {
      return this._namespaceLookup[e];
    }
    fetchNamespacesByElement(e) {
      let n = new Set(),
        r = this.statesByElement.get(e);
      if (r) {
        for (let i of r.values())
          if (i.namespaceId) {
            let s = this._fetchNamespace(i.namespaceId);
            s && n.add(s);
          }
      }
      return n;
    }
    trigger(e, n, r, i) {
      if (pl(n)) {
        let s = this._fetchNamespace(e);
        if (s) return s.trigger(n, r, i), !0;
      }
      return !1;
    }
    insertNode(e, n, r, i) {
      if (!pl(n)) return;
      let s = n[an];
      if (s && s.setForRemoval) {
        (s.setForRemoval = !1), (s.setForMove = !0);
        let o = this.collectedLeaveElements.indexOf(n);
        o >= 0 && this.collectedLeaveElements.splice(o, 1);
      }
      if (e) {
        let o = this._fetchNamespace(e);
        o && o.insertNode(n, r);
      }
      i && this.collectEnterElement(n);
    }
    collectEnterElement(e) {
      this.collectedEnterElements.push(e);
    }
    markElementAsDisabled(e, n) {
      n
        ? this.disabledNodes.has(e) || (this.disabledNodes.add(e), Gt(e, nh))
        : this.disabledNodes.has(e) &&
          (this.disabledNodes.delete(e), Gi(e, nh));
    }
    removeNode(e, n, r) {
      if (pl(n)) {
        this.scheduler?.notify();
        let i = e ? this._fetchNamespace(e) : null;
        i ? i.removeNode(n, r) : this.markElementAsRemoved(e, n, !1, r);
        let s = this.namespacesByHostElement.get(n);
        s && s.id !== e && s.removeNode(n, r);
      } else this._onRemovalComplete(n, r);
    }
    markElementAsRemoved(e, n, r, i, s) {
      this.collectedLeaveElements.push(n),
        (n[an] = {
          namespaceId: e,
          setForRemoval: i,
          hasAnimation: r,
          removedBeforeQueried: !1,
          previousTriggersValues: s,
        });
    }
    listen(e, n, r, i, s) {
      return pl(n) ? this._fetchNamespace(e).listen(n, r, i, s) : () => {};
    }
    _buildInstruction(e, n, r, i, s) {
      return e.transition.build(
        this.driver,
        e.element,
        e.fromState.value,
        e.toState.value,
        r,
        i,
        e.fromState.options,
        e.toState.options,
        n,
        s
      );
    }
    destroyInnerAnimations(e) {
      let n = this.driver.query(e, gl, !0);
      n.forEach((r) => this.destroyActiveAnimationsForElement(r)),
        this.playersByQueriedElement.size != 0 &&
          ((n = this.driver.query(e, oh, !0)),
          n.forEach((r) => this.finishActiveQueriedAnimationOnElement(r)));
    }
    destroyActiveAnimationsForElement(e) {
      let n = this.playersByElement.get(e);
      n &&
        n.forEach((r) => {
          r.queued ? (r.markedForDestroy = !0) : r.destroy();
        });
    }
    finishActiveQueriedAnimationOnElement(e) {
      let n = this.playersByQueriedElement.get(e);
      n && n.forEach((r) => r.finish());
    }
    whenRenderingDone() {
      return new Promise((e) => {
        if (this.players.length) return yr(this.players).onDone(() => e());
        e();
      });
    }
    processLeaveNode(e) {
      let n = e[an];
      if (n && n.setForRemoval) {
        if (((e[an] = db), n.namespaceId)) {
          this.destroyInnerAnimations(e);
          let r = this._fetchNamespace(n.namespaceId);
          r && r.clearElementCache(e);
        }
        this._onRemovalComplete(e, n.setForRemoval);
      }
      e.classList?.contains(nh) && this.markElementAsDisabled(e, !1),
        this.driver.query(e, sN, !0).forEach((r) => {
          this.markElementAsDisabled(r, !1);
        });
    }
    flush(e = -1) {
      let n = [];
      if (
        (this.newHostElements.size &&
          (this.newHostElements.forEach((r, i) =>
            this._balanceNamespaceList(r, i)
          ),
          this.newHostElements.clear()),
        this.totalAnimations && this.collectedEnterElements.length)
      )
        for (let r = 0; r < this.collectedEnterElements.length; r++) {
          let i = this.collectedEnterElements[r];
          Gt(i, oN);
        }
      if (
        this._namespaceList.length &&
        (this.totalQueuedPlayers || this.collectedLeaveElements.length)
      ) {
        let r = [];
        try {
          n = this._flushAnimations(r, e);
        } finally {
          for (let i = 0; i < r.length; i++) r[i]();
        }
      } else
        for (let r = 0; r < this.collectedLeaveElements.length; r++) {
          let i = this.collectedLeaveElements[r];
          this.processLeaveNode(i);
        }
      if (
        ((this.totalQueuedPlayers = 0),
        (this.collectedEnterElements.length = 0),
        (this.collectedLeaveElements.length = 0),
        this._flushFns.forEach((r) => r()),
        (this._flushFns = []),
        this._whenQuietFns.length)
      ) {
        let r = this._whenQuietFns;
        (this._whenQuietFns = []),
          n.length
            ? yr(n).onDone(() => {
                r.forEach((i) => i());
              })
            : r.forEach((i) => i());
      }
    }
    reportError(e) {
      throw SM(e);
    }
    _flushAnimations(e, n) {
      let r = new po(),
        i = [],
        s = new Map(),
        o = [],
        a = new Map(),
        c = new Map(),
        l = new Map(),
        u = new Set();
      this.disabledNodes.forEach((y) => {
        u.add(y);
        let C = this.driver.query(y, iN, !0);
        for (let R = 0; R < C.length; R++) u.add(C[R]);
      });
      let d = this.bodyNode,
        m = Array.from(this.statesByElement.keys()),
        b = JE(m, this.collectedEnterElements),
        I = new Map(),
        N = 0;
      b.forEach((y, C) => {
        let R = sb + N++;
        I.set(C, R), y.forEach((V) => Gt(V, R));
      });
      let F = [],
        x = new Set(),
        _ = new Set();
      for (let y = 0; y < this.collectedLeaveElements.length; y++) {
        let C = this.collectedLeaveElements[y],
          R = C[an];
        R &&
          R.setForRemoval &&
          (F.push(C),
          x.add(C),
          R.hasAnimation
            ? this.driver.query(C, aN, !0).forEach((V) => x.add(V))
            : _.add(C));
      }
      let w = new Map(),
        T = JE(m, Array.from(x));
      T.forEach((y, C) => {
        let R = sh + N++;
        w.set(C, R), y.forEach((V) => Gt(V, R));
      }),
        e.push(() => {
          b.forEach((y, C) => {
            let R = I.get(C);
            y.forEach((V) => Gi(V, R));
          }),
            T.forEach((y, C) => {
              let R = w.get(C);
              y.forEach((V) => Gi(V, R));
            }),
            F.forEach((y) => {
              this.processLeaveNode(y);
            });
        });
      let E = [],
        ee = [];
      for (let y = this._namespaceList.length - 1; y >= 0; y--)
        this._namespaceList[y].drainQueuedTransitions(n).forEach((R) => {
          let V = R.player,
            Q = R.element;
          if ((E.push(V), this.collectedEnterElements.length)) {
            let ot = Q[an];
            if (ot && ot.setForMove) {
              if (
                ot.previousTriggersValues &&
                ot.previousTriggersValues.has(R.triggerName)
              ) {
                let Dn = ot.previousTriggersValues.get(R.triggerName),
                  vt = this.statesByElement.get(R.element);
                if (vt && vt.has(R.triggerName)) {
                  let ci = vt.get(R.triggerName);
                  (ci.value = Dn), vt.set(R.triggerName, ci);
                }
              }
              V.destroy();
              return;
            }
          }
          let he = !d || !this.driver.containsElement(d, Q),
            S = w.get(Q),
            k = I.get(Q),
            $ = this._buildInstruction(R, r, k, S, he);
          if ($.errors && $.errors.length) {
            ee.push($);
            return;
          }
          if (he) {
            V.onStart(() => ti(Q, $.fromStyles)),
              V.onDestroy(() => En(Q, $.toStyles)),
              i.push(V);
            return;
          }
          if (R.isFallbackTransition) {
            V.onStart(() => ti(Q, $.fromStyles)),
              V.onDestroy(() => En(Q, $.toStyles)),
              i.push(V);
            return;
          }
          let _e = [];
          $.timelines.forEach((ot) => {
            (ot.stretchStartingKeyframe = !0),
              this.disabledNodes.has(ot.element) || _e.push(ot);
          }),
            ($.timelines = _e),
            r.append(Q, $.timelines);
          let ht = { instruction: $, player: V, element: Q };
          o.push(ht),
            $.queriedElements.forEach((ot) => jt(a, ot, []).push(V)),
            $.preStyleProps.forEach((ot, Dn) => {
              if (ot.size) {
                let vt = c.get(Dn);
                vt || c.set(Dn, (vt = new Set())),
                  ot.forEach((ci, ss) => vt.add(ss));
              }
            }),
            $.postStyleProps.forEach((ot, Dn) => {
              let vt = l.get(Dn);
              vt || l.set(Dn, (vt = new Set())),
                ot.forEach((ci, ss) => vt.add(ss));
            });
        });
      if (ee.length) {
        let y = [];
        ee.forEach((C) => {
          y.push(CM(C.triggerName, C.errors));
        }),
          E.forEach((C) => C.destroy()),
          this.reportError(y);
      }
      let ne = new Map(),
        me = new Map();
      o.forEach((y) => {
        let C = y.element;
        r.has(C) &&
          (me.set(C, C),
          this._beforeAnimationBuild(y.player.namespaceId, y.instruction, ne));
      }),
        i.forEach((y) => {
          let C = y.element;
          this._getPreviousPlayers(
            C,
            !1,
            y.namespaceId,
            y.triggerName,
            null
          ).forEach((V) => {
            jt(ne, C, []).push(V), V.destroy();
          });
        });
      let q = F.filter((y) => eb(y, c, l)),
        O = new Map();
      XE(O, this.driver, _, l, vn).forEach((y) => {
        eb(y, c, l) && q.push(y);
      });
      let Y = new Map();
      b.forEach((y, C) => {
        XE(Y, this.driver, new Set(y), c, ul);
      }),
        q.forEach((y) => {
          let C = O.get(y),
            R = Y.get(y);
          O.set(y, new Map([...(C?.entries() ?? []), ...(R?.entries() ?? [])]));
        });
      let v = [],
        g = [],
        p = {};
      o.forEach((y) => {
        let { element: C, player: R, instruction: V } = y;
        if (r.has(C)) {
          if (u.has(C)) {
            R.onDestroy(() => En(C, V.toStyles)),
              (R.disabled = !0),
              R.overrideTotalTime(V.totalTime),
              i.push(R);
            return;
          }
          let Q = p;
          if (me.size > 1) {
            let S = C,
              k = [];
            for (; (S = S.parentNode); ) {
              let $ = me.get(S);
              if ($) {
                Q = $;
                break;
              }
              k.push(S);
            }
            k.forEach(($) => me.set($, Q));
          }
          let he = this._buildAnimation(R.namespaceId, V, ne, s, Y, O);
          if ((R.setRealPlayer(he), Q === p)) v.push(R);
          else {
            let S = this.playersByElement.get(Q);
            S && S.length && (R.parentPlayer = yr(S)), i.push(R);
          }
        } else
          ti(C, V.fromStyles),
            R.onDestroy(() => En(C, V.toStyles)),
            g.push(R),
            u.has(C) && i.push(R);
      }),
        g.forEach((y) => {
          let C = s.get(y.element);
          if (C && C.length) {
            let R = yr(C);
            y.setRealPlayer(R);
          }
        }),
        i.forEach((y) => {
          y.parentPlayer ? y.syncPlayerEvents(y.parentPlayer) : y.destroy();
        });
      for (let y = 0; y < F.length; y++) {
        let C = F[y],
          R = C[an];
        if ((Gi(C, sh), R && R.hasAnimation)) continue;
        let V = [];
        if (a.size) {
          let he = a.get(C);
          he && he.length && V.push(...he);
          let S = this.driver.query(C, oh, !0);
          for (let k = 0; k < S.length; k++) {
            let $ = a.get(S[k]);
            $ && $.length && V.push(...$);
          }
        }
        let Q = V.filter((he) => !he.destroyed);
        Q.length ? hN(this, C, Q) : this.processLeaveNode(C);
      }
      return (
        (F.length = 0),
        v.forEach((y) => {
          this.players.push(y),
            y.onDone(() => {
              y.destroy();
              let C = this.players.indexOf(y);
              this.players.splice(C, 1);
            }),
            y.play();
        }),
        v
      );
    }
    afterFlush(e) {
      this._flushFns.push(e);
    }
    afterFlushAnimationsDone(e) {
      this._whenQuietFns.push(e);
    }
    _getPreviousPlayers(e, n, r, i, s) {
      let o = [];
      if (n) {
        let a = this.playersByQueriedElement.get(e);
        a && (o = a);
      } else {
        let a = this.playersByElement.get(e);
        if (a) {
          let c = !s || s == fo;
          a.forEach((l) => {
            l.queued || (!c && l.triggerName != i) || o.push(l);
          });
        }
      }
      return (
        (r || i) &&
          (o = o.filter(
            (a) => !((r && r != a.namespaceId) || (i && i != a.triggerName))
          )),
        o
      );
    }
    _beforeAnimationBuild(e, n, r) {
      let i = n.triggerName,
        s = n.element,
        o = n.isRemovalTransition ? void 0 : e,
        a = n.isRemovalTransition ? void 0 : i;
      for (let c of n.timelines) {
        let l = c.element,
          u = l !== s,
          d = jt(r, l, []);
        this._getPreviousPlayers(l, u, o, a, n.toState).forEach((b) => {
          let I = b.getRealPlayer();
          I.beforeDestroy && I.beforeDestroy(), b.destroy(), d.push(b);
        });
      }
      ti(s, n.fromStyles);
    }
    _buildAnimation(e, n, r, i, s, o) {
      let a = n.triggerName,
        c = n.element,
        l = [],
        u = new Set(),
        d = new Set(),
        m = n.timelines.map((I) => {
          let N = I.element;
          u.add(N);
          let F = N[an];
          if (F && F.removedBeforeQueried) return new gr(I.duration, I.delay);
          let x = N !== c,
            _ = pN((r.get(N) || cN).map((ne) => ne.getRealPlayer())).filter(
              (ne) => {
                let me = ne;
                return me.element ? me.element === N : !1;
              }
            ),
            w = s.get(N),
            T = o.get(N),
            E = tb(this._normalizer, I.keyframes, w, T),
            ee = this._buildPlayer(I, E, _);
          if ((I.subTimeline && i && d.add(N), x)) {
            let ne = new go(e, a, N);
            ne.setRealPlayer(ee), l.push(ne);
          }
          return ee;
        });
      l.forEach((I) => {
        jt(this.playersByQueriedElement, I.element, []).push(I),
          I.onDone(() => uN(this.playersByQueriedElement, I.element, I));
      }),
        u.forEach((I) => Gt(I, qE));
      let b = yr(m);
      return (
        b.onDestroy(() => {
          u.forEach((I) => Gi(I, qE)), En(c, n.toStyles);
        }),
        d.forEach((I) => {
          jt(i, I, []).push(b);
        }),
        b
      );
    }
    _buildPlayer(e, n, r) {
      return n.length > 0
        ? this.driver.animate(e.element, n, e.duration, e.delay, e.easing, r)
        : new gr(e.duration, e.delay);
    }
  },
  go = class {
    constructor(e, n, r) {
      (this.namespaceId = e),
        (this.triggerName = n),
        (this.element = r),
        (this._player = new gr()),
        (this._containsRealPlayer = !1),
        (this._queuedCallbacks = new Map()),
        (this.destroyed = !1),
        (this.parentPlayer = null),
        (this.markedForDestroy = !1),
        (this.disabled = !1),
        (this.queued = !0),
        (this.totalTime = 0);
    }
    setRealPlayer(e) {
      this._containsRealPlayer ||
        ((this._player = e),
        this._queuedCallbacks.forEach((n, r) => {
          n.forEach((i) => wh(e, r, void 0, i));
        }),
        this._queuedCallbacks.clear(),
        (this._containsRealPlayer = !0),
        this.overrideTotalTime(e.totalTime),
        (this.queued = !1));
    }
    getRealPlayer() {
      return this._player;
    }
    overrideTotalTime(e) {
      this.totalTime = e;
    }
    syncPlayerEvents(e) {
      let n = this._player;
      n.triggerCallback && e.onStart(() => n.triggerCallback("start")),
        e.onDone(() => this.finish()),
        e.onDestroy(() => this.destroy());
    }
    _queueEvent(e, n) {
      jt(this._queuedCallbacks, e, []).push(n);
    }
    onDone(e) {
      this.queued && this._queueEvent("done", e), this._player.onDone(e);
    }
    onStart(e) {
      this.queued && this._queueEvent("start", e), this._player.onStart(e);
    }
    onDestroy(e) {
      this.queued && this._queueEvent("destroy", e), this._player.onDestroy(e);
    }
    init() {
      this._player.init();
    }
    hasStarted() {
      return this.queued ? !1 : this._player.hasStarted();
    }
    play() {
      !this.queued && this._player.play();
    }
    pause() {
      !this.queued && this._player.pause();
    }
    restart() {
      !this.queued && this._player.restart();
    }
    finish() {
      this._player.finish();
    }
    destroy() {
      (this.destroyed = !0), this._player.destroy();
    }
    reset() {
      !this.queued && this._player.reset();
    }
    setPosition(e) {
      this.queued || this._player.setPosition(e);
    }
    getPosition() {
      return this.queued ? 0 : this._player.getPosition();
    }
    triggerCallback(e) {
      let n = this._player;
      n.triggerCallback && n.triggerCallback(e);
    }
  };
function uN(t, e, n) {
  let r = t.get(e);
  if (r) {
    if (r.length) {
      let i = r.indexOf(n);
      r.splice(i, 1);
    }
    r.length == 0 && t.delete(e);
  }
  return r;
}
function dN(t) {
  return t ?? null;
}
function pl(t) {
  return t && t.nodeType === 1;
}
function fN(t) {
  return t == "start" || t == "done";
}
function ZE(t, e) {
  let n = t.style.display;
  return (t.style.display = e ?? "none"), n;
}
function XE(t, e, n, r, i) {
  let s = [];
  n.forEach((c) => s.push(ZE(c)));
  let o = [];
  r.forEach((c, l) => {
    let u = new Map();
    c.forEach((d) => {
      let m = e.computeStyle(l, d, i);
      u.set(d, m), (!m || m.length == 0) && ((l[an] = lN), o.push(l));
    }),
      t.set(l, u);
  });
  let a = 0;
  return n.forEach((c) => ZE(c, s[a++])), o;
}
function JE(t, e) {
  let n = new Map();
  if ((t.forEach((a) => n.set(a, [])), e.length == 0)) return n;
  let r = 1,
    i = new Set(e),
    s = new Map();
  function o(a) {
    if (!a) return r;
    let c = s.get(a);
    if (c) return c;
    let l = a.parentNode;
    return n.has(l) ? (c = l) : i.has(l) ? (c = r) : (c = o(l)), s.set(a, c), c;
  }
  return (
    e.forEach((a) => {
      let c = o(a);
      c !== r && n.get(c).push(a);
    }),
    n
  );
}
function Gt(t, e) {
  t.classList?.add(e);
}
function Gi(t, e) {
  t.classList?.remove(e);
}
function hN(t, e, n) {
  yr(n).onDone(() => t.processLeaveNode(e));
}
function pN(t) {
  let e = [];
  return fb(t, e), e;
}
function fb(t, e) {
  for (let n = 0; n < t.length; n++) {
    let r = t[n];
    r instanceof lo ? fb(r.players, e) : e.push(r);
  }
}
function mN(t, e) {
  let n = Object.keys(t),
    r = Object.keys(e);
  if (n.length != r.length) return !1;
  for (let i = 0; i < n.length; i++) {
    let s = n[i];
    if (!e.hasOwnProperty(s) || t[s] !== e[s]) return !1;
  }
  return !0;
}
function eb(t, e, n) {
  let r = n.get(t);
  if (!r) return !1;
  let i = e.get(t);
  return i ? r.forEach((s) => i.add(s)) : e.set(t, r), n.delete(t), !0;
}
var Ki = class {
  constructor(e, n, r, i) {
    (this._driver = n),
      (this._normalizer = r),
      (this._triggerCache = {}),
      (this.onRemovalComplete = (s, o) => {}),
      (this._transitionEngine = new vh(e.body, n, r, i)),
      (this._timelineEngine = new gh(e.body, n, r)),
      (this._transitionEngine.onRemovalComplete = (s, o) =>
        this.onRemovalComplete(s, o));
  }
  registerTrigger(e, n, r, i, s) {
    let o = e + "-" + i,
      a = this._triggerCache[o];
    if (!a) {
      let c = [],
        l = [],
        u = cb(this._driver, s, c, l);
      if (c.length) throw mM(i, c);
      l.length && void 0,
        (a = tN(i, u, this._normalizer)),
        (this._triggerCache[o] = a);
    }
    this._transitionEngine.registerTrigger(n, i, a);
  }
  register(e, n) {
    this._transitionEngine.register(e, n);
  }
  destroy(e, n) {
    this._transitionEngine.destroy(e, n);
  }
  onInsert(e, n, r, i) {
    this._transitionEngine.insertNode(e, n, r, i);
  }
  onRemove(e, n, r) {
    this._transitionEngine.removeNode(e, n, r);
  }
  disableAnimations(e, n) {
    this._transitionEngine.markElementAsDisabled(e, n);
  }
  process(e, n, r, i) {
    if (r.charAt(0) == "@") {
      let [s, o] = VE(r),
        a = i;
      this._timelineEngine.command(s, n, o, a);
    } else this._transitionEngine.trigger(e, n, r, i);
  }
  listen(e, n, r, i, s) {
    if (r.charAt(0) == "@") {
      let [o, a] = VE(r);
      return this._timelineEngine.listen(o, n, a, s);
    }
    return this._transitionEngine.listen(e, n, r, i, s);
  }
  flush(e = -1) {
    this._transitionEngine.flush(e);
  }
  get players() {
    return [...this._transitionEngine.players, ...this._timelineEngine.players];
  }
  whenRenderingDone() {
    return this._transitionEngine.whenRenderingDone();
  }
  afterFlushAnimationsDone(e) {
    this._transitionEngine.afterFlushAnimationsDone(e);
  }
};
function gN(t, e) {
  let n = null,
    r = null;
  return (
    Array.isArray(e) && e.length
      ? ((n = ih(e[0])), e.length > 1 && (r = ih(e[e.length - 1])))
      : e instanceof Map && (n = ih(e)),
    n || r ? new Eh(t, n, r) : null
  );
}
var Wi = class Wi {
  constructor(e, n, r) {
    (this._element = e),
      (this._startStyles = n),
      (this._endStyles = r),
      (this._state = 0);
    let i = Wi.initialStylesByElement.get(e);
    i || Wi.initialStylesByElement.set(e, (i = new Map())),
      (this._initialStyles = i);
  }
  start() {
    this._state < 1 &&
      (this._startStyles &&
        En(this._element, this._startStyles, this._initialStyles),
      (this._state = 1));
  }
  finish() {
    this.start(),
      this._state < 2 &&
        (En(this._element, this._initialStyles),
        this._endStyles &&
          (En(this._element, this._endStyles), (this._endStyles = null)),
        (this._state = 1));
  }
  destroy() {
    this.finish(),
      this._state < 3 &&
        (Wi.initialStylesByElement.delete(this._element),
        this._startStyles &&
          (ti(this._element, this._startStyles), (this._endStyles = null)),
        this._endStyles &&
          (ti(this._element, this._endStyles), (this._endStyles = null)),
        En(this._element, this._initialStyles),
        (this._state = 3));
  }
};
Wi.initialStylesByElement = new WeakMap();
var Eh = Wi;
function ih(t) {
  let e = null;
  return (
    t.forEach((n, r) => {
      yN(r) && ((e = e || new Map()), e.set(r, n));
    }),
    e
  );
}
function yN(t) {
  return t === "display" || t === "position";
}
var _l = class {
    constructor(e, n, r, i) {
      (this.element = e),
        (this.keyframes = n),
        (this.options = r),
        (this._specialStyles = i),
        (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._onDestroyFns = []),
        (this._initialized = !1),
        (this._finished = !1),
        (this._started = !1),
        (this._destroyed = !1),
        (this._originalOnDoneFns = []),
        (this._originalOnStartFns = []),
        (this.time = 0),
        (this.parentPlayer = null),
        (this.currentSnapshot = new Map()),
        (this._duration = r.duration),
        (this._delay = r.delay || 0),
        (this.time = this._duration + this._delay);
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((e) => e()),
        (this._onDoneFns = []));
    }
    init() {
      this._buildPlayer(), this._preparePlayerBeforeStart();
    }
    _buildPlayer() {
      if (this._initialized) return;
      this._initialized = !0;
      let e = this.keyframes;
      (this.domPlayer = this._triggerWebAnimation(
        this.element,
        e,
        this.options
      )),
        (this._finalKeyframe = e.length ? e[e.length - 1] : new Map());
      let n = () => this._onFinish();
      this.domPlayer.addEventListener("finish", n),
        this.onDestroy(() => {
          this.domPlayer.removeEventListener("finish", n);
        });
    }
    _preparePlayerBeforeStart() {
      this._delay ? this._resetDomPlayerState() : this.domPlayer.pause();
    }
    _convertKeyframesToObject(e) {
      let n = [];
      return (
        e.forEach((r) => {
          n.push(Object.fromEntries(r));
        }),
        n
      );
    }
    _triggerWebAnimation(e, n, r) {
      return e.animate(this._convertKeyframesToObject(n), r);
    }
    onStart(e) {
      this._originalOnStartFns.push(e), this._onStartFns.push(e);
    }
    onDone(e) {
      this._originalOnDoneFns.push(e), this._onDoneFns.push(e);
    }
    onDestroy(e) {
      this._onDestroyFns.push(e);
    }
    play() {
      this._buildPlayer(),
        this.hasStarted() ||
          (this._onStartFns.forEach((e) => e()),
          (this._onStartFns = []),
          (this._started = !0),
          this._specialStyles && this._specialStyles.start()),
        this.domPlayer.play();
    }
    pause() {
      this.init(), this.domPlayer.pause();
    }
    finish() {
      this.init(),
        this._specialStyles && this._specialStyles.finish(),
        this._onFinish(),
        this.domPlayer.finish();
    }
    reset() {
      this._resetDomPlayerState(),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._started = !1),
        (this._onStartFns = this._originalOnStartFns),
        (this._onDoneFns = this._originalOnDoneFns);
    }
    _resetDomPlayerState() {
      this.domPlayer && this.domPlayer.cancel();
    }
    restart() {
      this.reset(), this.play();
    }
    hasStarted() {
      return this._started;
    }
    destroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this._resetDomPlayerState(),
        this._onFinish(),
        this._specialStyles && this._specialStyles.destroy(),
        this._onDestroyFns.forEach((e) => e()),
        (this._onDestroyFns = []));
    }
    setPosition(e) {
      this.domPlayer === void 0 && this.init(),
        (this.domPlayer.currentTime = e * this.time);
    }
    getPosition() {
      return +(this.domPlayer.currentTime ?? 0) / this.time;
    }
    get totalTime() {
      return this._delay + this._duration;
    }
    beforeDestroy() {
      let e = new Map();
      this.hasStarted() &&
        this._finalKeyframe.forEach((r, i) => {
          i !== "offset" && e.set(i, this._finished ? r : Ch(this.element, i));
        }),
        (this.currentSnapshot = e);
    }
    triggerCallback(e) {
      let n = e === "start" ? this._onStartFns : this._onDoneFns;
      n.forEach((r) => r()), (n.length = 0);
    }
  },
  Tl = class {
    validateStyleProperty(e) {
      return !0;
    }
    validateAnimatableStyleProperty(e) {
      return !0;
    }
    matchesElement(e, n) {
      return !1;
    }
    containsElement(e, n) {
      return nb(e, n);
    }
    getParentElement(e) {
      return _h(e);
    }
    query(e, n, r) {
      return rb(e, n, r);
    }
    computeStyle(e, n, r) {
      return Ch(e, n);
    }
    animate(e, n, r, i, s, o = []) {
      let a = i == 0 ? "both" : "forwards",
        c = { duration: r, delay: i, fill: a };
      s && (c.easing = s);
      let l = new Map(),
        u = o.filter((b) => b instanceof _l);
      FM(r, i) &&
        u.forEach((b) => {
          b.currentSnapshot.forEach((I, N) => l.set(N, I));
        });
      let d = kM(n).map((b) => new Map(b));
      d = jM(e, d, l);
      let m = gN(e, d);
      return new _l(e, d, c, m);
    }
  };
var ml = "@",
  hb = "@.disabled",
  Sl = class {
    constructor(e, n, r, i) {
      (this.namespaceId = e),
        (this.delegate = n),
        (this.engine = r),
        (this._onDestroy = i),
        (this.ɵtype = 0);
    }
    get data() {
      return this.delegate.data;
    }
    destroyNode(e) {
      this.delegate.destroyNode?.(e);
    }
    destroy() {
      this.engine.destroy(this.namespaceId, this.delegate),
        this.engine.afterFlushAnimationsDone(() => {
          queueMicrotask(() => {
            this.delegate.destroy();
          });
        }),
        this._onDestroy?.();
    }
    createElement(e, n) {
      return this.delegate.createElement(e, n);
    }
    createComment(e) {
      return this.delegate.createComment(e);
    }
    createText(e) {
      return this.delegate.createText(e);
    }
    appendChild(e, n) {
      this.delegate.appendChild(e, n),
        this.engine.onInsert(this.namespaceId, n, e, !1);
    }
    insertBefore(e, n, r, i = !0) {
      this.delegate.insertBefore(e, n, r),
        this.engine.onInsert(this.namespaceId, n, e, i);
    }
    removeChild(e, n, r) {
      this.engine.onRemove(this.namespaceId, n, this.delegate);
    }
    selectRootElement(e, n) {
      return this.delegate.selectRootElement(e, n);
    }
    parentNode(e) {
      return this.delegate.parentNode(e);
    }
    nextSibling(e) {
      return this.delegate.nextSibling(e);
    }
    setAttribute(e, n, r, i) {
      this.delegate.setAttribute(e, n, r, i);
    }
    removeAttribute(e, n, r) {
      this.delegate.removeAttribute(e, n, r);
    }
    addClass(e, n) {
      this.delegate.addClass(e, n);
    }
    removeClass(e, n) {
      this.delegate.removeClass(e, n);
    }
    setStyle(e, n, r, i) {
      this.delegate.setStyle(e, n, r, i);
    }
    removeStyle(e, n, r) {
      this.delegate.removeStyle(e, n, r);
    }
    setProperty(e, n, r) {
      n.charAt(0) == ml && n == hb
        ? this.disableAnimations(e, !!r)
        : this.delegate.setProperty(e, n, r);
    }
    setValue(e, n) {
      this.delegate.setValue(e, n);
    }
    listen(e, n, r) {
      return this.delegate.listen(e, n, r);
    }
    disableAnimations(e, n) {
      this.engine.disableAnimations(e, n);
    }
  },
  bh = class extends Sl {
    constructor(e, n, r, i, s) {
      super(n, r, i, s), (this.factory = e), (this.namespaceId = n);
    }
    setProperty(e, n, r) {
      n.charAt(0) == ml
        ? n.charAt(1) == "." && n == hb
          ? ((r = r === void 0 ? !0 : !!r), this.disableAnimations(e, r))
          : this.engine.process(this.namespaceId, e, n.slice(1), r)
        : this.delegate.setProperty(e, n, r);
    }
    listen(e, n, r) {
      if (n.charAt(0) == ml) {
        let i = vN(e),
          s = n.slice(1),
          o = "";
        return (
          s.charAt(0) != ml && ([s, o] = EN(s)),
          this.engine.listen(this.namespaceId, i, s, o, (a) => {
            let c = a._data || -1;
            this.factory.scheduleListenerCallback(c, r, a);
          })
        );
      }
      return this.delegate.listen(e, n, r);
    }
  };
function vN(t) {
  switch (t) {
    case "body":
      return document.body;
    case "document":
      return document;
    case "window":
      return window;
    default:
      return t;
  }
}
function EN(t) {
  let e = t.indexOf("."),
    n = t.substring(0, e),
    r = t.slice(e + 1);
  return [n, r];
}
var Cl = class {
  constructor(e, n, r) {
    (this.delegate = e),
      (this.engine = n),
      (this._zone = r),
      (this._currentId = 0),
      (this._microtaskId = 1),
      (this._animationCallbacksBuffer = []),
      (this._rendererCache = new Map()),
      (this._cdRecurDepth = 0),
      (n.onRemovalComplete = (i, s) => {
        let o = s?.parentNode(i);
        o && s.removeChild(o, i);
      });
  }
  createRenderer(e, n) {
    let r = "",
      i = this.delegate.createRenderer(e, n);
    if (!e || !n?.data?.animation) {
      let l = this._rendererCache,
        u = l.get(i);
      if (!u) {
        let d = () => l.delete(i);
        (u = new Sl(r, i, this.engine, d)), l.set(i, u);
      }
      return u;
    }
    let s = n.id,
      o = n.id + "-" + this._currentId;
    this._currentId++, this.engine.register(o, e);
    let a = (l) => {
      Array.isArray(l)
        ? l.forEach(a)
        : this.engine.registerTrigger(s, o, e, l.name, l);
    };
    return n.data.animation.forEach(a), new bh(this, o, i, this.engine);
  }
  begin() {
    this._cdRecurDepth++, this.delegate.begin && this.delegate.begin();
  }
  _scheduleCountTask() {
    queueMicrotask(() => {
      this._microtaskId++;
    });
  }
  scheduleListenerCallback(e, n, r) {
    if (e >= 0 && e < this._microtaskId) {
      this._zone.run(() => n(r));
      return;
    }
    let i = this._animationCallbacksBuffer;
    i.length == 0 &&
      queueMicrotask(() => {
        this._zone.run(() => {
          i.forEach((s) => {
            let [o, a] = s;
            o(a);
          }),
            (this._animationCallbacksBuffer = []);
        });
      }),
      i.push([n, r]);
  }
  end() {
    this._cdRecurDepth--,
      this._cdRecurDepth == 0 &&
        this._zone.runOutsideAngular(() => {
          this._scheduleCountTask(), this.engine.flush(this._microtaskId);
        }),
      this.delegate.end && this.delegate.end();
  }
  whenRenderingDone() {
    return this.engine.whenRenderingDone();
  }
};
var DN = (() => {
  let e = class e extends Ki {
    constructor(r, i, s) {
      super(r, i, s, G(Os, { optional: !0 }));
    }
    ngOnDestroy() {
      this.flush();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(se(Ve), se(ni), se(ri));
  }),
    (e.ɵprov = te({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
function _N() {
  return new vl();
}
function TN(t, e, n) {
  return new Cl(t, e, n);
}
var pb = [
    { provide: ri, useFactory: _N },
    { provide: Ki, useClass: DN },
    { provide: Vr, useFactory: TN, deps: [cl, Ki, je] },
  ],
  v2 = [
    { provide: ni, useFactory: () => new Tl() },
    { provide: tf, useValue: "BrowserAnimations" },
    ...pb,
  ],
  SN = [
    { provide: ni, useClass: Th },
    { provide: tf, useValue: "NoopAnimations" },
    ...pb,
  ];
function mb() {
  return [...SN];
}
var CN = Object.getOwnPropertyNames,
  oe = (t, e) =>
    function () {
      return e || (0, t[CN(t)[0]])((e = { exports: {} }).exports, e), e.exports;
    },
  yo = oe({
    "external/npm/node_modules/domino/lib/Event.js"(t, e) {
      "use strict";
      (e.exports = n),
        (n.CAPTURING_PHASE = 1),
        (n.AT_TARGET = 2),
        (n.BUBBLING_PHASE = 3);
      function n(r, i) {
        if (
          ((this.type = ""),
          (this.target = null),
          (this.currentTarget = null),
          (this.eventPhase = n.AT_TARGET),
          (this.bubbles = !1),
          (this.cancelable = !1),
          (this.isTrusted = !1),
          (this.defaultPrevented = !1),
          (this.timeStamp = Date.now()),
          (this._propagationStopped = !1),
          (this._immediatePropagationStopped = !1),
          (this._initialized = !0),
          (this._dispatching = !1),
          r && (this.type = r),
          i)
        )
          for (var s in i) this[s] = i[s];
      }
      n.prototype = Object.create(Object.prototype, {
        constructor: { value: n },
        stopPropagation: {
          value: function () {
            this._propagationStopped = !0;
          },
        },
        stopImmediatePropagation: {
          value: function () {
            (this._propagationStopped = !0),
              (this._immediatePropagationStopped = !0);
          },
        },
        preventDefault: {
          value: function () {
            this.cancelable && (this.defaultPrevented = !0);
          },
        },
        initEvent: {
          value: function (i, s, o) {
            (this._initialized = !0),
              !this._dispatching &&
                ((this._propagationStopped = !1),
                (this._immediatePropagationStopped = !1),
                (this.defaultPrevented = !1),
                (this.isTrusted = !1),
                (this.target = null),
                (this.type = i),
                (this.bubbles = s),
                (this.cancelable = o));
          },
        },
      });
    },
  }),
  gb = oe({
    "external/npm/node_modules/domino/lib/UIEvent.js"(t, e) {
      "use strict";
      var n = yo();
      e.exports = r;
      function r() {
        n.call(this), (this.view = null), (this.detail = 0);
      }
      r.prototype = Object.create(n.prototype, {
        constructor: { value: r },
        initUIEvent: {
          value: function (i, s, o, a, c) {
            this.initEvent(i, s, o), (this.view = a), (this.detail = c);
          },
        },
      });
    },
  }),
  yb = oe({
    "external/npm/node_modules/domino/lib/MouseEvent.js"(t, e) {
      "use strict";
      var n = gb();
      e.exports = r;
      function r() {
        n.call(this),
          (this.screenX = this.screenY = this.clientX = this.clientY = 0),
          (this.ctrlKey = this.altKey = this.shiftKey = this.metaKey = !1),
          (this.button = 0),
          (this.buttons = 1),
          (this.relatedTarget = null);
      }
      r.prototype = Object.create(n.prototype, {
        constructor: { value: r },
        initMouseEvent: {
          value: function (i, s, o, a, c, l, u, d, m, b, I, N, F, x, _) {
            switch (
              (this.initEvent(i, s, o, a, c),
              (this.screenX = l),
              (this.screenY = u),
              (this.clientX = d),
              (this.clientY = m),
              (this.ctrlKey = b),
              (this.altKey = I),
              (this.shiftKey = N),
              (this.metaKey = F),
              (this.button = x),
              x)
            ) {
              case 0:
                this.buttons = 1;
                break;
              case 1:
                this.buttons = 4;
                break;
              case 2:
                this.buttons = 2;
                break;
              default:
                this.buttons = 0;
                break;
            }
            this.relatedTarget = _;
          },
        },
        getModifierState: {
          value: function (i) {
            switch (i) {
              case "Alt":
                return this.altKey;
              case "Control":
                return this.ctrlKey;
              case "Shift":
                return this.shiftKey;
              case "Meta":
                return this.metaKey;
              default:
                return !1;
            }
          },
        },
      });
    },
  }),
  xh = oe({
    "external/npm/node_modules/domino/lib/DOMException.js"(t, e) {
      "use strict";
      e.exports = O;
      var n = 1,
        r = 3,
        i = 4,
        s = 5,
        o = 7,
        a = 8,
        c = 9,
        l = 11,
        u = 12,
        d = 13,
        m = 14,
        b = 15,
        I = 17,
        N = 18,
        F = 19,
        x = 20,
        _ = 21,
        w = 22,
        T = 23,
        E = 24,
        ee = 25,
        ne = [
          null,
          "INDEX_SIZE_ERR",
          null,
          "HIERARCHY_REQUEST_ERR",
          "WRONG_DOCUMENT_ERR",
          "INVALID_CHARACTER_ERR",
          null,
          "NO_MODIFICATION_ALLOWED_ERR",
          "NOT_FOUND_ERR",
          "NOT_SUPPORTED_ERR",
          "INUSE_ATTRIBUTE_ERR",
          "INVALID_STATE_ERR",
          "SYNTAX_ERR",
          "INVALID_MODIFICATION_ERR",
          "NAMESPACE_ERR",
          "INVALID_ACCESS_ERR",
          null,
          "TYPE_MISMATCH_ERR",
          "SECURITY_ERR",
          "NETWORK_ERR",
          "ABORT_ERR",
          "URL_MISMATCH_ERR",
          "QUOTA_EXCEEDED_ERR",
          "TIMEOUT_ERR",
          "INVALID_NODE_TYPE_ERR",
          "DATA_CLONE_ERR",
        ],
        me = [
          null,
          "INDEX_SIZE_ERR (1): the index is not in the allowed range",
          null,
          "HIERARCHY_REQUEST_ERR (3): the operation would yield an incorrect nodes model",
          "WRONG_DOCUMENT_ERR (4): the object is in the wrong Document, a call to importNode is required",
          "INVALID_CHARACTER_ERR (5): the string contains invalid characters",
          null,
          "NO_MODIFICATION_ALLOWED_ERR (7): the object can not be modified",
          "NOT_FOUND_ERR (8): the object can not be found here",
          "NOT_SUPPORTED_ERR (9): this operation is not supported",
          "INUSE_ATTRIBUTE_ERR (10): setAttributeNode called on owned Attribute",
          "INVALID_STATE_ERR (11): the object is in an invalid state",
          "SYNTAX_ERR (12): the string did not match the expected pattern",
          "INVALID_MODIFICATION_ERR (13): the object can not be modified in this way",
          "NAMESPACE_ERR (14): the operation is not allowed by Namespaces in XML",
          "INVALID_ACCESS_ERR (15): the object does not support the operation or argument",
          null,
          "TYPE_MISMATCH_ERR (17): the type of the object does not match the expected type",
          "SECURITY_ERR (18): the operation is insecure",
          "NETWORK_ERR (19): a network error occurred",
          "ABORT_ERR (20): the user aborted an operation",
          "URL_MISMATCH_ERR (21): the given URL does not match another URL",
          "QUOTA_EXCEEDED_ERR (22): the quota has been exceeded",
          "TIMEOUT_ERR (23): a timeout occurred",
          "INVALID_NODE_TYPE_ERR (24): the supplied node is invalid or has an invalid ancestor for this operation",
          "DATA_CLONE_ERR (25): the object can not be cloned.",
        ],
        q = {
          INDEX_SIZE_ERR: n,
          DOMSTRING_SIZE_ERR: 2,
          HIERARCHY_REQUEST_ERR: r,
          WRONG_DOCUMENT_ERR: i,
          INVALID_CHARACTER_ERR: s,
          NO_DATA_ALLOWED_ERR: 6,
          NO_MODIFICATION_ALLOWED_ERR: o,
          NOT_FOUND_ERR: a,
          NOT_SUPPORTED_ERR: c,
          INUSE_ATTRIBUTE_ERR: 10,
          INVALID_STATE_ERR: l,
          SYNTAX_ERR: u,
          INVALID_MODIFICATION_ERR: d,
          NAMESPACE_ERR: m,
          INVALID_ACCESS_ERR: b,
          VALIDATION_ERR: 16,
          TYPE_MISMATCH_ERR: I,
          SECURITY_ERR: N,
          NETWORK_ERR: F,
          ABORT_ERR: x,
          URL_MISMATCH_ERR: _,
          QUOTA_EXCEEDED_ERR: w,
          TIMEOUT_ERR: T,
          INVALID_NODE_TYPE_ERR: E,
          DATA_CLONE_ERR: ee,
        };
      function O(v) {
        Error.call(this),
          Error.captureStackTrace(this, this.constructor),
          (this.code = v),
          (this.message = me[v]),
          (this.name = ne[v]);
      }
      O.prototype.__proto__ = Error.prototype;
      for (Y in q)
        (j = { value: q[Y] }),
          Object.defineProperty(O, Y, j),
          Object.defineProperty(O.prototype, Y, j);
      var j, Y;
    },
  }),
  Rh = oe({
    "external/npm/node_modules/domino/lib/config.js"(t) {
      t.isApiWritable = !globalThis.__domino_frozen__;
    },
  }),
  Xe = oe({
    "external/npm/node_modules/domino/lib/utils.js"(t) {
      "use strict";
      var e = xh(),
        n = e,
        r = Rh().isApiWritable;
      (t.NAMESPACE = {
        HTML: "http://www.w3.org/1999/xhtml",
        XML: "http://www.w3.org/XML/1998/namespace",
        XMLNS: "http://www.w3.org/2000/xmlns/",
        MATHML: "http://www.w3.org/1998/Math/MathML",
        SVG: "http://www.w3.org/2000/svg",
        XLINK: "http://www.w3.org/1999/xlink",
      }),
        (t.IndexSizeError = function () {
          throw new e(n.INDEX_SIZE_ERR);
        }),
        (t.HierarchyRequestError = function () {
          throw new e(n.HIERARCHY_REQUEST_ERR);
        }),
        (t.WrongDocumentError = function () {
          throw new e(n.WRONG_DOCUMENT_ERR);
        }),
        (t.InvalidCharacterError = function () {
          throw new e(n.INVALID_CHARACTER_ERR);
        }),
        (t.NoModificationAllowedError = function () {
          throw new e(n.NO_MODIFICATION_ALLOWED_ERR);
        }),
        (t.NotFoundError = function () {
          throw new e(n.NOT_FOUND_ERR);
        }),
        (t.NotSupportedError = function () {
          throw new e(n.NOT_SUPPORTED_ERR);
        }),
        (t.InvalidStateError = function () {
          throw new e(n.INVALID_STATE_ERR);
        }),
        (t.SyntaxError = function () {
          throw new e(n.SYNTAX_ERR);
        }),
        (t.InvalidModificationError = function () {
          throw new e(n.INVALID_MODIFICATION_ERR);
        }),
        (t.NamespaceError = function () {
          throw new e(n.NAMESPACE_ERR);
        }),
        (t.InvalidAccessError = function () {
          throw new e(n.INVALID_ACCESS_ERR);
        }),
        (t.TypeMismatchError = function () {
          throw new e(n.TYPE_MISMATCH_ERR);
        }),
        (t.SecurityError = function () {
          throw new e(n.SECURITY_ERR);
        }),
        (t.NetworkError = function () {
          throw new e(n.NETWORK_ERR);
        }),
        (t.AbortError = function () {
          throw new e(n.ABORT_ERR);
        }),
        (t.UrlMismatchError = function () {
          throw new e(n.URL_MISMATCH_ERR);
        }),
        (t.QuotaExceededError = function () {
          throw new e(n.QUOTA_EXCEEDED_ERR);
        }),
        (t.TimeoutError = function () {
          throw new e(n.TIMEOUT_ERR);
        }),
        (t.InvalidNodeTypeError = function () {
          throw new e(n.INVALID_NODE_TYPE_ERR);
        }),
        (t.DataCloneError = function () {
          throw new e(n.DATA_CLONE_ERR);
        }),
        (t.nyi = function () {
          throw new Error("NotYetImplemented");
        }),
        (t.shouldOverride = function () {
          throw new Error(
            "Abstract function; should be overriding in subclass."
          );
        }),
        (t.assert = function (i, s) {
          if (!i)
            throw new Error(
              "Assertion failed: " +
                (s || "") +
                `
` +
                new Error().stack
            );
        }),
        (t.expose = function (i, s) {
          for (var o in i)
            Object.defineProperty(s.prototype, o, { value: i[o], writable: r });
        }),
        (t.merge = function (i, s) {
          for (var o in s) i[o] = s[o];
        }),
        (t.documentOrder = function (i, s) {
          return 3 - (i.compareDocumentPosition(s) & 6);
        }),
        (t.toASCIILowerCase = function (i) {
          return i.replace(/[A-Z]+/g, function (s) {
            return s.toLowerCase();
          });
        }),
        (t.toASCIIUpperCase = function (i) {
          return i.replace(/[a-z]+/g, function (s) {
            return s.toUpperCase();
          });
        });
    },
  }),
  vb = oe({
    "external/npm/node_modules/domino/lib/EventTarget.js"(t, e) {
      "use strict";
      var n = yo(),
        r = yb(),
        i = Xe();
      e.exports = s;
      function s() {}
      s.prototype = {
        addEventListener: function (a, c, l) {
          if (c) {
            l === void 0 && (l = !1),
              this._listeners || (this._listeners = Object.create(null)),
              this._listeners[a] || (this._listeners[a] = []);
            for (var u = this._listeners[a], d = 0, m = u.length; d < m; d++) {
              var b = u[d];
              if (b.listener === c && b.capture === l) return;
            }
            var I = { listener: c, capture: l };
            typeof c == "function" && (I.f = c), u.push(I);
          }
        },
        removeEventListener: function (a, c, l) {
          if ((l === void 0 && (l = !1), this._listeners)) {
            var u = this._listeners[a];
            if (u)
              for (var d = 0, m = u.length; d < m; d++) {
                var b = u[d];
                if (b.listener === c && b.capture === l) {
                  u.length === 1
                    ? (this._listeners[a] = void 0)
                    : u.splice(d, 1);
                  return;
                }
              }
          }
        },
        dispatchEvent: function (a) {
          return this._dispatchEvent(a, !1);
        },
        _dispatchEvent: function (a, c) {
          typeof c != "boolean" && (c = !1);
          function l(N, F) {
            var x = F.type,
              _ = F.eventPhase;
            if (
              ((F.currentTarget = N),
              _ !== n.CAPTURING_PHASE && N._handlers && N._handlers[x])
            ) {
              var w = N._handlers[x],
                T;
              if (typeof w == "function") T = w.call(F.currentTarget, F);
              else {
                var E = w.handleEvent;
                if (typeof E != "function")
                  throw new TypeError(
                    "handleEvent property of event handler object isnot a function."
                  );
                T = E.call(w, F);
              }
              switch (F.type) {
                case "mouseover":
                  T === !0 && F.preventDefault();
                  break;
                case "beforeunload":
                default:
                  T === !1 && F.preventDefault();
                  break;
              }
            }
            var ee = N._listeners && N._listeners[x];
            if (ee) {
              ee = ee.slice();
              for (var ne = 0, me = ee.length; ne < me; ne++) {
                if (F._immediatePropagationStopped) return;
                var q = ee[ne];
                if (
                  !(
                    (_ === n.CAPTURING_PHASE && !q.capture) ||
                    (_ === n.BUBBLING_PHASE && q.capture)
                  )
                )
                  if (q.f) q.f.call(F.currentTarget, F);
                  else {
                    var O = q.listener.handleEvent;
                    if (typeof O != "function")
                      throw new TypeError(
                        "handleEvent property of event listener object is not a function."
                      );
                    O.call(q.listener, F);
                  }
              }
            }
          }
          (!a._initialized || a._dispatching) && i.InvalidStateError(),
            (a.isTrusted = c),
            (a._dispatching = !0),
            (a.target = this);
          for (var u = [], d = this.parentNode; d; d = d.parentNode) u.push(d);
          a.eventPhase = n.CAPTURING_PHASE;
          for (
            var m = u.length - 1;
            m >= 0 && (l(u[m], a), !a._propagationStopped);
            m--
          );
          if (
            (a._propagationStopped ||
              ((a.eventPhase = n.AT_TARGET), l(this, a)),
            a.bubbles && !a._propagationStopped)
          ) {
            a.eventPhase = n.BUBBLING_PHASE;
            for (
              var b = 0, I = u.length;
              b < I && (l(u[b], a), !a._propagationStopped);
              b++
            );
          }
          if (
            ((a._dispatching = !1),
            (a.eventPhase = n.AT_TARGET),
            (a.currentTarget = null),
            c && !a.defaultPrevented && a instanceof r)
          )
            switch (a.type) {
              case "mousedown":
                this._armed = { x: a.clientX, y: a.clientY, t: a.timeStamp };
                break;
              case "mouseout":
              case "mouseover":
                this._armed = null;
                break;
              case "mouseup":
                this._isClick(a) && this._doClick(a), (this._armed = null);
                break;
            }
          return !a.defaultPrevented;
        },
        _isClick: function (o) {
          return (
            this._armed !== null &&
            o.type === "mouseup" &&
            o.isTrusted &&
            o.button === 0 &&
            o.timeStamp - this._armed.t < 1e3 &&
            Math.abs(o.clientX - this._armed.x) < 10 &&
            Math.abs(o.clientY - this._armed.Y) < 10
          );
        },
        _doClick: function (o) {
          if (!this._click_in_progress) {
            this._click_in_progress = !0;
            for (var a = this; a && !a._post_click_activation_steps; )
              a = a.parentNode;
            a &&
              a._pre_click_activation_steps &&
              a._pre_click_activation_steps();
            var c = this.ownerDocument.createEvent("MouseEvent");
            c.initMouseEvent(
              "click",
              !0,
              !0,
              this.ownerDocument.defaultView,
              1,
              o.screenX,
              o.screenY,
              o.clientX,
              o.clientY,
              o.ctrlKey,
              o.altKey,
              o.shiftKey,
              o.metaKey,
              o.button,
              null
            );
            var l = this._dispatchEvent(c, !0);
            a &&
              (l
                ? a._post_click_activation_steps &&
                  a._post_click_activation_steps(c)
                : a._cancelled_activation_steps &&
                  a._cancelled_activation_steps());
          }
        },
        _setEventHandler: function (a, c) {
          this._handlers || (this._handlers = Object.create(null)),
            (this._handlers[a] = c);
        },
        _getEventHandler: function (a) {
          return (this._handlers && this._handlers[a]) || null;
        },
      };
    },
  }),
  Eb = oe({
    "external/npm/node_modules/domino/lib/LinkedList.js"(t, e) {
      "use strict";
      var n = Xe(),
        r = (e.exports = {
          valid: function (i) {
            return (
              n.assert(i, "list falsy"),
              n.assert(i._previousSibling, "previous falsy"),
              n.assert(i._nextSibling, "next falsy"),
              !0
            );
          },
          insertBefore: function (i, s) {
            n.assert(r.valid(i) && r.valid(s));
            var o = i,
              a = i._previousSibling,
              c = s,
              l = s._previousSibling;
            (o._previousSibling = l),
              (a._nextSibling = c),
              (l._nextSibling = o),
              (c._previousSibling = a),
              n.assert(r.valid(i) && r.valid(s));
          },
          replace: function (i, s) {
            n.assert(r.valid(i) && (s === null || r.valid(s))),
              s !== null && r.insertBefore(s, i),
              r.remove(i),
              n.assert(r.valid(i) && (s === null || r.valid(s)));
          },
          remove: function (i) {
            n.assert(r.valid(i));
            var s = i._previousSibling;
            if (s !== i) {
              var o = i._nextSibling;
              (s._nextSibling = o),
                (o._previousSibling = s),
                (i._previousSibling = i._nextSibling = i),
                n.assert(r.valid(i));
            }
          },
        });
    },
  }),
  bb = oe({
    "external/npm/node_modules/domino/lib/NodeUtils.js"(t, e) {
      "use strict";
      e.exports = {
        serializeOne: F,
        ɵescapeMatchingClosingTag: m,
        ɵescapeClosingCommentTag: I,
        ɵescapeProcessingInstructionContent: N,
      };
      var n = Xe(),
        r = n.NAMESPACE,
        i = {
          STYLE: !0,
          SCRIPT: !0,
          XMP: !0,
          IFRAME: !0,
          NOEMBED: !0,
          NOFRAMES: !0,
          PLAINTEXT: !0,
        },
        s = {
          area: !0,
          base: !0,
          basefont: !0,
          bgsound: !0,
          br: !0,
          col: !0,
          embed: !0,
          frame: !0,
          hr: !0,
          img: !0,
          input: !0,
          keygen: !0,
          link: !0,
          meta: !0,
          param: !0,
          source: !0,
          track: !0,
          wbr: !0,
        },
        o = {},
        a = /[&<>\u00A0]/g,
        c = /[&"<>\u00A0]/g;
      function l(x) {
        return a.test(x)
          ? x.replace(a, (_) => {
              switch (_) {
                case "&":
                  return "&amp;";
                case "<":
                  return "&lt;";
                case ">":
                  return "&gt;";
                case "\xA0":
                  return "&nbsp;";
              }
            })
          : x;
      }
      function u(x) {
        return c.test(x)
          ? x.replace(c, (_) => {
              switch (_) {
                case "<":
                  return "&lt;";
                case ">":
                  return "&gt;";
                case "&":
                  return "&amp;";
                case '"':
                  return "&quot;";
                case "\xA0":
                  return "&nbsp;";
              }
            })
          : x;
      }
      function d(x) {
        var _ = x.namespaceURI;
        return _
          ? _ === r.XML
            ? "xml:" + x.localName
            : _ === r.XLINK
            ? "xlink:" + x.localName
            : _ === r.XMLNS
            ? x.localName === "xmlns"
              ? "xmlns"
              : "xmlns:" + x.localName
            : x.name
          : x.localName;
      }
      function m(x, _) {
        let w = "</" + _;
        if (!x.toLowerCase().includes(w)) return x;
        let T = [...x],
          E = x.matchAll(new RegExp(w, "ig"));
        for (let ee of E) T[ee.index] = "&lt;";
        return T.join("");
      }
      var b = /--!?>/;
      function I(x) {
        return b.test(x) ? x.replace(/(--\!?)>/g, "$1&gt;") : x;
      }
      function N(x) {
        return x.includes(">") ? x.replaceAll(">", "&gt;") : x;
      }
      function F(x, _) {
        var w = "";
        switch (x.nodeType) {
          case 1:
            var T = x.namespaceURI,
              E = T === r.HTML,
              ee = E || T === r.SVG || T === r.MATHML ? x.localName : x.tagName;
            w += "<" + ee;
            for (var ne = 0, me = x._numattrs; ne < me; ne++) {
              var q = x._attr(ne);
              (w += " " + d(q)),
                q.value !== void 0 && (w += '="' + u(q.value) + '"');
            }
            if (((w += ">"), !(E && s[ee]))) {
              var O = x.serialize();
              i[ee.toUpperCase()] && (O = m(O, ee)),
                E &&
                  o[ee] &&
                  O.charAt(0) ===
                    `
` &&
                  (w += `
`),
                (w += O),
                (w += "</" + ee + ">");
            }
            break;
          case 3:
          case 4:
            var j;
            _.nodeType === 1 && _.namespaceURI === r.HTML
              ? (j = _.tagName)
              : (j = ""),
              i[j] || (j === "NOSCRIPT" && _.ownerDocument._scripting_enabled)
                ? (w += x.data)
                : (w += l(x.data));
            break;
          case 8:
            w += "<!--" + I(x.data) + "-->";
            break;
          case 7:
            let Y = N(x.data);
            w += "<?" + x.target + " " + Y + "?>";
            break;
          case 10:
            (w += "<!DOCTYPE " + x.name), (w += ">");
            break;
          default:
            n.InvalidStateError();
        }
        return w;
      }
    },
  }),
  ft = oe({
    "external/npm/node_modules/domino/lib/Node.js"(t, e) {
      "use strict";
      e.exports = o;
      var n = vb(),
        r = Eb(),
        i = bb(),
        s = Xe();
      function o() {
        n.call(this),
          (this.parentNode = null),
          (this._nextSibling = this._previousSibling = this),
          (this._index = void 0);
      }
      var a = (o.ELEMENT_NODE = 1),
        c = (o.ATTRIBUTE_NODE = 2),
        l = (o.TEXT_NODE = 3),
        u = (o.CDATA_SECTION_NODE = 4),
        d = (o.ENTITY_REFERENCE_NODE = 5),
        m = (o.ENTITY_NODE = 6),
        b = (o.PROCESSING_INSTRUCTION_NODE = 7),
        I = (o.COMMENT_NODE = 8),
        N = (o.DOCUMENT_NODE = 9),
        F = (o.DOCUMENT_TYPE_NODE = 10),
        x = (o.DOCUMENT_FRAGMENT_NODE = 11),
        _ = (o.NOTATION_NODE = 12),
        w = (o.DOCUMENT_POSITION_DISCONNECTED = 1),
        T = (o.DOCUMENT_POSITION_PRECEDING = 2),
        E = (o.DOCUMENT_POSITION_FOLLOWING = 4),
        ee = (o.DOCUMENT_POSITION_CONTAINS = 8),
        ne = (o.DOCUMENT_POSITION_CONTAINED_BY = 16),
        me = (o.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32);
      o.prototype = Object.create(n.prototype, {
        baseURI: { get: s.nyi },
        parentElement: {
          get: function () {
            return this.parentNode && this.parentNode.nodeType === a
              ? this.parentNode
              : null;
          },
        },
        hasChildNodes: { value: s.shouldOverride },
        firstChild: { get: s.shouldOverride },
        lastChild: { get: s.shouldOverride },
        isConnected: {
          get: function () {
            let q = this;
            for (; q != null; ) {
              if (q.nodeType === o.DOCUMENT_NODE) return !0;
              (q = q.parentNode),
                q != null &&
                  q.nodeType === o.DOCUMENT_FRAGMENT_NODE &&
                  (q = q.host);
            }
            return !1;
          },
        },
        previousSibling: {
          get: function () {
            var q = this.parentNode;
            return !q || this === q.firstChild ? null : this._previousSibling;
          },
        },
        nextSibling: {
          get: function () {
            var q = this.parentNode,
              O = this._nextSibling;
            return !q || O === q.firstChild ? null : O;
          },
        },
        textContent: {
          get: function () {
            return null;
          },
          set: function (q) {},
        },
        innerText: {
          get: function () {
            return null;
          },
          set: function (q) {},
        },
        _countChildrenOfType: {
          value: function (q) {
            for (var O = 0, j = this.firstChild; j !== null; j = j.nextSibling)
              j.nodeType === q && O++;
            return O;
          },
        },
        _ensureInsertValid: {
          value: function (O, j, Y) {
            var v = this,
              g,
              p;
            if (!O.nodeType) throw new TypeError("not a node");
            switch (v.nodeType) {
              case N:
              case x:
              case a:
                break;
              default:
                s.HierarchyRequestError();
            }
            switch (
              (O.isAncestor(v) && s.HierarchyRequestError(),
              (j !== null || !Y) && j.parentNode !== v && s.NotFoundError(),
              O.nodeType)
            ) {
              case x:
              case F:
              case a:
              case l:
              case b:
              case I:
                break;
              default:
                s.HierarchyRequestError();
            }
            if (v.nodeType === N)
              switch (O.nodeType) {
                case l:
                  s.HierarchyRequestError();
                  break;
                case x:
                  switch (
                    (O._countChildrenOfType(l) > 0 && s.HierarchyRequestError(),
                    O._countChildrenOfType(a))
                  ) {
                    case 0:
                      break;
                    case 1:
                      if (j !== null)
                        for (
                          Y && j.nodeType === F && s.HierarchyRequestError(),
                            p = j.nextSibling;
                          p !== null;
                          p = p.nextSibling
                        )
                          p.nodeType === F && s.HierarchyRequestError();
                      (g = v._countChildrenOfType(a)),
                        Y
                          ? g > 0 && s.HierarchyRequestError()
                          : (g > 1 || (g === 1 && j.nodeType !== a)) &&
                            s.HierarchyRequestError();
                      break;
                    default:
                      s.HierarchyRequestError();
                  }
                  break;
                case a:
                  if (j !== null)
                    for (
                      Y && j.nodeType === F && s.HierarchyRequestError(),
                        p = j.nextSibling;
                      p !== null;
                      p = p.nextSibling
                    )
                      p.nodeType === F && s.HierarchyRequestError();
                  (g = v._countChildrenOfType(a)),
                    Y
                      ? g > 0 && s.HierarchyRequestError()
                      : (g > 1 || (g === 1 && j.nodeType !== a)) &&
                        s.HierarchyRequestError();
                  break;
                case F:
                  if (j === null)
                    v._countChildrenOfType(a) && s.HierarchyRequestError();
                  else
                    for (
                      p = v.firstChild;
                      p !== null && p !== j;
                      p = p.nextSibling
                    )
                      p.nodeType === a && s.HierarchyRequestError();
                  (g = v._countChildrenOfType(F)),
                    Y
                      ? g > 0 && s.HierarchyRequestError()
                      : (g > 1 || (g === 1 && j.nodeType !== F)) &&
                        s.HierarchyRequestError();
                  break;
              }
            else O.nodeType === F && s.HierarchyRequestError();
          },
        },
        insertBefore: {
          value: function (O, j) {
            var Y = this;
            Y._ensureInsertValid(O, j, !0);
            var v = j;
            return (
              v === O && (v = O.nextSibling),
              Y.doc.adoptNode(O),
              O._insertOrReplace(Y, v, !1),
              O
            );
          },
        },
        appendChild: {
          value: function (q) {
            return this.insertBefore(q, null);
          },
        },
        _appendChild: {
          value: function (q) {
            q._insertOrReplace(this, null, !1);
          },
        },
        removeChild: {
          value: function (O) {
            var j = this;
            if (!O.nodeType) throw new TypeError("not a node");
            return O.parentNode !== j && s.NotFoundError(), O.remove(), O;
          },
        },
        replaceChild: {
          value: function (O, j) {
            var Y = this;
            return (
              Y._ensureInsertValid(O, j, !1),
              O.doc !== Y.doc && Y.doc.adoptNode(O),
              O._insertOrReplace(Y, j, !0),
              j
            );
          },
        },
        contains: {
          value: function (O) {
            return O === null
              ? !1
              : this === O
              ? !0
              : (this.compareDocumentPosition(O) & ne) !== 0;
          },
        },
        compareDocumentPosition: {
          value: function (O) {
            if (this === O) return 0;
            if (this.doc !== O.doc || this.rooted !== O.rooted) return w + me;
            for (var j = [], Y = [], v = this; v !== null; v = v.parentNode)
              j.push(v);
            for (v = O; v !== null; v = v.parentNode) Y.push(v);
            if ((j.reverse(), Y.reverse(), j[0] !== Y[0])) return w + me;
            v = Math.min(j.length, Y.length);
            for (var g = 1; g < v; g++)
              if (j[g] !== Y[g]) return j[g].index < Y[g].index ? E : T;
            return j.length < Y.length ? E + ne : T + ee;
          },
        },
        isSameNode: {
          value: function (O) {
            return this === O;
          },
        },
        isEqualNode: {
          value: function (O) {
            if (!O || O.nodeType !== this.nodeType || !this.isEqual(O))
              return !1;
            for (
              var j = this.firstChild, Y = O.firstChild;
              j && Y;
              j = j.nextSibling, Y = Y.nextSibling
            )
              if (!j.isEqualNode(Y)) return !1;
            return j === null && Y === null;
          },
        },
        cloneNode: {
          value: function (q) {
            var O = this.clone();
            if (q)
              for (var j = this.firstChild; j !== null; j = j.nextSibling)
                O._appendChild(j.cloneNode(!0));
            return O;
          },
        },
        lookupPrefix: {
          value: function (O) {
            var j;
            if (O === "" || O === null || O === void 0) return null;
            switch (this.nodeType) {
              case a:
                return this._lookupNamespacePrefix(O, this);
              case N:
                return (j = this.documentElement), j ? j.lookupPrefix(O) : null;
              case m:
              case _:
              case x:
              case F:
                return null;
              case c:
                return (j = this.ownerElement), j ? j.lookupPrefix(O) : null;
              default:
                return (j = this.parentElement), j ? j.lookupPrefix(O) : null;
            }
          },
        },
        lookupNamespaceURI: {
          value: function (O) {
            (O === "" || O === void 0) && (O = null);
            var j;
            switch (this.nodeType) {
              case a:
                return s.shouldOverride();
              case N:
                return (
                  (j = this.documentElement), j ? j.lookupNamespaceURI(O) : null
                );
              case m:
              case _:
              case F:
              case x:
                return null;
              case c:
                return (
                  (j = this.ownerElement), j ? j.lookupNamespaceURI(O) : null
                );
              default:
                return (
                  (j = this.parentElement), j ? j.lookupNamespaceURI(O) : null
                );
            }
          },
        },
        isDefaultNamespace: {
          value: function (O) {
            (O === "" || O === void 0) && (O = null);
            var j = this.lookupNamespaceURI(null);
            return j === O;
          },
        },
        index: {
          get: function () {
            var q = this.parentNode;
            if (this === q.firstChild) return 0;
            var O = q.childNodes;
            if (this._index === void 0 || O[this._index] !== this) {
              for (var j = 0; j < O.length; j++) O[j]._index = j;
              s.assert(O[this._index] === this);
            }
            return this._index;
          },
        },
        isAncestor: {
          value: function (q) {
            if (this.doc !== q.doc || this.rooted !== q.rooted) return !1;
            for (var O = q; O; O = O.parentNode) if (O === this) return !0;
            return !1;
          },
        },
        ensureSameDoc: {
          value: function (q) {
            q.ownerDocument === null
              ? (q.ownerDocument = this.doc)
              : q.ownerDocument !== this.doc && s.WrongDocumentError();
          },
        },
        removeChildren: { value: s.shouldOverride },
        _insertOrReplace: {
          value: function (O, j, Y) {
            var v = this,
              g,
              p;
            if (
              (v.nodeType === x && v.rooted && s.HierarchyRequestError(),
              O._childNodes &&
                ((g = j === null ? O._childNodes.length : j.index),
                v.parentNode === O))
            ) {
              var y = v.index;
              y < g && g--;
            }
            Y && (j.rooted && j.doc.mutateRemove(j), (j.parentNode = null));
            var C = j;
            C === null && (C = O.firstChild);
            var R = v.rooted && O.rooted;
            if (v.nodeType === x) {
              for (
                var V = [0, Y ? 1 : 0], Q, he = v.firstChild;
                he !== null;
                he = Q
              )
                (Q = he.nextSibling), V.push(he), (he.parentNode = O);
              var S = V.length;
              if (
                (Y
                  ? r.replace(C, S > 2 ? V[2] : null)
                  : S > 2 && C !== null && r.insertBefore(V[2], C),
                O._childNodes)
              )
                for (
                  V[0] = j === null ? O._childNodes.length : j._index,
                    O._childNodes.splice.apply(O._childNodes, V),
                    p = 2;
                  p < S;
                  p++
                )
                  V[p]._index = V[0] + (p - 2);
              else
                O._firstChild === j &&
                  (S > 2
                    ? (O._firstChild = V[2])
                    : Y && (O._firstChild = null));
              if (
                (v._childNodes
                  ? (v._childNodes.length = 0)
                  : (v._firstChild = null),
                O.rooted)
              )
                for (O.modify(), p = 2; p < S; p++) O.doc.mutateInsert(V[p]);
            } else {
              if (j === v) return;
              R ? v._remove() : v.parentNode && v.remove(),
                (v.parentNode = O),
                Y
                  ? (r.replace(C, v),
                    O._childNodes
                      ? ((v._index = g), (O._childNodes[g] = v))
                      : O._firstChild === j && (O._firstChild = v))
                  : (C !== null && r.insertBefore(v, C),
                    O._childNodes
                      ? ((v._index = g), O._childNodes.splice(g, 0, v))
                      : O._firstChild === j && (O._firstChild = v)),
                R
                  ? (O.modify(), O.doc.mutateMove(v))
                  : O.rooted && (O.modify(), O.doc.mutateInsert(v));
            }
          },
        },
        lastModTime: {
          get: function () {
            return (
              this._lastModTime || (this._lastModTime = this.doc.modclock),
              this._lastModTime
            );
          },
        },
        modify: {
          value: function () {
            if (this.doc.modclock)
              for (
                var q = ++this.doc.modclock, O = this;
                O;
                O = O.parentElement
              )
                O._lastModTime && (O._lastModTime = q);
          },
        },
        doc: {
          get: function () {
            return this.ownerDocument || this;
          },
        },
        rooted: {
          get: function () {
            return !!this._nid;
          },
        },
        normalize: {
          value: function () {
            for (var q, O = this.firstChild; O !== null; O = q)
              if (
                ((q = O.nextSibling),
                O.normalize && O.normalize(),
                O.nodeType === o.TEXT_NODE)
              ) {
                if (O.nodeValue === "") {
                  this.removeChild(O);
                  continue;
                }
                var j = O.previousSibling;
                j !== null &&
                  j.nodeType === o.TEXT_NODE &&
                  (j.appendData(O.nodeValue), this.removeChild(O));
              }
          },
        },
        serialize: {
          value: function () {
            if (this._innerHTML) return this._innerHTML;
            for (var q = "", O = this.firstChild; O !== null; O = O.nextSibling)
              q += i.serializeOne(O, this);
            return q;
          },
        },
        outerHTML: {
          get: function () {
            return i.serializeOne(this, { nodeType: 0 });
          },
          set: s.nyi,
        },
        ELEMENT_NODE: { value: a },
        ATTRIBUTE_NODE: { value: c },
        TEXT_NODE: { value: l },
        CDATA_SECTION_NODE: { value: u },
        ENTITY_REFERENCE_NODE: { value: d },
        ENTITY_NODE: { value: m },
        PROCESSING_INSTRUCTION_NODE: { value: b },
        COMMENT_NODE: { value: I },
        DOCUMENT_NODE: { value: N },
        DOCUMENT_TYPE_NODE: { value: F },
        DOCUMENT_FRAGMENT_NODE: { value: x },
        NOTATION_NODE: { value: _ },
        DOCUMENT_POSITION_DISCONNECTED: { value: w },
        DOCUMENT_POSITION_PRECEDING: { value: T },
        DOCUMENT_POSITION_FOLLOWING: { value: E },
        DOCUMENT_POSITION_CONTAINS: { value: ee },
        DOCUMENT_POSITION_CONTAINED_BY: { value: ne },
        DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: { value: me },
      });
    },
  }),
  IN = oe({
    "external/npm/node_modules/domino/lib/NodeList.es6.js"(t, e) {
      "use strict";
      e.exports = class extends Array {
        constructor(r) {
          if ((super((r && r.length) || 0), r)) for (var i in r) this[i] = r[i];
        }
        item(r) {
          return this[r] || null;
        }
      };
    },
  }),
  MN = oe({
    "external/npm/node_modules/domino/lib/NodeList.es5.js"(t, e) {
      "use strict";
      function n(i) {
        return this[i] || null;
      }
      function r(i) {
        return i || (i = []), (i.item = n), i;
      }
      e.exports = r;
    },
  }),
  Qi = oe({
    "external/npm/node_modules/domino/lib/NodeList.js"(t, e) {
      "use strict";
      var n;
      try {
        n = IN();
      } catch {
        n = MN();
      }
      e.exports = n;
    },
  }),
  Oh = oe({
    "external/npm/node_modules/domino/lib/ContainerNode.js"(t, e) {
      "use strict";
      e.exports = i;
      var n = ft(),
        r = Qi();
      function i() {
        n.call(this), (this._firstChild = this._childNodes = null);
      }
      i.prototype = Object.create(n.prototype, {
        hasChildNodes: {
          value: function () {
            return this._childNodes
              ? this._childNodes.length > 0
              : this._firstChild !== null;
          },
        },
        childNodes: {
          get: function () {
            return this._ensureChildNodes(), this._childNodes;
          },
        },
        firstChild: {
          get: function () {
            return this._childNodes
              ? this._childNodes.length === 0
                ? null
                : this._childNodes[0]
              : this._firstChild;
          },
        },
        lastChild: {
          get: function () {
            var s = this._childNodes,
              o;
            return s
              ? s.length === 0
                ? null
                : s[s.length - 1]
              : ((o = this._firstChild),
                o === null ? null : o._previousSibling);
          },
        },
        _ensureChildNodes: {
          value: function () {
            if (!this._childNodes) {
              var s = this._firstChild,
                o = s,
                a = (this._childNodes = new r());
              if (s)
                do a.push(o), (o = o._nextSibling);
                while (o !== s);
              this._firstChild = null;
            }
          },
        },
        removeChildren: {
          value: function () {
            for (
              var o = this.rooted ? this.ownerDocument : null,
                a = this.firstChild,
                c;
              a !== null;

            )
              (c = a),
                (a = c.nextSibling),
                o && o.mutateRemove(c),
                (c.parentNode = null);
            this._childNodes
              ? (this._childNodes.length = 0)
              : (this._firstChild = null),
              this.modify();
          },
        },
      });
    },
  }),
  kh = oe({
    "external/npm/node_modules/domino/lib/xmlnames.js"(t) {
      "use strict";
      (t.isValidName = N), (t.isValidQName = F);
      var e = /^[_:A-Za-z][-.:\w]+$/,
        n = /^([_A-Za-z][-.\w]+|[_A-Za-z][-.\w]+:[_A-Za-z][-.\w]+)$/,
        r =
          "_A-Za-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD",
        i =
          "-._A-Za-z0-9\xB7\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0300-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD",
        s = "[" + r + "][" + i + "]*",
        o = r + ":",
        a = i + ":",
        c = new RegExp("^[" + o + "][" + a + "]*$"),
        l = new RegExp("^(" + s + "|" + s + ":" + s + ")$"),
        u = /[\uD800-\uDB7F\uDC00-\uDFFF]/,
        d = /[\uD800-\uDB7F\uDC00-\uDFFF]/g,
        m = /[\uD800-\uDB7F][\uDC00-\uDFFF]/g;
      (r += "\uD800-\u{EFC00}-\uDFFF"),
        (i += "\uD800-\u{EFC00}-\uDFFF"),
        (s = "[" + r + "][" + i + "]*"),
        (o = r + ":"),
        (a = i + ":");
      var b = new RegExp("^[" + o + "][" + a + "]*$"),
        I = new RegExp("^(" + s + "|" + s + ":" + s + ")$");
      function N(x) {
        if (e.test(x) || c.test(x)) return !0;
        if (!u.test(x) || !b.test(x)) return !1;
        var _ = x.match(d),
          w = x.match(m);
        return w !== null && 2 * w.length === _.length;
      }
      function F(x) {
        if (n.test(x) || l.test(x)) return !0;
        if (!u.test(x) || !I.test(x)) return !1;
        var _ = x.match(d),
          w = x.match(m);
        return w !== null && 2 * w.length === _.length;
      }
    },
  }),
  wb = oe({
    "external/npm/node_modules/domino/lib/attributes.js"(t) {
      "use strict";
      var e = Xe();
      t.property = function (r) {
        if (Array.isArray(r.type)) {
          var i = Object.create(null);
          r.type.forEach(function (a) {
            i[a.value || a] = a.alias || a;
          });
          var s = r.missing;
          s === void 0 && (s = null);
          var o = r.invalid;
          return (
            o === void 0 && (o = s),
            {
              get: function () {
                var a = this._getattr(r.name);
                return a === null
                  ? s
                  : ((a = i[a.toLowerCase()]),
                    a !== void 0 ? a : o !== null ? o : a);
              },
              set: function (a) {
                this._setattr(r.name, a);
              },
            }
          );
        } else {
          if (r.type === Boolean)
            return {
              get: function () {
                return this.hasAttribute(r.name);
              },
              set: function (a) {
                a ? this._setattr(r.name, "") : this.removeAttribute(r.name);
              },
            };
          if (
            r.type === Number ||
            r.type === "long" ||
            r.type === "unsigned long" ||
            r.type === "limited unsigned long with fallback"
          )
            return n(r);
          if (!r.type || r.type === String)
            return {
              get: function () {
                return this._getattr(r.name) || "";
              },
              set: function (a) {
                r.treatNullAsEmptyString && a === null && (a = ""),
                  this._setattr(r.name, a);
              },
            };
          if (typeof r.type == "function") return r.type(r.name, r);
        }
        throw new Error("Invalid attribute definition");
      };
      function n(r) {
        var i;
        typeof r.default == "function"
          ? (i = r.default)
          : typeof r.default == "number"
          ? (i = function () {
              return r.default;
            })
          : (i = function () {
              e.assert(!1, typeof r.default);
            });
        var s = r.type === "unsigned long",
          o = r.type === "long",
          a = r.type === "limited unsigned long with fallback",
          c = r.min,
          l = r.max,
          u = r.setmin;
        return (
          c === void 0 && (s && (c = 0), o && (c = -2147483648), a && (c = 1)),
          l === void 0 && (s || o || a) && (l = 2147483647),
          {
            get: function () {
              var d = this._getattr(r.name),
                m = r.float ? parseFloat(d) : parseInt(d, 10);
              if (
                d === null ||
                !isFinite(m) ||
                (c !== void 0 && m < c) ||
                (l !== void 0 && m > l)
              )
                return i.call(this);
              if (s || o || a) {
                if (!/^[ \t\n\f\r]*[-+]?[0-9]/.test(d)) return i.call(this);
                m = m | 0;
              }
              return m;
            },
            set: function (d) {
              r.float || (d = Math.floor(d)),
                u !== void 0 &&
                  d < u &&
                  e.IndexSizeError(r.name + " set to " + d),
                s
                  ? (d = d < 0 || d > 2147483647 ? i.call(this) : d | 0)
                  : a
                  ? (d = d < 1 || d > 2147483647 ? i.call(this) : d | 0)
                  : o &&
                    (d =
                      d < -2147483648 || d > 2147483647 ? i.call(this) : d | 0),
                this._setattr(r.name, String(d));
            },
          }
        );
      }
      t.registerChangeHandler = function (r, i, s) {
        var o = r.prototype;
        Object.prototype.hasOwnProperty.call(o, "_attributeChangeHandlers") ||
          (o._attributeChangeHandlers = Object.create(
            o._attributeChangeHandlers || null
          )),
          (o._attributeChangeHandlers[i] = s);
      };
    },
  }),
  NN = oe({
    "external/npm/node_modules/domino/lib/FilteredElementList.js"(t, e) {
      "use strict";
      e.exports = r;
      var n = ft();
      function r(i, s) {
        (this.root = i),
          (this.filter = s),
          (this.lastModTime = i.lastModTime),
          (this.done = !1),
          (this.cache = []),
          this.traverse();
      }
      r.prototype = Object.create(Object.prototype, {
        length: {
          get: function () {
            return (
              this.checkcache(), this.done || this.traverse(), this.cache.length
            );
          },
        },
        item: {
          value: function (i) {
            return (
              this.checkcache(),
              !this.done && i >= this.cache.length && this.traverse(),
              this.cache[i]
            );
          },
        },
        checkcache: {
          value: function () {
            if (this.lastModTime !== this.root.lastModTime) {
              for (var i = this.cache.length - 1; i >= 0; i--) this[i] = void 0;
              (this.cache.length = 0),
                (this.done = !1),
                (this.lastModTime = this.root.lastModTime);
            }
          },
        },
        traverse: {
          value: function (i) {
            i !== void 0 && i++;
            for (var s; (s = this.next()) !== null; )
              if (
                ((this[this.cache.length] = s),
                this.cache.push(s),
                i && this.cache.length === i)
              )
                return;
            this.done = !0;
          },
        },
        next: {
          value: function () {
            var i =
                this.cache.length === 0
                  ? this.root
                  : this.cache[this.cache.length - 1],
              s;
            for (
              i.nodeType === n.DOCUMENT_NODE
                ? (s = i.documentElement)
                : (s = i.nextElement(this.root));
              s;

            ) {
              if (this.filter(s)) return s;
              s = s.nextElement(this.root);
            }
            return null;
          },
        },
      });
    },
  }),
  Db = oe({
    "external/npm/node_modules/domino/lib/DOMTokenList.js"(t, e) {
      "use strict";
      var n = Xe();
      e.exports = r;
      function r(c, l) {
        (this._getString = c),
          (this._setString = l),
          (this._length = 0),
          (this._lastStringValue = ""),
          this._update();
      }
      Object.defineProperties(r.prototype, {
        length: {
          get: function () {
            return this._length;
          },
        },
        item: {
          value: function (c) {
            var l = a(this);
            return c < 0 || c >= l.length ? null : l[c];
          },
        },
        contains: {
          value: function (c) {
            c = String(c);
            var l = a(this);
            return l.indexOf(c) > -1;
          },
        },
        add: {
          value: function () {
            for (var c = a(this), l = 0, u = arguments.length; l < u; l++) {
              var d = s(arguments[l]);
              c.indexOf(d) < 0 && c.push(d);
            }
            this._update(c);
          },
        },
        remove: {
          value: function () {
            for (var c = a(this), l = 0, u = arguments.length; l < u; l++) {
              var d = s(arguments[l]),
                m = c.indexOf(d);
              m > -1 && c.splice(m, 1);
            }
            this._update(c);
          },
        },
        toggle: {
          value: function (l, u) {
            return (
              (l = s(l)),
              this.contains(l)
                ? u === void 0 || u === !1
                  ? (this.remove(l), !1)
                  : !0
                : u === void 0 || u === !0
                ? (this.add(l), !0)
                : !1
            );
          },
        },
        replace: {
          value: function (l, u) {
            String(u) === "" && n.SyntaxError(), (l = s(l)), (u = s(u));
            var d = a(this),
              m = d.indexOf(l);
            if (m < 0) return !1;
            var b = d.indexOf(u);
            return (
              b < 0
                ? (d[m] = u)
                : m < b
                ? ((d[m] = u), d.splice(b, 1))
                : d.splice(m, 1),
              this._update(d),
              !0
            );
          },
        },
        toString: {
          value: function () {
            return this._getString();
          },
        },
        value: {
          get: function () {
            return this._getString();
          },
          set: function (c) {
            this._setString(c), this._update();
          },
        },
        _update: {
          value: function (c) {
            c
              ? (i(this, c), this._setString(c.join(" ").trim()))
              : i(this, a(this)),
              (this._lastStringValue = this._getString());
          },
        },
      });
      function i(c, l) {
        var u = c._length,
          d;
        for (c._length = l.length, d = 0; d < l.length; d++) c[d] = l[d];
        for (; d < u; d++) c[d] = void 0;
      }
      function s(c) {
        return (
          (c = String(c)),
          c === "" && n.SyntaxError(),
          /[ \t\r\n\f]/.test(c) && n.InvalidCharacterError(),
          c
        );
      }
      function o(c) {
        for (var l = c._length, u = Array(l), d = 0; d < l; d++) u[d] = c[d];
        return u;
      }
      function a(c) {
        var l = c._getString();
        if (l === c._lastStringValue) return o(c);
        var u = l.replace(/(^[ \t\r\n\f]+)|([ \t\r\n\f]+$)/g, "");
        if (u === "") return [];
        var d = Object.create(null);
        return u.split(/[ \t\r\n\f]+/g).filter(function (m) {
          var b = "$" + m;
          return d[b] ? !1 : ((d[b] = !0), !0);
        });
      }
    },
  }),
  Lh = oe({
    "external/npm/node_modules/domino/lib/select.js"(t, e) {
      "use strict";
      var n = Object.create(null, {
          location: {
            get: function () {
              throw new Error("window.location is not supported.");
            },
          },
        }),
        r = function (v, g) {
          return v.compareDocumentPosition(g);
        },
        i = function (v, g) {
          return r(v, g) & 2 ? 1 : -1;
        },
        s = function (v) {
          for (; (v = v.nextSibling) && v.nodeType !== 1; );
          return v;
        },
        o = function (v) {
          for (; (v = v.previousSibling) && v.nodeType !== 1; );
          return v;
        },
        a = function (v) {
          if ((v = v.firstChild))
            for (; v.nodeType !== 1 && (v = v.nextSibling); );
          return v;
        },
        c = function (v) {
          if ((v = v.lastChild))
            for (; v.nodeType !== 1 && (v = v.previousSibling); );
          return v;
        },
        l = function (v) {
          if (!v.parentNode) return !1;
          var g = v.parentNode.nodeType;
          return g === 1 || g === 9;
        },
        u = function (v) {
          if (!v) return v;
          var g = v[0];
          return g === '"' || g === "'"
            ? (v[v.length - 1] === g ? (v = v.slice(1, -1)) : (v = v.slice(1)),
              v.replace(E.str_escape, function (p) {
                var y = /^\\(?:([0-9A-Fa-f]+)|([\r\n\f]+))/.exec(p);
                if (!y) return p.slice(1);
                if (y[2]) return "";
                var C = parseInt(y[1], 16);
                return String.fromCodePoint
                  ? String.fromCodePoint(C)
                  : String.fromCharCode(C);
              }))
            : E.ident.test(v)
            ? d(v)
            : v;
        },
        d = function (v) {
          return v.replace(E.escape, function (g) {
            var p = /^\\([0-9A-Fa-f]+)/.exec(g);
            if (!p) return g[1];
            var y = parseInt(p[1], 16);
            return String.fromCodePoint
              ? String.fromCodePoint(y)
              : String.fromCharCode(y);
          });
        },
        m = (function () {
          return Array.prototype.indexOf
            ? Array.prototype.indexOf
            : function (v, g) {
                for (var p = this.length; p--; ) if (this[p] === g) return p;
                return -1;
              };
        })(),
        b = function (v, g) {
          var p = E.inside.source.replace(/</g, v).replace(/>/g, g);
          return new RegExp(p);
        },
        I = function (v, g, p) {
          return (
            (v = v.source), (v = v.replace(g, p.source || p)), new RegExp(v)
          );
        },
        N = function (v, g) {
          return v
            .replace(/^(?:\w+:\/\/|\/+)/, "")
            .replace(/(?:\/+|\/*#.*?)$/, "")
            .split("/", g)
            .join("/");
        },
        F = function (v, g) {
          var p = v.replace(/\s+/g, ""),
            y;
          return (
            p === "even"
              ? (p = "2n+0")
              : p === "odd"
              ? (p = "2n+1")
              : p.indexOf("n") === -1 && (p = "0n" + p),
            (y = /^([+-])?(\d+)?n([+-])?(\d+)?$/.exec(p)),
            {
              group: y[1] === "-" ? -(y[2] || 1) : +(y[2] || 1),
              offset: y[4] ? (y[3] === "-" ? -y[4] : +y[4]) : 0,
            }
          );
        },
        x = function (v, g, p) {
          var y = F(v),
            C = y.group,
            R = y.offset,
            V = p ? c : a,
            Q = p ? o : s;
          return function (he) {
            if (l(he))
              for (var S = V(he.parentNode), k = 0; S; ) {
                if ((g(S, he) && k++, S === he))
                  return (k -= R), C && k ? k % C === 0 && k < 0 == C < 0 : !k;
                S = Q(S);
              }
          };
        },
        _ = {
          "*": (function () {
            return function () {
              return !0;
            };
          })(),
          type: function (v) {
            return (
              (v = v.toLowerCase()),
              function (g) {
                return g.nodeName.toLowerCase() === v;
              }
            );
          },
          attr: function (v, g, p, y) {
            return (
              (g = w[g]),
              function (C) {
                var R;
                switch (v) {
                  case "for":
                    R = C.htmlFor;
                    break;
                  case "class":
                    (R = C.className),
                      R === "" && C.getAttribute("class") == null && (R = null);
                    break;
                  case "href":
                  case "src":
                    R = C.getAttribute(v, 2);
                    break;
                  case "title":
                    R = C.getAttribute("title") || null;
                    break;
                  case "id":
                  case "lang":
                  case "dir":
                  case "accessKey":
                  case "hidden":
                  case "tabIndex":
                  case "style":
                    if (C.getAttribute) {
                      R = C.getAttribute(v);
                      break;
                    }
                  default:
                    if (C.hasAttribute && !C.hasAttribute(v)) break;
                    R =
                      C[v] != null ? C[v] : C.getAttribute && C.getAttribute(v);
                    break;
                }
                if (R != null)
                  return (
                    (R = R + ""),
                    y && ((R = R.toLowerCase()), (p = p.toLowerCase())),
                    g(R, p)
                  );
              }
            );
          },
          ":first-child": function (v) {
            return !o(v) && l(v);
          },
          ":last-child": function (v) {
            return !s(v) && l(v);
          },
          ":only-child": function (v) {
            return !o(v) && !s(v) && l(v);
          },
          ":nth-child": function (v, g) {
            return x(
              v,
              function () {
                return !0;
              },
              g
            );
          },
          ":nth-last-child": function (v) {
            return _[":nth-child"](v, !0);
          },
          ":root": function (v) {
            return v.ownerDocument.documentElement === v;
          },
          ":empty": function (v) {
            return !v.firstChild;
          },
          ":not": function (v) {
            var g = j(v);
            return function (p) {
              return !g(p);
            };
          },
          ":first-of-type": function (v) {
            if (l(v)) {
              for (var g = v.nodeName; (v = o(v)); )
                if (v.nodeName === g) return;
              return !0;
            }
          },
          ":last-of-type": function (v) {
            if (l(v)) {
              for (var g = v.nodeName; (v = s(v)); )
                if (v.nodeName === g) return;
              return !0;
            }
          },
          ":only-of-type": function (v) {
            return _[":first-of-type"](v) && _[":last-of-type"](v);
          },
          ":nth-of-type": function (v, g) {
            return x(
              v,
              function (p, y) {
                return p.nodeName === y.nodeName;
              },
              g
            );
          },
          ":nth-last-of-type": function (v) {
            return _[":nth-of-type"](v, !0);
          },
          ":checked": function (v) {
            return !!(v.checked || v.selected);
          },
          ":indeterminate": function (v) {
            return !_[":checked"](v);
          },
          ":enabled": function (v) {
            return !v.disabled && v.type !== "hidden";
          },
          ":disabled": function (v) {
            return !!v.disabled;
          },
          ":target": function (v) {
            return v.id === n.location.hash.substring(1);
          },
          ":focus": function (v) {
            return v === v.ownerDocument.activeElement;
          },
          ":is": function (v) {
            return j(v);
          },
          ":matches": function (v) {
            return _[":is"](v);
          },
          ":nth-match": function (v, g) {
            var p = v.split(/\s*,\s*/),
              y = p.shift(),
              C = j(p.join(","));
            return x(y, C, g);
          },
          ":nth-last-match": function (v) {
            return _[":nth-match"](v, !0);
          },
          ":links-here": function (v) {
            return v + "" == n.location + "";
          },
          ":lang": function (v) {
            return function (g) {
              for (; g; ) {
                if (g.lang) return g.lang.indexOf(v) === 0;
                g = g.parentNode;
              }
            };
          },
          ":dir": function (v) {
            return function (g) {
              for (; g; ) {
                if (g.dir) return g.dir === v;
                g = g.parentNode;
              }
            };
          },
          ":scope": function (v, g) {
            var p = g || v.ownerDocument;
            return p.nodeType === 9 ? v === p.documentElement : v === p;
          },
          ":any-link": function (v) {
            return typeof v.href == "string";
          },
          ":local-link": function (v) {
            if (v.nodeName) return v.href && v.host === n.location.host;
            var g = +v + 1;
            return function (p) {
              if (p.href) {
                var y = n.location + "",
                  C = p + "";
                return N(y, g) === N(C, g);
              }
            };
          },
          ":default": function (v) {
            return !!v.defaultSelected;
          },
          ":valid": function (v) {
            return v.willValidate || (v.validity && v.validity.valid);
          },
          ":invalid": function (v) {
            return !_[":valid"](v);
          },
          ":in-range": function (v) {
            return v.value > v.min && v.value <= v.max;
          },
          ":out-of-range": function (v) {
            return !_[":in-range"](v);
          },
          ":required": function (v) {
            return !!v.required;
          },
          ":optional": function (v) {
            return !v.required;
          },
          ":read-only": function (v) {
            if (v.readOnly) return !0;
            var g = v.getAttribute("contenteditable"),
              p = v.contentEditable,
              y = v.nodeName.toLowerCase();
            return (
              (y = y !== "input" && y !== "textarea"),
              (y || v.disabled) && g == null && p !== "true"
            );
          },
          ":read-write": function (v) {
            return !_[":read-only"](v);
          },
          ":hover": function () {
            throw new Error(":hover is not supported.");
          },
          ":active": function () {
            throw new Error(":active is not supported.");
          },
          ":link": function () {
            throw new Error(":link is not supported.");
          },
          ":visited": function () {
            throw new Error(":visited is not supported.");
          },
          ":column": function () {
            throw new Error(":column is not supported.");
          },
          ":nth-column": function () {
            throw new Error(":nth-column is not supported.");
          },
          ":nth-last-column": function () {
            throw new Error(":nth-last-column is not supported.");
          },
          ":current": function () {
            throw new Error(":current is not supported.");
          },
          ":past": function () {
            throw new Error(":past is not supported.");
          },
          ":future": function () {
            throw new Error(":future is not supported.");
          },
          ":contains": function (v) {
            return function (g) {
              var p = g.innerText || g.textContent || g.value || "";
              return p.indexOf(v) !== -1;
            };
          },
          ":has": function (v) {
            return function (g) {
              return Y(v, g).length > 0;
            };
          },
        },
        w = {
          "-": function () {
            return !0;
          },
          "=": function (v, g) {
            return v === g;
          },
          "*=": function (v, g) {
            return v.indexOf(g) !== -1;
          },
          "~=": function (v, g) {
            var p, y, C, R;
            for (y = 0; ; y = p + 1) {
              if (((p = v.indexOf(g, y)), p === -1)) return !1;
              if (
                ((C = v[p - 1]),
                (R = v[p + g.length]),
                (!C || C === " ") && (!R || R === " "))
              )
                return !0;
            }
          },
          "|=": function (v, g) {
            var p = v.indexOf(g),
              y;
            if (p === 0) return (y = v[p + g.length]), y === "-" || !y;
          },
          "^=": function (v, g) {
            return v.indexOf(g) === 0;
          },
          "$=": function (v, g) {
            var p = v.lastIndexOf(g);
            return p !== -1 && p + g.length === v.length;
          },
          "!=": function (v, g) {
            return v !== g;
          },
        },
        T = {
          " ": function (v) {
            return function (g) {
              for (; (g = g.parentNode); ) if (v(g)) return g;
            };
          },
          ">": function (v) {
            return function (g) {
              if ((g = g.parentNode)) return v(g) && g;
            };
          },
          "+": function (v) {
            return function (g) {
              if ((g = o(g))) return v(g) && g;
            };
          },
          "~": function (v) {
            return function (g) {
              for (; (g = o(g)); ) if (v(g)) return g;
            };
          },
          noop: function (v) {
            return function (g) {
              return v(g) && g;
            };
          },
          ref: function (v, g) {
            var p;
            function y(C) {
              for (
                var R = C.ownerDocument,
                  V = R.getElementsByTagName("*"),
                  Q = V.length;
                Q--;

              )
                if (((p = V[Q]), y.test(C))) return (p = null), !0;
              p = null;
            }
            return (
              (y.combinator = function (C) {
                if (!(!p || !p.getAttribute)) {
                  var R = p.getAttribute(g) || "";
                  if (
                    (R[0] === "#" && (R = R.substring(1)), R === C.id && v(p))
                  )
                    return p;
                }
              }),
              y
            );
          },
        },
        E = {
          escape: /\\(?:[^0-9A-Fa-f\r\n]|[0-9A-Fa-f]{1,6}[\r\n\t ]?)/g,
          str_escape: /(escape)|\\(\n|\r\n?|\f)/g,
          nonascii: /[\u00A0-\uFFFF]/,
          cssid: /(?:(?!-?[0-9])(?:escape|nonascii|[-_a-zA-Z0-9])+)/,
          qname: /^ *(cssid|\*)/,
          simple: /^(?:([.#]cssid)|pseudo|attr)/,
          ref: /^ *\/(cssid)\/ */,
          combinator: /^(?: +([^ \w*.#\\]) +|( )+|([^ \w*.#\\]))(?! *$)/,
          attr: /^\[(cssid)(?:([^\w]?=)(inside))?\]/,
          pseudo: /^(:cssid)(?:\((inside)\))?/,
          inside:
            /(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|<[^"'>]*>|\\["'>]|[^"'>])*/,
          ident: /^(cssid)$/,
        };
      (E.cssid = I(E.cssid, "nonascii", E.nonascii)),
        (E.cssid = I(E.cssid, "escape", E.escape)),
        (E.qname = I(E.qname, "cssid", E.cssid)),
        (E.simple = I(E.simple, "cssid", E.cssid)),
        (E.ref = I(E.ref, "cssid", E.cssid)),
        (E.attr = I(E.attr, "cssid", E.cssid)),
        (E.pseudo = I(E.pseudo, "cssid", E.cssid)),
        (E.inside = I(E.inside, `[^"'>]*`, E.inside)),
        (E.attr = I(E.attr, "inside", b("\\[", "\\]"))),
        (E.pseudo = I(E.pseudo, "inside", b("\\(", "\\)"))),
        (E.simple = I(E.simple, "pseudo", E.pseudo)),
        (E.simple = I(E.simple, "attr", E.attr)),
        (E.ident = I(E.ident, "cssid", E.cssid)),
        (E.str_escape = I(E.str_escape, "escape", E.escape));
      var ee = function (v) {
          for (
            var g = v.replace(/^\s+|\s+$/g, ""),
              p,
              y = [],
              C = [],
              R,
              V,
              Q,
              he,
              S;
            g;

          ) {
            if ((Q = E.qname.exec(g)))
              (g = g.substring(Q[0].length)), (V = d(Q[1])), C.push(ne(V, !0));
            else if ((Q = E.simple.exec(g)))
              (g = g.substring(Q[0].length)),
                (V = "*"),
                C.push(ne(V, !0)),
                C.push(ne(Q));
            else throw new SyntaxError("Invalid selector.");
            for (; (Q = E.simple.exec(g)); )
              (g = g.substring(Q[0].length)), C.push(ne(Q));
            if (
              (g[0] === "!" &&
                ((g = g.substring(1)),
                (R = O()),
                (R.qname = V),
                C.push(R.simple)),
              (Q = E.ref.exec(g)))
            ) {
              (g = g.substring(Q[0].length)),
                (S = T.ref(me(C), d(Q[1]))),
                y.push(S.combinator),
                (C = []);
              continue;
            }
            if ((Q = E.combinator.exec(g))) {
              if (
                ((g = g.substring(Q[0].length)),
                (he = Q[1] || Q[2] || Q[3]),
                he === ",")
              ) {
                y.push(T.noop(me(C)));
                break;
              }
            } else he = "noop";
            if (!T[he]) throw new SyntaxError("Bad combinator.");
            y.push(T[he](me(C))), (C = []);
          }
          return (
            (p = q(y)),
            (p.qname = V),
            (p.sel = g),
            R &&
              ((R.lname = p.qname),
              (R.test = p),
              (R.qname = R.qname),
              (R.sel = p.sel),
              (p = R)),
            S && ((S.test = p), (S.qname = p.qname), (S.sel = p.sel), (p = S)),
            p
          );
        },
        ne = function (v, g) {
          if (g) return v === "*" ? _["*"] : _.type(v);
          if (v[1])
            return v[1][0] === "."
              ? _.attr("class", "~=", d(v[1].substring(1)), !1)
              : _.attr("id", "=", d(v[1].substring(1)), !1);
          if (v[2]) return v[3] ? _[d(v[2])](u(v[3])) : _[d(v[2])];
          if (v[4]) {
            var p = v[6],
              y = /["'\s]\s*I$/i.test(p);
            return (
              y && (p = p.replace(/\s*I$/i, "")),
              _.attr(d(v[4]), v[5] || "-", u(p), y)
            );
          }
          throw new SyntaxError("Unknown Selector.");
        },
        me = function (v) {
          var g = v.length,
            p;
          return g < 2
            ? v[0]
            : function (y) {
                if (y) {
                  for (p = 0; p < g; p++) if (!v[p](y)) return;
                  return !0;
                }
              };
        },
        q = function (v) {
          return v.length < 2
            ? function (g) {
                return !!v[0](g);
              }
            : function (g) {
                for (var p = v.length; p--; ) if (!(g = v[p](g))) return;
                return !0;
              };
        },
        O = function () {
          var v;
          function g(p) {
            for (
              var y = p.ownerDocument,
                C = y.getElementsByTagName(g.lname),
                R = C.length;
              R--;

            )
              if (g.test(C[R]) && v === p) return (v = null), !0;
            v = null;
          }
          return (
            (g.simple = function (p) {
              return (v = p), !0;
            }),
            g
          );
        },
        j = function (v) {
          for (var g = ee(v), p = [g]; g.sel; ) (g = ee(g.sel)), p.push(g);
          return p.length < 2
            ? g
            : function (y) {
                for (var C = p.length, R = 0; R < C; R++)
                  if (p[R](y)) return !0;
              };
        },
        Y = function (v, g) {
          for (
            var p = [],
              y = ee(v),
              C = g.getElementsByTagName(y.qname),
              R = 0,
              V;
            (V = C[R++]);

          )
            y(V) && p.push(V);
          if (y.sel) {
            for (; y.sel; )
              for (
                y = ee(y.sel), C = g.getElementsByTagName(y.qname), R = 0;
                (V = C[R++]);

              )
                y(V) && m.call(p, V) === -1 && p.push(V);
            p.sort(i);
          }
          return p;
        };
      (e.exports = t =
        function (v, g) {
          var p, y;
          if (g.nodeType !== 11 && v.indexOf(" ") === -1) {
            if (
              v[0] === "#" &&
              g.rooted &&
              /^#[A-Z_][-A-Z0-9_]*$/i.test(v) &&
              g.doc._hasMultipleElementsWithId &&
              ((p = v.substring(1)), !g.doc._hasMultipleElementsWithId(p))
            )
              return (y = g.doc.getElementById(p)), y ? [y] : [];
            if (v[0] === "." && /^\.\w+$/.test(v))
              return g.getElementsByClassName(v.substring(1));
            if (/^\w+$/.test(v)) return g.getElementsByTagName(v);
          }
          return Y(v, g);
        }),
        (t.selectors = _),
        (t.operators = w),
        (t.combinators = T),
        (t.matches = function (v, g) {
          var p = { sel: g };
          do if (((p = ee(p.sel)), p(v))) return !0;
          while (p.sel);
          return !1;
        });
    },
  }),
  Ph = oe({
    "external/npm/node_modules/domino/lib/ChildNode.js"(t, e) {
      "use strict";
      var n = ft(),
        r = Eb(),
        i = function (o, a) {
          for (var c = o.createDocumentFragment(), l = 0; l < a.length; l++) {
            var u = a[l],
              d = u instanceof n;
            c.appendChild(d ? u : o.createTextNode(String(u)));
          }
          return c;
        },
        s = {
          after: {
            value: function () {
              var a = Array.prototype.slice.call(arguments),
                c = this.parentNode,
                l = this.nextSibling;
              if (c !== null) {
                for (
                  ;
                  l &&
                  a.some(function (d) {
                    return d === l;
                  });

                )
                  l = l.nextSibling;
                var u = i(this.doc, a);
                c.insertBefore(u, l);
              }
            },
          },
          before: {
            value: function () {
              var a = Array.prototype.slice.call(arguments),
                c = this.parentNode,
                l = this.previousSibling;
              if (c !== null) {
                for (
                  ;
                  l &&
                  a.some(function (m) {
                    return m === l;
                  });

                )
                  l = l.previousSibling;
                var u = i(this.doc, a),
                  d = l ? l.nextSibling : c.firstChild;
                c.insertBefore(u, d);
              }
            },
          },
          remove: {
            value: function () {
              this.parentNode !== null &&
                (this.doc &&
                  (this.doc._preremoveNodeIterators(this),
                  this.rooted && this.doc.mutateRemove(this)),
                this._remove(),
                (this.parentNode = null));
            },
          },
          _remove: {
            value: function () {
              var a = this.parentNode;
              a !== null &&
                (a._childNodes
                  ? a._childNodes.splice(this.index, 1)
                  : a._firstChild === this &&
                    (this._nextSibling === this
                      ? (a._firstChild = null)
                      : (a._firstChild = this._nextSibling)),
                r.remove(this),
                a.modify());
            },
          },
          replaceWith: {
            value: function () {
              var a = Array.prototype.slice.call(arguments),
                c = this.parentNode,
                l = this.nextSibling;
              if (c !== null) {
                for (
                  ;
                  l &&
                  a.some(function (d) {
                    return d === l;
                  });

                )
                  l = l.nextSibling;
                var u = i(this.doc, a);
                this.parentNode === c
                  ? c.replaceChild(u, this)
                  : c.insertBefore(u, l);
              }
            },
          },
        };
      e.exports = s;
    },
  }),
  _b = oe({
    "external/npm/node_modules/domino/lib/NonDocumentTypeChildNode.js"(t, e) {
      "use strict";
      var n = ft(),
        r = {
          nextElementSibling: {
            get: function () {
              if (this.parentNode) {
                for (var i = this.nextSibling; i !== null; i = i.nextSibling)
                  if (i.nodeType === n.ELEMENT_NODE) return i;
              }
              return null;
            },
          },
          previousElementSibling: {
            get: function () {
              if (this.parentNode) {
                for (
                  var i = this.previousSibling;
                  i !== null;
                  i = i.previousSibling
                )
                  if (i.nodeType === n.ELEMENT_NODE) return i;
              }
              return null;
            },
          },
        };
      e.exports = r;
    },
  }),
  Tb = oe({
    "external/npm/node_modules/domino/lib/NamedNodeMap.js"(t, e) {
      "use strict";
      e.exports = r;
      var n = Xe();
      function r(i) {
        this.element = i;
      }
      Object.defineProperties(r.prototype, {
        length: { get: n.shouldOverride },
        item: { value: n.shouldOverride },
        getNamedItem: {
          value: function (s) {
            return this.element.getAttributeNode(s);
          },
        },
        getNamedItemNS: {
          value: function (s, o) {
            return this.element.getAttributeNodeNS(s, o);
          },
        },
        setNamedItem: { value: n.nyi },
        setNamedItemNS: { value: n.nyi },
        removeNamedItem: {
          value: function (s) {
            var o = this.element.getAttributeNode(s);
            if (o) return this.element.removeAttribute(s), o;
            n.NotFoundError();
          },
        },
        removeNamedItemNS: {
          value: function (s, o) {
            var a = this.element.getAttributeNodeNS(s, o);
            if (a) return this.element.removeAttributeNS(s, o), a;
            n.NotFoundError();
          },
        },
      });
    },
  }),
  vo = oe({
    "external/npm/node_modules/domino/lib/Element.js"(t, e) {
      "use strict";
      e.exports = _;
      var n = kh(),
        r = Xe(),
        i = r.NAMESPACE,
        s = wb(),
        o = ft(),
        a = Qi(),
        c = bb(),
        l = NN(),
        u = xh(),
        d = Db(),
        m = Lh(),
        b = Oh(),
        I = Ph(),
        N = _b(),
        F = Tb(),
        x = Object.create(null);
      function _(g, p, y, C) {
        b.call(this),
          (this.nodeType = o.ELEMENT_NODE),
          (this.ownerDocument = g),
          (this.localName = p),
          (this.namespaceURI = y),
          (this.prefix = C),
          (this._tagName = void 0),
          (this._attrsByQName = Object.create(null)),
          (this._attrsByLName = Object.create(null)),
          (this._attrKeys = []);
      }
      function w(g, p) {
        if (g.nodeType === o.TEXT_NODE) p.push(g._data);
        else
          for (var y = 0, C = g.childNodes.length; y < C; y++)
            w(g.childNodes[y], p);
      }
      (_.prototype = Object.create(b.prototype, {
        isHTML: {
          get: function () {
            return this.namespaceURI === i.HTML && this.ownerDocument.isHTML;
          },
        },
        tagName: {
          get: function () {
            if (this._tagName === void 0) {
              var p;
              if (
                (this.prefix === null
                  ? (p = this.localName)
                  : (p = this.prefix + ":" + this.localName),
                this.isHTML)
              ) {
                var y = x[p];
                y || (x[p] = y = r.toASCIIUpperCase(p)), (p = y);
              }
              this._tagName = p;
            }
            return this._tagName;
          },
        },
        nodeName: {
          get: function () {
            return this.tagName;
          },
        },
        nodeValue: {
          get: function () {
            return null;
          },
          set: function () {},
        },
        textContent: {
          get: function () {
            var g = [];
            return w(this, g), g.join("");
          },
          set: function (g) {
            this.removeChildren(),
              g != null &&
                g !== "" &&
                this._appendChild(this.ownerDocument.createTextNode(g));
          },
        },
        innerText: {
          get: function () {
            var g = [];
            return (
              w(this, g),
              g
                .join("")
                .replace(/[ \t\n\f\r]+/g, " ")
                .trim()
            );
          },
          set: function (g) {
            this.removeChildren(),
              g != null &&
                g !== "" &&
                this._appendChild(this.ownerDocument.createTextNode(g));
          },
        },
        innerHTML: {
          get: function () {
            return this.serialize();
          },
          set: r.nyi,
        },
        outerHTML: {
          get: function () {
            return c.serializeOne(this, { nodeType: 0 });
          },
          set: function (g) {
            var p = this.ownerDocument,
              y = this.parentNode;
            if (y !== null) {
              y.nodeType === o.DOCUMENT_NODE && r.NoModificationAllowedError(),
                y.nodeType === o.DOCUMENT_FRAGMENT_NODE &&
                  (y = y.ownerDocument.createElement("body"));
              var C = p.implementation.mozHTMLParser(p._address, y);
              C.parse(g === null ? "" : String(g), !0),
                this.replaceWith(C._asDocumentFragment());
            }
          },
        },
        _insertAdjacent: {
          value: function (p, y) {
            var C = !1;
            switch (p) {
              case "beforebegin":
                C = !0;
              case "afterend":
                var R = this.parentNode;
                return R === null
                  ? null
                  : R.insertBefore(y, C ? this : this.nextSibling);
              case "afterbegin":
                C = !0;
              case "beforeend":
                return this.insertBefore(y, C ? this.firstChild : null);
              default:
                return r.SyntaxError();
            }
          },
        },
        insertAdjacentElement: {
          value: function (p, y) {
            if (y.nodeType !== o.ELEMENT_NODE)
              throw new TypeError("not an element");
            return (
              (p = r.toASCIILowerCase(String(p))), this._insertAdjacent(p, y)
            );
          },
        },
        insertAdjacentText: {
          value: function (p, y) {
            var C = this.ownerDocument.createTextNode(y);
            (p = r.toASCIILowerCase(String(p))), this._insertAdjacent(p, C);
          },
        },
        insertAdjacentHTML: {
          value: function (p, y) {
            (p = r.toASCIILowerCase(String(p))), (y = String(y));
            var C;
            switch (p) {
              case "beforebegin":
              case "afterend":
                (C = this.parentNode),
                  (C === null || C.nodeType === o.DOCUMENT_NODE) &&
                    r.NoModificationAllowedError();
                break;
              case "afterbegin":
              case "beforeend":
                C = this;
                break;
              default:
                r.SyntaxError();
            }
            (!(C instanceof _) ||
              (C.ownerDocument.isHTML &&
                C.localName === "html" &&
                C.namespaceURI === i.HTML)) &&
              (C = C.ownerDocument.createElementNS(i.HTML, "body"));
            var R = this.ownerDocument.implementation.mozHTMLParser(
              this.ownerDocument._address,
              C
            );
            R.parse(y, !0), this._insertAdjacent(p, R._asDocumentFragment());
          },
        },
        children: {
          get: function () {
            return (
              this._children || (this._children = new ne(this)), this._children
            );
          },
        },
        attributes: {
          get: function () {
            return (
              this._attributes || (this._attributes = new E(this)),
              this._attributes
            );
          },
        },
        firstElementChild: {
          get: function () {
            for (var g = this.firstChild; g !== null; g = g.nextSibling)
              if (g.nodeType === o.ELEMENT_NODE) return g;
            return null;
          },
        },
        lastElementChild: {
          get: function () {
            for (var g = this.lastChild; g !== null; g = g.previousSibling)
              if (g.nodeType === o.ELEMENT_NODE) return g;
            return null;
          },
        },
        childElementCount: {
          get: function () {
            return this.children.length;
          },
        },
        nextElement: {
          value: function (g) {
            g || (g = this.ownerDocument.documentElement);
            var p = this.firstElementChild;
            if (!p) {
              if (this === g) return null;
              p = this.nextElementSibling;
            }
            if (p) return p;
            for (var y = this.parentElement; y && y !== g; y = y.parentElement)
              if (((p = y.nextElementSibling), p)) return p;
            return null;
          },
        },
        getElementsByTagName: {
          value: function (p) {
            var y;
            return p
              ? (p === "*"
                  ? (y = function () {
                      return !0;
                    })
                  : this.isHTML
                  ? (y = q(p))
                  : (y = me(p)),
                new l(this, y))
              : new a();
          },
        },
        getElementsByTagNameNS: {
          value: function (p, y) {
            var C;
            return (
              p === "*" && y === "*"
                ? (C = function () {
                    return !0;
                  })
                : p === "*"
                ? (C = me(y))
                : y === "*"
                ? (C = O(p))
                : (C = j(p, y)),
              new l(this, C)
            );
          },
        },
        getElementsByClassName: {
          value: function (p) {
            if (((p = String(p).trim()), p === "")) {
              var y = new a();
              return y;
            }
            return (p = p.split(/[ \t\r\n\f]+/)), new l(this, Y(p));
          },
        },
        getElementsByName: {
          value: function (p) {
            return new l(this, v(String(p)));
          },
        },
        clone: {
          value: function () {
            var p;
            this.namespaceURI !== i.HTML ||
            this.prefix ||
            !this.ownerDocument.isHTML
              ? (p = this.ownerDocument.createElementNS(
                  this.namespaceURI,
                  this.prefix !== null
                    ? this.prefix + ":" + this.localName
                    : this.localName
                ))
              : (p = this.ownerDocument.createElement(this.localName));
            for (var y = 0, C = this._attrKeys.length; y < C; y++) {
              var R = this._attrKeys[y],
                V = this._attrsByLName[R],
                Q = V.cloneNode();
              Q._setOwnerElement(p), (p._attrsByLName[R] = Q), p._addQName(Q);
            }
            return (p._attrKeys = this._attrKeys.concat()), p;
          },
        },
        isEqual: {
          value: function (p) {
            if (
              this.localName !== p.localName ||
              this.namespaceURI !== p.namespaceURI ||
              this.prefix !== p.prefix ||
              this._numattrs !== p._numattrs
            )
              return !1;
            for (var y = 0, C = this._numattrs; y < C; y++) {
              var R = this._attr(y);
              if (
                !p.hasAttributeNS(R.namespaceURI, R.localName) ||
                p.getAttributeNS(R.namespaceURI, R.localName) !== R.value
              )
                return !1;
            }
            return !0;
          },
        },
        _lookupNamespacePrefix: {
          value: function (p, y) {
            if (
              this.namespaceURI &&
              this.namespaceURI === p &&
              this.prefix !== null &&
              y.lookupNamespaceURI(this.prefix) === p
            )
              return this.prefix;
            for (var C = 0, R = this._numattrs; C < R; C++) {
              var V = this._attr(C);
              if (
                V.prefix === "xmlns" &&
                V.value === p &&
                y.lookupNamespaceURI(V.localName) === p
              )
                return V.localName;
            }
            var Q = this.parentElement;
            return Q ? Q._lookupNamespacePrefix(p, y) : null;
          },
        },
        lookupNamespaceURI: {
          value: function (p) {
            if (
              ((p === "" || p === void 0) && (p = null),
              this.namespaceURI !== null && this.prefix === p)
            )
              return this.namespaceURI;
            for (var y = 0, C = this._numattrs; y < C; y++) {
              var R = this._attr(y);
              if (
                R.namespaceURI === i.XMLNS &&
                ((R.prefix === "xmlns" && R.localName === p) ||
                  (p === null && R.prefix === null && R.localName === "xmlns"))
              )
                return R.value || null;
            }
            var V = this.parentElement;
            return V ? V.lookupNamespaceURI(p) : null;
          },
        },
        getAttribute: {
          value: function (p) {
            var y = this.getAttributeNode(p);
            return y ? y.value : null;
          },
        },
        getAttributeNS: {
          value: function (p, y) {
            var C = this.getAttributeNodeNS(p, y);
            return C ? C.value : null;
          },
        },
        getAttributeNode: {
          value: function (p) {
            (p = String(p)),
              /[A-Z]/.test(p) && this.isHTML && (p = r.toASCIILowerCase(p));
            var y = this._attrsByQName[p];
            return y ? (Array.isArray(y) && (y = y[0]), y) : null;
          },
        },
        getAttributeNodeNS: {
          value: function (p, y) {
            (p = p == null ? "" : String(p)), (y = String(y));
            var C = this._attrsByLName[p + "|" + y];
            return C || null;
          },
        },
        hasAttribute: {
          value: function (p) {
            return (
              (p = String(p)),
              /[A-Z]/.test(p) && this.isHTML && (p = r.toASCIILowerCase(p)),
              this._attrsByQName[p] !== void 0
            );
          },
        },
        hasAttributeNS: {
          value: function (p, y) {
            (p = p == null ? "" : String(p)), (y = String(y));
            var C = p + "|" + y;
            return this._attrsByLName[C] !== void 0;
          },
        },
        hasAttributes: {
          value: function () {
            return this._numattrs > 0;
          },
        },
        toggleAttribute: {
          value: function (p, y) {
            (p = String(p)),
              n.isValidName(p) || r.InvalidCharacterError(),
              /[A-Z]/.test(p) && this.isHTML && (p = r.toASCIILowerCase(p));
            var C = this._attrsByQName[p];
            return C === void 0
              ? y === void 0 || y === !0
                ? (this._setAttribute(p, ""), !0)
                : !1
              : y === void 0 || y === !1
              ? (this.removeAttribute(p), !1)
              : !0;
          },
        },
        _setAttribute: {
          value: function (p, y) {
            var C = this._attrsByQName[p],
              R;
            C
              ? Array.isArray(C) && (C = C[0])
              : ((C = this._newattr(p)), (R = !0)),
              (C.value = y),
              this._attributes && (this._attributes[p] = C),
              R && this._newattrhook && this._newattrhook(p, y);
          },
        },
        setAttribute: {
          value: function (p, y) {
            (p = String(p)),
              n.isValidName(p) || r.InvalidCharacterError(),
              /[A-Z]/.test(p) && this.isHTML && (p = r.toASCIILowerCase(p)),
              this._setAttribute(p, String(y));
          },
        },
        _setAttributeNS: {
          value: function (p, y, C) {
            var R = y.indexOf(":"),
              V,
              Q;
            R < 0
              ? ((V = null), (Q = y))
              : ((V = y.substring(0, R)), (Q = y.substring(R + 1))),
              (p === "" || p === void 0) && (p = null);
            var he = (p === null ? "" : p) + "|" + Q,
              S = this._attrsByLName[he],
              k;
            S ||
              ((S = new T(this, Q, V, p)),
              (k = !0),
              (this._attrsByLName[he] = S),
              this._attributes && (this._attributes[this._attrKeys.length] = S),
              this._attrKeys.push(he),
              this._addQName(S)),
              (S.value = C),
              k && this._newattrhook && this._newattrhook(y, C);
          },
        },
        setAttributeNS: {
          value: function (p, y, C) {
            (p = p == null || p === "" ? null : String(p)),
              (y = String(y)),
              n.isValidQName(y) || r.InvalidCharacterError();
            var R = y.indexOf(":"),
              V = R < 0 ? null : y.substring(0, R);
            ((V !== null && p === null) ||
              (V === "xml" && p !== i.XML) ||
              ((y === "xmlns" || V === "xmlns") && p !== i.XMLNS) ||
              (p === i.XMLNS && !(y === "xmlns" || V === "xmlns"))) &&
              r.NamespaceError(),
              this._setAttributeNS(p, y, String(C));
          },
        },
        setAttributeNode: {
          value: function (p) {
            if (p.ownerElement !== null && p.ownerElement !== this)
              throw new u(u.INUSE_ATTRIBUTE_ERR);
            var y = null,
              C = this._attrsByQName[p.name];
            if (C) {
              if (
                (Array.isArray(C) || (C = [C]),
                C.some(function (R) {
                  return R === p;
                }))
              )
                return p;
              if (p.ownerElement !== null) throw new u(u.INUSE_ATTRIBUTE_ERR);
              C.forEach(function (R) {
                this.removeAttributeNode(R);
              }, this),
                (y = C[0]);
            }
            return this.setAttributeNodeNS(p), y;
          },
        },
        setAttributeNodeNS: {
          value: function (p) {
            if (p.ownerElement !== null) throw new u(u.INUSE_ATTRIBUTE_ERR);
            var y = p.namespaceURI,
              C = (y === null ? "" : y) + "|" + p.localName,
              R = this._attrsByLName[C];
            return (
              R && this.removeAttributeNode(R),
              p._setOwnerElement(this),
              (this._attrsByLName[C] = p),
              this._attributes && (this._attributes[this._attrKeys.length] = p),
              this._attrKeys.push(C),
              this._addQName(p),
              this._newattrhook && this._newattrhook(p.name, p.value),
              R || null
            );
          },
        },
        removeAttribute: {
          value: function (p) {
            (p = String(p)),
              /[A-Z]/.test(p) && this.isHTML && (p = r.toASCIILowerCase(p));
            var y = this._attrsByQName[p];
            if (y) {
              Array.isArray(y)
                ? y.length > 2
                  ? (y = y.shift())
                  : ((this._attrsByQName[p] = y[1]), (y = y[0]))
                : (this._attrsByQName[p] = void 0);
              var C = y.namespaceURI,
                R = (C === null ? "" : C) + "|" + y.localName;
              this._attrsByLName[R] = void 0;
              var V = this._attrKeys.indexOf(R);
              this._attributes &&
                (Array.prototype.splice.call(this._attributes, V, 1),
                (this._attributes[p] = void 0)),
                this._attrKeys.splice(V, 1);
              var Q = y.onchange;
              y._setOwnerElement(null),
                Q && Q.call(y, this, y.localName, y.value, null),
                this.rooted && this.ownerDocument.mutateRemoveAttr(y);
            }
          },
        },
        removeAttributeNS: {
          value: function (p, y) {
            (p = p == null ? "" : String(p)), (y = String(y));
            var C = p + "|" + y,
              R = this._attrsByLName[C];
            if (R) {
              this._attrsByLName[C] = void 0;
              var V = this._attrKeys.indexOf(C);
              this._attributes &&
                Array.prototype.splice.call(this._attributes, V, 1),
                this._attrKeys.splice(V, 1),
                this._removeQName(R);
              var Q = R.onchange;
              R._setOwnerElement(null),
                Q && Q.call(R, this, R.localName, R.value, null),
                this.rooted && this.ownerDocument.mutateRemoveAttr(R);
            }
          },
        },
        removeAttributeNode: {
          value: function (p) {
            var y = p.namespaceURI,
              C = (y === null ? "" : y) + "|" + p.localName;
            return (
              this._attrsByLName[C] !== p && r.NotFoundError(),
              this.removeAttributeNS(y, p.localName),
              p
            );
          },
        },
        getAttributeNames: {
          value: function () {
            var p = this;
            return this._attrKeys.map(function (y) {
              return p._attrsByLName[y].name;
            });
          },
        },
        _getattr: {
          value: function (p) {
            var y = this._attrsByQName[p];
            return y ? y.value : null;
          },
        },
        _setattr: {
          value: function (p, y) {
            var C = this._attrsByQName[p],
              R;
            C || ((C = this._newattr(p)), (R = !0)),
              (C.value = String(y)),
              this._attributes && (this._attributes[p] = C),
              R && this._newattrhook && this._newattrhook(p, y);
          },
        },
        _newattr: {
          value: function (p) {
            var y = new T(this, p, null, null),
              C = "|" + p;
            return (
              (this._attrsByQName[p] = y),
              (this._attrsByLName[C] = y),
              this._attributes && (this._attributes[this._attrKeys.length] = y),
              this._attrKeys.push(C),
              y
            );
          },
        },
        _addQName: {
          value: function (g) {
            var p = g.name,
              y = this._attrsByQName[p];
            y
              ? Array.isArray(y)
                ? y.push(g)
                : (this._attrsByQName[p] = [y, g])
              : (this._attrsByQName[p] = g),
              this._attributes && (this._attributes[p] = g);
          },
        },
        _removeQName: {
          value: function (g) {
            var p = g.name,
              y = this._attrsByQName[p];
            if (Array.isArray(y)) {
              var C = y.indexOf(g);
              r.assert(C !== -1),
                y.length === 2
                  ? ((this._attrsByQName[p] = y[1 - C]),
                    this._attributes &&
                      (this._attributes[p] = this._attrsByQName[p]))
                  : (y.splice(C, 1),
                    this._attributes &&
                      this._attributes[p] === g &&
                      (this._attributes[p] = y[0]));
            } else
              r.assert(y === g),
                (this._attrsByQName[p] = void 0),
                this._attributes && (this._attributes[p] = void 0);
          },
        },
        _numattrs: {
          get: function () {
            return this._attrKeys.length;
          },
        },
        _attr: {
          value: function (g) {
            return this._attrsByLName[this._attrKeys[g]];
          },
        },
        id: s.property({ name: "id" }),
        className: s.property({ name: "class" }),
        classList: {
          get: function () {
            var g = this;
            if (this._classList) return this._classList;
            var p = new d(
              function () {
                return g.className || "";
              },
              function (y) {
                g.className = y;
              }
            );
            return (this._classList = p), p;
          },
          set: function (g) {
            this.className = g;
          },
        },
        matches: {
          value: function (g) {
            return m.matches(this, g);
          },
        },
        closest: {
          value: function (g) {
            var p = this;
            do {
              if (p.matches && p.matches(g)) return p;
              p = p.parentElement || p.parentNode;
            } while (p !== null && p.nodeType === o.ELEMENT_NODE);
            return null;
          },
        },
        querySelector: {
          value: function (g) {
            return m(g, this)[0];
          },
        },
        querySelectorAll: {
          value: function (g) {
            var p = m(g, this);
            return p.item ? p : new a(p);
          },
        },
      })),
        Object.defineProperties(_.prototype, I),
        Object.defineProperties(_.prototype, N),
        s.registerChangeHandler(_, "id", function (g, p, y, C) {
          g.rooted &&
            (y && g.ownerDocument.delId(y, g),
            C && g.ownerDocument.addId(C, g));
        }),
        s.registerChangeHandler(_, "class", function (g, p, y, C) {
          g._classList && g._classList._update();
        });
      function T(g, p, y, C, R) {
        (this.localName = p),
          (this.prefix = y === null || y === "" ? null : "" + y),
          (this.namespaceURI = C === null || C === "" ? null : "" + C),
          (this.data = R),
          this._setOwnerElement(g);
      }
      (T.prototype = Object.create(Object.prototype, {
        ownerElement: {
          get: function () {
            return this._ownerElement;
          },
        },
        _setOwnerElement: {
          value: function (p) {
            (this._ownerElement = p),
              this.prefix === null && this.namespaceURI === null && p
                ? (this.onchange = p._attributeChangeHandlers[this.localName])
                : (this.onchange = null);
          },
        },
        name: {
          get: function () {
            return this.prefix
              ? this.prefix + ":" + this.localName
              : this.localName;
          },
        },
        specified: {
          get: function () {
            return !0;
          },
        },
        value: {
          get: function () {
            return this.data;
          },
          set: function (g) {
            var p = this.data;
            (g = g === void 0 ? "" : g + ""),
              g !== p &&
                ((this.data = g),
                this.ownerElement &&
                  (this.onchange &&
                    this.onchange(this.ownerElement, this.localName, p, g),
                  this.ownerElement.rooted &&
                    this.ownerElement.ownerDocument.mutateAttr(this, p)));
          },
        },
        cloneNode: {
          value: function (p) {
            return new T(
              null,
              this.localName,
              this.prefix,
              this.namespaceURI,
              this.data
            );
          },
        },
        nodeType: {
          get: function () {
            return o.ATTRIBUTE_NODE;
          },
        },
        nodeName: {
          get: function () {
            return this.name;
          },
        },
        nodeValue: {
          get: function () {
            return this.value;
          },
          set: function (g) {
            this.value = g;
          },
        },
        textContent: {
          get: function () {
            return this.value;
          },
          set: function (g) {
            g == null && (g = ""), (this.value = g);
          },
        },
        innerText: {
          get: function () {
            return this.value;
          },
          set: function (g) {
            g == null && (g = ""), (this.value = g);
          },
        },
      })),
        (_._Attr = T);
      function E(g) {
        F.call(this, g);
        for (var p in g._attrsByQName) this[p] = g._attrsByQName[p];
        for (var y = 0; y < g._attrKeys.length; y++)
          this[y] = g._attrsByLName[g._attrKeys[y]];
      }
      E.prototype = Object.create(F.prototype, {
        length: {
          get: function () {
            return this.element._attrKeys.length;
          },
          set: function () {},
        },
        item: {
          value: function (g) {
            return (
              (g = g >>> 0),
              g >= this.length
                ? null
                : this.element._attrsByLName[this.element._attrKeys[g]]
            );
          },
        },
      });
      var ee;
      (ee = globalThis.Symbol) != null &&
        ee.iterator &&
        (E.prototype[globalThis.Symbol.iterator] = function () {
          var g = 0,
            p = this.length,
            y = this;
          return {
            next: function () {
              return g < p ? { value: y.item(g++) } : { done: !0 };
            },
          };
        });
      function ne(g) {
        (this.element = g), this.updateCache();
      }
      ne.prototype = Object.create(Object.prototype, {
        length: {
          get: function () {
            return this.updateCache(), this.childrenByNumber.length;
          },
        },
        item: {
          value: function (p) {
            return this.updateCache(), this.childrenByNumber[p] || null;
          },
        },
        namedItem: {
          value: function (p) {
            return this.updateCache(), this.childrenByName[p] || null;
          },
        },
        namedItems: {
          get: function () {
            return this.updateCache(), this.childrenByName;
          },
        },
        updateCache: {
          value: function () {
            var p =
              /^(a|applet|area|embed|form|frame|frameset|iframe|img|object)$/;
            if (this.lastModTime !== this.element.lastModTime) {
              this.lastModTime = this.element.lastModTime;
              for (
                var y =
                    (this.childrenByNumber && this.childrenByNumber.length) ||
                    0,
                  C = 0;
                C < y;
                C++
              )
                this[C] = void 0;
              (this.childrenByNumber = []),
                (this.childrenByName = Object.create(null));
              for (
                var R = this.element.firstChild;
                R !== null;
                R = R.nextSibling
              )
                if (R.nodeType === o.ELEMENT_NODE) {
                  (this[this.childrenByNumber.length] = R),
                    this.childrenByNumber.push(R);
                  var V = R.getAttribute("id");
                  V && !this.childrenByName[V] && (this.childrenByName[V] = R);
                  var Q = R.getAttribute("name");
                  Q &&
                    this.element.namespaceURI === i.HTML &&
                    p.test(this.element.localName) &&
                    !this.childrenByName[Q] &&
                    (this.childrenByName[V] = R);
                }
            }
          },
        },
      });
      function me(g) {
        return function (p) {
          return p.localName === g;
        };
      }
      function q(g) {
        var p = r.toASCIILowerCase(g);
        return p === g
          ? me(g)
          : function (y) {
              return y.isHTML ? y.localName === p : y.localName === g;
            };
      }
      function O(g) {
        return function (p) {
          return p.namespaceURI === g;
        };
      }
      function j(g, p) {
        return function (y) {
          return y.namespaceURI === g && y.localName === p;
        };
      }
      function Y(g) {
        return function (p) {
          return g.every(function (y) {
            return p.classList.contains(y);
          });
        };
      }
      function v(g) {
        return function (p) {
          return p.namespaceURI !== i.HTML ? !1 : p.getAttribute("name") === g;
        };
      }
    },
  }),
  Sb = oe({
    "external/npm/node_modules/domino/lib/Leaf.js"(t, e) {
      "use strict";
      e.exports = a;
      var n = ft(),
        r = Qi(),
        i = Xe(),
        s = i.HierarchyRequestError,
        o = i.NotFoundError;
      function a() {
        n.call(this);
      }
      a.prototype = Object.create(n.prototype, {
        hasChildNodes: {
          value: function () {
            return !1;
          },
        },
        firstChild: { value: null },
        lastChild: { value: null },
        insertBefore: {
          value: function (c, l) {
            if (!c.nodeType) throw new TypeError("not a node");
            s();
          },
        },
        replaceChild: {
          value: function (c, l) {
            if (!c.nodeType) throw new TypeError("not a node");
            s();
          },
        },
        removeChild: {
          value: function (c) {
            if (!c.nodeType) throw new TypeError("not a node");
            o();
          },
        },
        removeChildren: { value: function () {} },
        childNodes: {
          get: function () {
            return (
              this._childNodes || (this._childNodes = new r()), this._childNodes
            );
          },
        },
      });
    },
  }),
  Nl = oe({
    "external/npm/node_modules/domino/lib/CharacterData.js"(t, e) {
      "use strict";
      e.exports = o;
      var n = Sb(),
        r = Xe(),
        i = Ph(),
        s = _b();
      function o() {
        n.call(this);
      }
      (o.prototype = Object.create(n.prototype, {
        substringData: {
          value: function (c, l) {
            if (arguments.length < 2)
              throw new TypeError("Not enough arguments");
            return (
              (c = c >>> 0),
              (l = l >>> 0),
              (c > this.data.length || c < 0 || l < 0) && r.IndexSizeError(),
              this.data.substring(c, c + l)
            );
          },
        },
        appendData: {
          value: function (c) {
            if (arguments.length < 1)
              throw new TypeError("Not enough arguments");
            this.data += String(c);
          },
        },
        insertData: {
          value: function (c, l) {
            return this.replaceData(c, 0, l);
          },
        },
        deleteData: {
          value: function (c, l) {
            return this.replaceData(c, l, "");
          },
        },
        replaceData: {
          value: function (c, l, u) {
            var d = this.data,
              m = d.length;
            (c = c >>> 0),
              (l = l >>> 0),
              (u = String(u)),
              (c > m || c < 0) && r.IndexSizeError(),
              c + l > m && (l = m - c);
            var b = d.substring(0, c),
              I = d.substring(c + l);
            this.data = b + u + I;
          },
        },
        isEqual: {
          value: function (c) {
            return this._data === c._data;
          },
        },
        length: {
          get: function () {
            return this.data.length;
          },
        },
      })),
        Object.defineProperties(o.prototype, i),
        Object.defineProperties(o.prototype, s);
    },
  }),
  Cb = oe({
    "external/npm/node_modules/domino/lib/Text.js"(t, e) {
      "use strict";
      e.exports = s;
      var n = Xe(),
        r = ft(),
        i = Nl();
      function s(a, c) {
        i.call(this),
          (this.nodeType = r.TEXT_NODE),
          (this.ownerDocument = a),
          (this._data = c),
          (this._index = void 0);
      }
      var o = {
        get: function () {
          return this._data;
        },
        set: function (a) {
          a == null ? (a = "") : (a = String(a)),
            a !== this._data &&
              ((this._data = a),
              this.rooted && this.ownerDocument.mutateValue(this),
              this.parentNode &&
                this.parentNode._textchangehook &&
                this.parentNode._textchangehook(this));
        },
      };
      s.prototype = Object.create(i.prototype, {
        nodeName: { value: "#text" },
        nodeValue: o,
        textContent: o,
        innerText: o,
        data: {
          get: o.get,
          set: function (a) {
            o.set.call(this, a === null ? "" : String(a));
          },
        },
        splitText: {
          value: function (c) {
            (c > this._data.length || c < 0) && n.IndexSizeError();
            var l = this._data.substring(c),
              u = this.ownerDocument.createTextNode(l);
            this.data = this.data.substring(0, c);
            var d = this.parentNode;
            return d !== null && d.insertBefore(u, this.nextSibling), u;
          },
        },
        wholeText: {
          get: function () {
            for (
              var c = this.textContent, l = this.nextSibling;
              l && l.nodeType === r.TEXT_NODE;
              l = l.nextSibling
            )
              c += l.textContent;
            return c;
          },
        },
        replaceWholeText: { value: n.nyi },
        clone: {
          value: function () {
            return new s(this.ownerDocument, this._data);
          },
        },
      });
    },
  }),
  Ib = oe({
    "external/npm/node_modules/domino/lib/Comment.js"(t, e) {
      "use strict";
      e.exports = i;
      var n = ft(),
        r = Nl();
      function i(o, a) {
        r.call(this),
          (this.nodeType = n.COMMENT_NODE),
          (this.ownerDocument = o),
          (this._data = a);
      }
      var s = {
        get: function () {
          return this._data;
        },
        set: function (o) {
          o == null ? (o = "") : (o = String(o)),
            (this._data = o),
            this.rooted && this.ownerDocument.mutateValue(this);
        },
      };
      i.prototype = Object.create(r.prototype, {
        nodeName: { value: "#comment" },
        nodeValue: s,
        textContent: s,
        innerText: s,
        data: {
          get: s.get,
          set: function (o) {
            s.set.call(this, o === null ? "" : String(o));
          },
        },
        clone: {
          value: function () {
            return new i(this.ownerDocument, this._data);
          },
        },
      });
    },
  }),
  Mb = oe({
    "external/npm/node_modules/domino/lib/DocumentFragment.js"(t, e) {
      "use strict";
      e.exports = c;
      var n = ft(),
        r = Qi(),
        i = Oh(),
        s = vo(),
        o = Lh(),
        a = Xe();
      function c(l) {
        i.call(this),
          (this.nodeType = n.DOCUMENT_FRAGMENT_NODE),
          (this.ownerDocument = l);
      }
      c.prototype = Object.create(i.prototype, {
        nodeName: { value: "#document-fragment" },
        nodeValue: {
          get: function () {
            return null;
          },
          set: function () {},
        },
        textContent: Object.getOwnPropertyDescriptor(
          s.prototype,
          "textContent"
        ),
        innerText: Object.getOwnPropertyDescriptor(s.prototype, "innerText"),
        querySelector: {
          value: function (l) {
            var u = this.querySelectorAll(l);
            return u.length ? u[0] : null;
          },
        },
        querySelectorAll: {
          value: function (l) {
            var u = Object.create(this);
            (u.isHTML = !0),
              (u.getElementsByTagName = s.prototype.getElementsByTagName),
              (u.nextElement = Object.getOwnPropertyDescriptor(
                s.prototype,
                "firstElementChild"
              ).get);
            var d = o(l, u);
            return d.item ? d : new r(d);
          },
        },
        clone: {
          value: function () {
            return new c(this.ownerDocument);
          },
        },
        isEqual: {
          value: function (u) {
            return !0;
          },
        },
        innerHTML: {
          get: function () {
            return this.serialize();
          },
          set: a.nyi,
        },
        outerHTML: {
          get: function () {
            return this.serialize();
          },
          set: a.nyi,
        },
      });
    },
  }),
  Nb = oe({
    "external/npm/node_modules/domino/lib/ProcessingInstruction.js"(t, e) {
      "use strict";
      e.exports = i;
      var n = ft(),
        r = Nl();
      function i(o, a, c) {
        r.call(this),
          (this.nodeType = n.PROCESSING_INSTRUCTION_NODE),
          (this.ownerDocument = o),
          (this.target = a),
          (this._data = c);
      }
      var s = {
        get: function () {
          return this._data;
        },
        set: function (o) {
          o == null ? (o = "") : (o = String(o)),
            (this._data = o),
            this.rooted && this.ownerDocument.mutateValue(this);
        },
      };
      i.prototype = Object.create(r.prototype, {
        nodeName: {
          get: function () {
            return this.target;
          },
        },
        nodeValue: s,
        textContent: s,
        innerText: s,
        data: {
          get: s.get,
          set: function (o) {
            s.set.call(this, o === null ? "" : String(o));
          },
        },
        clone: {
          value: function () {
            return new i(this.ownerDocument, this.target, this._data);
          },
        },
        isEqual: {
          value: function (a) {
            return this.target === a.target && this._data === a._data;
          },
        },
      });
    },
  }),
  Al = oe({
    "external/npm/node_modules/domino/lib/NodeFilter.js"(t, e) {
      "use strict";
      var n = {
        FILTER_ACCEPT: 1,
        FILTER_REJECT: 2,
        FILTER_SKIP: 3,
        SHOW_ALL: 4294967295,
        SHOW_ELEMENT: 1,
        SHOW_ATTRIBUTE: 2,
        SHOW_TEXT: 4,
        SHOW_CDATA_SECTION: 8,
        SHOW_ENTITY_REFERENCE: 16,
        SHOW_ENTITY: 32,
        SHOW_PROCESSING_INSTRUCTION: 64,
        SHOW_COMMENT: 128,
        SHOW_DOCUMENT: 256,
        SHOW_DOCUMENT_TYPE: 512,
        SHOW_DOCUMENT_FRAGMENT: 1024,
        SHOW_NOTATION: 2048,
      };
      e.exports = n.constructor = n.prototype = n;
    },
  }),
  Ab = oe({
    "external/npm/node_modules/domino/lib/NodeTraversal.js"(t, e) {
      "use strict";
      var n = (e.exports = {
        nextSkippingChildren: r,
        nextAncestorSibling: i,
        next: s,
        previous: a,
        deepLastChild: o,
      });
      function r(c, l) {
        return c === l
          ? null
          : c.nextSibling !== null
          ? c.nextSibling
          : i(c, l);
      }
      function i(c, l) {
        for (c = c.parentNode; c !== null; c = c.parentNode) {
          if (c === l) return null;
          if (c.nextSibling !== null) return c.nextSibling;
        }
        return null;
      }
      function s(c, l) {
        var u;
        return (
          (u = c.firstChild),
          u !== null
            ? u
            : c === l
            ? null
            : ((u = c.nextSibling), u !== null ? u : i(c, l))
        );
      }
      function o(c) {
        for (; c.lastChild; ) c = c.lastChild;
        return c;
      }
      function a(c, l) {
        var u;
        return (
          (u = c.previousSibling),
          u !== null ? o(u) : ((u = c.parentNode), u === l ? null : u)
        );
      }
    },
  }),
  AN = oe({
    "external/npm/node_modules/domino/lib/TreeWalker.js"(t, e) {
      "use strict";
      e.exports = u;
      var n = ft(),
        r = Al(),
        i = Ab(),
        s = Xe(),
        o = {
          first: "firstChild",
          last: "lastChild",
          next: "firstChild",
          previous: "lastChild",
        },
        a = {
          first: "nextSibling",
          last: "previousSibling",
          next: "nextSibling",
          previous: "previousSibling",
        };
      function c(d, m) {
        var b, I, N, F, x;
        for (I = d._currentNode[o[m]]; I !== null; ) {
          if (((F = d._internalFilter(I)), F === r.FILTER_ACCEPT))
            return (d._currentNode = I), I;
          if (F === r.FILTER_SKIP && ((b = I[o[m]]), b !== null)) {
            I = b;
            continue;
          }
          for (; I !== null; ) {
            if (((x = I[a[m]]), x !== null)) {
              I = x;
              break;
            }
            if (
              ((N = I.parentNode),
              N === null || N === d.root || N === d._currentNode)
            )
              return null;
            I = N;
          }
        }
        return null;
      }
      function l(d, m) {
        var b, I, N;
        if (((b = d._currentNode), b === d.root)) return null;
        for (;;) {
          for (N = b[a[m]]; N !== null; ) {
            if (((b = N), (I = d._internalFilter(b)), I === r.FILTER_ACCEPT))
              return (d._currentNode = b), b;
            (N = b[o[m]]),
              (I === r.FILTER_REJECT || N === null) && (N = b[a[m]]);
          }
          if (
            ((b = b.parentNode),
            b === null ||
              b === d.root ||
              d._internalFilter(b) === r.FILTER_ACCEPT)
          )
            return null;
        }
      }
      function u(d, m, b) {
        (!d || !d.nodeType) && s.NotSupportedError(),
          (this._root = d),
          (this._whatToShow = Number(m) || 0),
          (this._filter = b || null),
          (this._active = !1),
          (this._currentNode = d);
      }
      Object.defineProperties(u.prototype, {
        root: {
          get: function () {
            return this._root;
          },
        },
        whatToShow: {
          get: function () {
            return this._whatToShow;
          },
        },
        filter: {
          get: function () {
            return this._filter;
          },
        },
        currentNode: {
          get: function () {
            return this._currentNode;
          },
          set: function (m) {
            if (!(m instanceof n)) throw new TypeError("Not a Node");
            this._currentNode = m;
          },
        },
        _internalFilter: {
          value: function (m) {
            var b, I;
            if (
              (this._active && s.InvalidStateError(),
              !((1 << (m.nodeType - 1)) & this._whatToShow))
            )
              return r.FILTER_SKIP;
            if (((I = this._filter), I === null)) b = r.FILTER_ACCEPT;
            else {
              this._active = !0;
              try {
                typeof I == "function" ? (b = I(m)) : (b = I.acceptNode(m));
              } finally {
                this._active = !1;
              }
            }
            return +b;
          },
        },
        parentNode: {
          value: function () {
            for (var m = this._currentNode; m !== this.root; ) {
              if (((m = m.parentNode), m === null)) return null;
              if (this._internalFilter(m) === r.FILTER_ACCEPT)
                return (this._currentNode = m), m;
            }
            return null;
          },
        },
        firstChild: {
          value: function () {
            return c(this, "first");
          },
        },
        lastChild: {
          value: function () {
            return c(this, "last");
          },
        },
        previousSibling: {
          value: function () {
            return l(this, "previous");
          },
        },
        nextSibling: {
          value: function () {
            return l(this, "next");
          },
        },
        previousNode: {
          value: function () {
            var m, b, I, N;
            for (m = this._currentNode; m !== this._root; ) {
              for (I = m.previousSibling; I; I = m.previousSibling)
                if (
                  ((m = I),
                  (b = this._internalFilter(m)),
                  b !== r.FILTER_REJECT)
                ) {
                  for (
                    N = m.lastChild;
                    N &&
                    ((m = N),
                    (b = this._internalFilter(m)),
                    b !== r.FILTER_REJECT);
                    N = m.lastChild
                  );
                  if (b === r.FILTER_ACCEPT) return (this._currentNode = m), m;
                }
              if (m === this.root || m.parentNode === null) return null;
              if (
                ((m = m.parentNode),
                this._internalFilter(m) === r.FILTER_ACCEPT)
              )
                return (this._currentNode = m), m;
            }
            return null;
          },
        },
        nextNode: {
          value: function () {
            var m, b, I, N;
            (m = this._currentNode), (b = r.FILTER_ACCEPT);
            e: for (;;) {
              for (I = m.firstChild; I; I = m.firstChild) {
                if (
                  ((m = I),
                  (b = this._internalFilter(m)),
                  b === r.FILTER_ACCEPT)
                )
                  return (this._currentNode = m), m;
                if (b === r.FILTER_REJECT) break;
              }
              for (
                N = i.nextSkippingChildren(m, this.root);
                N;
                N = i.nextSkippingChildren(m, this.root)
              ) {
                if (
                  ((m = N),
                  (b = this._internalFilter(m)),
                  b === r.FILTER_ACCEPT)
                )
                  return (this._currentNode = m), m;
                if (b === r.FILTER_SKIP) continue e;
              }
              return null;
            }
          },
        },
        toString: {
          value: function () {
            return "[object TreeWalker]";
          },
        },
      });
    },
  }),
  xN = oe({
    "external/npm/node_modules/domino/lib/NodeIterator.js"(t, e) {
      "use strict";
      e.exports = c;
      var n = Al(),
        r = Ab(),
        i = Xe();
      function s(l, u, d) {
        return d ? r.next(l, u) : l === u ? null : r.previous(l, null);
      }
      function o(l, u) {
        for (; u; u = u.parentNode) if (l === u) return !0;
        return !1;
      }
      function a(l, u) {
        var d, m;
        for (d = l._referenceNode, m = l._pointerBeforeReferenceNode; ; ) {
          if (m === u) m = !m;
          else if (((d = s(d, l._root, u)), d === null)) return null;
          var b = l._internalFilter(d);
          if (b === n.FILTER_ACCEPT) break;
        }
        return (l._referenceNode = d), (l._pointerBeforeReferenceNode = m), d;
      }
      function c(l, u, d) {
        (!l || !l.nodeType) && i.NotSupportedError(),
          (this._root = l),
          (this._referenceNode = l),
          (this._pointerBeforeReferenceNode = !0),
          (this._whatToShow = Number(u) || 0),
          (this._filter = d || null),
          (this._active = !1),
          l.doc._attachNodeIterator(this);
      }
      Object.defineProperties(c.prototype, {
        root: {
          get: function () {
            return this._root;
          },
        },
        referenceNode: {
          get: function () {
            return this._referenceNode;
          },
        },
        pointerBeforeReferenceNode: {
          get: function () {
            return this._pointerBeforeReferenceNode;
          },
        },
        whatToShow: {
          get: function () {
            return this._whatToShow;
          },
        },
        filter: {
          get: function () {
            return this._filter;
          },
        },
        _internalFilter: {
          value: function (u) {
            var d, m;
            if (
              (this._active && i.InvalidStateError(),
              !((1 << (u.nodeType - 1)) & this._whatToShow))
            )
              return n.FILTER_SKIP;
            if (((m = this._filter), m === null)) d = n.FILTER_ACCEPT;
            else {
              this._active = !0;
              try {
                typeof m == "function" ? (d = m(u)) : (d = m.acceptNode(u));
              } finally {
                this._active = !1;
              }
            }
            return +d;
          },
        },
        _preremove: {
          value: function (u) {
            if (!o(u, this._root) && o(u, this._referenceNode)) {
              if (this._pointerBeforeReferenceNode) {
                for (var d = u; d.lastChild; ) d = d.lastChild;
                if (((d = r.next(d, this.root)), d)) {
                  this._referenceNode = d;
                  return;
                }
                this._pointerBeforeReferenceNode = !1;
              }
              if (u.previousSibling === null)
                this._referenceNode = u.parentNode;
              else {
                this._referenceNode = u.previousSibling;
                var m;
                for (
                  m = this._referenceNode.lastChild;
                  m;
                  m = this._referenceNode.lastChild
                )
                  this._referenceNode = m;
              }
            }
          },
        },
        nextNode: {
          value: function () {
            return a(this, !0);
          },
        },
        previousNode: {
          value: function () {
            return a(this, !1);
          },
        },
        detach: { value: function () {} },
        toString: {
          value: function () {
            return "[object NodeIterator]";
          },
        },
      });
    },
  }),
  Fh = oe({
    "external/npm/node_modules/domino/lib/URL.js"(t, e) {
      "use strict";
      e.exports = n;
      function n(r) {
        if (!r) return Object.create(n.prototype);
        this.url = r.replace(/^[ \t\n\r\f]+|[ \t\n\r\f]+$/g, "");
        var i = n.pattern.exec(this.url);
        if (i) {
          if ((i[2] && (this.scheme = i[2]), i[4])) {
            var s = i[4].match(n.userinfoPattern);
            if (
              (s &&
                ((this.username = s[1]),
                (this.password = s[3]),
                (i[4] = i[4].substring(s[0].length))),
              i[4].match(n.portPattern))
            ) {
              var o = i[4].lastIndexOf(":");
              (this.host = i[4].substring(0, o)),
                (this.port = i[4].substring(o + 1));
            } else this.host = i[4];
          }
          i[5] && (this.path = i[5]),
            i[6] && (this.query = i[7]),
            i[8] && (this.fragment = i[9]);
        }
      }
      (n.pattern =
        /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/),
        (n.userinfoPattern = /^([^@:]*)(:([^@]*))?@/),
        (n.portPattern = /:\d+$/),
        (n.authorityPattern = /^[^:\/?#]+:\/\//),
        (n.hierarchyPattern = /^[^:\/?#]+:\//),
        (n.percentEncode = function (i) {
          var s = i.charCodeAt(0);
          if (s < 256) return "%" + s.toString(16);
          throw Error("can't percent-encode codepoints > 255 yet");
        }),
        (n.prototype = {
          constructor: n,
          isAbsolute: function () {
            return !!this.scheme;
          },
          isAuthorityBased: function () {
            return n.authorityPattern.test(this.url);
          },
          isHierarchical: function () {
            return n.hierarchyPattern.test(this.url);
          },
          toString: function () {
            var r = "";
            return (
              this.scheme !== void 0 && (r += this.scheme + ":"),
              this.isAbsolute() &&
                ((r += "//"),
                (this.username || this.password) &&
                  ((r += this.username || ""),
                  this.password && (r += ":" + this.password),
                  (r += "@")),
                this.host && (r += this.host)),
              this.port !== void 0 && (r += ":" + this.port),
              this.path !== void 0 && (r += this.path),
              this.query !== void 0 && (r += "?" + this.query),
              this.fragment !== void 0 && (r += "#" + this.fragment),
              r
            );
          },
          resolve: function (r) {
            var i = this,
              s = new n(r),
              o = new n();
            return (
              s.scheme !== void 0
                ? ((o.scheme = s.scheme),
                  (o.username = s.username),
                  (o.password = s.password),
                  (o.host = s.host),
                  (o.port = s.port),
                  (o.path = c(s.path)),
                  (o.query = s.query))
                : ((o.scheme = i.scheme),
                  s.host !== void 0
                    ? ((o.username = s.username),
                      (o.password = s.password),
                      (o.host = s.host),
                      (o.port = s.port),
                      (o.path = c(s.path)),
                      (o.query = s.query))
                    : ((o.username = i.username),
                      (o.password = i.password),
                      (o.host = i.host),
                      (o.port = i.port),
                      s.path
                        ? (s.path.charAt(0) === "/"
                            ? (o.path = c(s.path))
                            : ((o.path = a(i.path, s.path)),
                              (o.path = c(o.path))),
                          (o.query = s.query))
                        : ((o.path = i.path),
                          s.query !== void 0
                            ? (o.query = s.query)
                            : (o.query = i.query)))),
              (o.fragment = s.fragment),
              o.toString()
            );
            function a(l, u) {
              if (i.host !== void 0 && !i.path) return "/" + u;
              var d = l.lastIndexOf("/");
              return d === -1 ? u : l.substring(0, d + 1) + u;
            }
            function c(l) {
              if (!l) return l;
              for (var u = ""; l.length > 0; ) {
                if (l === "." || l === "..") {
                  l = "";
                  break;
                }
                var d = l.substring(0, 2),
                  m = l.substring(0, 3),
                  b = l.substring(0, 4);
                if (m === "../") l = l.substring(3);
                else if (d === "./") l = l.substring(2);
                else if (m === "/./") l = "/" + l.substring(3);
                else if (d === "/." && l.length === 2) l = "/";
                else if (b === "/../" || (m === "/.." && l.length === 3))
                  (l = "/" + l.substring(4)), (u = u.replace(/\/?[^\/]*$/, ""));
                else {
                  var I = l.match(/(\/?([^\/]*))/)[0];
                  (u += I), (l = l.substring(I.length));
                }
              }
              return u;
            }
          },
        });
    },
  }),
  RN = oe({
    "external/npm/node_modules/domino/lib/CustomEvent.js"(t, e) {
      "use strict";
      e.exports = r;
      var n = yo();
      function r(i, s) {
        n.call(this, i, s);
      }
      r.prototype = Object.create(n.prototype, { constructor: { value: r } });
    },
  }),
  xb = oe({
    "external/npm/node_modules/domino/lib/events.js"(t, e) {
      "use strict";
      e.exports = {
        Event: yo(),
        UIEvent: gb(),
        MouseEvent: yb(),
        CustomEvent: RN(),
      };
    },
  }),
  ON = oe({
    "external/npm/node_modules/domino/lib/style_parser.js"(t) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.hyphenate = t.parse = void 0);
      function e(r) {
        let i = [],
          s = 0,
          o = 0,
          a = 0,
          c = 0,
          l = 0,
          u = null;
        for (; s < r.length; )
          switch (r.charCodeAt(s++)) {
            case 40:
              o++;
              break;
            case 41:
              o--;
              break;
            case 39:
              a === 0
                ? (a = 39)
                : a === 39 && r.charCodeAt(s - 1) !== 92 && (a = 0);
              break;
            case 34:
              a === 0
                ? (a = 34)
                : a === 34 && r.charCodeAt(s - 1) !== 92 && (a = 0);
              break;
            case 58:
              !u &&
                o === 0 &&
                a === 0 &&
                ((u = n(r.substring(l, s - 1).trim())), (c = s));
              break;
            case 59:
              if (u && c > 0 && o === 0 && a === 0) {
                let m = r.substring(c, s - 1).trim();
                i.push(u, m), (l = s), (c = 0), (u = null);
              }
              break;
          }
        if (u && c) {
          let d = r.slice(c).trim();
          i.push(u, d);
        }
        return i;
      }
      t.parse = e;
      function n(r) {
        return r
          .replace(/[a-z][A-Z]/g, (i) => i.charAt(0) + "-" + i.charAt(1))
          .toLowerCase();
      }
      t.hyphenate = n;
    },
  }),
  jh = oe({
    "external/npm/node_modules/domino/lib/CSSStyleDeclaration.js"(t, e) {
      "use strict";
      var { parse: n } = ON();
      e.exports = function (c) {
        let l = new i(c),
          u = {
            get: function (d, m) {
              return m in d ? d[m] : d.getPropertyValue(r(m));
            },
            has: function (d, m) {
              return !0;
            },
            set: function (d, m, b) {
              return m in d ? (d[m] = b) : d.setProperty(r(m), b ?? void 0), !0;
            },
          };
        return new Proxy(l, u);
      };
      function r(c) {
        return c.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      }
      function i(c) {
        this._element = c;
      }
      var s = "!important";
      function o(c) {
        let l = { property: {}, priority: {} };
        if (!c) return l;
        let u = n(c);
        if (u.length < 2) return l;
        for (let d = 0; d < u.length; d += 2) {
          let m = u[d],
            b = u[d + 1];
          b.endsWith(s) &&
            ((l.priority[m] = "important"), (b = b.slice(0, -s.length).trim())),
            (l.property[m] = b);
        }
        return l;
      }
      var a = {};
      i.prototype = Object.create(Object.prototype, {
        _parsed: {
          get: function () {
            if (!this._parsedStyles || this.cssText !== this._lastParsedText) {
              var c = this.cssText;
              (this._parsedStyles = o(c)),
                (this._lastParsedText = c),
                delete this._names;
            }
            return this._parsedStyles;
          },
        },
        _serialize: {
          value: function () {
            var c = this._parsed,
              l = "";
            for (var u in c.property)
              l && (l += " "),
                (l += u + ": " + c.property[u]),
                c.priority[u] && (l += " !" + c.priority[u]),
                (l += ";");
            (this.cssText = l), (this._lastParsedText = l), delete this._names;
          },
        },
        cssText: {
          get: function () {
            return this._element.getAttribute("style");
          },
          set: function (c) {
            this._element.setAttribute("style", c);
          },
        },
        length: {
          get: function () {
            return (
              this._names ||
                (this._names = Object.getOwnPropertyNames(
                  this._parsed.property
                )),
              this._names.length
            );
          },
        },
        item: {
          value: function (c) {
            return (
              this._names ||
                (this._names = Object.getOwnPropertyNames(
                  this._parsed.property
                )),
              this._names[c]
            );
          },
        },
        getPropertyValue: {
          value: function (c) {
            return (c = c.toLowerCase()), this._parsed.property[c] || "";
          },
        },
        getPropertyPriority: {
          value: function (c) {
            return (c = c.toLowerCase()), this._parsed.priority[c] || "";
          },
        },
        setProperty: {
          value: function (c, l, u) {
            if (
              ((c = c.toLowerCase()),
              l == null && (l = ""),
              u == null && (u = ""),
              l !== a && (l = "" + l),
              (l = l.trim()),
              l === "")
            ) {
              this.removeProperty(c);
              return;
            }
            if (!(u !== "" && u !== a && !/^important$/i.test(u))) {
              var d = this._parsed;
              if (l === a) {
                if (!d.property[c]) return;
                u !== "" ? (d.priority[c] = "important") : delete d.priority[c];
              } else {
                if (l.indexOf(";") !== -1) return;
                var m = o(c + ":" + l);
                if (
                  Object.getOwnPropertyNames(m.property).length === 0 ||
                  Object.getOwnPropertyNames(m.priority).length !== 0
                )
                  return;
                for (var b in m.property)
                  (d.property[b] = m.property[b]),
                    u !== a &&
                      (u !== ""
                        ? (d.priority[b] = "important")
                        : d.priority[b] && delete d.priority[b]);
              }
              this._serialize();
            }
          },
        },
        setPropertyValue: {
          value: function (c, l) {
            return this.setProperty(c, l, a);
          },
        },
        setPropertyPriority: {
          value: function (c, l) {
            return this.setProperty(c, a, l);
          },
        },
        removeProperty: {
          value: function (c) {
            c = c.toLowerCase();
            var l = this._parsed;
            c in l.property &&
              (delete l.property[c], delete l.priority[c], this._serialize());
          },
        },
      });
    },
  }),
  Rb = oe({
    "external/npm/node_modules/domino/lib/URLUtils.js"(t, e) {
      "use strict";
      var n = Fh();
      e.exports = r;
      function r() {}
      (r.prototype = Object.create(Object.prototype, {
        _url: {
          get: function () {
            return new n(this.href);
          },
        },
        protocol: {
          get: function () {
            var i = this._url;
            return i && i.scheme ? i.scheme + ":" : ":";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              ((i = i.replace(/:+$/, "")),
              (i = i.replace(/[^-+\.a-zA-Z0-9]/g, n.percentEncode)),
              i.length > 0 && ((o.scheme = i), (s = o.toString()))),
              (this.href = s);
          },
        },
        host: {
          get: function () {
            var i = this._url;
            return i.isAbsolute() && i.isAuthorityBased()
              ? i.host + (i.port ? ":" + i.port : "")
              : "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              o.isAuthorityBased() &&
              ((i = i.replace(
                /[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g,
                n.percentEncode
              )),
              i.length > 0 &&
                ((o.host = i), delete o.port, (s = o.toString()))),
              (this.href = s);
          },
        },
        hostname: {
          get: function () {
            var i = this._url;
            return i.isAbsolute() && i.isAuthorityBased() ? i.host : "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              o.isAuthorityBased() &&
              ((i = i.replace(/^\/+/, "")),
              (i = i.replace(
                /[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g,
                n.percentEncode
              )),
              i.length > 0 && ((o.host = i), (s = o.toString()))),
              (this.href = s);
          },
        },
        port: {
          get: function () {
            var i = this._url;
            return i.isAbsolute() && i.isAuthorityBased() && i.port !== void 0
              ? i.port
              : "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              o.isAuthorityBased() &&
              ((i = "" + i),
              (i = i.replace(/[^0-9].*$/, "")),
              (i = i.replace(/^0+/, "")),
              i.length === 0 && (i = "0"),
              parseInt(i, 10) <= 65535 && ((o.port = i), (s = o.toString()))),
              (this.href = s);
          },
        },
        pathname: {
          get: function () {
            var i = this._url;
            return i.isAbsolute() && i.isHierarchical() ? i.path : "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              o.isHierarchical() &&
              (i.charAt(0) !== "/" && (i = "/" + i),
              (i = i.replace(
                /[^-+\._~!$&'()*,;:=@\/a-zA-Z0-9]/g,
                n.percentEncode
              )),
              (o.path = i),
              (s = o.toString())),
              (this.href = s);
          },
        },
        search: {
          get: function () {
            var i = this._url;
            return i.isAbsolute() && i.isHierarchical() && i.query !== void 0
              ? "?" + i.query
              : "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              o.isHierarchical() &&
              (i.charAt(0) === "?" && (i = i.substring(1)),
              (i = i.replace(
                /[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g,
                n.percentEncode
              )),
              (o.query = i),
              (s = o.toString())),
              (this.href = s);
          },
        },
        hash: {
          get: function () {
            var i = this._url;
            return i == null || i.fragment == null || i.fragment === ""
              ? ""
              : "#" + i.fragment;
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            i.charAt(0) === "#" && (i = i.substring(1)),
              (i = i.replace(
                /[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g,
                n.percentEncode
              )),
              (o.fragment = i),
              (s = o.toString()),
              (this.href = s);
          },
        },
        username: {
          get: function () {
            var i = this._url;
            return i.username || "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              ((i = i.replace(
                /[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\:]/g,
                n.percentEncode
              )),
              (o.username = i),
              (s = o.toString())),
              (this.href = s);
          },
        },
        password: {
          get: function () {
            var i = this._url;
            return i.password || "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              (i === ""
                ? (o.password = null)
                : ((i = i.replace(
                    /[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\]/g,
                    n.percentEncode
                  )),
                  (o.password = i)),
              (s = o.toString())),
              (this.href = s);
          },
        },
        origin: {
          get: function () {
            var i = this._url;
            if (i == null) return "";
            var s = function (o) {
              var a = [i.scheme, i.host, +i.port || o];
              return a[0] + "://" + a[1] + (a[2] === o ? "" : ":" + a[2]);
            };
            switch (i.scheme) {
              case "ftp":
                return s(21);
              case "gopher":
                return s(70);
              case "http":
              case "ws":
                return s(80);
              case "https":
              case "wss":
                return s(443);
              default:
                return i.scheme + "://";
            }
          },
        },
      })),
        (r._inherit = function (i) {
          Object.getOwnPropertyNames(r.prototype).forEach(function (s) {
            if (!(s === "constructor" || s === "href")) {
              var o = Object.getOwnPropertyDescriptor(r.prototype, s);
              Object.defineProperty(i, s, o);
            }
          });
        });
    },
  }),
  Ob = oe({
    "external/npm/node_modules/domino/lib/defineElement.js"(t, e) {
      "use strict";
      var n = wb(),
        r = Rh().isApiWritable;
      e.exports = function (a, c, l, u) {
        var d = a.ctor;
        if (d) {
          var m = a.props || {};
          if (a.attributes)
            for (var b in a.attributes) {
              var I = a.attributes[b];
              (typeof I != "object" || Array.isArray(I)) && (I = { type: I }),
                I.name || (I.name = b.toLowerCase()),
                (m[b] = n.property(I));
            }
          (m.constructor = { value: d, writable: r }),
            (d.prototype = Object.create((a.superclass || c).prototype, m)),
            a.events && o(d, a.events),
            (l[a.name] = d);
        } else d = c;
        return (
          (a.tags || (a.tag && [a.tag]) || []).forEach(function (N) {
            u[N] = d;
          }),
          d
        );
      };
      function i(a, c, l, u) {
        (this.body = a),
          (this.document = c),
          (this.form = l),
          (this.element = u);
      }
      i.prototype.build = function () {
        return () => {};
      };
      function s(a, c, l, u) {
        var d = a.ownerDocument || Object.create(null),
          m = a.form || Object.create(null);
        a[c] = new i(u, d, m, a).build();
      }
      function o(a, c) {
        var l = a.prototype;
        c.forEach(function (u) {
          Object.defineProperty(l, "on" + u, {
            get: function () {
              return this._getEventHandler(u);
            },
            set: function (d) {
              this._setEventHandler(u, d);
            },
          }),
            n.registerChangeHandler(a, "on" + u, s);
        });
      }
    },
  }),
  Hh = oe({
    "external/npm/node_modules/domino/lib/htmlelts.js"(t) {
      "use strict";
      var e = ft(),
        n = vo(),
        r = jh(),
        i = Xe(),
        s = Rb(),
        o = Ob(),
        a = (t.elements = {}),
        c = Object.create(null);
      t.createElement = function (_, w, T) {
        var E = c[w] || F;
        return new E(_, w, T);
      };
      function l(_) {
        return o(_, N, a, c);
      }
      function u(_) {
        return {
          get: function () {
            var w = this._getattr(_);
            if (w === null) return "";
            var T = this.doc._resolve(w);
            return T === null ? w : T;
          },
          set: function (w) {
            this._setattr(_, w);
          },
        };
      }
      function d(_) {
        return {
          get: function () {
            var w = this._getattr(_);
            return w === null
              ? null
              : w.toLowerCase() === "use-credentials"
              ? "use-credentials"
              : "anonymous";
          },
          set: function (w) {
            w == null ? this.removeAttribute(_) : this._setattr(_, w);
          },
        };
      }
      var m = {
          type: [
            "",
            "no-referrer",
            "no-referrer-when-downgrade",
            "same-origin",
            "origin",
            "strict-origin",
            "origin-when-cross-origin",
            "strict-origin-when-cross-origin",
            "unsafe-url",
          ],
          missing: "",
        },
        b = {
          A: !0,
          LINK: !0,
          BUTTON: !0,
          INPUT: !0,
          SELECT: !0,
          TEXTAREA: !0,
          COMMAND: !0,
        },
        I = function (_, w, T) {
          N.call(this, _, w, T), (this._form = null);
        },
        N = (t.HTMLElement = l({
          superclass: n,
          name: "HTMLElement",
          ctor: function (w, T, E) {
            n.call(this, w, T, i.NAMESPACE.HTML, E);
          },
          props: {
            dangerouslySetInnerHTML: {
              set: function (_) {
                this._innerHTML = _;
              },
            },
            innerHTML: {
              get: function () {
                return this.serialize();
              },
              set: function (_) {
                var w = this.ownerDocument.implementation.mozHTMLParser(
                  this.ownerDocument._address,
                  this
                );
                w.parse(_ === null ? "" : String(_), !0);
                for (
                  var T = this instanceof c.template ? this.content : this;
                  T.hasChildNodes();

                )
                  T.removeChild(T.firstChild);
                T.appendChild(w._asDocumentFragment());
              },
            },
            style: {
              get: function () {
                return this._style || (this._style = new r(this)), this._style;
              },
              set: function (_) {
                _ == null && (_ = ""), this._setattr("style", String(_));
              },
            },
            blur: { value: function () {} },
            focus: { value: function () {} },
            forceSpellCheck: { value: function () {} },
            click: {
              value: function () {
                if (!this._click_in_progress) {
                  this._click_in_progress = !0;
                  try {
                    this._pre_click_activation_steps &&
                      this._pre_click_activation_steps();
                    var _ = this.ownerDocument.createEvent("MouseEvent");
                    _.initMouseEvent(
                      "click",
                      !0,
                      !0,
                      this.ownerDocument.defaultView,
                      1,
                      0,
                      0,
                      0,
                      0,
                      !1,
                      !1,
                      !1,
                      !1,
                      0,
                      null
                    );
                    var w = this.dispatchEvent(_);
                    w
                      ? this._post_click_activation_steps &&
                        this._post_click_activation_steps(_)
                      : this._cancelled_activation_steps &&
                        this._cancelled_activation_steps();
                  } finally {
                    this._click_in_progress = !1;
                  }
                }
              },
            },
            submit: { value: i.nyi },
          },
          attributes: {
            title: String,
            lang: String,
            dir: { type: ["ltr", "rtl", "auto"], missing: "" },
            draggable: { type: ["true", "false"], treatNullAsEmptyString: !0 },
            spellcheck: { type: ["true", "false"], missing: "" },
            enterKeyHint: {
              type: [
                "enter",
                "done",
                "go",
                "next",
                "previous",
                "search",
                "send",
              ],
              missing: "",
            },
            autoCapitalize: {
              type: ["off", "on", "none", "sentences", "words", "characters"],
              missing: "",
            },
            autoFocus: Boolean,
            accessKey: String,
            nonce: String,
            hidden: Boolean,
            translate: { type: ["no", "yes"], missing: "" },
            tabIndex: {
              type: "long",
              default: function () {
                return this.tagName in b || this.contentEditable ? 0 : -1;
              },
            },
          },
          events: [
            "abort",
            "canplay",
            "canplaythrough",
            "change",
            "click",
            "contextmenu",
            "cuechange",
            "dblclick",
            "drag",
            "dragend",
            "dragenter",
            "dragleave",
            "dragover",
            "dragstart",
            "drop",
            "durationchange",
            "emptied",
            "ended",
            "input",
            "invalid",
            "keydown",
            "keypress",
            "keyup",
            "loadeddata",
            "loadedmetadata",
            "loadstart",
            "mousedown",
            "mousemove",
            "mouseout",
            "mouseover",
            "mouseup",
            "mousewheel",
            "pause",
            "play",
            "playing",
            "progress",
            "ratechange",
            "readystatechange",
            "reset",
            "seeked",
            "seeking",
            "select",
            "show",
            "stalled",
            "submit",
            "suspend",
            "timeupdate",
            "volumechange",
            "waiting",
            "blur",
            "error",
            "focus",
            "load",
            "scroll",
          ],
        })),
        F = l({
          name: "HTMLUnknownElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
        }),
        x = {
          form: {
            get: function () {
              return this._form;
            },
          },
        };
      l({
        tag: "a",
        name: "HTMLAnchorElement",
        ctor: function (w, T, E) {
          N.call(this, w, T, E);
        },
        props: {
          _post_click_activation_steps: {
            value: function (_) {
              this.href &&
                (this.ownerDocument.defaultView.location = this.href);
            },
          },
        },
        attributes: {
          href: u,
          ping: String,
          download: String,
          target: String,
          rel: String,
          media: String,
          hreflang: String,
          type: String,
          referrerPolicy: m,
          coords: String,
          charset: String,
          name: String,
          rev: String,
          shape: String,
        },
      }),
        s._inherit(c.a.prototype),
        l({
          tag: "area",
          name: "HTMLAreaElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: {
            alt: String,
            target: String,
            download: String,
            rel: String,
            media: String,
            href: u,
            hreflang: String,
            type: String,
            shape: String,
            coords: String,
            ping: String,
            referrerPolicy: m,
            noHref: Boolean,
          },
        }),
        s._inherit(c.area.prototype),
        l({
          tag: "br",
          name: "HTMLBRElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: { clear: String },
        }),
        l({
          tag: "base",
          name: "HTMLBaseElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: { target: String },
        }),
        l({
          tag: "body",
          name: "HTMLBodyElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          events: [
            "afterprint",
            "beforeprint",
            "beforeunload",
            "blur",
            "error",
            "focus",
            "hashchange",
            "load",
            "message",
            "offline",
            "online",
            "pagehide",
            "pageshow",
            "popstate",
            "resize",
            "scroll",
            "storage",
            "unload",
          ],
          attributes: {
            text: { type: String, treatNullAsEmptyString: !0 },
            link: { type: String, treatNullAsEmptyString: !0 },
            vLink: { type: String, treatNullAsEmptyString: !0 },
            aLink: { type: String, treatNullAsEmptyString: !0 },
            bgColor: { type: String, treatNullAsEmptyString: !0 },
            background: String,
          },
        }),
        l({
          tag: "button",
          name: "HTMLButtonElement",
          ctor: function (w, T, E) {
            I.call(this, w, T, E);
          },
          props: x,
          attributes: {
            name: String,
            value: String,
            disabled: Boolean,
            autofocus: Boolean,
            type: {
              type: ["submit", "reset", "button", "menu"],
              missing: "submit",
            },
            formTarget: String,
            formAction: u,
            formNoValidate: Boolean,
            formMethod: {
              type: ["get", "post", "dialog"],
              invalid: "get",
              missing: "",
            },
            formEnctype: {
              type: [
                "application/x-www-form-urlencoded",
                "multipart/form-data",
                "text/plain",
              ],
              invalid: "application/x-www-form-urlencoded",
              missing: "",
            },
          },
        }),
        l({
          tag: "dl",
          name: "HTMLDListElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: { compact: Boolean },
        }),
        l({
          tag: "data",
          name: "HTMLDataElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: { value: String },
        }),
        l({
          tag: "datalist",
          name: "HTMLDataListElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
        }),
        l({
          tag: "details",
          name: "HTMLDetailsElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: { open: Boolean },
        }),
        l({
          tag: "div",
          name: "HTMLDivElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: { align: String },
        }),
        l({
          tag: "embed",
          name: "HTMLEmbedElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: {
            src: u,
            type: String,
            width: String,
            height: String,
            align: String,
            name: String,
          },
        }),
        l({
          tag: "fieldset",
          name: "HTMLFieldSetElement",
          ctor: function (w, T, E) {
            I.call(this, w, T, E);
          },
          props: x,
          attributes: { disabled: Boolean, name: String },
        }),
        l({
          tag: "form",
          name: "HTMLFormElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: {
            action: String,
            autocomplete: { type: ["on", "off"], missing: "on" },
            name: String,
            acceptCharset: { name: "accept-charset" },
            target: String,
            noValidate: Boolean,
            method: {
              type: ["get", "post", "dialog"],
              invalid: "get",
              missing: "get",
            },
            enctype: {
              type: [
                "application/x-www-form-urlencoded",
                "multipart/form-data",
                "text/plain",
              ],
              invalid: "application/x-www-form-urlencoded",
              missing: "application/x-www-form-urlencoded",
            },
            encoding: {
              name: "enctype",
              type: [
                "application/x-www-form-urlencoded",
                "multipart/form-data",
                "text/plain",
              ],
              invalid: "application/x-www-form-urlencoded",
              missing: "application/x-www-form-urlencoded",
            },
          },
        }),
        l({
          tag: "hr",
          name: "HTMLHRElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: {
            align: String,
            color: String,
            noShade: Boolean,
            size: String,
            width: String,
          },
        }),
        l({
          tag: "head",
          name: "HTMLHeadElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
        }),
        l({
          tags: ["h1", "h2", "h3", "h4", "h5", "h6"],
          name: "HTMLHeadingElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: { align: String },
        }),
        l({
          tag: "html",
          name: "HTMLHtmlElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: { xmlns: u, version: String },
        }),
        l({
          tag: "iframe",
          name: "HTMLIFrameElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: {
            src: u,
            srcdoc: String,
            name: String,
            width: String,
            height: String,
            seamless: Boolean,
            allow: Boolean,
            allowFullscreen: Boolean,
            allowUserMedia: Boolean,
            allowPaymentRequest: Boolean,
            referrerPolicy: m,
            loading: { type: ["eager", "lazy"], treatNullAsEmptyString: !0 },
            align: String,
            scrolling: String,
            frameBorder: String,
            longDesc: u,
            marginHeight: { type: String, treatNullAsEmptyString: !0 },
            marginWidth: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        l({
          tag: "img",
          name: "HTMLImageElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: {
            alt: String,
            src: u,
            srcset: String,
            crossOrigin: d,
            useMap: String,
            isMap: Boolean,
            sizes: String,
            height: { type: "unsigned long", default: 0 },
            width: { type: "unsigned long", default: 0 },
            referrerPolicy: m,
            loading: { type: ["eager", "lazy"], missing: "" },
            name: String,
            lowsrc: u,
            align: String,
            hspace: { type: "unsigned long", default: 0 },
            vspace: { type: "unsigned long", default: 0 },
            longDesc: u,
            border: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        l({
          tag: "input",
          name: "HTMLInputElement",
          ctor: function (w, T, E) {
            I.call(this, w, T, E);
          },
          props: {
            form: x.form,
            _post_click_activation_steps: {
              value: function (_) {
                if (this.type === "checkbox") this.checked = !this.checked;
                else if (this.type === "radio")
                  for (
                    var w = this.form.getElementsByName(this.name),
                      T = w.length - 1;
                    T >= 0;
                    T--
                  ) {
                    var E = w[T];
                    E.checked = E === this;
                  }
              },
            },
          },
          attributes: {
            name: String,
            disabled: Boolean,
            autofocus: Boolean,
            accept: String,
            alt: String,
            max: String,
            min: String,
            pattern: String,
            placeholder: String,
            step: String,
            dirName: String,
            defaultValue: { name: "value" },
            multiple: Boolean,
            required: Boolean,
            readOnly: Boolean,
            checked: Boolean,
            value: String,
            src: u,
            defaultChecked: { name: "checked", type: Boolean },
            size: { type: "unsigned long", default: 20, min: 1, setmin: 1 },
            width: { type: "unsigned long", min: 0, setmin: 0, default: 0 },
            height: { type: "unsigned long", min: 0, setmin: 0, default: 0 },
            minLength: {
              type: "unsigned long",
              min: 0,
              setmin: 0,
              default: -1,
            },
            maxLength: {
              type: "unsigned long",
              min: 0,
              setmin: 0,
              default: -1,
            },
            autocomplete: String,
            type: {
              type: [
                "text",
                "hidden",
                "search",
                "tel",
                "url",
                "email",
                "password",
                "datetime",
                "date",
                "month",
                "week",
                "time",
                "datetime-local",
                "number",
                "range",
                "color",
                "checkbox",
                "radio",
                "file",
                "submit",
                "image",
                "reset",
                "button",
              ],
              missing: "text",
            },
            formTarget: String,
            formNoValidate: Boolean,
            formMethod: { type: ["get", "post"], invalid: "get", missing: "" },
            formEnctype: {
              type: [
                "application/x-www-form-urlencoded",
                "multipart/form-data",
                "text/plain",
              ],
              invalid: "application/x-www-form-urlencoded",
              missing: "",
            },
            inputMode: {
              type: [
                "verbatim",
                "latin",
                "latin-name",
                "latin-prose",
                "full-width-latin",
                "kana",
                "kana-name",
                "katakana",
                "numeric",
                "tel",
                "email",
                "url",
              ],
              missing: "",
            },
            align: String,
            useMap: String,
          },
        }),
        l({
          tag: "keygen",
          name: "HTMLKeygenElement",
          ctor: function (w, T, E) {
            I.call(this, w, T, E);
          },
          props: x,
          attributes: {
            name: String,
            disabled: Boolean,
            autofocus: Boolean,
            challenge: String,
            keytype: { type: ["rsa"], missing: "" },
          },
        }),
        l({
          tag: "li",
          name: "HTMLLIElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: { value: { type: "long", default: 0 }, type: String },
        }),
        l({
          tag: "label",
          name: "HTMLLabelElement",
          ctor: function (w, T, E) {
            I.call(this, w, T, E);
          },
          props: x,
          attributes: { htmlFor: { name: "for", type: String } },
        }),
        l({
          tag: "legend",
          name: "HTMLLegendElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: { align: String },
        }),
        l({
          tag: "link",
          name: "HTMLLinkElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: {
            href: u,
            rel: String,
            media: String,
            hreflang: String,
            type: String,
            crossOrigin: d,
            nonce: String,
            integrity: String,
            referrerPolicy: m,
            imageSizes: String,
            imageSrcset: String,
            charset: String,
            rev: String,
            target: String,
          },
        }),
        l({
          tag: "map",
          name: "HTMLMapElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: { name: String },
        }),
        l({
          tag: "menu",
          name: "HTMLMenuElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: {
            type: { type: ["context", "popup", "toolbar"], missing: "toolbar" },
            label: String,
            compact: Boolean,
          },
        }),
        l({
          tag: "meta",
          name: "HTMLMetaElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: {
            name: String,
            content: String,
            httpEquiv: { name: "http-equiv", type: String },
            scheme: String,
          },
        }),
        l({
          tag: "meter",
          name: "HTMLMeterElement",
          ctor: function (w, T, E) {
            I.call(this, w, T, E);
          },
          props: x,
        }),
        l({
          tags: ["ins", "del"],
          name: "HTMLModElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: { cite: u, dateTime: String },
        }),
        l({
          tag: "ol",
          name: "HTMLOListElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          props: {
            _numitems: {
              get: function () {
                var _ = 0;
                return (
                  this.childNodes.forEach(function (w) {
                    w.nodeType === e.ELEMENT_NODE && w.tagName === "LI" && _++;
                  }),
                  _
                );
              },
            },
          },
          attributes: {
            type: String,
            reversed: Boolean,
            start: {
              type: "long",
              default: function () {
                return this.reversed ? this._numitems : 1;
              },
            },
            compact: Boolean,
          },
        }),
        l({
          tag: "object",
          name: "HTMLObjectElement",
          ctor: function (w, T, E) {
            I.call(this, w, T, E);
          },
          props: x,
          attributes: {
            data: u,
            type: String,
            name: String,
            useMap: String,
            typeMustMatch: Boolean,
            width: String,
            height: String,
            align: String,
            archive: String,
            code: String,
            declare: Boolean,
            hspace: { type: "unsigned long", default: 0 },
            standby: String,
            vspace: { type: "unsigned long", default: 0 },
            codeBase: u,
            codeType: String,
            border: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        l({
          tag: "optgroup",
          name: "HTMLOptGroupElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: { disabled: Boolean, label: String },
        }),
        l({
          tag: "option",
          name: "HTMLOptionElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          props: {
            form: {
              get: function () {
                for (
                  var _ = this.parentNode;
                  _ && _.nodeType === e.ELEMENT_NODE;

                ) {
                  if (_.localName === "select") return _.form;
                  _ = _.parentNode;
                }
              },
            },
            value: {
              get: function () {
                return this._getattr("value") || this.text;
              },
              set: function (_) {
                this._setattr("value", _);
              },
            },
            text: {
              get: function () {
                return this.textContent.replace(/[ \t\n\f\r]+/g, " ").trim();
              },
              set: function (_) {
                this.textContent = _;
              },
            },
          },
          attributes: {
            disabled: Boolean,
            defaultSelected: { name: "selected", type: Boolean },
            label: String,
          },
        }),
        l({
          tag: "output",
          name: "HTMLOutputElement",
          ctor: function (w, T, E) {
            I.call(this, w, T, E);
          },
          props: x,
          attributes: { name: String },
        }),
        l({
          tag: "p",
          name: "HTMLParagraphElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: { align: String },
        }),
        l({
          tag: "param",
          name: "HTMLParamElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: {
            name: String,
            value: String,
            type: String,
            valueType: String,
          },
        }),
        l({
          tags: ["pre", "listing", "xmp"],
          name: "HTMLPreElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: { width: { type: "long", default: 0 } },
        }),
        l({
          tag: "progress",
          name: "HTMLProgressElement",
          ctor: function (w, T, E) {
            I.call(this, w, T, E);
          },
          props: x,
          attributes: { max: { type: Number, float: !0, default: 1, min: 0 } },
        }),
        l({
          tags: ["q", "blockquote"],
          name: "HTMLQuoteElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: { cite: u },
        }),
        l({
          tag: "script",
          name: "HTMLScriptElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          props: {
            text: {
              get: function () {
                for (
                  var _ = "", w = 0, T = this.childNodes.length;
                  w < T;
                  w++
                ) {
                  var E = this.childNodes[w];
                  E.nodeType === e.TEXT_NODE && (_ += E._data);
                }
                return _;
              },
              set: function (_) {
                this.removeChildren(),
                  _ !== null &&
                    _ !== "" &&
                    this.appendChild(this.ownerDocument.createTextNode(_));
              },
            },
          },
          attributes: {
            src: u,
            type: String,
            charset: String,
            referrerPolicy: m,
            defer: Boolean,
            async: Boolean,
            nomodule: Boolean,
            crossOrigin: d,
            nonce: String,
            integrity: String,
          },
        }),
        l({
          tag: "select",
          name: "HTMLSelectElement",
          ctor: function (w, T, E) {
            I.call(this, w, T, E);
          },
          props: {
            form: x.form,
            options: {
              get: function () {
                return this.getElementsByTagName("option");
              },
            },
          },
          attributes: {
            autocomplete: String,
            name: String,
            disabled: Boolean,
            autofocus: Boolean,
            multiple: Boolean,
            required: Boolean,
            size: { type: "unsigned long", default: 0 },
          },
        }),
        l({
          tag: "span",
          name: "HTMLSpanElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
        }),
        l({
          tag: "style",
          name: "HTMLStyleElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: { media: String, type: String, scoped: Boolean },
        }),
        l({
          tag: "caption",
          name: "HTMLTableCaptionElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: { align: String },
        }),
        l({
          name: "HTMLTableCellElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: {
            colSpan: { type: "unsigned long", default: 1 },
            rowSpan: { type: "unsigned long", default: 1 },
            scope: {
              type: ["row", "col", "rowgroup", "colgroup"],
              missing: "",
            },
            abbr: String,
            align: String,
            axis: String,
            height: String,
            width: String,
            ch: { name: "char", type: String },
            chOff: { name: "charoff", type: String },
            noWrap: Boolean,
            vAlign: String,
            bgColor: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        l({
          tags: ["col", "colgroup"],
          name: "HTMLTableColElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: {
            span: {
              type: "limited unsigned long with fallback",
              default: 1,
              min: 1,
            },
            align: String,
            ch: { name: "char", type: String },
            chOff: { name: "charoff", type: String },
            vAlign: String,
            width: String,
          },
        }),
        l({
          tag: "table",
          name: "HTMLTableElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          props: {
            rows: {
              get: function () {
                return this.getElementsByTagName("tr");
              },
            },
          },
          attributes: {
            align: String,
            border: String,
            frame: String,
            rules: String,
            summary: String,
            width: String,
            bgColor: { type: String, treatNullAsEmptyString: !0 },
            cellPadding: { type: String, treatNullAsEmptyString: !0 },
            cellSpacing: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        l({
          tag: "template",
          name: "HTMLTemplateElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E),
              (this._contentFragment = w._templateDoc.createDocumentFragment());
          },
          props: {
            content: {
              get: function () {
                return this._contentFragment;
              },
            },
            serialize: {
              value: function () {
                return this.content.serialize();
              },
            },
          },
        }),
        l({
          tag: "tr",
          name: "HTMLTableRowElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          props: {
            cells: {
              get: function () {
                return this.querySelectorAll("td,th");
              },
            },
          },
          attributes: {
            align: String,
            ch: { name: "char", type: String },
            chOff: { name: "charoff", type: String },
            vAlign: String,
            bgColor: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        l({
          tags: ["thead", "tfoot", "tbody"],
          name: "HTMLTableSectionElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          props: {
            rows: {
              get: function () {
                return this.getElementsByTagName("tr");
              },
            },
          },
          attributes: {
            align: String,
            ch: { name: "char", type: String },
            chOff: { name: "charoff", type: String },
            vAlign: String,
          },
        }),
        l({
          tag: "textarea",
          name: "HTMLTextAreaElement",
          ctor: function (w, T, E) {
            I.call(this, w, T, E);
          },
          props: {
            form: x.form,
            type: {
              get: function () {
                return "textarea";
              },
            },
            defaultValue: {
              get: function () {
                return this.textContent;
              },
              set: function (_) {
                this.textContent = _;
              },
            },
            value: {
              get: function () {
                return this.defaultValue;
              },
              set: function (_) {
                this.defaultValue = _;
              },
            },
            textLength: {
              get: function () {
                return this.value.length;
              },
            },
          },
          attributes: {
            autocomplete: String,
            name: String,
            disabled: Boolean,
            autofocus: Boolean,
            placeholder: String,
            wrap: String,
            dirName: String,
            required: Boolean,
            readOnly: Boolean,
            rows: { type: "limited unsigned long with fallback", default: 2 },
            cols: { type: "limited unsigned long with fallback", default: 20 },
            maxLength: {
              type: "unsigned long",
              min: 0,
              setmin: 0,
              default: -1,
            },
            minLength: {
              type: "unsigned long",
              min: 0,
              setmin: 0,
              default: -1,
            },
            inputMode: {
              type: [
                "verbatim",
                "latin",
                "latin-name",
                "latin-prose",
                "full-width-latin",
                "kana",
                "kana-name",
                "katakana",
                "numeric",
                "tel",
                "email",
                "url",
              ],
              missing: "",
            },
          },
        }),
        l({
          tag: "time",
          name: "HTMLTimeElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: { dateTime: String, pubDate: Boolean },
        }),
        l({
          tag: "title",
          name: "HTMLTitleElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          props: {
            text: {
              get: function () {
                return this.textContent;
              },
            },
          },
        }),
        l({
          tag: "ul",
          name: "HTMLUListElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: { type: String, compact: Boolean },
        }),
        l({
          name: "HTMLMediaElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: {
            src: u,
            crossOrigin: d,
            preload: {
              type: ["metadata", "none", "auto", { value: "", alias: "auto" }],
              missing: "auto",
            },
            loop: Boolean,
            autoplay: Boolean,
            mediaGroup: String,
            controls: Boolean,
            defaultMuted: { name: "muted", type: Boolean },
          },
        }),
        l({
          name: "HTMLAudioElement",
          tag: "audio",
          superclass: a.HTMLMediaElement,
          ctor: function (w, T, E) {
            a.HTMLMediaElement.call(this, w, T, E);
          },
        }),
        l({
          name: "HTMLVideoElement",
          tag: "video",
          superclass: a.HTMLMediaElement,
          ctor: function (w, T, E) {
            a.HTMLMediaElement.call(this, w, T, E);
          },
          attributes: {
            poster: u,
            width: { type: "unsigned long", min: 0, default: 0 },
            height: { type: "unsigned long", min: 0, default: 0 },
          },
        }),
        l({
          tag: "td",
          name: "HTMLTableDataCellElement",
          superclass: a.HTMLTableCellElement,
          ctor: function (w, T, E) {
            a.HTMLTableCellElement.call(this, w, T, E);
          },
        }),
        l({
          tag: "th",
          name: "HTMLTableHeaderCellElement",
          superclass: a.HTMLTableCellElement,
          ctor: function (w, T, E) {
            a.HTMLTableCellElement.call(this, w, T, E);
          },
        }),
        l({
          tag: "frameset",
          name: "HTMLFrameSetElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
        }),
        l({
          tag: "frame",
          name: "HTMLFrameElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
        }),
        l({
          tag: "canvas",
          name: "HTMLCanvasElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          props: {
            getContext: { value: i.nyi },
            probablySupportsContext: { value: i.nyi },
            setContext: { value: i.nyi },
            transferControlToProxy: { value: i.nyi },
            toDataURL: { value: i.nyi },
            toBlob: { value: i.nyi },
          },
          attributes: {
            width: { type: "unsigned long", default: 300 },
            height: { type: "unsigned long", default: 150 },
          },
        }),
        l({
          tag: "dialog",
          name: "HTMLDialogElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          props: {
            show: { value: i.nyi },
            showModal: { value: i.nyi },
            close: { value: i.nyi },
          },
          attributes: { open: Boolean, returnValue: String },
        }),
        l({
          tag: "menuitem",
          name: "HTMLMenuItemElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          props: {
            _label: {
              get: function () {
                var _ = this._getattr("label");
                return _ !== null && _ !== ""
                  ? _
                  : ((_ = this.textContent),
                    _.replace(/[ \t\n\f\r]+/g, " ").trim());
              },
            },
            label: {
              get: function () {
                var _ = this._getattr("label");
                return _ !== null ? _ : this._label;
              },
              set: function (_) {
                this._setattr("label", _);
              },
            },
          },
          attributes: {
            type: {
              type: ["command", "checkbox", "radio"],
              missing: "command",
            },
            icon: u,
            disabled: Boolean,
            checked: Boolean,
            radiogroup: String,
            default: Boolean,
          },
        }),
        l({
          tag: "source",
          name: "HTMLSourceElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: {
            srcset: String,
            sizes: String,
            media: String,
            src: u,
            type: String,
            width: String,
            height: String,
          },
        }),
        l({
          tag: "track",
          name: "HTMLTrackElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: {
            src: u,
            srclang: String,
            label: String,
            default: Boolean,
            kind: {
              type: [
                "subtitles",
                "captions",
                "descriptions",
                "chapters",
                "metadata",
              ],
              missing: "subtitles",
              invalid: "metadata",
            },
          },
          props: {
            NONE: {
              get: function () {
                return 0;
              },
            },
            LOADING: {
              get: function () {
                return 1;
              },
            },
            LOADED: {
              get: function () {
                return 2;
              },
            },
            ERROR: {
              get: function () {
                return 3;
              },
            },
            readyState: { get: i.nyi },
            track: { get: i.nyi },
          },
        }),
        l({
          tag: "font",
          name: "HTMLFontElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: {
            color: { type: String, treatNullAsEmptyString: !0 },
            face: { type: String },
            size: { type: String },
          },
        }),
        l({
          tag: "dir",
          name: "HTMLDirectoryElement",
          ctor: function (w, T, E) {
            N.call(this, w, T, E);
          },
          attributes: { compact: Boolean },
        }),
        l({
          tags: [
            "abbr",
            "address",
            "article",
            "aside",
            "b",
            "bdi",
            "bdo",
            "cite",
            "content",
            "code",
            "dd",
            "dfn",
            "dt",
            "em",
            "figcaption",
            "figure",
            "footer",
            "header",
            "hgroup",
            "i",
            "kbd",
            "main",
            "mark",
            "nav",
            "noscript",
            "rb",
            "rp",
            "rt",
            "rtc",
            "ruby",
            "s",
            "samp",
            "section",
            "small",
            "strong",
            "sub",
            "summary",
            "sup",
            "u",
            "var",
            "wbr",
            "acronym",
            "basefont",
            "big",
            "center",
            "nobr",
            "noembed",
            "noframes",
            "plaintext",
            "strike",
            "tt",
          ],
        });
    },
  }),
  kb = oe({
    "external/npm/node_modules/domino/lib/svg.js"(t) {
      "use strict";
      var e = vo(),
        n = Ob(),
        r = Xe(),
        i = jh(),
        s = (t.elements = {}),
        o = Object.create(null);
      t.createElement = function (l, u, d) {
        var m = o[u] || c;
        return new m(l, u, d);
      };
      function a(l) {
        return n(l, c, s, o);
      }
      var c = a({
        superclass: e,
        name: "SVGElement",
        ctor: function (u, d, m) {
          e.call(this, u, d, r.NAMESPACE.SVG, m);
        },
        props: {
          style: {
            get: function () {
              return this._style || (this._style = new i(this)), this._style;
            },
          },
        },
      });
      a({
        name: "SVGSVGElement",
        ctor: function (u, d, m) {
          c.call(this, u, d, m);
        },
        tag: "svg",
        props: {
          createSVGRect: {
            value: function () {
              return t.createElement(this.ownerDocument, "rect", null);
            },
          },
        },
      }),
        a({
          tags: [
            "a",
            "altGlyph",
            "altGlyphDef",
            "altGlyphItem",
            "animate",
            "animateColor",
            "animateMotion",
            "animateTransform",
            "circle",
            "clipPath",
            "color-profile",
            "cursor",
            "defs",
            "desc",
            "ellipse",
            "feBlend",
            "feColorMatrix",
            "feComponentTransfer",
            "feComposite",
            "feConvolveMatrix",
            "feDiffuseLighting",
            "feDisplacementMap",
            "feDistantLight",
            "feFlood",
            "feFuncA",
            "feFuncB",
            "feFuncG",
            "feFuncR",
            "feGaussianBlur",
            "feImage",
            "feMerge",
            "feMergeNode",
            "feMorphology",
            "feOffset",
            "fePointLight",
            "feSpecularLighting",
            "feSpotLight",
            "feTile",
            "feTurbulence",
            "filter",
            "font",
            "font-face",
            "font-face-format",
            "font-face-name",
            "font-face-src",
            "font-face-uri",
            "foreignObject",
            "g",
            "glyph",
            "glyphRef",
            "hkern",
            "image",
            "line",
            "linearGradient",
            "marker",
            "mask",
            "metadata",
            "missing-glyph",
            "mpath",
            "path",
            "pattern",
            "polygon",
            "polyline",
            "radialGradient",
            "rect",
            "script",
            "set",
            "stop",
            "style",
            "switch",
            "symbol",
            "text",
            "textPath",
            "title",
            "tref",
            "tspan",
            "use",
            "view",
            "vkern",
          ],
        });
    },
  }),
  kN = oe({
    "external/npm/node_modules/domino/lib/MutationConstants.js"(t, e) {
      "use strict";
      e.exports = {
        VALUE: 1,
        ATTR: 2,
        REMOVE_ATTR: 3,
        REMOVE: 4,
        MOVE: 5,
        INSERT: 6,
      };
    },
  }),
  Bh = oe({
    "external/npm/node_modules/domino/lib/Document.js"(t, e) {
      "use strict";
      e.exports = q;
      var n = ft(),
        r = Qi(),
        i = Oh(),
        s = vo(),
        o = Cb(),
        a = Ib(),
        c = yo(),
        l = Mb(),
        u = Nb(),
        d = xl(),
        m = AN(),
        b = xN(),
        I = Al(),
        N = Fh(),
        F = Lh(),
        x = xb(),
        _ = kh(),
        w = Hh(),
        T = kb(),
        E = Xe(),
        ee = kN(),
        ne = E.NAMESPACE,
        me = Rh().isApiWritable;
      function q(S, k) {
        i.call(this),
          (this.nodeType = n.DOCUMENT_NODE),
          (this.isHTML = S),
          (this._address = k || "about:blank"),
          (this.readyState = "loading"),
          (this.implementation = new d(this)),
          (this.ownerDocument = null),
          (this._contentType = S ? "text/html" : "application/xml"),
          (this.doctype = null),
          (this.documentElement = null),
          (this._templateDocCache = null),
          (this._nodeIterators = null),
          (this._nid = 1),
          (this._nextnid = 2),
          (this._nodes = [null, this]),
          (this.byId = Object.create(null)),
          (this.modclock = 0);
      }
      var O = {
          event: "Event",
          customevent: "CustomEvent",
          uievent: "UIEvent",
          mouseevent: "MouseEvent",
        },
        j = {
          events: "event",
          htmlevents: "event",
          mouseevents: "mouseevent",
          mutationevents: "mutationevent",
          uievents: "uievent",
        },
        Y = function (S, k, $) {
          return {
            get: function () {
              var _e = S.call(this);
              return _e ? _e[k] : $;
            },
            set: function (_e) {
              var ht = S.call(this);
              ht && (ht[k] = _e);
            },
          };
        };
      function v(S, k) {
        var $, _e, ht;
        return (
          S === "" && (S = null),
          _.isValidQName(k) || E.InvalidCharacterError(),
          ($ = null),
          (_e = k),
          (ht = k.indexOf(":")),
          ht >= 0 && (($ = k.substring(0, ht)), (_e = k.substring(ht + 1))),
          $ !== null && S === null && E.NamespaceError(),
          $ === "xml" && S !== ne.XML && E.NamespaceError(),
          ($ === "xmlns" || k === "xmlns") &&
            S !== ne.XMLNS &&
            E.NamespaceError(),
          S === ne.XMLNS &&
            !($ === "xmlns" || k === "xmlns") &&
            E.NamespaceError(),
          { namespace: S, prefix: $, localName: _e }
        );
      }
      q.prototype = Object.create(i.prototype, {
        _setMutationHandler: {
          value: function (S) {
            this.mutationHandler = S;
          },
        },
        _dispatchRendererEvent: {
          value: function (S, k, $) {
            var _e = this._nodes[S];
            _e && _e._dispatchEvent(new c(k, $), !0);
          },
        },
        nodeName: { value: "#document" },
        nodeValue: {
          get: function () {
            return null;
          },
          set: function () {},
        },
        documentURI: {
          get: function () {
            return this._address;
          },
          set: E.nyi,
        },
        compatMode: {
          get: function () {
            return this._quirks ? "BackCompat" : "CSS1Compat";
          },
        },
        createTextNode: {
          value: function (S) {
            return new o(this, String(S));
          },
        },
        createComment: {
          value: function (S) {
            return new a(this, S);
          },
        },
        createDocumentFragment: {
          value: function () {
            return new l(this);
          },
        },
        createProcessingInstruction: {
          value: function (S, k) {
            return (
              (!_.isValidName(S) || k.indexOf("?>") !== -1) &&
                E.InvalidCharacterError(),
              new u(this, S, k)
            );
          },
        },
        createAttribute: {
          value: function (S) {
            return (
              (S = String(S)),
              _.isValidName(S) || E.InvalidCharacterError(),
              this.isHTML && (S = E.toASCIILowerCase(S)),
              new s._Attr(null, S, null, null, "")
            );
          },
        },
        createAttributeNS: {
          value: function (S, k) {
            (S = S == null || S === "" ? null : String(S)), (k = String(k));
            var $ = v(S, k);
            return new s._Attr(null, $.localName, $.prefix, $.namespace, "");
          },
        },
        createElement: {
          value: function (S) {
            return (
              (S = String(S)),
              _.isValidName(S) || E.InvalidCharacterError(),
              this.isHTML
                ? (/[A-Z]/.test(S) && (S = E.toASCIILowerCase(S)),
                  w.createElement(this, S, null))
                : this.contentType === "application/xhtml+xml"
                ? w.createElement(this, S, null)
                : new s(this, S, null, null)
            );
          },
          writable: me,
        },
        createElementNS: {
          value: function (S, k) {
            (S = S == null || S === "" ? null : String(S)), (k = String(k));
            var $ = v(S, k);
            return this._createElementNS($.localName, $.namespace, $.prefix);
          },
          writable: me,
        },
        _createElementNS: {
          value: function (S, k, $) {
            return k === ne.HTML
              ? w.createElement(this, S, $)
              : k === ne.SVG
              ? T.createElement(this, S, $)
              : new s(this, S, k, $);
          },
        },
        createEvent: {
          value: function (k) {
            k = k.toLowerCase();
            var $ = j[k] || k,
              _e = x[O[$]];
            if (_e) {
              var ht = new _e();
              return (ht._initialized = !1), ht;
            } else E.NotSupportedError();
          },
        },
        createTreeWalker: {
          value: function (S, k, $) {
            if (!S) throw new TypeError("root argument is required");
            if (!(S instanceof n)) throw new TypeError("root not a node");
            return (
              (k = k === void 0 ? I.SHOW_ALL : +k),
              ($ = $ === void 0 ? null : $),
              new m(S, k, $)
            );
          },
        },
        createNodeIterator: {
          value: function (S, k, $) {
            if (!S) throw new TypeError("root argument is required");
            if (!(S instanceof n)) throw new TypeError("root not a node");
            return (
              (k = k === void 0 ? I.SHOW_ALL : +k),
              ($ = $ === void 0 ? null : $),
              new b(S, k, $)
            );
          },
        },
        _attachNodeIterator: {
          value: function (S) {
            this._nodeIterators || (this._nodeIterators = []),
              this._nodeIterators.push(S);
          },
        },
        _detachNodeIterator: {
          value: function (S) {
            var k = this._nodeIterators.indexOf(S);
            this._nodeIterators.splice(k, 1);
          },
        },
        _preremoveNodeIterators: {
          value: function (S) {
            this._nodeIterators &&
              this._nodeIterators.forEach(function (k) {
                k._preremove(S);
              });
          },
        },
        _updateDocTypeElement: {
          value: function () {
            this.doctype = this.documentElement = null;
            for (var k = this.firstChild; k !== null; k = k.nextSibling)
              k.nodeType === n.DOCUMENT_TYPE_NODE
                ? (this.doctype = k)
                : k.nodeType === n.ELEMENT_NODE && (this.documentElement = k);
          },
        },
        insertBefore: {
          value: function (k, $) {
            return (
              n.prototype.insertBefore.call(this, k, $),
              this._updateDocTypeElement(),
              k
            );
          },
        },
        replaceChild: {
          value: function (k, $) {
            return (
              n.prototype.replaceChild.call(this, k, $),
              this._updateDocTypeElement(),
              $
            );
          },
        },
        removeChild: {
          value: function (k) {
            return (
              n.prototype.removeChild.call(this, k),
              this._updateDocTypeElement(),
              k
            );
          },
        },
        getElementById: {
          value: function (S) {
            var k = this.byId[S];
            return k ? (k instanceof he ? k.getFirst() : k) : null;
          },
        },
        _hasMultipleElementsWithId: {
          value: function (S) {
            return this.byId[S] instanceof he;
          },
        },
        getElementsByName: { value: s.prototype.getElementsByName },
        getElementsByTagName: { value: s.prototype.getElementsByTagName },
        getElementsByTagNameNS: { value: s.prototype.getElementsByTagNameNS },
        getElementsByClassName: { value: s.prototype.getElementsByClassName },
        adoptNode: {
          value: function (k) {
            return (
              k.nodeType === n.DOCUMENT_NODE && E.NotSupportedError(),
              k.nodeType === n.ATTRIBUTE_NODE ||
                (k.parentNode && k.parentNode.removeChild(k),
                k.ownerDocument !== this && Q(k, this)),
              k
            );
          },
        },
        importNode: {
          value: function (k, $) {
            return this.adoptNode(k.cloneNode($));
          },
          writable: me,
        },
        origin: {
          get: function () {
            return null;
          },
        },
        characterSet: {
          get: function () {
            return "UTF-8";
          },
        },
        contentType: {
          get: function () {
            return this._contentType;
          },
        },
        URL: {
          get: function () {
            return this._address;
          },
        },
        domain: { get: E.nyi, set: E.nyi },
        referrer: { get: E.nyi },
        cookie: { get: E.nyi, set: E.nyi },
        lastModified: { get: E.nyi },
        location: {
          get: function () {
            return this.defaultView ? this.defaultView.location : null;
          },
          set: E.nyi,
        },
        _titleElement: {
          get: function () {
            return this.getElementsByTagName("title").item(0) || null;
          },
        },
        title: {
          get: function () {
            var S = this._titleElement,
              k = S ? S.textContent : "";
            return k.replace(/[ \t\n\r\f]+/g, " ").replace(/(^ )|( $)/g, "");
          },
          set: function (S) {
            var k = this._titleElement,
              $ = this.head;
            (!k && !$) ||
              (k || ((k = this.createElement("title")), $.appendChild(k)),
              (k.textContent = S));
          },
        },
        dir: Y(
          function () {
            var S = this.documentElement;
            if (S && S.tagName === "HTML") return S;
          },
          "dir",
          ""
        ),
        fgColor: Y(
          function () {
            return this.body;
          },
          "text",
          ""
        ),
        linkColor: Y(
          function () {
            return this.body;
          },
          "link",
          ""
        ),
        vlinkColor: Y(
          function () {
            return this.body;
          },
          "vLink",
          ""
        ),
        alinkColor: Y(
          function () {
            return this.body;
          },
          "aLink",
          ""
        ),
        bgColor: Y(
          function () {
            return this.body;
          },
          "bgColor",
          ""
        ),
        charset: {
          get: function () {
            return this.characterSet;
          },
        },
        inputEncoding: {
          get: function () {
            return this.characterSet;
          },
        },
        scrollingElement: {
          get: function () {
            return this._quirks ? this.body : this.documentElement;
          },
        },
        body: {
          get: function () {
            return p(this.documentElement, "body");
          },
          set: E.nyi,
        },
        head: {
          get: function () {
            return p(this.documentElement, "head");
          },
        },
        images: { get: E.nyi },
        embeds: { get: E.nyi },
        plugins: { get: E.nyi },
        links: { get: E.nyi },
        forms: { get: E.nyi },
        scripts: { get: E.nyi },
        applets: {
          get: function () {
            return [];
          },
        },
        activeElement: {
          get: function () {
            return null;
          },
        },
        innerHTML: {
          get: function () {
            return this.serialize();
          },
          set: E.nyi,
        },
        outerHTML: {
          get: function () {
            return this.serialize();
          },
          set: E.nyi,
        },
        write: {
          value: function (S) {
            if ((this.isHTML || E.InvalidStateError(), !!this._parser)) {
              this._parser;
              var k = arguments.join("");
              this._parser.parse(k);
            }
          },
        },
        writeln: {
          value: function (k) {
            this.write(
              Array.prototype.join.call(arguments, "") +
                `
`
            );
          },
        },
        open: {
          value: function () {
            this.documentElement = null;
          },
        },
        close: {
          value: function () {
            (this.readyState = "interactive"),
              this._dispatchEvent(new c("readystatechange"), !0),
              this._dispatchEvent(new c("DOMContentLoaded"), !0),
              (this.readyState = "complete"),
              this._dispatchEvent(new c("readystatechange"), !0),
              this.defaultView &&
                this.defaultView._dispatchEvent(new c("load"), !0);
          },
        },
        clone: {
          value: function () {
            var k = new q(this.isHTML, this._address);
            return (
              (k._quirks = this._quirks),
              (k._contentType = this._contentType),
              k
            );
          },
        },
        cloneNode: {
          value: function (k) {
            var $ = n.prototype.cloneNode.call(this, !1);
            if (k)
              for (var _e = this.firstChild; _e !== null; _e = _e.nextSibling)
                $._appendChild($.importNode(_e, !0));
            return $._updateDocTypeElement(), $;
          },
        },
        isEqual: {
          value: function (k) {
            return !0;
          },
        },
        mutateValue: {
          value: function (S) {
            this.mutationHandler &&
              this.mutationHandler({ type: ee.VALUE, target: S, data: S.data });
          },
        },
        mutateAttr: {
          value: function (S, k) {
            this.mutationHandler &&
              this.mutationHandler({
                type: ee.ATTR,
                target: S.ownerElement,
                attr: S,
              });
          },
        },
        mutateRemoveAttr: {
          value: function (S) {
            this.mutationHandler &&
              this.mutationHandler({
                type: ee.REMOVE_ATTR,
                target: S.ownerElement,
                attr: S,
              });
          },
        },
        mutateRemove: {
          value: function (S) {
            this.mutationHandler &&
              this.mutationHandler({
                type: ee.REMOVE,
                target: S.parentNode,
                node: S,
              }),
              V(S);
          },
        },
        mutateInsert: {
          value: function (S) {
            R(S),
              this.mutationHandler &&
                this.mutationHandler({
                  type: ee.INSERT,
                  target: S.parentNode,
                  node: S,
                });
          },
        },
        mutateMove: {
          value: function (S) {
            this.mutationHandler &&
              this.mutationHandler({ type: ee.MOVE, target: S });
          },
        },
        addId: {
          value: function (k, $) {
            var _e = this.byId[k];
            _e
              ? (_e instanceof he || ((_e = new he(_e)), (this.byId[k] = _e)),
                _e.add($))
              : (this.byId[k] = $);
          },
        },
        delId: {
          value: function (k, $) {
            var _e = this.byId[k];
            E.assert(_e),
              _e instanceof he
                ? (_e.del($),
                  _e.length === 1 && (this.byId[k] = _e.downgrade()))
                : (this.byId[k] = void 0);
          },
        },
        _resolve: {
          value: function (S) {
            return new N(this._documentBaseURL).resolve(S);
          },
        },
        _documentBaseURL: {
          get: function () {
            var S = this._address;
            S === "about:blank" && (S = "/");
            var k = this.querySelector("base[href]");
            return k ? new N(S).resolve(k.getAttribute("href")) : S;
          },
        },
        _templateDoc: {
          get: function () {
            if (!this._templateDocCache) {
              var S = new q(this.isHTML, this._address);
              this._templateDocCache = S._templateDocCache = S;
            }
            return this._templateDocCache;
          },
        },
        querySelector: {
          value: function (S) {
            return F(S, this)[0];
          },
        },
        querySelectorAll: {
          value: function (S) {
            var k = F(S, this);
            return k.item ? k : new r(k);
          },
        },
      });
      var g = [
        "abort",
        "canplay",
        "canplaythrough",
        "change",
        "click",
        "contextmenu",
        "cuechange",
        "dblclick",
        "drag",
        "dragend",
        "dragenter",
        "dragleave",
        "dragover",
        "dragstart",
        "drop",
        "durationchange",
        "emptied",
        "ended",
        "input",
        "invalid",
        "keydown",
        "keypress",
        "keyup",
        "loadeddata",
        "loadedmetadata",
        "loadstart",
        "mousedown",
        "mousemove",
        "mouseout",
        "mouseover",
        "mouseup",
        "mousewheel",
        "pause",
        "play",
        "playing",
        "progress",
        "ratechange",
        "readystatechange",
        "reset",
        "seeked",
        "seeking",
        "select",
        "show",
        "stalled",
        "submit",
        "suspend",
        "timeupdate",
        "volumechange",
        "waiting",
        "blur",
        "error",
        "focus",
        "load",
        "scroll",
      ];
      g.forEach(function (S) {
        Object.defineProperty(q.prototype, "on" + S, {
          get: function () {
            return this._getEventHandler(S);
          },
          set: function (k) {
            this._setEventHandler(S, k);
          },
        });
      });
      function p(S, k) {
        if (S && S.isHTML) {
          for (var $ = S.firstChild; $ !== null; $ = $.nextSibling)
            if (
              $.nodeType === n.ELEMENT_NODE &&
              $.localName === k &&
              $.namespaceURI === ne.HTML
            )
              return $;
        }
        return null;
      }
      function y(S) {
        if (
          ((S._nid = S.ownerDocument._nextnid++),
          (S.ownerDocument._nodes[S._nid] = S),
          S.nodeType === n.ELEMENT_NODE)
        ) {
          var k = S.getAttribute("id");
          k && S.ownerDocument.addId(k, S), S._roothook && S._roothook();
        }
      }
      function C(S) {
        if (S.nodeType === n.ELEMENT_NODE) {
          var k = S.getAttribute("id");
          k && S.ownerDocument.delId(k, S);
        }
        (S.ownerDocument._nodes[S._nid] = void 0), (S._nid = void 0);
      }
      function R(S) {
        if ((y(S), S.nodeType === n.ELEMENT_NODE))
          for (var k = S.firstChild; k !== null; k = k.nextSibling) R(k);
      }
      function V(S) {
        C(S);
        for (var k = S.firstChild; k !== null; k = k.nextSibling) V(k);
      }
      function Q(S, k) {
        (S.ownerDocument = k),
          (S._lastModTime = void 0),
          Object.prototype.hasOwnProperty.call(S, "_tagName") &&
            (S._tagName = void 0);
        for (var $ = S.firstChild; $ !== null; $ = $.nextSibling) Q($, k);
      }
      function he(S) {
        (this.nodes = Object.create(null)),
          (this.nodes[S._nid] = S),
          (this.length = 1),
          (this.firstNode = void 0);
      }
      (he.prototype.add = function (S) {
        this.nodes[S._nid] ||
          ((this.nodes[S._nid] = S), this.length++, (this.firstNode = void 0));
      }),
        (he.prototype.del = function (S) {
          this.nodes[S._nid] &&
            (delete this.nodes[S._nid],
            this.length--,
            (this.firstNode = void 0));
        }),
        (he.prototype.getFirst = function () {
          if (!this.firstNode) {
            var S;
            for (S in this.nodes)
              (this.firstNode === void 0 ||
                this.firstNode.compareDocumentPosition(this.nodes[S]) &
                  n.DOCUMENT_POSITION_PRECEDING) &&
                (this.firstNode = this.nodes[S]);
          }
          return this.firstNode;
        }),
        (he.prototype.downgrade = function () {
          if (this.length === 1) {
            var S;
            for (S in this.nodes) return this.nodes[S];
          }
          return this;
        });
    },
  }),
  Uh = oe({
    "external/npm/node_modules/domino/lib/DocumentType.js"(t, e) {
      "use strict";
      e.exports = s;
      var n = ft(),
        r = Sb(),
        i = Ph();
      function s(o, a, c, l) {
        r.call(this),
          (this.nodeType = n.DOCUMENT_TYPE_NODE),
          (this.ownerDocument = o || null),
          (this.name = a),
          (this.publicId = c || ""),
          (this.systemId = l || "");
      }
      (s.prototype = Object.create(r.prototype, {
        nodeName: {
          get: function () {
            return this.name;
          },
        },
        nodeValue: {
          get: function () {
            return null;
          },
          set: function () {},
        },
        clone: {
          value: function () {
            return new s(
              this.ownerDocument,
              this.name,
              this.publicId,
              this.systemId
            );
          },
        },
        isEqual: {
          value: function (a) {
            return (
              this.name === a.name &&
              this.publicId === a.publicId &&
              this.systemId === a.systemId
            );
          },
        },
      })),
        Object.defineProperties(s.prototype, i);
    },
  }),
  Vh = oe({
    "external/npm/node_modules/domino/lib/HTMLParser.js"(t, e) {
      "use strict";
      e.exports = Ne;
      var n = Bh(),
        r = Uh(),
        i = ft(),
        s = Xe().NAMESPACE,
        o = Hh(),
        a = o.elements,
        c = Function.prototype.apply.bind(Array.prototype.push),
        l = -1,
        u = 1,
        d = 2,
        m = 3,
        b = 4,
        I = 5,
        N = [],
        F =
          /^HTML$|^-\/\/W3O\/\/DTD W3 HTML Strict 3\.0\/\/EN\/\/$|^-\/W3C\/DTD HTML 4\.0 Transitional\/EN$|^\+\/\/Silmaril\/\/dtd html Pro v0r11 19970101\/\/|^-\/\/AdvaSoft Ltd\/\/DTD HTML 3\.0 asWedit \+ extensions\/\/|^-\/\/AS\/\/DTD HTML 3\.0 asWedit \+ extensions\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Level 1\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Level 2\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict Level 1\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict Level 2\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict\/\/|^-\/\/IETF\/\/DTD HTML 2\.0\/\/|^-\/\/IETF\/\/DTD HTML 2\.1E\/\/|^-\/\/IETF\/\/DTD HTML 3\.0\/\/|^-\/\/IETF\/\/DTD HTML 3\.2 Final\/\/|^-\/\/IETF\/\/DTD HTML 3\.2\/\/|^-\/\/IETF\/\/DTD HTML 3\/\/|^-\/\/IETF\/\/DTD HTML Level 0\/\/|^-\/\/IETF\/\/DTD HTML Level 1\/\/|^-\/\/IETF\/\/DTD HTML Level 2\/\/|^-\/\/IETF\/\/DTD HTML Level 3\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 0\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 1\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 2\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 3\/\/|^-\/\/IETF\/\/DTD HTML Strict\/\/|^-\/\/IETF\/\/DTD HTML\/\/|^-\/\/Metrius\/\/DTD Metrius Presentational\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 HTML Strict\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 HTML\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 Tables\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 HTML Strict\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 HTML\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 Tables\/\/|^-\/\/Netscape Comm\. Corp\.\/\/DTD HTML\/\/|^-\/\/Netscape Comm\. Corp\.\/\/DTD Strict HTML\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML 2\.0\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML Extended 1\.0\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML Extended Relaxed 1\.0\/\/|^-\/\/SoftQuad Software\/\/DTD HoTMetaL PRO 6\.0::19990601::extensions to HTML 4\.0\/\/|^-\/\/SoftQuad\/\/DTD HoTMetaL PRO 4\.0::19971010::extensions to HTML 4\.0\/\/|^-\/\/Spyglass\/\/DTD HTML 2\.0 Extended\/\/|^-\/\/SQ\/\/DTD HTML 2\.0 HoTMetaL \+ extensions\/\/|^-\/\/Sun Microsystems Corp\.\/\/DTD HotJava HTML\/\/|^-\/\/Sun Microsystems Corp\.\/\/DTD HotJava Strict HTML\/\/|^-\/\/W3C\/\/DTD HTML 3 1995-03-24\/\/|^-\/\/W3C\/\/DTD HTML 3\.2 Draft\/\/|^-\/\/W3C\/\/DTD HTML 3\.2 Final\/\/|^-\/\/W3C\/\/DTD HTML 3\.2\/\/|^-\/\/W3C\/\/DTD HTML 3\.2S Draft\/\/|^-\/\/W3C\/\/DTD HTML 4\.0 Frameset\/\/|^-\/\/W3C\/\/DTD HTML 4\.0 Transitional\/\/|^-\/\/W3C\/\/DTD HTML Experimental 19960712\/\/|^-\/\/W3C\/\/DTD HTML Experimental 970421\/\/|^-\/\/W3C\/\/DTD W3 HTML\/\/|^-\/\/W3O\/\/DTD W3 HTML 3\.0\/\/|^-\/\/WebTechs\/\/DTD Mozilla HTML 2\.0\/\/|^-\/\/WebTechs\/\/DTD Mozilla HTML\/\//i,
        x = "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd",
        _ =
          /^-\/\/W3C\/\/DTD HTML 4\.01 Frameset\/\/|^-\/\/W3C\/\/DTD HTML 4\.01 Transitional\/\//i,
        w =
          /^-\/\/W3C\/\/DTD XHTML 1\.0 Frameset\/\/|^-\/\/W3C\/\/DTD XHTML 1\.0 Transitional\/\//i,
        T = Object.create(null);
      (T[s.HTML] = {
        __proto__: null,
        address: !0,
        applet: !0,
        area: !0,
        article: !0,
        aside: !0,
        base: !0,
        basefont: !0,
        bgsound: !0,
        blockquote: !0,
        body: !0,
        br: !0,
        button: !0,
        caption: !0,
        center: !0,
        col: !0,
        colgroup: !0,
        dd: !0,
        details: !0,
        dir: !0,
        div: !0,
        dl: !0,
        dt: !0,
        embed: !0,
        fieldset: !0,
        figcaption: !0,
        figure: !0,
        footer: !0,
        form: !0,
        frame: !0,
        frameset: !0,
        h1: !0,
        h2: !0,
        h3: !0,
        h4: !0,
        h5: !0,
        h6: !0,
        head: !0,
        header: !0,
        hgroup: !0,
        hr: !0,
        html: !0,
        iframe: !0,
        img: !0,
        input: !0,
        li: !0,
        link: !0,
        listing: !0,
        main: !0,
        marquee: !0,
        menu: !0,
        meta: !0,
        nav: !0,
        noembed: !0,
        noframes: !0,
        noscript: !0,
        object: !0,
        ol: !0,
        p: !0,
        param: !0,
        plaintext: !0,
        pre: !0,
        script: !0,
        section: !0,
        select: !0,
        source: !0,
        style: !0,
        summary: !0,
        table: !0,
        tbody: !0,
        td: !0,
        template: !0,
        textarea: !0,
        tfoot: !0,
        th: !0,
        thead: !0,
        title: !0,
        tr: !0,
        track: !0,
        ul: !0,
        wbr: !0,
        xmp: !0,
      }),
        (T[s.SVG] = {
          __proto__: null,
          foreignObject: !0,
          desc: !0,
          title: !0,
        }),
        (T[s.MATHML] = {
          __proto__: null,
          mi: !0,
          mo: !0,
          mn: !0,
          ms: !0,
          mtext: !0,
          "annotation-xml": !0,
        });
      var E = Object.create(null);
      E[s.HTML] = { __proto__: null, address: !0, div: !0, p: !0 };
      var ee = Object.create(null);
      ee[s.HTML] = { __proto__: null, dd: !0, dt: !0 };
      var ne = Object.create(null);
      ne[s.HTML] = {
        __proto__: null,
        table: !0,
        thead: !0,
        tbody: !0,
        tfoot: !0,
        tr: !0,
      };
      var me = Object.create(null);
      me[s.HTML] = {
        __proto__: null,
        dd: !0,
        dt: !0,
        li: !0,
        menuitem: !0,
        optgroup: !0,
        option: !0,
        p: !0,
        rb: !0,
        rp: !0,
        rt: !0,
        rtc: !0,
      };
      var q = Object.create(null);
      q[s.HTML] = {
        __proto__: null,
        caption: !0,
        colgroup: !0,
        dd: !0,
        dt: !0,
        li: !0,
        optgroup: !0,
        option: !0,
        p: !0,
        rb: !0,
        rp: !0,
        rt: !0,
        rtc: !0,
        tbody: !0,
        td: !0,
        tfoot: !0,
        th: !0,
        thead: !0,
        tr: !0,
      };
      var O = Object.create(null);
      O[s.HTML] = { __proto__: null, table: !0, template: !0, html: !0 };
      var j = Object.create(null);
      j[s.HTML] = {
        __proto__: null,
        tbody: !0,
        tfoot: !0,
        thead: !0,
        template: !0,
        html: !0,
      };
      var Y = Object.create(null);
      Y[s.HTML] = { __proto__: null, tr: !0, template: !0, html: !0 };
      var v = Object.create(null);
      v[s.HTML] = {
        __proto__: null,
        button: !0,
        fieldset: !0,
        input: !0,
        keygen: !0,
        object: !0,
        output: !0,
        select: !0,
        textarea: !0,
        img: !0,
      };
      var g = Object.create(null);
      (g[s.HTML] = {
        __proto__: null,
        applet: !0,
        caption: !0,
        html: !0,
        table: !0,
        td: !0,
        th: !0,
        marquee: !0,
        object: !0,
        template: !0,
      }),
        (g[s.MATHML] = {
          __proto__: null,
          mi: !0,
          mo: !0,
          mn: !0,
          ms: !0,
          mtext: !0,
          "annotation-xml": !0,
        }),
        (g[s.SVG] = {
          __proto__: null,
          foreignObject: !0,
          desc: !0,
          title: !0,
        });
      var p = Object.create(g);
      (p[s.HTML] = Object.create(g[s.HTML])),
        (p[s.HTML].ol = !0),
        (p[s.HTML].ul = !0);
      var y = Object.create(g);
      (y[s.HTML] = Object.create(g[s.HTML])), (y[s.HTML].button = !0);
      var C = Object.create(null);
      C[s.HTML] = { __proto__: null, html: !0, table: !0, template: !0 };
      var R = Object.create(null);
      R[s.HTML] = { __proto__: null, optgroup: !0, option: !0 };
      var V = Object.create(null);
      V[s.MATHML] = {
        __proto__: null,
        mi: !0,
        mo: !0,
        mn: !0,
        ms: !0,
        mtext: !0,
      };
      var Q = Object.create(null);
      Q[s.SVG] = { __proto__: null, foreignObject: !0, desc: !0, title: !0 };
      var he = {
          __proto__: null,
          "xlink:actuate": s.XLINK,
          "xlink:arcrole": s.XLINK,
          "xlink:href": s.XLINK,
          "xlink:role": s.XLINK,
          "xlink:show": s.XLINK,
          "xlink:title": s.XLINK,
          "xlink:type": s.XLINK,
          "xml:base": s.XML,
          "xml:lang": s.XML,
          "xml:space": s.XML,
          xmlns: s.XMLNS,
          "xmlns:xlink": s.XMLNS,
        },
        S = {
          __proto__: null,
          attributename: "attributeName",
          attributetype: "attributeType",
          basefrequency: "baseFrequency",
          baseprofile: "baseProfile",
          calcmode: "calcMode",
          clippathunits: "clipPathUnits",
          diffuseconstant: "diffuseConstant",
          edgemode: "edgeMode",
          filterunits: "filterUnits",
          glyphref: "glyphRef",
          gradienttransform: "gradientTransform",
          gradientunits: "gradientUnits",
          kernelmatrix: "kernelMatrix",
          kernelunitlength: "kernelUnitLength",
          keypoints: "keyPoints",
          keysplines: "keySplines",
          keytimes: "keyTimes",
          lengthadjust: "lengthAdjust",
          limitingconeangle: "limitingConeAngle",
          markerheight: "markerHeight",
          markerunits: "markerUnits",
          markerwidth: "markerWidth",
          maskcontentunits: "maskContentUnits",
          maskunits: "maskUnits",
          numoctaves: "numOctaves",
          pathlength: "pathLength",
          patterncontentunits: "patternContentUnits",
          patterntransform: "patternTransform",
          patternunits: "patternUnits",
          pointsatx: "pointsAtX",
          pointsaty: "pointsAtY",
          pointsatz: "pointsAtZ",
          preservealpha: "preserveAlpha",
          preserveaspectratio: "preserveAspectRatio",
          primitiveunits: "primitiveUnits",
          refx: "refX",
          refy: "refY",
          repeatcount: "repeatCount",
          repeatdur: "repeatDur",
          requiredextensions: "requiredExtensions",
          requiredfeatures: "requiredFeatures",
          specularconstant: "specularConstant",
          specularexponent: "specularExponent",
          spreadmethod: "spreadMethod",
          startoffset: "startOffset",
          stddeviation: "stdDeviation",
          stitchtiles: "stitchTiles",
          surfacescale: "surfaceScale",
          systemlanguage: "systemLanguage",
          tablevalues: "tableValues",
          targetx: "targetX",
          targety: "targetY",
          textlength: "textLength",
          viewbox: "viewBox",
          viewtarget: "viewTarget",
          xchannelselector: "xChannelSelector",
          ychannelselector: "yChannelSelector",
          zoomandpan: "zoomAndPan",
        },
        k = {
          __proto__: null,
          altglyph: "altGlyph",
          altglyphdef: "altGlyphDef",
          altglyphitem: "altGlyphItem",
          animatecolor: "animateColor",
          animatemotion: "animateMotion",
          animatetransform: "animateTransform",
          clippath: "clipPath",
          feblend: "feBlend",
          fecolormatrix: "feColorMatrix",
          fecomponenttransfer: "feComponentTransfer",
          fecomposite: "feComposite",
          feconvolvematrix: "feConvolveMatrix",
          fediffuselighting: "feDiffuseLighting",
          fedisplacementmap: "feDisplacementMap",
          fedistantlight: "feDistantLight",
          feflood: "feFlood",
          fefunca: "feFuncA",
          fefuncb: "feFuncB",
          fefuncg: "feFuncG",
          fefuncr: "feFuncR",
          fegaussianblur: "feGaussianBlur",
          feimage: "feImage",
          femerge: "feMerge",
          femergenode: "feMergeNode",
          femorphology: "feMorphology",
          feoffset: "feOffset",
          fepointlight: "fePointLight",
          fespecularlighting: "feSpecularLighting",
          fespotlight: "feSpotLight",
          fetile: "feTile",
          feturbulence: "feTurbulence",
          foreignobject: "foreignObject",
          glyphref: "glyphRef",
          lineargradient: "linearGradient",
          radialgradient: "radialGradient",
          textpath: "textPath",
        },
        $ = {
          __proto__: null,
          0: 65533,
          128: 8364,
          130: 8218,
          131: 402,
          132: 8222,
          133: 8230,
          134: 8224,
          135: 8225,
          136: 710,
          137: 8240,
          138: 352,
          139: 8249,
          140: 338,
          142: 381,
          145: 8216,
          146: 8217,
          147: 8220,
          148: 8221,
          149: 8226,
          150: 8211,
          151: 8212,
          152: 732,
          153: 8482,
          154: 353,
          155: 8250,
          156: 339,
          158: 382,
          159: 376,
        },
        _e = {
          __proto__: null,
          AElig: 198,
          "AElig;": 198,
          AMP: 38,
          "AMP;": 38,
          Aacute: 193,
          "Aacute;": 193,
          "Abreve;": 258,
          Acirc: 194,
          "Acirc;": 194,
          "Acy;": 1040,
          "Afr;": [55349, 56580],
          Agrave: 192,
          "Agrave;": 192,
          "Alpha;": 913,
          "Amacr;": 256,
          "And;": 10835,
          "Aogon;": 260,
          "Aopf;": [55349, 56632],
          "ApplyFunction;": 8289,
          Aring: 197,
          "Aring;": 197,
          "Ascr;": [55349, 56476],
          "Assign;": 8788,
          Atilde: 195,
          "Atilde;": 195,
          Auml: 196,
          "Auml;": 196,
          "Backslash;": 8726,
          "Barv;": 10983,
          "Barwed;": 8966,
          "Bcy;": 1041,
          "Because;": 8757,
          "Bernoullis;": 8492,
          "Beta;": 914,
          "Bfr;": [55349, 56581],
          "Bopf;": [55349, 56633],
          "Breve;": 728,
          "Bscr;": 8492,
          "Bumpeq;": 8782,
          "CHcy;": 1063,
          COPY: 169,
          "COPY;": 169,
          "Cacute;": 262,
          "Cap;": 8914,
          "CapitalDifferentialD;": 8517,
          "Cayleys;": 8493,
          "Ccaron;": 268,
          Ccedil: 199,
          "Ccedil;": 199,
          "Ccirc;": 264,
          "Cconint;": 8752,
          "Cdot;": 266,
          "Cedilla;": 184,
          "CenterDot;": 183,
          "Cfr;": 8493,
          "Chi;": 935,
          "CircleDot;": 8857,
          "CircleMinus;": 8854,
          "CirclePlus;": 8853,
          "CircleTimes;": 8855,
          "ClockwiseContourIntegral;": 8754,
          "CloseCurlyDoubleQuote;": 8221,
          "CloseCurlyQuote;": 8217,
          "Colon;": 8759,
          "Colone;": 10868,
          "Congruent;": 8801,
          "Conint;": 8751,
          "ContourIntegral;": 8750,
          "Copf;": 8450,
          "Coproduct;": 8720,
          "CounterClockwiseContourIntegral;": 8755,
          "Cross;": 10799,
          "Cscr;": [55349, 56478],
          "Cup;": 8915,
          "CupCap;": 8781,
          "DD;": 8517,
          "DDotrahd;": 10513,
          "DJcy;": 1026,
          "DScy;": 1029,
          "DZcy;": 1039,
          "Dagger;": 8225,
          "Darr;": 8609,
          "Dashv;": 10980,
          "Dcaron;": 270,
          "Dcy;": 1044,
          "Del;": 8711,
          "Delta;": 916,
          "Dfr;": [55349, 56583],
          "DiacriticalAcute;": 180,
          "DiacriticalDot;": 729,
          "DiacriticalDoubleAcute;": 733,
          "DiacriticalGrave;": 96,
          "DiacriticalTilde;": 732,
          "Diamond;": 8900,
          "DifferentialD;": 8518,
          "Dopf;": [55349, 56635],
          "Dot;": 168,
          "DotDot;": 8412,
          "DotEqual;": 8784,
          "DoubleContourIntegral;": 8751,
          "DoubleDot;": 168,
          "DoubleDownArrow;": 8659,
          "DoubleLeftArrow;": 8656,
          "DoubleLeftRightArrow;": 8660,
          "DoubleLeftTee;": 10980,
          "DoubleLongLeftArrow;": 10232,
          "DoubleLongLeftRightArrow;": 10234,
          "DoubleLongRightArrow;": 10233,
          "DoubleRightArrow;": 8658,
          "DoubleRightTee;": 8872,
          "DoubleUpArrow;": 8657,
          "DoubleUpDownArrow;": 8661,
          "DoubleVerticalBar;": 8741,
          "DownArrow;": 8595,
          "DownArrowBar;": 10515,
          "DownArrowUpArrow;": 8693,
          "DownBreve;": 785,
          "DownLeftRightVector;": 10576,
          "DownLeftTeeVector;": 10590,
          "DownLeftVector;": 8637,
          "DownLeftVectorBar;": 10582,
          "DownRightTeeVector;": 10591,
          "DownRightVector;": 8641,
          "DownRightVectorBar;": 10583,
          "DownTee;": 8868,
          "DownTeeArrow;": 8615,
          "Downarrow;": 8659,
          "Dscr;": [55349, 56479],
          "Dstrok;": 272,
          "ENG;": 330,
          ETH: 208,
          "ETH;": 208,
          Eacute: 201,
          "Eacute;": 201,
          "Ecaron;": 282,
          Ecirc: 202,
          "Ecirc;": 202,
          "Ecy;": 1069,
          "Edot;": 278,
          "Efr;": [55349, 56584],
          Egrave: 200,
          "Egrave;": 200,
          "Element;": 8712,
          "Emacr;": 274,
          "EmptySmallSquare;": 9723,
          "EmptyVerySmallSquare;": 9643,
          "Eogon;": 280,
          "Eopf;": [55349, 56636],
          "Epsilon;": 917,
          "Equal;": 10869,
          "EqualTilde;": 8770,
          "Equilibrium;": 8652,
          "Escr;": 8496,
          "Esim;": 10867,
          "Eta;": 919,
          Euml: 203,
          "Euml;": 203,
          "Exists;": 8707,
          "ExponentialE;": 8519,
          "Fcy;": 1060,
          "Ffr;": [55349, 56585],
          "FilledSmallSquare;": 9724,
          "FilledVerySmallSquare;": 9642,
          "Fopf;": [55349, 56637],
          "ForAll;": 8704,
          "Fouriertrf;": 8497,
          "Fscr;": 8497,
          "GJcy;": 1027,
          GT: 62,
          "GT;": 62,
          "Gamma;": 915,
          "Gammad;": 988,
          "Gbreve;": 286,
          "Gcedil;": 290,
          "Gcirc;": 284,
          "Gcy;": 1043,
          "Gdot;": 288,
          "Gfr;": [55349, 56586],
          "Gg;": 8921,
          "Gopf;": [55349, 56638],
          "GreaterEqual;": 8805,
          "GreaterEqualLess;": 8923,
          "GreaterFullEqual;": 8807,
          "GreaterGreater;": 10914,
          "GreaterLess;": 8823,
          "GreaterSlantEqual;": 10878,
          "GreaterTilde;": 8819,
          "Gscr;": [55349, 56482],
          "Gt;": 8811,
          "HARDcy;": 1066,
          "Hacek;": 711,
          "Hat;": 94,
          "Hcirc;": 292,
          "Hfr;": 8460,
          "HilbertSpace;": 8459,
          "Hopf;": 8461,
          "HorizontalLine;": 9472,
          "Hscr;": 8459,
          "Hstrok;": 294,
          "HumpDownHump;": 8782,
          "HumpEqual;": 8783,
          "IEcy;": 1045,
          "IJlig;": 306,
          "IOcy;": 1025,
          Iacute: 205,
          "Iacute;": 205,
          Icirc: 206,
          "Icirc;": 206,
          "Icy;": 1048,
          "Idot;": 304,
          "Ifr;": 8465,
          Igrave: 204,
          "Igrave;": 204,
          "Im;": 8465,
          "Imacr;": 298,
          "ImaginaryI;": 8520,
          "Implies;": 8658,
          "Int;": 8748,
          "Integral;": 8747,
          "Intersection;": 8898,
          "InvisibleComma;": 8291,
          "InvisibleTimes;": 8290,
          "Iogon;": 302,
          "Iopf;": [55349, 56640],
          "Iota;": 921,
          "Iscr;": 8464,
          "Itilde;": 296,
          "Iukcy;": 1030,
          Iuml: 207,
          "Iuml;": 207,
          "Jcirc;": 308,
          "Jcy;": 1049,
          "Jfr;": [55349, 56589],
          "Jopf;": [55349, 56641],
          "Jscr;": [55349, 56485],
          "Jsercy;": 1032,
          "Jukcy;": 1028,
          "KHcy;": 1061,
          "KJcy;": 1036,
          "Kappa;": 922,
          "Kcedil;": 310,
          "Kcy;": 1050,
          "Kfr;": [55349, 56590],
          "Kopf;": [55349, 56642],
          "Kscr;": [55349, 56486],
          "LJcy;": 1033,
          LT: 60,
          "LT;": 60,
          "Lacute;": 313,
          "Lambda;": 923,
          "Lang;": 10218,
          "Laplacetrf;": 8466,
          "Larr;": 8606,
          "Lcaron;": 317,
          "Lcedil;": 315,
          "Lcy;": 1051,
          "LeftAngleBracket;": 10216,
          "LeftArrow;": 8592,
          "LeftArrowBar;": 8676,
          "LeftArrowRightArrow;": 8646,
          "LeftCeiling;": 8968,
          "LeftDoubleBracket;": 10214,
          "LeftDownTeeVector;": 10593,
          "LeftDownVector;": 8643,
          "LeftDownVectorBar;": 10585,
          "LeftFloor;": 8970,
          "LeftRightArrow;": 8596,
          "LeftRightVector;": 10574,
          "LeftTee;": 8867,
          "LeftTeeArrow;": 8612,
          "LeftTeeVector;": 10586,
          "LeftTriangle;": 8882,
          "LeftTriangleBar;": 10703,
          "LeftTriangleEqual;": 8884,
          "LeftUpDownVector;": 10577,
          "LeftUpTeeVector;": 10592,
          "LeftUpVector;": 8639,
          "LeftUpVectorBar;": 10584,
          "LeftVector;": 8636,
          "LeftVectorBar;": 10578,
          "Leftarrow;": 8656,
          "Leftrightarrow;": 8660,
          "LessEqualGreater;": 8922,
          "LessFullEqual;": 8806,
          "LessGreater;": 8822,
          "LessLess;": 10913,
          "LessSlantEqual;": 10877,
          "LessTilde;": 8818,
          "Lfr;": [55349, 56591],
          "Ll;": 8920,
          "Lleftarrow;": 8666,
          "Lmidot;": 319,
          "LongLeftArrow;": 10229,
          "LongLeftRightArrow;": 10231,
          "LongRightArrow;": 10230,
          "Longleftarrow;": 10232,
          "Longleftrightarrow;": 10234,
          "Longrightarrow;": 10233,
          "Lopf;": [55349, 56643],
          "LowerLeftArrow;": 8601,
          "LowerRightArrow;": 8600,
          "Lscr;": 8466,
          "Lsh;": 8624,
          "Lstrok;": 321,
          "Lt;": 8810,
          "Map;": 10501,
          "Mcy;": 1052,
          "MediumSpace;": 8287,
          "Mellintrf;": 8499,
          "Mfr;": [55349, 56592],
          "MinusPlus;": 8723,
          "Mopf;": [55349, 56644],
          "Mscr;": 8499,
          "Mu;": 924,
          "NJcy;": 1034,
          "Nacute;": 323,
          "Ncaron;": 327,
          "Ncedil;": 325,
          "Ncy;": 1053,
          "NegativeMediumSpace;": 8203,
          "NegativeThickSpace;": 8203,
          "NegativeThinSpace;": 8203,
          "NegativeVeryThinSpace;": 8203,
          "NestedGreaterGreater;": 8811,
          "NestedLessLess;": 8810,
          "NewLine;": 10,
          "Nfr;": [55349, 56593],
          "NoBreak;": 8288,
          "NonBreakingSpace;": 160,
          "Nopf;": 8469,
          "Not;": 10988,
          "NotCongruent;": 8802,
          "NotCupCap;": 8813,
          "NotDoubleVerticalBar;": 8742,
          "NotElement;": 8713,
          "NotEqual;": 8800,
          "NotEqualTilde;": [8770, 824],
          "NotExists;": 8708,
          "NotGreater;": 8815,
          "NotGreaterEqual;": 8817,
          "NotGreaterFullEqual;": [8807, 824],
          "NotGreaterGreater;": [8811, 824],
          "NotGreaterLess;": 8825,
          "NotGreaterSlantEqual;": [10878, 824],
          "NotGreaterTilde;": 8821,
          "NotHumpDownHump;": [8782, 824],
          "NotHumpEqual;": [8783, 824],
          "NotLeftTriangle;": 8938,
          "NotLeftTriangleBar;": [10703, 824],
          "NotLeftTriangleEqual;": 8940,
          "NotLess;": 8814,
          "NotLessEqual;": 8816,
          "NotLessGreater;": 8824,
          "NotLessLess;": [8810, 824],
          "NotLessSlantEqual;": [10877, 824],
          "NotLessTilde;": 8820,
          "NotNestedGreaterGreater;": [10914, 824],
          "NotNestedLessLess;": [10913, 824],
          "NotPrecedes;": 8832,
          "NotPrecedesEqual;": [10927, 824],
          "NotPrecedesSlantEqual;": 8928,
          "NotReverseElement;": 8716,
          "NotRightTriangle;": 8939,
          "NotRightTriangleBar;": [10704, 824],
          "NotRightTriangleEqual;": 8941,
          "NotSquareSubset;": [8847, 824],
          "NotSquareSubsetEqual;": 8930,
          "NotSquareSuperset;": [8848, 824],
          "NotSquareSupersetEqual;": 8931,
          "NotSubset;": [8834, 8402],
          "NotSubsetEqual;": 8840,
          "NotSucceeds;": 8833,
          "NotSucceedsEqual;": [10928, 824],
          "NotSucceedsSlantEqual;": 8929,
          "NotSucceedsTilde;": [8831, 824],
          "NotSuperset;": [8835, 8402],
          "NotSupersetEqual;": 8841,
          "NotTilde;": 8769,
          "NotTildeEqual;": 8772,
          "NotTildeFullEqual;": 8775,
          "NotTildeTilde;": 8777,
          "NotVerticalBar;": 8740,
          "Nscr;": [55349, 56489],
          Ntilde: 209,
          "Ntilde;": 209,
          "Nu;": 925,
          "OElig;": 338,
          Oacute: 211,
          "Oacute;": 211,
          Ocirc: 212,
          "Ocirc;": 212,
          "Ocy;": 1054,
          "Odblac;": 336,
          "Ofr;": [55349, 56594],
          Ograve: 210,
          "Ograve;": 210,
          "Omacr;": 332,
          "Omega;": 937,
          "Omicron;": 927,
          "Oopf;": [55349, 56646],
          "OpenCurlyDoubleQuote;": 8220,
          "OpenCurlyQuote;": 8216,
          "Or;": 10836,
          "Oscr;": [55349, 56490],
          Oslash: 216,
          "Oslash;": 216,
          Otilde: 213,
          "Otilde;": 213,
          "Otimes;": 10807,
          Ouml: 214,
          "Ouml;": 214,
          "OverBar;": 8254,
          "OverBrace;": 9182,
          "OverBracket;": 9140,
          "OverParenthesis;": 9180,
          "PartialD;": 8706,
          "Pcy;": 1055,
          "Pfr;": [55349, 56595],
          "Phi;": 934,
          "Pi;": 928,
          "PlusMinus;": 177,
          "Poincareplane;": 8460,
          "Popf;": 8473,
          "Pr;": 10939,
          "Precedes;": 8826,
          "PrecedesEqual;": 10927,
          "PrecedesSlantEqual;": 8828,
          "PrecedesTilde;": 8830,
          "Prime;": 8243,
          "Product;": 8719,
          "Proportion;": 8759,
          "Proportional;": 8733,
          "Pscr;": [55349, 56491],
          "Psi;": 936,
          QUOT: 34,
          "QUOT;": 34,
          "Qfr;": [55349, 56596],
          "Qopf;": 8474,
          "Qscr;": [55349, 56492],
          "RBarr;": 10512,
          REG: 174,
          "REG;": 174,
          "Racute;": 340,
          "Rang;": 10219,
          "Rarr;": 8608,
          "Rarrtl;": 10518,
          "Rcaron;": 344,
          "Rcedil;": 342,
          "Rcy;": 1056,
          "Re;": 8476,
          "ReverseElement;": 8715,
          "ReverseEquilibrium;": 8651,
          "ReverseUpEquilibrium;": 10607,
          "Rfr;": 8476,
          "Rho;": 929,
          "RightAngleBracket;": 10217,
          "RightArrow;": 8594,
          "RightArrowBar;": 8677,
          "RightArrowLeftArrow;": 8644,
          "RightCeiling;": 8969,
          "RightDoubleBracket;": 10215,
          "RightDownTeeVector;": 10589,
          "RightDownVector;": 8642,
          "RightDownVectorBar;": 10581,
          "RightFloor;": 8971,
          "RightTee;": 8866,
          "RightTeeArrow;": 8614,
          "RightTeeVector;": 10587,
          "RightTriangle;": 8883,
          "RightTriangleBar;": 10704,
          "RightTriangleEqual;": 8885,
          "RightUpDownVector;": 10575,
          "RightUpTeeVector;": 10588,
          "RightUpVector;": 8638,
          "RightUpVectorBar;": 10580,
          "RightVector;": 8640,
          "RightVectorBar;": 10579,
          "Rightarrow;": 8658,
          "Ropf;": 8477,
          "RoundImplies;": 10608,
          "Rrightarrow;": 8667,
          "Rscr;": 8475,
          "Rsh;": 8625,
          "RuleDelayed;": 10740,
          "SHCHcy;": 1065,
          "SHcy;": 1064,
          "SOFTcy;": 1068,
          "Sacute;": 346,
          "Sc;": 10940,
          "Scaron;": 352,
          "Scedil;": 350,
          "Scirc;": 348,
          "Scy;": 1057,
          "Sfr;": [55349, 56598],
          "ShortDownArrow;": 8595,
          "ShortLeftArrow;": 8592,
          "ShortRightArrow;": 8594,
          "ShortUpArrow;": 8593,
          "Sigma;": 931,
          "SmallCircle;": 8728,
          "Sopf;": [55349, 56650],
          "Sqrt;": 8730,
          "Square;": 9633,
          "SquareIntersection;": 8851,
          "SquareSubset;": 8847,
          "SquareSubsetEqual;": 8849,
          "SquareSuperset;": 8848,
          "SquareSupersetEqual;": 8850,
          "SquareUnion;": 8852,
          "Sscr;": [55349, 56494],
          "Star;": 8902,
          "Sub;": 8912,
          "Subset;": 8912,
          "SubsetEqual;": 8838,
          "Succeeds;": 8827,
          "SucceedsEqual;": 10928,
          "SucceedsSlantEqual;": 8829,
          "SucceedsTilde;": 8831,
          "SuchThat;": 8715,
          "Sum;": 8721,
          "Sup;": 8913,
          "Superset;": 8835,
          "SupersetEqual;": 8839,
          "Supset;": 8913,
          THORN: 222,
          "THORN;": 222,
          "TRADE;": 8482,
          "TSHcy;": 1035,
          "TScy;": 1062,
          "Tab;": 9,
          "Tau;": 932,
          "Tcaron;": 356,
          "Tcedil;": 354,
          "Tcy;": 1058,
          "Tfr;": [55349, 56599],
          "Therefore;": 8756,
          "Theta;": 920,
          "ThickSpace;": [8287, 8202],
          "ThinSpace;": 8201,
          "Tilde;": 8764,
          "TildeEqual;": 8771,
          "TildeFullEqual;": 8773,
          "TildeTilde;": 8776,
          "Topf;": [55349, 56651],
          "TripleDot;": 8411,
          "Tscr;": [55349, 56495],
          "Tstrok;": 358,
          Uacute: 218,
          "Uacute;": 218,
          "Uarr;": 8607,
          "Uarrocir;": 10569,
          "Ubrcy;": 1038,
          "Ubreve;": 364,
          Ucirc: 219,
          "Ucirc;": 219,
          "Ucy;": 1059,
          "Udblac;": 368,
          "Ufr;": [55349, 56600],
          Ugrave: 217,
          "Ugrave;": 217,
          "Umacr;": 362,
          "UnderBar;": 95,
          "UnderBrace;": 9183,
          "UnderBracket;": 9141,
          "UnderParenthesis;": 9181,
          "Union;": 8899,
          "UnionPlus;": 8846,
          "Uogon;": 370,
          "Uopf;": [55349, 56652],
          "UpArrow;": 8593,
          "UpArrowBar;": 10514,
          "UpArrowDownArrow;": 8645,
          "UpDownArrow;": 8597,
          "UpEquilibrium;": 10606,
          "UpTee;": 8869,
          "UpTeeArrow;": 8613,
          "Uparrow;": 8657,
          "Updownarrow;": 8661,
          "UpperLeftArrow;": 8598,
          "UpperRightArrow;": 8599,
          "Upsi;": 978,
          "Upsilon;": 933,
          "Uring;": 366,
          "Uscr;": [55349, 56496],
          "Utilde;": 360,
          Uuml: 220,
          "Uuml;": 220,
          "VDash;": 8875,
          "Vbar;": 10987,
          "Vcy;": 1042,
          "Vdash;": 8873,
          "Vdashl;": 10982,
          "Vee;": 8897,
          "Verbar;": 8214,
          "Vert;": 8214,
          "VerticalBar;": 8739,
          "VerticalLine;": 124,
          "VerticalSeparator;": 10072,
          "VerticalTilde;": 8768,
          "VeryThinSpace;": 8202,
          "Vfr;": [55349, 56601],
          "Vopf;": [55349, 56653],
          "Vscr;": [55349, 56497],
          "Vvdash;": 8874,
          "Wcirc;": 372,
          "Wedge;": 8896,
          "Wfr;": [55349, 56602],
          "Wopf;": [55349, 56654],
          "Wscr;": [55349, 56498],
          "Xfr;": [55349, 56603],
          "Xi;": 926,
          "Xopf;": [55349, 56655],
          "Xscr;": [55349, 56499],
          "YAcy;": 1071,
          "YIcy;": 1031,
          "YUcy;": 1070,
          Yacute: 221,
          "Yacute;": 221,
          "Ycirc;": 374,
          "Ycy;": 1067,
          "Yfr;": [55349, 56604],
          "Yopf;": [55349, 56656],
          "Yscr;": [55349, 56500],
          "Yuml;": 376,
          "ZHcy;": 1046,
          "Zacute;": 377,
          "Zcaron;": 381,
          "Zcy;": 1047,
          "Zdot;": 379,
          "ZeroWidthSpace;": 8203,
          "Zeta;": 918,
          "Zfr;": 8488,
          "Zopf;": 8484,
          "Zscr;": [55349, 56501],
          aacute: 225,
          "aacute;": 225,
          "abreve;": 259,
          "ac;": 8766,
          "acE;": [8766, 819],
          "acd;": 8767,
          acirc: 226,
          "acirc;": 226,
          acute: 180,
          "acute;": 180,
          "acy;": 1072,
          aelig: 230,
          "aelig;": 230,
          "af;": 8289,
          "afr;": [55349, 56606],
          agrave: 224,
          "agrave;": 224,
          "alefsym;": 8501,
          "aleph;": 8501,
          "alpha;": 945,
          "amacr;": 257,
          "amalg;": 10815,
          amp: 38,
          "amp;": 38,
          "and;": 8743,
          "andand;": 10837,
          "andd;": 10844,
          "andslope;": 10840,
          "andv;": 10842,
          "ang;": 8736,
          "ange;": 10660,
          "angle;": 8736,
          "angmsd;": 8737,
          "angmsdaa;": 10664,
          "angmsdab;": 10665,
          "angmsdac;": 10666,
          "angmsdad;": 10667,
          "angmsdae;": 10668,
          "angmsdaf;": 10669,
          "angmsdag;": 10670,
          "angmsdah;": 10671,
          "angrt;": 8735,
          "angrtvb;": 8894,
          "angrtvbd;": 10653,
          "angsph;": 8738,
          "angst;": 197,
          "angzarr;": 9084,
          "aogon;": 261,
          "aopf;": [55349, 56658],
          "ap;": 8776,
          "apE;": 10864,
          "apacir;": 10863,
          "ape;": 8778,
          "apid;": 8779,
          "apos;": 39,
          "approx;": 8776,
          "approxeq;": 8778,
          aring: 229,
          "aring;": 229,
          "ascr;": [55349, 56502],
          "ast;": 42,
          "asymp;": 8776,
          "asympeq;": 8781,
          atilde: 227,
          "atilde;": 227,
          auml: 228,
          "auml;": 228,
          "awconint;": 8755,
          "awint;": 10769,
          "bNot;": 10989,
          "backcong;": 8780,
          "backepsilon;": 1014,
          "backprime;": 8245,
          "backsim;": 8765,
          "backsimeq;": 8909,
          "barvee;": 8893,
          "barwed;": 8965,
          "barwedge;": 8965,
          "bbrk;": 9141,
          "bbrktbrk;": 9142,
          "bcong;": 8780,
          "bcy;": 1073,
          "bdquo;": 8222,
          "becaus;": 8757,
          "because;": 8757,
          "bemptyv;": 10672,
          "bepsi;": 1014,
          "bernou;": 8492,
          "beta;": 946,
          "beth;": 8502,
          "between;": 8812,
          "bfr;": [55349, 56607],
          "bigcap;": 8898,
          "bigcirc;": 9711,
          "bigcup;": 8899,
          "bigodot;": 10752,
          "bigoplus;": 10753,
          "bigotimes;": 10754,
          "bigsqcup;": 10758,
          "bigstar;": 9733,
          "bigtriangledown;": 9661,
          "bigtriangleup;": 9651,
          "biguplus;": 10756,
          "bigvee;": 8897,
          "bigwedge;": 8896,
          "bkarow;": 10509,
          "blacklozenge;": 10731,
          "blacksquare;": 9642,
          "blacktriangle;": 9652,
          "blacktriangledown;": 9662,
          "blacktriangleleft;": 9666,
          "blacktriangleright;": 9656,
          "blank;": 9251,
          "blk12;": 9618,
          "blk14;": 9617,
          "blk34;": 9619,
          "block;": 9608,
          "bne;": [61, 8421],
          "bnequiv;": [8801, 8421],
          "bnot;": 8976,
          "bopf;": [55349, 56659],
          "bot;": 8869,
          "bottom;": 8869,
          "bowtie;": 8904,
          "boxDL;": 9559,
          "boxDR;": 9556,
          "boxDl;": 9558,
          "boxDr;": 9555,
          "boxH;": 9552,
          "boxHD;": 9574,
          "boxHU;": 9577,
          "boxHd;": 9572,
          "boxHu;": 9575,
          "boxUL;": 9565,
          "boxUR;": 9562,
          "boxUl;": 9564,
          "boxUr;": 9561,
          "boxV;": 9553,
          "boxVH;": 9580,
          "boxVL;": 9571,
          "boxVR;": 9568,
          "boxVh;": 9579,
          "boxVl;": 9570,
          "boxVr;": 9567,
          "boxbox;": 10697,
          "boxdL;": 9557,
          "boxdR;": 9554,
          "boxdl;": 9488,
          "boxdr;": 9484,
          "boxh;": 9472,
          "boxhD;": 9573,
          "boxhU;": 9576,
          "boxhd;": 9516,
          "boxhu;": 9524,
          "boxminus;": 8863,
          "boxplus;": 8862,
          "boxtimes;": 8864,
          "boxuL;": 9563,
          "boxuR;": 9560,
          "boxul;": 9496,
          "boxur;": 9492,
          "boxv;": 9474,
          "boxvH;": 9578,
          "boxvL;": 9569,
          "boxvR;": 9566,
          "boxvh;": 9532,
          "boxvl;": 9508,
          "boxvr;": 9500,
          "bprime;": 8245,
          "breve;": 728,
          brvbar: 166,
          "brvbar;": 166,
          "bscr;": [55349, 56503],
          "bsemi;": 8271,
          "bsim;": 8765,
          "bsime;": 8909,
          "bsol;": 92,
          "bsolb;": 10693,
          "bsolhsub;": 10184,
          "bull;": 8226,
          "bullet;": 8226,
          "bump;": 8782,
          "bumpE;": 10926,
          "bumpe;": 8783,
          "bumpeq;": 8783,
          "cacute;": 263,
          "cap;": 8745,
          "capand;": 10820,
          "capbrcup;": 10825,
          "capcap;": 10827,
          "capcup;": 10823,
          "capdot;": 10816,
          "caps;": [8745, 65024],
          "caret;": 8257,
          "caron;": 711,
          "ccaps;": 10829,
          "ccaron;": 269,
          ccedil: 231,
          "ccedil;": 231,
          "ccirc;": 265,
          "ccups;": 10828,
          "ccupssm;": 10832,
          "cdot;": 267,
          cedil: 184,
          "cedil;": 184,
          "cemptyv;": 10674,
          cent: 162,
          "cent;": 162,
          "centerdot;": 183,
          "cfr;": [55349, 56608],
          "chcy;": 1095,
          "check;": 10003,
          "checkmark;": 10003,
          "chi;": 967,
          "cir;": 9675,
          "cirE;": 10691,
          "circ;": 710,
          "circeq;": 8791,
          "circlearrowleft;": 8634,
          "circlearrowright;": 8635,
          "circledR;": 174,
          "circledS;": 9416,
          "circledast;": 8859,
          "circledcirc;": 8858,
          "circleddash;": 8861,
          "cire;": 8791,
          "cirfnint;": 10768,
          "cirmid;": 10991,
          "cirscir;": 10690,
          "clubs;": 9827,
          "clubsuit;": 9827,
          "colon;": 58,
          "colone;": 8788,
          "coloneq;": 8788,
          "comma;": 44,
          "commat;": 64,
          "comp;": 8705,
          "compfn;": 8728,
          "complement;": 8705,
          "complexes;": 8450,
          "cong;": 8773,
          "congdot;": 10861,
          "conint;": 8750,
          "copf;": [55349, 56660],
          "coprod;": 8720,
          copy: 169,
          "copy;": 169,
          "copysr;": 8471,
          "crarr;": 8629,
          "cross;": 10007,
          "cscr;": [55349, 56504],
          "csub;": 10959,
          "csube;": 10961,
          "csup;": 10960,
          "csupe;": 10962,
          "ctdot;": 8943,
          "cudarrl;": 10552,
          "cudarrr;": 10549,
          "cuepr;": 8926,
          "cuesc;": 8927,
          "cularr;": 8630,
          "cularrp;": 10557,
          "cup;": 8746,
          "cupbrcap;": 10824,
          "cupcap;": 10822,
          "cupcup;": 10826,
          "cupdot;": 8845,
          "cupor;": 10821,
          "cups;": [8746, 65024],
          "curarr;": 8631,
          "curarrm;": 10556,
          "curlyeqprec;": 8926,
          "curlyeqsucc;": 8927,
          "curlyvee;": 8910,
          "curlywedge;": 8911,
          curren: 164,
          "curren;": 164,
          "curvearrowleft;": 8630,
          "curvearrowright;": 8631,
          "cuvee;": 8910,
          "cuwed;": 8911,
          "cwconint;": 8754,
          "cwint;": 8753,
          "cylcty;": 9005,
          "dArr;": 8659,
          "dHar;": 10597,
          "dagger;": 8224,
          "daleth;": 8504,
          "darr;": 8595,
          "dash;": 8208,
          "dashv;": 8867,
          "dbkarow;": 10511,
          "dblac;": 733,
          "dcaron;": 271,
          "dcy;": 1076,
          "dd;": 8518,
          "ddagger;": 8225,
          "ddarr;": 8650,
          "ddotseq;": 10871,
          deg: 176,
          "deg;": 176,
          "delta;": 948,
          "demptyv;": 10673,
          "dfisht;": 10623,
          "dfr;": [55349, 56609],
          "dharl;": 8643,
          "dharr;": 8642,
          "diam;": 8900,
          "diamond;": 8900,
          "diamondsuit;": 9830,
          "diams;": 9830,
          "die;": 168,
          "digamma;": 989,
          "disin;": 8946,
          "div;": 247,
          divide: 247,
          "divide;": 247,
          "divideontimes;": 8903,
          "divonx;": 8903,
          "djcy;": 1106,
          "dlcorn;": 8990,
          "dlcrop;": 8973,
          "dollar;": 36,
          "dopf;": [55349, 56661],
          "dot;": 729,
          "doteq;": 8784,
          "doteqdot;": 8785,
          "dotminus;": 8760,
          "dotplus;": 8724,
          "dotsquare;": 8865,
          "doublebarwedge;": 8966,
          "downarrow;": 8595,
          "downdownarrows;": 8650,
          "downharpoonleft;": 8643,
          "downharpoonright;": 8642,
          "drbkarow;": 10512,
          "drcorn;": 8991,
          "drcrop;": 8972,
          "dscr;": [55349, 56505],
          "dscy;": 1109,
          "dsol;": 10742,
          "dstrok;": 273,
          "dtdot;": 8945,
          "dtri;": 9663,
          "dtrif;": 9662,
          "duarr;": 8693,
          "duhar;": 10607,
          "dwangle;": 10662,
          "dzcy;": 1119,
          "dzigrarr;": 10239,
          "eDDot;": 10871,
          "eDot;": 8785,
          eacute: 233,
          "eacute;": 233,
          "easter;": 10862,
          "ecaron;": 283,
          "ecir;": 8790,
          ecirc: 234,
          "ecirc;": 234,
          "ecolon;": 8789,
          "ecy;": 1101,
          "edot;": 279,
          "ee;": 8519,
          "efDot;": 8786,
          "efr;": [55349, 56610],
          "eg;": 10906,
          egrave: 232,
          "egrave;": 232,
          "egs;": 10902,
          "egsdot;": 10904,
          "el;": 10905,
          "elinters;": 9191,
          "ell;": 8467,
          "els;": 10901,
          "elsdot;": 10903,
          "emacr;": 275,
          "empty;": 8709,
          "emptyset;": 8709,
          "emptyv;": 8709,
          "emsp13;": 8196,
          "emsp14;": 8197,
          "emsp;": 8195,
          "eng;": 331,
          "ensp;": 8194,
          "eogon;": 281,
          "eopf;": [55349, 56662],
          "epar;": 8917,
          "eparsl;": 10723,
          "eplus;": 10865,
          "epsi;": 949,
          "epsilon;": 949,
          "epsiv;": 1013,
          "eqcirc;": 8790,
          "eqcolon;": 8789,
          "eqsim;": 8770,
          "eqslantgtr;": 10902,
          "eqslantless;": 10901,
          "equals;": 61,
          "equest;": 8799,
          "equiv;": 8801,
          "equivDD;": 10872,
          "eqvparsl;": 10725,
          "erDot;": 8787,
          "erarr;": 10609,
          "escr;": 8495,
          "esdot;": 8784,
          "esim;": 8770,
          "eta;": 951,
          eth: 240,
          "eth;": 240,
          euml: 235,
          "euml;": 235,
          "euro;": 8364,
          "excl;": 33,
          "exist;": 8707,
          "expectation;": 8496,
          "exponentiale;": 8519,
          "fallingdotseq;": 8786,
          "fcy;": 1092,
          "female;": 9792,
          "ffilig;": 64259,
          "fflig;": 64256,
          "ffllig;": 64260,
          "ffr;": [55349, 56611],
          "filig;": 64257,
          "fjlig;": [102, 106],
          "flat;": 9837,
          "fllig;": 64258,
          "fltns;": 9649,
          "fnof;": 402,
          "fopf;": [55349, 56663],
          "forall;": 8704,
          "fork;": 8916,
          "forkv;": 10969,
          "fpartint;": 10765,
          frac12: 189,
          "frac12;": 189,
          "frac13;": 8531,
          frac14: 188,
          "frac14;": 188,
          "frac15;": 8533,
          "frac16;": 8537,
          "frac18;": 8539,
          "frac23;": 8532,
          "frac25;": 8534,
          frac34: 190,
          "frac34;": 190,
          "frac35;": 8535,
          "frac38;": 8540,
          "frac45;": 8536,
          "frac56;": 8538,
          "frac58;": 8541,
          "frac78;": 8542,
          "frasl;": 8260,
          "frown;": 8994,
          "fscr;": [55349, 56507],
          "gE;": 8807,
          "gEl;": 10892,
          "gacute;": 501,
          "gamma;": 947,
          "gammad;": 989,
          "gap;": 10886,
          "gbreve;": 287,
          "gcirc;": 285,
          "gcy;": 1075,
          "gdot;": 289,
          "ge;": 8805,
          "gel;": 8923,
          "geq;": 8805,
          "geqq;": 8807,
          "geqslant;": 10878,
          "ges;": 10878,
          "gescc;": 10921,
          "gesdot;": 10880,
          "gesdoto;": 10882,
          "gesdotol;": 10884,
          "gesl;": [8923, 65024],
          "gesles;": 10900,
          "gfr;": [55349, 56612],
          "gg;": 8811,
          "ggg;": 8921,
          "gimel;": 8503,
          "gjcy;": 1107,
          "gl;": 8823,
          "glE;": 10898,
          "gla;": 10917,
          "glj;": 10916,
          "gnE;": 8809,
          "gnap;": 10890,
          "gnapprox;": 10890,
          "gne;": 10888,
          "gneq;": 10888,
          "gneqq;": 8809,
          "gnsim;": 8935,
          "gopf;": [55349, 56664],
          "grave;": 96,
          "gscr;": 8458,
          "gsim;": 8819,
          "gsime;": 10894,
          "gsiml;": 10896,
          gt: 62,
          "gt;": 62,
          "gtcc;": 10919,
          "gtcir;": 10874,
          "gtdot;": 8919,
          "gtlPar;": 10645,
          "gtquest;": 10876,
          "gtrapprox;": 10886,
          "gtrarr;": 10616,
          "gtrdot;": 8919,
          "gtreqless;": 8923,
          "gtreqqless;": 10892,
          "gtrless;": 8823,
          "gtrsim;": 8819,
          "gvertneqq;": [8809, 65024],
          "gvnE;": [8809, 65024],
          "hArr;": 8660,
          "hairsp;": 8202,
          "half;": 189,
          "hamilt;": 8459,
          "hardcy;": 1098,
          "harr;": 8596,
          "harrcir;": 10568,
          "harrw;": 8621,
          "hbar;": 8463,
          "hcirc;": 293,
          "hearts;": 9829,
          "heartsuit;": 9829,
          "hellip;": 8230,
          "hercon;": 8889,
          "hfr;": [55349, 56613],
          "hksearow;": 10533,
          "hkswarow;": 10534,
          "hoarr;": 8703,
          "homtht;": 8763,
          "hookleftarrow;": 8617,
          "hookrightarrow;": 8618,
          "hopf;": [55349, 56665],
          "horbar;": 8213,
          "hscr;": [55349, 56509],
          "hslash;": 8463,
          "hstrok;": 295,
          "hybull;": 8259,
          "hyphen;": 8208,
          iacute: 237,
          "iacute;": 237,
          "ic;": 8291,
          icirc: 238,
          "icirc;": 238,
          "icy;": 1080,
          "iecy;": 1077,
          iexcl: 161,
          "iexcl;": 161,
          "iff;": 8660,
          "ifr;": [55349, 56614],
          igrave: 236,
          "igrave;": 236,
          "ii;": 8520,
          "iiiint;": 10764,
          "iiint;": 8749,
          "iinfin;": 10716,
          "iiota;": 8489,
          "ijlig;": 307,
          "imacr;": 299,
          "image;": 8465,
          "imagline;": 8464,
          "imagpart;": 8465,
          "imath;": 305,
          "imof;": 8887,
          "imped;": 437,
          "in;": 8712,
          "incare;": 8453,
          "infin;": 8734,
          "infintie;": 10717,
          "inodot;": 305,
          "int;": 8747,
          "intcal;": 8890,
          "integers;": 8484,
          "intercal;": 8890,
          "intlarhk;": 10775,
          "intprod;": 10812,
          "iocy;": 1105,
          "iogon;": 303,
          "iopf;": [55349, 56666],
          "iota;": 953,
          "iprod;": 10812,
          iquest: 191,
          "iquest;": 191,
          "iscr;": [55349, 56510],
          "isin;": 8712,
          "isinE;": 8953,
          "isindot;": 8949,
          "isins;": 8948,
          "isinsv;": 8947,
          "isinv;": 8712,
          "it;": 8290,
          "itilde;": 297,
          "iukcy;": 1110,
          iuml: 239,
          "iuml;": 239,
          "jcirc;": 309,
          "jcy;": 1081,
          "jfr;": [55349, 56615],
          "jmath;": 567,
          "jopf;": [55349, 56667],
          "jscr;": [55349, 56511],
          "jsercy;": 1112,
          "jukcy;": 1108,
          "kappa;": 954,
          "kappav;": 1008,
          "kcedil;": 311,
          "kcy;": 1082,
          "kfr;": [55349, 56616],
          "kgreen;": 312,
          "khcy;": 1093,
          "kjcy;": 1116,
          "kopf;": [55349, 56668],
          "kscr;": [55349, 56512],
          "lAarr;": 8666,
          "lArr;": 8656,
          "lAtail;": 10523,
          "lBarr;": 10510,
          "lE;": 8806,
          "lEg;": 10891,
          "lHar;": 10594,
          "lacute;": 314,
          "laemptyv;": 10676,
          "lagran;": 8466,
          "lambda;": 955,
          "lang;": 10216,
          "langd;": 10641,
          "langle;": 10216,
          "lap;": 10885,
          laquo: 171,
          "laquo;": 171,
          "larr;": 8592,
          "larrb;": 8676,
          "larrbfs;": 10527,
          "larrfs;": 10525,
          "larrhk;": 8617,
          "larrlp;": 8619,
          "larrpl;": 10553,
          "larrsim;": 10611,
          "larrtl;": 8610,
          "lat;": 10923,
          "latail;": 10521,
          "late;": 10925,
          "lates;": [10925, 65024],
          "lbarr;": 10508,
          "lbbrk;": 10098,
          "lbrace;": 123,
          "lbrack;": 91,
          "lbrke;": 10635,
          "lbrksld;": 10639,
          "lbrkslu;": 10637,
          "lcaron;": 318,
          "lcedil;": 316,
          "lceil;": 8968,
          "lcub;": 123,
          "lcy;": 1083,
          "ldca;": 10550,
          "ldquo;": 8220,
          "ldquor;": 8222,
          "ldrdhar;": 10599,
          "ldrushar;": 10571,
          "ldsh;": 8626,
          "le;": 8804,
          "leftarrow;": 8592,
          "leftarrowtail;": 8610,
          "leftharpoondown;": 8637,
          "leftharpoonup;": 8636,
          "leftleftarrows;": 8647,
          "leftrightarrow;": 8596,
          "leftrightarrows;": 8646,
          "leftrightharpoons;": 8651,
          "leftrightsquigarrow;": 8621,
          "leftthreetimes;": 8907,
          "leg;": 8922,
          "leq;": 8804,
          "leqq;": 8806,
          "leqslant;": 10877,
          "les;": 10877,
          "lescc;": 10920,
          "lesdot;": 10879,
          "lesdoto;": 10881,
          "lesdotor;": 10883,
          "lesg;": [8922, 65024],
          "lesges;": 10899,
          "lessapprox;": 10885,
          "lessdot;": 8918,
          "lesseqgtr;": 8922,
          "lesseqqgtr;": 10891,
          "lessgtr;": 8822,
          "lesssim;": 8818,
          "lfisht;": 10620,
          "lfloor;": 8970,
          "lfr;": [55349, 56617],
          "lg;": 8822,
          "lgE;": 10897,
          "lhard;": 8637,
          "lharu;": 8636,
          "lharul;": 10602,
          "lhblk;": 9604,
          "ljcy;": 1113,
          "ll;": 8810,
          "llarr;": 8647,
          "llcorner;": 8990,
          "llhard;": 10603,
          "lltri;": 9722,
          "lmidot;": 320,
          "lmoust;": 9136,
          "lmoustache;": 9136,
          "lnE;": 8808,
          "lnap;": 10889,
          "lnapprox;": 10889,
          "lne;": 10887,
          "lneq;": 10887,
          "lneqq;": 8808,
          "lnsim;": 8934,
          "loang;": 10220,
          "loarr;": 8701,
          "lobrk;": 10214,
          "longleftarrow;": 10229,
          "longleftrightarrow;": 10231,
          "longmapsto;": 10236,
          "longrightarrow;": 10230,
          "looparrowleft;": 8619,
          "looparrowright;": 8620,
          "lopar;": 10629,
          "lopf;": [55349, 56669],
          "loplus;": 10797,
          "lotimes;": 10804,
          "lowast;": 8727,
          "lowbar;": 95,
          "loz;": 9674,
          "lozenge;": 9674,
          "lozf;": 10731,
          "lpar;": 40,
          "lparlt;": 10643,
          "lrarr;": 8646,
          "lrcorner;": 8991,
          "lrhar;": 8651,
          "lrhard;": 10605,
          "lrm;": 8206,
          "lrtri;": 8895,
          "lsaquo;": 8249,
          "lscr;": [55349, 56513],
          "lsh;": 8624,
          "lsim;": 8818,
          "lsime;": 10893,
          "lsimg;": 10895,
          "lsqb;": 91,
          "lsquo;": 8216,
          "lsquor;": 8218,
          "lstrok;": 322,
          lt: 60,
          "lt;": 60,
          "ltcc;": 10918,
          "ltcir;": 10873,
          "ltdot;": 8918,
          "lthree;": 8907,
          "ltimes;": 8905,
          "ltlarr;": 10614,
          "ltquest;": 10875,
          "ltrPar;": 10646,
          "ltri;": 9667,
          "ltrie;": 8884,
          "ltrif;": 9666,
          "lurdshar;": 10570,
          "luruhar;": 10598,
          "lvertneqq;": [8808, 65024],
          "lvnE;": [8808, 65024],
          "mDDot;": 8762,
          macr: 175,
          "macr;": 175,
          "male;": 9794,
          "malt;": 10016,
          "maltese;": 10016,
          "map;": 8614,
          "mapsto;": 8614,
          "mapstodown;": 8615,
          "mapstoleft;": 8612,
          "mapstoup;": 8613,
          "marker;": 9646,
          "mcomma;": 10793,
          "mcy;": 1084,
          "mdash;": 8212,
          "measuredangle;": 8737,
          "mfr;": [55349, 56618],
          "mho;": 8487,
          micro: 181,
          "micro;": 181,
          "mid;": 8739,
          "midast;": 42,
          "midcir;": 10992,
          middot: 183,
          "middot;": 183,
          "minus;": 8722,
          "minusb;": 8863,
          "minusd;": 8760,
          "minusdu;": 10794,
          "mlcp;": 10971,
          "mldr;": 8230,
          "mnplus;": 8723,
          "models;": 8871,
          "mopf;": [55349, 56670],
          "mp;": 8723,
          "mscr;": [55349, 56514],
          "mstpos;": 8766,
          "mu;": 956,
          "multimap;": 8888,
          "mumap;": 8888,
          "nGg;": [8921, 824],
          "nGt;": [8811, 8402],
          "nGtv;": [8811, 824],
          "nLeftarrow;": 8653,
          "nLeftrightarrow;": 8654,
          "nLl;": [8920, 824],
          "nLt;": [8810, 8402],
          "nLtv;": [8810, 824],
          "nRightarrow;": 8655,
          "nVDash;": 8879,
          "nVdash;": 8878,
          "nabla;": 8711,
          "nacute;": 324,
          "nang;": [8736, 8402],
          "nap;": 8777,
          "napE;": [10864, 824],
          "napid;": [8779, 824],
          "napos;": 329,
          "napprox;": 8777,
          "natur;": 9838,
          "natural;": 9838,
          "naturals;": 8469,
          nbsp: 160,
          "nbsp;": 160,
          "nbump;": [8782, 824],
          "nbumpe;": [8783, 824],
          "ncap;": 10819,
          "ncaron;": 328,
          "ncedil;": 326,
          "ncong;": 8775,
          "ncongdot;": [10861, 824],
          "ncup;": 10818,
          "ncy;": 1085,
          "ndash;": 8211,
          "ne;": 8800,
          "neArr;": 8663,
          "nearhk;": 10532,
          "nearr;": 8599,
          "nearrow;": 8599,
          "nedot;": [8784, 824],
          "nequiv;": 8802,
          "nesear;": 10536,
          "nesim;": [8770, 824],
          "nexist;": 8708,
          "nexists;": 8708,
          "nfr;": [55349, 56619],
          "ngE;": [8807, 824],
          "nge;": 8817,
          "ngeq;": 8817,
          "ngeqq;": [8807, 824],
          "ngeqslant;": [10878, 824],
          "nges;": [10878, 824],
          "ngsim;": 8821,
          "ngt;": 8815,
          "ngtr;": 8815,
          "nhArr;": 8654,
          "nharr;": 8622,
          "nhpar;": 10994,
          "ni;": 8715,
          "nis;": 8956,
          "nisd;": 8954,
          "niv;": 8715,
          "njcy;": 1114,
          "nlArr;": 8653,
          "nlE;": [8806, 824],
          "nlarr;": 8602,
          "nldr;": 8229,
          "nle;": 8816,
          "nleftarrow;": 8602,
          "nleftrightarrow;": 8622,
          "nleq;": 8816,
          "nleqq;": [8806, 824],
          "nleqslant;": [10877, 824],
          "nles;": [10877, 824],
          "nless;": 8814,
          "nlsim;": 8820,
          "nlt;": 8814,
          "nltri;": 8938,
          "nltrie;": 8940,
          "nmid;": 8740,
          "nopf;": [55349, 56671],
          not: 172,
          "not;": 172,
          "notin;": 8713,
          "notinE;": [8953, 824],
          "notindot;": [8949, 824],
          "notinva;": 8713,
          "notinvb;": 8951,
          "notinvc;": 8950,
          "notni;": 8716,
          "notniva;": 8716,
          "notnivb;": 8958,
          "notnivc;": 8957,
          "npar;": 8742,
          "nparallel;": 8742,
          "nparsl;": [11005, 8421],
          "npart;": [8706, 824],
          "npolint;": 10772,
          "npr;": 8832,
          "nprcue;": 8928,
          "npre;": [10927, 824],
          "nprec;": 8832,
          "npreceq;": [10927, 824],
          "nrArr;": 8655,
          "nrarr;": 8603,
          "nrarrc;": [10547, 824],
          "nrarrw;": [8605, 824],
          "nrightarrow;": 8603,
          "nrtri;": 8939,
          "nrtrie;": 8941,
          "nsc;": 8833,
          "nsccue;": 8929,
          "nsce;": [10928, 824],
          "nscr;": [55349, 56515],
          "nshortmid;": 8740,
          "nshortparallel;": 8742,
          "nsim;": 8769,
          "nsime;": 8772,
          "nsimeq;": 8772,
          "nsmid;": 8740,
          "nspar;": 8742,
          "nsqsube;": 8930,
          "nsqsupe;": 8931,
          "nsub;": 8836,
          "nsubE;": [10949, 824],
          "nsube;": 8840,
          "nsubset;": [8834, 8402],
          "nsubseteq;": 8840,
          "nsubseteqq;": [10949, 824],
          "nsucc;": 8833,
          "nsucceq;": [10928, 824],
          "nsup;": 8837,
          "nsupE;": [10950, 824],
          "nsupe;": 8841,
          "nsupset;": [8835, 8402],
          "nsupseteq;": 8841,
          "nsupseteqq;": [10950, 824],
          "ntgl;": 8825,
          ntilde: 241,
          "ntilde;": 241,
          "ntlg;": 8824,
          "ntriangleleft;": 8938,
          "ntrianglelefteq;": 8940,
          "ntriangleright;": 8939,
          "ntrianglerighteq;": 8941,
          "nu;": 957,
          "num;": 35,
          "numero;": 8470,
          "numsp;": 8199,
          "nvDash;": 8877,
          "nvHarr;": 10500,
          "nvap;": [8781, 8402],
          "nvdash;": 8876,
          "nvge;": [8805, 8402],
          "nvgt;": [62, 8402],
          "nvinfin;": 10718,
          "nvlArr;": 10498,
          "nvle;": [8804, 8402],
          "nvlt;": [60, 8402],
          "nvltrie;": [8884, 8402],
          "nvrArr;": 10499,
          "nvrtrie;": [8885, 8402],
          "nvsim;": [8764, 8402],
          "nwArr;": 8662,
          "nwarhk;": 10531,
          "nwarr;": 8598,
          "nwarrow;": 8598,
          "nwnear;": 10535,
          "oS;": 9416,
          oacute: 243,
          "oacute;": 243,
          "oast;": 8859,
          "ocir;": 8858,
          ocirc: 244,
          "ocirc;": 244,
          "ocy;": 1086,
          "odash;": 8861,
          "odblac;": 337,
          "odiv;": 10808,
          "odot;": 8857,
          "odsold;": 10684,
          "oelig;": 339,
          "ofcir;": 10687,
          "ofr;": [55349, 56620],
          "ogon;": 731,
          ograve: 242,
          "ograve;": 242,
          "ogt;": 10689,
          "ohbar;": 10677,
          "ohm;": 937,
          "oint;": 8750,
          "olarr;": 8634,
          "olcir;": 10686,
          "olcross;": 10683,
          "oline;": 8254,
          "olt;": 10688,
          "omacr;": 333,
          "omega;": 969,
          "omicron;": 959,
          "omid;": 10678,
          "ominus;": 8854,
          "oopf;": [55349, 56672],
          "opar;": 10679,
          "operp;": 10681,
          "oplus;": 8853,
          "or;": 8744,
          "orarr;": 8635,
          "ord;": 10845,
          "order;": 8500,
          "orderof;": 8500,
          ordf: 170,
          "ordf;": 170,
          ordm: 186,
          "ordm;": 186,
          "origof;": 8886,
          "oror;": 10838,
          "orslope;": 10839,
          "orv;": 10843,
          "oscr;": 8500,
          oslash: 248,
          "oslash;": 248,
          "osol;": 8856,
          otilde: 245,
          "otilde;": 245,
          "otimes;": 8855,
          "otimesas;": 10806,
          ouml: 246,
          "ouml;": 246,
          "ovbar;": 9021,
          "par;": 8741,
          para: 182,
          "para;": 182,
          "parallel;": 8741,
          "parsim;": 10995,
          "parsl;": 11005,
          "part;": 8706,
          "pcy;": 1087,
          "percnt;": 37,
          "period;": 46,
          "permil;": 8240,
          "perp;": 8869,
          "pertenk;": 8241,
          "pfr;": [55349, 56621],
          "phi;": 966,
          "phiv;": 981,
          "phmmat;": 8499,
          "phone;": 9742,
          "pi;": 960,
          "pitchfork;": 8916,
          "piv;": 982,
          "planck;": 8463,
          "planckh;": 8462,
          "plankv;": 8463,
          "plus;": 43,
          "plusacir;": 10787,
          "plusb;": 8862,
          "pluscir;": 10786,
          "plusdo;": 8724,
          "plusdu;": 10789,
          "pluse;": 10866,
          plusmn: 177,
          "plusmn;": 177,
          "plussim;": 10790,
          "plustwo;": 10791,
          "pm;": 177,
          "pointint;": 10773,
          "popf;": [55349, 56673],
          pound: 163,
          "pound;": 163,
          "pr;": 8826,
          "prE;": 10931,
          "prap;": 10935,
          "prcue;": 8828,
          "pre;": 10927,
          "prec;": 8826,
          "precapprox;": 10935,
          "preccurlyeq;": 8828,
          "preceq;": 10927,
          "precnapprox;": 10937,
          "precneqq;": 10933,
          "precnsim;": 8936,
          "precsim;": 8830,
          "prime;": 8242,
          "primes;": 8473,
          "prnE;": 10933,
          "prnap;": 10937,
          "prnsim;": 8936,
          "prod;": 8719,
          "profalar;": 9006,
          "profline;": 8978,
          "profsurf;": 8979,
          "prop;": 8733,
          "propto;": 8733,
          "prsim;": 8830,
          "prurel;": 8880,
          "pscr;": [55349, 56517],
          "psi;": 968,
          "puncsp;": 8200,
          "qfr;": [55349, 56622],
          "qint;": 10764,
          "qopf;": [55349, 56674],
          "qprime;": 8279,
          "qscr;": [55349, 56518],
          "quaternions;": 8461,
          "quatint;": 10774,
          "quest;": 63,
          "questeq;": 8799,
          quot: 34,
          "quot;": 34,
          "rAarr;": 8667,
          "rArr;": 8658,
          "rAtail;": 10524,
          "rBarr;": 10511,
          "rHar;": 10596,
          "race;": [8765, 817],
          "racute;": 341,
          "radic;": 8730,
          "raemptyv;": 10675,
          "rang;": 10217,
          "rangd;": 10642,
          "range;": 10661,
          "rangle;": 10217,
          raquo: 187,
          "raquo;": 187,
          "rarr;": 8594,
          "rarrap;": 10613,
          "rarrb;": 8677,
          "rarrbfs;": 10528,
          "rarrc;": 10547,
          "rarrfs;": 10526,
          "rarrhk;": 8618,
          "rarrlp;": 8620,
          "rarrpl;": 10565,
          "rarrsim;": 10612,
          "rarrtl;": 8611,
          "rarrw;": 8605,
          "ratail;": 10522,
          "ratio;": 8758,
          "rationals;": 8474,
          "rbarr;": 10509,
          "rbbrk;": 10099,
          "rbrace;": 125,
          "rbrack;": 93,
          "rbrke;": 10636,
          "rbrksld;": 10638,
          "rbrkslu;": 10640,
          "rcaron;": 345,
          "rcedil;": 343,
          "rceil;": 8969,
          "rcub;": 125,
          "rcy;": 1088,
          "rdca;": 10551,
          "rdldhar;": 10601,
          "rdquo;": 8221,
          "rdquor;": 8221,
          "rdsh;": 8627,
          "real;": 8476,
          "realine;": 8475,
          "realpart;": 8476,
          "reals;": 8477,
          "rect;": 9645,
          reg: 174,
          "reg;": 174,
          "rfisht;": 10621,
          "rfloor;": 8971,
          "rfr;": [55349, 56623],
          "rhard;": 8641,
          "rharu;": 8640,
          "rharul;": 10604,
          "rho;": 961,
          "rhov;": 1009,
          "rightarrow;": 8594,
          "rightarrowtail;": 8611,
          "rightharpoondown;": 8641,
          "rightharpoonup;": 8640,
          "rightleftarrows;": 8644,
          "rightleftharpoons;": 8652,
          "rightrightarrows;": 8649,
          "rightsquigarrow;": 8605,
          "rightthreetimes;": 8908,
          "ring;": 730,
          "risingdotseq;": 8787,
          "rlarr;": 8644,
          "rlhar;": 8652,
          "rlm;": 8207,
          "rmoust;": 9137,
          "rmoustache;": 9137,
          "rnmid;": 10990,
          "roang;": 10221,
          "roarr;": 8702,
          "robrk;": 10215,
          "ropar;": 10630,
          "ropf;": [55349, 56675],
          "roplus;": 10798,
          "rotimes;": 10805,
          "rpar;": 41,
          "rpargt;": 10644,
          "rppolint;": 10770,
          "rrarr;": 8649,
          "rsaquo;": 8250,
          "rscr;": [55349, 56519],
          "rsh;": 8625,
          "rsqb;": 93,
          "rsquo;": 8217,
          "rsquor;": 8217,
          "rthree;": 8908,
          "rtimes;": 8906,
          "rtri;": 9657,
          "rtrie;": 8885,
          "rtrif;": 9656,
          "rtriltri;": 10702,
          "ruluhar;": 10600,
          "rx;": 8478,
          "sacute;": 347,
          "sbquo;": 8218,
          "sc;": 8827,
          "scE;": 10932,
          "scap;": 10936,
          "scaron;": 353,
          "sccue;": 8829,
          "sce;": 10928,
          "scedil;": 351,
          "scirc;": 349,
          "scnE;": 10934,
          "scnap;": 10938,
          "scnsim;": 8937,
          "scpolint;": 10771,
          "scsim;": 8831,
          "scy;": 1089,
          "sdot;": 8901,
          "sdotb;": 8865,
          "sdote;": 10854,
          "seArr;": 8664,
          "searhk;": 10533,
          "searr;": 8600,
          "searrow;": 8600,
          sect: 167,
          "sect;": 167,
          "semi;": 59,
          "seswar;": 10537,
          "setminus;": 8726,
          "setmn;": 8726,
          "sext;": 10038,
          "sfr;": [55349, 56624],
          "sfrown;": 8994,
          "sharp;": 9839,
          "shchcy;": 1097,
          "shcy;": 1096,
          "shortmid;": 8739,
          "shortparallel;": 8741,
          shy: 173,
          "shy;": 173,
          "sigma;": 963,
          "sigmaf;": 962,
          "sigmav;": 962,
          "sim;": 8764,
          "simdot;": 10858,
          "sime;": 8771,
          "simeq;": 8771,
          "simg;": 10910,
          "simgE;": 10912,
          "siml;": 10909,
          "simlE;": 10911,
          "simne;": 8774,
          "simplus;": 10788,
          "simrarr;": 10610,
          "slarr;": 8592,
          "smallsetminus;": 8726,
          "smashp;": 10803,
          "smeparsl;": 10724,
          "smid;": 8739,
          "smile;": 8995,
          "smt;": 10922,
          "smte;": 10924,
          "smtes;": [10924, 65024],
          "softcy;": 1100,
          "sol;": 47,
          "solb;": 10692,
          "solbar;": 9023,
          "sopf;": [55349, 56676],
          "spades;": 9824,
          "spadesuit;": 9824,
          "spar;": 8741,
          "sqcap;": 8851,
          "sqcaps;": [8851, 65024],
          "sqcup;": 8852,
          "sqcups;": [8852, 65024],
          "sqsub;": 8847,
          "sqsube;": 8849,
          "sqsubset;": 8847,
          "sqsubseteq;": 8849,
          "sqsup;": 8848,
          "sqsupe;": 8850,
          "sqsupset;": 8848,
          "sqsupseteq;": 8850,
          "squ;": 9633,
          "square;": 9633,
          "squarf;": 9642,
          "squf;": 9642,
          "srarr;": 8594,
          "sscr;": [55349, 56520],
          "ssetmn;": 8726,
          "ssmile;": 8995,
          "sstarf;": 8902,
          "star;": 9734,
          "starf;": 9733,
          "straightepsilon;": 1013,
          "straightphi;": 981,
          "strns;": 175,
          "sub;": 8834,
          "subE;": 10949,
          "subdot;": 10941,
          "sube;": 8838,
          "subedot;": 10947,
          "submult;": 10945,
          "subnE;": 10955,
          "subne;": 8842,
          "subplus;": 10943,
          "subrarr;": 10617,
          "subset;": 8834,
          "subseteq;": 8838,
          "subseteqq;": 10949,
          "subsetneq;": 8842,
          "subsetneqq;": 10955,
          "subsim;": 10951,
          "subsub;": 10965,
          "subsup;": 10963,
          "succ;": 8827,
          "succapprox;": 10936,
          "succcurlyeq;": 8829,
          "succeq;": 10928,
          "succnapprox;": 10938,
          "succneqq;": 10934,
          "succnsim;": 8937,
          "succsim;": 8831,
          "sum;": 8721,
          "sung;": 9834,
          sup1: 185,
          "sup1;": 185,
          sup2: 178,
          "sup2;": 178,
          sup3: 179,
          "sup3;": 179,
          "sup;": 8835,
          "supE;": 10950,
          "supdot;": 10942,
          "supdsub;": 10968,
          "supe;": 8839,
          "supedot;": 10948,
          "suphsol;": 10185,
          "suphsub;": 10967,
          "suplarr;": 10619,
          "supmult;": 10946,
          "supnE;": 10956,
          "supne;": 8843,
          "supplus;": 10944,
          "supset;": 8835,
          "supseteq;": 8839,
          "supseteqq;": 10950,
          "supsetneq;": 8843,
          "supsetneqq;": 10956,
          "supsim;": 10952,
          "supsub;": 10964,
          "supsup;": 10966,
          "swArr;": 8665,
          "swarhk;": 10534,
          "swarr;": 8601,
          "swarrow;": 8601,
          "swnwar;": 10538,
          szlig: 223,
          "szlig;": 223,
          "target;": 8982,
          "tau;": 964,
          "tbrk;": 9140,
          "tcaron;": 357,
          "tcedil;": 355,
          "tcy;": 1090,
          "tdot;": 8411,
          "telrec;": 8981,
          "tfr;": [55349, 56625],
          "there4;": 8756,
          "therefore;": 8756,
          "theta;": 952,
          "thetasym;": 977,
          "thetav;": 977,
          "thickapprox;": 8776,
          "thicksim;": 8764,
          "thinsp;": 8201,
          "thkap;": 8776,
          "thksim;": 8764,
          thorn: 254,
          "thorn;": 254,
          "tilde;": 732,
          times: 215,
          "times;": 215,
          "timesb;": 8864,
          "timesbar;": 10801,
          "timesd;": 10800,
          "tint;": 8749,
          "toea;": 10536,
          "top;": 8868,
          "topbot;": 9014,
          "topcir;": 10993,
          "topf;": [55349, 56677],
          "topfork;": 10970,
          "tosa;": 10537,
          "tprime;": 8244,
          "trade;": 8482,
          "triangle;": 9653,
          "triangledown;": 9663,
          "triangleleft;": 9667,
          "trianglelefteq;": 8884,
          "triangleq;": 8796,
          "triangleright;": 9657,
          "trianglerighteq;": 8885,
          "tridot;": 9708,
          "trie;": 8796,
          "triminus;": 10810,
          "triplus;": 10809,
          "trisb;": 10701,
          "tritime;": 10811,
          "trpezium;": 9186,
          "tscr;": [55349, 56521],
          "tscy;": 1094,
          "tshcy;": 1115,
          "tstrok;": 359,
          "twixt;": 8812,
          "twoheadleftarrow;": 8606,
          "twoheadrightarrow;": 8608,
          "uArr;": 8657,
          "uHar;": 10595,
          uacute: 250,
          "uacute;": 250,
          "uarr;": 8593,
          "ubrcy;": 1118,
          "ubreve;": 365,
          ucirc: 251,
          "ucirc;": 251,
          "ucy;": 1091,
          "udarr;": 8645,
          "udblac;": 369,
          "udhar;": 10606,
          "ufisht;": 10622,
          "ufr;": [55349, 56626],
          ugrave: 249,
          "ugrave;": 249,
          "uharl;": 8639,
          "uharr;": 8638,
          "uhblk;": 9600,
          "ulcorn;": 8988,
          "ulcorner;": 8988,
          "ulcrop;": 8975,
          "ultri;": 9720,
          "umacr;": 363,
          uml: 168,
          "uml;": 168,
          "uogon;": 371,
          "uopf;": [55349, 56678],
          "uparrow;": 8593,
          "updownarrow;": 8597,
          "upharpoonleft;": 8639,
          "upharpoonright;": 8638,
          "uplus;": 8846,
          "upsi;": 965,
          "upsih;": 978,
          "upsilon;": 965,
          "upuparrows;": 8648,
          "urcorn;": 8989,
          "urcorner;": 8989,
          "urcrop;": 8974,
          "uring;": 367,
          "urtri;": 9721,
          "uscr;": [55349, 56522],
          "utdot;": 8944,
          "utilde;": 361,
          "utri;": 9653,
          "utrif;": 9652,
          "uuarr;": 8648,
          uuml: 252,
          "uuml;": 252,
          "uwangle;": 10663,
          "vArr;": 8661,
          "vBar;": 10984,
          "vBarv;": 10985,
          "vDash;": 8872,
          "vangrt;": 10652,
          "varepsilon;": 1013,
          "varkappa;": 1008,
          "varnothing;": 8709,
          "varphi;": 981,
          "varpi;": 982,
          "varpropto;": 8733,
          "varr;": 8597,
          "varrho;": 1009,
          "varsigma;": 962,
          "varsubsetneq;": [8842, 65024],
          "varsubsetneqq;": [10955, 65024],
          "varsupsetneq;": [8843, 65024],
          "varsupsetneqq;": [10956, 65024],
          "vartheta;": 977,
          "vartriangleleft;": 8882,
          "vartriangleright;": 8883,
          "vcy;": 1074,
          "vdash;": 8866,
          "vee;": 8744,
          "veebar;": 8891,
          "veeeq;": 8794,
          "vellip;": 8942,
          "verbar;": 124,
          "vert;": 124,
          "vfr;": [55349, 56627],
          "vltri;": 8882,
          "vnsub;": [8834, 8402],
          "vnsup;": [8835, 8402],
          "vopf;": [55349, 56679],
          "vprop;": 8733,
          "vrtri;": 8883,
          "vscr;": [55349, 56523],
          "vsubnE;": [10955, 65024],
          "vsubne;": [8842, 65024],
          "vsupnE;": [10956, 65024],
          "vsupne;": [8843, 65024],
          "vzigzag;": 10650,
          "wcirc;": 373,
          "wedbar;": 10847,
          "wedge;": 8743,
          "wedgeq;": 8793,
          "weierp;": 8472,
          "wfr;": [55349, 56628],
          "wopf;": [55349, 56680],
          "wp;": 8472,
          "wr;": 8768,
          "wreath;": 8768,
          "wscr;": [55349, 56524],
          "xcap;": 8898,
          "xcirc;": 9711,
          "xcup;": 8899,
          "xdtri;": 9661,
          "xfr;": [55349, 56629],
          "xhArr;": 10234,
          "xharr;": 10231,
          "xi;": 958,
          "xlArr;": 10232,
          "xlarr;": 10229,
          "xmap;": 10236,
          "xnis;": 8955,
          "xodot;": 10752,
          "xopf;": [55349, 56681],
          "xoplus;": 10753,
          "xotime;": 10754,
          "xrArr;": 10233,
          "xrarr;": 10230,
          "xscr;": [55349, 56525],
          "xsqcup;": 10758,
          "xuplus;": 10756,
          "xutri;": 9651,
          "xvee;": 8897,
          "xwedge;": 8896,
          yacute: 253,
          "yacute;": 253,
          "yacy;": 1103,
          "ycirc;": 375,
          "ycy;": 1099,
          yen: 165,
          "yen;": 165,
          "yfr;": [55349, 56630],
          "yicy;": 1111,
          "yopf;": [55349, 56682],
          "yscr;": [55349, 56526],
          "yucy;": 1102,
          yuml: 255,
          "yuml;": 255,
          "zacute;": 378,
          "zcaron;": 382,
          "zcy;": 1079,
          "zdot;": 380,
          "zeetrf;": 8488,
          "zeta;": 950,
          "zfr;": [55349, 56631],
          "zhcy;": 1078,
          "zigrarr;": 8669,
          "zopf;": [55349, 56683],
          "zscr;": [55349, 56527],
          "zwj;": 8205,
          "zwnj;": 8204,
        },
        ht =
          /(A(?:Elig;?|MP;?|acute;?|breve;|c(?:irc;?|y;)|fr;|grave;?|lpha;|macr;|nd;|o(?:gon;|pf;)|pplyFunction;|ring;?|s(?:cr;|sign;)|tilde;?|uml;?)|B(?:a(?:ckslash;|r(?:v;|wed;))|cy;|e(?:cause;|rnoullis;|ta;)|fr;|opf;|reve;|scr;|umpeq;)|C(?:Hcy;|OPY;?|a(?:cute;|p(?:;|italDifferentialD;)|yleys;)|c(?:aron;|edil;?|irc;|onint;)|dot;|e(?:dilla;|nterDot;)|fr;|hi;|ircle(?:Dot;|Minus;|Plus;|Times;)|lo(?:ckwiseContourIntegral;|seCurly(?:DoubleQuote;|Quote;))|o(?:lon(?:;|e;)|n(?:gruent;|int;|tourIntegral;)|p(?:f;|roduct;)|unterClockwiseContourIntegral;)|ross;|scr;|up(?:;|Cap;))|D(?:D(?:;|otrahd;)|Jcy;|Scy;|Zcy;|a(?:gger;|rr;|shv;)|c(?:aron;|y;)|el(?:;|ta;)|fr;|i(?:a(?:critical(?:Acute;|Do(?:t;|ubleAcute;)|Grave;|Tilde;)|mond;)|fferentialD;)|o(?:pf;|t(?:;|Dot;|Equal;)|uble(?:ContourIntegral;|Do(?:t;|wnArrow;)|L(?:eft(?:Arrow;|RightArrow;|Tee;)|ong(?:Left(?:Arrow;|RightArrow;)|RightArrow;))|Right(?:Arrow;|Tee;)|Up(?:Arrow;|DownArrow;)|VerticalBar;)|wn(?:Arrow(?:;|Bar;|UpArrow;)|Breve;|Left(?:RightVector;|TeeVector;|Vector(?:;|Bar;))|Right(?:TeeVector;|Vector(?:;|Bar;))|Tee(?:;|Arrow;)|arrow;))|s(?:cr;|trok;))|E(?:NG;|TH;?|acute;?|c(?:aron;|irc;?|y;)|dot;|fr;|grave;?|lement;|m(?:acr;|pty(?:SmallSquare;|VerySmallSquare;))|o(?:gon;|pf;)|psilon;|qu(?:al(?:;|Tilde;)|ilibrium;)|s(?:cr;|im;)|ta;|uml;?|x(?:ists;|ponentialE;))|F(?:cy;|fr;|illed(?:SmallSquare;|VerySmallSquare;)|o(?:pf;|rAll;|uriertrf;)|scr;)|G(?:Jcy;|T;?|amma(?:;|d;)|breve;|c(?:edil;|irc;|y;)|dot;|fr;|g;|opf;|reater(?:Equal(?:;|Less;)|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;)|scr;|t;)|H(?:ARDcy;|a(?:cek;|t;)|circ;|fr;|ilbertSpace;|o(?:pf;|rizontalLine;)|s(?:cr;|trok;)|ump(?:DownHump;|Equal;))|I(?:Ecy;|Jlig;|Ocy;|acute;?|c(?:irc;?|y;)|dot;|fr;|grave;?|m(?:;|a(?:cr;|ginaryI;)|plies;)|n(?:t(?:;|e(?:gral;|rsection;))|visible(?:Comma;|Times;))|o(?:gon;|pf;|ta;)|scr;|tilde;|u(?:kcy;|ml;?))|J(?:c(?:irc;|y;)|fr;|opf;|s(?:cr;|ercy;)|ukcy;)|K(?:Hcy;|Jcy;|appa;|c(?:edil;|y;)|fr;|opf;|scr;)|L(?:Jcy;|T;?|a(?:cute;|mbda;|ng;|placetrf;|rr;)|c(?:aron;|edil;|y;)|e(?:ft(?:A(?:ngleBracket;|rrow(?:;|Bar;|RightArrow;))|Ceiling;|Do(?:ubleBracket;|wn(?:TeeVector;|Vector(?:;|Bar;)))|Floor;|Right(?:Arrow;|Vector;)|T(?:ee(?:;|Arrow;|Vector;)|riangle(?:;|Bar;|Equal;))|Up(?:DownVector;|TeeVector;|Vector(?:;|Bar;))|Vector(?:;|Bar;)|arrow;|rightarrow;)|ss(?:EqualGreater;|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;))|fr;|l(?:;|eftarrow;)|midot;|o(?:ng(?:Left(?:Arrow;|RightArrow;)|RightArrow;|left(?:arrow;|rightarrow;)|rightarrow;)|pf;|wer(?:LeftArrow;|RightArrow;))|s(?:cr;|h;|trok;)|t;)|M(?:ap;|cy;|e(?:diumSpace;|llintrf;)|fr;|inusPlus;|opf;|scr;|u;)|N(?:Jcy;|acute;|c(?:aron;|edil;|y;)|e(?:gative(?:MediumSpace;|Thi(?:ckSpace;|nSpace;)|VeryThinSpace;)|sted(?:GreaterGreater;|LessLess;)|wLine;)|fr;|o(?:Break;|nBreakingSpace;|pf;|t(?:;|C(?:ongruent;|upCap;)|DoubleVerticalBar;|E(?:lement;|qual(?:;|Tilde;)|xists;)|Greater(?:;|Equal;|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;)|Hump(?:DownHump;|Equal;)|Le(?:ftTriangle(?:;|Bar;|Equal;)|ss(?:;|Equal;|Greater;|Less;|SlantEqual;|Tilde;))|Nested(?:GreaterGreater;|LessLess;)|Precedes(?:;|Equal;|SlantEqual;)|R(?:everseElement;|ightTriangle(?:;|Bar;|Equal;))|S(?:quareSu(?:bset(?:;|Equal;)|perset(?:;|Equal;))|u(?:bset(?:;|Equal;)|cceeds(?:;|Equal;|SlantEqual;|Tilde;)|perset(?:;|Equal;)))|Tilde(?:;|Equal;|FullEqual;|Tilde;)|VerticalBar;))|scr;|tilde;?|u;)|O(?:Elig;|acute;?|c(?:irc;?|y;)|dblac;|fr;|grave;?|m(?:acr;|ega;|icron;)|opf;|penCurly(?:DoubleQuote;|Quote;)|r;|s(?:cr;|lash;?)|ti(?:lde;?|mes;)|uml;?|ver(?:B(?:ar;|rac(?:e;|ket;))|Parenthesis;))|P(?:artialD;|cy;|fr;|hi;|i;|lusMinus;|o(?:incareplane;|pf;)|r(?:;|ecedes(?:;|Equal;|SlantEqual;|Tilde;)|ime;|o(?:duct;|portion(?:;|al;)))|s(?:cr;|i;))|Q(?:UOT;?|fr;|opf;|scr;)|R(?:Barr;|EG;?|a(?:cute;|ng;|rr(?:;|tl;))|c(?:aron;|edil;|y;)|e(?:;|verse(?:E(?:lement;|quilibrium;)|UpEquilibrium;))|fr;|ho;|ight(?:A(?:ngleBracket;|rrow(?:;|Bar;|LeftArrow;))|Ceiling;|Do(?:ubleBracket;|wn(?:TeeVector;|Vector(?:;|Bar;)))|Floor;|T(?:ee(?:;|Arrow;|Vector;)|riangle(?:;|Bar;|Equal;))|Up(?:DownVector;|TeeVector;|Vector(?:;|Bar;))|Vector(?:;|Bar;)|arrow;)|o(?:pf;|undImplies;)|rightarrow;|s(?:cr;|h;)|uleDelayed;)|S(?:H(?:CHcy;|cy;)|OFTcy;|acute;|c(?:;|aron;|edil;|irc;|y;)|fr;|hort(?:DownArrow;|LeftArrow;|RightArrow;|UpArrow;)|igma;|mallCircle;|opf;|q(?:rt;|uare(?:;|Intersection;|Su(?:bset(?:;|Equal;)|perset(?:;|Equal;))|Union;))|scr;|tar;|u(?:b(?:;|set(?:;|Equal;))|c(?:ceeds(?:;|Equal;|SlantEqual;|Tilde;)|hThat;)|m;|p(?:;|erset(?:;|Equal;)|set;)))|T(?:HORN;?|RADE;|S(?:Hcy;|cy;)|a(?:b;|u;)|c(?:aron;|edil;|y;)|fr;|h(?:e(?:refore;|ta;)|i(?:ckSpace;|nSpace;))|ilde(?:;|Equal;|FullEqual;|Tilde;)|opf;|ripleDot;|s(?:cr;|trok;))|U(?:a(?:cute;?|rr(?:;|ocir;))|br(?:cy;|eve;)|c(?:irc;?|y;)|dblac;|fr;|grave;?|macr;|n(?:der(?:B(?:ar;|rac(?:e;|ket;))|Parenthesis;)|ion(?:;|Plus;))|o(?:gon;|pf;)|p(?:Arrow(?:;|Bar;|DownArrow;)|DownArrow;|Equilibrium;|Tee(?:;|Arrow;)|arrow;|downarrow;|per(?:LeftArrow;|RightArrow;)|si(?:;|lon;))|ring;|scr;|tilde;|uml;?)|V(?:Dash;|bar;|cy;|dash(?:;|l;)|e(?:e;|r(?:bar;|t(?:;|ical(?:Bar;|Line;|Separator;|Tilde;))|yThinSpace;))|fr;|opf;|scr;|vdash;)|W(?:circ;|edge;|fr;|opf;|scr;)|X(?:fr;|i;|opf;|scr;)|Y(?:Acy;|Icy;|Ucy;|acute;?|c(?:irc;|y;)|fr;|opf;|scr;|uml;)|Z(?:Hcy;|acute;|c(?:aron;|y;)|dot;|e(?:roWidthSpace;|ta;)|fr;|opf;|scr;)|a(?:acute;?|breve;|c(?:;|E;|d;|irc;?|ute;?|y;)|elig;?|f(?:;|r;)|grave;?|l(?:e(?:fsym;|ph;)|pha;)|m(?:a(?:cr;|lg;)|p;?)|n(?:d(?:;|and;|d;|slope;|v;)|g(?:;|e;|le;|msd(?:;|a(?:a;|b;|c;|d;|e;|f;|g;|h;))|rt(?:;|vb(?:;|d;))|s(?:ph;|t;)|zarr;))|o(?:gon;|pf;)|p(?:;|E;|acir;|e;|id;|os;|prox(?:;|eq;))|ring;?|s(?:cr;|t;|ymp(?:;|eq;))|tilde;?|uml;?|w(?:conint;|int;))|b(?:Not;|a(?:ck(?:cong;|epsilon;|prime;|sim(?:;|eq;))|r(?:vee;|wed(?:;|ge;)))|brk(?:;|tbrk;)|c(?:ong;|y;)|dquo;|e(?:caus(?:;|e;)|mptyv;|psi;|rnou;|t(?:a;|h;|ween;))|fr;|ig(?:c(?:ap;|irc;|up;)|o(?:dot;|plus;|times;)|s(?:qcup;|tar;)|triangle(?:down;|up;)|uplus;|vee;|wedge;)|karow;|l(?:a(?:ck(?:lozenge;|square;|triangle(?:;|down;|left;|right;))|nk;)|k(?:1(?:2;|4;)|34;)|ock;)|n(?:e(?:;|quiv;)|ot;)|o(?:pf;|t(?:;|tom;)|wtie;|x(?:D(?:L;|R;|l;|r;)|H(?:;|D;|U;|d;|u;)|U(?:L;|R;|l;|r;)|V(?:;|H;|L;|R;|h;|l;|r;)|box;|d(?:L;|R;|l;|r;)|h(?:;|D;|U;|d;|u;)|minus;|plus;|times;|u(?:L;|R;|l;|r;)|v(?:;|H;|L;|R;|h;|l;|r;)))|prime;|r(?:eve;|vbar;?)|s(?:cr;|emi;|im(?:;|e;)|ol(?:;|b;|hsub;))|u(?:ll(?:;|et;)|mp(?:;|E;|e(?:;|q;))))|c(?:a(?:cute;|p(?:;|and;|brcup;|c(?:ap;|up;)|dot;|s;)|r(?:et;|on;))|c(?:a(?:ps;|ron;)|edil;?|irc;|ups(?:;|sm;))|dot;|e(?:dil;?|mptyv;|nt(?:;|erdot;|))|fr;|h(?:cy;|eck(?:;|mark;)|i;)|ir(?:;|E;|c(?:;|eq;|le(?:arrow(?:left;|right;)|d(?:R;|S;|ast;|circ;|dash;)))|e;|fnint;|mid;|scir;)|lubs(?:;|uit;)|o(?:lon(?:;|e(?:;|q;))|m(?:ma(?:;|t;)|p(?:;|fn;|le(?:ment;|xes;)))|n(?:g(?:;|dot;)|int;)|p(?:f;|rod;|y(?:;|sr;|)))|r(?:arr;|oss;)|s(?:cr;|u(?:b(?:;|e;)|p(?:;|e;)))|tdot;|u(?:darr(?:l;|r;)|e(?:pr;|sc;)|larr(?:;|p;)|p(?:;|brcap;|c(?:ap;|up;)|dot;|or;|s;)|r(?:arr(?:;|m;)|ly(?:eq(?:prec;|succ;)|vee;|wedge;)|ren;?|vearrow(?:left;|right;))|vee;|wed;)|w(?:conint;|int;)|ylcty;)|d(?:Arr;|Har;|a(?:gger;|leth;|rr;|sh(?:;|v;))|b(?:karow;|lac;)|c(?:aron;|y;)|d(?:;|a(?:gger;|rr;)|otseq;)|e(?:g;?|lta;|mptyv;)|f(?:isht;|r;)|har(?:l;|r;)|i(?:am(?:;|ond(?:;|suit;)|s;)|e;|gamma;|sin;|v(?:;|ide(?:;|ontimes;|)|onx;))|jcy;|lc(?:orn;|rop;)|o(?:llar;|pf;|t(?:;|eq(?:;|dot;)|minus;|plus;|square;)|ublebarwedge;|wn(?:arrow;|downarrows;|harpoon(?:left;|right;)))|r(?:bkarow;|c(?:orn;|rop;))|s(?:c(?:r;|y;)|ol;|trok;)|t(?:dot;|ri(?:;|f;))|u(?:arr;|har;)|wangle;|z(?:cy;|igrarr;))|e(?:D(?:Dot;|ot;)|a(?:cute;?|ster;)|c(?:aron;|ir(?:;|c;?)|olon;|y;)|dot;|e;|f(?:Dot;|r;)|g(?:;|rave;?|s(?:;|dot;))|l(?:;|inters;|l;|s(?:;|dot;))|m(?:acr;|pty(?:;|set;|v;)|sp(?:1(?:3;|4;)|;))|n(?:g;|sp;)|o(?:gon;|pf;)|p(?:ar(?:;|sl;)|lus;|si(?:;|lon;|v;))|q(?:c(?:irc;|olon;)|s(?:im;|lant(?:gtr;|less;))|u(?:als;|est;|iv(?:;|DD;))|vparsl;)|r(?:Dot;|arr;)|s(?:cr;|dot;|im;)|t(?:a;|h;?)|u(?:ml;?|ro;)|x(?:cl;|ist;|p(?:ectation;|onentiale;)))|f(?:allingdotseq;|cy;|emale;|f(?:ilig;|l(?:ig;|lig;)|r;)|ilig;|jlig;|l(?:at;|lig;|tns;)|nof;|o(?:pf;|r(?:all;|k(?:;|v;)))|partint;|r(?:a(?:c(?:1(?:2;?|3;|4;?|5;|6;|8;)|2(?:3;|5;)|3(?:4;?|5;|8;)|45;|5(?:6;|8;)|78;)|sl;)|own;)|scr;)|g(?:E(?:;|l;)|a(?:cute;|mma(?:;|d;)|p;)|breve;|c(?:irc;|y;)|dot;|e(?:;|l;|q(?:;|q;|slant;)|s(?:;|cc;|dot(?:;|o(?:;|l;))|l(?:;|es;)))|fr;|g(?:;|g;)|imel;|jcy;|l(?:;|E;|a;|j;)|n(?:E;|ap(?:;|prox;)|e(?:;|q(?:;|q;))|sim;)|opf;|rave;|s(?:cr;|im(?:;|e;|l;))|t(?:;|c(?:c;|ir;)|dot;|lPar;|quest;|r(?:a(?:pprox;|rr;)|dot;|eq(?:less;|qless;)|less;|sim;)|)|v(?:ertneqq;|nE;))|h(?:Arr;|a(?:irsp;|lf;|milt;|r(?:dcy;|r(?:;|cir;|w;)))|bar;|circ;|e(?:arts(?:;|uit;)|llip;|rcon;)|fr;|ks(?:earow;|warow;)|o(?:arr;|mtht;|ok(?:leftarrow;|rightarrow;)|pf;|rbar;)|s(?:cr;|lash;|trok;)|y(?:bull;|phen;))|i(?:acute;?|c(?:;|irc;?|y;)|e(?:cy;|xcl;?)|f(?:f;|r;)|grave;?|i(?:;|i(?:int;|nt;)|nfin;|ota;)|jlig;|m(?:a(?:cr;|g(?:e;|line;|part;)|th;)|of;|ped;)|n(?:;|care;|fin(?:;|tie;)|odot;|t(?:;|cal;|e(?:gers;|rcal;)|larhk;|prod;))|o(?:cy;|gon;|pf;|ta;)|prod;|quest;?|s(?:cr;|in(?:;|E;|dot;|s(?:;|v;)|v;))|t(?:;|ilde;)|u(?:kcy;|ml;?))|j(?:c(?:irc;|y;)|fr;|math;|opf;|s(?:cr;|ercy;)|ukcy;)|k(?:appa(?:;|v;)|c(?:edil;|y;)|fr;|green;|hcy;|jcy;|opf;|scr;)|l(?:A(?:arr;|rr;|tail;)|Barr;|E(?:;|g;)|Har;|a(?:cute;|emptyv;|gran;|mbda;|ng(?:;|d;|le;)|p;|quo;?|rr(?:;|b(?:;|fs;)|fs;|hk;|lp;|pl;|sim;|tl;)|t(?:;|ail;|e(?:;|s;)))|b(?:arr;|brk;|r(?:ac(?:e;|k;)|k(?:e;|sl(?:d;|u;))))|c(?:aron;|e(?:dil;|il;)|ub;|y;)|d(?:ca;|quo(?:;|r;)|r(?:dhar;|ushar;)|sh;)|e(?:;|ft(?:arrow(?:;|tail;)|harpoon(?:down;|up;)|leftarrows;|right(?:arrow(?:;|s;)|harpoons;|squigarrow;)|threetimes;)|g;|q(?:;|q;|slant;)|s(?:;|cc;|dot(?:;|o(?:;|r;))|g(?:;|es;)|s(?:approx;|dot;|eq(?:gtr;|qgtr;)|gtr;|sim;)))|f(?:isht;|loor;|r;)|g(?:;|E;)|h(?:ar(?:d;|u(?:;|l;))|blk;)|jcy;|l(?:;|arr;|corner;|hard;|tri;)|m(?:idot;|oust(?:;|ache;))|n(?:E;|ap(?:;|prox;)|e(?:;|q(?:;|q;))|sim;)|o(?:a(?:ng;|rr;)|brk;|ng(?:left(?:arrow;|rightarrow;)|mapsto;|rightarrow;)|oparrow(?:left;|right;)|p(?:ar;|f;|lus;)|times;|w(?:ast;|bar;)|z(?:;|enge;|f;))|par(?:;|lt;)|r(?:arr;|corner;|har(?:;|d;)|m;|tri;)|s(?:aquo;|cr;|h;|im(?:;|e;|g;)|q(?:b;|uo(?:;|r;))|trok;)|t(?:;|c(?:c;|ir;)|dot;|hree;|imes;|larr;|quest;|r(?:Par;|i(?:;|e;|f;))|)|ur(?:dshar;|uhar;)|v(?:ertneqq;|nE;))|m(?:DDot;|a(?:cr;?|l(?:e;|t(?:;|ese;))|p(?:;|sto(?:;|down;|left;|up;))|rker;)|c(?:omma;|y;)|dash;|easuredangle;|fr;|ho;|i(?:cro;?|d(?:;|ast;|cir;|dot;?)|nus(?:;|b;|d(?:;|u;)))|l(?:cp;|dr;)|nplus;|o(?:dels;|pf;)|p;|s(?:cr;|tpos;)|u(?:;|ltimap;|map;))|n(?:G(?:g;|t(?:;|v;))|L(?:eft(?:arrow;|rightarrow;)|l;|t(?:;|v;))|Rightarrow;|V(?:Dash;|dash;)|a(?:bla;|cute;|ng;|p(?:;|E;|id;|os;|prox;)|tur(?:;|al(?:;|s;)))|b(?:sp;?|ump(?:;|e;))|c(?:a(?:p;|ron;)|edil;|ong(?:;|dot;)|up;|y;)|dash;|e(?:;|Arr;|ar(?:hk;|r(?:;|ow;))|dot;|quiv;|s(?:ear;|im;)|xist(?:;|s;))|fr;|g(?:E;|e(?:;|q(?:;|q;|slant;)|s;)|sim;|t(?:;|r;))|h(?:Arr;|arr;|par;)|i(?:;|s(?:;|d;)|v;)|jcy;|l(?:Arr;|E;|arr;|dr;|e(?:;|ft(?:arrow;|rightarrow;)|q(?:;|q;|slant;)|s(?:;|s;))|sim;|t(?:;|ri(?:;|e;)))|mid;|o(?:pf;|t(?:;|in(?:;|E;|dot;|v(?:a;|b;|c;))|ni(?:;|v(?:a;|b;|c;))|))|p(?:ar(?:;|allel;|sl;|t;)|olint;|r(?:;|cue;|e(?:;|c(?:;|eq;))))|r(?:Arr;|arr(?:;|c;|w;)|ightarrow;|tri(?:;|e;))|s(?:c(?:;|cue;|e;|r;)|hort(?:mid;|parallel;)|im(?:;|e(?:;|q;))|mid;|par;|qsu(?:be;|pe;)|u(?:b(?:;|E;|e;|set(?:;|eq(?:;|q;)))|cc(?:;|eq;)|p(?:;|E;|e;|set(?:;|eq(?:;|q;)))))|t(?:gl;|ilde;?|lg;|riangle(?:left(?:;|eq;)|right(?:;|eq;)))|u(?:;|m(?:;|ero;|sp;))|v(?:Dash;|Harr;|ap;|dash;|g(?:e;|t;)|infin;|l(?:Arr;|e;|t(?:;|rie;))|r(?:Arr;|trie;)|sim;)|w(?:Arr;|ar(?:hk;|r(?:;|ow;))|near;))|o(?:S;|a(?:cute;?|st;)|c(?:ir(?:;|c;?)|y;)|d(?:ash;|blac;|iv;|ot;|sold;)|elig;|f(?:cir;|r;)|g(?:on;|rave;?|t;)|h(?:bar;|m;)|int;|l(?:arr;|c(?:ir;|ross;)|ine;|t;)|m(?:acr;|ega;|i(?:cron;|d;|nus;))|opf;|p(?:ar;|erp;|lus;)|r(?:;|arr;|d(?:;|er(?:;|of;)|f;?|m;?)|igof;|or;|slope;|v;)|s(?:cr;|lash;?|ol;)|ti(?:lde;?|mes(?:;|as;))|uml;?|vbar;)|p(?:ar(?:;|a(?:;|llel;|)|s(?:im;|l;)|t;)|cy;|er(?:cnt;|iod;|mil;|p;|tenk;)|fr;|h(?:i(?:;|v;)|mmat;|one;)|i(?:;|tchfork;|v;)|l(?:an(?:ck(?:;|h;)|kv;)|us(?:;|acir;|b;|cir;|d(?:o;|u;)|e;|mn;?|sim;|two;))|m;|o(?:intint;|pf;|und;?)|r(?:;|E;|ap;|cue;|e(?:;|c(?:;|approx;|curlyeq;|eq;|n(?:approx;|eqq;|sim;)|sim;))|ime(?:;|s;)|n(?:E;|ap;|sim;)|o(?:d;|f(?:alar;|line;|surf;)|p(?:;|to;))|sim;|urel;)|s(?:cr;|i;)|uncsp;)|q(?:fr;|int;|opf;|prime;|scr;|u(?:at(?:ernions;|int;)|est(?:;|eq;)|ot;?))|r(?:A(?:arr;|rr;|tail;)|Barr;|Har;|a(?:c(?:e;|ute;)|dic;|emptyv;|ng(?:;|d;|e;|le;)|quo;?|rr(?:;|ap;|b(?:;|fs;)|c;|fs;|hk;|lp;|pl;|sim;|tl;|w;)|t(?:ail;|io(?:;|nals;)))|b(?:arr;|brk;|r(?:ac(?:e;|k;)|k(?:e;|sl(?:d;|u;))))|c(?:aron;|e(?:dil;|il;)|ub;|y;)|d(?:ca;|ldhar;|quo(?:;|r;)|sh;)|e(?:al(?:;|ine;|part;|s;)|ct;|g;?)|f(?:isht;|loor;|r;)|h(?:ar(?:d;|u(?:;|l;))|o(?:;|v;))|i(?:ght(?:arrow(?:;|tail;)|harpoon(?:down;|up;)|left(?:arrows;|harpoons;)|rightarrows;|squigarrow;|threetimes;)|ng;|singdotseq;)|l(?:arr;|har;|m;)|moust(?:;|ache;)|nmid;|o(?:a(?:ng;|rr;)|brk;|p(?:ar;|f;|lus;)|times;)|p(?:ar(?:;|gt;)|polint;)|rarr;|s(?:aquo;|cr;|h;|q(?:b;|uo(?:;|r;)))|t(?:hree;|imes;|ri(?:;|e;|f;|ltri;))|uluhar;|x;)|s(?:acute;|bquo;|c(?:;|E;|a(?:p;|ron;)|cue;|e(?:;|dil;)|irc;|n(?:E;|ap;|sim;)|polint;|sim;|y;)|dot(?:;|b;|e;)|e(?:Arr;|ar(?:hk;|r(?:;|ow;))|ct;?|mi;|swar;|tm(?:inus;|n;)|xt;)|fr(?:;|own;)|h(?:arp;|c(?:hcy;|y;)|ort(?:mid;|parallel;)|y;?)|i(?:gma(?:;|f;|v;)|m(?:;|dot;|e(?:;|q;)|g(?:;|E;)|l(?:;|E;)|ne;|plus;|rarr;))|larr;|m(?:a(?:llsetminus;|shp;)|eparsl;|i(?:d;|le;)|t(?:;|e(?:;|s;)))|o(?:ftcy;|l(?:;|b(?:;|ar;))|pf;)|pa(?:des(?:;|uit;)|r;)|q(?:c(?:ap(?:;|s;)|up(?:;|s;))|su(?:b(?:;|e;|set(?:;|eq;))|p(?:;|e;|set(?:;|eq;)))|u(?:;|ar(?:e;|f;)|f;))|rarr;|s(?:cr;|etmn;|mile;|tarf;)|t(?:ar(?:;|f;)|r(?:aight(?:epsilon;|phi;)|ns;))|u(?:b(?:;|E;|dot;|e(?:;|dot;)|mult;|n(?:E;|e;)|plus;|rarr;|s(?:et(?:;|eq(?:;|q;)|neq(?:;|q;))|im;|u(?:b;|p;)))|cc(?:;|approx;|curlyeq;|eq;|n(?:approx;|eqq;|sim;)|sim;)|m;|ng;|p(?:1;?|2;?|3;?|;|E;|d(?:ot;|sub;)|e(?:;|dot;)|hs(?:ol;|ub;)|larr;|mult;|n(?:E;|e;)|plus;|s(?:et(?:;|eq(?:;|q;)|neq(?:;|q;))|im;|u(?:b;|p;))))|w(?:Arr;|ar(?:hk;|r(?:;|ow;))|nwar;)|zlig;?)|t(?:a(?:rget;|u;)|brk;|c(?:aron;|edil;|y;)|dot;|elrec;|fr;|h(?:e(?:re(?:4;|fore;)|ta(?:;|sym;|v;))|i(?:ck(?:approx;|sim;)|nsp;)|k(?:ap;|sim;)|orn;?)|i(?:lde;|mes(?:;|b(?:;|ar;)|d;|)|nt;)|o(?:ea;|p(?:;|bot;|cir;|f(?:;|ork;))|sa;)|prime;|r(?:ade;|i(?:angle(?:;|down;|left(?:;|eq;)|q;|right(?:;|eq;))|dot;|e;|minus;|plus;|sb;|time;)|pezium;)|s(?:c(?:r;|y;)|hcy;|trok;)|w(?:ixt;|ohead(?:leftarrow;|rightarrow;)))|u(?:Arr;|Har;|a(?:cute;?|rr;)|br(?:cy;|eve;)|c(?:irc;?|y;)|d(?:arr;|blac;|har;)|f(?:isht;|r;)|grave;?|h(?:ar(?:l;|r;)|blk;)|l(?:c(?:orn(?:;|er;)|rop;)|tri;)|m(?:acr;|l;?)|o(?:gon;|pf;)|p(?:arrow;|downarrow;|harpoon(?:left;|right;)|lus;|si(?:;|h;|lon;)|uparrows;)|r(?:c(?:orn(?:;|er;)|rop;)|ing;|tri;)|scr;|t(?:dot;|ilde;|ri(?:;|f;))|u(?:arr;|ml;?)|wangle;)|v(?:Arr;|Bar(?:;|v;)|Dash;|a(?:ngrt;|r(?:epsilon;|kappa;|nothing;|p(?:hi;|i;|ropto;)|r(?:;|ho;)|s(?:igma;|u(?:bsetneq(?:;|q;)|psetneq(?:;|q;)))|t(?:heta;|riangle(?:left;|right;))))|cy;|dash;|e(?:e(?:;|bar;|eq;)|llip;|r(?:bar;|t;))|fr;|ltri;|nsu(?:b;|p;)|opf;|prop;|rtri;|s(?:cr;|u(?:bn(?:E;|e;)|pn(?:E;|e;)))|zigzag;)|w(?:circ;|e(?:d(?:bar;|ge(?:;|q;))|ierp;)|fr;|opf;|p;|r(?:;|eath;)|scr;)|x(?:c(?:ap;|irc;|up;)|dtri;|fr;|h(?:Arr;|arr;)|i;|l(?:Arr;|arr;)|map;|nis;|o(?:dot;|p(?:f;|lus;)|time;)|r(?:Arr;|arr;)|s(?:cr;|qcup;)|u(?:plus;|tri;)|vee;|wedge;)|y(?:ac(?:ute;?|y;)|c(?:irc;|y;)|en;?|fr;|icy;|opf;|scr;|u(?:cy;|ml;?))|z(?:acute;|c(?:aron;|y;)|dot;|e(?:etrf;|ta;)|fr;|hcy;|igrarr;|opf;|scr;|w(?:j;|nj;)))|[\s\S]/g,
        ot = 32,
        Dn = /[^\r"&\u0000]+/g,
        vt = /[^\r'&\u0000]+/g,
        ci = /[^\r\t\n\f &>\u0000]+/g,
        ss = /[^\r\t\n\f \/>A-Z\u0000]+/g,
        _0 = /[^\r\t\n\f \/=>A-Z\u0000]+/g,
        T0 = /[^\]\r\u0000\uffff]*/g,
        S0 = /[^&<\r\u0000\uffff]*/g,
        Np = /[^<\r\u0000\uffff]*/g,
        C0 = /[^\r\u0000\uffff]*/g,
        Ap = /(?:(\/)?([a-z]+)>)|[\s\S]/g,
        xp =
          /(?:([-a-z]+)[ \t\n\f]*=[ \t\n\f]*('[^'&\r\u0000]*'|"[^"&\r\u0000]*"|[^\t\n\r\f "&'\u0000>][^&> \t\n\r\f\u0000]*[ \t\n\f]))|[\s\S]/g,
        Po = /[^\x09\x0A\x0C\x0D\x20]/,
        Ql = /[^\x09\x0A\x0C\x0D\x20]/g,
        I0 = /[^\x00\x09\x0A\x0C\x0D\x20]/,
        wr = /^[\x09\x0A\x0C\x0D\x20]+/,
        Fo = /\x00/g;
      function dt(H) {
        var U = 16384;
        if (H.length < U) return String.fromCharCode.apply(String, H);
        for (var ie = "", Z = 0; Z < H.length; Z += U)
          ie += String.fromCharCode.apply(String, H.slice(Z, Z + U));
        return ie;
      }
      function M0(H) {
        for (var U = [], ie = 0; ie < H.length; ie++) U[ie] = H.charCodeAt(ie);
        return U;
      }
      function ke(H, U) {
        if (typeof U == "string")
          return H.namespaceURI === s.HTML && H.localName === U;
        var ie = U[H.namespaceURI];
        return ie && ie[H.localName];
      }
      function Rp(H) {
        return ke(H, V);
      }
      function Op(H) {
        if (ke(H, Q)) return !0;
        if (H.namespaceURI === s.MATHML && H.localName === "annotation-xml") {
          var U = H.getAttribute("encoding");
          if (
            (U && (U = U.toLowerCase()),
            U === "text/html" || U === "application/xhtml+xml")
          )
            return !0;
        }
        return !1;
      }
      function N0(H) {
        return H in k ? k[H] : H;
      }
      function kp(H) {
        for (var U = 0, ie = H.length; U < ie; U++)
          H[U][0] in S && (H[U][0] = S[H[U][0]]);
      }
      function Lp(H) {
        for (var U = 0, ie = H.length; U < ie; U++)
          if (H[U][0] === "definitionurl") {
            H[U][0] = "definitionURL";
            break;
          }
      }
      function Yl(H) {
        for (var U = 0, ie = H.length; U < ie; U++)
          H[U][0] in he && H[U].push(he[H[U][0]]);
      }
      function Pp(H, U) {
        for (var ie = 0, Z = H.length; ie < Z; ie++) {
          var Ue = H[ie][0],
            X = H[ie][1];
          U.hasAttribute(Ue) || U._setAttribute(Ue, X);
        }
      }
      (Ne.ElementStack = function () {
        (this.elements = []), (this.top = null);
      }),
        (Ne.ElementStack.prototype.push = function (H) {
          this.elements.push(H), (this.top = H);
        }),
        (Ne.ElementStack.prototype.pop = function (H) {
          this.elements.pop(),
            (this.top = this.elements[this.elements.length - 1]);
        }),
        (Ne.ElementStack.prototype.popTag = function (H) {
          for (var U = this.elements.length - 1; U > 0; U--) {
            var ie = this.elements[U];
            if (ke(ie, H)) break;
          }
          (this.elements.length = U), (this.top = this.elements[U - 1]);
        }),
        (Ne.ElementStack.prototype.popElementType = function (H) {
          for (
            var U = this.elements.length - 1;
            U > 0 && !(this.elements[U] instanceof H);
            U--
          );
          (this.elements.length = U), (this.top = this.elements[U - 1]);
        }),
        (Ne.ElementStack.prototype.popElement = function (H) {
          for (
            var U = this.elements.length - 1;
            U > 0 && this.elements[U] !== H;
            U--
          );
          (this.elements.length = U), (this.top = this.elements[U - 1]);
        }),
        (Ne.ElementStack.prototype.removeElement = function (H) {
          if (this.top === H) this.pop();
          else {
            var U = this.elements.lastIndexOf(H);
            U !== -1 && this.elements.splice(U, 1);
          }
        }),
        (Ne.ElementStack.prototype.clearToContext = function (H) {
          for (
            var U = this.elements.length - 1;
            U > 0 && !ke(this.elements[U], H);
            U--
          );
          (this.elements.length = U + 1), (this.top = this.elements[U]);
        }),
        (Ne.ElementStack.prototype.contains = function (H) {
          return this.inSpecificScope(H, Object.create(null));
        }),
        (Ne.ElementStack.prototype.inSpecificScope = function (H, U) {
          for (var ie = this.elements.length - 1; ie >= 0; ie--) {
            var Z = this.elements[ie];
            if (ke(Z, H)) return !0;
            if (ke(Z, U)) return !1;
          }
          return !1;
        }),
        (Ne.ElementStack.prototype.elementInSpecificScope = function (H, U) {
          for (var ie = this.elements.length - 1; ie >= 0; ie--) {
            var Z = this.elements[ie];
            if (Z === H) return !0;
            if (ke(Z, U)) return !1;
          }
          return !1;
        }),
        (Ne.ElementStack.prototype.elementTypeInSpecificScope = function (
          H,
          U
        ) {
          for (var ie = this.elements.length - 1; ie >= 0; ie--) {
            var Z = this.elements[ie];
            if (Z instanceof H) return !0;
            if (ke(Z, U)) return !1;
          }
          return !1;
        }),
        (Ne.ElementStack.prototype.inScope = function (H) {
          return this.inSpecificScope(H, g);
        }),
        (Ne.ElementStack.prototype.elementInScope = function (H) {
          return this.elementInSpecificScope(H, g);
        }),
        (Ne.ElementStack.prototype.elementTypeInScope = function (H) {
          return this.elementTypeInSpecificScope(H, g);
        }),
        (Ne.ElementStack.prototype.inButtonScope = function (H) {
          return this.inSpecificScope(H, y);
        }),
        (Ne.ElementStack.prototype.inListItemScope = function (H) {
          return this.inSpecificScope(H, p);
        }),
        (Ne.ElementStack.prototype.inTableScope = function (H) {
          return this.inSpecificScope(H, C);
        }),
        (Ne.ElementStack.prototype.inSelectScope = function (H) {
          for (var U = this.elements.length - 1; U >= 0; U--) {
            var ie = this.elements[U];
            if (ie.namespaceURI !== s.HTML) return !1;
            var Z = ie.localName;
            if (Z === H) return !0;
            if (Z !== "optgroup" && Z !== "option") return !1;
          }
          return !1;
        }),
        (Ne.ElementStack.prototype.generateImpliedEndTags = function (H, U) {
          for (var ie = U ? q : me, Z = this.elements.length - 1; Z >= 0; Z--) {
            var Ue = this.elements[Z];
            if ((H && ke(Ue, H)) || !ke(this.elements[Z], ie)) break;
          }
          (this.elements.length = Z + 1), (this.top = this.elements[Z]);
        }),
        (Ne.ActiveFormattingElements = function () {
          (this.list = []), (this.attrs = []);
        }),
        (Ne.ActiveFormattingElements.prototype.MARKER = { localName: "|" }),
        (Ne.ActiveFormattingElements.prototype.insertMarker = function () {
          this.list.push(this.MARKER), this.attrs.push(this.MARKER);
        }),
        (Ne.ActiveFormattingElements.prototype.push = function (H, U) {
          for (
            var ie = 0, Z = this.list.length - 1;
            Z >= 0 && this.list[Z] !== this.MARKER;
            Z--
          )
            if (Dr(H, this.list[Z], this.attrs[Z]) && (ie++, ie === 3)) {
              this.list.splice(Z, 1), this.attrs.splice(Z, 1);
              break;
            }
          this.list.push(H);
          for (var Ue = [], X = 0; X < U.length; X++) Ue[X] = U[X];
          this.attrs.push(Ue);
          function Dr(Bn, _r, _n) {
            if (Bn.localName !== _r.localName || Bn._numattrs !== _n.length)
              return !1;
            for (var Et = 0, jo = _n.length; Et < jo; Et++) {
              var Tr = _n[Et][0],
                A = _n[Et][1];
              if (!Bn.hasAttribute(Tr) || Bn.getAttribute(Tr) !== A) return !1;
            }
            return !0;
          }
        }),
        (Ne.ActiveFormattingElements.prototype.clearToMarker = function () {
          for (
            var H = this.list.length - 1;
            H >= 0 && this.list[H] !== this.MARKER;
            H--
          );
          H < 0 && (H = 0), (this.list.length = H), (this.attrs.length = H);
        }),
        (Ne.ActiveFormattingElements.prototype.findElementByTag = function (H) {
          for (var U = this.list.length - 1; U >= 0; U--) {
            var ie = this.list[U];
            if (ie === this.MARKER) break;
            if (ie.localName === H) return ie;
          }
          return null;
        }),
        (Ne.ActiveFormattingElements.prototype.indexOf = function (H) {
          return this.list.lastIndexOf(H);
        }),
        (Ne.ActiveFormattingElements.prototype.remove = function (H) {
          var U = this.list.lastIndexOf(H);
          U !== -1 && (this.list.splice(U, 1), this.attrs.splice(U, 1));
        }),
        (Ne.ActiveFormattingElements.prototype.replace = function (H, U, ie) {
          var Z = this.list.lastIndexOf(H);
          Z !== -1 && ((this.list[Z] = U), (this.attrs[Z] = ie));
        }),
        (Ne.ActiveFormattingElements.prototype.insertAfter = function (H, U) {
          var ie = this.list.lastIndexOf(H);
          ie !== -1 &&
            (this.list.splice(ie, 0, U), this.attrs.splice(ie, 0, U));
        });
      function Ne(H, U, ie) {
        var Z = null,
          Ue = 0,
          X = 0,
          Dr = !1,
          Bn = !1,
          _r = 0,
          _n = [],
          Et = "",
          jo = !0,
          Tr = 0,
          A = Te,
          Un,
          ze,
          Le = "",
          Ho = "",
          Pe = [],
          Ct = "",
          bt = "",
          Be = [],
          Vn = [],
          $n = [],
          qn = [],
          Qt = [],
          Bo = !1,
          B = Cw,
          Tn = null,
          Sn = [],
          M = new Ne.ElementStack(),
          be = new Ne.ActiveFormattingElements(),
          Sr = U !== void 0,
          Uo = null,
          Cn = null,
          Vo = !0;
        U && (Vo = U.ownerDocument._scripting_enabled),
          ie && ie.scripting_enabled === !1 && (Vo = !1);
        var Ge = !0,
          Zl = !1,
          $o,
          Xl,
          W = [],
          zn = !1,
          Cr = !1,
          qo = {
            document: function () {
              return xe;
            },
            _asDocumentFragment: function () {
              for (
                var f = xe.createDocumentFragment(), h = xe.firstChild;
                h.hasChildNodes();

              )
                f.appendChild(h.firstChild);
              return f;
            },
            pause: function () {
              Tr++;
            },
            resume: function () {
              Tr--, this.parse("");
            },
            parse: function (f, h, D) {
              var L;
              return Tr > 0
                ? ((Et += f), !0)
                : (_r === 0
                    ? (Et && ((f = Et + f), (Et = "")),
                      h && ((f += "\uFFFF"), (Dr = !0)),
                      (Z = f),
                      (Ue = f.length),
                      (X = 0),
                      jo && ((jo = !1), Z.charCodeAt(0) === 65279 && (X = 1)),
                      _r++,
                      (L = jp(D)),
                      (Et = Z.substring(X, Ue)),
                      _r--)
                    : (_r++,
                      _n.push(Z, Ue, X),
                      (Z = f),
                      (Ue = f.length),
                      (X = 0),
                      jp(),
                      (L = !1),
                      (Et = Z.substring(X, Ue)),
                      (X = _n.pop()),
                      (Ue = _n.pop()),
                      (Z = _n.pop()),
                      Et &&
                        ((Z = Et + Z.substring(X)),
                        (Ue = Z.length),
                        (X = 0),
                        (Et = "")),
                      _r--),
                  L);
            },
          },
          xe = new n(!0, H);
        if (((xe._parser = qo), (xe._scripting_enabled = Vo), U)) {
          if (
            (U.ownerDocument._quirks && (xe._quirks = !0),
            U.ownerDocument._limitedQuirks && (xe._limitedQuirks = !0),
            U.namespaceURI === s.HTML)
          )
            switch (U.localName) {
              case "title":
              case "textarea":
                A = Qn;
                break;
              case "style":
              case "xmp":
              case "iframe":
              case "noembed":
              case "noframes":
              case "script":
              case "plaintext":
                A = ru;
                break;
            }
          var Fp = xe.createElement("html");
          xe._appendChild(Fp),
            M.push(Fp),
            U instanceof a.HTMLTemplateElement && Sn.push(hu),
            ds();
          for (var os = U; os !== null; os = os.parentElement)
            if (os instanceof a.HTMLFormElement) {
              Cn = os;
              break;
            }
        }
        function jp(f) {
          for (var h, D, L, P; X < Ue; ) {
            if (Tr > 0 || (f && f())) return !0;
            switch (typeof A.lookahead) {
              case "undefined":
                if (((h = Z.charCodeAt(X++)), Bn && ((Bn = !1), h === 10))) {
                  X++;
                  continue;
                }
                switch (h) {
                  case 13:
                    X < Ue ? Z.charCodeAt(X) === 10 && X++ : (Bn = !0), A(10);
                    break;
                  case 65535:
                    if (Dr && X === Ue) {
                      A(l);
                      break;
                    }
                  default:
                    A(h);
                    break;
                }
                break;
              case "number":
                h = Z.charCodeAt(X);
                var K = A.lookahead,
                  le = !0;
                if ((K < 0 && ((le = !1), (K = -K)), K < Ue - X))
                  (D = le ? Z.substring(X, X + K) : null), (P = !1);
                else if (Dr)
                  (D = le ? Z.substring(X, Ue) : null),
                    (P = !0),
                    h === 65535 && X === Ue - 1 && (h = l);
                else return !0;
                A(h, D, P);
                break;
              case "string":
                (h = Z.charCodeAt(X)), (L = A.lookahead);
                var Se = Z.indexOf(L, X);
                if (Se !== -1) (D = Z.substring(X, Se + L.length)), (P = !1);
                else {
                  if (!Dr) return !0;
                  (D = Z.substring(X, Ue)),
                    h === 65535 && X === Ue - 1 && (h = l),
                    (P = !0);
                }
                A(h, D, P);
                break;
            }
          }
          return !1;
        }
        function Gn(f, h) {
          for (var D = 0; D < Qt.length; D++) if (Qt[D][0] === f) return;
          h !== void 0 ? Qt.push([f, h]) : Qt.push([f]);
        }
        function A0() {
          xp.lastIndex = X - 1;
          var f = xp.exec(Z);
          if (!f) throw new Error("should never happen");
          var h = f[1];
          if (!h) return !1;
          var D = f[2],
            L = D.length;
          switch (D[0]) {
            case '"':
            case "'":
              (D = D.substring(1, L - 1)), (X += f[0].length - 1), (A = au);
              break;
            default:
              (A = dn), (X += f[0].length - 1), (D = D.substring(0, L - 1));
              break;
          }
          for (var P = 0; P < Qt.length; P++) if (Qt[P][0] === h) return !0;
          return Qt.push([h, D]), !0;
        }
        function x0() {
          (Bo = !1), (Le = ""), (Qt.length = 0);
        }
        function as() {
          (Bo = !0), (Le = ""), (Qt.length = 0);
        }
        function In() {
          Pe.length = 0;
        }
        function Jl() {
          Ct = "";
        }
        function eu() {
          bt = "";
        }
        function Hp() {
          Be.length = 0;
        }
        function li() {
          (Vn.length = 0), ($n = null), (qn = null);
        }
        function zo() {
          $n = [];
        }
        function Wn() {
          qn = [];
        }
        function Re() {
          Zl = !0;
        }
        function R0() {
          return M.top && M.top.namespaceURI !== "http://www.w3.org/1999/xhtml";
        }
        function Bt(f) {
          return Ho === f;
        }
        function ui() {
          if (W.length > 0) {
            var f = dt(W);
            if (
              ((W.length = 0),
              Cr &&
                ((Cr = !1),
                f[0] ===
                  `
` && (f = f.substring(1)),
                f.length === 0))
            )
              return;
            Qe(u, f), (zn = !1);
          }
          Cr = !1;
        }
        function cs(f) {
          f.lastIndex = X - 1;
          var h = f.exec(Z);
          if (h && h.index === X - 1)
            return (
              (h = h[0]),
              (X += h.length - 1),
              Dr && X === Ue && ((h = h.slice(0, -1)), X--),
              h
            );
          throw new Error("should never happen");
        }
        function ls(f) {
          f.lastIndex = X - 1;
          var h = f.exec(Z)[0];
          return h ? (O0(h), (X += h.length - 1), !0) : !1;
        }
        function O0(f) {
          W.length > 0 && ui(),
            !(
              Cr &&
              ((Cr = !1),
              f[0] ===
                `
` && (f = f.substring(1)),
              f.length === 0)
            ) && Qe(u, f);
        }
        function Mn() {
          if (Bo) Qe(m, Le);
          else {
            var f = Le;
            (Le = ""), (Ho = f), Qe(d, f, Qt);
          }
        }
        function k0() {
          if (X === Ue) return !1;
          Ap.lastIndex = X;
          var f = Ap.exec(Z);
          if (!f) throw new Error("should never happen");
          var h = f[2];
          if (!h) return !1;
          var D = f[1];
          return (
            D
              ? ((X += h.length + 2), Qe(m, h))
              : ((X += h.length + 1), (Ho = h), Qe(d, h, N)),
            !0
          );
        }
        function L0() {
          Bo ? Qe(m, Le, null, !0) : Qe(d, Le, Qt, !0);
        }
        function Oe() {
          Qe(I, dt(Vn), $n ? dt($n) : void 0, qn ? dt(qn) : void 0);
        }
        function ge() {
          ui(), B(l), (xe.modclock = 1);
        }
        var Qe = (qo.insertToken = function (h, D, L, P) {
          ui();
          var K = M.top;
          !K || K.namespaceURI === s.HTML
            ? B(h, D, L, P)
            : h !== d && h !== u
            ? tm(h, D, L, P)
            : (Rp(K) &&
                (h === u ||
                  (h === d && D !== "mglyph" && D !== "malignmark"))) ||
              (h === d &&
                D === "svg" &&
                K.namespaceURI === s.MATHML &&
                K.localName === "annotation-xml") ||
              Op(K)
            ? ((Xl = !0), B(h, D, L, P), (Xl = !1))
            : tm(h, D, L, P);
        });
        function cn(f) {
          var h = M.top;
          Kn && ke(h, ne)
            ? Wo(function (D) {
                return D.createComment(f);
              })
            : (h instanceof a.HTMLTemplateElement && (h = h.content),
              h._appendChild(h.ownerDocument.createComment(f)));
        }
        function ln(f) {
          var h = M.top;
          if (Kn && ke(h, ne))
            Wo(function (L) {
              return L.createTextNode(f);
            });
          else {
            h instanceof a.HTMLTemplateElement && (h = h.content);
            var D = h.lastChild;
            D && D.nodeType === i.TEXT_NODE
              ? D.appendData(f)
              : h._appendChild(h.ownerDocument.createTextNode(f));
          }
        }
        function us(f, h, D) {
          var L = o.createElement(f, h, null);
          if (D)
            for (var P = 0, K = D.length; P < K; P++)
              L._setAttribute(D[P][0], D[P][1]);
          return L;
        }
        var Kn = !1;
        function fe(f, h) {
          var D = Go(function (L) {
            return us(L, f, h);
          });
          return ke(D, v) && (D._form = Cn), D;
        }
        function Go(f) {
          var h;
          return (
            Kn && ke(M.top, ne)
              ? (h = Wo(f))
              : M.top instanceof a.HTMLTemplateElement
              ? ((h = f(M.top.content.ownerDocument)),
                M.top.content._appendChild(h))
              : ((h = f(M.top.ownerDocument)), M.top._appendChild(h)),
            M.push(h),
            h
          );
        }
        function tu(f, h, D) {
          return Go(function (L) {
            var P = L._createElementNS(f, D, null);
            if (h)
              for (var K = 0, le = h.length; K < le; K++) {
                var Se = h[K];
                Se.length === 2
                  ? P._setAttribute(Se[0], Se[1])
                  : P._setAttributeNS(Se[2], Se[0], Se[1]);
              }
            return P;
          });
        }
        function Bp(f) {
          for (var h = M.elements.length - 1; h >= 0; h--)
            if (M.elements[h] instanceof f) return h;
          return -1;
        }
        function Wo(f) {
          var h,
            D,
            L = -1,
            P = -1,
            K;
          if (
            ((L = Bp(a.HTMLTableElement)),
            (P = Bp(a.HTMLTemplateElement)),
            P >= 0 && (L < 0 || P > L)
              ? (h = M.elements[P])
              : L >= 0 &&
                ((h = M.elements[L].parentNode),
                h ? (D = M.elements[L]) : (h = M.elements[L - 1])),
            h || (h = M.elements[0]),
            h instanceof a.HTMLTemplateElement && (h = h.content),
            (K = f(h.ownerDocument)),
            K.nodeType === i.TEXT_NODE)
          ) {
            var le;
            if (
              (D ? (le = D.previousSibling) : (le = h.lastChild),
              le && le.nodeType === i.TEXT_NODE)
            )
              return le.appendData(K.data), K;
          }
          return D ? h.insertBefore(K, D) : h._appendChild(K), K;
        }
        function ds() {
          for (var f = !1, h = M.elements.length - 1; h >= 0; h--) {
            var D = M.elements[h];
            if (
              (h === 0 && ((f = !0), Sr && (D = U)), D.namespaceURI === s.HTML)
            ) {
              var L = D.localName;
              switch (L) {
                case "select":
                  for (var P = h; P > 0; ) {
                    var K = M.elements[--P];
                    if (K instanceof a.HTMLTemplateElement) break;
                    if (K instanceof a.HTMLTableElement) {
                      B = aa;
                      return;
                    }
                  }
                  B = Nn;
                  return;
                case "tr":
                  B = ps;
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  B = Ar;
                  return;
                case "caption":
                  B = fu;
                  return;
                case "colgroup":
                  B = oa;
                  return;
                case "table":
                  B = Ut;
                  return;
                case "template":
                  B = Sn[Sn.length - 1];
                  return;
                case "body":
                  B = ce;
                  return;
                case "frameset":
                  B = pu;
                  return;
                case "html":
                  Uo === null ? (B = ia) : (B = du);
                  return;
                default:
                  if (!f) {
                    if (L === "head") {
                      B = We;
                      return;
                    }
                    if (L === "td" || L === "th") {
                      B = di;
                      return;
                    }
                  }
              }
            }
            if (f) {
              B = ce;
              return;
            }
          }
        }
        function Ko(f, h) {
          fe(f, h), (A = fs), (Tn = B), (B = sa);
        }
        function P0(f, h) {
          fe(f, h), (A = Qn), (Tn = B), (B = sa);
        }
        function nu(f, h) {
          return {
            elt: us(f, be.list[h].localName, be.attrs[h]),
            attrs: be.attrs[h],
          };
        }
        function pt() {
          if (be.list.length !== 0) {
            var f = be.list[be.list.length - 1];
            if (f !== be.MARKER && M.elements.lastIndexOf(f) === -1) {
              for (
                var h = be.list.length - 2;
                h >= 0 &&
                ((f = be.list[h]),
                !(f === be.MARKER || M.elements.lastIndexOf(f) !== -1));
                h--
              );
              for (h = h + 1; h < be.list.length; h++) {
                var D = Go(function (L) {
                  return nu(L, h).elt;
                });
                be.list[h] = D;
              }
            }
          }
        }
        var Qo = { localName: "BM" };
        function F0(f) {
          if (ke(M.top, f) && be.indexOf(M.top) === -1) return M.pop(), !0;
          for (var h = 0; h < 8; ) {
            h++;
            var D = be.findElementByTag(f);
            if (!D) return !1;
            var L = M.elements.lastIndexOf(D);
            if (L === -1) return be.remove(D), !0;
            if (!M.elementInScope(D)) return !0;
            for (var P = null, K, le = L + 1; le < M.elements.length; le++)
              if (ke(M.elements[le], T)) {
                (P = M.elements[le]), (K = le);
                break;
              }
            if (P) {
              var Se = M.elements[L - 1];
              be.insertAfter(D, Qo);
              for (
                var $e = P, ct = P, Vt = K, Yt, xr = 0;
                xr++, ($e = M.elements[--Vt]), $e !== D;

              ) {
                if (
                  ((Yt = be.indexOf($e)),
                  xr > 3 && Yt !== -1 && (be.remove($e), (Yt = -1)),
                  Yt === -1)
                ) {
                  M.removeElement($e);
                  continue;
                }
                var er = nu(Se.ownerDocument, Yt);
                be.replace($e, er.elt, er.attrs),
                  (M.elements[Vt] = er.elt),
                  ($e = er.elt),
                  ct === P && (be.remove(Qo), be.insertAfter(er.elt, Qo)),
                  $e._appendChild(ct),
                  (ct = $e);
              }
              Kn && ke(Se, ne)
                ? Wo(function () {
                    return ct;
                  })
                : Se instanceof a.HTMLTemplateElement
                ? Se.content._appendChild(ct)
                : Se._appendChild(ct);
              for (
                var ms = nu(P.ownerDocument, be.indexOf(D));
                P.hasChildNodes();

              )
                ms.elt._appendChild(P.firstChild);
              P._appendChild(ms.elt),
                be.remove(D),
                be.replace(Qo, ms.elt, ms.attrs),
                M.removeElement(D);
              var xw = M.elements.lastIndexOf(P);
              M.elements.splice(xw + 1, 0, ms.elt);
            } else return M.popElement(D), be.remove(D), !0;
          }
          return !0;
        }
        function j0() {
          M.pop(), (B = Tn);
        }
        function Ir() {
          delete xe._parser,
            (M.elements.length = 0),
            xe.defaultView &&
              xe.defaultView.dispatchEvent(new a.Event("load", {}));
        }
        function re(f, h) {
          (A = h), X--;
        }
        function Te(f) {
          switch (f) {
            case 38:
              (Un = Te), (A = hs);
              break;
            case 60:
              if (k0()) break;
              A = H0;
              break;
            case 0:
              W.push(f), (zn = !0);
              break;
            case -1:
              ge();
              break;
            default:
              ls(S0) || W.push(f);
              break;
          }
        }
        function Qn(f) {
          switch (f) {
            case 38:
              (Un = Qn), (A = hs);
              break;
            case 60:
              A = U0;
              break;
            case 0:
              W.push(65533), (zn = !0);
              break;
            case -1:
              ge();
              break;
            default:
              W.push(f);
              break;
          }
        }
        function fs(f) {
          switch (f) {
            case 60:
              A = q0;
              break;
            case 0:
              W.push(65533);
              break;
            case -1:
              ge();
              break;
            default:
              ls(Np) || W.push(f);
              break;
          }
        }
        function Yn(f) {
          switch (f) {
            case 60:
              A = W0;
              break;
            case 0:
              W.push(65533);
              break;
            case -1:
              ge();
              break;
            default:
              ls(Np) || W.push(f);
              break;
          }
        }
        function ru(f) {
          switch (f) {
            case 0:
              W.push(65533);
              break;
            case -1:
              ge();
              break;
            default:
              ls(C0) || W.push(f);
              break;
          }
        }
        function H0(f) {
          switch (f) {
            case 33:
              A = qp;
              break;
            case 47:
              A = B0;
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              x0(), re(f, Up);
              break;
            case 63:
              re(f, Jo);
              break;
            default:
              W.push(60), re(f, Te);
              break;
          }
        }
        function B0(f) {
          switch (f) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              as(), re(f, Up);
              break;
            case 62:
              A = Te;
              break;
            case -1:
              W.push(60), W.push(47), ge();
              break;
            default:
              re(f, Jo);
              break;
          }
        }
        function Up(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = dn;
              break;
            case 47:
              A = Xn;
              break;
            case 62:
              (A = Te), Mn();
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              Le += String.fromCharCode(f + 32);
              break;
            case 0:
              Le += "\uFFFD";
              break;
            case -1:
              ge();
              break;
            default:
              Le += cs(ss);
              break;
          }
        }
        function U0(f) {
          f === 47 ? (In(), (A = V0)) : (W.push(60), re(f, Qn));
        }
        function V0(f) {
          switch (f) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              as(), re(f, $0);
              break;
            default:
              W.push(60), W.push(47), re(f, Qn);
              break;
          }
        }
        function $0(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (Bt(Le)) {
                A = dn;
                return;
              }
              break;
            case 47:
              if (Bt(Le)) {
                A = Xn;
                return;
              }
              break;
            case 62:
              if (Bt(Le)) {
                (A = Te), Mn();
                return;
              }
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              (Le += String.fromCharCode(f + 32)), Pe.push(f);
              return;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              (Le += String.fromCharCode(f)), Pe.push(f);
              return;
            default:
              break;
          }
          W.push(60), W.push(47), c(W, Pe), re(f, Qn);
        }
        function q0(f) {
          f === 47 ? (In(), (A = z0)) : (W.push(60), re(f, fs));
        }
        function z0(f) {
          switch (f) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              as(), re(f, G0);
              break;
            default:
              W.push(60), W.push(47), re(f, fs);
              break;
          }
        }
        function G0(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (Bt(Le)) {
                A = dn;
                return;
              }
              break;
            case 47:
              if (Bt(Le)) {
                A = Xn;
                return;
              }
              break;
            case 62:
              if (Bt(Le)) {
                (A = Te), Mn();
                return;
              }
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              (Le += String.fromCharCode(f + 32)), Pe.push(f);
              return;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              (Le += String.fromCharCode(f)), Pe.push(f);
              return;
            default:
              break;
          }
          W.push(60), W.push(47), c(W, Pe), re(f, fs);
        }
        function W0(f) {
          switch (f) {
            case 47:
              In(), (A = K0);
              break;
            case 33:
              (A = Y0), W.push(60), W.push(33);
              break;
            default:
              W.push(60), re(f, Yn);
              break;
          }
        }
        function K0(f) {
          switch (f) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              as(), re(f, Q0);
              break;
            default:
              W.push(60), W.push(47), re(f, Yn);
              break;
          }
        }
        function Q0(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (Bt(Le)) {
                A = dn;
                return;
              }
              break;
            case 47:
              if (Bt(Le)) {
                A = Xn;
                return;
              }
              break;
            case 62:
              if (Bt(Le)) {
                (A = Te), Mn();
                return;
              }
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              (Le += String.fromCharCode(f + 32)), Pe.push(f);
              return;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              (Le += String.fromCharCode(f)), Pe.push(f);
              return;
            default:
              break;
          }
          W.push(60), W.push(47), c(W, Pe), re(f, Yn);
        }
        function Y0(f) {
          f === 45 ? ((A = Z0), W.push(45)) : re(f, Yn);
        }
        function Z0(f) {
          f === 45 ? ((A = Vp), W.push(45)) : re(f, Yn);
        }
        function un(f) {
          switch (f) {
            case 45:
              (A = X0), W.push(45);
              break;
            case 60:
              A = iu;
              break;
            case 0:
              W.push(65533);
              break;
            case -1:
              ge();
              break;
            default:
              W.push(f);
              break;
          }
        }
        function X0(f) {
          switch (f) {
            case 45:
              (A = Vp), W.push(45);
              break;
            case 60:
              A = iu;
              break;
            case 0:
              (A = un), W.push(65533);
              break;
            case -1:
              ge();
              break;
            default:
              (A = un), W.push(f);
              break;
          }
        }
        function Vp(f) {
          switch (f) {
            case 45:
              W.push(45);
              break;
            case 60:
              A = iu;
              break;
            case 62:
              (A = Yn), W.push(62);
              break;
            case 0:
              (A = un), W.push(65533);
              break;
            case -1:
              ge();
              break;
            default:
              (A = un), W.push(f);
              break;
          }
        }
        function iu(f) {
          switch (f) {
            case 47:
              In(), (A = J0);
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              In(), W.push(60), re(f, tw);
              break;
            default:
              W.push(60), re(f, un);
              break;
          }
        }
        function J0(f) {
          switch (f) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              as(), re(f, ew);
              break;
            default:
              W.push(60), W.push(47), re(f, un);
              break;
          }
        }
        function ew(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (Bt(Le)) {
                A = dn;
                return;
              }
              break;
            case 47:
              if (Bt(Le)) {
                A = Xn;
                return;
              }
              break;
            case 62:
              if (Bt(Le)) {
                (A = Te), Mn();
                return;
              }
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              (Le += String.fromCharCode(f + 32)), Pe.push(f);
              return;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              (Le += String.fromCharCode(f)), Pe.push(f);
              return;
            default:
              break;
          }
          W.push(60), W.push(47), c(W, Pe), re(f, un);
        }
        function tw(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 47:
            case 62:
              dt(Pe) === "script" ? (A = Zn) : (A = un), W.push(f);
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              Pe.push(f + 32), W.push(f);
              break;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              Pe.push(f), W.push(f);
              break;
            default:
              re(f, un);
              break;
          }
        }
        function Zn(f) {
          switch (f) {
            case 45:
              (A = nw), W.push(45);
              break;
            case 60:
              (A = su), W.push(60);
              break;
            case 0:
              W.push(65533);
              break;
            case -1:
              ge();
              break;
            default:
              W.push(f);
              break;
          }
        }
        function nw(f) {
          switch (f) {
            case 45:
              (A = rw), W.push(45);
              break;
            case 60:
              (A = su), W.push(60);
              break;
            case 0:
              (A = Zn), W.push(65533);
              break;
            case -1:
              ge();
              break;
            default:
              (A = Zn), W.push(f);
              break;
          }
        }
        function rw(f) {
          switch (f) {
            case 45:
              W.push(45);
              break;
            case 60:
              (A = su), W.push(60);
              break;
            case 62:
              (A = Yn), W.push(62);
              break;
            case 0:
              (A = Zn), W.push(65533);
              break;
            case -1:
              ge();
              break;
            default:
              (A = Zn), W.push(f);
              break;
          }
        }
        function su(f) {
          f === 47 ? (In(), (A = iw), W.push(47)) : re(f, Zn);
        }
        function iw(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 47:
            case 62:
              dt(Pe) === "script" ? (A = un) : (A = Zn), W.push(f);
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              Pe.push(f + 32), W.push(f);
              break;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              Pe.push(f), W.push(f);
              break;
            default:
              re(f, Zn);
              break;
          }
        }
        function dn(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 47:
              A = Xn;
              break;
            case 62:
              (A = Te), Mn();
              break;
            case -1:
              ge();
              break;
            case 61:
              Jl(), (Ct += String.fromCharCode(f)), (A = ou);
              break;
            default:
              if (A0()) break;
              Jl(), re(f, ou);
              break;
          }
        }
        function ou(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 47:
            case 62:
            case -1:
              re(f, sw);
              break;
            case 61:
              A = $p;
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              Ct += String.fromCharCode(f + 32);
              break;
            case 0:
              Ct += "\uFFFD";
              break;
            case 34:
            case 39:
            case 60:
            default:
              Ct += cs(_0);
              break;
          }
        }
        function sw(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 47:
              Gn(Ct), (A = Xn);
              break;
            case 61:
              A = $p;
              break;
            case 62:
              (A = Te), Gn(Ct), Mn();
              break;
            case -1:
              Gn(Ct), ge();
              break;
            default:
              Gn(Ct), Jl(), re(f, ou);
              break;
          }
        }
        function $p(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 34:
              eu(), (A = Yo);
              break;
            case 39:
              eu(), (A = Zo);
              break;
            case 62:
            default:
              eu(), re(f, Xo);
              break;
          }
        }
        function Yo(f) {
          switch (f) {
            case 34:
              Gn(Ct, bt), (A = au);
              break;
            case 38:
              (Un = Yo), (A = hs);
              break;
            case 0:
              bt += "\uFFFD";
              break;
            case -1:
              ge();
              break;
            case 10:
              bt += String.fromCharCode(f);
              break;
            default:
              bt += cs(Dn);
              break;
          }
        }
        function Zo(f) {
          switch (f) {
            case 39:
              Gn(Ct, bt), (A = au);
              break;
            case 38:
              (Un = Zo), (A = hs);
              break;
            case 0:
              bt += "\uFFFD";
              break;
            case -1:
              ge();
              break;
            case 10:
              bt += String.fromCharCode(f);
              break;
            default:
              bt += cs(vt);
              break;
          }
        }
        function Xo(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              Gn(Ct, bt), (A = dn);
              break;
            case 38:
              (Un = Xo), (A = hs);
              break;
            case 62:
              Gn(Ct, bt), (A = Te), Mn();
              break;
            case 0:
              bt += "\uFFFD";
              break;
            case -1:
              X--, (A = Te);
              break;
            case 34:
            case 39:
            case 60:
            case 61:
            case 96:
            default:
              bt += cs(ci);
              break;
          }
        }
        function au(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = dn;
              break;
            case 47:
              A = Xn;
              break;
            case 62:
              (A = Te), Mn();
              break;
            case -1:
              ge();
              break;
            default:
              re(f, dn);
              break;
          }
        }
        function Xn(f) {
          switch (f) {
            case 62:
              (A = Te), L0(!0);
              break;
            case -1:
              ge();
              break;
            default:
              re(f, dn);
              break;
          }
        }
        function Jo(f, h, D) {
          var L = h.length;
          D ? (X += L - 1) : (X += L);
          var P = h.substring(0, L - 1);
          (P = P.replace(/\u0000/g, "\uFFFD")),
            (P = P.replace(
              /\u000D\u000A/g,
              `
`
            )),
            (P = P.replace(
              /\u000D/g,
              `
`
            )),
            Qe(b, P),
            (A = Te);
        }
        Jo.lookahead = ">";
        function qp(f, h, D) {
          if (h[0] === "-" && h[1] === "-") {
            (X += 2), Hp(), (A = ow);
            return;
          }
          h.toUpperCase() === "DOCTYPE"
            ? ((X += 7), (A = hw))
            : h === "[CDATA[" && R0()
            ? ((X += 7), (A = uu))
            : (A = Jo);
        }
        qp.lookahead = 7;
        function ow(f) {
          switch ((Hp(), f)) {
            case 45:
              A = aw;
              break;
            case 62:
              (A = Te), Qe(b, dt(Be));
              break;
            default:
              re(f, Mr);
              break;
          }
        }
        function aw(f) {
          switch (f) {
            case 45:
              A = ea;
              break;
            case 62:
              (A = Te), Qe(b, dt(Be));
              break;
            case -1:
              Qe(b, dt(Be)), ge();
              break;
            default:
              Be.push(45), re(f, Mr);
              break;
          }
        }
        function Mr(f) {
          switch (f) {
            case 60:
              Be.push(f), (A = cw);
              break;
            case 45:
              A = cu;
              break;
            case 0:
              Be.push(65533);
              break;
            case -1:
              Qe(b, dt(Be)), ge();
              break;
            default:
              Be.push(f);
              break;
          }
        }
        function cw(f) {
          switch (f) {
            case 33:
              Be.push(f), (A = lw);
              break;
            case 60:
              Be.push(f);
              break;
            default:
              re(f, Mr);
              break;
          }
        }
        function lw(f) {
          switch (f) {
            case 45:
              A = uw;
              break;
            default:
              re(f, Mr);
              break;
          }
        }
        function uw(f) {
          switch (f) {
            case 45:
              A = dw;
              break;
            default:
              re(f, cu);
              break;
          }
        }
        function dw(f) {
          switch (f) {
            case 62:
            case -1:
              re(f, ea);
              break;
            default:
              re(f, ea);
              break;
          }
        }
        function cu(f) {
          switch (f) {
            case 45:
              A = ea;
              break;
            case -1:
              Qe(b, dt(Be)), ge();
              break;
            default:
              Be.push(45), re(f, Mr);
              break;
          }
        }
        function ea(f) {
          switch (f) {
            case 62:
              (A = Te), Qe(b, dt(Be));
              break;
            case 33:
              A = fw;
              break;
            case 45:
              Be.push(45);
              break;
            case -1:
              Qe(b, dt(Be)), ge();
              break;
            default:
              Be.push(45), Be.push(45), re(f, Mr);
              break;
          }
        }
        function fw(f) {
          switch (f) {
            case 45:
              Be.push(45), Be.push(45), Be.push(33), (A = cu);
              break;
            case 62:
              (A = Te), Qe(b, dt(Be));
              break;
            case -1:
              Qe(b, dt(Be)), ge();
              break;
            default:
              Be.push(45), Be.push(45), Be.push(33), re(f, Mr);
              break;
          }
        }
        function hw(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = zp;
              break;
            case -1:
              li(), Re(), Oe(), ge();
              break;
            default:
              re(f, zp);
              break;
          }
        }
        function zp(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              li(), Vn.push(f + 32), (A = lu);
              break;
            case 0:
              li(), Vn.push(65533), (A = lu);
              break;
            case 62:
              li(), Re(), (A = Te), Oe();
              break;
            case -1:
              li(), Re(), Oe(), ge();
              break;
            default:
              li(), Vn.push(f), (A = lu);
              break;
          }
        }
        function lu(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = Gp;
              break;
            case 62:
              (A = Te), Oe();
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              Vn.push(f + 32);
              break;
            case 0:
              Vn.push(65533);
              break;
            case -1:
              Re(), Oe(), ge();
              break;
            default:
              Vn.push(f);
              break;
          }
        }
        function Gp(f, h, D) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              X += 1;
              break;
            case 62:
              (A = Te), (X += 1), Oe();
              break;
            case -1:
              Re(), Oe(), ge();
              break;
            default:
              (h = h.toUpperCase()),
                h === "PUBLIC"
                  ? ((X += 6), (A = pw))
                  : h === "SYSTEM"
                  ? ((X += 6), (A = yw))
                  : (Re(), (A = Jn));
              break;
          }
        }
        Gp.lookahead = 6;
        function pw(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = mw;
              break;
            case 34:
              zo(), (A = Wp);
              break;
            case 39:
              zo(), (A = Kp);
              break;
            case 62:
              Re(), (A = Te), Oe();
              break;
            case -1:
              Re(), Oe(), ge();
              break;
            default:
              Re(), (A = Jn);
              break;
          }
        }
        function mw(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 34:
              zo(), (A = Wp);
              break;
            case 39:
              zo(), (A = Kp);
              break;
            case 62:
              Re(), (A = Te), Oe();
              break;
            case -1:
              Re(), Oe(), ge();
              break;
            default:
              Re(), (A = Jn);
              break;
          }
        }
        function Wp(f) {
          switch (f) {
            case 34:
              A = Qp;
              break;
            case 0:
              $n.push(65533);
              break;
            case 62:
              Re(), (A = Te), Oe();
              break;
            case -1:
              Re(), Oe(), ge();
              break;
            default:
              $n.push(f);
              break;
          }
        }
        function Kp(f) {
          switch (f) {
            case 39:
              A = Qp;
              break;
            case 0:
              $n.push(65533);
              break;
            case 62:
              Re(), (A = Te), Oe();
              break;
            case -1:
              Re(), Oe(), ge();
              break;
            default:
              $n.push(f);
              break;
          }
        }
        function Qp(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = gw;
              break;
            case 62:
              (A = Te), Oe();
              break;
            case 34:
              Wn(), (A = ta);
              break;
            case 39:
              Wn(), (A = na);
              break;
            case -1:
              Re(), Oe(), ge();
              break;
            default:
              Re(), (A = Jn);
              break;
          }
        }
        function gw(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 62:
              (A = Te), Oe();
              break;
            case 34:
              Wn(), (A = ta);
              break;
            case 39:
              Wn(), (A = na);
              break;
            case -1:
              Re(), Oe(), ge();
              break;
            default:
              Re(), (A = Jn);
              break;
          }
        }
        function yw(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = vw;
              break;
            case 34:
              Wn(), (A = ta);
              break;
            case 39:
              Wn(), (A = na);
              break;
            case 62:
              Re(), (A = Te), Oe();
              break;
            case -1:
              Re(), Oe(), ge();
              break;
            default:
              Re(), (A = Jn);
              break;
          }
        }
        function vw(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 34:
              Wn(), (A = ta);
              break;
            case 39:
              Wn(), (A = na);
              break;
            case 62:
              Re(), (A = Te), Oe();
              break;
            case -1:
              Re(), Oe(), ge();
              break;
            default:
              Re(), (A = Jn);
              break;
          }
        }
        function ta(f) {
          switch (f) {
            case 34:
              A = Yp;
              break;
            case 0:
              qn.push(65533);
              break;
            case 62:
              Re(), (A = Te), Oe();
              break;
            case -1:
              Re(), Oe(), ge();
              break;
            default:
              qn.push(f);
              break;
          }
        }
        function na(f) {
          switch (f) {
            case 39:
              A = Yp;
              break;
            case 0:
              qn.push(65533);
              break;
            case 62:
              Re(), (A = Te), Oe();
              break;
            case -1:
              Re(), Oe(), ge();
              break;
            default:
              qn.push(f);
              break;
          }
        }
        function Yp(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 62:
              (A = Te), Oe();
              break;
            case -1:
              Re(), Oe(), ge();
              break;
            default:
              A = Jn;
              break;
          }
        }
        function Jn(f) {
          switch (f) {
            case 62:
              (A = Te), Oe();
              break;
            case -1:
              Oe(), ge();
              break;
            default:
              break;
          }
        }
        function uu(f) {
          switch (f) {
            case 93:
              A = Ew;
              break;
            case -1:
              ge();
              break;
            case 0:
              zn = !0;
            default:
              ls(T0) || W.push(f);
              break;
          }
        }
        function Ew(f) {
          switch (f) {
            case 93:
              A = bw;
              break;
            default:
              W.push(93), re(f, uu);
              break;
          }
        }
        function bw(f) {
          switch (f) {
            case 93:
              W.push(93);
              break;
            case 62:
              ui(), (A = Te);
              break;
            default:
              W.push(93), W.push(93), re(f, uu);
              break;
          }
        }
        function hs(f) {
          switch ((In(), Pe.push(38), f)) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 60:
            case 38:
            case -1:
              re(f, Nr);
              break;
            case 35:
              Pe.push(f), (A = ww);
              break;
            default:
              re(f, Zp);
              break;
          }
        }
        function Zp(f) {
          ht.lastIndex = X;
          var h = ht.exec(Z);
          if (!h) throw new Error("should never happen");
          var D = h[1];
          if (!D) {
            A = Nr;
            return;
          }
          switch (((X += D.length), c(Pe, M0(D)), Un)) {
            case Yo:
            case Zo:
            case Xo:
              if (D[D.length - 1] !== ";" && /[=A-Za-z0-9]/.test(Z[X])) {
                A = Nr;
                return;
              }
              break;
            default:
              break;
          }
          In();
          var L = _e[D];
          typeof L == "number" ? Pe.push(L) : c(Pe, L), (A = Nr);
        }
        Zp.lookahead = -ot;
        function ww(f) {
          switch (((ze = 0), f)) {
            case 120:
            case 88:
              Pe.push(f), (A = Dw);
              break;
            default:
              re(f, _w);
              break;
          }
        }
        function Dw(f) {
          switch (f) {
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
              re(f, Tw);
              break;
            default:
              re(f, Nr);
              break;
          }
        }
        function _w(f) {
          switch (f) {
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
              re(f, Sw);
              break;
            default:
              re(f, Nr);
              break;
          }
        }
        function Tw(f) {
          switch (f) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
              (ze *= 16), (ze += f - 55);
              break;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
              (ze *= 16), (ze += f - 87);
              break;
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
              (ze *= 16), (ze += f - 48);
              break;
            case 59:
              A = ra;
              break;
            default:
              re(f, ra);
              break;
          }
        }
        function Sw(f) {
          switch (f) {
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
              (ze *= 10), (ze += f - 48);
              break;
            case 59:
              A = ra;
              break;
            default:
              re(f, ra);
              break;
          }
        }
        function ra(f) {
          ze in $
            ? (ze = $[ze])
            : (ze > 1114111 || (ze >= 55296 && ze < 57344)) && (ze = 65533),
            In(),
            ze <= 65535
              ? Pe.push(ze)
              : ((ze = ze - 65536),
                Pe.push(55296 + (ze >> 10)),
                Pe.push(56320 + (ze & 1023))),
            re(f, Nr);
        }
        function Nr(f) {
          switch (Un) {
            case Yo:
            case Zo:
            case Xo:
              bt += dt(Pe);
              break;
            default:
              c(W, Pe);
              break;
          }
          re(f, Un);
        }
        function Cw(f, h, D, L) {
          switch (f) {
            case 1:
              if (((h = h.replace(wr, "")), h.length === 0)) return;
              break;
            case 4:
              xe._appendChild(xe.createComment(h));
              return;
            case 5:
              var P = h,
                K = D,
                le = L;
              xe.appendChild(new r(xe, P, K, le)),
                Zl ||
                P.toLowerCase() !== "html" ||
                F.test(K) ||
                (le && le.toLowerCase() === x) ||
                (le === void 0 && _.test(K))
                  ? (xe._quirks = !0)
                  : (w.test(K) || (le !== void 0 && _.test(K))) &&
                    (xe._limitedQuirks = !0),
                (B = Xp);
              return;
          }
          (xe._quirks = !0), (B = Xp), B(f, h, D, L);
        }
        function Xp(f, h, D, L) {
          var P;
          switch (f) {
            case 1:
              if (((h = h.replace(wr, "")), h.length === 0)) return;
              break;
            case 5:
              return;
            case 4:
              xe._appendChild(xe.createComment(h));
              return;
            case 2:
              if (h === "html") {
                (P = us(xe, h, D)), M.push(P), xe.appendChild(P), (B = ia);
                return;
              }
              break;
            case 3:
              switch (h) {
                case "html":
                case "head":
                case "body":
                case "br":
                  break;
                default:
                  return;
              }
          }
          (P = us(xe, "html", null)),
            M.push(P),
            xe.appendChild(P),
            (B = ia),
            B(f, h, D, L);
        }
        function ia(f, h, D, L) {
          switch (f) {
            case 1:
              if (((h = h.replace(wr, "")), h.length === 0)) return;
              break;
            case 5:
              return;
            case 4:
              cn(h);
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "head":
                  var P = fe(h, D);
                  (Uo = P), (B = We);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "html":
                case "head":
                case "body":
                case "br":
                  break;
                default:
                  return;
              }
          }
          ia(d, "head", null), B(f, h, D, L);
        }
        function We(f, h, D, L) {
          switch (f) {
            case 1:
              var P = h.match(wr);
              if (
                (P && (ln(P[0]), (h = h.substring(P[0].length))),
                h.length === 0)
              )
                return;
              break;
            case 4:
              cn(h);
              return;
            case 5:
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "meta":
                case "base":
                case "basefont":
                case "bgsound":
                case "link":
                  fe(h, D), M.pop();
                  return;
                case "title":
                  P0(h, D);
                  return;
                case "noscript":
                  if (!Vo) {
                    fe(h, D), (B = Jp);
                    return;
                  }
                case "noframes":
                case "style":
                  Ko(h, D);
                  return;
                case "script":
                  Go(function (K) {
                    var le = us(K, h, D);
                    return (
                      (le._parser_inserted = !0),
                      (le._force_async = !1),
                      Sr && (le._already_started = !0),
                      ui(),
                      le
                    );
                  }),
                    (A = Yn),
                    (Tn = B),
                    (B = sa);
                  return;
                case "template":
                  fe(h, D), be.insertMarker(), (Ge = !1), (B = hu), Sn.push(B);
                  return;
                case "head":
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "head":
                  M.pop(), (B = du);
                  return;
                case "body":
                case "html":
                case "br":
                  break;
                case "template":
                  if (!M.contains("template")) return;
                  M.generateImpliedEndTags(null, "thorough"),
                    M.popTag("template"),
                    be.clearToMarker(),
                    Sn.pop(),
                    ds();
                  return;
                default:
                  return;
              }
              break;
          }
          We(m, "head", null), B(f, h, D, L);
        }
        function Jp(f, h, D, L) {
          switch (f) {
            case 5:
              return;
            case 4:
              We(f, h);
              return;
            case 1:
              var P = h.match(wr);
              if (
                (P && (We(f, P[0]), (h = h.substring(P[0].length))),
                h.length === 0)
              )
                return;
              break;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "basefont":
                case "bgsound":
                case "link":
                case "meta":
                case "noframes":
                case "style":
                  We(f, h, D);
                  return;
                case "head":
                case "noscript":
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "noscript":
                  M.pop(), (B = We);
                  return;
                case "br":
                  break;
                default:
                  return;
              }
              break;
          }
          Jp(m, "noscript", null), B(f, h, D, L);
        }
        function du(f, h, D, L) {
          switch (f) {
            case 1:
              var P = h.match(wr);
              if (
                (P && (ln(P[0]), (h = h.substring(P[0].length))),
                h.length === 0)
              )
                return;
              break;
            case 4:
              cn(h);
              return;
            case 5:
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "body":
                  fe(h, D), (Ge = !1), (B = ce);
                  return;
                case "frameset":
                  fe(h, D), (B = pu);
                  return;
                case "base":
                case "basefont":
                case "bgsound":
                case "link":
                case "meta":
                case "noframes":
                case "script":
                case "style":
                case "template":
                case "title":
                  M.push(Uo), We(d, h, D), M.removeElement(Uo);
                  return;
                case "head":
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "template":
                  return We(f, h, D, L);
                case "body":
                case "html":
                case "br":
                  break;
                default:
                  return;
              }
              break;
          }
          du(d, "body", null), (Ge = !0), B(f, h, D, L);
        }
        function ce(f, h, D, L) {
          var P, K, le, Se;
          switch (f) {
            case 1:
              if (zn && ((h = h.replace(Fo, "")), h.length === 0)) return;
              Ge && Po.test(h) && (Ge = !1), pt(), ln(h);
              return;
            case 5:
              return;
            case 4:
              cn(h);
              return;
            case -1:
              if (Sn.length) return hu(f);
              Ir();
              return;
            case 2:
              switch (h) {
                case "html":
                  if (M.contains("template")) return;
                  Pp(D, M.elements[0]);
                  return;
                case "base":
                case "basefont":
                case "bgsound":
                case "link":
                case "meta":
                case "noframes":
                case "script":
                case "style":
                case "template":
                case "title":
                  We(d, h, D);
                  return;
                case "body":
                  if (
                    ((P = M.elements[1]),
                    !P ||
                      !(P instanceof a.HTMLBodyElement) ||
                      M.contains("template"))
                  )
                    return;
                  (Ge = !1), Pp(D, P);
                  return;
                case "frameset":
                  if (
                    !Ge ||
                    ((P = M.elements[1]),
                    !P || !(P instanceof a.HTMLBodyElement))
                  )
                    return;
                  for (
                    P.parentNode && P.parentNode.removeChild(P);
                    !(M.top instanceof a.HTMLHtmlElement);

                  )
                    M.pop();
                  fe(h, D), (B = pu);
                  return;
                case "address":
                case "article":
                case "aside":
                case "blockquote":
                case "center":
                case "details":
                case "dialog":
                case "dir":
                case "div":
                case "dl":
                case "fieldset":
                case "figcaption":
                case "figure":
                case "footer":
                case "header":
                case "hgroup":
                case "main":
                case "nav":
                case "ol":
                case "p":
                case "section":
                case "summary":
                case "ul":
                  M.inButtonScope("p") && ce(m, "p"), fe(h, D);
                  return;
                case "menu":
                  M.inButtonScope("p") && ce(m, "p"),
                    ke(M.top, "menuitem") && M.pop(),
                    fe(h, D);
                  return;
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                  M.inButtonScope("p") && ce(m, "p"),
                    M.top instanceof a.HTMLHeadingElement && M.pop(),
                    fe(h, D);
                  return;
                case "pre":
                case "listing":
                  M.inButtonScope("p") && ce(m, "p"),
                    fe(h, D),
                    (Cr = !0),
                    (Ge = !1);
                  return;
                case "form":
                  if (Cn && !M.contains("template")) return;
                  M.inButtonScope("p") && ce(m, "p"),
                    (Se = fe(h, D)),
                    M.contains("template") || (Cn = Se);
                  return;
                case "li":
                  for (Ge = !1, K = M.elements.length - 1; K >= 0; K--) {
                    if (((le = M.elements[K]), le instanceof a.HTMLLIElement)) {
                      ce(m, "li");
                      break;
                    }
                    if (ke(le, T) && !ke(le, E)) break;
                  }
                  M.inButtonScope("p") && ce(m, "p"), fe(h, D);
                  return;
                case "dd":
                case "dt":
                  for (Ge = !1, K = M.elements.length - 1; K >= 0; K--) {
                    if (((le = M.elements[K]), ke(le, ee))) {
                      ce(m, le.localName);
                      break;
                    }
                    if (ke(le, T) && !ke(le, E)) break;
                  }
                  M.inButtonScope("p") && ce(m, "p"), fe(h, D);
                  return;
                case "plaintext":
                  M.inButtonScope("p") && ce(m, "p"), fe(h, D), (A = ru);
                  return;
                case "button":
                  M.inScope("button")
                    ? (ce(m, "button"), B(f, h, D, L))
                    : (pt(), fe(h, D), (Ge = !1));
                  return;
                case "a":
                  var $e = be.findElementByTag("a");
                  $e && (ce(m, h), be.remove($e), M.removeElement($e));
                case "b":
                case "big":
                case "code":
                case "em":
                case "font":
                case "i":
                case "s":
                case "small":
                case "strike":
                case "strong":
                case "tt":
                case "u":
                  pt(), be.push(fe(h, D), D);
                  return;
                case "nobr":
                  pt(), M.inScope(h) && (ce(m, h), pt()), be.push(fe(h, D), D);
                  return;
                case "applet":
                case "marquee":
                case "object":
                  pt(), fe(h, D), be.insertMarker(), (Ge = !1);
                  return;
                case "table":
                  !xe._quirks && M.inButtonScope("p") && ce(m, "p"),
                    fe(h, D),
                    (Ge = !1),
                    (B = Ut);
                  return;
                case "area":
                case "br":
                case "embed":
                case "img":
                case "keygen":
                case "wbr":
                  pt(), fe(h, D), M.pop(), (Ge = !1);
                  return;
                case "input":
                  pt(), (Se = fe(h, D)), M.pop();
                  var ct = Se.getAttribute("type");
                  (!ct || ct.toLowerCase() !== "hidden") && (Ge = !1);
                  return;
                case "param":
                case "source":
                case "track":
                  fe(h, D), M.pop();
                  return;
                case "hr":
                  M.inButtonScope("p") && ce(m, "p"),
                    ke(M.top, "menuitem") && M.pop(),
                    fe(h, D),
                    M.pop(),
                    (Ge = !1);
                  return;
                case "image":
                  ce(d, "img", D, L);
                  return;
                case "textarea":
                  fe(h, D), (Cr = !0), (Ge = !1), (A = Qn), (Tn = B), (B = sa);
                  return;
                case "xmp":
                  M.inButtonScope("p") && ce(m, "p"), pt(), (Ge = !1), Ko(h, D);
                  return;
                case "iframe":
                  (Ge = !1), Ko(h, D);
                  return;
                case "noembed":
                  Ko(h, D);
                  return;
                case "select":
                  pt(),
                    fe(h, D),
                    (Ge = !1),
                    B === Ut || B === fu || B === Ar || B === ps || B === di
                      ? (B = aa)
                      : (B = Nn);
                  return;
                case "optgroup":
                case "option":
                  M.top instanceof a.HTMLOptionElement && ce(m, "option"),
                    pt(),
                    fe(h, D);
                  return;
                case "menuitem":
                  ke(M.top, "menuitem") && M.pop(), pt(), fe(h, D);
                  return;
                case "rb":
                case "rtc":
                  M.inScope("ruby") && M.generateImpliedEndTags(), fe(h, D);
                  return;
                case "rp":
                case "rt":
                  M.inScope("ruby") && M.generateImpliedEndTags("rtc"),
                    fe(h, D);
                  return;
                case "math":
                  pt(), Lp(D), Yl(D), tu(h, D, s.MATHML), L && M.pop();
                  return;
                case "svg":
                  pt(), kp(D), Yl(D), tu(h, D, s.SVG), L && M.pop();
                  return;
                case "caption":
                case "col":
                case "colgroup":
                case "frame":
                case "head":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  return;
              }
              pt(), fe(h, D);
              return;
            case 3:
              switch (h) {
                case "template":
                  We(m, h, D);
                  return;
                case "body":
                  if (!M.inScope("body")) return;
                  B = em;
                  return;
                case "html":
                  if (!M.inScope("body")) return;
                  (B = em), B(f, h, D);
                  return;
                case "address":
                case "article":
                case "aside":
                case "blockquote":
                case "button":
                case "center":
                case "details":
                case "dialog":
                case "dir":
                case "div":
                case "dl":
                case "fieldset":
                case "figcaption":
                case "figure":
                case "footer":
                case "header":
                case "hgroup":
                case "listing":
                case "main":
                case "menu":
                case "nav":
                case "ol":
                case "pre":
                case "section":
                case "summary":
                case "ul":
                  if (!M.inScope(h)) return;
                  M.generateImpliedEndTags(), M.popTag(h);
                  return;
                case "form":
                  if (M.contains("template")) {
                    if (!M.inScope("form")) return;
                    M.generateImpliedEndTags(), M.popTag("form");
                  } else {
                    var Vt = Cn;
                    if (((Cn = null), !Vt || !M.elementInScope(Vt))) return;
                    M.generateImpliedEndTags(), M.removeElement(Vt);
                  }
                  return;
                case "p":
                  M.inButtonScope(h)
                    ? (M.generateImpliedEndTags(h), M.popTag(h))
                    : (ce(d, h, null), B(f, h, D, L));
                  return;
                case "li":
                  if (!M.inListItemScope(h)) return;
                  M.generateImpliedEndTags(h), M.popTag(h);
                  return;
                case "dd":
                case "dt":
                  if (!M.inScope(h)) return;
                  M.generateImpliedEndTags(h), M.popTag(h);
                  return;
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                  if (!M.elementTypeInScope(a.HTMLHeadingElement)) return;
                  M.generateImpliedEndTags(),
                    M.popElementType(a.HTMLHeadingElement);
                  return;
                case "sarcasm":
                  break;
                case "a":
                case "b":
                case "big":
                case "code":
                case "em":
                case "font":
                case "i":
                case "nobr":
                case "s":
                case "small":
                case "strike":
                case "strong":
                case "tt":
                case "u":
                  var Yt = F0(h);
                  if (Yt) return;
                  break;
                case "applet":
                case "marquee":
                case "object":
                  if (!M.inScope(h)) return;
                  M.generateImpliedEndTags(), M.popTag(h), be.clearToMarker();
                  return;
                case "br":
                  ce(d, h, null);
                  return;
              }
              for (K = M.elements.length - 1; K >= 0; K--)
                if (((le = M.elements[K]), ke(le, h))) {
                  M.generateImpliedEndTags(h), M.popElement(le);
                  break;
                } else if (ke(le, T)) return;
              return;
          }
        }
        function sa(f, h, D, L) {
          switch (f) {
            case 1:
              ln(h);
              return;
            case -1:
              M.top instanceof a.HTMLScriptElement &&
                (M.top._already_started = !0),
                M.pop(),
                (B = Tn),
                B(f);
              return;
            case 3:
              h === "script" ? j0() : (M.pop(), (B = Tn));
              return;
            default:
              return;
          }
        }
        function Ut(f, h, D, L) {
          function P(le) {
            for (var Se = 0, $e = le.length; Se < $e; Se++)
              if (le[Se][0] === "type") return le[Se][1].toLowerCase();
            return null;
          }
          switch (f) {
            case 1:
              if (Xl) {
                ce(f, h, D, L);
                return;
              } else if (ke(M.top, ne)) {
                ($o = []), (Tn = B), (B = Iw), B(f, h, D, L);
                return;
              }
              break;
            case 4:
              cn(h);
              return;
            case 5:
              return;
            case 2:
              switch (h) {
                case "caption":
                  M.clearToContext(O), be.insertMarker(), fe(h, D), (B = fu);
                  return;
                case "colgroup":
                  M.clearToContext(O), fe(h, D), (B = oa);
                  return;
                case "col":
                  Ut(d, "colgroup", null), B(f, h, D, L);
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  M.clearToContext(O), fe(h, D), (B = Ar);
                  return;
                case "td":
                case "th":
                case "tr":
                  Ut(d, "tbody", null), B(f, h, D, L);
                  return;
                case "table":
                  if (!M.inTableScope(h)) return;
                  Ut(m, h), B(f, h, D, L);
                  return;
                case "style":
                case "script":
                case "template":
                  We(f, h, D, L);
                  return;
                case "input":
                  var K = P(D);
                  if (K !== "hidden") break;
                  fe(h, D), M.pop();
                  return;
                case "form":
                  if (Cn || M.contains("template")) return;
                  (Cn = fe(h, D)), M.popElement(Cn);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "table":
                  if (!M.inTableScope(h)) return;
                  M.popTag(h), ds();
                  return;
                case "body":
                case "caption":
                case "col":
                case "colgroup":
                case "html":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  return;
                case "template":
                  We(f, h, D, L);
                  return;
              }
              break;
            case -1:
              ce(f, h, D, L);
              return;
          }
          (Kn = !0), ce(f, h, D, L), (Kn = !1);
        }
        function Iw(f, h, D, L) {
          if (f === u) {
            if (zn && ((h = h.replace(Fo, "")), h.length === 0)) return;
            $o.push(h);
          } else {
            var P = $o.join("");
            ($o.length = 0),
              Po.test(P) ? ((Kn = !0), ce(u, P), (Kn = !1)) : ln(P),
              (B = Tn),
              B(f, h, D, L);
          }
        }
        function fu(f, h, D, L) {
          function P() {
            return M.inTableScope("caption")
              ? (M.generateImpliedEndTags(),
                M.popTag("caption"),
                be.clearToMarker(),
                (B = Ut),
                !0)
              : !1;
          }
          switch (f) {
            case 2:
              switch (h) {
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  P() && B(f, h, D, L);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "caption":
                  P();
                  return;
                case "table":
                  P() && B(f, h, D, L);
                  return;
                case "body":
                case "col":
                case "colgroup":
                case "html":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  return;
              }
              break;
          }
          ce(f, h, D, L);
        }
        function oa(f, h, D, L) {
          switch (f) {
            case 1:
              var P = h.match(wr);
              if (
                (P && (ln(P[0]), (h = h.substring(P[0].length))),
                h.length === 0)
              )
                return;
              break;
            case 4:
              cn(h);
              return;
            case 5:
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "col":
                  fe(h, D), M.pop();
                  return;
                case "template":
                  We(f, h, D, L);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "colgroup":
                  if (!ke(M.top, "colgroup")) return;
                  M.pop(), (B = Ut);
                  return;
                case "col":
                  return;
                case "template":
                  We(f, h, D, L);
                  return;
              }
              break;
            case -1:
              ce(f, h, D, L);
              return;
          }
          ke(M.top, "colgroup") && (oa(m, "colgroup"), B(f, h, D, L));
        }
        function Ar(f, h, D, L) {
          function P() {
            (!M.inTableScope("tbody") &&
              !M.inTableScope("thead") &&
              !M.inTableScope("tfoot")) ||
              (M.clearToContext(j),
              Ar(m, M.top.localName, null),
              B(f, h, D, L));
          }
          switch (f) {
            case 2:
              switch (h) {
                case "tr":
                  M.clearToContext(j), fe(h, D), (B = ps);
                  return;
                case "th":
                case "td":
                  Ar(d, "tr", null), B(f, h, D, L);
                  return;
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "tfoot":
                case "thead":
                  P();
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "table":
                  P();
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  M.inTableScope(h) && (M.clearToContext(j), M.pop(), (B = Ut));
                  return;
                case "body":
                case "caption":
                case "col":
                case "colgroup":
                case "html":
                case "td":
                case "th":
                case "tr":
                  return;
              }
              break;
          }
          Ut(f, h, D, L);
        }
        function ps(f, h, D, L) {
          function P() {
            return M.inTableScope("tr")
              ? (M.clearToContext(Y), M.pop(), (B = Ar), !0)
              : !1;
          }
          switch (f) {
            case 2:
              switch (h) {
                case "th":
                case "td":
                  M.clearToContext(Y), fe(h, D), (B = di), be.insertMarker();
                  return;
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "tfoot":
                case "thead":
                case "tr":
                  P() && B(f, h, D, L);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "tr":
                  P();
                  return;
                case "table":
                  P() && B(f, h, D, L);
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  M.inTableScope(h) && P() && B(f, h, D, L);
                  return;
                case "body":
                case "caption":
                case "col":
                case "colgroup":
                case "html":
                case "td":
                case "th":
                  return;
              }
              break;
          }
          Ut(f, h, D, L);
        }
        function di(f, h, D, L) {
          switch (f) {
            case 2:
              switch (h) {
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  M.inTableScope("td")
                    ? (di(m, "td"), B(f, h, D, L))
                    : M.inTableScope("th") && (di(m, "th"), B(f, h, D, L));
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "td":
                case "th":
                  if (!M.inTableScope(h)) return;
                  M.generateImpliedEndTags(),
                    M.popTag(h),
                    be.clearToMarker(),
                    (B = ps);
                  return;
                case "body":
                case "caption":
                case "col":
                case "colgroup":
                case "html":
                  return;
                case "table":
                case "tbody":
                case "tfoot":
                case "thead":
                case "tr":
                  if (!M.inTableScope(h)) return;
                  di(m, M.inTableScope("td") ? "td" : "th"), B(f, h, D, L);
                  return;
              }
              break;
          }
          ce(f, h, D, L);
        }
        function Nn(f, h, D, L) {
          switch (f) {
            case 1:
              if (zn && ((h = h.replace(Fo, "")), h.length === 0)) return;
              ln(h);
              return;
            case 4:
              cn(h);
              return;
            case 5:
              return;
            case -1:
              ce(f, h, D, L);
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "option":
                  M.top instanceof a.HTMLOptionElement && Nn(m, h), fe(h, D);
                  return;
                case "optgroup":
                  M.top instanceof a.HTMLOptionElement && Nn(m, "option"),
                    M.top instanceof a.HTMLOptGroupElement && Nn(m, h),
                    fe(h, D);
                  return;
                case "select":
                  Nn(m, h);
                  return;
                case "input":
                case "keygen":
                case "textarea":
                  if (!M.inSelectScope("select")) return;
                  Nn(m, "select"), B(f, h, D, L);
                  return;
                case "script":
                case "template":
                  We(f, h, D, L);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "optgroup":
                  M.top instanceof a.HTMLOptionElement &&
                    M.elements[M.elements.length - 2] instanceof
                      a.HTMLOptGroupElement &&
                    Nn(m, "option"),
                    M.top instanceof a.HTMLOptGroupElement && M.pop();
                  return;
                case "option":
                  M.top instanceof a.HTMLOptionElement && M.pop();
                  return;
                case "select":
                  if (!M.inSelectScope(h)) return;
                  M.popTag(h), ds();
                  return;
                case "template":
                  We(f, h, D, L);
                  return;
              }
              break;
          }
        }
        function aa(f, h, D, L) {
          switch (h) {
            case "caption":
            case "table":
            case "tbody":
            case "tfoot":
            case "thead":
            case "tr":
            case "td":
            case "th":
              switch (f) {
                case 2:
                  aa(m, "select"), B(f, h, D, L);
                  return;
                case 3:
                  M.inTableScope(h) && (aa(m, "select"), B(f, h, D, L));
                  return;
              }
          }
          Nn(f, h, D, L);
        }
        function hu(f, h, D, L) {
          function P(K) {
            (B = K), (Sn[Sn.length - 1] = B), B(f, h, D, L);
          }
          switch (f) {
            case 1:
            case 4:
            case 5:
              ce(f, h, D, L);
              return;
            case -1:
              M.contains("template")
                ? (M.popTag("template"),
                  be.clearToMarker(),
                  Sn.pop(),
                  ds(),
                  B(f, h, D, L))
                : Ir();
              return;
            case 2:
              switch (h) {
                case "base":
                case "basefont":
                case "bgsound":
                case "link":
                case "meta":
                case "noframes":
                case "script":
                case "style":
                case "template":
                case "title":
                  We(f, h, D, L);
                  return;
                case "caption":
                case "colgroup":
                case "tbody":
                case "tfoot":
                case "thead":
                  P(Ut);
                  return;
                case "col":
                  P(oa);
                  return;
                case "tr":
                  P(Ar);
                  return;
                case "td":
                case "th":
                  P(ps);
                  return;
              }
              P(ce);
              return;
            case 3:
              switch (h) {
                case "template":
                  We(f, h, D, L);
                  return;
                default:
                  return;
              }
          }
        }
        function em(f, h, D, L) {
          switch (f) {
            case 1:
              if (Po.test(h)) break;
              ce(f, h);
              return;
            case 4:
              M.elements[0]._appendChild(xe.createComment(h));
              return;
            case 5:
              return;
            case -1:
              Ir();
              return;
            case 2:
              if (h === "html") {
                ce(f, h, D, L);
                return;
              }
              break;
            case 3:
              if (h === "html") {
                if (Sr) return;
                B = Nw;
                return;
              }
              break;
          }
          (B = ce), B(f, h, D, L);
        }
        function pu(f, h, D, L) {
          switch (f) {
            case 1:
              (h = h.replace(Ql, "")), h.length > 0 && ln(h);
              return;
            case 4:
              cn(h);
              return;
            case 5:
              return;
            case -1:
              Ir();
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "frameset":
                  fe(h, D);
                  return;
                case "frame":
                  fe(h, D), M.pop();
                  return;
                case "noframes":
                  We(f, h, D, L);
                  return;
              }
              break;
            case 3:
              if (h === "frameset") {
                if (Sr && M.top instanceof a.HTMLHtmlElement) return;
                M.pop(),
                  !Sr && !(M.top instanceof a.HTMLFrameSetElement) && (B = Mw);
                return;
              }
              break;
          }
        }
        function Mw(f, h, D, L) {
          switch (f) {
            case 1:
              (h = h.replace(Ql, "")), h.length > 0 && ln(h);
              return;
            case 4:
              cn(h);
              return;
            case 5:
              return;
            case -1:
              Ir();
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "noframes":
                  We(f, h, D, L);
                  return;
              }
              break;
            case 3:
              if (h === "html") {
                B = Aw;
                return;
              }
              break;
          }
        }
        function Nw(f, h, D, L) {
          switch (f) {
            case 1:
              if (Po.test(h)) break;
              ce(f, h, D, L);
              return;
            case 4:
              xe._appendChild(xe.createComment(h));
              return;
            case 5:
              ce(f, h, D, L);
              return;
            case -1:
              Ir();
              return;
            case 2:
              if (h === "html") {
                ce(f, h, D, L);
                return;
              }
              break;
          }
          (B = ce), B(f, h, D, L);
        }
        function Aw(f, h, D, L) {
          switch (f) {
            case 1:
              (h = h.replace(Ql, "")), h.length > 0 && ce(f, h, D, L);
              return;
            case 4:
              xe._appendChild(xe.createComment(h));
              return;
            case 5:
              ce(f, h, D, L);
              return;
            case -1:
              Ir();
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "noframes":
                  We(f, h, D, L);
                  return;
              }
              break;
          }
        }
        function tm(f, h, D, L) {
          function P($e) {
            for (var ct = 0, Vt = $e.length; ct < Vt; ct++)
              switch ($e[ct][0]) {
                case "color":
                case "face":
                case "size":
                  return !0;
              }
            return !1;
          }
          var K;
          switch (f) {
            case 1:
              Ge && I0.test(h) && (Ge = !1),
                zn && (h = h.replace(Fo, "\uFFFD")),
                ln(h);
              return;
            case 4:
              cn(h);
              return;
            case 5:
              return;
            case 2:
              switch (h) {
                case "font":
                  if (!P(D)) break;
                case "b":
                case "big":
                case "blockquote":
                case "body":
                case "br":
                case "center":
                case "code":
                case "dd":
                case "div":
                case "dl":
                case "dt":
                case "em":
                case "embed":
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                case "head":
                case "hr":
                case "i":
                case "img":
                case "li":
                case "listing":
                case "menu":
                case "meta":
                case "nobr":
                case "ol":
                case "p":
                case "pre":
                case "ruby":
                case "s":
                case "small":
                case "span":
                case "strong":
                case "strike":
                case "sub":
                case "sup":
                case "table":
                case "tt":
                case "u":
                case "ul":
                case "var":
                  if (Sr) break;
                  do M.pop(), (K = M.top);
                  while (K.namespaceURI !== s.HTML && !Rp(K) && !Op(K));
                  Qe(f, h, D, L);
                  return;
              }
              (K = M.elements.length === 1 && Sr ? U : M.top),
                K.namespaceURI === s.MATHML
                  ? Lp(D)
                  : K.namespaceURI === s.SVG && ((h = N0(h)), kp(D)),
                Yl(D),
                tu(h, D, K.namespaceURI),
                L && (h === "script" && (K.namespaceURI, s.SVG), M.pop());
              return;
            case 3:
              if (
                ((K = M.top),
                h === "script" &&
                  K.namespaceURI === s.SVG &&
                  K.localName === "script")
              )
                M.pop();
              else
                for (var le = M.elements.length - 1, Se = M.elements[le]; ; ) {
                  if (Se.localName.toLowerCase() === h) {
                    M.popElement(Se);
                    break;
                  }
                  if (((Se = M.elements[--le]), Se.namespaceURI === s.HTML)) {
                    B(f, h, D, L);
                    break;
                  }
                }
              return;
          }
        }
        return (
          (qo.testTokenizer = function (f, h, D, L) {
            var P = [];
            switch (h) {
              case "PCDATA state":
                A = Te;
                break;
              case "RCDATA state":
                A = Qn;
                break;
              case "RAWTEXT state":
                A = fs;
                break;
              case "PLAINTEXT state":
                A = ru;
                break;
            }
            if (
              (D && (Ho = D),
              (Qe = function (le, Se, $e, ct) {
                switch ((ui(), le)) {
                  case 1:
                    P.length > 0 && P[P.length - 1][0] === "Character"
                      ? (P[P.length - 1][1] += Se)
                      : P.push(["Character", Se]);
                    break;
                  case 4:
                    P.push(["Comment", Se]);
                    break;
                  case 5:
                    P.push([
                      "DOCTYPE",
                      Se,
                      $e === void 0 ? null : $e,
                      ct === void 0 ? null : ct,
                      !Zl,
                    ]);
                    break;
                  case 2:
                    for (
                      var Vt = Object.create(null), Yt = 0;
                      Yt < $e.length;
                      Yt++
                    ) {
                      var xr = $e[Yt];
                      xr.length === 1 ? (Vt[xr[0]] = "") : (Vt[xr[0]] = xr[1]);
                    }
                    var er = ["StartTag", Se, Vt];
                    ct && er.push(!0), P.push(er);
                    break;
                  case 3:
                    P.push(["EndTag", Se]);
                    break;
                  case -1:
                    break;
                }
              }),
              !L)
            )
              this.parse(f, !0);
            else {
              for (var K = 0; K < f.length; K++) this.parse(f[K]);
              this.parse("", !0);
            }
            return P;
          }),
          qo
        );
      }
    },
  }),
  xl = oe({
    "external/npm/node_modules/domino/lib/DOMImplementation.js"(t, e) {
      "use strict";
      e.exports = a;
      var n = Bh(),
        r = Uh(),
        i = Vh(),
        s = Xe(),
        o = kh();
      function a(l) {
        this.contextObject = l;
      }
      var c = {
        xml: { "": !0, "1.0": !0, "2.0": !0 },
        core: { "": !0, "2.0": !0 },
        html: { "": !0, "1.0": !0, "2.0": !0 },
        xhtml: { "": !0, "1.0": !0, "2.0": !0 },
      };
      a.prototype = {
        hasFeature: function (u, d) {
          var m = c[(u || "").toLowerCase()];
          return (m && m[d || ""]) || !1;
        },
        createDocumentType: function (u, d, m) {
          return (
            o.isValidQName(u) || s.InvalidCharacterError(),
            new r(this.contextObject, u, d, m)
          );
        },
        createDocument: function (u, d, m) {
          var b = new n(!1, null),
            I;
          return (
            d ? (I = b.createElementNS(u, d)) : (I = null),
            m && b.appendChild(m),
            I && b.appendChild(I),
            u === s.NAMESPACE.HTML
              ? (b._contentType = "application/xhtml+xml")
              : u === s.NAMESPACE.SVG
              ? (b._contentType = "image/svg+xml")
              : (b._contentType = "application/xml"),
            b
          );
        },
        createHTMLDocument: function (u) {
          var d = new n(!0, null);
          d.appendChild(new r(d, "html"));
          var m = d.createElement("html");
          d.appendChild(m);
          var b = d.createElement("head");
          if ((m.appendChild(b), u !== void 0)) {
            var I = d.createElement("title");
            b.appendChild(I), I.appendChild(d.createTextNode(u));
          }
          return m.appendChild(d.createElement("body")), (d.modclock = 1), d;
        },
        mozSetOutputMutationHandler: function (l, u) {
          l.mutationHandler = u;
        },
        mozGetInputMutationHandler: function (l) {
          s.nyi();
        },
        mozHTMLParser: i,
      };
    },
  }),
  LN = oe({
    "external/npm/node_modules/domino/lib/Location.js"(t, e) {
      "use strict";
      var n = Fh(),
        r = Rb();
      e.exports = i;
      function i(s, o) {
        (this._window = s), (this._href = o);
      }
      i.prototype = Object.create(r.prototype, {
        constructor: { value: i },
        href: {
          get: function () {
            return this._href;
          },
          set: function (s) {
            this.assign(s);
          },
        },
        assign: {
          value: function (s) {
            var o = new n(this._href),
              a = o.resolve(s);
            this._href = a;
          },
        },
        replace: {
          value: function (s) {
            this.assign(s);
          },
        },
        reload: {
          value: function () {
            this.assign(this.href);
          },
        },
        toString: {
          value: function () {
            return this.href;
          },
        },
      });
    },
  }),
  PN = oe({
    "external/npm/node_modules/domino/lib/NavigatorID.js"(t, e) {
      "use strict";
      var n = Object.create(null, {
        appCodeName: { value: "Mozilla" },
        appName: { value: "Netscape" },
        appVersion: { value: "4.0" },
        platform: { value: "" },
        product: { value: "Gecko" },
        productSub: { value: "20100101" },
        userAgent: { value: "" },
        vendor: { value: "" },
        vendorSub: { value: "" },
        taintEnabled: {
          value: function () {
            return !1;
          },
        },
      });
      e.exports = n;
    },
  }),
  FN = oe({
    "external/npm/node_modules/domino/lib/WindowTimers.js"(t, e) {
      "use strict";
      var n = { setTimeout, clearTimeout, setInterval, clearInterval };
      e.exports = n;
    },
  }),
  Lb = oe({
    "external/npm/node_modules/domino/lib/impl.js"(t, e) {
      "use strict";
      var n = Xe();
      (t = e.exports =
        {
          CSSStyleDeclaration: jh(),
          CharacterData: Nl(),
          Comment: Ib(),
          DOMException: xh(),
          DOMImplementation: xl(),
          DOMTokenList: Db(),
          Document: Bh(),
          DocumentFragment: Mb(),
          DocumentType: Uh(),
          Element: vo(),
          HTMLParser: Vh(),
          NamedNodeMap: Tb(),
          Node: ft(),
          NodeList: Qi(),
          NodeFilter: Al(),
          ProcessingInstruction: Nb(),
          Text: Cb(),
          Window: Pb(),
        }),
        n.merge(t, xb()),
        n.merge(t, Hh().elements),
        n.merge(t, kb().elements);
    },
  }),
  Pb = oe({
    "external/npm/node_modules/domino/lib/Window.js"(t, e) {
      "use strict";
      var n = xl(),
        r = vb(),
        i = LN(),
        s = Xe();
      e.exports = o;
      function o(a) {
        (this.document = a || new n(null).createHTMLDocument("")),
          (this.document._scripting_enabled = !0),
          (this.document.defaultView = this),
          (this.location = new i(
            this,
            this.document._address || "about:blank"
          ));
      }
      (o.prototype = Object.create(r.prototype, {
        console: { value: console },
        history: { value: { back: s.nyi, forward: s.nyi, go: s.nyi } },
        navigator: { value: PN() },
        window: {
          get: function () {
            return this;
          },
        },
        self: {
          get: function () {
            return this;
          },
        },
        frames: {
          get: function () {
            return this;
          },
        },
        parent: {
          get: function () {
            return this;
          },
        },
        top: {
          get: function () {
            return this;
          },
        },
        length: { value: 0 },
        frameElement: { value: null },
        opener: { value: null },
        onload: {
          get: function () {
            return this._getEventHandler("load");
          },
          set: function (a) {
            this._setEventHandler("load", a);
          },
        },
        getComputedStyle: {
          value: function (c) {
            return c.style;
          },
        },
      })),
        s.expose(FN(), o),
        s.expose(Lb(), o);
    },
  }),
  jN = oe({
    "external/npm/node_modules/domino/lib/index.js"(t) {
      var e = xl(),
        n = Vh(),
        r = Pb(),
        i = Lb();
      (t.createDOMImplementation = function () {
        return new e(null);
      }),
        (t.createDocument = function (s, o) {
          if (s || o) {
            var a = new n();
            return a.parse(s || "", !0), a.document();
          }
          return new e(null).createHTMLDocument("");
        }),
        (t.createIncrementalHTMLParser = function () {
          var s = new n();
          return {
            write: function (o) {
              o.length > 0 &&
                s.parse(o, !1, function () {
                  return !0;
                });
            },
            end: function (o) {
              s.parse(o || "", !0, function () {
                return !0;
              });
            },
            process: function (o) {
              return s.parse("", !1, o);
            },
            document: function () {
              return s.document();
            },
          };
        }),
        (t.createWindow = function (s, o) {
          var a = t.createDocument(s);
          return o !== void 0 && (a._address = o), new i.Window(a);
        }),
        (t.impl = i);
    },
  }),
  Ml = jN();
function HN() {
  Object.assign(globalThis, Ml.impl),
    (globalThis.KeyboardEvent = Ml.impl.Event);
}
function Fb(t, e = "/") {
  return Ml.createWindow(t, e).document;
}
function BN(t) {
  return t.serialize();
}
var Ah = class t extends so {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !1);
    }
    static makeCurrent() {
      HN(), Xc(new t());
    }
    createHtmlDocument() {
      return Fb(
        "<html><head><title>fakeTitle</title></head><body></body></html>"
      );
    }
    getDefaultDocument() {
      return t.defaultDoc || (t.defaultDoc = Ml.createDocument()), t.defaultDoc;
    }
    isElementNode(e) {
      return e ? e.nodeType === t.defaultDoc.ELEMENT_NODE : !1;
    }
    isShadowRoot(e) {
      return e.shadowRoot == e;
    }
    getGlobalEventTarget(e, n) {
      return n === "window"
        ? e.defaultView
        : n === "document"
        ? e
        : n === "body"
        ? e.body
        : null;
    }
    getBaseHref(e) {
      return (
        e.documentElement.querySelector("base")?.getAttribute("href") || ""
      );
    }
    dispatchEvent(e, n) {
      e.dispatchEvent(n);
      let i = (e.ownerDocument || e).defaultView;
      i && i.dispatchEvent(n);
    }
    getUserAgent() {
      return "Fake user agent";
    }
    getCookie(e) {
      throw new Error("getCookie has not been implemented");
    }
  },
  jb = (() => {
    let e = class e {
      constructor(r) {
        this._doc = r;
      }
      renderToString() {
        return BN(this._doc);
      }
      getDocument() {
        return this._doc;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(se(Ve));
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  UN = (() => {
    let e = class e {
      ɵloadImpl() {
        return Rr(this, null, function* () {
          if (!this.xhrImpl) {
            let { default: r } = yield import("./chunk-O73ZHKXN.mjs");
            this.xhrImpl = r;
          }
        });
      }
      build() {
        let r = this.xhrImpl;
        if (!r)
          throw new Error(
            "Unexpected state in ServerXhr: XHR implementation is not loaded."
          );
        return new r.XMLHttpRequest();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function VN(t, e) {
  let n = G(Js),
    { href: r, protocol: i, hostname: s, port: o } = n;
  if (!i.startsWith("http")) return e(t);
  let a = `${i}//${s}`;
  o && (a += `:${o}`);
  let c = n.getBaseHrefFromDOM() || r,
    l = new URL(c, a),
    u = new URL(t.url, l).toString();
  return e(t.clone({ url: u }));
}
var $N = [
    { provide: hr, useClass: UN },
    { provide: al, useValue: VN, multi: !0 },
  ],
  Rl = new ae("Server.INITIAL_CONFIG"),
  Hb = new ae("Server.RENDER_MODULE_HOOK"),
  Il = "resolve:";
function Nh(t) {
  let {
    hostname: e,
    protocol: n,
    port: r,
    pathname: i,
    search: s,
    hash: o,
  } = new URL(t, Il + "//");
  return (
    n !== Il &&
      r === "" &&
      /\:(80|443)/.test(t) &&
      (r = n === "http:" ? "80" : "443"),
    n === Il && t.charAt(0) !== "/" && (i = i.slice(1)),
    {
      hostname: e,
      protocol: n === Il ? "" : n,
      port: r,
      pathname: i,
      search: s,
      hash: o,
    }
  );
}
var qN = (() => {
    let e = class e {
      constructor(r, i) {
        (this._doc = r),
          (this.href = "/"),
          (this.hostname = "/"),
          (this.protocol = "/"),
          (this.port = "/"),
          (this.pathname = "/"),
          (this.search = ""),
          (this.hash = ""),
          (this._hashUpdate = new mt());
        let s = i;
        if (s) {
          if (s.url) {
            let o = Nh(s.url);
            (this.protocol = o.protocol),
              (this.hostname = o.hostname),
              (this.port = o.port),
              (this.pathname = o.pathname),
              (this.search = o.search),
              (this.hash = o.hash),
              (this.href = r.location.href);
          }
          if (s.useAbsoluteUrl) {
            if (!s.baseUrl)
              throw new Error(
                '"PlatformConfig.baseUrl" must be set if "useAbsoluteUrl" is true'
              );
            let o = Nh(s.baseUrl);
            (this.protocol = o.protocol),
              (this.hostname = o.hostname),
              (this.port = o.port);
          }
        }
      }
      getBaseHrefFromDOM() {
        return yn().getBaseHref(this._doc);
      }
      onPopState(r) {
        return () => {};
      }
      onHashChange(r) {
        let i = this._hashUpdate.subscribe(r);
        return () => i.unsubscribe();
      }
      get url() {
        return `${this.pathname}${this.search}${this.hash}`;
      }
      setHash(r, i) {
        if (this.hash === r) return;
        this.hash = r;
        let s = this.url;
        queueMicrotask(() =>
          this._hashUpdate.next({
            type: "hashchange",
            state: null,
            oldUrl: i,
            newUrl: s,
          })
        );
      }
      replaceState(r, i, s) {
        let o = this.url,
          a = Nh(s);
        (this.pathname = a.pathname),
          (this.search = a.search),
          this.setHash(a.hash, o);
      }
      pushState(r, i, s) {
        this.replaceState(r, i, s);
      }
      forward() {
        throw new Error("Not implemented");
      }
      back() {
        throw new Error("Not implemented");
      }
      getState() {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)(se(Ve), se(Rl, 8));
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  zN = (() => {
    let e = class e extends zi {
      constructor(r) {
        super(r), (this.doc = r);
      }
      supports(r) {
        return !0;
      }
      addEventListener(r, i, s) {
        return yn().onAndCancel(r, i, s);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(se(Ve));
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  GN = [{ provide: Hb, useFactory: WN, deps: [Ve, Bi, gn], multi: !0 }];
function WN(t, e, n) {
  return () => {
    let r = n.toJson();
    if (n.isEmpty) return;
    let i = t.createElement("script");
    (i.id = e + "-state"),
      i.setAttribute("type", "application/json"),
      (i.textContent = r),
      t.body.appendChild(i);
  };
}
var KN = [
  { provide: Ve, useFactory: XN, deps: [sn] },
  { provide: Pt, useValue: Hf },
  { provide: zs, useFactory: QN, multi: !0 },
  { provide: Js, useClass: qN, deps: [Ve, [qs, Rl]] },
  { provide: jb, deps: [Ve] },
  { provide: Kc, useValue: !0 },
];
function QN() {
  return () => {
    Ah.makeCurrent();
  };
}
var YN = [{ provide: oo, multi: !0, useClass: zN }],
  ZN = [
    GN,
    YN,
    $N,
    { provide: Af, useValue: null },
    { provide: Gc, useValue: null },
    { provide: Uf, useClass: Xs },
  ];
function XN(t) {
  let e = t.get(Rl, null),
    n;
  return (
    e && e.document
      ? (n = typeof e.document == "string" ? Fb(e.document, e.url) : e.document)
      : (n = yn().createHtmlDocument()),
    Ac(n),
    n
  );
}
var JN = Qc(kf, "server", KN);
function R2() {
  return mn([mb(), ...ZN]);
}
function Bb(t) {
  let e = t.platformProviders ?? [];
  return JN([
    { provide: Rl, useValue: { document: t.document, url: t.url } },
    e,
  ]);
}
function eA(t) {
  let e = t.createComment(ff);
  t.body.firstChild
    ? t.body.insertBefore(e, t.body.firstChild)
    : t.body.append(e);
}
function tA(t) {
  let e = t.injector,
    n = rA(e.get(nA, Vb));
  t.components.forEach((r) => {
    let i = r.injector.get(Gs),
      s = r.location.nativeElement;
    s && i.setAttribute(s, "ng-server-context", n);
  });
}
function Ub(t, e) {
  return Rr(this, null, function* () {
    let n = e.injector;
    yield Zs(e);
    let r = t.injector.get(jb);
    if (e.injector.get(Si, !1)) {
      let o = r.getDocument();
      eA(o), aE(e, o);
    }
    let i = n.get(Hb, null);
    if (i) {
      let o = [];
      for (let a of i)
        try {
          let c = a();
          c && o.push(c);
        } catch (c) {
          console.warn("Ignoring BEFORE_APP_SERIALIZED Exception: ", c);
        }
      if (o.length)
        for (let a of yield Promise.allSettled(o))
          a.status === "rejected" &&
            console.warn(
              "Ignoring BEFORE_APP_SERIALIZED Exception: ",
              a.reason
            );
    }
    tA(e);
    let s = r.renderToString();
    return (
      yield new Promise((o) => {
        setTimeout(() => {
          t.destroy(), o();
        }, 0);
      }),
      s
    );
  });
}
var Vb = "other",
  nA = new ae("SERVER_CONTEXT");
function rA(t) {
  let e = t.replace(/[^a-zA-Z0-9\-]/g, "");
  return e.length > 0 ? e : Vb;
}
function O2(t, e) {
  return Rr(this, null, function* () {
    let { document: n, url: r, extraProviders: i } = e,
      s = Bb({ document: n, url: r, platformProviders: i }),
      a = (yield s.bootstrapModule(t)).injector.get(on);
    return Ub(s, a);
  });
}
function k2(t, e) {
  return Rr(this, null, function* () {
    let n = Bb(e),
      r = yield t();
    return Ub(n, r);
  });
}
var ve = "primary",
  Oo = Symbol("RouteTitle"),
  Wh = class {
    constructor(e) {
      this.params = e || {};
    }
    has(e) {
      return Object.prototype.hasOwnProperty.call(this.params, e);
    }
    get(e) {
      if (this.has(e)) {
        let n = this.params[e];
        return Array.isArray(n) ? n[0] : n;
      }
      return null;
    }
    getAll(e) {
      if (this.has(e)) {
        let n = this.params[e];
        return Array.isArray(n) ? n : [n];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function es(t) {
  return new Wh(t);
}
function iA(t, e, n) {
  let r = n.path.split("/");
  if (
    r.length > t.length ||
    (n.pathMatch === "full" && (e.hasChildren() || r.length < t.length))
  )
    return null;
  let i = {};
  for (let s = 0; s < r.length; s++) {
    let o = r[s],
      a = t[s];
    if (o.startsWith(":")) i[o.substring(1)] = a;
    else if (o !== a.path) return null;
  }
  return { consumed: t.slice(0, r.length), posParams: i };
}
function sA(t, e) {
  if (t.length !== e.length) return !1;
  for (let n = 0; n < t.length; ++n) if (!bn(t[n], e[n])) return !1;
  return !0;
}
function bn(t, e) {
  let n = t ? Kh(t) : void 0,
    r = e ? Kh(e) : void 0;
  if (!n || !r || n.length != r.length) return !1;
  let i;
  for (let s = 0; s < n.length; s++)
    if (((i = n[s]), !Kb(t[i], e[i]))) return !1;
  return !0;
}
function Kh(t) {
  return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function Kb(t, e) {
  if (Array.isArray(t) && Array.isArray(e)) {
    if (t.length !== e.length) return !1;
    let n = [...t].sort(),
      r = [...e].sort();
    return n.every((i, s) => r[s] === i);
  } else return t === e;
}
function Qb(t) {
  return t.length > 0 ? t[t.length - 1] : null;
}
function br(t) {
  return Mu(t) ? t : Qs(t) ? Ye(Promise.resolve(t)) : de(t);
}
var oA = { exact: Zb, subset: Xb },
  Yb = { exact: aA, subset: cA, ignored: () => !0 };
function $b(t, e, n) {
  return (
    oA[n.paths](t.root, e.root, n.matrixParams) &&
    Yb[n.queryParams](t.queryParams, e.queryParams) &&
    !(n.fragment === "exact" && t.fragment !== e.fragment)
  );
}
function aA(t, e) {
  return bn(t, e);
}
function Zb(t, e, n) {
  if (
    !si(t.segments, e.segments) ||
    !Ll(t.segments, e.segments, n) ||
    t.numberOfChildren !== e.numberOfChildren
  )
    return !1;
  for (let r in e.children)
    if (!t.children[r] || !Zb(t.children[r], e.children[r], n)) return !1;
  return !0;
}
function cA(t, e) {
  return (
    Object.keys(e).length <= Object.keys(t).length &&
    Object.keys(e).every((n) => Kb(t[n], e[n]))
  );
}
function Xb(t, e, n) {
  return Jb(t, e, e.segments, n);
}
function Jb(t, e, n, r) {
  if (t.segments.length > n.length) {
    let i = t.segments.slice(0, n.length);
    return !(!si(i, n) || e.hasChildren() || !Ll(i, n, r));
  } else if (t.segments.length === n.length) {
    if (!si(t.segments, n) || !Ll(t.segments, n, r)) return !1;
    for (let i in e.children)
      if (!t.children[i] || !Xb(t.children[i], e.children[i], r)) return !1;
    return !0;
  } else {
    let i = n.slice(0, t.segments.length),
      s = n.slice(t.segments.length);
    return !si(t.segments, i) || !Ll(t.segments, i, r) || !t.children[ve]
      ? !1
      : Jb(t.children[ve], e, s, r);
  }
}
function Ll(t, e, n) {
  return e.every((r, i) => Yb[n](t[i].parameters, r.parameters));
}
var vr = class {
    constructor(e = new Fe([], {}), n = {}, r = null) {
      (this.root = e), (this.queryParams = n), (this.fragment = r);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= es(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return dA.serialize(this);
    }
  },
  Fe = class {
    constructor(e, n) {
      (this.segments = e),
        (this.children = n),
        (this.parent = null),
        Object.values(n).forEach((r) => (r.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return Pl(this);
    }
  },
  ii = class {
    constructor(e, n) {
      (this.path = e), (this.parameters = n);
    }
    get parameterMap() {
      return (this._parameterMap ??= es(this.parameters)), this._parameterMap;
    }
    toString() {
      return t0(this);
    }
  };
function lA(t, e) {
  return si(t, e) && t.every((n, r) => bn(n.parameters, e[r].parameters));
}
function si(t, e) {
  return t.length !== e.length ? !1 : t.every((n, r) => n.path === e[r].path);
}
function uA(t, e) {
  let n = [];
  return (
    Object.entries(t.children).forEach(([r, i]) => {
      r === ve && (n = n.concat(e(i, r)));
    }),
    Object.entries(t.children).forEach(([r, i]) => {
      r !== ve && (n = n.concat(e(i, r)));
    }),
    n
  );
}
var bp = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = te({ token: e, factory: () => new jl(), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  jl = class {
    parse(e) {
      let n = new Yh(e);
      return new vr(
        n.parseRootSegment(),
        n.parseQueryParams(),
        n.parseFragment()
      );
    }
    serialize(e) {
      let n = `/${Eo(e.root, !0)}`,
        r = pA(e.queryParams),
        i = typeof e.fragment == "string" ? `#${fA(e.fragment)}` : "";
      return `${n}${r}${i}`;
    }
  },
  dA = new jl();
function Pl(t) {
  return t.segments.map((e) => t0(e)).join("/");
}
function Eo(t, e) {
  if (!t.hasChildren()) return Pl(t);
  if (e) {
    let n = t.children[ve] ? Eo(t.children[ve], !1) : "",
      r = [];
    return (
      Object.entries(t.children).forEach(([i, s]) => {
        i !== ve && r.push(`${i}:${Eo(s, !1)}`);
      }),
      r.length > 0 ? `${n}(${r.join("//")})` : n
    );
  } else {
    let n = uA(t, (r, i) =>
      i === ve ? [Eo(t.children[ve], !1)] : [`${i}:${Eo(r, !1)}`]
    );
    return Object.keys(t.children).length === 1 && t.children[ve] != null
      ? `${Pl(t)}/${n[0]}`
      : `${Pl(t)}/(${n.join("//")})`;
  }
}
function e0(t) {
  return encodeURIComponent(t)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function Ol(t) {
  return e0(t).replace(/%3B/gi, ";");
}
function fA(t) {
  return encodeURI(t);
}
function Qh(t) {
  return e0(t)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function Fl(t) {
  return decodeURIComponent(t);
}
function qb(t) {
  return Fl(t.replace(/\+/g, "%20"));
}
function t0(t) {
  return `${Qh(t.path)}${hA(t.parameters)}`;
}
function hA(t) {
  return Object.entries(t)
    .map(([e, n]) => `;${Qh(e)}=${Qh(n)}`)
    .join("");
}
function pA(t) {
  let e = Object.entries(t)
    .map(([n, r]) =>
      Array.isArray(r)
        ? r.map((i) => `${Ol(n)}=${Ol(i)}`).join("&")
        : `${Ol(n)}=${Ol(r)}`
    )
    .filter((n) => n);
  return e.length ? `?${e.join("&")}` : "";
}
var mA = /^[^\/()?;#]+/;
function $h(t) {
  let e = t.match(mA);
  return e ? e[0] : "";
}
var gA = /^[^\/()?;=#]+/;
function yA(t) {
  let e = t.match(gA);
  return e ? e[0] : "";
}
var vA = /^[^=?&#]+/;
function EA(t) {
  let e = t.match(vA);
  return e ? e[0] : "";
}
var bA = /^[^&#]+/;
function wA(t) {
  let e = t.match(bA);
  return e ? e[0] : "";
}
var Yh = class {
  constructor(e) {
    (this.url = e), (this.remaining = e);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new Fe([], {})
        : new Fe([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let e = {};
    if (this.consumeOptional("?"))
      do this.parseQueryParam(e);
      while (this.consumeOptional("&"));
    return e;
  }
  parseFragment() {
    return this.consumeOptional("#")
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === "") return {};
    this.consumeOptional("/");
    let e = [];
    for (
      this.peekStartsWith("(") || e.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");

    )
      this.capture("/"), e.push(this.parseSegment());
    let n = {};
    this.peekStartsWith("/(") &&
      (this.capture("/"), (n = this.parseParens(!0)));
    let r = {};
    return (
      this.peekStartsWith("(") && (r = this.parseParens(!1)),
      (e.length > 0 || Object.keys(n).length > 0) && (r[ve] = new Fe(e, n)),
      r
    );
  }
  parseSegment() {
    let e = $h(this.remaining);
    if (e === "" && this.peekStartsWith(";")) throw new z(4009, !1);
    return this.capture(e), new ii(Fl(e), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let e = {};
    for (; this.consumeOptional(";"); ) this.parseParam(e);
    return e;
  }
  parseParam(e) {
    let n = yA(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let i = $h(this.remaining);
      i && ((r = i), this.capture(r));
    }
    e[Fl(n)] = Fl(r);
  }
  parseQueryParam(e) {
    let n = EA(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let o = wA(this.remaining);
      o && ((r = o), this.capture(r));
    }
    let i = qb(n),
      s = qb(r);
    if (e.hasOwnProperty(i)) {
      let o = e[i];
      Array.isArray(o) || ((o = [o]), (e[i] = o)), o.push(s);
    } else e[i] = s;
  }
  parseParens(e) {
    let n = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let r = $h(this.remaining),
        i = this.remaining[r.length];
      if (i !== "/" && i !== ")" && i !== ";") throw new z(4010, !1);
      let s;
      r.indexOf(":") > -1
        ? ((s = r.slice(0, r.indexOf(":"))), this.capture(s), this.capture(":"))
        : e && (s = ve);
      let o = this.parseChildren();
      (n[s] = Object.keys(o).length === 1 ? o[ve] : new Fe([], o)),
        this.consumeOptional("//");
    }
    return n;
  }
  peekStartsWith(e) {
    return this.remaining.startsWith(e);
  }
  consumeOptional(e) {
    return this.peekStartsWith(e)
      ? ((this.remaining = this.remaining.substring(e.length)), !0)
      : !1;
  }
  capture(e) {
    if (!this.consumeOptional(e)) throw new z(4011, !1);
  }
};
function n0(t) {
  return t.segments.length > 0 ? new Fe([], { [ve]: t }) : t;
}
function r0(t) {
  let e = {};
  for (let [r, i] of Object.entries(t.children)) {
    let s = r0(i);
    if (r === ve && s.segments.length === 0 && s.hasChildren())
      for (let [o, a] of Object.entries(s.children)) e[o] = a;
    else (s.segments.length > 0 || s.hasChildren()) && (e[r] = s);
  }
  let n = new Fe(t.segments, e);
  return DA(n);
}
function DA(t) {
  if (t.numberOfChildren === 1 && t.children[ve]) {
    let e = t.children[ve];
    return new Fe(t.segments.concat(e.segments), e.children);
  }
  return t;
}
function ts(t) {
  return t instanceof vr;
}
function _A(t, e, n = null, r = null) {
  let i = i0(t);
  return s0(i, e, n, r);
}
function i0(t) {
  let e;
  function n(s) {
    let o = {};
    for (let c of s.children) {
      let l = n(c);
      o[c.outlet] = l;
    }
    let a = new Fe(s.url, o);
    return s === t && (e = a), a;
  }
  let r = n(t.root),
    i = n0(r);
  return e ?? i;
}
function s0(t, e, n, r) {
  let i = t;
  for (; i.parent; ) i = i.parent;
  if (e.length === 0) return qh(i, i, i, n, r);
  let s = TA(e);
  if (s.toRoot()) return qh(i, i, new Fe([], {}), n, r);
  let o = SA(s, i, t),
    a = o.processChildren
      ? Do(o.segmentGroup, o.index, s.commands)
      : a0(o.segmentGroup, o.index, s.commands);
  return qh(i, o.segmentGroup, a, n, r);
}
function Hl(t) {
  return typeof t == "object" && t != null && !t.outlets && !t.segmentPath;
}
function So(t) {
  return typeof t == "object" && t != null && t.outlets;
}
function qh(t, e, n, r, i) {
  let s = {};
  r &&
    Object.entries(r).forEach(([c, l]) => {
      s[c] = Array.isArray(l) ? l.map((u) => `${u}`) : `${l}`;
    });
  let o;
  t === e ? (o = n) : (o = o0(t, e, n));
  let a = n0(r0(o));
  return new vr(a, s, i);
}
function o0(t, e, n) {
  let r = {};
  return (
    Object.entries(t.children).forEach(([i, s]) => {
      s === e ? (r[i] = n) : (r[i] = o0(s, e, n));
    }),
    new Fe(t.segments, r)
  );
}
var Bl = class {
  constructor(e, n, r) {
    if (
      ((this.isAbsolute = e),
      (this.numberOfDoubleDots = n),
      (this.commands = r),
      e && r.length > 0 && Hl(r[0]))
    )
      throw new z(4003, !1);
    let i = r.find(So);
    if (i && i !== Qb(r)) throw new z(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function TA(t) {
  if (typeof t[0] == "string" && t.length === 1 && t[0] === "/")
    return new Bl(!0, 0, t);
  let e = 0,
    n = !1,
    r = t.reduce((i, s, o) => {
      if (typeof s == "object" && s != null) {
        if (s.outlets) {
          let a = {};
          return (
            Object.entries(s.outlets).forEach(([c, l]) => {
              a[c] = typeof l == "string" ? l.split("/") : l;
            }),
            [...i, { outlets: a }]
          );
        }
        if (s.segmentPath) return [...i, s.segmentPath];
      }
      return typeof s != "string"
        ? [...i, s]
        : o === 0
        ? (s.split("/").forEach((a, c) => {
            (c == 0 && a === ".") ||
              (c == 0 && a === ""
                ? (n = !0)
                : a === ".."
                ? e++
                : a != "" && i.push(a));
          }),
          i)
        : [...i, s];
    }, []);
  return new Bl(n, e, r);
}
var Xi = class {
  constructor(e, n, r) {
    (this.segmentGroup = e), (this.processChildren = n), (this.index = r);
  }
};
function SA(t, e, n) {
  if (t.isAbsolute) return new Xi(e, !0, 0);
  if (!n) return new Xi(e, !1, NaN);
  if (n.parent === null) return new Xi(n, !0, 0);
  let r = Hl(t.commands[0]) ? 0 : 1,
    i = n.segments.length - 1 + r;
  return CA(n, i, t.numberOfDoubleDots);
}
function CA(t, e, n) {
  let r = t,
    i = e,
    s = n;
  for (; s > i; ) {
    if (((s -= i), (r = r.parent), !r)) throw new z(4005, !1);
    i = r.segments.length;
  }
  return new Xi(r, !1, i - s);
}
function IA(t) {
  return So(t[0]) ? t[0].outlets : { [ve]: t };
}
function a0(t, e, n) {
  if (((t ??= new Fe([], {})), t.segments.length === 0 && t.hasChildren()))
    return Do(t, e, n);
  let r = MA(t, e, n),
    i = n.slice(r.commandIndex);
  if (r.match && r.pathIndex < t.segments.length) {
    let s = new Fe(t.segments.slice(0, r.pathIndex), {});
    return (
      (s.children[ve] = new Fe(t.segments.slice(r.pathIndex), t.children)),
      Do(s, 0, i)
    );
  } else
    return r.match && i.length === 0
      ? new Fe(t.segments, {})
      : r.match && !t.hasChildren()
      ? Zh(t, e, n)
      : r.match
      ? Do(t, 0, i)
      : Zh(t, e, n);
}
function Do(t, e, n) {
  if (n.length === 0) return new Fe(t.segments, {});
  {
    let r = IA(n),
      i = {};
    if (
      Object.keys(r).some((s) => s !== ve) &&
      t.children[ve] &&
      t.numberOfChildren === 1 &&
      t.children[ve].segments.length === 0
    ) {
      let s = Do(t.children[ve], e, n);
      return new Fe(t.segments, s.children);
    }
    return (
      Object.entries(r).forEach(([s, o]) => {
        typeof o == "string" && (o = [o]),
          o !== null && (i[s] = a0(t.children[s], e, o));
      }),
      Object.entries(t.children).forEach(([s, o]) => {
        r[s] === void 0 && (i[s] = o);
      }),
      new Fe(t.segments, i)
    );
  }
}
function MA(t, e, n) {
  let r = 0,
    i = e,
    s = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; i < t.segments.length; ) {
    if (r >= n.length) return s;
    let o = t.segments[i],
      a = n[r];
    if (So(a)) break;
    let c = `${a}`,
      l = r < n.length - 1 ? n[r + 1] : null;
    if (i > 0 && c === void 0) break;
    if (c && l && typeof l == "object" && l.outlets === void 0) {
      if (!Gb(c, l, o)) return s;
      r += 2;
    } else {
      if (!Gb(c, {}, o)) return s;
      r++;
    }
    i++;
  }
  return { match: !0, pathIndex: i, commandIndex: r };
}
function Zh(t, e, n) {
  let r = t.segments.slice(0, e),
    i = 0;
  for (; i < n.length; ) {
    let s = n[i];
    if (So(s)) {
      let c = NA(s.outlets);
      return new Fe(r, c);
    }
    if (i === 0 && Hl(n[0])) {
      let c = t.segments[e];
      r.push(new ii(c.path, zb(n[0]))), i++;
      continue;
    }
    let o = So(s) ? s.outlets[ve] : `${s}`,
      a = i < n.length - 1 ? n[i + 1] : null;
    o && a && Hl(a)
      ? (r.push(new ii(o, zb(a))), (i += 2))
      : (r.push(new ii(o, {})), i++);
  }
  return new Fe(r, {});
}
function NA(t) {
  let e = {};
  return (
    Object.entries(t).forEach(([n, r]) => {
      typeof r == "string" && (r = [r]),
        r !== null && (e[n] = Zh(new Fe([], {}), 0, r));
    }),
    e
  );
}
function zb(t) {
  let e = {};
  return Object.entries(t).forEach(([n, r]) => (e[n] = `${r}`)), e;
}
function Gb(t, e, n) {
  return t == n.path && bn(e, n.parameters);
}
var _o = "imperative",
  ut = (function (t) {
    return (
      (t[(t.NavigationStart = 0)] = "NavigationStart"),
      (t[(t.NavigationEnd = 1)] = "NavigationEnd"),
      (t[(t.NavigationCancel = 2)] = "NavigationCancel"),
      (t[(t.NavigationError = 3)] = "NavigationError"),
      (t[(t.RoutesRecognized = 4)] = "RoutesRecognized"),
      (t[(t.ResolveStart = 5)] = "ResolveStart"),
      (t[(t.ResolveEnd = 6)] = "ResolveEnd"),
      (t[(t.GuardsCheckStart = 7)] = "GuardsCheckStart"),
      (t[(t.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
      (t[(t.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
      (t[(t.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
      (t[(t.ChildActivationStart = 11)] = "ChildActivationStart"),
      (t[(t.ChildActivationEnd = 12)] = "ChildActivationEnd"),
      (t[(t.ActivationStart = 13)] = "ActivationStart"),
      (t[(t.ActivationEnd = 14)] = "ActivationEnd"),
      (t[(t.Scroll = 15)] = "Scroll"),
      (t[(t.NavigationSkipped = 16)] = "NavigationSkipped"),
      t
    );
  })(ut || {}),
  Kt = class {
    constructor(e, n) {
      (this.id = e), (this.url = n);
    }
  },
  Co = class extends Kt {
    constructor(e, n, r = "imperative", i = null) {
      super(e, n),
        (this.type = ut.NavigationStart),
        (this.navigationTrigger = r),
        (this.restoredState = i);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  oi = class extends Kt {
    constructor(e, n, r) {
      super(e, n), (this.urlAfterRedirects = r), (this.type = ut.NavigationEnd);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  Wt = (function (t) {
    return (
      (t[(t.Redirect = 0)] = "Redirect"),
      (t[(t.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (t[(t.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (t[(t.GuardRejected = 3)] = "GuardRejected"),
      t
    );
  })(Wt || {}),
  Xh = (function (t) {
    return (
      (t[(t.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (t[(t.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      t
    );
  })(Xh || {}),
  Er = class extends Kt {
    constructor(e, n, r, i) {
      super(e, n),
        (this.reason = r),
        (this.code = i),
        (this.type = ut.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  ai = class extends Kt {
    constructor(e, n, r, i) {
      super(e, n),
        (this.reason = r),
        (this.code = i),
        (this.type = ut.NavigationSkipped);
    }
  },
  Io = class extends Kt {
    constructor(e, n, r, i) {
      super(e, n),
        (this.error = r),
        (this.target = i),
        (this.type = ut.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  Ul = class extends Kt {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = ut.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Jh = class extends Kt {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = ut.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  ep = class extends Kt {
    constructor(e, n, r, i, s) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.shouldActivate = s),
        (this.type = ut.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  tp = class extends Kt {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = ut.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  np = class extends Kt {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = ut.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  rp = class {
    constructor(e) {
      (this.route = e), (this.type = ut.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  ip = class {
    constructor(e) {
      (this.route = e), (this.type = ut.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  sp = class {
    constructor(e) {
      (this.snapshot = e), (this.type = ut.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  op = class {
    constructor(e) {
      (this.snapshot = e), (this.type = ut.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  ap = class {
    constructor(e) {
      (this.snapshot = e), (this.type = ut.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  cp = class {
    constructor(e) {
      (this.snapshot = e), (this.type = ut.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  };
var Mo = class {},
  No = class {
    constructor(e) {
      this.url = e;
    }
  };
var lp = class {
    constructor() {
      (this.outlet = null),
        (this.route = null),
        (this.injector = null),
        (this.children = new Wl()),
        (this.attachRef = null);
    }
  },
  Wl = (() => {
    let e = class e {
      constructor() {
        this.contexts = new Map();
      }
      onChildOutletCreated(r, i) {
        let s = this.getOrCreateContext(r);
        (s.outlet = i), this.contexts.set(r, s);
      }
      onChildOutletDestroyed(r) {
        let i = this.getContext(r);
        i && ((i.outlet = null), (i.attachRef = null));
      }
      onOutletDeactivated() {
        let r = this.contexts;
        return (this.contexts = new Map()), r;
      }
      onOutletReAttached(r) {
        this.contexts = r;
      }
      getOrCreateContext(r) {
        let i = this.getContext(r);
        return i || ((i = new lp()), this.contexts.set(r, i)), i;
      }
      getContext(r) {
        return this.contexts.get(r) || null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Vl = class {
    constructor(e) {
      this._root = e;
    }
    get root() {
      return this._root.value;
    }
    parent(e) {
      let n = this.pathFromRoot(e);
      return n.length > 1 ? n[n.length - 2] : null;
    }
    children(e) {
      let n = up(e, this._root);
      return n ? n.children.map((r) => r.value) : [];
    }
    firstChild(e) {
      let n = up(e, this._root);
      return n && n.children.length > 0 ? n.children[0].value : null;
    }
    siblings(e) {
      let n = dp(e, this._root);
      return n.length < 2
        ? []
        : n[n.length - 2].children.map((i) => i.value).filter((i) => i !== e);
    }
    pathFromRoot(e) {
      return dp(e, this._root).map((n) => n.value);
    }
  };
function up(t, e) {
  if (t === e.value) return e;
  for (let n of e.children) {
    let r = up(t, n);
    if (r) return r;
  }
  return null;
}
function dp(t, e) {
  if (t === e.value) return [e];
  for (let n of e.children) {
    let r = dp(t, n);
    if (r.length) return r.unshift(e), r;
  }
  return [];
}
var Ht = class {
  constructor(e, n) {
    (this.value = e), (this.children = n);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function Zi(t) {
  let e = {};
  return t && t.children.forEach((n) => (e[n.value.outlet] = n)), e;
}
var $l = class extends Vl {
  constructor(e, n) {
    super(e), (this.snapshot = n), Dp(this, e);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function c0(t) {
  let e = AA(t),
    n = new lt([new ii("", {})]),
    r = new lt({}),
    i = new lt({}),
    s = new lt({}),
    o = new lt(""),
    a = new ns(n, r, s, o, i, ve, t, e.root);
  return (a.snapshot = e.root), new $l(new Ht(a, []), e);
}
function AA(t) {
  let e = {},
    n = {},
    r = {},
    i = "",
    s = new Ao([], e, r, i, n, ve, t, null, {});
  return new ql("", new Ht(s, []));
}
var ns = class {
  constructor(e, n, r, i, s, o, a, c) {
    (this.urlSubject = e),
      (this.paramsSubject = n),
      (this.queryParamsSubject = r),
      (this.fragmentSubject = i),
      (this.dataSubject = s),
      (this.outlet = o),
      (this.component = a),
      (this._futureSnapshot = c),
      (this.title = this.dataSubject?.pipe(Ee((l) => l[Oo])) ?? de(void 0)),
      (this.url = e),
      (this.params = n),
      (this.queryParams = r),
      (this.fragment = i),
      (this.data = s);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      (this._paramMap ??= this.params.pipe(Ee((e) => es(e)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(Ee((e) => es(e)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function wp(t, e, n = "emptyOnly") {
  let r,
    { routeConfig: i } = t;
  return (
    e !== null &&
    (n === "always" ||
      i?.path === "" ||
      (!e.component && !e.routeConfig?.loadComponent))
      ? (r = {
          params: J(J({}, e.params), t.params),
          data: J(J({}, e.data), t.data),
          resolve: J(J(J(J({}, t.data), e.data), i?.data), t._resolvedData),
        })
      : (r = {
          params: J({}, t.params),
          data: J({}, t.data),
          resolve: J(J({}, t.data), t._resolvedData ?? {}),
        }),
    i && u0(i) && (r.resolve[Oo] = i.title),
    r
  );
}
var Ao = class {
    get title() {
      return this.data?.[Oo];
    }
    constructor(e, n, r, i, s, o, a, c, l) {
      (this.url = e),
        (this.params = n),
        (this.queryParams = r),
        (this.fragment = i),
        (this.data = s),
        (this.outlet = o),
        (this.component = a),
        (this.routeConfig = c),
        (this._resolve = l);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (this._paramMap ??= es(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= es(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let e = this.url.map((r) => r.toString()).join("/"),
        n = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${e}', path:'${n}')`;
    }
  },
  ql = class extends Vl {
    constructor(e, n) {
      super(n), (this.url = e), Dp(this, n);
    }
    toString() {
      return l0(this._root);
    }
  };
function Dp(t, e) {
  (e.value._routerState = t), e.children.forEach((n) => Dp(t, n));
}
function l0(t) {
  let e = t.children.length > 0 ? ` { ${t.children.map(l0).join(", ")} } ` : "";
  return `${t.value}${e}`;
}
function zh(t) {
  if (t.snapshot) {
    let e = t.snapshot,
      n = t._futureSnapshot;
    (t.snapshot = n),
      bn(e.queryParams, n.queryParams) ||
        t.queryParamsSubject.next(n.queryParams),
      e.fragment !== n.fragment && t.fragmentSubject.next(n.fragment),
      bn(e.params, n.params) || t.paramsSubject.next(n.params),
      sA(e.url, n.url) || t.urlSubject.next(n.url),
      bn(e.data, n.data) || t.dataSubject.next(n.data);
  } else
    (t.snapshot = t._futureSnapshot),
      t.dataSubject.next(t._futureSnapshot.data);
}
function fp(t, e) {
  let n = bn(t.params, e.params) && lA(t.url, e.url),
    r = !t.parent != !e.parent;
  return n && !r && (!t.parent || fp(t.parent, e.parent));
}
function u0(t) {
  return typeof t.title == "string" || t.title === null;
}
var xA = (() => {
    let e = class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = ve),
          (this.activateEvents = new yt()),
          (this.deactivateEvents = new yt()),
          (this.attachEvents = new yt()),
          (this.detachEvents = new yt()),
          (this.parentContexts = G(Wl)),
          (this.location = G(Yr)),
          (this.changeDetector = G(Vc)),
          (this.environmentInjector = G(Tt)),
          (this.inputBinder = G(_p, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(r) {
        if (r.name) {
          let { firstChange: i, previousValue: s } = r.name;
          if (i) return;
          this.isTrackedInParentContexts(s) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(s)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(r) {
        return this.parentContexts.getContext(r)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let r = this.parentContexts.getContext(this.name);
        r?.route &&
          (r.attachRef
            ? this.attach(r.attachRef, r.route)
            : this.activateWith(r.route, r.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new z(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new z(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new z(4012, !1);
        this.location.detach();
        let r = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(r.instance),
          r
        );
      }
      attach(r, i) {
        (this.activated = r),
          (this._activatedRoute = i),
          this.location.insert(r.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(r.instance);
      }
      deactivate() {
        if (this.activated) {
          let r = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(r);
        }
      }
      activateWith(r, i) {
        if (this.isActivated) throw new z(4013, !1);
        this._activatedRoute = r;
        let s = this.location,
          a = r.snapshot.component,
          c = this.parentContexts.getOrCreateContext(this.name).children,
          l = new hp(r, c, s.injector);
        (this.activated = s.createComponent(a, {
          index: s.length,
          injector: l,
          environmentInjector: i ?? this.environmentInjector,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = Wr({
        type: e,
        selectors: [["router-outlet"]],
        inputs: { name: "name" },
        outputs: {
          activateEvents: "activate",
          deactivateEvents: "deactivate",
          attachEvents: "attach",
          detachEvents: "detach",
        },
        exportAs: ["outlet"],
        standalone: !0,
        features: [Cc],
      }));
    let t = e;
    return t;
  })(),
  hp = class {
    constructor(e, n, r) {
      (this.route = e), (this.childContexts = n), (this.parent = r);
    }
    get(e, n) {
      return e === ns
        ? this.route
        : e === Wl
        ? this.childContexts
        : this.parent.get(e, n);
    }
  },
  _p = new ae("");
function RA(t, e, n) {
  let r = xo(t, e._root, n ? n._root : void 0);
  return new $l(r, e);
}
function xo(t, e, n) {
  if (n && t.shouldReuseRoute(e.value, n.value.snapshot)) {
    let r = n.value;
    r._futureSnapshot = e.value;
    let i = OA(t, e, n);
    return new Ht(r, i);
  } else {
    if (t.shouldAttach(e.value)) {
      let s = t.retrieve(e.value);
      if (s !== null) {
        let o = s.route;
        return (
          (o.value._futureSnapshot = e.value),
          (o.children = e.children.map((a) => xo(t, a))),
          o
        );
      }
    }
    let r = kA(e.value),
      i = e.children.map((s) => xo(t, s));
    return new Ht(r, i);
  }
}
function OA(t, e, n) {
  return e.children.map((r) => {
    for (let i of n.children)
      if (t.shouldReuseRoute(r.value, i.value.snapshot)) return xo(t, r, i);
    return xo(t, r);
  });
}
function kA(t) {
  return new ns(
    new lt(t.url),
    new lt(t.params),
    new lt(t.queryParams),
    new lt(t.fragment),
    new lt(t.data),
    t.outlet,
    t.component,
    t
  );
}
var d0 = "ngNavigationCancelingError";
function f0(t, e) {
  let { redirectTo: n, navigationBehaviorOptions: r } = ts(e)
      ? { redirectTo: e, navigationBehaviorOptions: void 0 }
      : e,
    i = h0(!1, Wt.Redirect);
  return (i.url = n), (i.navigationBehaviorOptions = r), i;
}
function h0(t, e) {
  let n = new Error(`NavigationCancelingError: ${t || ""}`);
  return (n[d0] = !0), (n.cancellationCode = e), n;
}
function LA(t) {
  return p0(t) && ts(t.url);
}
function p0(t) {
  return !!t && t[d0];
}
var PA = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = kg({
      type: e,
      selectors: [["ng-component"]],
      standalone: !0,
      features: [$v],
      decls: 1,
      vars: 0,
      template: function (i, s) {
        i & 1 && Mf(0, "router-outlet");
      },
      dependencies: [xA],
      encapsulation: 2,
    }));
  let t = e;
  return t;
})();
function FA(t, e) {
  return (
    t.providers &&
      !t._injector &&
      (t._injector = Cf(t.providers, e, `Route: ${t.path}`)),
    t._injector ?? e
  );
}
function Tp(t) {
  let e = t.children && t.children.map(Tp),
    n = e ? Je(J({}, t), { children: e }) : J({}, t);
  return (
    !n.component &&
      !n.loadComponent &&
      (e || n.loadChildren) &&
      n.outlet &&
      n.outlet !== ve &&
      (n.component = PA),
    n
  );
}
function wn(t) {
  return t.outlet || ve;
}
function jA(t, e) {
  let n = t.filter((r) => wn(r) === e);
  return n.push(...t.filter((r) => wn(r) !== e)), n;
}
function ko(t) {
  if (!t) return null;
  if (t.routeConfig?._injector) return t.routeConfig._injector;
  for (let e = t.parent; e; e = e.parent) {
    let n = e.routeConfig;
    if (n?._loadedInjector) return n._loadedInjector;
    if (n?._injector) return n._injector;
  }
  return null;
}
var HA = (t, e, n, r) =>
    Ee(
      (i) => (
        new pp(e, i.targetRouterState, i.currentRouterState, n, r).activate(t),
        i
      )
    ),
  pp = class {
    constructor(e, n, r, i, s) {
      (this.routeReuseStrategy = e),
        (this.futureState = n),
        (this.currState = r),
        (this.forwardEvent = i),
        (this.inputBindingEnabled = s);
    }
    activate(e) {
      let n = this.futureState._root,
        r = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(n, r, e),
        zh(this.futureState.root),
        this.activateChildRoutes(n, r, e);
    }
    deactivateChildRoutes(e, n, r) {
      let i = Zi(n);
      e.children.forEach((s) => {
        let o = s.value.outlet;
        this.deactivateRoutes(s, i[o], r), delete i[o];
      }),
        Object.values(i).forEach((s) => {
          this.deactivateRouteAndItsChildren(s, r);
        });
    }
    deactivateRoutes(e, n, r) {
      let i = e.value,
        s = n ? n.value : null;
      if (i === s)
        if (i.component) {
          let o = r.getContext(i.outlet);
          o && this.deactivateChildRoutes(e, n, o.children);
        } else this.deactivateChildRoutes(e, n, r);
      else s && this.deactivateRouteAndItsChildren(n, r);
    }
    deactivateRouteAndItsChildren(e, n) {
      e.value.component &&
      this.routeReuseStrategy.shouldDetach(e.value.snapshot)
        ? this.detachAndStoreRouteSubtree(e, n)
        : this.deactivateRouteAndOutlet(e, n);
    }
    detachAndStoreRouteSubtree(e, n) {
      let r = n.getContext(e.value.outlet),
        i = r && e.value.component ? r.children : n,
        s = Zi(e);
      for (let o of Object.values(s)) this.deactivateRouteAndItsChildren(o, i);
      if (r && r.outlet) {
        let o = r.outlet.detach(),
          a = r.children.onOutletDeactivated();
        this.routeReuseStrategy.store(e.value.snapshot, {
          componentRef: o,
          route: e,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(e, n) {
      let r = n.getContext(e.value.outlet),
        i = r && e.value.component ? r.children : n,
        s = Zi(e);
      for (let o of Object.values(s)) this.deactivateRouteAndItsChildren(o, i);
      r &&
        (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
        (r.attachRef = null),
        (r.route = null));
    }
    activateChildRoutes(e, n, r) {
      let i = Zi(n);
      e.children.forEach((s) => {
        this.activateRoutes(s, i[s.value.outlet], r),
          this.forwardEvent(new cp(s.value.snapshot));
      }),
        e.children.length && this.forwardEvent(new op(e.value.snapshot));
    }
    activateRoutes(e, n, r) {
      let i = e.value,
        s = n ? n.value : null;
      if ((zh(i), i === s))
        if (i.component) {
          let o = r.getOrCreateContext(i.outlet);
          this.activateChildRoutes(e, n, o.children);
        } else this.activateChildRoutes(e, n, r);
      else if (i.component) {
        let o = r.getOrCreateContext(i.outlet);
        if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(i.snapshot);
          this.routeReuseStrategy.store(i.snapshot, null),
            o.children.onOutletReAttached(a.contexts),
            (o.attachRef = a.componentRef),
            (o.route = a.route.value),
            o.outlet && o.outlet.attach(a.componentRef, a.route.value),
            zh(a.route.value),
            this.activateChildRoutes(e, null, o.children);
        } else {
          let a = ko(i.snapshot);
          (o.attachRef = null),
            (o.route = i),
            (o.injector = a),
            o.outlet && o.outlet.activateWith(i, o.injector),
            this.activateChildRoutes(e, null, o.children);
        }
      } else this.activateChildRoutes(e, null, r);
    }
  },
  zl = class {
    constructor(e) {
      (this.path = e), (this.route = this.path[this.path.length - 1]);
    }
  },
  Ji = class {
    constructor(e, n) {
      (this.component = e), (this.route = n);
    }
  };
function BA(t, e, n) {
  let r = t._root,
    i = e ? e._root : null;
  return bo(r, i, n, [r.value]);
}
function UA(t) {
  let e = t.routeConfig ? t.routeConfig.canActivateChild : null;
  return !e || e.length === 0 ? null : { node: t, guards: e };
}
function is(t, e) {
  let n = Symbol(),
    r = e.get(t, n);
  return r === n ? (typeof t == "function" && !Sg(t) ? t : e.get(t)) : r;
}
function bo(
  t,
  e,
  n,
  r,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let s = Zi(e);
  return (
    t.children.forEach((o) => {
      VA(o, s[o.value.outlet], n, r.concat([o.value]), i),
        delete s[o.value.outlet];
    }),
    Object.entries(s).forEach(([o, a]) => To(a, n.getContext(o), i)),
    i
  );
}
function VA(
  t,
  e,
  n,
  r,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let s = t.value,
    o = e ? e.value : null,
    a = n ? n.getContext(t.value.outlet) : null;
  if (o && s.routeConfig === o.routeConfig) {
    let c = $A(o, s, s.routeConfig.runGuardsAndResolvers);
    c
      ? i.canActivateChecks.push(new zl(r))
      : ((s.data = o.data), (s._resolvedData = o._resolvedData)),
      s.component ? bo(t, e, a ? a.children : null, r, i) : bo(t, e, n, r, i),
      c &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        i.canDeactivateChecks.push(new Ji(a.outlet.component, o));
  } else
    o && To(e, a, i),
      i.canActivateChecks.push(new zl(r)),
      s.component
        ? bo(t, null, a ? a.children : null, r, i)
        : bo(t, null, n, r, i);
  return i;
}
function $A(t, e, n) {
  if (typeof n == "function") return n(t, e);
  switch (n) {
    case "pathParamsChange":
      return !si(t.url, e.url);
    case "pathParamsOrQueryParamsChange":
      return !si(t.url, e.url) || !bn(t.queryParams, e.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !fp(t, e) || !bn(t.queryParams, e.queryParams);
    case "paramsChange":
    default:
      return !fp(t, e);
  }
}
function To(t, e, n) {
  let r = Zi(t),
    i = t.value;
  Object.entries(r).forEach(([s, o]) => {
    i.component
      ? e
        ? To(o, e.children.getContext(s), n)
        : To(o, null, n)
      : To(o, e, n);
  }),
    i.component
      ? e && e.outlet && e.outlet.isActivated
        ? n.canDeactivateChecks.push(new Ji(e.outlet.component, i))
        : n.canDeactivateChecks.push(new Ji(null, i))
      : n.canDeactivateChecks.push(new Ji(null, i));
}
function Lo(t) {
  return typeof t == "function";
}
function qA(t) {
  return typeof t == "boolean";
}
function zA(t) {
  return t && Lo(t.canLoad);
}
function GA(t) {
  return t && Lo(t.canActivate);
}
function WA(t) {
  return t && Lo(t.canActivateChild);
}
function KA(t) {
  return t && Lo(t.canDeactivate);
}
function QA(t) {
  return t && Lo(t.canMatch);
}
function m0(t) {
  return t instanceof An || t?.name === "EmptyError";
}
var kl = Symbol("INITIAL_VALUE");
function rs() {
  return At((t) =>
    xa(t.map((e) => e.pipe(Rn(1), Ou(kl)))).pipe(
      Ee((e) => {
        for (let n of e)
          if (n !== !0) {
            if (n === kl) return kl;
            if (n === !1 || n instanceof vr) return n;
          }
        return !0;
      }),
      Nt((e) => e !== kl),
      Rn(1)
    )
  );
}
function YA(t, e) {
  return it((n) => {
    let {
      targetSnapshot: r,
      currentSnapshot: i,
      guards: { canActivateChecks: s, canDeactivateChecks: o },
    } = n;
    return o.length === 0 && s.length === 0
      ? de(Je(J({}, n), { guardsResult: !0 }))
      : ZA(o, r, i, t).pipe(
          it((a) => (a && qA(a) ? XA(r, s, t, e) : de(a))),
          Ee((a) => Je(J({}, n), { guardsResult: a }))
        );
  });
}
function ZA(t, e, n, r) {
  return Ye(t).pipe(
    it((i) => rx(i.component, i.route, n, e, r)),
    Xt((i) => i !== !0, !0)
  );
}
function XA(t, e, n, r) {
  return Ye(e).pipe(
    nr((i) =>
      bi(
        ex(i.route.parent, r),
        JA(i.route, r),
        nx(t, i.path, n),
        tx(t, i.route, n)
      )
    ),
    Xt((i) => i !== !0, !0)
  );
}
function JA(t, e) {
  return t !== null && e && e(new ap(t)), de(!0);
}
function ex(t, e) {
  return t !== null && e && e(new sp(t)), de(!0);
}
function tx(t, e, n) {
  let r = e.routeConfig ? e.routeConfig.canActivate : null;
  if (!r || r.length === 0) return de(!0);
  let i = r.map((s) =>
    Ra(() => {
      let o = ko(e) ?? n,
        a = is(s, o),
        c = GA(a) ? a.canActivate(e, t) : jn(o, () => a(e, t));
      return br(c).pipe(Xt());
    })
  );
  return de(i).pipe(rs());
}
function nx(t, e, n) {
  let r = e[e.length - 1],
    s = e
      .slice(0, e.length - 1)
      .reverse()
      .map((o) => UA(o))
      .filter((o) => o !== null)
      .map((o) =>
        Ra(() => {
          let a = o.guards.map((c) => {
            let l = ko(o.node) ?? n,
              u = is(c, l),
              d = WA(u) ? u.canActivateChild(r, t) : jn(l, () => u(r, t));
            return br(d).pipe(Xt());
          });
          return de(a).pipe(rs());
        })
      );
  return de(s).pipe(rs());
}
function rx(t, e, n, r, i) {
  let s = e && e.routeConfig ? e.routeConfig.canDeactivate : null;
  if (!s || s.length === 0) return de(!0);
  let o = s.map((a) => {
    let c = ko(e) ?? i,
      l = is(a, c),
      u = KA(l) ? l.canDeactivate(t, e, n, r) : jn(c, () => l(t, e, n, r));
    return br(u).pipe(Xt());
  });
  return de(o).pipe(rs());
}
function ix(t, e, n, r) {
  let i = e.canLoad;
  if (i === void 0 || i.length === 0) return de(!0);
  let s = i.map((o) => {
    let a = is(o, t),
      c = zA(a) ? a.canLoad(e, n) : jn(t, () => a(e, n));
    return br(c);
  });
  return de(s).pipe(rs(), g0(r));
}
function g0(t) {
  return Tu(
    tt((e) => {
      if (ts(e)) throw f0(t, e);
    }),
    Ee((e) => e === !0)
  );
}
function sx(t, e, n, r) {
  let i = e.canMatch;
  if (!i || i.length === 0) return de(!0);
  let s = i.map((o) => {
    let a = is(o, t),
      c = QA(a) ? a.canMatch(e, n) : jn(t, () => a(e, n));
    return br(c);
  });
  return de(s).pipe(rs(), g0(r));
}
var Ro = class {
    constructor(e) {
      this.segmentGroup = e || null;
    }
  },
  Gl = class extends Error {
    constructor(e) {
      super(), (this.urlTree = e);
    }
  };
function Yi(t) {
  return Ei(new Ro(t));
}
function ox(t) {
  return Ei(new z(4e3, !1));
}
function ax(t) {
  return Ei(h0(!1, Wt.GuardRejected));
}
var mp = class {
    constructor(e, n) {
      (this.urlSerializer = e), (this.urlTree = n);
    }
    lineralizeSegments(e, n) {
      let r = [],
        i = n.root;
      for (;;) {
        if (((r = r.concat(i.segments)), i.numberOfChildren === 0))
          return de(r);
        if (i.numberOfChildren > 1 || !i.children[ve]) return ox(e.redirectTo);
        i = i.children[ve];
      }
    }
    applyRedirectCommands(e, n, r) {
      let i = this.applyRedirectCreateUrlTree(
        n,
        this.urlSerializer.parse(n),
        e,
        r
      );
      if (n.startsWith("/")) throw new Gl(i);
      return i;
    }
    applyRedirectCreateUrlTree(e, n, r, i) {
      let s = this.createSegmentGroup(e, n.root, r, i);
      return new vr(
        s,
        this.createQueryParams(n.queryParams, this.urlTree.queryParams),
        n.fragment
      );
    }
    createQueryParams(e, n) {
      let r = {};
      return (
        Object.entries(e).forEach(([i, s]) => {
          if (typeof s == "string" && s.startsWith(":")) {
            let a = s.substring(1);
            r[i] = n[a];
          } else r[i] = s;
        }),
        r
      );
    }
    createSegmentGroup(e, n, r, i) {
      let s = this.createSegments(e, n.segments, r, i),
        o = {};
      return (
        Object.entries(n.children).forEach(([a, c]) => {
          o[a] = this.createSegmentGroup(e, c, r, i);
        }),
        new Fe(s, o)
      );
    }
    createSegments(e, n, r, i) {
      return n.map((s) =>
        s.path.startsWith(":")
          ? this.findPosParam(e, s, i)
          : this.findOrReturn(s, r)
      );
    }
    findPosParam(e, n, r) {
      let i = r[n.path.substring(1)];
      if (!i) throw new z(4001, !1);
      return i;
    }
    findOrReturn(e, n) {
      let r = 0;
      for (let i of n) {
        if (i.path === e.path) return n.splice(r), i;
        r++;
      }
      return e;
    }
  },
  gp = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function cx(t, e, n, r, i) {
  let s = Sp(t, e, n);
  return s.matched
    ? ((r = FA(e, r)),
      sx(r, e, n, i).pipe(Ee((o) => (o === !0 ? s : J({}, gp)))))
    : de(s);
}
function Sp(t, e, n) {
  if (e.path === "**") return lx(n);
  if (e.path === "")
    return e.pathMatch === "full" && (t.hasChildren() || n.length > 0)
      ? J({}, gp)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: n,
          parameters: {},
          positionalParamSegments: {},
        };
  let i = (e.matcher || iA)(n, t, e);
  if (!i) return J({}, gp);
  let s = {};
  Object.entries(i.posParams ?? {}).forEach(([a, c]) => {
    s[a] = c.path;
  });
  let o =
    i.consumed.length > 0
      ? J(J({}, s), i.consumed[i.consumed.length - 1].parameters)
      : s;
  return {
    matched: !0,
    consumedSegments: i.consumed,
    remainingSegments: n.slice(i.consumed.length),
    parameters: o,
    positionalParamSegments: i.posParams ?? {},
  };
}
function lx(t) {
  return {
    matched: !0,
    parameters: t.length > 0 ? Qb(t).parameters : {},
    consumedSegments: t,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function Wb(t, e, n, r) {
  return n.length > 0 && fx(t, n, r)
    ? {
        segmentGroup: new Fe(e, dx(r, new Fe(n, t.children))),
        slicedSegments: [],
      }
    : n.length === 0 && hx(t, n, r)
    ? {
        segmentGroup: new Fe(t.segments, ux(t, n, r, t.children)),
        slicedSegments: n,
      }
    : { segmentGroup: new Fe(t.segments, t.children), slicedSegments: n };
}
function ux(t, e, n, r) {
  let i = {};
  for (let s of n)
    if (Kl(t, e, s) && !r[wn(s)]) {
      let o = new Fe([], {});
      i[wn(s)] = o;
    }
  return J(J({}, r), i);
}
function dx(t, e) {
  let n = {};
  n[ve] = e;
  for (let r of t)
    if (r.path === "" && wn(r) !== ve) {
      let i = new Fe([], {});
      n[wn(r)] = i;
    }
  return n;
}
function fx(t, e, n) {
  return n.some((r) => Kl(t, e, r) && wn(r) !== ve);
}
function hx(t, e, n) {
  return n.some((r) => Kl(t, e, r));
}
function Kl(t, e, n) {
  return (t.hasChildren() || e.length > 0) && n.pathMatch === "full"
    ? !1
    : n.path === "";
}
function px(t, e, n, r) {
  return wn(t) !== r && (r === ve || !Kl(e, n, t)) ? !1 : Sp(e, t, n).matched;
}
function mx(t, e, n) {
  return e.length === 0 && !t.children[n];
}
var yp = class {};
function gx(t, e, n, r, i, s, o = "emptyOnly") {
  return new vp(t, e, n, r, i, o, s).recognize();
}
var yx = 31,
  vp = class {
    constructor(e, n, r, i, s, o, a) {
      (this.injector = e),
        (this.configLoader = n),
        (this.rootComponentType = r),
        (this.config = i),
        (this.urlTree = s),
        (this.paramsInheritanceStrategy = o),
        (this.urlSerializer = a),
        (this.applyRedirects = new mp(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(e) {
      return new z(4002, `'${e.segmentGroup}'`);
    }
    recognize() {
      let e = Wb(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(e).pipe(
        Ee((n) => {
          let r = new Ao(
              [],
              Object.freeze({}),
              Object.freeze(J({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              ve,
              this.rootComponentType,
              null,
              {}
            ),
            i = new Ht(r, n),
            s = new ql("", i),
            o = _A(r, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (o.queryParams = this.urlTree.queryParams),
            (s.url = this.urlSerializer.serialize(o)),
            this.inheritParamsAndData(s._root, null),
            { state: s, tree: o }
          );
        })
      );
    }
    match(e) {
      return this.processSegmentGroup(this.injector, this.config, e, ve).pipe(
        xn((r) => {
          if (r instanceof Gl)
            return (this.urlTree = r.urlTree), this.match(r.urlTree.root);
          throw r instanceof Ro ? this.noMatchError(r) : r;
        })
      );
    }
    inheritParamsAndData(e, n) {
      let r = e.value,
        i = wp(r, n, this.paramsInheritanceStrategy);
      (r.params = Object.freeze(i.params)),
        (r.data = Object.freeze(i.data)),
        e.children.forEach((s) => this.inheritParamsAndData(s, r));
    }
    processSegmentGroup(e, n, r, i) {
      return r.segments.length === 0 && r.hasChildren()
        ? this.processChildren(e, n, r)
        : this.processSegment(e, n, r, r.segments, i, !0).pipe(
            Ee((s) => (s instanceof Ht ? [s] : []))
          );
    }
    processChildren(e, n, r) {
      let i = [];
      for (let s of Object.keys(r.children))
        s === "primary" ? i.unshift(s) : i.push(s);
      return Ye(i).pipe(
        nr((s) => {
          let o = r.children[s],
            a = jA(n, s);
          return this.processSegmentGroup(e, a, o, s);
        }),
        Ru((s, o) => (s.push(...o), s)),
        rr(null),
        xu(),
        it((s) => {
          if (s === null) return Yi(r);
          let o = y0(s);
          return vx(o), de(o);
        })
      );
    }
    processSegment(e, n, r, i, s, o) {
      return Ye(n).pipe(
        nr((a) =>
          this.processSegmentAgainstRoute(
            a._injector ?? e,
            n,
            a,
            r,
            i,
            s,
            o
          ).pipe(
            xn((c) => {
              if (c instanceof Ro) return de(null);
              throw c;
            })
          )
        ),
        Xt((a) => !!a),
        xn((a) => {
          if (m0(a)) return mx(r, i, s) ? de(new yp()) : Yi(r);
          throw a;
        })
      );
    }
    processSegmentAgainstRoute(e, n, r, i, s, o, a) {
      return px(r, i, s, o)
        ? r.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(e, i, r, s, o)
          : this.allowRedirects && a
          ? this.expandSegmentAgainstRouteUsingRedirect(e, i, n, r, s, o)
          : Yi(i)
        : Yi(i);
    }
    expandSegmentAgainstRouteUsingRedirect(e, n, r, i, s, o) {
      let {
        matched: a,
        consumedSegments: c,
        positionalParamSegments: l,
        remainingSegments: u,
      } = Sp(n, i, s);
      if (!a) return Yi(n);
      i.redirectTo.startsWith("/") &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > yx && (this.allowRedirects = !1));
      let d = this.applyRedirects.applyRedirectCommands(c, i.redirectTo, l);
      return this.applyRedirects
        .lineralizeSegments(i, d)
        .pipe(it((m) => this.processSegment(e, r, n, m.concat(u), o, !1)));
    }
    matchSegmentAgainstRoute(e, n, r, i, s) {
      let o = cx(n, r, i, e, this.urlSerializer);
      return (
        r.path === "**" && (n.children = {}),
        o.pipe(
          At((a) =>
            a.matched
              ? ((e = r._injector ?? e),
                this.getChildConfig(e, r, i).pipe(
                  At(({ routes: c }) => {
                    let l = r._loadedInjector ?? e,
                      {
                        consumedSegments: u,
                        remainingSegments: d,
                        parameters: m,
                      } = a,
                      b = new Ao(
                        u,
                        m,
                        Object.freeze(J({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        bx(r),
                        wn(r),
                        r.component ?? r._loadedComponent ?? null,
                        r,
                        wx(r)
                      ),
                      { segmentGroup: I, slicedSegments: N } = Wb(n, u, d, c);
                    if (N.length === 0 && I.hasChildren())
                      return this.processChildren(l, c, I).pipe(
                        Ee((x) => (x === null ? null : new Ht(b, x)))
                      );
                    if (c.length === 0 && N.length === 0)
                      return de(new Ht(b, []));
                    let F = wn(r) === s;
                    return this.processSegment(l, c, I, N, F ? ve : s, !0).pipe(
                      Ee((x) => new Ht(b, x instanceof Ht ? [x] : []))
                    );
                  })
                ))
              : Yi(n)
          )
        )
      );
    }
    getChildConfig(e, n, r) {
      return n.children
        ? de({ routes: n.children, injector: e })
        : n.loadChildren
        ? n._loadedRoutes !== void 0
          ? de({ routes: n._loadedRoutes, injector: n._loadedInjector })
          : ix(e, n, r, this.urlSerializer).pipe(
              it((i) =>
                i
                  ? this.configLoader.loadChildren(e, n).pipe(
                      tt((s) => {
                        (n._loadedRoutes = s.routes),
                          (n._loadedInjector = s.injector);
                      })
                    )
                  : ax(n)
              )
            )
        : de({ routes: [], injector: e });
    }
  };
function vx(t) {
  t.sort((e, n) =>
    e.value.outlet === ve
      ? -1
      : n.value.outlet === ve
      ? 1
      : e.value.outlet.localeCompare(n.value.outlet)
  );
}
function Ex(t) {
  let e = t.value.routeConfig;
  return e && e.path === "";
}
function y0(t) {
  let e = [],
    n = new Set();
  for (let r of t) {
    if (!Ex(r)) {
      e.push(r);
      continue;
    }
    let i = e.find((s) => r.value.routeConfig === s.value.routeConfig);
    i !== void 0 ? (i.children.push(...r.children), n.add(i)) : e.push(r);
  }
  for (let r of n) {
    let i = y0(r.children);
    e.push(new Ht(r.value, i));
  }
  return e.filter((r) => !n.has(r));
}
function bx(t) {
  return t.data || {};
}
function wx(t) {
  return t.resolve || {};
}
function Dx(t, e, n, r, i, s) {
  return it((o) =>
    gx(t, e, n, r, o.extractedUrl, i, s).pipe(
      Ee(({ state: a, tree: c }) =>
        Je(J({}, o), { targetSnapshot: a, urlAfterRedirects: c })
      )
    )
  );
}
function _x(t, e) {
  return it((n) => {
    let {
      targetSnapshot: r,
      guards: { canActivateChecks: i },
    } = n;
    if (!i.length) return de(n);
    let s = new Set(i.map((c) => c.route)),
      o = new Set();
    for (let c of s) if (!o.has(c)) for (let l of v0(c)) o.add(l);
    let a = 0;
    return Ye(o).pipe(
      nr((c) =>
        s.has(c)
          ? Tx(c, r, t, e)
          : ((c.data = wp(c, c.parent, t).resolve), de(void 0))
      ),
      tt(() => a++),
      wi(1),
      it((c) => (a === o.size ? de(n) : $t))
    );
  });
}
function v0(t) {
  let e = t.children.map((n) => v0(n)).flat();
  return [t, ...e];
}
function Tx(t, e, n, r) {
  let i = t.routeConfig,
    s = t._resolve;
  return (
    i?.title !== void 0 && !u0(i) && (s[Oo] = i.title),
    Sx(s, t, e, r).pipe(
      Ee(
        (o) => (
          (t._resolvedData = o), (t.data = wp(t, t.parent, n).resolve), null
        )
      )
    )
  );
}
function Sx(t, e, n, r) {
  let i = Kh(t);
  if (i.length === 0) return de({});
  let s = {};
  return Ye(i).pipe(
    it((o) =>
      Cx(t[o], e, n, r).pipe(
        Xt(),
        tt((a) => {
          s[o] = a;
        })
      )
    ),
    wi(1),
    Au(s),
    xn((o) => (m0(o) ? $t : Ei(o)))
  );
}
function Cx(t, e, n, r) {
  let i = ko(e) ?? r,
    s = is(t, i),
    o = s.resolve ? s.resolve(e, n) : jn(i, () => s(e, n));
  return br(o);
}
function Gh(t) {
  return At((e) => {
    let n = t(e);
    return n ? Ye(n).pipe(Ee(() => e)) : de(e);
  });
}
var E0 = (() => {
    let e = class e {
      buildTitle(r) {
        let i,
          s = r.root;
        for (; s !== void 0; )
          (i = this.getResolvedTitleForRoute(s) ?? i),
            (s = s.children.find((o) => o.outlet === ve));
        return i;
      }
      getResolvedTitleForRoute(r) {
        return r.data[Oo];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = te({ token: e, factory: () => G(Ix), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Ix = (() => {
    let e = class e extends E0 {
      constructor(r) {
        super(), (this.title = r);
      }
      updateTitle(r) {
        let i = this.buildTitle(r);
        i !== void 0 && this.title.setTitle(i);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(se(HE));
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Cp = new ae("", { providedIn: "root", factory: () => ({}) }),
  Ip = new ae(""),
  Mx = (() => {
    let e = class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = G(Nf));
      }
      loadComponent(r) {
        if (this.componentLoaders.get(r)) return this.componentLoaders.get(r);
        if (r._loadedComponent) return de(r._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(r);
        let i = br(r.loadComponent()).pipe(
            Ee(b0),
            tt((o) => {
              this.onLoadEndListener && this.onLoadEndListener(r),
                (r._loadedComponent = o);
            }),
            Pr(() => {
              this.componentLoaders.delete(r);
            })
          ),
          s = new vi(i, () => new mt()).pipe(yi());
        return this.componentLoaders.set(r, s), s;
      }
      loadChildren(r, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
        if (i._loadedRoutes)
          return de({ routes: i._loadedRoutes, injector: i._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(i);
        let o = Nx(i, this.compiler, r, this.onLoadEndListener).pipe(
            Pr(() => {
              this.childrenLoaders.delete(i);
            })
          ),
          a = new vi(o, () => new mt()).pipe(yi());
        return this.childrenLoaders.set(i, a), a;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function Nx(t, e, n, r) {
  return br(t.loadChildren()).pipe(
    Ee(b0),
    it((i) =>
      i instanceof Hs || Array.isArray(i) ? de(i) : Ye(e.compileModuleAsync(i))
    ),
    Ee((i) => {
      r && r(t);
      let s,
        o,
        a = !1;
      return (
        Array.isArray(i)
          ? ((o = i), (a = !0))
          : ((s = i.create(n).injector),
            (o = s.get(Ip, [], { optional: !0, self: !0 }).flat())),
        { routes: o.map(Tp), injector: s }
      );
    })
  );
}
function Ax(t) {
  return t && typeof t == "object" && "default" in t;
}
function b0(t) {
  return Ax(t) ? t.default : t;
}
var Mp = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = te({ token: e, factory: () => G(xx), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  xx = (() => {
    let e = class e {
      shouldProcessUrl(r) {
        return !0;
      }
      extract(r) {
        return r;
      }
      merge(r, i) {
        return r;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Rx = new ae("");
var Ox = (() => {
  let e = class e {
    get hasRequestedNavigation() {
      return this.navigationId !== 0;
    }
    constructor() {
      (this.currentNavigation = null),
        (this.currentTransition = null),
        (this.lastSuccessfulNavigation = null),
        (this.events = new mt()),
        (this.transitionAbortSubject = new mt()),
        (this.configLoader = G(Mx)),
        (this.environmentInjector = G(Tt)),
        (this.urlSerializer = G(bp)),
        (this.rootContexts = G(Wl)),
        (this.location = G(eo)),
        (this.inputBindingEnabled = G(_p, { optional: !0 }) !== null),
        (this.titleStrategy = G(E0)),
        (this.options = G(Cp, { optional: !0 }) || {}),
        (this.paramsInheritanceStrategy =
          this.options.paramsInheritanceStrategy || "emptyOnly"),
        (this.urlHandlingStrategy = G(Mp)),
        (this.createViewTransition = G(Rx, { optional: !0 })),
        (this.navigationId = 0),
        (this.afterPreactivation = () => de(void 0)),
        (this.rootComponentType = null);
      let r = (s) => this.events.next(new rp(s)),
        i = (s) => this.events.next(new ip(s));
      (this.configLoader.onLoadEndListener = i),
        (this.configLoader.onLoadStartListener = r);
    }
    complete() {
      this.transitions?.complete();
    }
    handleNavigationRequest(r) {
      let i = ++this.navigationId;
      this.transitions?.next(
        Je(J(J({}, this.transitions.value), r), { id: i })
      );
    }
    setupNavigations(r, i, s) {
      return (
        (this.transitions = new lt({
          id: 0,
          currentUrlTree: i,
          currentRawUrl: i,
          extractedUrl: this.urlHandlingStrategy.extract(i),
          urlAfterRedirects: this.urlHandlingStrategy.extract(i),
          rawUrl: i,
          extras: {},
          resolve: null,
          reject: null,
          promise: Promise.resolve(!0),
          source: _o,
          restoredState: null,
          currentSnapshot: s.snapshot,
          targetSnapshot: null,
          currentRouterState: s,
          targetRouterState: null,
          guards: { canActivateChecks: [], canDeactivateChecks: [] },
          guardsResult: null,
        })),
        this.transitions.pipe(
          Nt((o) => o.id !== 0),
          Ee((o) =>
            Je(J({}, o), {
              extractedUrl: this.urlHandlingStrategy.extract(o.rawUrl),
            })
          ),
          At((o) => {
            this.currentTransition = o;
            let a = !1,
              c = !1;
            return de(o).pipe(
              tt((l) => {
                this.currentNavigation = {
                  id: l.id,
                  initialUrl: l.rawUrl,
                  extractedUrl: l.extractedUrl,
                  trigger: l.source,
                  extras: l.extras,
                  previousNavigation: this.lastSuccessfulNavigation
                    ? Je(J({}, this.lastSuccessfulNavigation), {
                        previousNavigation: null,
                      })
                    : null,
                };
              }),
              At((l) => {
                let u =
                    !r.navigated ||
                    this.isUpdatingInternalState() ||
                    this.isUpdatedBrowserUrl(),
                  d = l.extras.onSameUrlNavigation ?? r.onSameUrlNavigation;
                if (!u && d !== "reload") {
                  let m = "";
                  return (
                    this.events.next(
                      new ai(
                        l.id,
                        this.urlSerializer.serialize(l.rawUrl),
                        m,
                        Xh.IgnoredSameUrlNavigation
                      )
                    ),
                    l.resolve(null),
                    $t
                  );
                }
                if (this.urlHandlingStrategy.shouldProcessUrl(l.rawUrl))
                  return de(l).pipe(
                    At((m) => {
                      let b = this.transitions?.getValue();
                      return (
                        this.events.next(
                          new Co(
                            m.id,
                            this.urlSerializer.serialize(m.extractedUrl),
                            m.source,
                            m.restoredState
                          )
                        ),
                        b !== this.transitions?.getValue()
                          ? $t
                          : Promise.resolve(m)
                      );
                    }),
                    Dx(
                      this.environmentInjector,
                      this.configLoader,
                      this.rootComponentType,
                      r.config,
                      this.urlSerializer,
                      this.paramsInheritanceStrategy
                    ),
                    tt((m) => {
                      (o.targetSnapshot = m.targetSnapshot),
                        (o.urlAfterRedirects = m.urlAfterRedirects),
                        (this.currentNavigation = Je(
                          J({}, this.currentNavigation),
                          { finalUrl: m.urlAfterRedirects }
                        ));
                      let b = new Ul(
                        m.id,
                        this.urlSerializer.serialize(m.extractedUrl),
                        this.urlSerializer.serialize(m.urlAfterRedirects),
                        m.targetSnapshot
                      );
                      this.events.next(b);
                    })
                  );
                if (
                  u &&
                  this.urlHandlingStrategy.shouldProcessUrl(l.currentRawUrl)
                ) {
                  let {
                      id: m,
                      extractedUrl: b,
                      source: I,
                      restoredState: N,
                      extras: F,
                    } = l,
                    x = new Co(m, this.urlSerializer.serialize(b), I, N);
                  this.events.next(x);
                  let _ = c0(this.rootComponentType).snapshot;
                  return (
                    (this.currentTransition = o =
                      Je(J({}, l), {
                        targetSnapshot: _,
                        urlAfterRedirects: b,
                        extras: Je(J({}, F), {
                          skipLocationChange: !1,
                          replaceUrl: !1,
                        }),
                      })),
                    (this.currentNavigation.finalUrl = b),
                    de(o)
                  );
                } else {
                  let m = "";
                  return (
                    this.events.next(
                      new ai(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        m,
                        Xh.IgnoredByUrlHandlingStrategy
                      )
                    ),
                    l.resolve(null),
                    $t
                  );
                }
              }),
              tt((l) => {
                let u = new Jh(
                  l.id,
                  this.urlSerializer.serialize(l.extractedUrl),
                  this.urlSerializer.serialize(l.urlAfterRedirects),
                  l.targetSnapshot
                );
                this.events.next(u);
              }),
              Ee(
                (l) => (
                  (this.currentTransition = o =
                    Je(J({}, l), {
                      guards: BA(
                        l.targetSnapshot,
                        l.currentSnapshot,
                        this.rootContexts
                      ),
                    })),
                  o
                )
              ),
              YA(this.environmentInjector, (l) => this.events.next(l)),
              tt((l) => {
                if (((o.guardsResult = l.guardsResult), ts(l.guardsResult)))
                  throw f0(this.urlSerializer, l.guardsResult);
                let u = new ep(
                  l.id,
                  this.urlSerializer.serialize(l.extractedUrl),
                  this.urlSerializer.serialize(l.urlAfterRedirects),
                  l.targetSnapshot,
                  !!l.guardsResult
                );
                this.events.next(u);
              }),
              Nt((l) =>
                l.guardsResult
                  ? !0
                  : (this.cancelNavigationTransition(l, "", Wt.GuardRejected),
                    !1)
              ),
              Gh((l) => {
                if (l.guards.canActivateChecks.length)
                  return de(l).pipe(
                    tt((u) => {
                      let d = new tp(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot
                      );
                      this.events.next(d);
                    }),
                    At((u) => {
                      let d = !1;
                      return de(u).pipe(
                        _x(
                          this.paramsInheritanceStrategy,
                          this.environmentInjector
                        ),
                        tt({
                          next: () => (d = !0),
                          complete: () => {
                            d ||
                              this.cancelNavigationTransition(
                                u,
                                "",
                                Wt.NoDataFromResolver
                              );
                          },
                        })
                      );
                    }),
                    tt((u) => {
                      let d = new np(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot
                      );
                      this.events.next(d);
                    })
                  );
              }),
              Gh((l) => {
                let u = (d) => {
                  let m = [];
                  d.routeConfig?.loadComponent &&
                    !d.routeConfig._loadedComponent &&
                    m.push(
                      this.configLoader.loadComponent(d.routeConfig).pipe(
                        tt((b) => {
                          d.component = b;
                        }),
                        Ee(() => {})
                      )
                    );
                  for (let b of d.children) m.push(...u(b));
                  return m;
                };
                return xa(u(l.targetSnapshot.root)).pipe(rr(null), Rn(1));
              }),
              Gh(() => this.afterPreactivation()),
              At(() => {
                let { currentSnapshot: l, targetSnapshot: u } = o,
                  d = this.createViewTransition?.(
                    this.environmentInjector,
                    l.root,
                    u.root
                  );
                return d ? Ye(d).pipe(Ee(() => o)) : de(o);
              }),
              Ee((l) => {
                let u = RA(
                  r.routeReuseStrategy,
                  l.targetSnapshot,
                  l.currentRouterState
                );
                return (
                  (this.currentTransition = o =
                    Je(J({}, l), { targetRouterState: u })),
                  (this.currentNavigation.targetRouterState = u),
                  o
                );
              }),
              tt(() => {
                this.events.next(new Mo());
              }),
              HA(
                this.rootContexts,
                r.routeReuseStrategy,
                (l) => this.events.next(l),
                this.inputBindingEnabled
              ),
              Rn(1),
              tt({
                next: (l) => {
                  (a = !0),
                    (this.lastSuccessfulNavigation = this.currentNavigation),
                    this.events.next(
                      new oi(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects)
                      )
                    ),
                    this.titleStrategy?.updateTitle(
                      l.targetRouterState.snapshot
                    ),
                    l.resolve(!0);
                },
                complete: () => {
                  a = !0;
                },
              }),
              ku(
                this.transitionAbortSubject.pipe(
                  tt((l) => {
                    throw l;
                  })
                )
              ),
              Pr(() => {
                !a &&
                  !c &&
                  this.cancelNavigationTransition(
                    o,
                    "",
                    Wt.SupersededByNewNavigation
                  ),
                  this.currentNavigation?.id === o.id &&
                    (this.currentNavigation = null);
              }),
              xn((l) => {
                if (((c = !0), p0(l)))
                  this.events.next(
                    new Er(
                      o.id,
                      this.urlSerializer.serialize(o.extractedUrl),
                      l.message,
                      l.cancellationCode
                    )
                  ),
                    LA(l) ? this.events.next(new No(l.url)) : o.resolve(!1);
                else {
                  this.events.next(
                    new Io(
                      o.id,
                      this.urlSerializer.serialize(o.extractedUrl),
                      l,
                      o.targetSnapshot ?? void 0
                    )
                  );
                  try {
                    o.resolve(r.errorHandler(l));
                  } catch (u) {
                    this.options.resolveNavigationPromiseOnError
                      ? o.resolve(!1)
                      : o.reject(u);
                  }
                }
                return $t;
              })
            );
          })
        )
      );
    }
    cancelNavigationTransition(r, i, s) {
      let o = new Er(r.id, this.urlSerializer.serialize(r.extractedUrl), i, s);
      this.events.next(o), r.resolve(!1);
    }
    isUpdatingInternalState() {
      return (
        this.currentTransition?.extractedUrl.toString() !==
        this.currentTransition?.currentUrlTree.toString()
      );
    }
    isUpdatedBrowserUrl() {
      return (
        this.urlHandlingStrategy
          .extract(this.urlSerializer.parse(this.location.path(!0)))
          .toString() !== this.currentTransition?.extractedUrl.toString() &&
        !this.currentTransition?.extras.skipLocationChange
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = te({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function kx(t) {
  return t !== _o;
}
var Lx = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = te({ token: e, factory: () => G(Px), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Ep = class {
    shouldDetach(e) {
      return !1;
    }
    store(e, n) {}
    shouldAttach(e) {
      return !1;
    }
    retrieve(e) {
      return null;
    }
    shouldReuseRoute(e, n) {
      return e.routeConfig === n.routeConfig;
    }
  },
  Px = (() => {
    let e = class e extends Ep {};
    (e.ɵfac = (() => {
      let r;
      return function (s) {
        return (r || (r = Zd(e)))(s || e);
      };
    })()),
      (e.ɵprov = te({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  w0 = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = te({ token: e, factory: () => G(Fx), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Fx = (() => {
    let e = class e extends w0 {
      constructor() {
        super(...arguments),
          (this.location = G(eo)),
          (this.urlSerializer = G(bp)),
          (this.options = G(Cp, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = G(Mp)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new vr()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = c0(null)),
          (this.stateMemento = this.createStateMemento());
      }
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : this.restoredState()?.ɵrouterPageId ?? this.currentPageId;
      }
      getRouterState() {
        return this.routerState;
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      registerNonRouterCurrentEntryChangeListener(r) {
        return this.location.subscribe((i) => {
          i.type === "popstate" && r(i.url, i.state);
        });
      }
      handleRouterEvent(r, i) {
        if (r instanceof Co) this.stateMemento = this.createStateMemento();
        else if (r instanceof ai) this.rawUrlTree = i.initialUrl;
        else if (r instanceof Ul) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !i.extras.skipLocationChange
          ) {
            let s = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl);
            this.setBrowserUrl(s, i);
          }
        } else
          r instanceof Mo
            ? ((this.currentUrlTree = i.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                i.finalUrl,
                i.initialUrl
              )),
              (this.routerState = i.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                (i.extras.skipLocationChange ||
                  this.setBrowserUrl(this.rawUrlTree, i)))
            : r instanceof Er &&
              (r.code === Wt.GuardRejected || r.code === Wt.NoDataFromResolver)
            ? this.restoreHistory(i)
            : r instanceof Io
            ? this.restoreHistory(i, !0)
            : r instanceof oi &&
              ((this.lastSuccessfulId = r.id),
              (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(r, i) {
        let s = this.urlSerializer.serialize(r);
        if (this.location.isCurrentPathEqualTo(s) || i.extras.replaceUrl) {
          let o = this.browserPageId,
            a = J(J({}, i.extras.state), this.generateNgRouterState(i.id, o));
          this.location.replaceState(s, "", a);
        } else {
          let o = J(
            J({}, i.extras.state),
            this.generateNgRouterState(i.id, this.browserPageId + 1)
          );
          this.location.go(s, "", o);
        }
      }
      restoreHistory(r, i = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let s = this.browserPageId,
            o = this.currentPageId - s;
          o !== 0
            ? this.location.historyGo(o)
            : this.currentUrlTree === r.finalUrl &&
              o === 0 &&
              (this.resetState(r), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === "replace" &&
            (i && this.resetState(r), this.resetUrlToCurrentUrlTree());
      }
      resetState(r) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            r.finalUrl ?? this.rawUrlTree
          ));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId)
        );
      }
      generateNgRouterState(r, i) {
        return this.canceledNavigationResolution === "computed"
          ? { navigationId: r, ɵrouterPageId: i }
          : { navigationId: r };
      }
    };
    (e.ɵfac = (() => {
      let r;
      return function (s) {
        return (r || (r = Zd(e)))(s || e);
      };
    })()),
      (e.ɵprov = te({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  wo = (function (t) {
    return (
      (t[(t.COMPLETE = 0)] = "COMPLETE"),
      (t[(t.FAILED = 1)] = "FAILED"),
      (t[(t.REDIRECTING = 2)] = "REDIRECTING"),
      t
    );
  })(wo || {});
function jx(t, e) {
  t.events
    .pipe(
      Nt(
        (n) =>
          n instanceof oi ||
          n instanceof Er ||
          n instanceof Io ||
          n instanceof ai
      ),
      Ee((n) =>
        n instanceof oi || n instanceof ai
          ? wo.COMPLETE
          : (
              n instanceof Er
                ? n.code === Wt.Redirect ||
                  n.code === Wt.SupersededByNewNavigation
                : !1
            )
          ? wo.REDIRECTING
          : wo.FAILED
      ),
      Nt((n) => n !== wo.REDIRECTING),
      Rn(1)
    )
    .subscribe(() => {
      e();
    });
}
function Hx(t) {
  throw t;
}
var Bx = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  Ux = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  D0 = (() => {
    let e = class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      constructor() {
        (this.disposed = !1),
          (this.isNgZoneEnabled = !1),
          (this.console = G(zc)),
          (this.stateManager = G(w0)),
          (this.options = G(Cp, { optional: !0 }) || {}),
          (this.pendingTasks = G(Ui)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = G(Ox)),
          (this.urlSerializer = G(bp)),
          (this.location = G(eo)),
          (this.urlHandlingStrategy = G(Mp)),
          (this._events = new mt()),
          (this.errorHandler = this.options.errorHandler || Hx),
          (this.navigated = !1),
          (this.routeReuseStrategy = G(Lx)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = G(Ip, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!G(_p, { optional: !0 })),
          (this.eventsSubscription = new rt()),
          (this.isNgZoneEnabled = G(je) instanceof je && je.isInAngularZone()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (r) => {
                this.console.warn(r);
              },
            }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let r = this.navigationTransitions.events.subscribe((i) => {
          try {
            let s = this.navigationTransitions.currentTransition,
              o = this.navigationTransitions.currentNavigation;
            if (s !== null && o !== null) {
              if (
                (this.stateManager.handleRouterEvent(i, o),
                i instanceof Er &&
                  i.code !== Wt.Redirect &&
                  i.code !== Wt.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (i instanceof oi) this.navigated = !0;
              else if (i instanceof No) {
                let a = this.urlHandlingStrategy.merge(i.url, s.currentRawUrl),
                  c = {
                    info: s.extras.info,
                    skipLocationChange: s.extras.skipLocationChange,
                    replaceUrl:
                      this.urlUpdateStrategy === "eager" || kx(s.source),
                  };
                this.scheduleNavigation(a, _o, null, c, {
                  resolve: s.resolve,
                  reject: s.reject,
                  promise: s.promise,
                });
              }
            }
            $x(i) && this._events.next(i);
          } catch (s) {
            this.navigationTransitions.transitionAbortSubject.next(s);
          }
        });
        this.eventsSubscription.add(r);
      }
      resetRootComponentType(r) {
        (this.routerState.root.component = r),
          (this.navigationTransitions.rootComponentType = r);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              _o,
              this.stateManager.restoredState()
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (r, i) => {
              setTimeout(() => {
                this.navigateToSyncWithBrowser(r, "popstate", i);
              }, 0);
            }
          );
      }
      navigateToSyncWithBrowser(r, i, s) {
        let o = { replaceUrl: !0 },
          a = s?.navigationId ? s : null;
        if (s) {
          let l = J({}, s);
          delete l.navigationId,
            delete l.ɵrouterPageId,
            Object.keys(l).length !== 0 && (o.state = l);
        }
        let c = this.parseUrl(r);
        this.scheduleNavigation(c, i, a, o);
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(r) {
        (this.config = r.map(Tp)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(r, i = {}) {
        let {
            relativeTo: s,
            queryParams: o,
            fragment: a,
            queryParamsHandling: c,
            preserveFragment: l,
          } = i,
          u = l ? this.currentUrlTree.fragment : a,
          d = null;
        switch (c) {
          case "merge":
            d = J(J({}, this.currentUrlTree.queryParams), o);
            break;
          case "preserve":
            d = this.currentUrlTree.queryParams;
            break;
          default:
            d = o || null;
        }
        d !== null && (d = this.removeEmptyProps(d));
        let m;
        try {
          let b = s ? s.snapshot : this.routerState.snapshot.root;
          m = i0(b);
        } catch {
          (typeof r[0] != "string" || !r[0].startsWith("/")) && (r = []),
            (m = this.currentUrlTree.root);
        }
        return s0(m, r, d, u ?? null);
      }
      navigateByUrl(r, i = { skipLocationChange: !1 }) {
        let s = ts(r) ? r : this.parseUrl(r),
          o = this.urlHandlingStrategy.merge(s, this.rawUrlTree);
        return this.scheduleNavigation(o, _o, null, i);
      }
      navigate(r, i = { skipLocationChange: !1 }) {
        return Vx(r), this.navigateByUrl(this.createUrlTree(r, i), i);
      }
      serializeUrl(r) {
        return this.urlSerializer.serialize(r);
      }
      parseUrl(r) {
        try {
          return this.urlSerializer.parse(r);
        } catch {
          return this.urlSerializer.parse("/");
        }
      }
      isActive(r, i) {
        let s;
        if (
          (i === !0 ? (s = J({}, Bx)) : i === !1 ? (s = J({}, Ux)) : (s = i),
          ts(r))
        )
          return $b(this.currentUrlTree, r, s);
        let o = this.parseUrl(r);
        return $b(this.currentUrlTree, o, s);
      }
      removeEmptyProps(r) {
        return Object.entries(r).reduce(
          (i, [s, o]) => (o != null && (i[s] = o), i),
          {}
        );
      }
      scheduleNavigation(r, i, s, o, a) {
        if (this.disposed) return Promise.resolve(!1);
        let c, l, u;
        a
          ? ((c = a.resolve), (l = a.reject), (u = a.promise))
          : (u = new Promise((m, b) => {
              (c = m), (l = b);
            }));
        let d = this.pendingTasks.add();
        return (
          jx(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(d));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: i,
            restoredState: s,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: r,
            extras: o,
            resolve: c,
            reject: l,
            promise: u,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          u.catch((m) => Promise.reject(m))
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = te({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function Vx(t) {
  for (let e = 0; e < t.length; e++) if (t[e] == null) throw new z(4008, !1);
}
function $x(t) {
  return !(t instanceof Mo) && !(t instanceof No);
}
var qx = new ae("");
function l5(t, ...e) {
  return mn([
    { provide: Ip, multi: !0, useValue: t },
    [],
    { provide: ns, useFactory: zx, deps: [D0] },
    { provide: Vi, multi: !0, useFactory: Gx },
    e.map((n) => n.ɵproviders),
  ]);
}
function zx(t) {
  return t.routerState.root;
}
function Gx() {
  let t = G(sn);
  return (e) => {
    let n = t.get(on);
    if (e !== n.components[0]) return;
    let r = t.get(D0),
      i = t.get(Wx);
    t.get(Kx) === 1 && r.initialNavigation(),
      t.get(Qx, null, we.Optional)?.setUpPreloading(),
      t.get(qx, null, we.Optional)?.init(),
      r.resetRootComponentType(n.componentTypes[0]),
      i.closed || (i.next(), i.complete(), i.unsubscribe());
  };
}
var Wx = new ae("", { factory: () => new mt() }),
  Kx = new ae("", { providedIn: "root", factory: () => 1 });
var Qx = new ae("");
export {
  Ye as a,
  Ei as b,
  Ee as c,
  nD as d,
  xn as e,
  Dg as f,
  te as g,
  zr as h,
  ae as i,
  se as j,
  or as k,
  kg as l,
  Gr as m,
  Wr as n,
  Cc as o,
  Zd as p,
  zP as q,
  Hc as r,
  Gs as s,
  GP as t,
  St as u,
  Vc as v,
  yt as w,
  WS as x,
  LC as y,
  qC as z,
  zC as A,
  Rv as B,
  Ov as C,
  Mf as D,
  o1 as E,
  a1 as F,
  Qs as G,
  jv as H,
  KP as I,
  h1 as J,
  YP as K,
  b1 as L,
  Uv as M,
  ZP as N,
  $v as O,
  zc as P,
  Nf as Q,
  on as R,
  Zs as S,
  Qc as T,
  kf as U,
  uE as V,
  XP as W,
  yn as X,
  X1 as Y,
  TF as Z,
  yE as _,
  SF as $,
  CF as aa,
  rI as ba,
  hI as ca,
  jF as da,
  r2 as ea,
  i2 as fa,
  Rl as ga,
  KN as ha,
  R2 as ia,
  nA as ja,
  O2 as ka,
  k2 as la,
  xA as ma,
  Nx as na,
  D0 as oa,
  l5 as pa,
};
