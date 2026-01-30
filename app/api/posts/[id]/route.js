import { connect } from "../../../lib/db";

export async function GET(req, { params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const db = await connect();
  const [rows] = await db.query("SELECT * FROM posts WHERE id = ?", [id]);

  if (rows.length === 0) {
    return new Response(JSON.stringify({ error: "Post not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(rows[0]), {
    status: 200,
    headers: { "Content-Type": "application/json" },

  });
}


// PUT update post
export async function PUT(req, { params }) {
  const db = await connect();
  const { id } = params;
  const { title, content, author } = await req.json();

  await db.query(
    "UPDATE posts SET title = ?, content = ?, author = ? WHERE id = ?",
    [title, content, author, id]
  );

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// DELETE post
export async function DELETE(req, { params }) {
  const db = await connect();
  const { id } = params;

  await db.query("DELETE FROM posts WHERE id = ?", [id]);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
