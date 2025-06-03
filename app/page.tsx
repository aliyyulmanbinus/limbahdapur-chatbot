"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Leaf,
  Recycle,
  ChefHat,
  Lightbulb,
  MessageCircle,
  ArrowRight,
  Trash2,
  Heart,
  Users,
  Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ChatBot from "@/components/chat-bot"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [ingredients, setIngredients] = useState("")
  const [generatedRecipe, setGeneratedRecipe] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateRecipe = async () => {
    if (!ingredients.trim()) return

    setIsGenerating(true)
    // Simulasi AI response - dalam implementasi nyata, gunakan AI SDK
    setTimeout(() => {
      setGeneratedRecipe(`Resep Kreatif dari ${ingredients}:

1. Tumis bahan-bahan dengan bawang putih dan jahe
2. Tambahkan bumbu sesuai selera (garam, merica, kecap)
3. Masak hingga matang dan sajikan dengan nasi
4. Hiasi dengan daun bawang atau seledri

Tips: Simpan sisa masakan dalam wadah kedap udara di kulkas untuk dikonsumsi keesokan harinya!`)
      setIsGenerating(false)
    }, 2000)
  }

  const wasteReductionTips = [
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      title: "Perencanaan Menu",
      description:
        "Rencanakan menu mingguan dan buat daftar belanja yang tepat untuk menghindari pembelian berlebihan.",
    },
    {
      icon: <Recycle className="w-8 h-8 text-green-600" />,
      title: "Komposting Rumah",
      description: "Ubah sisa sayuran dan buah menjadi kompos berkualitas untuk tanaman di rumah Anda.",
    },
    {
      icon: <ChefHat className="w-8 h-8 text-green-600" />,
      title: "Resep Sisa Makanan",
      description: "Kreasikan sisa makanan menjadi hidangan baru yang lezat dan bergizi.",
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-green-600" />,
      title: "Penyimpanan Cerdas",
      description: "Pelajari cara menyimpan makanan dengan benar agar tahan lebih lama dan tidak mudah busuk.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                >
                  <Leaf className="w-4 h-4 mr-2" />
                  Chatbot Limbah Dapur
                </motion.div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Kelola Limbah Dapur
                  <span className="text-green-600 block">Dengan Cerdas</span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Bergabunglah dengan gerakan zero waste dan pelajari cara mengurangi limbah dapur sambil menciptakan
                  hidangan lezat dari bahan sisa makanan.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full"
                  onClick={() => setIsChatOpen(true)}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Mulai Bicara dengan Asisten AI
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-full"
                >
                  Pelajari Tips
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  10,000+ Pengguna
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  Ramah Lingkungan
                </div>
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  Efektif & Praktis
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8">
                <img
                  src="/placeholder.svg?height=400&width=500"
                  alt="Chatbot Limbah Dapur Illustration"
                  className="w-full h-auto rounded-2xl"
                />
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg"
              >
                <Recycle className="w-6 h-6" />
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
                className="absolute -bottom-4 -left-4 bg-green-400 text-white p-3 rounded-full shadow-lg"
              >
                <Leaf className="w-6 h-6" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Tips Mengurangi Limbah Dapur</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pelajari strategi praktis untuk mengurangi limbah makanan dan menciptakan dapur yang berkelanjutan
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {wasteReductionTips.map((tip, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-3 bg-green-50 rounded-full w-fit">{tip.icon}</div>
                    <CardTitle className="text-xl font-semibold text-gray-900">{tip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-center leading-relaxed">
                      {tip.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Interactive Recipe Generator */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-green-100">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Generator Resep dari Bahan Sisa</h2>
            <p className="text-xl text-gray-600">
              Masukkan bahan sisa yang Anda miliki, dan AI akan memberikan resep kreatif!
            </p>
          </motion.div>

          <motion.div {...fadeInUp} className="bg-white rounded-3xl shadow-xl p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bahan-bahan yang tersedia:</label>
                <Input
                  placeholder="Contoh: wortel, brokoli, ayam sisa, nasi..."
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  className="text-lg py-3"
                />
              </div>

              <Button
                onClick={handleGenerateRecipe}
                disabled={isGenerating || !ingredients.trim()}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-full"
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Membuat Resep...
                  </div>
                ) : (
                  <>
                    <ChefHat className="w-5 h-5 mr-2" />
                    Buat Resep Sekarang
                  </>
                )}
              </Button>

              {generatedRecipe && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 rounded-2xl p-6 border border-green-200"
                >
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                    <ChefHat className="w-5 h-5 mr-2" />
                    Resep AI untuk Anda:
                  </h3>
                  <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">{generatedRecipe}</pre>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeInUp} className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Mulai Perjalanan Zero Waste Anda Hari Ini</h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan orang yang telah mengubah cara mereka mengelola limbah dapur. Setiap langkah
              kecil membuat perbedaan besar untuk planet kita.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-50 px-8 py-3 rounded-full"
                onClick={() => setIsChatOpen(true)}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Konsultasi dengan AI
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-full"
              >
                Unduh Panduan Gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="flex justify-center items-center space-x-8 text-green-100 text-sm">
              <div className="flex items-center">
                <Trash2 className="w-4 h-4 mr-1" />
                Kurangi 70% Limbah
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-1" />
                Hemat Pengeluaran
              </div>
              <div className="flex items-center">
                <Leaf className="w-4 h-4 mr-1" />
                Ramah Lingkungan
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Leaf className="w-8 h-8 text-green-500" />
                <span className="text-xl font-bold">Chatbot Limbah Dapur</span>
              </div>
              <p className="text-gray-400">
                Platform edukasi untuk mengelola limbah dapur dengan cerdas dan berkelanjutan.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Fitur</h3>
              <ul className="space-y-2 text-gray-400">
                <li>AI Chatbot</li>
                <li>Generator Resep</li>
                <li>Tips Zero Waste</li>
                <li>Panduan Komposting</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Sumber Daya</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Blog</li>
                <li>Panduan PDF</li>
                <li>Video Tutorial</li>
                <li>Komunitas</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Kontak</h3>
              <ul className="space-y-2 text-gray-400">
                <li>hello@gmail.com</li>
                <li>+62 812-xxxx-xxxx</li>
                <li>Bandung, Indonesia</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Chatbot Limbah Dapur. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsChatOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
