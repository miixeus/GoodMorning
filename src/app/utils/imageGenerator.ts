type GreetingType = "morning" | "afternoon" | "night";

interface ImageTemplate {
  backgroundUrl: string;
}

// 🔥 CACHE SIMPLES
const imageCache: Record<string, string[]> = {};

// 🔥 BUSCA NA API (COM CACHE)
async function buscarImagem(query: string): Promise<string> {
  const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

  try {
    // verifica cache
    if (imageCache[query] && imageCache[query].length > 0) {
      const cached =
        imageCache[query][Math.floor(Math.random() * imageCache[query].length)];
      return cached;
    }

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${query}&per_page=6`,
      {
        headers: { Authorization: API_KEY },
      },
    );

    const data = await response.json();

    const fotos = data.photos.map((p: any) => p.src.large);

    // salva cache
    imageCache[query] = fotos;

    return fotos[Math.floor(Math.random() * fotos.length)];
  } catch (err) {
    console.error("Erro API, usando fallback");
    return "";
  }
}

// 🔥 FALLBACK LOCAL (SEGURANÇA)
const templates: Record<GreetingType, ImageTemplate[]> = {
  morning: [
    {
      backgroundUrl:
        "https://images.unsplash.com/photo-1702641397803-f2590b40942c?w=800",
    },
    {
      backgroundUrl:
        "https://images.unsplash.com/photo-1770361803597-e0cea82c8002?w=800",
    },
  ],
  afternoon: [
    {
      backgroundUrl:
        "https://images.unsplash.com/photo-1616386573884-22531fd226e6?w=800",
    },
    {
      backgroundUrl:
        "https://images.unsplash.com/photo-1730157172006-35d630f38bb2?w=800",
    },
  ],
  night: [
    {
      backgroundUrl:
        "https://images.unsplash.com/photo-1612645954457-87fa856e1efd?w=800",
    },
    {
      backgroundUrl:
        "https://images.unsplash.com/photo-1605702012553-e954fbde66eb?w=800",
    },
  ],
};

// 🔥 QUERIES OTIMIZADAS
const queries: Record<GreetingType, string> = {
  morning: "sunrise morning coffee",
  afternoon: "afternoon sun nature",
  night: "night sky stars",
};

const greetingMessages: Record<GreetingType, string[]> = {
  morning: [
    "☀️ Que seu dia seja incrível!",
    "🌅 Tenha um dia maravilhoso!",
    "✨ Comece o dia com energia!",
  ],
  afternoon: [
    "🌤️ Aproveite sua tarde!",
    "☕ Que sua tarde seja leve!",
    "🌸 Boa tarde cheia de paz!",
  ],
  night: [
    "🌙 Tenha uma noite tranquila!",
    "✨ Bons sonhos!",
    "⭐ Descanse bem!",
  ],
};

export async function generateGreetingImage(
  greetingType: GreetingType,
  name: string = "",
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 800;
  const ctx = canvas.getContext("2d")!;

  let imageUrl = await buscarImagem(queries[greetingType]);

  if (!imageUrl) {
    const fallback =
      templates[greetingType][
        Math.floor(Math.random() * templates[greetingType].length)
      ];
    imageUrl = fallback.backgroundUrl;
  }

  const img = new Image();
  img.crossOrigin = "anonymous";

  return new Promise((resolve) => {
    img.onload = () => {
      desenharImagem(img);
    };

    img.onerror = () => {
      const fallback =
        templates[greetingType][
          Math.floor(Math.random() * templates[greetingType].length)
        ];

      const fallbackImg = new Image();
      fallbackImg.crossOrigin = "anonymous";

      fallbackImg.onload = () => {
        desenharImagem(fallbackImg);
      };

      fallbackImg.onerror = () => {
        resolve("");
      };

      fallbackImg.src = fallback.backgroundUrl;
    };

    function desenharImagem(imagem: HTMLImageElement) {
      const scale = Math.max(
        canvas.width / imagem.width,
        canvas.height / imagem.height,
      );

      const x = canvas.width / 2 - (imagem.width / 2) * scale;
      const y = canvas.height / 2 - (imagem.height / 2) * scale;

      ctx.drawImage(imagem, x, y, imagem.width * scale, imagem.height * scale);

      // overlay
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const greetingTexts = {
        morning: "Bom dia",
        afternoon: "Boa tarde",
        night: "Boa noite",
      };

      const greeting = greetingTexts[greetingType];
      const nameText = name ? `, ${name}!` : "!";
      const message =
        greetingMessages[greetingType][
          Math.floor(Math.random() * greetingMessages[greetingType].length)
        ];

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // título
      ctx.font = "bold 64px Arial";
      ctx.fillStyle = "#fff";
      ctx.fillText(
        greeting + nameText,
        canvas.width / 2,
        canvas.height / 2 - 60,
      );

      // subtítulo
      ctx.font = "32px Arial";
      ctx.fillText(message, canvas.width / 2, canvas.height / 2 + 60);

      // rodapé (trafego)
      ctx.font = "20px Arial";
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.textAlign = "right";
      ctx.fillText("seusite.com", canvas.width - 20, canvas.height - 20);

      resolve(canvas.toDataURL("image/png"));
    }

    img.src = imageUrl;
  });
}

export function getTemplateCount(): number {
  return 999; // agora é "infinito"
}
