import './App.css'
import {
  Sandpack,
  SandpackFileExplorer,
  SandpackFiles,
  SandpackLayout,
  SandpackProvider
} from "@codesandbox/sandpack-react";
import Editor from "./components/Editor.tsx";

const code = `
#t
print("hello world")
#tend
#c
print("oaoa")
#cend
`

function App() {
  const files: SandpackFiles = {
    "/handlers.py": {
      code: code.match(/#t([\s\S]*?)#tend/)[1].trim()
    },
    "/template.py": {
      code: code.match(/#c([\s\S]*?)#cend/)[1].trim()
    }
  }

  return (
    <div className="h-full w-full flex justify-center items-center">
      <Sandpack
        options={{
          editorHeight: "100vh"
        }}
      />
      <SandpackProvider
        theme="dark"
        options={{
        }}
        files={files}
      >
        <SandpackLayout
          className="h-[500px] w-[500px]"
        >
          <Editor />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  )
}

export default App
