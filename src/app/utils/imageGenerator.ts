type GreetingType = "morning" | "afternoon" | "night";

interface ImageTemplate {
  backgroundUrl: string;
}

const PEXELS_PER_PAGE = 20;
const RECENT_HISTORY_LIMIT = 8;

const imageCache: Record<string, string[]> = {};
const recentImagesByGreeting: Record<GreetingType, string[]> = {
  morning: [],
  afternoon: [],
  night: [],
};

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
    {
      backgroundUrl:
        "https://images.unsplash.com/photo-1596142332206-9787dec77bfc?w=800",
    },
    {
      backgroundUrl:
        "https://images.unsplash.com/photo-1441371884467-a92d44ae82c8?w=800",
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
    {
      backgroundUrl:
        "https://images.unsplash.com/photo-1654952136788-4e2ab237e496?w=800",
    },
    {
      backgroundUrl:
        "https://images.unsplash.com/photo-1697809311064-c7a3852206ee?w=800",
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
    {
      backgroundUrl:
        "https://images.unsplash.com/photo-1635833742576-c9c12bb2f991?w=800",
    },
    {
      backgroundUrl:
        "https://images.unsplash.com/photo-1655671021738-7b420ca05d44?w=800",
    },
  ],
};

const queries: Record<GreetingType, string[]> = {
  morning: [
    "sunrise landscape",
    "morning coffee",
    "flowers morning light",
    "golden sunrise nature",
    "peaceful morning window",
    "morning beach sunrise",
    "breakfast table sunlight",
    "morning sky clouds",
    "sunrise mountains",
    "morning garden flowers",
    "morning sea view",
    "morning countryside",
    "window sunlight morning",
    "fresh dew leaves",
    "sunlight through trees",
    "morning lake reflection",
    "calm sunrise horizon",
    "cozy breakfast morning",
    "sunrise over ocean",
    "early morning nature",
    "morning tea cup",
    "warm sunlight home",
    "morning road landscape",
    "rural sunrise field",
    "morning sunlight flowers",
    "peaceful morning room",
    "soft sunlight curtain",
    "morning sky pastel",
    "dawn forest light",
    "sunrise tropical beach",
  ],
  afternoon: [
    "afternoon nature",
    "sunny garden",
    "coffee table afternoon",
    "beach sunlight",
    "calm countryside afternoon",
    "flowers sunshine",
    "afternoon sky clouds",
    "green field sunlight",
    "afternoon park trees",
    "warm light living room",
    "tea table sunlight",
    "bright flowers garden",
    "sunny window home",
    "afternoon sea landscape",
    "sunny city park",
    "relaxing balcony sunlight",
    "golden afternoon field",
    "summer sunlight nature",
    "sunlit path trees",
    "peaceful village afternoon",
    "sunny lake view",
    "afternoon tropical garden",
    "afternoon terrace plants",
    "countryside flowers sunlight",
    "calm beach afternoon",
    "light through leaves",
    "warm home interior sunlight",
    "afternoon picnic landscape",
    "sunny floral background",
    "soft golden daylight",
  ],
  night: [
    "moon night landscape",
    "cozy night window",
    "night city lights",
    "calm moon sky",
    "peaceful evening nature",
    "twilight landscape",
    "night ocean moon",
    "sunset dusk horizon",
    "evening lake reflection",
    "night street lights",
    "moon over mountains",
    "night forest sky",
    "city skyline night",
    "evening beach twilight",
    "calm stars ocean",
    "night clouds moonlight",
    "balcony night lights",
    "quiet evening room",
    "dusk countryside",
    "night sea horizon",
    "lantern night ambience",
    "cozy bedroom night",
    "moonlit road landscape",
    "twilight garden lights",
    "deep blue evening sky",
    "serene night window",
    "night river reflection",
    "sunset purple sky",
    "evening clouds gold",
    "peaceful moon horizon",
  ],
};

const greetingMessages: Record<GreetingType, string[]> = {
  morning: [
    "☀️ Que seu dia comece leve e bonito.",
    "🌅 Tenha um amanhecer cheio de boas energias.",
    "✨ Hoje pode ser um dia especial para você.",
    "🌻 Que a manhã traga paz e alegria.",
    "😊 Comece o dia com calma e esperança.",
    "🌞 Que não falte ânimo para viver coisas boas.",
    "💛 Desejo uma manhã tranquila e iluminada.",
    "☕ Um bom dia começa com serenidade no coração.",
    "🌼 Que o seu dia floresça em bons momentos.",
    "🌤️ Que a manhã traga inspiração e leveza.",
    "🍃 Respire fundo e aproveite este novo dia.",
    "🕊️ Um novo amanhecer, novas possibilidades.",
    "🌷 Que sua manhã seja cheia de coisas simples e boas.",
    "🌈 Bom dia para você que merece paz e alegria.",
    "💫 Que o dia comece com bons pensamentos.",
    "🌸 Desejo uma manhã bonita e cheia de harmonia.",
    "🌞 Que o sol aqueça seu coração hoje.",
    "☀️ Que a luz desta manhã ilumine o seu caminho.",
    "🌻 Tenha um dia cheio de bons encontros.",
    "🌿 Que sua manhã seja suave e agradável.",
  ],
  afternoon: [
    "🌤️ Que sua tarde siga leve e bonita.",
    "☕ Aproveite a tarde com calma e alegria.",
    "🌸 Que não faltem bons momentos hoje.",
    "😊 Uma boa tarde cheia de paz para você.",
    "🌺 Que a tarde traga tranquilidade ao coração.",
    "✨ Desejo uma tarde agradável e iluminada.",
    "🍃 Que seu restante de dia seja especial.",
    "🌞 Que a tarde seja produtiva sem perder a leveza.",
    "💛 Boa tarde com muito carinho.",
    "🌻 Que a tarde venha cheia de boas energias.",
    "🌼 Aproveite o dia com serenidade.",
    "🌈 Que sua tarde tenha pequenos motivos para sorrir.",
    "☀️ Uma tarde bonita para você.",
    "🌷 Que a luz desta tarde te faça bem.",
    "😊 Boa tarde e bons pensamentos.",
    "🍀 Que a paz acompanhe suas próximas horas.",
    "🌿 Desejo uma tarde calma e feliz.",
    "✨ Que o dia continue te surpreendendo positivamente.",
  ],
  night: [
    "🌙 Que sua noite seja calma e tranquila.",
    "✨ Bons sonhos e descanso merecido.",
    "⭐ Que a noite traga serenidade ao seu coração.",
    "😊 Tenha uma noite leve e agradável.",
    "💫 Hora de desacelerar e descansar em paz.",
    "🌌 Que a noite te abrace com tranquilidade.",
    "🌠 Desejo uma noite cheia de calma e bem-estar.",
    "🕯️ Que a noite seja silenciosa e acolhedora.",
    "🌙 Boa noite com muito carinho.",
    "💙 Que seu descanso seja reparador.",
    "✨ Que amanhã comece ainda melhor.",
    "🌃 Tenha uma noite bonita e serena.",
    "🌟 Que a paz acompanhe suas horas de descanso.",
    "😊 Desejo uma noite suave e cheia de paz.",
    "🌌 Que a noite leve embora o cansaço do dia.",
    "💫 Bons sonhos e coração tranquilo.",
    "🌙 Que você tenha um descanso profundo e leve.",
    "⭐ Boa noite com afeto e tranquilidade.",
  ],
};

function randomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

function pickRandomUnique<T>(items: T[], recent: T[] = []): T | null {
  if (!items.length) return null;

  const filtered = items.filter((item) => !recent.includes(item));

  if (filtered.length > 0) {
    return filtered[randomIndex(filtered.length)];
  }

  return items[randomIndex(items.length)];
}

function pushRecent(greetingType: GreetingType, imageUrl: string) {
  const history = recentImagesByGreeting[greetingType];
  history.push(imageUrl);

  while (history.length > RECENT_HISTORY_LIMIT) {
    history.shift();
  }
}

async function buscarImagensDaQuery(query: string): Promise<string[]> {
  try {
    if (imageCache[query] && imageCache[query].length > 0) {
      return imageCache[query];
    }

    const response = await fetch(
      `/api/pexels?query=${encodeURIComponent(query)}&per_page=${PEXELS_PER_PAGE}&orientation=portrait`,
    );

    if (!response.ok) {
      throw new Error(`Proxy retornou status ${response.status}`);
    }

    const data = await response.json();

    const fotos =
      data?.photos
        ?.map(
          (p: any) =>
            p?.src?.portrait ||
            p?.src?.large2x ||
            p?.src?.large ||
            p?.src?.medium ||
            p?.src?.original,
        )
        ?.filter(Boolean) || [];

    imageCache[query] = fotos;
    return fotos;
  } catch (err) {
    console.error("Erro API na query:", query, err);
    return [];
  }
}

async function buscarImagemAleatoria(
  greetingType: GreetingType,
): Promise<string> {
  const queryOptions = [...queries[greetingType]].sort(() => Math.random() - 0.5);
  const history = recentImagesByGreeting[greetingType];

  for (const query of queryOptions) {
    const fotos = await buscarImagensDaQuery(query);
    const escolhida = pickRandomUnique(fotos, history);

    if (escolhida) {
      pushRecent(greetingType, escolhida);
      return escolhida;
    }
  }

  return "";
}

function getRandomMessage(greetingType: GreetingType): string {
  const messages = greetingMessages[greetingType];
  return messages[randomIndex(messages.length)];
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function drawMultilineText(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  centerX: number,
  startY: number,
  lineHeight: number,
) {
  lines.forEach((line, index) => {
    ctx.fillText(line, centerX, startY + index * lineHeight);
  });
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.referrerPolicy = "no-referrer";

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Falha ao carregar imagem: ${url}`));

    img.src = url;
  });
}

export async function generateGreetingImage(
  greetingType: GreetingType,
  name: string = "",
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 800;

  const context = canvas.getContext("2d");
  if (!context) return "";
  const ctx = context;

  let imageUrl = await buscarImagemAleatoria(greetingType);

  if (!imageUrl) {
    const fallbackOptions = templates[greetingType];
    const fallback =
      fallbackOptions[randomIndex(fallbackOptions.length)];
    imageUrl = fallback.backgroundUrl;
  }

  const greetingTexts = {
    morning: "Bom dia",
    afternoon: "Boa tarde",
    night: "Boa noite",
  };

  const greeting = greetingTexts[greetingType];
  const nameText = name ? `, ${name}!` : "!";
  const message = getRandomMessage(greetingType);

  function desenharImagem(imagem: HTMLImageElement) {
    const scale = Math.max(
      canvas.width / imagem.width,
      canvas.height / imagem.height,
    );
    const x = canvas.width / 2 - (imagem.width / 2) * scale;
    const y = canvas.height / 2 - (imagem.height / 2) * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imagem, x, y, imagem.width * scale, imagem.height * scale);

    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;

    ctx.font = "bold 64px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(
      `${greeting}${nameText}`,
      canvas.width / 2,
      canvas.height / 2 - 90,
    );

    ctx.font = "32px Arial";
    const maxTextWidth = canvas.width - 120;
    const lines = wrapText(ctx, message, maxTextWidth);
    const totalHeight = lines.length * 44;
    const messageStartY = canvas.height / 2 + 20 - totalHeight / 2;

    drawMultilineText(ctx, lines, canvas.width / 2, messageStartY, 44);

    ctx.shadowBlur = 8;
    ctx.font = "18px Arial";
    ctx.fillStyle = "rgba(255,255,255,0.82)";
    ctx.textAlign = "right";
    ctx.fillText("bom-dia-gerador.vercel.app", canvas.width - 20, canvas.height - 20);

    return canvas.toDataURL("image/png");
  }

  try {
    const imagem = await loadImage(imageUrl);
    return desenharImagem(imagem);
  } catch {
    try {
      const fallbackOptions = templates[greetingType];
      const fallbackImg = await loadImage(
        fallbackOptions[randomIndex(fallbackOptions.length)].backgroundUrl,
      );
      return desenharImagem(fallbackImg);
    } catch {
      return "";
    }
  }
}

export function getTemplateCount(greetingType: GreetingType): number {
  const queryOptions = queries[greetingType];

  const totalCached = queryOptions.reduce((acc, query) => {
    return acc + (imageCache[query]?.length || 0);
  }, 0);

  if (totalCached > 0) {
    return totalCached;
  }

  return templates[greetingType].length;
}