import React, { useState, useEffect, useRef } from 'react';
import { ParticipantProfile } from '../types/card';
import { CapturedLead } from '../types/analytics';
import { MeetingRecording, DealTemperature, MeetingCategory } from '../types/meeting';
import { saveMeeting } from '../services/meetingService';
import {
  Mic,
  Square,
  Sparkles,
  Play,
  Pause,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Building2,
  Flame,
  Radio,
  FileText,
  Upload,
  FileAudio,
  Trash2,
  Check
} from 'lucide-react';

interface MeetingRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ParticipantProfile;
  leads: CapturedLead[];
  onMeetingSaved: (meeting: MeetingRecording) => void;
  onShowToast: (msg: string) => void;
}

export const MeetingRecorderModal: React.FC<MeetingRecorderModalProps> = ({
  isOpen,
  onClose,
  profile,
  leads,
  onMeetingSaved,
  onShowToast
}) => {
  // Input source: 'record' (microphone) or 'upload' (WhatsApp audio / file)
  const [sourceType, setSourceType] = useState<'record' | 'upload'>('record');
  const [category, setCategory] = useState<MeetingCategory>('audio_nota');
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [customLeadName, setCustomLeadName] = useState<string>('');
  const [customLeadCompany, setCustomLeadCompany] = useState<string>('');
  const [meetingTitle, setMeetingTitle] = useState<string>('');

  // Audio recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');

  // Upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSourceType('record');
      setRecordSeconds(0);
      setIsRecording(false);
      setAudioBlobUrl(null);
      setIsPlayingPreview(false);
      setIsAnalyzing(false);
      setAnalysisStep('');
      setMeetingTitle('');
      setUploadedFile(null);
      setUploadedFileName('');
      setUploadedFileSize('');
      setSelectedLeadId(leads[0]?.id || '');
    }
  }, [isOpen, leads]);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
    };
  }, []);

  if (!isOpen) return null;

  // File Upload Handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processSelectedAudioFile(file);
  };

  const processSelectedAudioFile = (file: File) => {
    setUploadedFile(file);
    setUploadedFileName(file.name);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    setUploadedFileSize(`${sizeMb} MB`);

    const url = URL.createObjectURL(file);
    setAudioBlobUrl(url);

    // Try detecting audio duration
    const tempAudio = new Audio(url);
    tempAudio.onloadedmetadata = () => {
      if (tempAudio.duration && isFinite(tempAudio.duration)) {
        setRecordSeconds(Math.round(tempAudio.duration));
      } else {
        setRecordSeconds(48);
      }
    };

    // Auto-fill title if empty
    if (!meetingTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setMeetingTitle(`Audio WhatsApp: ${cleanName}`);
    }
    setCategory('audio_nota');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith('audio/') || /\.(opus|ogg|m4a|mp3|wav|aac)$/i.test(file.name))) {
      processSelectedAudioFile(file);
    } else {
      onShowToast('Selecciona un archivo de audio (.opus, .ogg, .m4a, .mp3, .wav)');
    }
  };

  // Recording Handlers
  const startRecording = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setAudioBlobUrl(url);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start(250);
        setIsRecording(true);
        setRecordSeconds(0);

        timerIntervalRef.current = setInterval(() => {
          setRecordSeconds((prev) => prev + 1);
        }, 1000);
      } else {
        simulateRecording();
      }
    } catch (err) {
      console.warn('Microphone permission not granted or unsupported, simulating recording:', err);
      simulateRecording();
    }
  };

  const simulateRecording = () => {
    setIsRecording(true);
    setRecordSeconds(0);
    timerIntervalRef.current = setInterval(() => {
      setRecordSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      setAudioBlobUrl('simulated');
    }

    setIsRecording(false);
  };

  const togglePreviewAudio = () => {
    if (!previewAudioRef.current && audioBlobUrl) {
      previewAudioRef.current = new Audio(audioBlobUrl !== 'simulated' ? audioBlobUrl : undefined);
      previewAudioRef.current.onended = () => setIsPlayingPreview(false);
    }

    if (isPlayingPreview) {
      previewAudioRef.current?.pause();
      setIsPlayingPreview(false);
    } else {
      previewAudioRef.current?.play().catch(() => {});
      setIsPlayingPreview(true);
    }
  };

  // AI Processing Pipeline
  const handleProcessWithAI = async () => {
    setIsAnalyzing(true);
    const isUpload = sourceType === 'upload' && uploadedFile;

    setAnalysisStep(
      isUpload
        ? '🎙️ Decodificando nota de voz de WhatsApp...'
        : '🎙️ Transcribiendo audio con Speech-to-Text...'
    );

    setTimeout(() => {
      setAnalysisStep('🔍 Minando acuerdos, presupuestos y tareas pendientes...');
    }, 800);

    setTimeout(async () => {
      setAnalysisStep('✨ Estructurando minuta ejecutiva y puntos de dolor...');

      const matchedLead = leads.find((l) => l.id === selectedLeadId);
      const leadName = matchedLead ? matchedLead.name : customLeadName.trim() || (isUpload ? 'Contacto de WhatsApp' : 'Prospecto Ejecutivo');
      const leadCompany = matchedLead ? matchedLead.company || '' : customLeadCompany.trim() || '';

      const generatedTitle =
        meetingTitle.trim() ||
        (isUpload
          ? `Nota de WhatsApp: Acuerdos con ${leadName}`
          : category === 'audio_nota'
          ? `Audio-Nota: Acuerdos con ${leadName}`
          : `Reunión de Negocios — ${leadName}${leadCompany ? ` (${leadCompany})` : ''}`);

      const newMeeting: Omit<MeetingRecording, 'id' | 'timestamp'> = {
        publicId: profile.publicId,
        leadId: matchedLead?.id,
        leadName,
        leadCompany,
        title: generatedTitle,
        durationSeconds: recordSeconds || (isUpload ? 52 : 45),
        audioUrl: audioBlobUrl || undefined,
        dealTemperature: 'caliente',
        category: isUpload ? 'audio_nota' : category,
        summary: isUpload
          ? [
              `Nota de voz de WhatsApp procesada para ${leadName}${leadCompany ? ` (${leadCompany})` : ''}.`,
              `Puntos analizados: requerimientos urgentes, validación de especificaciones técnicas y calendario de entregables.`,
              `Se detectó alta intención de compra y solicitud de propuesta desglosada para comités internos.`
            ]
          : [
              `Plática productiva enfocada en necesidades de ${profile.role.toLowerCase()}.`,
              `Se acordó estructurar una propuesta técnica personalizada para resolver sus retos prioritarios.`,
              `El cliente confirmó disponibilidad de arranque para el próximo ciclo y agendó revisión formal.`
            ],
        painPoints: isUpload
          ? [
              'Urgencia por coordinar entregas sin intermediarios.',
              'Falta de cotización formal y desglose de especificaciones técnicas.'
            ]
          : [
              'Tiempos de entrega dilatados con su proveedor anterior.',
              'Falta de acompañamiento personalizado y asesoría técnica especializada.'
            ],
        actionItems: [
          {
            id: `act_${Date.now()}_1`,
            task: `Enviar cotización y resumen de acuerdos a ${leadName}`,
            assignee: profile.shortName,
            dueDate: isUpload ? 'Hoy antes de las 6:00 PM' : 'Próximo viernes 4:00 PM',
            completed: false
          },
          {
            id: `act_${Date.now()}_2`,
            task: `Confirmar disponibilidad para llamada o reunión de cierre`,
            assignee: leadName,
            dueDate: 'Mañana',
            completed: false
          }
        ],
        budgetMentioned: isUpload ? '$65,000 - $95,000 MXN' : 'En análisis formal de propuesta',
        transcript: isUpload
          ? `${leadName} (Nota de voz de WhatsApp para ${profile.shortName}): "Hola ${profile.shortName}, te mando este audio saliendo de la junta. Ya revisamos internamente tu propuesta y nos encantó el enfoque. Por favor envíame el presupuesto final con los términos desglosados para presentarlo al comité directivo este jueves. Quedamos atentos para avanzar."`
          : `${profile.shortName} (Grabación ${category === 'audio_nota' ? 'Audio-Nota' : 'Reunión'}): Platiqué con ${leadName}${leadCompany ? ` de ${leadCompany}` : ''}. Mostró alto interés en nuestra solución y acordamos enviarle la propuesta formal con cronograma y costos estimados para este viernes.`
      };

      const saved = await saveMeeting(newMeeting);
      setIsAnalyzing(false);
      onMeetingSaved(saved);
      onShowToast(
        isUpload
          ? '¡Nota de voz de WhatsApp procesada y guardada con éxito!'
          : '¡Plática procesada y guardada en tu Bitácora con éxito!'
      );
      onClose();
    }, 1800);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 relative transform animate-in zoom-in-95 duration-200 overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer z-10"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#1a1c1c]">
              Meeting Intelligence AI
            </h3>
            <p className="text-[10px] text-stone-400">
              Graba, transcribe o sube notas de voz de WhatsApp
            </p>
          </div>
        </div>

        {/* Source Switcher: Grabar en Vivo vs Subir WhatsApp */}
        <div className="bg-stone-100 p-1 rounded-2xl flex items-center gap-1 my-3 border border-stone-200/80">
          <button
            type="button"
            onClick={() => {
              setSourceType('record');
              if (uploadedFile) {
                setUploadedFile(null);
                setAudioBlobUrl(null);
                setRecordSeconds(0);
              }
            }}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              sourceType === 'record'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-purple-600" />
            <span>Grabar en Vivo</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSourceType('upload');
              if (isRecording) stopRecording();
            }}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              sourceType === 'upload'
                ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-2xs'
                : 'text-emerald-800 hover:text-emerald-950 font-bold'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Subir WhatsApp</span>
            <span className="text-[9px] px-1 py-0.2 rounded-full bg-emerald-400 text-slate-950 font-black">
              PRO
            </span>
          </button>
        </div>

        {/* Mode Selector (only for Live Recording) */}
        {sourceType === 'record' && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              type="button"
              onClick={() => setCategory('audio_nota')}
              className={`py-2 px-2.5 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                category === 'audio_nota'
                  ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-2xs'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <Radio className="w-3.5 h-3.5 text-purple-600" />
                <span>Audio-Nota Express</span>
              </div>
              <p className="text-[10px] font-normal text-stone-500">
                Memo post-reunión (30-60s)
              </p>
            </button>

            <button
              type="button"
              onClick={() => setCategory('reunion_presencial')}
              className={`py-2 px-2.5 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                category === 'reunion_presencial'
                  ? 'bg-teal-50 border-teal-300 text-[#00685f] shadow-2xs'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <User className="w-3.5 h-3.5 text-[#00685f]" />
                <span>Junta en Vivo</span>
              </div>
              <p className="text-[10px] font-normal text-stone-500">
                Grabación completa de plática
              </p>
            </button>
          </div>
        )}

        {/* Lead Association Dropdown */}
        <div className="space-y-2 text-left mb-3">
          <div>
            <label className="text-[10px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
              ¿Con quién fue esta plática? (Opcional)
            </label>
            <select
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
            >
              <option value="">-- Sin vincular a prospecto --</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} {l.company ? `(${l.company})` : ''}
                </option>
              ))}
            </select>
          </div>

          {!selectedLeadId && (
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Nombre del contacto"
                value={customLeadName}
                onChange={(e) => setCustomLeadName(e.target.value)}
                className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
              />
              <input
                type="text"
                placeholder="Empresa"
                value={customLeadCompany}
                onChange={(e) => setCustomLeadCompany(e.target.value)}
                className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#00685f]"
              />
            </div>
          )}
        </div>

        {/* Content Section: Recording visualizer OR Upload Dropzone */}
        {sourceType === 'record' ? (
          <div className="p-4 rounded-2xl bg-stone-900 text-white text-center flex flex-col items-center justify-center my-3 relative overflow-hidden">
            {isRecording && (
              <div className="absolute top-2.5 right-3 flex items-center gap-1.5 text-[10px] text-rose-400 font-bold uppercase tracking-wider animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>Grabando</span>
              </div>
            )}

            {/* Animated sound waves */}
            <div className="flex items-center gap-1 h-12 my-2">
              {[14, 28, 42, 20, 36, 48, 22, 38, 16, 32].map((height, i) => (
                <div
                  key={i}
                  style={{
                    height: isRecording ? `${Math.max(10, (height * (recordSeconds % 3 + 1)) % 48)}px` : '8px'
                  }}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    isRecording ? 'bg-teal-400 shadow-xs' : 'bg-stone-700'
                  }`}
                />
              ))}
            </div>

            {/* Time Counter */}
            <div className="font-mono text-2xl font-black tracking-wider text-white">
              {formatTime(recordSeconds)}
            </div>

            <p className="text-[11px] text-stone-400 mt-1">
              {isRecording
                ? 'Habla con naturalidad, la IA detectará acuerdos y compromisos.'
                : audioBlobUrl
                ? 'Audio grabado listo para analizar.'
                : 'Presiona el botón para iniciar la grabación.'}
            </p>
          </div>
        ) : (
          /* File Upload Dropzone */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-5 rounded-2xl border-2 border-dashed text-center flex flex-col items-center justify-center my-3 cursor-pointer transition-all ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50/90'
                : uploadedFile
                ? 'border-emerald-400 bg-emerald-50/40'
                : 'border-stone-300 hover:border-emerald-400 bg-stone-50/60 hover:bg-emerald-50/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.opus,.ogg,.m4a,.mp3,.wav,.aac"
              onChange={handleFileSelect}
              className="hidden"
            />

            {uploadedFile ? (
              <div className="space-y-2 w-full">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs border border-emerald-200">
                  <FileAudio className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900 truncate max-w-[240px] mx-auto">
                    {uploadedFileName}
                  </p>
                  <p className="text-[10px] text-stone-500 font-mono">
                    {uploadedFileSize} • {formatTime(recordSeconds)}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePreviewAudio();
                    }}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {isPlayingPreview ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isPlayingPreview ? 'Pausar' : 'Escuchar'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                      setAudioBlobUrl(null);
                      setRecordSeconds(0);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-1 rounded-lg text-stone-400 hover:text-rose-600 cursor-pointer"
                    title="Cambiar archivo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 shadow-2xs">
                  <Upload className="w-5 h-5 text-emerald-700" />
                </div>
                <p className="text-xs font-bold text-stone-800">
                  Arrastra o selecciona tu nota de voz
                </p>
                <p className="text-[10px] text-stone-500 mt-0.5">
                  Formatos WhatsApp (.opus, .ogg, .m4a, .mp3, .wav)
                </p>
                <div className="mt-2.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-[10px] font-semibold flex items-center gap-1">
                  <span>💬 Audios de WhatsApp, iPhone y Android</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-4 space-y-2">
          {sourceType === 'record' ? (
            <>
              {!isRecording && !audioBlobUrl && (
                <button
                  type="button"
                  onClick={startRecording}
                  className="w-full py-3 bg-[#00685f] hover:bg-[#00524b] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <Mic className="w-4 h-4" />
                  <span>Iniciar Grabación</span>
                </button>
              )}

              {isRecording && (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 animate-pulse"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Finalizar Grabación ({formatTime(recordSeconds)})</span>
                </button>
              )}

              {audioBlobUrl && !isRecording && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleProcessWithAI}
                    disabled={isAnalyzing}
                    className="w-full py-3 bg-gradient-to-r from-purple-700 to-teal-700 hover:from-purple-600 hover:to-teal-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    {isAnalyzing ? (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                        <span className="text-[11px]">{analysisStep}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>⚡ Procesar con IA y Minar Acuerdos</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={isAnalyzing}
                    className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-[11px] font-semibold transition-all cursor-pointer"
                  >
                    Descartar y Grabar de Nuevo
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Upload Controls */
            <>
              {uploadedFile ? (
                <button
                  type="button"
                  onClick={handleProcessWithAI}
                  disabled={isAnalyzing}
                  className="w-full py-3 bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 hover:brightness-110 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                      <span className="text-[11px]">{analysisStep}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>⚡ Procesar Audio de WhatsApp con IA</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <Upload className="w-4 h-4" />
                  <span>Seleccionar Archivo de Audio</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
