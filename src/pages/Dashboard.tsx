import { useNavigate } from 'react-router-dom';
import { useWellbeingStore } from '../store/wellbeing';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export function Dashboard() {
  const navigate = useNavigate();
  const { logs, exportLogs, importLogs } = useWellbeingStore();

  const latestLog = logs.length > 0 ? logs[logs.length - 1] : null;
  const totalLogs = logs.length;
  const totalExercises = logs.reduce(
    (sum, log) => sum + log.exercises.length,
    0
  );
  const avgMood =
    logs.length > 0
      ? (logs.reduce((sum, log) => sum + log.mood, 0) / logs.length).toFixed(1)
      : '0';

  const handleExport = () => {
    const data = exportLogs();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cho-training-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        const data = JSON.parse(text);
        importLogs(data);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleImport}>
            Import
          </Button>
          <Button variant="secondary" onClick={handleExport}>
            Export
          </Button>
          <Button onClick={() => navigate('/log')}>New Log</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-sm text-gray-500 mb-1">Total Logs</div>
          <div className="text-3xl font-bold">{totalLogs}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500 mb-1">Total Exercises</div>
          <div className="text-3xl font-bold">{totalExercises}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500 mb-1">Avg Mood</div>
          <div className="text-3xl font-bold">{avgMood}</div>
        </Card>
      </div>

      {latestLog ? (
        <Card>
          <h2 className="text-xl font-bold mb-4">Latest Log</h2>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-500">Date:</span>{' '}
              <span className="font-medium">{latestLog.date}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Exercises:</span>{' '}
              <span className="font-medium">
                {latestLog.exercises.join(', ')}
              </span>
            </div>
            <div className="flex gap-4">
              <div>
                <span className="text-sm text-gray-500">Mood:</span>{' '}
                <span className="font-medium">{latestLog.mood}/10</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Energy:</span>{' '}
                <span className="font-medium">{latestLog.energy}/10</span>
              </div>
            </div>
            {latestLog.notes && (
              <div>
                <span className="text-sm text-gray-500">Notes:</span>{' '}
                <p className="mt-1">{latestLog.notes}</p>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">No logs yet. Start tracking your wellbeing!</p>
            <Button onClick={() => navigate('/log')}>Create First Log</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
