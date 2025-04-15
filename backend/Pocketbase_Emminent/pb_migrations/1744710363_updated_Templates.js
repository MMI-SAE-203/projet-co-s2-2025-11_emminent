/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2314344885")

  // remove field
  collection.fields.removeById("text89829696")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2314344885")

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text89829696",
    "max": 0,
    "min": 0,
    "name": "auteur",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
