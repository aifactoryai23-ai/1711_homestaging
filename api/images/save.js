// api/images/save.js
import { supabaseAdmin } from "../utils/supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userId = req.headers["x-user-id"];
    const { beforePath, afterPath, prompt, parentId } = req.body || {};

    if (!userId || !beforePath || !afterPath) {
      return res.status(400).json({
        error: "Missing userId, beforePath, or afterPath",
      });
    }

    console.log("📦 Saving image for user:", userId);

    // 1️⃣ Загружаем профиль пользователя (без списания кредитов!)
    const { data: profile, error: profErr } = await supabaseAdmin
      .from("profiles")
      .select("credits_remaining, max_generations, subscription_status")
      .eq("id", userId)
      .single();

    if (profErr || !profile) {
      console.error("❌ Profile fetch error:", profErr);
      return res.status(500).json({
        error: "Failed to load user profile",
        details: profErr?.message,
      });
    }

    // 2️⃣ Подготавливаем запись в таблицу images
    const newRecord = {
      user_id: userId,
      original_url: beforePath,
      result_url: afterPath,
      prompt: prompt || "",
      parent_id: parentId || null,
      created_at: new Date().toISOString(),
    };

    // 3️⃣ Сохраняем запись
    const { data: inserted, error: insErr } = await supabaseAdmin
      .from("images")
      .insert([newRecord])
      .select("*")
      .single();

    if (insErr) {
      console.error("❌ Insert error:", insErr);
      return res.status(500).json({
        error: "Failed to save image record",
        details: insErr.message,
      });
    }

    console.log("✅ Saved image:", inserted);

    // ❌ 4️⃣ НЕТ списания кредитов! (удалено)
    // RPC consume_credit_if_active делает это один раз — корректно и атомарно.

    // 5️⃣ Возвращаем успешный ответ
    return res.status(200).json({
      success: true,
      data: inserted,
      credits_remaining: profile.credits_remaining, // возвращаем без изменения
    });
  } catch (err) {
    console.error("❌ save.js unexpected error:", err);
    return res.status(500).json({
      error: "Unexpected error",
      details: err.message,
    });
  }
}
