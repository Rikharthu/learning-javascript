/*jshint esversion: 6 */
// More info:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_G
// e nerators

/*
An object is an iterator when it knows how to access items from a collection one at a time,
while keeping track of its current position within that sequence.
In JavaScript an iterator is an object that provides a next() method which returns the next item in the sequence.
This method returns an object with two properties: done and value.

Once created, an iterator object can be used explicitly by repeatedly calling next().
*/

function makeIterator(array) {
    var nextIndex = 0;

    return {
        next: function () {
            return nextIndex < array.length
                ? {
                    value: array[nextIndex++],
                    done: false
                }
                : {
                    done: true
                };
        }
    };
}

var it = makeIterator(['yo', 'ya']);
console.log(it.next().value); // 'yo'
console.log(it.next().value); // 'ya'
console.log(it.next().done); // true

/*
Generators allow you to define an iterative algorithm by writing a single function
which can maintaint it's own state
A GeneratorFunction is a special type of function that works as a factory for iterators.
When it is executed it returns a new Generator object.
A function becomes a GeneratorFunction if it uses the function* syntax.
*/
function * idMaker() {
    var index = 0;
    while (true) {
        // yield keyword is used to pause and resume a generator function
        yield index++;
    }
}

var gen = idMaker();

console.log(gen.next().value); // 0
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2

// Iterables
/*
An object is iterable if it defines its iteration behavior,
such as what values are looped over in a for...of construct.
Some built-in types, such as Array or Map, have a default iteration behavior,
while other types (such as Object) do not.

In order to be iterable, an object must implement the @@iterator method,
meaning that the object (or one of the objects up its prototype chain)
must have a property with a Symbol.iterator key:
*/

var myIterable = {};
myIterable[Symbol.iterator] = function * () {
    yield 1;
    yield 2;
    yield 3;
};

for (let value of myIterable) {
    console.log(value);
}
// 1 2 3
console.log([...myIterable]); // [ 1, 2, 3 ]

// Built-in iterables include: String, Array, TypedArray, Map and Set

/*
Some statements and expressions are expecting iterables,
for example the for-of loops, spread syntax, yield*, and destructuring assignment.
*/
for (let value of['a',
    'b',
    'c']) {
    console.log(value);
}
// "a" "b" "c"
console.log([...'abc']); // ["a", "b", "c"]

function * generateLetters() {
    yield * ['x', 'y', 'z'];
}

let letterGenerator = generateLetters()
console.log(letterGenerator.next()); // { value: 'x', done: false }
console.log(letterGenerator.next()); // { value: 'y', done: false }

// Advanced Generators
/*
Generators compute their yielded values on demand, which allows them
to efficiently represent sequences that are expensive to compute,
or even infinite sequences as demonstrated above.

The next() method also accepts a value which can be used to modify the
internal state of the generator. A value passed to next() will be treated
as the result of the last yield expression that paused the generator.
*/

// GENERATORS COMPUTE THEIR YIELDED VALUES ON DEMAND!!!

// Here is the fibonacci generator using next(x) to restart the sequence:
function * fibonacci() {
    var fn1 = 0;
    var fn2 = 1;
    while (true) {
        var current = fn1;
        fn1 = fn2;
        fn2 = current + fn1;
        var reset = yield current;
        if (reset) {
            fn1 = 0;
            fn2 = 1;
        }
    }
}

var sequence = fibonacci();
console.log(sequence.next().value); // 0
console.log(sequence.next().value); // 1
console.log(sequence.next().value); // 1
console.log(sequence.next().value); // 2
console.log(sequence.next().value); // 3
console.log(sequence.next().value); // 5
console.log(sequence.next().value); // 8
console.log(sequence.next(true).value); // 0
console.log(sequence.next().value); // 1
console.log(sequence.next().value); // 1
console.log(sequence.next().value); // 2

// Get first 100 elements of the Fibonacci sequence
console.log("First 100 Fibonacci sequence numbers:");
console.log(sequence.next(true).value);
for(i=0;i<100;i++){
    console.log(sequence.next().value)
}