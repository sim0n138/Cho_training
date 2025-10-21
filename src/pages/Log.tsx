import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWellbeingStore } from '../store/wellbeing';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { RangeSlider } from '../components/RangeSlider';

export function Log() {
  const navigate = useNavigate();
  const { addLog } = useWellbeingStore();

  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [exercises, setExercises] = useState('');
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const exerciseList = exercises
      .split(',')
      .map((ex) => ex.trim())
      .filter((ex) => ex.length > 0);

    if (exerciseList.length === 0) {
      alert('Please enter at least one exercise');
      return;
    }

    addLog({
      date,
      exercises: exerciseList,
      mood,
      energy,
      notes,
    });

    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">New Log</h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <div>
            <label className="block mb-1 text-sm font-medium text-black">
              Exercises (comma-separated)
            </label>
            <Input
              placeholder="e.g., Running, Yoga, Meditation"
              value={exercises}
              onChange={(e) => setExercises(e.target.value)}
              required
            />
          </div>

          <RangeSlider label="Mood" value={mood} onChange={setMood} />

          <RangeSlider label="Energy" value={energy} onChange={setEnergy} />

          <div>
            <label className="block mb-1 text-sm font-medium text-black">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-white border border-gray-300 text-black placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              placeholder="How did you feel? Any observations?"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit">Save Log</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
