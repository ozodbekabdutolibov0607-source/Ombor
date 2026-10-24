import { Product } from './supabase';
/**
- Rasmdan rang xususiyatlari va strukturaviy histogrammalarni ajratib oladi. */ export async function extractImageFeatures(imageSrc: string): Promise<number[]> { return new Promise((resolve, reject) => { const img = new Image(); img.crossOrigin = 'Anonymous'; img.onload = () => { const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); if (!ctx) return reject('Canvas context bo‘sh');
- const size = 32; // 32x32 pikselga kichraytirish canvas.width = size; canvas.height = size; ctx.drawImage(img, 0, 0, size, size);
- const imageData = ctx.getImageData(0, 0, size, size); const data = imageData.data; const features: number[] = [];
- // Rang kanallari bo'yicha taqsimot for (let i = 0; i < data.length; i += 4) { const r = data[i] / 255; const g = data[i + 1] / 255; const b = data[i + 2] / 255; // Yorqinlik const luminance = 0.299 * r + 0.587 * g + 0.114 * b; features.push(r, g, b, luminance); } resolve(features); }; img.onerror = () => reject('Rasm yuklashda xatolik yuz berdi'); img.src = imageSrc; }); }
/**
- Ikki vektor o'rtasidagi Cosine Similarity bo'yicha moslik foizini hisoblaydi. */ export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number { if (!vecA || !vecB || vecA.length !== vecB.length) return 0; let dotProduct = 0; let normA = 0; let normB = 0;
for (let i = 0; i < vecA.length; i++) { dotProduct += vecA[i] * vecB[i]; normA += vecA[i] * vecA[i]; normB += vecB[i] * vecB[i]; }
if (normA === 0 || normB === 0) return 0; const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB)); return Math.round(similarity * 100); }
/**
- Bazadagi mahsulotlar bilan vizual taqqoslash o'tkazadi */ export async function searchByImage( capturedImageBase64: string, products: Product[] ): Promise<Array<{ product: Product; matchScore: number }>> { try { const targetVector = await extractImageFeatures(capturedImageBase64);
- const results = await Promise.all( products.map(async (product) => { let prodVector = product.feature_vector; if (!prodVector || prodVector.length === 0) { try { prodVector = await extractImageFeatures(product.image_url); } catch { return { product, matchScore: 0 }; } } const matchScore = calculateCosineSimilarity(targetVector, prodVector); return { product, matchScore }; }) );
- // Eng yuqori moslik bo'yicha saralash return results .filter((r) => r.matchScore > 35) // kamida 35% o'xshashlik .sort((a, b) => b.matchScore - a.matchScore); } catch (err) { console.error('Visual search error:', err); return []; } }
