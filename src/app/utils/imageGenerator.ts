type GreetingType = "morning" | "afternoon" | "night";

interface ImageTemplate {
  backgroundUrl: string;
}

const PEXELS_PER_PAGE = 20;
const RECENT_HISTORY_LIMIT = 10;

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

const themedQueries: Record<GreetingType, Record<string, string[]>> = {
  morning: {
    pets: [
      "cute kitten morning light",
      "cute puppy sunrise",
      "cat by window morning light",
      "dog in garden sunrise",
      "cute rabbit morning sunlight",
      "puppy smiling morning grass",
      "kitten flowers sunrise",
      "small dog cozy morning",
      "golden retriever morning light",
      "sleepy cat warm sunlight",
      "cute pet by window sunrise",
      "puppy in flower field morning",
      "cat stretching morning light",
      "dog happy sunrise park",
      "cute kitten cozy blanket morning",
    ],
    babies: [
      "baby smiling morning",
      "happy baby sunlight",
      "baby laughing soft light",
      "sleepy baby waking up",
      "baby hands flowers morning",
      "baby smiling window light",
      "baby with teddy bear morning",
      "happy infant gentle sunlight",
      "baby portrait warm morning",
      "cute baby peaceful morning",
      "baby joy sunrise light",
      "mother holding baby morning",
    ],
    smiles: [
      "woman smiling morning sunlight",
      "man smiling morning coffee",
      "happy grandmother morning light",
      "smiling child morning",
      "family smiling breakfast morning",
      "joyful portrait sunrise light",
      "happy people morning park",
      "smiling elderly couple morning",
      "happy girl flowers sunlight",
      "soft smile golden morning",
      "smiling face warm window light",
      "laughing child sunrise",
    ],
    flowers: [
      "sunrise flowers garden",
      "morning dew flowers",
      "rose garden morning light",
      "sunflower field sunrise",
      "daisy flowers sunlight morning",
      "peony flowers soft light",
      "wildflowers sunrise field",
      "pink flowers morning bokeh",
      "lavender sunrise field",
      "yellow flowers morning light",
      "flower bouquet window morning",
      "bright garden flowers dawn",
      "fresh flowers vase morning",
      "tulips sunrise light",
      "blossom tree morning sunlight",
    ],
    gardens: [
      "beautiful garden morning",
      "peaceful garden sunrise",
      "cozy garden path morning",
      "morning backyard flowers",
      "lush garden sunlight",
      "garden bench sunrise",
      "cottage garden morning light",
      "tropical garden sunrise",
      "morning greenhouse flowers",
      "botanical garden early light",
      "sunlit garden arch morning",
      "peaceful home garden morning",
    ],
    cozy: [
      "morning coffee flowers",
      "cozy breakfast table",
      "tea cup sunrise",
      "warm home morning light",
      "cozy window sunlight",
      "breakfast table sunlight",
      "croissant coffee sunrise",
      "morning coffee aesthetic",
      "cozy bed tray breakfast",
      "window curtains morning glow",
      "warm kitchen sunlight morning",
      "cozy chair window morning",
      "book and coffee morning light",
      "breakfast tray flowers sunlight",
      "quiet home sunrise",
    ],
    nature: [
      "golden sunrise nature",
      "sunrise over ocean",
      "sunrise mountain view",
      "calm lake sunrise",
      "morning countryside",
      "rural sunrise field",
      "soft clouds sunrise",
      "peaceful forest dawn",
      "morning river sunlight",
      "beach sunrise golden sky",
      "pastel sky morning landscape",
      "sunrise hills landscape",
      "dawn sky horizon",
      "misty morning nature",
      "sunlight through trees morning",
      "fresh meadow sunrise",
    ],
  },

  afternoon: {
    pets: [
      "cute dog smiling park",
      "cute kitten garden afternoon",
      "cat relaxing sunlight",
      "happy dog flowers field",
      "golden retriever sunny park",
      "kitten on balcony sunlight",
      "small dog cozy afternoon",
      "cat laying in garden sun",
      "puppy portrait sunshine",
      "cute pet picnic park",
      "dog playing field afternoon",
      "cat among flowers sunlight",
      "sleepy dog warm sunlight",
      "kitten by window afternoon",
      "happy puppy grass sunshine",
    ],
    babies: [
      "baby laughing sunlight",
      "baby in garden afternoon",
      "baby smiling park sunlight",
      "toddler laughing outdoors",
      "happy infant flowers field",
      "baby portrait warm afternoon",
      "child joy sunshine",
      "baby with mother garden",
      "toddler smiling nature",
      "little child warm sunlight",
      "baby and teddy afternoon",
      "child in flower meadow",
    ],
    smiles: [
      "happy woman smiling flowers",
      "smiling family picnic park",
      "elderly couple garden sunlight",
      "joyful portrait soft daylight",
      "happy child sunny park",
      "smiling friends outdoors",
      "smile close up sunlight",
      "happy grandmother flowers",
      "laughing girl in field",
      "happy people summer sunlight",
      "warm portrait afternoon smile",
      "family happiness outdoors",
    ],
    flowers: [
      "sunny flower garden",
      "beautiful roses garden",
      "colorful flowers sunshine",
      "sunflower field afternoon",
      "lavender garden sunlight",
      "bright peonies afternoon",
      "tulip field sunshine",
      "flowers close up sunlight",
      "wildflowers summer afternoon",
      "pink roses sunlight",
      "gerbera flowers bright",
      "daisy meadow sunshine",
      "fresh bouquet golden daylight",
      "hydrangea flowers summer light",
      "flower path sunny garden",
    ],
    gardens: [
      "peaceful garden bench",
      "green backyard afternoon",
      "sunny botanical garden",
      "garden path flowers sunlight",
      "cottage garden afternoon",
      "tropical garden sunshine",
      "relaxing balcony plants",
      "sunlit garden trees",
      "greenhouse flowers afternoon",
      "beautiful patio garden",
      "lush courtyard sunlight",
      "quiet garden home afternoon",
    ],
    cozy: [
      "cozy tea table flowers",
      "afternoon coffee table flowers",
      "tea and cake sunlight",
      "cozy living room sunlight",
      "warm home interior sunlight",
      "sunny window home",
      "book tea flowers afternoon",
      "coffee cup on table sunlight",
      "balcony coffee sunshine",
      "quiet reading corner sunlight",
      "cozy sofa warm daylight",
      "home decor flowers afternoon",
      "aesthetic tea set sunlight",
      "afternoon rest by window",
      "coffee and cookies sunlight",
    ],
    nature: [
      "beach sunlight calm",
      "afternoon lake landscape",
      "sunny countryside field",
      "green park sunlight",
      "summer meadow sunshine",
      "calm ocean daylight",
      "afternoon sky beautiful clouds",
      "sunlit tree path",
      "warm golden field",
      "soft light leaves",
      "peaceful village afternoon",
      "river sunlight landscape",
      "mountain field daylight",
      "garden butterflies sunlight",
      "nature walkway sunshine",
      "tropical beach afternoon",
    ],
  },

  night: {
    pets: [
      "cute sleeping kitten",
      "cute sleeping puppy",
      "cat by window night",
      "dog sleeping cozy blanket",
      "kitten moonlight cozy",
      "puppy peaceful sleep",
      "cat curled blanket night",
      "dog warm bed evening",
      "sleepy pet cozy room",
      "kitten lamp light night",
      "sleeping cat aesthetic",
      "puppy dreaming blanket",
      "cat cozy night room",
      "small dog bedtime",
      "sleeping pet warm light",
    ],
    babies: [
      "baby sleeping peacefully",
      "baby sleeping teddy bear",
      "mother holding baby night",
      "sleeping child cozy room",
      "baby bedtime warm light",
      "child sleeping peacefully",
      "baby blanket moonlight",
      "newborn sleeping soft light",
      "bedtime child lamp light",
      "sleeping infant calm room",
      "baby peaceful night",
      "family bedtime cozy",
    ],
    smiles: [
      "smiling couple sunset",
      "happy family evening home",
      "warm portrait evening smile",
      "joyful woman sunset",
      "elderly couple twilight",
      "soft smile candle light",
      "happy friends sunset beach",
      "smiling child evening",
      "family warm evening lights",
      "gentle smile twilight glow",
      "peaceful portrait moonlight",
      "sunset happiness portrait",
    ],
    flowers: [
      "moonlight flowers garden",
      "sunset field flowers",
      "purple flowers evening light",
      "roses twilight garden",
      "night flowers soft lights",
      "lavender sunset field",
      "golden sunset flowers",
      "flower garden lanterns",
      "daisy field twilight",
      "peony flowers sunset",
      "romantic garden flowers evening",
      "flower silhouette sunset sky",
    ],
    gardens: [
      "lantern garden evening",
      "cozy garden lights night",
      "twilight garden path",
      "night backyard warm lights",
      "romantic garden evening",
      "patio lights cozy night",
      "garden bench moonlight",
      "quiet courtyard evening",
      "cottage garden sunset",
      "fairy lights garden night",
      "green garden twilight",
      "home garden lamp evening",
    ],
    cozy: [
      "cozy candle light room",
      "warm lights window night",
      "cozy bedroom warm lights",
      "relaxing evening tea lights",
      "peaceful room lamp light",
      "good night cozy aesthetic",
      "book candle cozy night",
      "warm blanket tea evening",
      "lamp light cozy home",
      "soft pillows bedtime aesthetic",
      "candle glow home decor",
      "night window warm room",
      "cozy sofa lamp night",
      "bedside lamp peaceful night",
      "quiet home night aesthetic",
    ],
    nature: [
      "peaceful night sky stars",
      "moon over mountains",
      "twilight lake reflection",
      "night river reflection",
      "sunset beach romantic",
      "purple sunset landscape",
      "deep blue evening sky",
      "calm moon sky",
      "serene moon horizon",
      "sunset over ocean peaceful",
      "quiet countryside dusk",
      "night city lights warm",
      "orange pink sunset sky",
      "evening clouds gold",
      "twilight ocean horizon",
      "starlit landscape peaceful",
    ],
  },
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
    "😊 Que o dia traga sorrisos sinceros.",
    "🍀 Bom dia com carinho e boas energias.",
    "🌅 Que sua jornada hoje seja leve e feliz.",
    "💛 Aproveite o dia com calma e gratidão.",
    "☕ Desejo um despertar tranquilo e cheio de paz.",
    "🌼 Que o seu dia tenha pequenos momentos felizes.",
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
    "☕ Um descanso, um respiro e uma boa tarde.",
    "🌸 Que a sua tarde seja leve por dentro e por fora.",
    "💫 Continue o dia com esperança e ânimo.",
    "🌤️ Boa tarde com muita leveza.",
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
    "🕯️ Que seu final de dia seja calmo e bonito.",
    "🌠 A noite também é um presente de paz.",
    "💙 Descanse bem e cuide de você.",
    "🌃 Que sua noite seja silenciosa e agradável.",
  ],
};

function randomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
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

function getAllQueriesForGreeting(greetingType: GreetingType): string[] {
  return Object.values(themedQueries[greetingType]).flat();
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
  const history = recentImagesByGreeting[greetingType];
  const themes = shuffleArray(Object.keys(themedQueries[greetingType]));

  for (const theme of themes) {
    const queries = shuffleArray(themedQueries[greetingType][theme]);

    for (const query of queries) {
      const fotos = await buscarImagensDaQuery(query);
      const escolhida = pickRandomUnique(fotos, history);

      if (escolhida) {
        pushRecent(greetingType, escolhida);
        return escolhida;
      }
    }
  }

  const allQueries = shuffleArray(getAllQueriesForGreeting(greetingType));

  for (const query of allQueries) {
    const fotos = await buscarImagensDaQuery(query);
    const escolhida = pickRandomUnique(fotos);

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
    const fallback = fallbackOptions[randomIndex(fallbackOptions.length)];
    imageUrl = fallback.backgroundUrl;
  }

  const greetingTexts = {
    morning: "Bom dia",
    afternoon: "Boa tarde",
    night: "Boa noite",
  };

  const greeting = greetingTexts[greetingType];
  const safeName = name.trim().slice(0, 20);
  const nameText = safeName ? `, ${safeName}!` : "!";
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

    const titleText = `${greeting}${nameText}`;
    const titleMaxWidth = canvas.width - 120;
    const titleLines = wrapText(ctx, titleText, titleMaxWidth);
    const titleLineHeight = 70;
    const titleStartY =
      canvas.height / 2 - 120 - ((titleLines.length - 1) * titleLineHeight) / 2;

    drawMultilineText(
      ctx,
      titleLines,
      canvas.width / 2,
      titleStartY,
      titleLineHeight,
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
    ctx.fillText(
      "bom-dia-gerador.vercel.app",
      canvas.width - 20,
      canvas.height - 20,
    );

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
  const allQueries = getAllQueriesForGreeting(greetingType);

  const totalCached = allQueries.reduce((acc, query) => {
    return acc + (imageCache[query]?.length || 0);
  }, 0);

  if (totalCached > 0) {
    return totalCached;
  }

  return templates[greetingType].length;
}
