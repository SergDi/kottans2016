var assert = require("assert");
Promise = require('../promise.js');
describe("Promise.map-test", function () {

    function mapper(val) {
        return val * 2;
    }

    function deferredMapper(val) {
        return Promise.delay(1, mapper(val));
    }

    specify("should map input values array", function () {
        var input = [1, 2, 3];
        return Promise.map(input, mapper).then(
            function (results) {
                assert.deepEqual(results, [2, 4, 6]);
            },
            assert.fail
        );
    });

    specify("should map input promises array", function () {
        var input = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
        return Promise.map(input, mapper).then(
            function (results) {
                assert.deepEqual(results, [2, 4, 6]);
            },
            assert.fail
        );
    });

    specify("should map mixed input array", function () {
        var input = [1, Promise.resolve(2), 3];
        return Promise.map(input, mapper).then(
            function (results) {
                assert.deepEqual(results, [2, 4, 6]);
            },
            assert.fail
        );
    });

    specify("should map input when mapper returns a promise", function() {
        var input = [1,2,3];
        return Promise.map(input, deferredMapper).then(
            function(results) {
                assert.deepEqual(results, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should accept a promise for an array", function () {
        return Promise.map(Promise.resolve([1, Promise.resolve(2), 3]), mapper).then(
            function (result) {
                assert.deepEqual(result, [2, 4, 6]);
            },
            assert.fail
        );
    });

    specify("should throw a TypeError when input promise does not resolve to an array", function () {
        return Promise.map(Promise.resolve(123), mapper).catch(TypeError, function (e) {
        });
    });

    specify("should map input promises when mapper returns a promise", function() {
        var input = [Promise.resolve(1),Promise.resolve(2),Promise.resolve(3)];
        return Promise.map(input, mapper).then(
            function(results) {
                assert.deepEqual(results, [2,4,6]);
            },
            assert.fail
        );
    });

        specify("should reject when input contains rejection", function() {
        var input = [Promise.resolve(1), Promise.reject(2), Promise.resolve(3)];
        return Promise.map(input, mapper).then(
            assert.fail,
            function(result) {
                assert(result === 2);
            }
        );
    });

}); 

describe("Promise.map-test with concurrency", function () {

    var concurrency = {concurrency: 2};

    function mapper(val) {
        return val * 2;
    }

    function deferredMapper(val) {
        return Promise.delay(1, mapper(val));
    }

    specify("should map input values array with concurrency", function() {
        var input = [1, 2, 3];
        return Promise.map(input, mapper, concurrency).then(
            function(results) {
                assert.deepEqual(results, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should map input promises array with concurrency", function() {
        var input = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
        return Promise.map(input, mapper, concurrency).then(
            function(results) {
                assert.deepEqual(results, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should map mixed input array with concurrency", function() {
        var input = [1, Promise.resolve(2), 3];
        return Promise.map(input, mapper, concurrency).then(
            function(results) {
                assert.deepEqual(results, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should map input when mapper returns a promise with concurrency", function() {
        var input = [1,2,3];
        return Promise.map(input, deferredMapper, concurrency).then(
            function(results) {
                assert.deepEqual(results, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should accept a promise for an array with concurrency", function() {
        return Promise.map(Promise.resolve([1, Promise.resolve(2), 3]), mapper, concurrency).then(
            function(result) {
                assert.deepEqual(result, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should resolve to empty array when input promise does not resolve to an array with concurrency", function() {
        return Promise.map(Promise.resolve(123), mapper, concurrency).catch(TypeError, function(e){
        });
    });

    specify("should map input promises when mapper returns a promise with concurrency", function() {
        var input = [Promise.resolve(1),Promise.resolve(2),Promise.resolve(3)];
        return Promise.map(input, mapper, concurrency).then(
            function(results) {
                assert.deepEqual(results, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should reject when input contains rejection with concurrency", function() {
        var input = [Promise.resolve(1), Promise.reject(2), Promise.resolve(3)];
        return Promise.map(input, mapper, concurrency).then(
            assert.fail,
            function(result) {
                assert(result === 2);
            }
        );
    });
    
});  