/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_758807388")

  // remove field
  collection.fields.removeById("text2024737484")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "select2024737484",
    "maxSelect": 1,
    "name": "domaine",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "dev",
      "design",
      "comm"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_758807388")

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2024737484",
    "max": 0,
    "min": 0,
    "name": "domaine",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("select2024737484")

  return app.save(collection)
})
