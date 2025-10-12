import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import './Profile.css';

/**
 * Profile page component
 * Simple profile page for user information
 */
function Profile() {
  return (
    <Layout>
      <div className="profile-page">
        <Card>
          <h2>👤 Профиль</h2>
          <p>Здесь будет информация о пользователе и настройки приложения.</p>
          <div className="profile-section">
            <h3>О приложении</h3>
            <p>Cho Training - это персональный трекер тренировок и самочувствия.</p>
            <p>Версия: 1.0.0</p>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

export default Profile;
