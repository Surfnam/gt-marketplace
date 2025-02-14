import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import './PaymentPage.css';

const stripePromise = loadStripe('your-publishable-key'); // Replace with your Stripe publishable key

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [price, setPrice] = useState('');
    const [payingAccount, setPayingAccount] = useState('');
    const [receivingAccount, setReceivingAccount] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            setError(error.message);
            return;
        }

        try {
            const response = await axios.post('/create-payment-intent', {
                paymentMethodId: paymentMethod.id,
                amount: price * 100, // Stripe expects the amount in cents
                receivingAccount,
            });

            const { clientSecret } = response.data;

            const result = await stripe.confirmCardPayment(clientSecret);

            if (result.error) {
                setError(result.error.message);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    setSuccess(true);
                }
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            <h2>Payment Information</h2>
            <div className="form-group">
                <label htmlFor="price">Price (before tax):</label>
                <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="payingAccount">Paying Account: (This is not necessary to input, but needs to be passed in as a parameter)</label>
                <input
                    type="text"
                    id="payingAccount"
                    value={payingAccount}
                    onChange={(e) => setPayingAccount(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="receivingAccount">Receiving Account (Stripe Account ID):</label>
                <input
                    type="text"
                    id="receivingAccount"
                    value={receivingAccount}
                    onChange={(e) => setReceivingAccount(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="cardElement">Card Details:</label>
                <CardElement id="cardElement" />
            </div>
            <button className="payment-submit-button" type="submit" disabled={!stripe}>
                Pay
            </button>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">Payment successful!</div>}
        </form>
    );
};

const PaymentPage = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
};

export default PaymentPage;