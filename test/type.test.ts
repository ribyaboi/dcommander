import * as chai from "chai";
import {Types} from "../src/dcommander/argument/value/types";
import {Errors} from "../src/dcommander/error/errors";

const expect = chai.expect;

describe("ValueType Test", () => {
    describe("NumberValueType Test", () => {
        const type = new Types.NumberValueType();

        it("should be true if a value is a valid number", () => {
            expect(type.is("1")).to.be.true;
            expect(type.is("0x12")).to.be.true;

            expect(type.is("19a")).to.be.false;
            expect(type.is("abc")).to.be.false;
        });

        it("should convert to a valid number", () => {
            expect(type.convertValue("1")).to.eq(1);
            expect(type.convertValue("1234")).to.eq(1234);
            expect(type.convertValue("0x12")).to.eq(18);

            expect(() => type.convertValue("a")).to.throw(Errors.ConversionError);
        });
    });

    describe("StringValueType Test", () => {
        const type = new Types.StringValueType();

        it("should be true if a value is a valid string", () => {
            expect(type.is("discord is spying on you right now")).to.be.true;
            expect(type.is("1")).to.be.true;
        });

        it("should convert to a valid string", () => {
            expect(type.convertValue("discord is spying on you right now")).to.eq("discord is spying on you right now");
        });
    });

    describe("BooleanValueType Test", () => {
        const type = new Types.BooleanValueType();

        it("should be true if a value is a valid symbol that could point to a boolean expression", () => {
            expect(type.is("true")).to.be.true;
            expect(type.is("1")).to.be.true;
            expect(type.is("y")).to.be.true;
            expect(type.is("yes")).to.be.true;
            expect(type.is("false")).to.be.true;
            expect(type.is("0")).to.be.true;
            expect(type.is("n")).to.be.true;
            expect(type.is("no")).to.be.true;

            expect(type.is("yesfalse")).to.be.false;
            expect(type.is("10")).to.be.false;
            expect(type.is("anything else")).to.be.false;
            expect(type.is("2")).to.be.false;
        });

        it("should convert to a valid boolean", () => {
            expect(type.convertValue("true")).to.be.true;
            expect(type.convertValue("1")).to.be.true;
            expect(type.convertValue("y")).to.be.true;
            expect(type.convertValue("yes")).to.be.true;

            expect(type.convertValue("false")).to.be.false;
            expect(type.convertValue("0")).to.be.false;
            expect(type.convertValue("n")).to.be.false;
            expect(type.convertValue("no")).to.be.false;
        });
    });

    describe("ObjectValueType Test", () => {
        const type = new Types.ObjectValueType();

        it("should be true for an object", () => {
            expect(type.is("{}")).to.be.true;
            expect(type.is("{ \"a\": \"1\", \"b\": \"2\" }")).to.be.true;

            expect(type.is("[1, 2, 3]")).to.be.false;
            expect(type.is("1")).to.be.false;
            expect(type.is("a string")).to.be.false;
        });

        it("should convert any valid JSON to an object", () => {
            expect(type.convertValue("{ \"foo\": true, \"bar\": 1 }")).to.deep.eq({ foo: true, bar: 1});
            expect(type.convertValue("{}")).to.deep.eq({});

            expect(() => type.convertValue("1")).to.throw(Errors.ConversionError);
            expect(() => type.convertValue("[1,2,3]")).to.throw(Errors.ConversionError);
            expect(() => type.convertValue("a string")).to.throw(Errors.ConversionError);
        })
    });

    describe("DateValueType Test", () => {
        const type = new Types.DateValueType();

        it("should be true for a valid date", () => {
            expect(type.is("Mon, 25 Mar 2019 14:46:45 GMT")).to.be.true;
            expect(type.is("1553525305044")).to.be.true;
            expect(type.is("Mon Mar 25 2019")).to.be.true;
        });

        it("should convert any valid JSON to an object", () => {
            expect(type.convertValue("Mon, 25 Mar 2019 14:46:45 GMT")).to.deep.eq(new Date("Mon, 25 Mar 2019 14:46:45 GMT"));
            expect(type.convertValue("1553525305044")).to.deep.eq(new Date(1553525305044));
            expect(type.convertValue("Mon Mar 25 2019")).to.deep.eq(new Date("Mon Mar 25 2019"));

            expect(() => type.convertValue("a string")).to.throw(Errors.ConversionError);
        })
    });

});