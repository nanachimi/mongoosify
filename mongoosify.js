"use strict";

var _ = require('lodash');
var fs = require("fs");

/**
*
* @param key
* @returns {boolean}
*/
var hasSchemaKey = function (schemaObject, key) {
  var result = _.has(schemaObject, key);
  return _.has(schemaObject, key);
};

/**
*
* @param idVal a value of a $schema property
* @returns true if a value of a $schema property is valid, else false
*/
var hasValidSchemaVal = function (schemaObject, idVal) {
  return true;
  //TODO
};


var hasValidTypeVal = function (typeVal) {
  return _.includes(["array", "boolean", "integer", "number", "object", "string"], typeVal);
};

var hasValidPropertiesVal = function(propertiesVal){
  return !_.isEmpty(propertiesVal);
};

var validateSchema = function (schemaObject) {

  var schema = "$schema";

  if(hasSchemaKey(schemaObject, schema)) {
    var schemaVal = _.get(schemaObject, schema);
    if(!hasValidSchemaVal(schemaVal)){
      throw "the value of a '$schema' property is not valid.\nvalue:"+schemaObject;
    }
  }

  var id = "id";

  if(hasSchemaKey(schemaObject, id)) {
    var idVal = _.get(schemaObject, id);
    if(!hasValidSchemaVal(idVal)){
      throw "the value of a 'id' property is not valid\nvalue:"+idVal;
    }
  }

  var type = "type";

  if(hasSchemaKey(schemaObject, type)) {
    var typeVal = _.get(schemaObject, type);
    if(!hasValidTypeVal(typeVal)){
      throw "the value of a 'type' property is not valid.\nvalue:"+typeVal;
    }
  }

  var properties = "properties";
  var propertiesVal;

  if(hasSchemaKey(schemaObject, properties)) {
    propertiesVal = _.get(schemaObject, properties);
    if(!hasValidPropertiesVal(propertiesVal)){
      throw "the value of a 'properties' property is not valid.\nvalue:"+propertiesVal;
    }
  }

  var additionalProperties = "additionalProperties";

  if(hasSchemaKey(schemaObject, additionalProperties)) {
    var additionalPropertiesVal = _.get(schemaObject, additionalProperties);
  }

  var required = "required";

  if(hasSchemaKey(schemaObject, required)) {
    var requiredVal = _.get(schemaObject, required);
  }else{

  }
};

var mapPrimitiveTypes = function (primitiveType) {
  var regexp = "/^string|integer|array|object|boolean|number$/g";
  if (primitiveType.match(/^string|integer|array|object|boolean|number$/g)) {
    if (primitiveType.indexOf('integer') === 0) {
      primitiveType = "number";
    }
    return eval(primitiveType.charAt(0).toUpperCase() + primitiveType.substr(1));
  }
};

var mapComplexTypes = function(value, strType) {
  var tmp = null;
  var type = strType || value['type'];
  switch(type) {
    case 'array':
      tmp = [];
      if(value['items']['$ref'] != null) {
        tmp.push({
          type: Schema.ObjectId,
          ref: value['items']['$ref']
        });
      } else {
        var originalType = value['items']['type'];
        value['items']['type'] = mapPrimitiveTypes(value['items']['type']);
        tmp.push(mapComplexTypes(value['items'], originalType));
      }
      break;
    case 'object':
      tmp = {};
      var props = value['properties'];
      _.each(props, function(data, k) {
        if(data['$ref'] != null) {
          tmp[k] = {
            type: Schema.ObjectId,
            ref: data['$ref']
          };
        } else {
          tmp[k] = mapPrimitiveTypes(data['type'])
        }
      });
      break;
    default:
      tmp = value;
      tmp['type'] = mapPrimitiveTypes(type);
      break;
  }
  return tmp
};

/**
*
* @param data
* @returns {{}}
*/
var mapSchema = function(data){

  var tmp = null;
  var mongooseSchema = {};

  _.each(data, function (value, key) {

    if(value['$ref'] != null) {
      tmp = {
        type: Schema.ObjectId,
        ref: value['$ref']
      }
    }else {
      tmp = mapComplexTypes(value);
    }

    mongooseSchema[key] = tmp;

  });
  return mongooseSchema;
};


/**
*
* @param schemaObject a json schema object
* @return a mongoose schema of a given json schema
*/

var mongoosify = function (schemaObject) {

  validateSchema(schemaObject);

  var data = schemaObject["properties"];

  var schema = mapSchema(data);

  return schema;
};

module.exports = mongoosify;
