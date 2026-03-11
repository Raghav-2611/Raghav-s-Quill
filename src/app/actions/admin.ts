"use server"

import { supabase } from "@/lib/supabase"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export async function adminAction(password: string, operation: "save" | "delete", data: any) {
    // 1. Verify password on the server (Secure!)
    if (password !== ADMIN_PASSWORD) {
        throw new Error("Unauthorized")
    }

    // 2. Perform the operation
    if (operation === "save") {
        const { editingId, title, content, type } = data

        if (editingId) {
            // Update via RPC
            const { error } = await supabase.rpc("update_post", {
                post_id: editingId,
                p_title: title.trim(),
                p_content: content.trim(),
                p_type: type
            })
            if (error) throw error
        } else {
            // Insert new
            const { error } = await supabase
                .from("posts")
                .insert({ title: title.trim(), content: content.trim(), type })
            if (error) throw error
        }
    } else if (operation === "delete") {
        const { id } = data
        const { error } = await supabase.rpc("delete_post", { post_id: id })
        if (error) throw error
    }

    return { success: true }
}
