import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface AccuracyMetrics {
  overall_accuracy: number | null;
  correct_predictions: number;
  total_evaluated: number;
  total_predictions: number;
}

interface OfferStatistics {
  total_offers: number;
  waiting_offers: number;
  accepted_offers: number;
  declined_offers: number;
}

interface ClassificationResultsProps {
  accuracyMetrics: AccuracyMetrics | null;
  offerStatistics: OfferStatistics;
}

const COLORS = {
  accepted: 'hsl(142, 76%, 36%)', // green
  declined: 'hsl(0, 84%, 60%)', // red  
  waiting: 'hsl(220, 13%, 69%)', // grey
};

export const ClassificationResults = ({ accuracyMetrics, offerStatistics }: ClassificationResultsProps) => {
  const pieData = [
    { name: 'Accepted', value: offerStatistics.accepted_offers, color: COLORS.accepted },
    { name: 'Declined', value: offerStatistics.declined_offers, color: COLORS.declined },
    { name: 'Waiting', value: offerStatistics.waiting_offers, color: COLORS.waiting },
  ].filter(item => item.value > 0); // Only show non-zero values

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for very small slices
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="500"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-muted shadow-glow">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">
          Classification Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Accuracy Metrics */}
          <div className="flex-1">
            <div className="mb-6">
              <div className="text-4xl font-bold text-primary mb-2">
                {accuracyMetrics?.overall_accuracy !== null && accuracyMetrics?.overall_accuracy !== undefined
                  ? `${(accuracyMetrics.overall_accuracy * 100).toFixed(2)}%`
                  : '-.--%'
                }
              </div>
              <div className="text-lg font-medium text-muted-foreground">
                Overall Accuracy
              </div>
              {(!accuracyMetrics || accuracyMetrics.overall_accuracy === null) && (
                <div className="text-sm text-muted-foreground mt-2">
                  Waiting for users to respond to offers...
                </div>
              )}
            </div>
            
            {accuracyMetrics ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-foreground">Correct Predictions:</span>
                  <span className="font-medium text-foreground">{accuracyMetrics.correct_predictions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Total Evaluated:</span>
                  <span className="font-medium text-foreground">{accuracyMetrics.total_evaluated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Total Predictions:</span>
                  <span className="font-medium text-foreground">{accuracyMetrics.total_predictions}</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                No accuracy data available yet
              </div>
            )}
          </div>

          {/* Right side - Offer Statistics */}
          <div className="flex-1">
            <div className="mb-6">
              <div className="text-4xl font-bold text-primary mb-2">
                {offerStatistics.total_offers}
              </div>
              <div className="text-lg font-medium text-muted-foreground">
                Total Offers
              </div>
            </div>

            {/* Pie Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry: any) => (
                      <span style={{ color: entry.color }}>
                        {value}: {entry.payload.value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};