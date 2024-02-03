
// create new user 
import supabase from '../dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name,uid,aadhar_number, phone_number, email_id } = req.body;

  try {
    // Validate the request body here if needed

    const { data, error } = await supabase
      .from('users')
      .insert([
        
        {
            uid: uid,
          name: name,
          phone_number: phone_number,
          aadhar_number: aadhar_number,
          email_id: email_id,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    const newUser = data[0];
    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating User:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
