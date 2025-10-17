import React from 'react'

// You can add or customize components used inside MDX here
// Example: custom link, code blocks, etc.
const A = (props) => <a {...props} className={(props.className || '') + ' underline text-blue-600 hover:text-blue-800'} />

const Pre = (props) => (
  <pre {...props} className={(props.className || '') + ' overflow-auto rounded-md bg-gray-900 text-gray-100 p-4'} />
)

const Code = (props) => <code {...props} className={(props.className || '') + ' font-mono'} />

const components = {
  a: A,
  pre: Pre,
  code: Code,
}

export default components
