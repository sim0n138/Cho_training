import { Component } from 'react';
import PropTypes from 'prop-types';
import { getCurrentLanguage } from '../i18n/config.js';
import translations from '../i18n/translations/index.js';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Здесь можно отправить ошибку в систему мониторинга
    // например, Sentry, LogRocket и т.д.
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const lang = getCurrentLanguage();
      const t = translations[lang] || translations.ru;

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h1>😞 {t.error.title}</h1>
            <p className="error-message">{t.error.message}</p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>{t.error.details}</summary>
                <pre>{this.state.error.toString()}</pre>
                {this.state.errorInfo && (
                  <pre>{this.state.errorInfo.componentStack}</pre>
                )}
              </details>
            )}

            <div className="error-actions">
              <button onClick={this.handleReload} className="btn-primary">
                🔄 {t.error.reload}
              </button>
              <button onClick={this.handleReset} className="btn-secondary">
                ↩️ {t.error.retry}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
