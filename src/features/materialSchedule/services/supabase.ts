import { supabase } from '../../../services/supabase/client';
import { log, error } from '../../../utils/logger';

export async function getSignedUrl(filePath: string): Promise<string> {
  try {
    log('MaterialSchedule:Storage', 'Getting signed URL', { 
      filePath,
      timestamp: new Date().toISOString()
    });
    
    const { data, error: urlError } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 3600);

    if (urlError) {
      error('MaterialSchedule:Storage', 'Failed to get signed URL', {
        error: urlError,
        filePath
      });
      throw urlError;
    }

    if (!data?.signedUrl) {
      error('MaterialSchedule:Storage', 'No signed URL returned', { filePath });
      throw new Error('No signed URL returned');
    }

    log('MaterialSchedule:Storage', 'Successfully obtained signed URL', {
      filePath,
      expiresIn: '1 hour',
      urlLength: data.signedUrl.length
    });

    return data.signedUrl;
  } catch (err) {
    error('MaterialSchedule:Storage', 'Failed to get signed URL', {
      error: err,
      filePath,
      timestamp: new Date().toISOString()
    });
    throw err;
  }
}