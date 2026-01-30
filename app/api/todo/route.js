import { connect } from "../../lib/db";

// GET all todos
export async function GET() {
  const db = await connect();
  const [rows] = await db.query("SELECT * FROM todos ORDER BY id DESC");
  return new Response(JSON.stringify(rows), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// POST new todo
export async function POST(req) {
  const db = await connect();
  const { title } = await req.json();
  const [result] = await db.query("INSERT INTO todos (title) VALUES (?)", [title]);

  return new Response(JSON.stringify({ id: result.insertId, title, completed: false }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
