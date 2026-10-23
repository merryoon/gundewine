
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import sql from "./db.js";

const app = new Hono();

app.get("/", (c) => {
    return c.text("GUNDEWINE TRADING backend is working!");
});

app.post("/api/inquiries", async (c) => {
    try {
        const body = await c.req.json();

        const name = String(body.name ?? "").trim();
        const email = String(body.email ?? "").trim();
        const message = String(body.message ?? "").trim();

        if (!name || !email || !message) {
            return c.json({
                success: false,
                message: "Name, email and message are required."
            }, 400);
        }

        const result = await sql`
            INSERT INTO inquiries (name, email, message)
            VALUES (${name}, ${email}, ${message})
            RETURNING id, created_at
        `;

        return c.json({
            success: true,
            message: "Your inquiry was saved successfully!",
            inquiry: result[0]
        }, 201);

    } catch (error) {
        console.error("Inquiry error:", error.message);

        return c.json({
            success: false,
            message: "Could not save your inquiry."
        }, 500);
    }
});

serve({
    fetch: app.fetch,
    port: 3000
});

console.log("Backend listening at http://localhost:3000");
