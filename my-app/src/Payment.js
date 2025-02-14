const stripe = require('stripe')('your-secret-key'); // Replace 'your-secret-key' with your actual Stripe secret key

async function createPayment(price, payingAccount, receivingAccount) {
    try {
        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: price * 100, // Stripe expects the amount in cents
            currency: 'usd',
            payment_method_types: ['card'],
            transfer_data: {
                destination: receivingAccount,
            },
        });

        console.log('Payment Intent created:', paymentIntent);
        return paymentIntent;
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw error;
    }
}

// Example usage
const price = 1000; // Price in dollars before tax
const payingAccount = 'acct_payingAccount'; // Replace with actual paying account ID
const receivingAccount = 'acct_receivingAccount'; // Replace with actual receiving account ID

createPayment(price, payingAccount, receivingAccount)
    .then(paymentIntent => {
        console.log('Payment successful:', paymentIntent);
    })
    .catch(error => {
        console.error('Payment failed:', error);
    });