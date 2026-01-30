import { connect } from "../../lib/db";

export async function GET() {
  try {
    const db = await connect();
    const [rows] = await db.query("SELECT NOW() AS time");

    return new Response(
      JSON.stringify({
        success: true,
        serverTime: rows[0].time,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
