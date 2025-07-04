'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getParentingInsight } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Insight } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Loader2, Lightbulb, ClipboardCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Generate Insight
    </Button>
  );
}

export default function InsightsPage() {
  const initialState = { errors: {}, data: null };
  const [state, dispatch] = useFormState(getParentingInsight, initialState);
  const [insight, setInsight] = useState<Insight | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.data) {
      setInsight(state.data);
    }
    if (state.errors?._form) {
       toast({
        variant: "destructive",
        title: "Error",
        description: state.errors._form[0],
      });
    }
  }, [state, toast]);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Parenting Insights</h1>
        <p className="mt-2 text-muted-foreground">
          Describe your baby's activity and your parenting approach to receive personalized, AI-driven advice.
        </p>
      </div>

      <Card>
        <form action={dispatch}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="babyActivityDescription">Baby's Current Activity</Label>
              <Textarea
                id="babyActivityDescription"
                name="babyActivityDescription"
                placeholder="e.g., 'Baby is crying and seems fussy after their nap.'"
                rows={3}
                required
              />
              {state.errors?.babyActivityDescription && <p className="text-sm font-medium text-destructive">{state.errors.babyActivityDescription[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentingGoals">Your Parenting Goals</Label>
              <Input
                id="parentingGoals"
                name="parentingGoals"
                placeholder="e.g., 'Encourage independent sleep.'"
                required
              />
               {state.errors?.parentingGoals && <p className="text-sm font-medium text-destructive">{state.errors.parentingGoals[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentingStyles">Your Parenting Styles</Label>
              <Input
                id="parentingStyles"
                name="parentingStyles"
                placeholder="e.g., 'Attachment parenting, responsive.'"
                required
              />
               {state.errors?.parentingStyles && <p className="text-sm font-medium text-destructive">{state.errors.parentingStyles[0]}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {insight && (
        <Card className="bg-primary/10">
          <CardHeader>
            <CardTitle>Your Personalized Insight</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary" /> Insight</h3>
              <p className="text-muted-foreground">{insight.insight}</p>
            </div>
            <div>
              <h3 className="font-semibold flex items-center gap-2"><ClipboardCheck className="h-5 w-5 text-accent" /> Recommendation</h3>
              <p className="text-muted-foreground">{insight.recommendation}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
