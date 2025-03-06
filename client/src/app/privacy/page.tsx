import Image from 'next/image';
import Link from 'next/link';
import styles from './privacy.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | VerifEye News Fact Checker',
    description: 'Learn how VerifEye collects and manages news data to improve fact-checking accuracy while protecting your privacy.',
    keywords: 'privacy policy, data collection, news verification, user privacy, data protection, Malayalam fact checker privacy',
    openGraph: {
        title: 'Privacy Policy | VerifEye News Fact Checker',
        description: 'How we protect your privacy while improving our fact-checking service',
        images: ['/og-image.png'],
        url: 'https://verifeye.grovixlab.com/privacy',
    },
    twitter: {
        card: 'summary_large_image',
    },
}

export default function Privacy() {
    return (
        <>
            <div className={styles.mainContainer}>
                <div className={styles.contentWrapper}>
                    <Link href="/" className={styles.logoWrapper}>
                        <Image
                            src="/logo.png"
                            alt="VerifEye Logo"
                            width={180}
                            height={60}
                            priority
                            style={{ height: 'auto' }}
                        />
                    </Link>

                    <div className={styles.policyContainer}>
                        <h1>Privacy Policy</h1>
                        <p className={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</p>

                        <section>
                            <h2>Introduction</h2>
                            <p>VerifEye is developed and maintained by Grovix Lab. This privacy policy explains how we collect, use, and protect your information when you use our fact-checking service.</p>
                        </section>

                        <section>
                            <h2>Information We Collect</h2>
                            <p>We only collect:</p>
                            <ul>
                                <li>News content submitted for fact-checking</li>
                                <li>Fact-checking results and analysis</li>
                                <li>Usage patterns to improve our service</li>
                            </ul>
                            <p><strong>We do not collect personal information such as:</strong></p>
                            <ul>
                                <li>Names or identification details</li>
                                <li>Email addresses (unless you contact support)</li>
                                <li>Payment information</li>
                            </ul>
                        </section>

                        <section>
                            <h2>How We Use Collected Data</h2>
                            <p>The collected news data and fact-checking results are used to:</p>
                            <ul>
                                <li>Improve our fact-checking algorithms</li>
                                <li>Enhance the accuracy of our service</li>
                                <li>Develop better machine learning models</li>
                                <li>Research and analyze misinformation patterns</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Data Storage and Security</h2>
                            <p>We implement appropriate security measures to protect the data we collect. Our servers are secured and regularly monitored for potential vulnerabilities.</p>
                        </section>

                        <section>
                            <h2>Third-Party Services</h2>
                            <p>We may use third-party services for:</p>
                            <ul>
                                <li>Hosting and infrastructure</li>
                                <li>Analytics</li>
                                <li>Machine learning processing</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Contact Information</h2>
                            <p>If you have any questions or concerns about our privacy policy or data practices, please contact us at:</p>
                            <p><a href="mailto:support@grovixlab.com">support@grovixlab.com</a></p>
                        </section>

                        <section>
                            <h2>Changes to Privacy Policy</h2>
                            <p>We reserve the right to update this privacy policy at any time. Any changes will be reflected on this page with an updated date.</p>
                        </section>

                        <div className={styles.footer}>
                            <Link href="/" className={styles.backButton}>
                                ← Back to Fact Checker
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
