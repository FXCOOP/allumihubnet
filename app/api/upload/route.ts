import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // Try ImgBB first (free, no API key needed for basic uploads)
    const imgbbKey = process.env.IMGBB_API_KEY || 'free';

    const imgbbFormData = new FormData();
    imgbbFormData.append('image', base64);

    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
      method: 'POST',
      body: imgbbFormData,
    });

    if (imgbbResponse.ok) {
      const imgbbData = await imgbbResponse.json();
      if (imgbbData.success) {
        return NextResponse.json({ url: imgbbData.data.url });
      }
    }

    // Fallback to Cloudinary if configured
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const { v2: cloudinary } = await import('cloudinary');
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      const base64DataUrl = `data:${file.type};base64,${base64}`;
      const result = await cloudinary.uploader.upload(base64DataUrl, {
        folder: 'alumnihub',
      });

      return NextResponse.json({ url: result.secure_url });
    }

    return NextResponse.json({ error: 'No image hosting configured' }, { status: 500 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
