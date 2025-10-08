import { replaceInFile } from 'replace-in-file'

const platformJsPatchOptions = {
  files: './proto/generated/*',
  from: /"\.\/platform"/g,
  to: '"./platform.js"'
}

const protobufWrapperOptions = {
  files: './proto/generated/*',
  from: /"\.\/google\/protobuf\/wrappers"/g,
  to: '"./google/protobuf/wrappers.js"'
}
try {
  await replaceInFile(platformJsPatchOptions)
  await replaceInFile(protobufWrapperOptions)
} catch (error) {
  console.error('Error during patching:', error)
}
