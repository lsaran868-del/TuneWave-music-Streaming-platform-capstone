import { createClient } from '@supabase/supabase-js';

// Default Supabase configuration parameters (Users can override in Settings)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.dummyKeyForDemo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper for storage public URL generation
export function getStoragePublicUrl(bucketName, filePath) {
  if (!filePath) return null;
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data?.publicUrl;
}
