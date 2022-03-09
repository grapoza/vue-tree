import { expect, describe, it } from 'vitest';
import { isProbablyObject, cheapCopyObject } from '../../src/objectMethods.js';

describe('objectMethods.js', () => {

  describe('isProbablyObject', () => {

    describe('when the argument is null', () => {

      it('should return false', () => {
        expect(isProbablyObject(null)).to.be.false;
      });
    });

    describe('when the argument is not typeof Object', () => {

      it('should return false', () => {
        expect(isProbablyObject("A String")).to.be.false;
      });
    });

    describe('when the argument is an Array', () => {

      it('should return false', () => {
        expect(isProbablyObject([])).to.be.false;
      });
    });

    describe('when the argument is an Object', () => {

      it('should return true', () => {
        expect(isProbablyObject({})).to.be.true;
      });
    });
  });

  describe('cheapCopyObject', () => {

    describe('when the argument is null', () => {

      it('should return null', () => {
        expect(cheapCopyObject(null)).to.be.null;
      });
    });

    describe('when the argument is not an object (functions excluded)', () => {

      it('should return a copy of that argument', () => {
        const arr = [1, 2, 3];
        expect(cheapCopyObject(arr)).to.eql(arr);
        expect(cheapCopyObject("string")).to.equal("string");
        expect(cheapCopyObject(1)).to.equal(1);
      });
    });

    describe('when the argument is an object', () => {

      it('should return a copy of that object', () => {
        const obj = { a: 1, b: 2, c: 3 };
        expect(cheapCopyObject(obj)).to.eql(obj);
      });

      describe('and it contains nested objects', () => {

        it('should return a copy of that object and nested objects', () => {
          const obj = { a: { b: 1 } };
          expect(cheapCopyObject(obj)).to.eql(obj);
        });
      });

      describe('and it contains functions', () => {

        it('should return a copy of that object with functions intact', () => {
          const obj = { a: function () { return true; } };
          expect(cheapCopyObject(obj)).to.eql(obj);
        });
      });
    });
  })
});