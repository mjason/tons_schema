const lisa = require('@listenai/lisa_core')
const TOML = require('@ltd/j-toml')
const { pinyin } = require('pinyin-pro')

function transport(ttsArray) {
  var schema = []
  for(let tts of ttsArray) {
    const key = pinyin(tts.text, {pattern: 'initial', type: 'array'}).join("").toUpperCase()
    schema.push(`#define TTS_${key} ${tts.id} //${tts.text}`)
  }
  return schema
}

async function runner(application) {
  const tonsPath = application.getContextFromPackageName("tons_schema").tonsPath
  const output = application.getContextFromPackageName("tons_schema").outputPath
  var schema = []
  for (let tons of tonsPath) {
    const data = await fs.readFile(tons)
    const toml = TOML.parse(data, 1.0, "\n", useBigInt=false)
    if (toml.tones) {
      const tts = toml.tones.tts
      schema.push(...transport(tts))
    } else if (toml.tts) {
      const tts = toml.tts
      schema.push(...transport(tts))
    }
  }
  await fs.writeFile(output, schema.join("\n"))
}

module.exports = ({job, fs, application, ...core} = lisa) => {
  job('tons_schema:gen', {
    title: '生成C语言的资源描述文件',
    task: async () => {
      await runner(application)
    },
  })
}

