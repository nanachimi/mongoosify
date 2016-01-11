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

var hasValidTypeVal = function (typeVal) {
    return _.contains(["array", "boolean", "integer", "number", "object", "string"], typeVal);
};

var mapPrimitiveType = function (primitiveType) {
    if(primitiveType.indexOf('integer') === 0) {
        primitiveType = "number"
    }
    return eval(primitiveType.charAt(0).toUpperCase() + primitiveType.substr(1));
};

var mapJsonTypesToMongooseTypes = function(v, strType) {
    var tmp = null;
    var type = strType || v['type'];
    switch(type) {
        case 'array':
            tmp = [];
            if(v['items']['$ref'] != null) {
                tmp.push({
                    type: Schema.ObjectId,
                    ref: v['items']['$ref']
                });
            } else {
                var originalType = v['items']['type'];
                v['items']['type'] = mapPrimitiveType(v['items']['type']);
                tmp.push(mapJsonTypesToMongooseTypes(v['items'], originalType));
            }
            break;
        case 'object':
            tmp = {};
            var props = v['properties'];
            _.each(props, function(data, k) {
                if(data['$ref'] != null) {
                    tmp[k] = {
                        type: Schema.ObjectId,
                        ref: data['$ref']
                    };
                } else {
                    tmp[k] = mapPrimitiveType(data['type'])
                }
            });
            break;
        default:
            tmp = v;
            tmp['type'] = mapPrimitiveType(type);
            break;
    }
    return tmp
};

var jsonSchemaToMongooseSchema = function(data){

    var tmp = null;
    var mongooseSchema = {};

    _.each(data, function (value, key) {

        if(value['$ref'] != null) {
            tmp = {
                type: Schema.ObjectId,
                ref: value['$ref']
            }
        }else {
            tmp = mapJsonTypesToMongooseTypes(value);
        }

        mongooseSchema[key] = tmp;

    });
    return mongooseSchema;
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

var fromJSON = function(schemaObject){

   var res = jsonSchemaToMongooseSchema(schemaObject["properties"]);

    return res;

};

var mongoosy = {};

mongoosy.fromJSON = fromJSON;

module.exports = mongoosy;