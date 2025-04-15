/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_758807388")

  // update collection data
  unmarshal({
    "name": "prompts"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_758807388")

  // update collection data
  unmarshal({
    "name": "partageprompt"
  }, collection)

  return app.save(collection)
})
