
// create new user 
import supabase from '../dbConnect';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { asset_id } = req.body;
    const assetId = parseInt(asset_id);

try {
    
    // Validate the request body here if needed

    const { data, error } = await supabase
      .from('assets')
      .update([
        
        {
           tokenized:true
        },
      ]).eq('asset_id',assetId)
      .select();

    if (error) {
      throw error;
    }

    const newasset = data[0];
    return res.status(201).json(newasset);
  } catch (error) {
    console.error('Error creating User:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
