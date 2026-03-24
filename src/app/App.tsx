import { useState } from "react";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { GreetingButton } from "./components/GreetingButton";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { Toast } from "./components/Toast";
import {
  generateGreetingImage,
  getTemplateCount,
} from "./utils/imageGenerator";
import { RefreshCw, Download, ArrowLeft, Sparkles } from "lucide-react";
import AdBanner from "./components/AdBanner";

type GreetingType = "morning" | "afternoon" | "night";
type Screen = "home" | "result";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedGreeting, setSelectedGreeting] = useState<GreetingType | null>(
    null,
  );
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const greetings = [
    { type: "morning" as GreetingType, emoji: "🌞", text: "Bom dia" },
    { type: "afternoon" as GreetingType, emoji: "🌇", text: "Boa tarde" },
    { type: "night" as GreetingType, emoji: "🌙", text: "Boa noite" },
  ];

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleGenerateImage = async () => {
    if (!selectedGreeting) return;

    setIsLoading(true);
    setScreen("result");
    setShowSuccess(false);

    try {
      const imageData = await generateGreetingImage(selectedGreeting, name);
      setGeneratedImage(imageData);
      setCurrentTemplateIndex(0);

      // Show success animation
      setTimeout(() => {
        setShowSuccess(true);
        showToast("Imagem criada com sucesso!");
      }, 100);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Error generating image:", error);
      showToast("Erro ao gerar imagem. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshImage = async () => {
    if (!selectedGreeting) return;

    setIsLoading(true);

    try {
      const templateCount = getTemplateCount(selectedGreeting);
      const nextIndex = (currentTemplateIndex + 1) % templateCount;
      const imageData = await generateGreetingImage(
        selectedGreeting,
        name,
        nextIndex,
      );
      setGeneratedImage(imageData);
      setCurrentTemplateIndex(nextIndex);
      showToast("Nova imagem gerada!");
    } catch (error) {
      console.error("Error refreshing image:", error);
      showToast("Erro ao gerar nova imagem.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadImage = () => {
    const link = document.createElement("a");
    link.download = "mensagem.png";
    link.href = generatedImage;
    link.click();
    showToast("Imagem baixada!");
  };

  const handleNativeShare = async () => {
    try {
      if (!generatedImage) {
        showToast("Gere uma imagem primeiro.");
        return;
      }

      const greetingTexts = {
        morning: "Bom dia",
        afternoon: "Boa tarde",
        night: "Boa noite",
      };

      const greeting = selectedGreeting ? greetingTexts[selectedGreeting] : "";
      const nameText = name ? `, ${name}!` : "!";
      const shareText = `${greeting}${nameText}

Crie também: https://good-morning-rust.vercel.app/`;

      // converte dataURL/base64 em Blob
      const response = await fetch(generatedImage);
      const blob = await response.blob();

      const file = new File([blob], "mensagem.png", { type: "image/png" });

      // compartilhamento nativo com arquivo
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: "Mensagem pronta",
          text: shareText,
          files: [file],
        });

        showToast("Abrindo compartilhamento...");
        return;
      }

      // fallback: baixa imagem se o share nativo não existir
      const link = document.createElement("a");
      link.download = "mensagem.png";
      link.href = generatedImage;
      link.click();

      showToast(
        "Seu celular não suporta compartilhamento direto. A imagem foi baixada.",
      );
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      showToast("Não foi possível compartilhar a imagem.");
    }
  };

  const handleGenerateAnother = () => {
    setScreen("home");
    setSelectedGreeting(null);
    setGeneratedImage("");
    setCurrentTemplateIndex(0);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}

      <div className="max-w-md mx-auto px-6 py-8">
        {screen === "home" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <AdBanner />
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-8 h-8 text-[#00cf40] animate-pulse" />
              </div>
              <h1 className="text-4xl text-black">Crie sua mensagem</h1>
              <p className="text-xl text-[#717182]">
                Escolha uma opção e gere sua imagem
              </p>
            </div>

            {/* Greeting Buttons */}
            <div className="space-y-4">
              {greetings.map((greeting, index) => (
                <div
                  key={greeting.type}
                  className="animate-in slide-in-from-left duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <GreetingButton
                    emoji={greeting.emoji}
                    text={greeting.text}
                    isSelected={selectedGreeting === greeting.type}
                    onClick={() => setSelectedGreeting(greeting.type)}
                  />
                </div>
              ))}
            </div>

            {/* Name Input */}
            <div
              className="animate-in slide-in-from-bottom duration-300"
              style={{ animationDelay: "300ms" }}
            >
              <Input
                value={name}
                onChange={setName}
                placeholder="Digite seu nome (opcional)"
              />
            </div>

            {/* Generate Button */}
            <div
              className="pt-4 animate-in slide-in-from-bottom duration-300"
              style={{ animationDelay: "400ms" }}
            >
              <Button
                onClick={handleGenerateImage}
                disabled={!selectedGreeting || isLoading}
                variant="primary"
              >
                <span className="text-2xl flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Gerar imagem
                </span>
              </Button>
            </div>
          </div>
        )}

        {screen === "result" && (
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={handleGenerateAnother}
              className="flex items-center gap-2 text-[#717182] hover:text-black transition-colors active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-lg">Voltar</span>
            </button>

            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                {/* Image Preview */}
                <div className="bg-[#f5f5f5] rounded-3xl p-4 shadow-lg animate-in zoom-in duration-500 hover:shadow-xl transition-shadow">
                  <img
                    src={generatedImage}
                    alt="Greeting"
                    className="w-full h-auto rounded-2xl aspect-square object-cover"
                  />
                </div>
                <AdBanner />

                {/* Template Counter 
                <div
                  className="text-center text-[#717182] animate-in fade-in duration-300"
                  style={{ animationDelay: "100ms" }}
                >
                  <span className="text-base bg-[#f5f5f5] px-4 py-2 rounded-full inline-block">
                    Variação {currentTemplateIndex + 1} de{" "}
                    {getTemplateCount(selectedGreeting!)}
                  </span>
                </div>*/}

                {/* Refresh Button */}
                <div
                  className="animate-in slide-in-from-bottom duration-300"
                  style={{ animationDelay: "200ms" }}
                >
                  <Button
                    onClick={handleRefreshImage}
                    variant="outline"
                    disabled={isLoading}
                  >
                    <span className="flex items-center justify-center gap-3 text-xl">
                      <RefreshCw className="w-6 h-6" />
                      Gerar outra imagem
                    </span>
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <div
                    className="animate-in slide-in-from-bottom duration-300"
                    style={{ animationDelay: "300ms" }}
                  >
                    <Button onClick={handleNativeShare} variant="primary">
                      <span className="text-2xl">Compartilhar Imagem</span>
                    </Button>
                  </div>

                  <div
                    className="animate-in slide-in-from-bottom duration-300"
                    style={{ animationDelay: "400ms" }}
                  >
                    <Button onClick={handleDownloadImage} variant="secondary">
                      <span className="flex items-center justify-center gap-3 text-2xl">
                        <Download className="w-7 h-7" />
                        Baixar imagem
                      </span>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
