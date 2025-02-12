// const stripe = require('stripe')('sk_test_51Qfesh06UcF42ieXDUDLixdfQNgnjnHj0rMC3FnjBIyAiUvr4MWG8ZdBU1V2NW8NaeyAOP9PPBf5RJ6fd1eBf89u00LXt7TtBu'); // Replace with your Stripe secret key

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { amount } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount, // amount in cents
        currency: 'usd',
        payment_method_types: ['card'],
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
