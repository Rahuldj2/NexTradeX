import supabase from '../dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { uid } = req.query;

  try {
    // Validate the userId here if needed

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('uid', uid);

    if (userError) {
      throw userError;
    }

    // Check if user exists
    const userExists = user && user.length > 0;

    return res.status(200).json({ userExists });
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
