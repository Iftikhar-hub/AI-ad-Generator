import AdForm from "../components/AdForm.jsx";
import AdFeed from "../components/AdFeed.jsx";
import { useState } from "react";

export default function Home() {
    const [refreshFeed, setRefreshFeed] = useState(false);

    const handleAdPosted = () => setRefreshFeed(prev => !prev);

    return (
        <div style={{ paddingTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <AdForm onAdPosted={handleAdPosted} />
            <AdFeed key={refreshFeed} />
        </div>
    );
}
