"use server"

import { createClient } from "@supabase/supabase-js"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

// Server-only Supabase admin client.
// Uses SUPABASE_SERVICE_ROLE_KEY to bypass RLS if available,
// otherwise falls back to the anon key.
function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

type ActionResult = { success: true } | { success: false; error: string }

export async function adminAction(
    password: string,
    operation: "save" | "delete",
    data: any
): Promise<ActionResult> {
    // 1. Verify password on the server
    if (password !== ADMIN_PASSWORD) {
        return { success: false, error: "Unauthorized: Incorrect password." }
    }

    const supabase = getAdminClient()

    try {
        // 2. Perform the operation
        if (operation === "save") {
            const { editingId, title, content, type } = data

            if (editingId) {
                // Update existing post
                const { error } = await supabase
                    .from("posts")
                    .update({ title: title.trim(), content: content.trim(), type })
                    .eq("id", editingId)

                if (error) {
                    return { success: false, error: error.message }
                }
            } else {
                // Insert new post
                const { error } = await supabase
                    .from("posts")
                    .insert({ title: title.trim(), content: content.trim(), type })

                if (error) {
                    return { success: false, error: error.message }
                }
            }
        } else if (operation === "delete") {
            const { id } = data
            const { error } = await supabase
                .from("posts")
                .delete()
                .eq("id", id)

            if (error) {
                return { success: false, error: error.message }
            }
        }

        return { success: true }
    } catch (e: any) {
        return { success: false, error: e?.message ?? "An unexpected error occurred." }
    }
}
