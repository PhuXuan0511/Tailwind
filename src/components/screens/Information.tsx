import React from "react";
import { useNavigate } from "react-router-dom";

const InfoRules: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen py-10 relative overflow-hidden bg-library-gradient">
            <svg
                className="absolute opacity-10 w-[500px] h-[500px] -right-40 -bottom-40 pointer-events-none"
                viewBox="0 0 500 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="250" cy="250" r="250" fill="url(#paint1_radial)" />
                <defs>
                    <radialGradient
                        id="paint1_radial"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientTransform="translate(250 250) scale(250)"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#60a5fa" />
                        <stop offset="1" stopColor="#1e3a8a" stopOpacity="0" />
                    </radialGradient>
                </defs>
            </svg>
            <div className="w-full max-w-5xl px-4 md:px-8">
                {/* Back Button */}
                <div className="mb-6 flex">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1.5 rounded-lg text-sm shadow transition font-semibold"
                    >
                        ← Back
                    </button>
                </div>
                <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-100 tracking-wide drop-shadow">Library Rules</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                        {/* Borrowing & Returning Books */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-2 text-blue-200">1. Borrowing & Returning Books</h2>
                            <ul className="list-disc list-inside space-y-1 text-white">
                                <li>Library members can borrow up to <span className="font-medium">5 books</span> at a time.</li>
                                <li>Borrowing period: <span className="font-medium">7 days</span>.</li>
                                <ul className="list-none ml-8">
                                    <li>Renewals are allowed for an additional <span className="font-medium">7 days</span> if no holds are placed on the book.</li>
                                    <li>Renewals are <span className="font-medium">free of charge</span> and must be done at least <span className="font-medium">2 days</span> before due.</li>
                                </ul>
                                <li>Late return penalty:
                                    <ul className="list-none ml-8">
                                        <li>First week overdue: <span className="font-medium">$1 per day</span> per book.</li>
                                        <li>Each next week adds <span className="font-medium">50 cents</span> to the rate above.</li>
                                    </ul>
                                </li>
                                <li>Books must be returned in the same condition as borrowed.</li>
                                <li>Lost or damaged books must be replaced or paid for as follows:
                                    <ul className="list-none ml-8">
                                        <li>Price of each book (<span className="font-medium">double</span> if no longer published).</li>
                                        <li>Technical processing fee of <span className="font-medium">$10</span> each.</li>
                                        <li>Shipping fee depending on the material.</li>
                                    </ul>
                                </li>
                            </ul>
                        </section>
                        {/* Membership Rules */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-2 text-blue-200">2. Membership Rules</h2>
                            <ul className="list-disc list-inside space-y-1 text-white">
                                <li>Library membership is required for borrowing books.</li>
                                <li>Membership can be revoked due to repeated violations.</li>
                            </ul>
                        </section>
                        {/* Library Conduct */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-2 text-blue-200">3. Library Conduct</h2>
                            <ul className="list-disc list-inside space-y-1 text-white">
                                <li>Maintain silence in reading areas.</li>
                                <li>No food or drinks near bookshelves.</li>
                                <li>Be respectful to staff and other visitors.</li>
                            </ul>
                        </section>
                    </div>
                    <div>
                        {/* Digital Resources & Internet Usage */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-2 text-blue-200">4. Digital Resources & Internet Usage</h2>
                            <ul className="list-disc list-inside space-y-1 text-white">
                                <li>Public computers are available for research and study.</li>
                                <li>Access to certain websites may be restricted.</li>
                                <li>Printing services available at:
                                    <ul className="list-none ml-8">
                                        <li><span className="font-medium">5 cents</span> per black-and-white page.</li>
                                        <li><span className="font-medium">25 cents</span> per colour page.</li>
                                    </ul>
                                </li>
                            </ul>
                        </section>
                        {/* Violations */}
                        <section className="mt-8">
                            <h2 className="text-xl font-semibold mb-2 text-blue-200">5. Violations</h2>
                            <ul className="list-disc list-inside space-y-1 text-white">
                                <li>
                                    Below is a list of possible violations:
                                    <ul className="list-none ml-8">
                                        <li>Late book returns.</li>
                                        <li>Damaging library property.</li>
                                        <li>Stealing library materials.</li>
                                        <li>Disruptive behaviour in the library.</li>
                                        <li>Unauthorised usage of others' library cards.</li>
                                        <li>Unauthorised copying or distribution of library materials.</li>
                                        <li>Unauthorised usage of library resources for commercial purposes.</li>
                                        <li>Failure to comply with staff instructions.</li>
                                    </ul>
                                </li>
                                <li>It is advised not to assume that anything uncovered here is allowed.</li>
                                <li>Violations of library rules may result in warnings, fines, or revocation of membership.</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoRules;