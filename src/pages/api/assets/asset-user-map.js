import { use } from 'react';
import supabase from '../dbConnect';

export default async function handler(req, res) {
   if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { uid, asset_id } = req.body;

  try {
    // Convert asset_id to integer
    // const parsedAssetId = parseInt(asset_id);

    // Validate the userId here if needed
    
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('uid', uid);


    if (userError) {
      throw userError;
    }

    // Check if user exists

    const { data: assetIds, error: assetIdsError } = await supabase
      .from('assets_user_mapping')
      .select('asset_id')
      .eq('phone_number', user[0].phone_number);

    if (assetIds.some(item => item.asset_id === parseInt(asset_id))) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(200).json({ result: false });
    }

    } catch (error) {
      console.error('Error checking if user exists:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    }
