// Vercel Serverless Function export async function POST(req: Request) { try { const { imageBase64, products } = await req.json(); const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  return new Response(
    JSON.stringify({ error: "Gemini API kaliti sozlanmagan" }),
    { status: 400 }
  );
}

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: `Senga mahsulot rasmi va mavjud mahsulotlar ro'yxati berilgan: ${JSON.stringify(
              products.map((p: any) => ({ id: p.id, title: p.title, model: p.model_compatibility }))
            )}. Ushbu rasmdagi aksessuarga eng mos mahsulot ID-larini va moslik foizini JSON shaklida qaytar.` },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64.replace(/^data:image\/\w+;base64,/, "")
              }
            }
          ]
        }
      ]
    })
  }
);

const data = await response.json();
return new Response(JSON.stringify(data), { status: 200 });
} catch (error: any) { return new Response(JSON.stringify({ error: error.message }), { status: 500 }); } }
