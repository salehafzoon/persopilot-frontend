import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { trainAndPredict, TrainAndPredictResponse, AccuracyMetrics, OfferStatistics } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface PredictionDetail {
  [key: string]: any; // Dynamic keys from prediction_details
}

interface Prediction {
  prediction_date: string;
  [key: string]: any;
}

interface ClassificationResultsProps {
  accuracyMetrics: AccuracyMetrics | null;
  offerStatistics: OfferStatistics;
  predictionDetails?: PredictionDetail[];
  predictions?: Prediction[];
  classificationTaskId?: number;
  hideRecentPredictions?: boolean;
  onResultsUpdate?: (data: { accuracyMetrics: AccuracyMetrics | null; offerStatistics: OfferStatistics; predictionDetails?: PredictionDetail[]; predictions?: Prediction[]; }) => void;
}

const COLORS = {
  accepted: 'hsl(142, 76%, 36%)', // green
  declined: 'hsl(0, 84%, 60%)', // red  
  waiting: 'hsl(220, 13%, 69%)', // grey
};

export const ClassificationResults = ({ accuracyMetrics, offerStatistics, predictionDetails = [], predictions = [], classificationTaskId, hideRecentPredictions = false, onResultsUpdate }: ClassificationResultsProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleRandomClassification = async () => {
    if (!classificationTaskId) {
      toast({
        title: "Error",
        description: "No classification task selected",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await trainAndPredict(classificationTaskId);
      
      if (response.success === false) {
        // Handle insufficient data error
        toast({
          title: "Insufficient Training Data",
          description: response.error || "Not enough training data available",
          variant: "destructive",
        });
      } else {
        // Success - update the results
        if (onResultsUpdate && response.accuracy_metrics && response.offer_statistics) {
          onResultsUpdate({
            accuracyMetrics: response.accuracy_metrics,
            offerStatistics: response.offer_statistics,
            predictionDetails: response.predictions?.map((p: any) => ({ ...p })) || [],
            predictions: response.predictions || []
          });
        }
        toast({
          title: "Success",
          description: response.message || "Random classification completed successfully",
        });
      }
    } catch (error: any) {
      if (error.message && error.message.includes('404')) {
        toast({
          title: "Classification Task Not Found",
          description: "Classification task not found",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to perform random classification",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  const pieData = [
    { name: 'Accepted', value: offerStatistics.accepted_offers, color: COLORS.accepted },
    { name: 'Declined', value: offerStatistics.declined_offers, color: COLORS.declined },
    { name: 'Waiting', value: offerStatistics.waiting_offers, color: COLORS.waiting },
  ].filter(item => item.value > 0); // Only show non-zero values

  // Merge prediction details with prediction dates and sort by date
  const mergedData = predictionDetails.map((detail, index) => {
    const prediction = predictions[index] || {} as Prediction;
    return {
      ...detail,
      prediction_date: (prediction as any).prediction_date || 'N/A'
    };
  }).sort((a, b) => {
    if (a.prediction_date === 'N/A') return 1;
    if (b.prediction_date === 'N/A') return -1;
    return new Date(b.prediction_date).getTime() - new Date(a.prediction_date).getTime();
  }).slice(0, 20);

  // Get table columns (excluding prediction_date as it will be added as last column)
  const getTableColumns = () => {
    if (predictionDetails.length === 0) return [];
    const firstDetail = predictionDetails[0];
    return Object.keys(firstDetail).filter(key => key !== 'prediction_date');
  };

  const tableColumns = getTableColumns();

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
        <CardTitle className="text-xl font-bold text-foreground">
          Classification Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Accuracy Metrics */}
          <div className="flex-1">
            <div className="mb-6">
              <div className="text-3xl font-bold text-primary mb-2">
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
            <div className="flex items-center gap-6">
              {/* Total Offers */}
              <div className="flex-1">
                <div className="text-3xl font-bold text-primary mb-2">
                  {offerStatistics.total_offers}
                </div>
                <div className="text-lg font-medium text-muted-foreground">
                  Total Offers
                </div>
              </div>

              {/* Pie Chart */}
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={70}
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
        </div>

        {/* Prediction Details Table */}
        {mergedData.length > 0 && !hideRecentPredictions && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Recent Predictions (Last 20)
            </h3>
            <ScrollArea className="h-80 rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {tableColumns.map((column) => (
                      <TableHead key={column} className="capitalize">
                        {column.replace(/_/g, ' ')}
                      </TableHead>
                    ))}
                    <TableHead>Prediction Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mergedData.map((row, index) => (
                    <TableRow key={index}>
                      {tableColumns.map((column) => (
                        <TableCell key={column}>
                          {row[column]?.toString() || 'N/A'}
                        </TableCell>
                      ))}
                      <TableCell>
                        {row.prediction_date !== 'N/A' 
                          ? new Date(row.prediction_date).toLocaleDateString()
                          : 'N/A'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}
        
        {/* Random Classification Button */}
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={handleRandomClassification}
            disabled={isLoading || !classificationTaskId || !accuracyMetrics?.overall_accuracy}
            className="px-8 py-2"
          >
            {isLoading ? "Classifying..." : "Randomly Classify New Users"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};