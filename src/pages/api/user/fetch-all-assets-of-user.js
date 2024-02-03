import supabase from '../dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { phone_number } = req.query;

  try {
    // Validate the userId here if needed

    console.log("phone number", phone_number);

    const { data: assetIds, error: assetIdsError } = await supabase
      .from('assets_user_mapping')
      .select('asset_id')
      .eq('phone_number', phone_number);

    console.log("ids here", assetIds);

    // Fetch all product purchases for the given user
    const { data: assets, error: assetsError } = await supabase
      .from('assets')
      .select( 'asset_id,propertyAddress,propertyTitle,govt_price')
      .in('asset_id', assetIds.map(item => item.asset_id)); // Using 'in' to filter by multiple asset IDs

    if (assetsError) {
      throw assetsError;
    }

    return res.status(200).json(assets || []);
  } catch (error) {
    console.error('Error fetching products purchased by user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
