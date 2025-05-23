/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_758807388")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number1237995133",
    "max": null,
    "min": null,
    "name": "likes",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_758807388")

  // remove field
  collection.fields.removeById("number1237995133")

  return app.save(collection)
})
