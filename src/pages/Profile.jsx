import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from '../i18n/useTranslation.js';
import { APP_VERSION, APP_NAME } from '../constants';
import './Profile.css';

/**
 * Profile page component
 * Simple profile page for user information
 */
function Profile() {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="profile-page">
        <Card>
          <h2>👤 {t('profile.title')}</h2>
          <div className="profile-section">
            <h3>{t('profile.settings')}</h3>
            <div className="setting-item">
              <label>{t('profile.language')}</label>
              <LanguageSwitcher />
            </div>
          </div>
          <div className="profile-section">
            <h3>
              {t('dashboard.welcome')} - {APP_NAME}
            </h3>
            <p>
              {APP_NAME} - это персональный трекер тренировок и самочувствия.
            </p>
            <p>Версия: {APP_VERSION}</p>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

export default Profile;
