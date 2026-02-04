"use client";

import React, { useState, useRef } from "react";
import { 
  FileUp, FileText, Upload, X, Plus, 
  CheckCircle2, FileSpreadsheet, Trash2, Loader2, RefreshCcw
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// --- CONFIGURACIÓN DE TEXTOS UNIFICADA ---
const TABS_CONFIG = {
  documentos: {
    label: "CARGA DE DOCUMENTOS",
    dropText: "Arrastra tus documentos aquí",
    formats: "Formatos: .txt, .xlsx, .csv"
  },
  citas: {
    label: "CARGA DE CITAS",
    dropText: "Arrastra tus citas aquí",
    formats: "Formatos: .txt, .xlsx, .csv"
  }
};

export function UploadManagerContent() {
  const [activeTab, setActiveTab] = useState<"documentos" | "citas">("documentos");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const newFiles = Array.from(selectedFiles);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelection(e.dataTransfer.files);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as any);
    setFiles([]);
    setShowSuccess(false);
  };

  const handleProcessFiles = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setShowSuccess(true);
      setFiles([]);
    }, 2000);
  };

  const resetUpload = () => {
    setShowSuccess(false);
    setFiles([]);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex-1 flex justify-center items-start pt-12 p-4 animate-in fade-in zoom-in-95 duration-500 h-full overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_15px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden mb-10">
        <div className="p-8">
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="text-center mb-6">
                <h3 className="text-xl font-black text-[#1e2b58] uppercase  tracking-tighter">
                    {TABS_CONFIG[activeTab].label}
                </h3>
            </div>

            <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100/50 p-1 rounded-2xl h-11 max-w-md mx-auto">
              <TabsTrigger 
                value="documentos" 
                className="rounded-xl font-black uppercase text-[9px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-[#ff6b00] data-[state=active]:shadow-sm transition-all"
              >
                Carga Documentos
              </TabsTrigger>
              <TabsTrigger 
                value="citas" 
                className="rounded-xl font-black uppercase text-[9px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-[#ff6b00] data-[state=active]:shadow-sm transition-all"
              >
                Citas Fijas
              </TabsTrigger>
            </TabsList>

            <div className="min-h-[280px] flex flex-col items-center justify-center relative">
              
              {showSuccess ? (
                <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-black text-[#1e2b58] uppercase ">¡Carga Exitosa!</h4>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Los archivos han sido procesados correctamente.</p>
                  </div>
                  <Button 
                    onClick={resetUpload}
                    variant="outline"
                    className="mt-4 rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest h-10"
                  >
                    <RefreshCcw size={14} className="mr-2" /> Nueva Carga
                  </Button>
                </div>
              ) : (
                <>
                  {files.length === 0 ? (
                    <div 
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={onDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "w-full h-56 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group",
                        isDragging ? "border-[#ff6b00] bg-orange-50/50" : "border-slate-200 bg-slate-50/30 hover:bg-slate-50 hover:border-[#ff6b00]/40"
                      )}
                    >
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FileUp className="w-7 h-7 text-[#4CCAC8]" />
                      </div>
                      <div className="text-center">
                        <h4 className="text-sm font-black text-[#1e2b58] uppercase tracking-tight">
                            {TABS_CONFIG[activeTab].dropText}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
                            {TABS_CONFIG[activeTab].formats}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full space-y-4 max-w-md mx-auto animate-in fade-in">
                      <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto px-2 custom-scrollbar">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm group hover:border-orange-200 transition-all">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center text-[#ff6b00]">
                                {file.name.match(/\.(xlsx|xls|csv)$/) ? <FileSpreadsheet size={18} /> : <FileText size={18} />}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[11px] font-black text-[#1e2b58] truncate max-w-[180px]">{file.name}</span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase">{formatSize(file.size)}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => removeFile(index)}
                              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-center">
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 text-[9px] font-black text-[#ff6b00] uppercase tracking-[0.15em] hover:bg-orange-50 px-4 py-2 rounded-full transition-all"
                        >
                          <Plus size={14} strokeWidth={3} /> Adjuntar más archivos
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              multiple 
              accept=".txt,.xlsx,.xls,.csv" 
              className="hidden" 
              onChange={(e) => handleFileSelection(e.target.files)}
            />

            {/* Footer de Acciones */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-50">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">YMS Processor v2.0</span>
                {files.length > 0 && !showSuccess && (
                  <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1 mt-1 uppercase">
                    <CheckCircle2 size={12} /> {files.length} archivo(s) listo(s)
                  </span>
                )}
              </div>
              
              {!showSuccess && (
                <Button 
                  onClick={handleProcessFiles}
                  disabled={files.length === 0 || isUploading}
                  className={cn(
                    "h-12 px-10 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all duration-300 shadow-lg",
                    files.length > 0 
                      ? "bg-[#ff6b00] hover:bg-[#e66000] text-white shadow-orange-200 active:scale-95" 
                      : "bg-slate-100 text-slate-300 border-none cursor-not-allowed shadow-none"
                  )}
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={16} className="mr-3 animate-spin" /> Cargando...
                    </>
                  ) : (
                    <>
                      <Upload size={16} className="mr-3" /> CARGAR DOCUMENTOS
                    </>
                  )}
                </Button>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}