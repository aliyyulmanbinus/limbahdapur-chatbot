"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Leaf,
  ChefHat,
  Recycle,
  Lightbulb,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatBotProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Halo! Saya asisten AI Chatbot Limbah Dapur. Saya siap membantu Anda mengurangi limbah dapur, memberikan resep dari bahan sisa, dan tips komposting. Ada yang bisa saya bantu?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showTopicButtons, setShowTopicButtons] = useState<string | null>(null)

  // Voice features state
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const [listeningTimeout, setListeningTimeout] = useState<NodeJS.Timeout | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  const quickActions = [
    { icon: <ChefHat className="w-4 h-4" />, text: "Resep dari sisa makanan", action: "recipe" },
    { icon: <Recycle className="w-4 h-4" />, text: "Tips komposting", action: "composting" },
    { icon: <Lightbulb className="w-4 h-4" />, text: "Cara mengurangi limbah", action: "reduce" },
    { icon: <Leaf className="w-4 h-4" />, text: "Penyimpanan makanan", action: "storage" },
  ]

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check for speech recognition support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        setSpeechSupported(true)
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "id-ID"
        recognitionRef.current.maxAlternatives = 1

        recognitionRef.current.onstart = () => {
          setIsListening(true)
          setVoiceError(null)

          // Set timeout for listening (10 seconds)
          const timeout = setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.stop()
            }
          }, 10000)
          setListeningTimeout(timeout)
        }

        recognitionRef.current.onresult = (event: any) => {
          if (event.results && event.results.length > 0) {
            const transcript = event.results[0][0].transcript
            if (transcript.trim()) {
              setInputMessage(transcript)
              setVoiceError(null)
            }
          }
          setIsListening(false)
          if (listeningTimeout) {
            clearTimeout(listeningTimeout)
            setListeningTimeout(null)
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)

          if (listeningTimeout) {
            clearTimeout(listeningTimeout)
            setListeningTimeout(null)
          }

          // Handle different error types
          switch (event.error) {
            case "no-speech":
              setVoiceError("Tidak ada suara yang terdeteksi. Coba lagi.")
              break
            case "audio-capture":
              setVoiceError("Mikrofon tidak dapat diakses. Periksa izin mikrofon.")
              break
            case "not-allowed":
              setVoiceError("Akses mikrofon ditolak. Izinkan akses mikrofon di browser.")
              break
            case "network":
              setVoiceError("Koneksi internet bermasalah. Coba lagi.")
              break
            case "aborted":
              setVoiceError("Pengenalan suara dibatalkan.")
              break
            default:
              setVoiceError("Terjadi kesalahan pada pengenalan suara. Coba lagi.")
          }

          // Clear error after 5 seconds
          setTimeout(() => {
            setVoiceError(null)
          }, 5000)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
          if (listeningTimeout) {
            clearTimeout(listeningTimeout)
            setListeningTimeout(null)
          }
        }
      }

      // Check for speech synthesis support
      if ("speechSynthesis" in window) {
        synthRef.current = window.speechSynthesis
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
      if (listeningTimeout) {
        clearTimeout(listeningTimeout)
      }
    }
  }, [listeningTimeout])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Speech-to-text function
  const startListening = async () => {
    if (!recognitionRef.current || !speechSupported) return

    try {
      // Request microphone permission first
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true })
      }

      // Stop any ongoing recognition
      if (isListening) {
        recognitionRef.current.stop()
        return
      }

      setVoiceError(null)
      recognitionRef.current.start()
    } catch (error) {
      console.error("Error accessing microphone:", error)
      setVoiceError("Tidak dapat mengakses mikrofon. Periksa izin browser.")
      setTimeout(() => setVoiceError(null), 5000)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
    if (listeningTimeout) {
      clearTimeout(listeningTimeout)
      setListeningTimeout(null)
    }
  }

  // Text-to-speech function
  const speakText = (text: string) => {
    if (synthRef.current && voiceEnabled) {
      // Cancel any ongoing speech
      synthRef.current.cancel()

      // Clean text for better speech
      const cleanText = text
        .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markdown
        .replace(/🥘|🌱|💡|📦|🥬|🍎|🍚|📝|🔄|♻️|❌|🍳/g, "") // Remove emojis
        .replace(/\n/g, ". ") // Replace newlines with periods
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .trim()

      if (!cleanText) return

      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.lang = "id-ID"
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onstart = () => {
        setIsSpeaking(true)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
      }

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event)
        setIsSpeaking(false)
      }

      synthRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const generateBotResponse = (userMessage: string): { text: string; showTopicButtons?: boolean } => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("resep") || lowerMessage.includes("masak")) {
      return {
        text: `Tentu! Untuk membuat resep dari bahan sisa, coba ini:

🥘 **Tumis Sisa Sayuran:**
- Panaskan minyak, tumis bawang putih
- Masukkan sayuran sisa (wortel, brokoli, dll)
- Tambahkan kecap, garam, merica
- Sajikan dengan nasi

💡 **Tips:** Simpan sisa sayuran dalam freezer untuk stok tumisan minggu depan!

Ada bahan sisa spesifik yang ingin dijadikan resep?`,
      }
    }

    if (lowerMessage.includes("kompos") || lowerMessage.includes("pupuk")) {
      return {
        text: `Komposting di rumah sangat mudah! Berikut panduannya:

🌱 **Bahan yang Bisa Dikompos:**
- Sisa sayuran dan buah
- Kulit telur
- Ampas kopi
- Daun kering

❌ **Hindari:**
- Daging dan tulang
- Produk susu
- Minyak berlebihan

📦 **Cara Mudah:**
1. Siapkan wadah berlubang
2. Campur bahan hijau (sisa makanan) dengan bahan coklat (daun kering)
3. Aduk seminggu sekali
4. Dalam 2-3 bulan jadi kompos!

Butuh tips lebih detail?`,
      }
    }

    if (lowerMessage.includes("simpan") || lowerMessage.includes("awet")) {
      return {
        text: `Tips penyimpanan makanan agar tahan lama:

🥬 **Sayuran:**
- Cuci bersih, keringkan, simpan di kulkas
- Gunakan paper towel untuk menyerap kelembaban
- Pisahkan buah yang cepat matang

🍎 **Buah:**
- Simpan pisang terpisah (gas etilen)
- Buah tropis di suhu ruang
- Buah lain di kulkas

🍚 **Sisa Masakan:**
- Dinginkan dulu sebelum masuk kulkas
- Gunakan wadah kedap udara
- Konsumsi dalam 2-3 hari

Ada jenis makanan spesifik yang ingin ditanyakan?`,
      }
    }

    if (lowerMessage.includes("limbah") || lowerMessage.includes("kurangi")) {
      return {
        text: `Strategi mengurangi limbah dapur:

📝 **Perencanaan:**
- Buat menu mingguan
- Daftar belanja yang tepat
- Beli sesuai kebutuhan

🔄 **Manfaatkan Sisa:**
- Kulit sayuran untuk kaldu
- Sisa nasi jadi nasi goreng
- Buah terlalu matang untuk smoothie

♻️ **Daur Ulang:**
- Wadah bekas untuk penyimpanan
- Botol kaca untuk bumbu
- Kompos dari sisa organik

Mau tips spesifik untuk jenis limbah tertentu?`,
      }
    }

    return {
      text: `Terima kasih atas pertanyaannya! Saya bisa membantu dengan:

🍳 **Resep dari bahan sisa** - Ubah sisa makanan jadi hidangan lezat
🌱 **Tips komposting** - Buat pupuk dari limbah organik  
💡 **Cara mengurangi limbah** - Strategi zero waste praktis
📦 **Penyimpanan makanan** - Agar makanan tahan lebih lama

Silakan pilih topik yang ingin dibahas atau tanyakan hal spesifik!`,
      showTopicButtons: true,
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateBotResponse(inputMessage)
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])
      setShowTopicButtons(response.showTopicButtons ? botResponse.id : null)
      setIsTyping(false)

      // Auto-speak bot response if voice is enabled
      if (voiceEnabled) {
        setTimeout(() => {
          speakText(response.text)
        }, 500)
      }
    }, 1500)
  }

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      recipe: "Bagaimana cara membuat resep dari sisa makanan?",
      composting: "Bagaimana cara membuat kompos di rumah?",
      reduce: "Tips untuk mengurangi limbah dapur?",
      storage: "Cara menyimpan makanan agar tahan lama?",
    }

    setInputMessage(actionMessages[action as keyof typeof actionMessages] || "")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => onClose()}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-2rem)]"
          >
            <Card className="h-full flex flex-col shadow-2xl border-0 overflow-hidden">
              {/* Header */}
              <div className="bg-green-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500 p-2 rounded-full">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Assistant</h3>
                    <p className="text-green-100 text-sm">Chatbot Limbah Dapur</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Voice Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setVoiceEnabled(!voiceEnabled)
                      if (isSpeaking) stopSpeaking()
                    }}
                    className="text-white hover:bg-green-500 p-2"
                    title={voiceEnabled ? "Matikan suara" : "Nyalakan suara"}
                  >
                    {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-green-500 p-2">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-3 bg-gray-50 border-b">
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action.action)}
                      className="text-xs p-2 h-auto flex items-center justify-start space-x-1 hover:bg-green-50 hover:border-green-300"
                    >
                      {action.icon}
                      <span className="truncate">{action.text}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Voice Error Display */}
              {voiceError && (
                <div className="p-3 bg-red-50 border-b border-red-200">
                  <div className="flex items-center space-x-2 text-red-700">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{voiceError}</span>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${
                        message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <div
                        className={`p-2 rounded-full ${
                          message.sender === "user" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {message.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div
                        className={`p-3 rounded-2xl ${
                          message.sender === "user"
                            ? "bg-green-600 text-white rounded-br-md"
                            : "bg-gray-100 text-gray-800 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className={`text-xs ${message.sender === "user" ? "text-green-100" : "text-gray-500"}`}>
                            {message.timestamp.toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {message.sender === "bot" && voiceEnabled && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => speakText(message.text)}
                              className="p-1 h-auto hover:bg-gray-200"
                              title="Dengarkan pesan"
                            >
                              <Volume2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {showTopicButtons && messages[messages.length - 1]?.id === showTopicButtons && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start mb-4"
                  >
                    <div className="flex items-start space-x-2 max-w-[90%]">
                      <div className="p-2 rounded-full bg-gray-200 text-gray-600">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col w-full gap-2">
                        {quickActions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              handleQuickAction(action.action)
                              setShowTopicButtons(null)
                            }}
                            className="text-xs p-2 h-auto w-full flex items-center justify-start space-x-2 hover:bg-green-50 hover:border-green-300"
                          >
                            {action.icon}
                            <span className="text-left">{action.text}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-2">
                      <div className="p-2 rounded-full bg-gray-200 text-gray-600">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-md">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Speaking Indicator */}
                {isSpeaking && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-2">
                      <div className="p-2 rounded-full bg-green-200 text-green-600">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div className="bg-green-50 p-3 rounded-2xl rounded-bl-md border border-green-200">
                        <p className="text-sm text-green-700">🔊 Sedang berbicara...</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={stopSpeaking}
                          className="text-xs mt-1 p-1 h-auto text-green-600 hover:bg-green-100"
                        >
                          Hentikan
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isListening ? "Mendengarkan..." : "Ketik pesan atau gunakan suara..."}
                    className="flex-1 rounded-full border-gray-300 focus:border-green-500 focus:ring-green-500"
                    disabled={isTyping || isListening}
                  />

                  {/* Voice Input Button */}
                  {speechSupported && (
                    <Button
                      onClick={startListening}
                      disabled={isTyping}
                      className={`rounded-full p-3 ${
                        isListening ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-blue-600 hover:bg-blue-700"
                      } text-white`}
                      title={isListening ? "Sedang mendengarkan..." : "Mulai rekaman suara"}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                  )}

                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Voice Status */}
                <div className="mt-2 text-xs text-center">
                  {isListening && (
                    <div className="text-blue-600 flex items-center justify-center space-x-1">
                      <Mic className="w-3 h-3" />
                      <span>🎤 Mendengarkan... Silakan berbicara (10 detik)</span>
                    </div>
                  )}
                  {!speechSupported && <div className="text-gray-500">Voice chat tidak didukung di browser ini</div>}
                  {speechSupported && !isListening && (
                    <div className="text-gray-500">Klik mikrofon untuk menggunakan voice input</div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
