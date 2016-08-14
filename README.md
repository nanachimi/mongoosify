# Mongoosify #

Mongoosify is a Javascript library to parse a [JSON Schema](http://www.json-schema.org) into a [Mongoose Schema](http://spacetelescope.github.io/understanding-json-schema/reference/index.html).

### Installation ###

npm install mongoosify --save

### Usage ###

Let suppose the JSON object is saved as ```jschema.json```

```json
{
  "type":"object",
  "properties":{
    "address":{
      "type":"object",
      "properties":{
        "street":{"type":"string"},
        "house":{"type":"string"},
        "city":{"type":"string"}
      }
    },
    "firstName":{"type":"string"},
    "lastName":{"type":"string"},
    "title":{
      "type":"string",
      "enum":["Dr","Prof.","Ph.D."]
    },
    "email":{
      "type":"array",
      "items":{"type":"string"}
    },
    "age":{"type": "integer"}
  }
}
```

The following code demonstrate how to parse a JSON schema from the ```jschema.json``` file into a mongoose schema (I called it mongoosify :D)

```Javascript
var mongoosify = require("mongoosify");
var mongoose = require("mongoose");
var myJsonSchemaFile = require("./jschema.json");

var mySchema= mongoosify(myJsonSchemaFile);

var Schema = mongoose.Schema;
var mongooseSchema = new Schema(mySchema);

//now you are ready to go...
```

### How to run tests ###
```Shell
$ npm test
```
### Important notes ###

Mongoosify will always try to cast type implicitly if a schema and the data don't have a same type. If a casting is not possible (e.g. "Hallo" can not be cast into a number but "10" can be) and CastError will be throw by Mongoose.


### Current task in progress ###

Unit tests for the actual code


### Planned features ###

1. Enable  [reusability](http://spacetelescope.github.io/understanding-json-schema/structuring.html#reuse) with keywords ``` $ref ```, ``` $schema``` and ```id```.
2. Evaluation of the following constraints:
    - schema keywords:
        * ```additionalProperties```
        * ```required```
    - array keywords:
        * ```minItems```
        * ```maxItem```
        * ```uniqueItems```
    - numeric types keywords:
        * ```minimum```
        * ```maximum```
        * ```multipleOf```
    - string keyword:
        * ```format```

### You can contribute! ###

Want to contributor? Just need a pull request! I look forward to have as contributor on board!
