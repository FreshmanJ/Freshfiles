import { neon } from '@netlify/neon';

export async function handler(event) {
  const fileName = event.queryStringParameters?.file_name;

  if (!fileName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: '缺少 file_name 参数' }),
    };
  }

  const sql = neon();

  try {
    const result = await sql`
      SELECT COUNT(*) AS count
      FROM download_logs
      WHERE file_name = ${fileName}
    `;
    return {
      statusCode: 200,
      body: JSON.stringify({ count: result[0].count }),
    };
  } catch (err) {
    console.error('查询下载次数失败:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
}