import { useRef, useState } from "react";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { GreetingButton } from "./components/GreetingButton";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { Toast } from "./components/Toast";
import AdBanner from "./components/AdBanner";
import { generateGreetingImage } from "./utils/imageGenerator";
import { getTemplateCount } from "./utils/imageGenerator";
import { RefreshCw, Download, ArrowLeft, Sparkles } from "lucide-react";

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
  const [highlightGenerateArea, setHighlightGenerateArea] = useState(false);

  const generateSectionRef = useRef<HTMLDivElement | null>(null);

  const greetings = [
    { type: "morning" as GreetingType, emoji: "🌞", text: "Bom dia" },
    { type: "afternoon" as GreetingType, emoji: "🌇", text: "Boa tarde" },
    { type: "night" as GreetingType, emoji: "🌙", text: "Boa noite" },
  ];

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleSelectGreeting = (type: GreetingType) => {
    setSelectedGreeting(type);
    setHighlightGenerateArea(true);

    setTimeout(() => {
      generateSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 120);

    setTimeout(() => {
      setHighlightGenerateArea(false);
    }, 1800);
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
      const nextIndex = (currentTemplateIndex + 1) % Math.max(templateCount, 1);
      const imageData = await generateGreetingImage(selectedGreeting, name);
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
    if (!generatedImage) return;

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

      Crie também: https://bom-dia-gerador.vercel.app/`;

      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const file = new File([blob], "mensagem.png", { type: "image/png" });

      if (navigator.share) {
        const nav = navigator as Navigator & {
          canShare?: (data?: ShareData) => boolean;
        };

        if (!nav.canShare || nav.canShare({ files: [file] })) {
          await navigator.share({
            title: "Mensagem pronta",
            text: shareText,
            files: [file],
          });

          showToast("Abrindo compartilhamento...");
          return;
        }
      }

      const link = document.createElement("a");
      link.download = "mensagem.png";
      link.href = generatedImage;
      link.click();

      showToast(
        "Seu dispositivo não suportou o compartilhamento direto. A imagem foi baixada.",
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

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}

      <div className="max-w-md mx-auto px-6 py-8">
        {screen === "home" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-8 h-8 text-[#00cf40] animate-pulse" />
              </div>
              <h1 className="text-4xl text-black">Crie sua mensagem</h1>
              <p className="text-xl text-[#717182]">
                Escolha uma opção e gere sua imagem
              </p>
            </div>

            {/* <AdBanner /> */}

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
                    onClick={() => handleSelectGreeting(greeting.type)}
                  />
                </div>
              ))}
            </div>

            <div
              ref={generateSectionRef}
              className={[
                "rounded-3xl transition-all duration-500",
                "animate-in slide-in-from-bottom",
                highlightGenerateArea
                  ? "scale-[1.02] bg-[#f7fff8] ring-2 ring-[#00cf40]/30 shadow-[0_0_0_8px_rgba(0,207,64,0.08)]"
                  : "bg-transparent ring-0 shadow-none",
              ].join(" ")}
              style={{ animationDelay: "300ms" }}
            >
              <div className="space-y-4 p-1">
                <div className="text-center">
                  <p
                    className={[
                      "text-base transition-all duration-500",
                      selectedGreeting
                        ? "text-[#000000] opacity-100 translate-y-0"
                        : "text-[#717182] opacity-80",
                    ].join(" ")}
                  >
                    {selectedGreeting
                      ? "Perfeito. Agora digite um nome, se quiser, e gere sua imagem."
                      : "Escolha uma saudação para continuar."}
                  </p>
                </div>

                <Input
                  value={name}
                  onChange={setName}
                  placeholder="Digite seu nome (opcional)"
                />

                <div className="pt-2">
                  <Button
                    onClick={handleGenerateImage}
                    disabled={!selectedGreeting || isLoading}
                    variant="primary"
                  >
                    <span className="text-2xl flex items-center justify-center gap-2">
                      <Sparkles
                        className={`w-6 h-6 ${
                          selectedGreeting ? "animate-pulse" : ""
                        }`}
                      />
                      Gerar imagem
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {screen === "result" && (
          <div className="space-y-6">
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
                <div
                  className={`bg-[#f5f5f5] rounded-3xl p-4 shadow-lg transition-all duration-500 ${
                    showSuccess
                      ? "scale-[1.02] shadow-2xl ring-4 ring-[#00cf40]/20"
                      : "scale-100"
                  } animate-in zoom-in duration-500`}
                >
                  <img
                    src={generatedImage}
                    alt="Greeting"
                    className="w-full h-auto rounded-2xl aspect-square object-cover"
                  />
                </div>

                {/* <AdBanner /> */}

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

                <div className="space-y-4">
                  <div
                    className="animate-in slide-in-from-bottom duration-300"
                    style={{ animationDelay: "300ms" }}
                  >
                    <Button onClick={handleNativeShare} variant="primary">
                      <span className="text-2xl">Compartilhar imagem</span>
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
