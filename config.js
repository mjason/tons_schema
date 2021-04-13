const lisa = require('@listenai/lisa_core')
const path = require('path')

module.exports = ({application, fs, ...core} = lisa) => {
  application.configuration(config => {
    config.task_path = path.join(__dirname, './task.js')
    config.addContext('tons_schema', {
       outputPath: fs.project.join("app", "schema.c"),
       tonsPath: [
         fs.project.join("config", "interact.lini"),
         fs.project.join("config", "tones.lini")
       ]
    })
  })
}
