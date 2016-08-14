"use strict";

var expect = require("chai").expect;

//require mongoosify
var mongoosify = require('../mongoosify');

// //basic data structure to parse as mongoose schema
var personJsonSchema = require("./personSchema.json");

// parse a json schema to mongoose schema file content
var personMongooseSchema = mongoosify(personJsonSchema);

describe("mongoosify", function(){
    it("person schema should have a property 'address'", function(){
      expect(personMongooseSchema).ownProperty("address");
    });
    it("person schema should have a property 'firstName'", function(){
        expect(personMongooseSchema).ownProperty("firstName");
    });
    it("person schema should have a property 'lastName'", function(){
        expect(personMongooseSchema).ownProperty("lastName");
    });
    it("person schema should have a property 'title'", function(){
        expect(personMongooseSchema).ownProperty("title");
    });
    it("person schema should have a property 'email'", function(){
        expect(personMongooseSchema).ownProperty("email");
    });
    it("person schema should have a property 'age'", function(){
        expect(personMongooseSchema).ownProperty("age");
    });

    it("address property should have a be 'object'", function(){
        expect(personMongooseSchema.address).to.be.an("object");
    });

    it("address object should have a property 'street'", function(){
        expect(personMongooseSchema.address).ownProperty("street");
    });
    it("address object should have a property 'house'", function(){
        expect(personMongooseSchema.address).ownProperty("house");
    });
    it("address object should have a property 'city'", function(){
        expect(personMongooseSchema.address).ownProperty("city");
    });
});
