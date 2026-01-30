import { connect } from "../../lib/db";

// GET all posts
export async function GET() {
  const db = await connect();
  const [rows] = await db.query("SELECT * FROM posts ORDER BY created_at DESC");

  return new Response(JSON.stringify(rows), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// POST new post
export async function POST(req) {
  const db = await connect();
  const { title, content, author } = await req.json();

  if (!title || !content || !author) {
    return new Response(JSON.stringify({ error: "All fields are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const [result] = await db.query(
    "INSERT INTO posts (title, content, author) VALUES (?, ?, ?)",
    [title, content, author]
  );

  return new Response(
    JSON.stringify({ id: result.insertId, title, content, author }),
    {
      status: 201,
      headers: { "Content-Type": "application/json" },
    }
  );
}
