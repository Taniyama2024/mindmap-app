import React, { useState } from 'react';

interface PasswordScreenProps {
  onPasswordSubmit: (password: string) => void;
  error?: string;
}

const PasswordScreen: React.FC<PasswordScreenProps> = ({ onPasswordSubmit, error }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onPasswordSubmit(password);
    }
  };

  return (
    <div className="password-screen">
      <div className="password-container">
        <div className="password-card">
          <div className="logo-section">
            <div className="logo-icon">🧠</div>
            <h1 className="title">マインドマップ</h1>
            <p className="subtitle">個人用マインドマップツール</p>
          </div>

          <form onSubmit={handleSubmit} className="password-form">
            <div className="input-group">
              <label htmlFor="password" className="label">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                className="input"
                autoFocus
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button type="submit" className="submit-button">
              ログイン
            </button>
          </form>

          <div className="info-text">
            暗号化されたマインドマップを安全に管理します
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordScreen;
