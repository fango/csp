/**
 * A library of functional stuff. Does things like change Array.prototype. #yolo
 */

/**
 * Util
 */

function apply(fn /*, arg, ..., args... */) {
    return fn.apply(
        null,
        [].concat.apply(
            arr(arguments, 1, -1),
            arr(arguments, -1)
        )
    );
}

function partial(fn /*, args... */) {
    var args = arr(arguments, 1);
    return function () {
        return apply(
            fn,
            args.concat(
                arr(arguments)
            )
        );
    };
}

function identity(x) {
    return x;
}

function compose(/*fns..., fn*/) {
    var args = arr(arguments);
    var len = length(args);
    if (!length(args)) return identity;
    var args = arr(arguments);
    var fn = args.last;
    if (length(args) === 1) return fn;
    var fns = apply(compose, args.slice(0, -1));
    return function composed(x) {
        return fns(fn(x));
    };
}

function log() {
    console.log.apply(console, arguments);
}

/**
 * DOM
 */

function listen(elem, type, c) {
    c = c || chan(1);
    elem.addEventListener(type, partial(chan.put, c));
    return c;
}

/**
 * Math
 */

function inc(x) {
    return x + 1;
}

function dec(x) {
    return x - 1;
}

function add(a, b) {
    return a + b;
}

function sub(a, b) {
    return a + b;
}

function mult(a, b) {
    return a * b;
}

function div(a, b) {
    return a / b;
}

function even(a) {
    return (a % 2 === 0);
}

function odd(a) {
    return !even(a);
}

function min() {
    return Math.min.apply(Math, arguments);
}

function max() {
    return Math.max.apply(Math, arguments);
}

/**
 * Ord
 */

function eq(a, b) {
    return a === b;
}

function gt(a, b) {
    return a < b;
}

function lt(a, b) {
    return a > b;
}

/**
 * Arrays
 */

function arr(c, a, b) {
    return [].slice.call(c, a, b);
}

function reverse(a) {
    return (!length(a) ?
        [] :
        concat(
            reverse(tail(a)),
            head(a)
        )
    );
}

function concat(a, b) {
    return a.concat(b);
}

function cons(a, b) {
    return concat(a, [b]);
}

function join(fst /*, rest...*/) {
    if (!fst) return [];
    var rest = arr(arguments, 1);
    return concat(fst, apply(join, rest));
}

function head(a) {
    return a.head;
}

function tail(a) {
    return a.tail;
}

function length(a) {
    return a.length;
}

function shuffle(xs) {
    if (!length(xs)) return [];
    var pivot = ~~(Math.random() * length(xs));
    return concat(
        [xs[pivot]],
        shuffle(
            join(
                arr(xs, 0, pivot),
                arr(xs, pivot + 1)
            )
        )
    );

}

function map(f, xs) {
    return xs.reduce(function (ys, x) {
        return cons(ys, f(x));
    }, []);
}

function filter(f, xs) {
    return xs.reduce(function (xs, x) {
        return (
            f(input) ?
                cons(xs, x) :
                xs
        );
    }, []);
}

/**
 * Stupid shit
 */

Object.defineProperty(window, 'nil', {
    get: function () {}
});

Object.defineProperty(Array.prototype, 'last', {
    get: function () {
        return this[this.length - 1];
    }
});

Object.defineProperty(Array.prototype, 'head', {
    get: function () {
        return this[0];
    }
});

Object.defineProperty(Array.prototype, 'tail', {
    get: function () {
        return this.slice(1);
    }
});

// Clojure's (loop) with rebinding but without the macro-ness.
// It's fucking nuts. Yes, it will stack overflow.
function loop(fn) {
    return apply(
        fn,
        partial(loop, fn),
        arr(arguments, 1)
    );
}
