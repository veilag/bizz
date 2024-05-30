import {SandpackCodeEditor, useActiveCode, useSandpack} from "@codesandbox/sandpack-react";
import {useEffect} from "react";
import {python} from "@codemirror/lang-python"

const Editor = () => {
  const { sandpack } = useSandpack();
  const { files, activeFile, deleteFile } = sandpack;

  const {code, updateCode} = useActiveCode()

  useEffect(() => {
    console.log(activeFile)
    console.log(code)
    console.log(files)
  }, [code]);



  return (
    <SandpackCodeEditor
      className="w-[400px]"
      additionalLanguages={[
        {
          name: "python",
          extensions: ["py"],
          language: python()
        }
      ]}
    />
  )
}

export default Editor