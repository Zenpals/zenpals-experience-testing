import React, { useEffect, useState,useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const AuthServiceCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokens, setTokens] = useState(null);
  const location = useLocation();
  const hasRun = useRef(false);
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    // console.log(code)
    if (code && ( code !=null || code!='')) {
      window.history.replaceState(null, '', '/auth-service-callback');
      const fetchTokens = async () => {
        console.log(code,"jo")
        try {
          setLoading(true);
          setError(null);

          const response = await axios.get(`http://localhost:8081/auth-service-api/auth/code-for-token-exchange/${code}`);
          
          console.log("✅ Token exchange success:", response.data);

          // Optional: Ensure expected keys are present
          if (response.data.access_token && response.data.refresh_token) {
            setTokens(response.data);
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
          } else {
            throw new Error("Missing tokens in response");
          }

          // ✅ Clean URL to prevent double exchange
          // window.history.replaceState(null, '', '/auth-service-callback');

        } catch (err) {
          console.error("❌ Token exchange error:", err);
          setError('Error exchanging code for tokens');
        } finally {
          setLoading(false);
        }
      };

      fetchTokens();
    } else {
      setError('No code found in URL');
      setLoading(false);
    }
  }, [location.search]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Auth Service Callback</h2>
      {tokens ? (
        <div>
          <h3>✅ Tokens received!</h3>
          <pre>{JSON.stringify(tokens, null, 2)}</pre>
        </div>
      ) : (
        <div>❌ No tokens received yet.</div>
      )}
    </div>
  );
};

export default AuthServiceCallback;
