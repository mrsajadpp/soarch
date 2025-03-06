"use client";
import { useState, useRef, useEffect } from "react";
import axios, { AxiosError } from "axios";
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import Link from "next/link";

interface Message {
  type: 'user' | 'bot' | 'error';
  content: string;
  result?: {
    fact: string;
    confidence_level: number;
    explanation: string;
  };
  isRegenerated?: boolean;
  key?: number; // Add this new property
  isWelcomeMessage?: boolean; // Add this new property
}

interface ApiError {
  message: string;
}

const getProgressBarColor = (fact: string) => {
  if (fact == "fake") return styles.progressDanger;
  if (fact == "misleading") return styles.progressWarning;
  return styles.progressSuccess;
};

// Add this helper function before the Home component
const isLastBotMessage = (messages: Message[], currentIndex: number) => {
  // Don't show regenerate for the welcome message
  if (messages[currentIndex].isWelcomeMessage) return false;
  
  for (let i = currentIndex + 1; i < messages.length; i++) {
    if (messages[i].type === 'bot' || messages[i].type === 'error') {
      return false;
    }
  }
  return true;
};

export default function Home() {
  const [news, setNews] = useState("");
  const [messages, setMessages] = useState<Message[]>([{
    type: 'bot',
    content: 'വസ്തുതാപരിശോധന നടത്തേണ്ട മലയാള വാർത്ത പങ്കുവയ്ക്കുക',  // "Please share your Malayalam news that needs to be fact-checked"
    key: 0,
    isWelcomeMessage: true  // Add this flag for the welcome message
  }]);
  const [loading, setLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  // const currentYear = new Date().getFullYear();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkFact = async () => {
    if (!news.trim()) return;

    const userMessage: Message = {
      type: 'user',
      content: news
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setNews("");

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/api/fact_check/fact_check`, { claim: news });
      const botMessage: Message = {
        type: 'bot',
        content: 'Here is what I found:',
        result: response.data.fact_check
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const errorMessage: Message = {
        type: 'error',
        content: `${error.response?.data?.message || "Failed to verify the fact due to high demand. The server is busy, please try again later or click regenerate."} Check server status at: `
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const regenerateResult = async (originalMessage: string) => {
    setLoading(true);
    setAnimationKey(prev => prev + 1); // Increment key to force animation replay

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/api/fact_check/fact_check`, { claim: originalMessage });
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        if (lastIndex >= 0) {
          newMessages[lastIndex] = {
            type: 'bot',
            content: 'Here is what I found:',
            result: response.data.fact_check,
            key: animationKey // Add animation key
          };
        }
        return newMessages;
      });
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        if (lastIndex >= 0) {
          newMessages[lastIndex] = {
            type: 'error',
            content: `${error.response?.data?.message || "Failed to verify the fact due to high demand. The server is busy, please try again later or click regenerate."} Check server status at: `,
            isRegenerated: true,
            key: animationKey // Add animation key
          };
        }
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.logoWrapper}>
            <Image
              src="/logo.png"
              alt="VerifEye Logo"
              width={180}
              height={60}
              priority
              style={{ height: 'auto' }}
            />
          </div>

          <p className={styles.subtitle}>
            Your AI-Powered Truth Detective for Malayalam
          </p>

          <div className={styles.inputSection}>
            <div className={styles.chatContainer} ref={chatContainerRef}>
              {messages.map((message, index) => (
                <div
                  key={`${index}-${message.key || 0}`} // Update key to include animation key
                  className={styles.messageContainer}
                  ref={index === messages.length - 1 ? lastMessageRef : null}
                >
                  <div className={`${styles.messageWrapper} ${message.type === 'user' ? styles.userMessage : styles.botMessage}`}>
                    <div className={`${styles.messageBubble} ${
                      message.type === 'user' ? styles.userBubble :
                      message.type === 'error' ? `${styles.errorBubble} ${message.isRegenerated ? styles.regenerated : ''}` :
                      styles.botBubble
                    }`}>
                      {message.type === 'error' ? (
                        <>
                          <span className={styles.errorIcon}>⚠️</span>
                          {message.content}
                          <a 
                            href="https://stats.uptimerobot.com/kI635bpdY6" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.serverStatusLink}
                          >
                            Server Status Page
                          </a>
                        </>
                      ) : (
                        <>
                          <p>{message.content}</p>
                          {message.result && (
                            <div className={styles.resultSection}>
                              <div className={styles.progressBar}>
                                <div
                                  className={`${styles.progressFill} ${getProgressBarColor(message.result.fact)}`}
                                  style={{ width: `${message.result.confidence_level}%` }}
                                />
                              </div>
                              <div className={styles.resultContent}>
                                <p className={`${styles.resultStatus} ${message.result.fact === "real" ? styles.statusTrue :
                                    message.result.fact === "fake" ? styles.statusFalse :
                                      styles.statusUncertain
                                  }`}>
                                  {message.result.fact.toUpperCase()} • {message.result.confidence_level}% confidence
                                </p>
                                <p className={styles.resultText}>{message.result.explanation}</p>
                                <div className={styles.inlineWarning}>
                                  <span>⚠️</span>
                                  <span>AI-generated results may not always be 100% accurate. Please verify important information from multiple reliable sources.</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  {message.type !== 'user' && isLastBotMessage(messages, index) && (
                    <div className={styles.messageActions}>
                      <button
                        className={styles.regenerateButton}
                        onClick={() => regenerateResult(messages[index - 1]?.content || '')}
                        disabled={loading}
                      >
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                          <path d='M20.5 8c-1.392-3.179-4.823-5-8.522-5C7.299 3 3.453 6.552 3 11.1' />
                          <path d='M16.489 8.4h3.97A.54.54 0 0 0 21 7.86V3.9M3.5 16c1.392 3.179 4.823 5 8.522 5 4.679 0 8.525-3.552 8.978-8.1' />
                          <path d='M7.511 15.6h-3.97a.54.54 0 0 0-.541.54v3.96' />
                        </svg>
                        Regenerate response
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.inputControlsContainer}>
            <div className={styles.inputControlsWrapper}>
              <div className={styles.inputControls}>
                <textarea
                  className={styles.textarea}
                  placeholder="(200 Max-length)Type your news in pure malayalam..."
                  value={news}
                  maxLength={200}
                  onChange={(e) => setNews(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      checkFact();
                    }
                  }}
                />
                <button
                  onClick={checkFact}
                  className={styles.verifyButton}
                  disabled={loading || !news.trim()}
                >
                  {loading ? (
                    <div className={styles.loadingSpinner} />
                  ) : (
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                      <path d='m14 10-3 3m9.288-9.969a.535.535 0 0 1 .68.681l-5.924 16.93a.535.535 0 0 1-.994.04l-3.219-7.242a.54.54 0 0 0-.271-.271l-7.242-3.22a.535.535 0 0 1 .04-.993z' />
                    </svg>
                  )}
                </button>
              </div>
              <div className={styles.privacyWarning}>
                We will collect the news data to enhance our dataset, read <Link href="/privacy">privacy policy</Link> to learn how we collect and manage your data
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}