import { neon } from '@netlify/neon';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { file_id, file_name } = JSON.parse(event.body);

  if (!file_id || !file_name) {
    return { statusCode: 400, body: 'Missing file_id or file_name' };
  }

  const sql = neon(); // 自动使用 NETLIFY_DATABASE_URL

  try {
    await sql`
      INSERT INTO download_logs (file_id, file_name)
      VALUES (${file_id}, ${file_name})
    `;
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error('插入下载记录失败:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
}