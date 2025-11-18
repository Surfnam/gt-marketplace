import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/App.css";

function UnsuspendRequest(user) {
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const email = user?.user?.email || "";
    const userId = user?.user?.uid || "";

    useEffect(() => {
        console.log(user);

    }, []);

    const handleSubmit = async (e) => {
        console.log('in handle submit');
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        const run = async () => {
            if (!email || !reason.trim()) {
                setErrorMessage("Please provide your contact email and a reason.");
                return;
            }

            setIsSubmitting(true);
            try {
                const subject = `Unsuspend request from user ${email || "Unknown"}`;
                const body = `
Unsuspend request

User ID: ${userId || "undefined"}
Contact email: ${email || "undefined"}

Reason for unsuspension:
${reason}

Additional details:
${details || "(none)"}
        `.trim();

                await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/api/admins/unsuspend/email`,
                    {
                        userId,
                        email,
                        reason,
                        details,
                        subject,
                        body,
                    }
                );

                setSuccessMessage(
                    "Your unsuspend request has been submitted. An admin will review it shortly."
                );
                setReason("");
                setDetails("");
            } catch (err) {
                console.error("Error submitting unsuspend request:", err);
                setErrorMessage(
                    err.response?.data?.message ||
                    "Failed to submit your request. Please try again later."
                );
            } finally {
                setIsSubmitting(false);
            }
        };

        run();
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="pt-24" />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="bg-white shadow-md rounded-lg border border-gray-200 p-6 sm:p-8">
                    <h1 className="text-2xl font-semibold mb-2">
                        Request Account Unsuspension
                    </h1>
                    <p className="text-gray-600 mb-6">
                        If you believe your account was suspended unfairly or the issue has
                        been resolved, you can submit a request to the admin team for unsuspension.
                    </p>

                    {successMessage && (
                        <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-400 text-green-700 text-sm">
                            {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-400 text-red-700 text-sm">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reason for Unsuspension
                            </label>
                            <textarea
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-28 resize-vertical focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Explain why you believe your account should be unsuspended."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Additional Details (Optional)
                            </label>
                            <textarea
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-24 resize-vertical focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Provide any additional context and/or including relevant dates."
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`inline-flex items-center justify-center px-5 py-2.5 rounded-md text-sm font-semibold text-white ${isSubmitting
                                    ? "bg-blue-300 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                    } transition`}
                            >
                                {isSubmitting ? "Submitting..." : "Submit Request"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UnsuspendRequest;