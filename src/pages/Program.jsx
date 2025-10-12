/**
 * Program page - Exercise program generation
 * Refactored to use ProgramGenerator component and programService
 */
import Layout from '../components/layout/Layout';
import { ProgramGenerator } from '../components/program';
import './Program.css';

/**
 * Program page component
 * Generates personalized exercise programs based on RPE and pain areas
 */
function Program() {
  return (
    <Layout>
      <div className="program-page">
        <ProgramGenerator useWellbeingData={true} />
      </div>
    </Layout>
  );
}

export default Program;
