import { NextResponse } from 'next/server';
import { registerMediaAsset } from '@/app/actions';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename') || 'upload.png';

  if (!request.body) {
    return NextResponse.json({ error: 'Missing body' }, { status: 400 });
  }

  try {
    // Read the stream into a Buffer
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2MB Size Limit (2 * 1024 * 1024 bytes)
    if (buffer.length > 2097152) {
      return NextResponse.json({ error: 'File too large. Max 2MB allowed for database storage.' }, { status: 413 });
    }

    // Determine MIME type from filename or default
    const getMimetype = (name: string) => {
      const ext = name.split('.').pop()?.toLowerCase();
      switch (ext) {
        case 'png': return 'image/png';
        case 'jpg':
        case 'jpeg': return 'image/jpeg';
        case 'gif': return 'image/gif';
        case 'svg': return 'image/svg+xml';
        case 'webp': return 'image/webp';
        case 'ico': return 'image/x-icon';
        default: return 'image/png';
      }
    };

    const mimeType = getMimetype(filename);
    const base64String = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64String}`;

    // Register in the database (media_assets table)
    await registerMediaAsset(dataUrl, filename, buffer.length, mimeType);

    // Return the "blob" object structure for compatibility with existing frontend
    return NextResponse.json({
      url: dataUrl,
      pathname: filename,
      contentType: mimeType,
      contentDisposition: '',
    });
  } catch (error) {
    console.error('Database Upload Error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
