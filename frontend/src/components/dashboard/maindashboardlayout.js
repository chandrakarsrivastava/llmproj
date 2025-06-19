import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './dashboard-options';
import Settings from './settings';
import ManualLanguageTranslation from '../uimodules/manual-language-translation';
import PSDBChat from '../uimodules/PSDBChat';
import DocProofReview from '../uimodules/DocProofReview';
import './maindashboardlayout.css';

const navItems = [
    { key: 'services', label: 'Services' },
    { key: 'settings', label: 'Settings' },
    { key: 'logout', label: 'Logout' },
];

const MainDashboardLayout = () => {
    const [activeKey, setActiveKey] = useState('services');
    const [dashboardCard, setDashboardCard] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (activeKey === 'logout') {
            navigate('/');
        }
    }, [activeKey, navigate]);

    let content = null;
    if (activeKey === 'services') {
        if (!dashboardCard) {
            content = (
                <Dashboard
                    onCardClick={(cardKey) => setDashboardCard(cardKey)}
                />
            );
        } else if (dashboardCard === 'preinstall') {
            content = <ManualLanguageTranslation />;
        } else if (dashboardCard === 'psdb') {
            content = <PSDBChat />;
        } else if (dashboardCard === 'docproof') {
            content = <DocProofReview />;
        }
    } else if (activeKey === 'settings') {
        content = <Settings />;
    }

    const handleNavClick = (key) => {
        setActiveKey(key);
        setDashboardCard(null); // Reset card selection when changing menu
    };

    return (
        <div className="main-dashboard-layout">
            {/* Left Navigation */}
            <nav className="main-dashboard-nav">
                <ul className="main-dashboard-nav-list">
                    {navItems.map(item => (
                        <li key={item.key}>
                            <button
                                className={`main-dashboard-nav-btn${activeKey === item.key ? ' active' : ''}`}
                                onClick={() => handleNavClick(item.key)}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Main Content */}
            <main className="main-dashboard-content">
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="main-dashboard-breadcrumb">
                    <ol>
                        <li>Home</li>
                        <li>/</li>
                        <li>
                            {activeKey.charAt(0).toUpperCase() + activeKey.slice(1)}
                        </li>
                        {activeKey === 'services' && dashboardCard && (
                            <>
                                <li>/</li>
                                <li>
                                    {dashboardCard === 'preinstall' && 'Manual Language Translation'}
                                    {dashboardCard === 'psdb' && 'PSDB Chat'}
                                    {dashboardCard === 'docproof' && 'Doc Proof Review'}
                                </li>
                            </>
                        )}
                    </ol>
                </nav>
                {content}
            </main>
        </div>
    );
};

export default MainDashboardLayout;