import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Trophy } from 'lucide-react';

const CREDIT_SCORE_KEY = 'user-credit-score';

const CreditScore: React.FC = () => {
  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem(CREDIT_SCORE_KEY);
    return savedScore ? parseInt(savedScore) : 650;
  });

  useEffect(() => {
    localStorage.setItem(CREDIT_SCORE_KEY, score.toString());
  }, [score]);

  const getScoreCategory = () => {
    if (score >= 800) return ['Exceptional', 'text-green-500'];
    if (score >= 740) return ['Very Good', 'text-green-400'];
    if (score >= 670) return ['Good', 'text-yellow-500'];
    if (score >= 580) return ['Fair', 'text-orange-500'];
    return ['Poor', 'text-red-500'];
  };

  const [category, colorClass] = getScoreCategory();

  return (
    <Card className="p-6 bg-card/50 border-border/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium">Credit Score</h3>
          <p className="text-sm text-muted-foreground">Slide to update your score</p>
        </div>
        <Trophy className={`h-5 w-5 ${colorClass}`} />
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <div className={`text-4xl font-bold ${colorClass} mb-1`}>
            {score}
          </div>
          <div className={`text-sm font-medium ${colorClass}`}>
            {category}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="credit-score">Adjust Your Credit Score</Label>
          <Slider
            id="credit-score"
            min={300}
            max={850}
            step={1}
            value={[score]}
            onValueChange={([value]) => setScore(value)}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-5 text-center text-xs">
          <div>
            <div className="text-red-500 font-medium">Poor</div>
            <div className="text-muted-foreground">300-579</div>
          </div>
          <div>
            <div className="text-orange-500 font-medium">Fair</div>
            <div className="text-muted-foreground">580-669</div>
          </div>
          <div>
            <div className="text-yellow-500 font-medium">Good</div>
            <div className="text-muted-foreground">670-739</div>
          </div>
          <div>
            <div className="text-green-400 font-medium">Very Good</div>
            <div className="text-muted-foreground">740-799</div>
          </div>
          <div>
            <div className="text-green-500 font-medium">Excellent</div>
            <div className="text-muted-foreground">800-850</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CreditScore;
