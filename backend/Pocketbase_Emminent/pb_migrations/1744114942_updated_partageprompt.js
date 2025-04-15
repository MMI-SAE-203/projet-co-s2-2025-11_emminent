/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_758807388")

  // update field
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
      "Dev",
      "Design",
      "Comm"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_758807388")

  // update field
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
})
