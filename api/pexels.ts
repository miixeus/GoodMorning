export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query");
  const perPage = searchParams.get("per_page") || "20";
  const orientation = searchParams.get("orientation") || "portrait";

  if (!query) {
    return Response.json({ error: "Missing query" }, { status: 400 });
  }

  const apiKey = process.env.PEXELS_API_KEY;

  if (!apiKey) {
    return Response.json({ error: "Missing PEXELS_API_KEY" }, { status: 500 });
  }

  try {
    const pexelsUrl =
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}` +
      `&per_page=${encodeURIComponent(perPage)}` +
      `&orientation=${encodeURIComponent(orientation)}`;

    const response = await fetch(pexelsUrl, {
      headers: {
        Authorization: apiKey,
      },
    });

    const text = await response.text();

    return new Response(text, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch from Pexels" },
      { status: 500 },
    );
  }
}
