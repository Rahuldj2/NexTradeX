
import supabase from '../dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { asset_id } = req.query;

  try {
    // Validate the userId here if needed

 

    // Check if user exists


    const { data: assetprice, error: assetIdsError } = await supabase
      .from('assets')
      .select('*')
      .eq('asset_id', asset_id);



        return res.status(200).json({ price:assetprice[0].govt_price,title:assetprice[0].propertyTitle })
 
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
