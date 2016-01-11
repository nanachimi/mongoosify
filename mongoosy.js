"use strict";

var _ = require('lodash');
var fs = require("fs");

var objToString = function(obj, ndeep) {
    if(obj == null){ return String(obj); }
    switch(typeof obj){
        case "string": return '"'+obj+'"';
        case "function": return obj.name || obj.toString();
        case "object":
            var indent = Array(ndeep||1).join('\t'), isArray = Array.isArray(obj);
            return '{['[+isArray] + Object.keys(obj).map(function(key){
                    return '\n\t' + indent + key + ': ' + objToString(obj[key], (ndeep||1)+1);
                }).join(',') + '\n' + indent + '}]'[+isArray];
        default: return obj.toString();
    }
};

var hasValidTypeProVal = function (typeVal) {
    return _.contains(["array", "boolean", "integer", "number", "null", "object", "string"], typeVal);
}

var mapObject = function(object){

};

var mapArray = function(array){

};

var mapPrimitivesType = function(primitive){

};

var mapJsonTypesToMongooseTypes = function(data){

    var tmp = null;

    _.each(data, function (value, key) {

        if(value['$ref'] != null) {
            tmp = {
                type: Schema.ObjectId,
                ref: value['$ref']
            }
        }else {

        }
        var typeVal = value["type"];

        if(!hasValidTypeProVal(typeVal)){
            throw "the value of a 'type' property is not valid.\nvalue:"+typeVal;
        }

        switch (type){
            case "number":
                break;
            case "integer":
                break;
            case "boolean":
                break;
            case "string":
                break;
            case "array":
                break;
            case "object":
                break;
        }
    });

};

var validateSchema = function (schemaObject) {

    /**
     *
     * @param key
     * @returns {boolean}
     */
    var hasSchemaKey = function (key) {
        return _.has(schemaObject, key);
    };

    /**
     *
     * @param schemaPropVal a value of a $schema property
     * @returns true if a value of a $schema property is valid, else false
     */
    var hasValidSchemaPropVal = function (idVal) {
        return true;
        //TODO
    }



    var hasValidPropertiesVal = function(propertiesVal){
        return !_.isEmpty(propertiesVal);
    }

    var schema = "$schema";

    if(hasSchemaKey(schema)) {
        var schemaVal = _.get(schemaObject, schema);
        if(!hasValidSchemaPropVal(schemaVal)){
            throw "the value of a '$schema' property is not valid.\nvalue:"+schemaObject;
        }
    }else{
        throw "the schema must have a '$schema' property.\npassed schema:\n"+objToString(schemaObject);
    }

    var id = "id";

    if(hasSchemaKey(id)) {
        var idVal = _.get(schemaObject, id);
        if(!hasValidSchemaPropVal(idVal)){
            throw "the value of a 'id' property is not valid\nvalue:"+idVal;
        }
    }

    var type = "type";

    if(hasSchemaKey(type)) {
        var typeVal = _.get(schemaObject, type);
        if(!hasValidTypeProVal(typeVal)){
            throw "the value of a 'type' property is not valid.\nvalue:"+typeVal;
        }
    }else{
        throw "the schema must have a 'type' property\npassed schema:\n"+objToString(schemaObject);
    }

    var properties = "properties";
    var propertiesVal;

    if(hasSchemaKey(properties)) {
        propertiesVal = _.get(schemaObject, properties);
        if(!hasValidPropertiesVal(propertiesVal)){
            throw "the value of a 'properties' property is not valid.\nvalue:"+propertiesVal;
        }
    }else{
        throw "the schema must have a 'type' property\npassed schema:\n"+objToString(schemaObject);
    }

    var additionalProperties = "additionalProperties";

    if(hasSchemaKey(additionalProperties)) {
        var additionalPropertiesVal = _.get(schemaObject, additionalProperties);
    }else{

    }

    var required = "required";

    if(hasSchemaKey(required)) {
        var requiredVal = _.get(schemaObject, required);
    }else{

    }
};

var fromJSON = function(filePath){

    var schemaString = fs.readFileSync(filePath, "utf8");

    var schemaObject = JSON.parse(schemaString);

    var converted = mapJsonTypesToMongooseTypes(schemaObject["properties"]);

    return converted;
}

var mongoosy = {};
mongoosy.fromJSON = fromJSON;
module.exports = mongoosy;