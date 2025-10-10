# Exercise Database Documentation

## Overview

The Cho Training application includes a comprehensive database of 340+ scientifically-based exercises, all in Russian language. The exercises are organized into three main categories:

- **Растяжка (Stretching)**: 120 exercises
- **ЛФК (Therapeutic/Rehabilitation)**: 120 exercises  
- **Медитация (Meditation)**: 100 exercises

## Database Structure

All exercises are stored in `/src/data/exercises.js` and exported as a single `EXERCISES` object.

### Exercise Object Schema

Each exercise follows this structure:

```javascript
{
  id: string,           // Unique identifier (e.g., 's1', 'l45', 'm23')
  name: string,         // Exercise name in Russian
  duration: number,     // Duration in minutes
  level: number,        // Difficulty level: 1 (beginner), 2 (intermediate), 3 (advanced)
  areas: string[]       // Body areas involved: ['legs', 'back', 'arms', 'chest', 'neck', 'core', 'shoulders', 'hips']
}
```

## Exercise Categories

### 1. Растяжка (Stretching) - 120 Exercises

Improves flexibility, mobility, and range of motion.

**Subcategories:**
- **Legs/Lower Body** (40 exercises): Quadriceps, hamstrings, calves, hip flexors, adductors
- **Back & Spine** (30 exercises): Lumbar, thoracic, cervical spine, latissimus dorsi, erector spinae
- **Arms & Shoulders** (25 exercises): Biceps, triceps, deltoids, rotator cuff, forearms
- **Chest & Upper Body** (15 exercises): Pectorals, intercostals, anterior chain
- **Neck & Full Body** (10 exercises): Cervical muscles, compound stretches

**Example Exercises:**
- Растяжка квадрицепса стоя (Standing quadriceps stretch)
- Поза голубя (Pigeon pose - yoga)
- Кошка-корова (Cat-cow pose)
- Скручивание позвоночника сидя (Seated spinal twist)

### 2. ЛФК (Therapeutic/Rehabilitation) - 120 Exercises

Rehabilitation and strengthening exercises based on physical therapy principles.

**Subcategories:**
- **Lower Body Therapeutic** (40 exercises): Knee, hip, ankle rehabilitation
- **Back & Spine Therapeutic** (40 exercises): Spinal conditions, posture correction
- **Core & Upper Body** (25 exercises): Core stability, shoulder rehabilitation
- **Respiratory & Postural** (15 exercises): Breathing exercises, postural drainage

**Example Exercises:**
- ЛФК при остеохондрозе поясничного отдела (LFC for lumbar osteochondrosis)
- Упражнения при сколиозе (Exercises for scoliosis)
- ЛФК при коксартрозе (LFC for hip osteoarthritis)
- Дыхательная гимнастика при астме (Breathing exercises for asthma)

### 3. Медитация (Meditation) - 100 Exercises

Mental wellness, stress reduction, and mindfulness practices.

**Subcategories:**
- **Mindfulness & Breath** (30 exercises): Breath awareness, present moment focus
- **Body Scan & Relaxation** (25 exercises): Progressive relaxation, yoga nidra
- **Visualization** (20 exercises): Guided imagery, positive thinking
- **Loving-Kindness** (15 exercises): Compassion practices, metta meditation
- **Special Practices** (10 exercises): Advanced techniques, chakra meditation

**Example Exercises:**
- Базовая медитация на дыхании (Basic breath meditation)
- Сканирование тела (Body scan)
- Йога-нидра (Yoga nidra)
- Медитация любящей доброты (Loving-kindness meditation)

## Scientific Basis

All exercises are based on established principles from:

- **Sports Medicine**: Stretching and flexibility techniques
- **Physical Therapy**: Rehabilitation protocols for common conditions
- **Yoga & Eastern Practices**: Traditional mind-body exercises adapted for wellness
- **Mindfulness Research**: Evidence-based meditation techniques
- **Respiratory Therapy**: Breathing exercises for lung health

### Difficulty Levels

Exercises are categorized by difficulty:

- **Level 1 (Beginner)**: Safe for everyone, low risk, basic movements
- **Level 2 (Intermediate)**: Requires some experience, moderate intensity
- **Level 3 (Advanced)**: Requires significant experience, high intensity

## Integration with Program Generator

The exercise database integrates seamlessly with the Program Generator:

### RPE-Based Filtering

- **High RPE (7-10)**: Only Level 1 exercises are included for safety
- **Medium RPE (4-6)**: Levels 1-2 exercises are available
- **Low RPE (1-3)**: All levels (1-3) are available

### Pain Area Filtering

When users report pain, exercises targeting those areas are excluded:

```javascript
Pain Areas:
- Ноги (Legs) → excludes exercises with 'legs' area
- Спина (Back) → excludes exercises with 'back' area  
- Руки (Arms) → excludes exercises with 'arms' area
- Грудь (Chest) → excludes exercises with 'chest' area
- Всё тело (Full Body) → excludes all body area exercises
```

### Duration Packing

The program generator uses a greedy algorithm to pack exercises within ±10% of target durations:
- Stretching: 15 minutes target
- LFC: 20 minutes target
- Meditation: 10 minutes target

## Future Enhancements

Potential additions to the exercise database:

1. **More Specific Targeting**: Equipment-based exercises, time-of-day recommendations
2. **Progression Tracking**: Exercise variations for gradual progression
3. **Video/Image References**: Visual guides for proper form
4. **Contraindications**: Specific warnings for medical conditions
5. **Scientific References**: Citations to research supporting each exercise
6. **User Feedback**: Rating system for exercise effectiveness
7. **Custom Exercises**: Allow users to add their own exercises

## Maintenance

When adding new exercises:

1. Follow the existing naming convention (Russian language)
2. Assign appropriate difficulty level (1-3)
3. Tag with relevant body areas
4. Set realistic duration (3-40 minutes typical)
5. Ensure scientific validity
6. Run linter and build tests
7. Verify program generator still functions correctly

## References

The exercise database draws from:
- Russian physical therapy protocols (ЛФК методики)
- International yoga standards (йога практики)
- Evidence-based mindfulness techniques (медитация)
- Sports medicine best practices (спортивная медицина)
