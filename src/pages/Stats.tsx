import { useState } from 'react';
import { useWellbeingStore } from '../store/wellbeing';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import type { WellbeingLog } from '../types';

export function Stats() {
  const { logs, deleteLog, getStats } = useWellbeingStore();
  const [selectedLog, setSelectedLog] = useState<WellbeingLog | null>(null);

  const stats = getStats();
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this log?')) {
      deleteLog(id);
      setSelectedLog(null);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Statistics</h1>

      {stats.length === 0 ? (
        <Card>
          <div className="text-center py-8 text-gray-500">
            <p>No statistics available yet.</p>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.slice(0, 10).map((stat) => (
              <Card key={stat.date}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold mb-2">{stat.date}</div>
                    <div className="text-sm text-gray-500 space-y-1">
                      <div>Exercises: {stat.exerciseCount}</div>
                      <div>Mood: {stat.avgMood.toFixed(1)}/10</div>
                      <div>Energy: {stat.avgEnergy.toFixed(1)}/10</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">All Logs</h2>
            <div className="space-y-2">
              {sortedLogs.map((log) => (
                <Card
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{log.date}</div>
                      <div className="text-sm text-gray-500">
                        {log.exercises.join(', ')}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      M: {log.mood} | E: {log.energy}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      <Modal
        isOpen={selectedLog !== null}
        onClose={() => setSelectedLog(null)}
        title="Log Details"
      >
        {selectedLog && (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Date</div>
              <div className="font-medium">{selectedLog.date}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Exercises</div>
              <div className="font-medium">{selectedLog.exercises.join(', ')}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Mood</div>
                <div className="font-medium">{selectedLog.mood}/10</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Energy</div>
                <div className="font-medium">{selectedLog.energy}/10</div>
              </div>
            </div>
            {selectedLog.notes && (
              <div>
                <div className="text-sm text-gray-500 mb-1">Notes</div>
                <div>{selectedLog.notes}</div>
              </div>
            )}
            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={() => handleDelete(selectedLog.id)}
                className="w-full"
              >
                Delete Log
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
