import {Editor, Monaco} from "@monaco-editor/react";
import {editor} from "monaco-editor/esm/vs/editor/editor.api";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {useTheme} from "@/components/theme.tsx";
import NewAssistantForm from "@/components/forms/newAssistant/NewAssistantForm.tsx";
import {z} from "zod";
import assistantSchema from "@/components/forms/newAssistant/schema.ts";
import {addNewAssistant, updateAssistant} from "@/api/assistant.ts";
import {useEffect, useRef, useState} from "react";
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import {selectedAssistantAtom} from "@/atoms/assistant.ts";
import {useAtomValue} from "jotai";
import {Loader} from "react-feather";
import {toast} from "sonner";
import {userAtom} from "@/atoms/user.ts";

const AssistantEditorView = () => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const selectedAssistant = useAtomValue(selectedAssistantAtom)

  const location = useLocation()
  const navigate = useNavigate()

  const theme = useTheme()
  const user = useAtomValue(userAtom)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco
  }

  const handleSubmit = (data: z.infer<typeof assistantSchema>) => {
    if (!editorRef.current) return

    if (location.state.edit) {
      if (!selectedAssistant) return
      setLoading(true)
      updateAssistant(selectedAssistant.id, {
        name: data.name,
        description: data.description,
        username: data.username,
        isDataAccessible: data.isDataAccessible,
        code: editorRef.current.getValue()
      })
        .then(() => {
          setLoading(false)
          toast.success("Ассистент обновлен")
        })
      return
    }

    addNewAssistant({
      name: data.name,
      description: data.description,
      isDataAccessible: data.isDataAccessible,
      username: data.username,
      code: editorRef.current.getValue()
    })
      .then(() => {
        navigate("/assistants")
        toast.success("Ассистент создан")
      })
      .catch(() => toast.error("Ассистент с таким коротким именем уже существует"))
  }

  useEffect(() => {
    monacoRef.current?.editor.setTheme(theme.theme === "light" ? "light" : "vs-dark")
  }, [theme.theme])

  if (location.state?.edit === undefined || !user?.isDeveloper) {
    return (
      <Navigate to="/list" />
    )
  }

  return (
    <ResizablePanelGroup
      autoSaveId="assistants-dashboard"
      direction="horizontal"
      className="w-full h-full"
    >
      <ResizablePanel defaultSize={30}>
        <header className="h-14 text-lg flex justify-between items-center px-4">
          <h2 className="font-semibold">Редактор ассистента</h2>
        </header>
        <Separator/>
        <NewAssistantForm initialAssistant={location.state.edit ? selectedAssistant : undefined} onSubmit={handleSubmit} isLoading={isLoading} />
      </ResizablePanel>

      <ResizableHandle withHandle/>

      <ResizablePanel
        defaultSize={70}
      >
        <header className="h-14 text-lg gap-4 flex items-center px-4">
          <h2 className="font-semibold">Редактор кода</h2>
        </header>
        <Separator />

        <Editor
          height="100vh"
          defaultLanguage="python"
          defaultValue={location.state.edit && selectedAssistant?.code}
          onMount={handleEditorDidMount}
          loading={<div className="flex items-center gap-2">Загрузка <Loader className="w-4 h-4 animate-spin"/></div>}
          options={{
            minimap: {
              enabled: false
            },
            fontFamily: "JetBrains Mono"
          }}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default AssistantEditorView