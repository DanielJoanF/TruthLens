import { supabase } from '../lib/supabase';
import { getRiskLabel } from './analyzer';

/**
 * Menyimpan hasil analisis dari Gemini ke tabel `analysis_history` dan `claims` di Supabase
 *
 * @param {string} userId - UUID user yang sedang login
 * @param {string} text - Teks asli yang dianalisis
 * @param {object} results - Objek hasil analisis dari backend
 */
export async function saveAnalysisToDatabase(userId, text, results) {
  if (!userId) {
    console.warn('[DB] User tidak login, hasil analisis tidak disimpan.');
    return null;
  }

  try {
    // 1. Tentukan risk_level berdasarkan skor
    const { label: riskLevel } = getRiskLabel(results.score);

    // 2. Simpan ke tabel analysis_history
    const { data: historyData, error: historyError } = await supabase
      .from('analysis_history')
      .insert([
        {
          user_id: userId,
          content: text,
          ai_summary: results.neutralRewrite,
          credibility_score: results.score,
          risk_level: riskLevel,
        }
      ])
      .select('id')
      .single();

    if (historyError) throw historyError;

    const analysisId = historyData.id;

    // 3. Ekstrak highlights sebagai claims dan simpan ke tabel claims
    // Hanya simpan teks yang ditandai (highlighted: true) sebagai klaim manipulatif
    if (results.highlights && results.highlights.length > 0) {
      const claimsToInsert = results.highlights
        .filter(h => h.highlighted)
        .map(h => ({
          analysis_id: analysisId,
          claim_text: h.text,
          verification_status: 'Unverified', // Status default
          confidence_score: 50.0 // Skor default, bisa disesuaikan nanti jika AI mampu menilainya
        }));

      if (claimsToInsert.length > 0) {
        const { error: claimsError } = await supabase
          .from('claims')
          .insert(claimsToInsert);

        if (claimsError) throw claimsError;
      }
    }

    console.log('[DB] Berhasil menyimpan hasil analisis dengan ID:', analysisId);
    return analysisId;

  } catch (error) {
    console.error('[DB] Gagal menyimpan analisis:', error.message);
    return null;
  }
}

/**
 * Mengambil riwayat analisis pengguna
 */
export async function fetchHistory() {
  try {
    const { data, error } = await supabase
      .from('analysis_history')
      .select('*, claims(count)')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('[DB] Gagal mengambil history:', error.message);
    return [];
  }
}

/**
 * Mengambil daftar analisis yang di-bookmark/save
 */
export async function fetchSaved() {
  try {
    const { data, error } = await supabase
      .from('analysis_history')
      .select('*, claims(count)')
      .eq('is_saved', true)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('[DB] Gagal mengambil saved analysis:', error.message);
    return [];
  }
}

/**
 * Mengubah status is_saved pada suatu analisis
 */
export async function toggleSaved(analysisId, currentStatus) {
  try {
    const { error } = await supabase
      .from('analysis_history')
      .update({ is_saved: !currentStatus })
      .eq('id', analysisId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('[DB] Gagal toggle saved status:', error.message);
    return false;
  }
}

/**
 * Menghapus riwayat analisis secara permanen
 */
export async function deleteHistory(analysisId) {
  try {
    const { error } = await supabase
      .from('analysis_history')
      .delete()
      .eq('id', analysisId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('[DB] Gagal menghapus history:', error.message);
    return false;
  }
}
