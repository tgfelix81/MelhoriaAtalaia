import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Download, Upload, FileText, FileSpreadsheet, FileUp } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function DataManagement() {
  const { toast } = useToast()
  const [isDragOver, setIsDragOver] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleExportPDF = () => {
    toast({
      title: 'Preparando PDF',
      description: 'Abra a janela de impressão para salvar o relatório.',
    })
    setTimeout(() => {
      window.print()
    }, 1000)
  }

  const handleExportExcel = () => {
    toast({
      title: 'Exportando Excel',
      description: 'A planilha com os dados brutos filtrados está sendo gerada.',
    })
  }

  const handleDownloadTemplate = () => {
    toast({
      title: 'Template Baixado',
      description: 'O arquivo template_importacao.xlsx foi baixado com sucesso.',
    })
  }

  const simulateUpload = () => {
    toast({
      title: 'Arquivo Recebido',
      description: 'Validando estrutura do arquivo...',
    })
    setTimeout(() => {
      toast({
        title: 'Importação Concluída',
        description: 'Os dados foram validados e importados com sucesso.',
      })
      setIsOpen(false)
    }, 1500)
  }

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    simulateUpload()
  }

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
      <Button variant="outline" size="sm" onClick={handleExportPDF} className="shrink-0">
        <FileText className="w-4 h-4 mr-2" />
        Exportar PDF
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportExcel} className="shrink-0">
        <FileSpreadsheet className="w-4 h-4 mr-2" />
        Exportar Excel
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm" className="shrink-0">
            <Upload className="w-4 h-4 mr-2" />
            Importar Dados
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Importar Dados de Alunos</DialogTitle>
            <DialogDescription>
              Faça o upload do arquivo Excel contendo as notas e informações atualizadas dos alunos.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-start my-2">
            <Button variant="secondary" size="sm" onClick={handleDownloadTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Baixar Template Excel
            </Button>
          </div>

          <div
            className={`mt-2 border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:bg-slate-50'}`}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragOver(true)
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => {
                if (e.target.files?.length) {
                  simulateUpload()
                }
              }}
            />
            <FileUp className="w-10 h-10 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-1">Arraste e solte o arquivo aqui</h3>
            <p className="text-sm text-muted-foreground mb-4">
              ou clique para selecionar um arquivo do seu computador
            </p>
            <Button variant="outline" size="sm" className="pointer-events-none">
              Selecionar Arquivo
            </Button>
          </div>

          <div className="text-xs text-muted-foreground mt-4 bg-slate-50 p-3 rounded-md border">
            <p className="font-semibold mb-2 text-slate-700">Colunas obrigatórias no template:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Nome do Aluno</li>
              <li>UETE</li>
              <li>Disciplina</li>
              <li>Nota TFM (Flexão, Abdominal, Barra, Corrida)</li>
              <li>Nota Acadêmica</li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
