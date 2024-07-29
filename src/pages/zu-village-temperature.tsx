import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp } from 'lucide-react';
import Layout from '../components/Layout';

export default function ZuVillageTemperature() {
  const [summary, setSummary] = useState<{ totalScores: any, sortedIdentities: string[] }>({ totalScores: {}, sortedIdentities: [] });
  const [chartData, setChartData] = useState<any[]>([]);
  const [assessmentData, setAssessmentData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState("90d");
  const [questionVotes, setQuestionVotes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get('/api/summary');
        setSummary(response.data);
        const data = response.data.sortedIdentities.map((identity: string) => ({
          identity,
          score: response.data.totalScores[identity],
        }));
        setChartData(data);

        // Fetch assessment data
        const assessmentResponse = await axios.get('/api/assessment-data');
        setAssessmentData(assessmentResponse.data);

        // Fetch question votes data
        const questionVotesResponse = await axios.get('/api/question-votes');
        setQuestionVotes(questionVotesResponse.data);
      } catch (error) {
        console.error('Error fetching summary data:', error);
      }
    };

    fetchSummary();
  }, []);

  const filteredAssessmentData = assessmentData.filter((item) => {
    const date = new Date(item.date);
    const now = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    now.setDate(now.getDate() - daysToSubtract);
    return date >= now;
  });

  const filteredQuestionVotes = questionVotes.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const chartConfig = {
    identity: {
      label: "Identity",
      color: "hsl(var(--chart-1))",
    },
    score: {
      label: "Score",
      color: "hsl(var(--chart-2))",
    },
    label: {
      color: "hsl(var(--background))",
    },
  } satisfies ChartConfig;

  const assessmentChartConfig = {
    totalAssessments: {
      label: "Total Assessments",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const questionVotesChartConfig = {
    optionText: {
      label: "Option",
      color: "hsl(var(--chart-1))",
    },
    count: {
      label: "Votes",
      color: "hsl(var(--chart-2))",
    },
    label: {
      color: "hsl(var(--background))",
    },
  } satisfies ChartConfig;

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center bg-background text-white p-4">
        <Card className="mb-8 w-full max-w-5xl min-h-screen">
          <CardHeader>
            <CardTitle>ZuVillage Temperature</CardTitle>
            <CardDescription>Summary of Assessment Results</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  width={700}
                  height={700} // Adjusted height for mobile responsiveness
                  className="w-full sm:h-[500px]" // Responsive height adjustment
                >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="identity"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <XAxis dataKey="score" type="number" hide />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Bar dataKey="score" layout="vertical" fill="var(--color-score)" radius={4}>
                  <LabelList dataKey="identity" position="insideLeft" offset={8} className="fill-[--color-label]" fontSize={12} />
                  <LabelList dataKey="score" position="right" offset={8} className="fill-foreground" fontSize={12} />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Top identities based on recent assessments
            </div>
            <div className="leading-none text-muted-foreground">
              Data aggregated from all community assessments
            </div>
          </CardFooter>
        </Card>

        <Card className="w-full max-w-5xl">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              <CardTitle>Total Assessments Over Time</CardTitle>
              <CardDescription>
                Showing total assessments for the last 3 months
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
                <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
                <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer config={assessmentChartConfig} className="aspect-auto h-[300px] w-full">
              <AreaChart data={filteredAssessmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="fillTotalAssessments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-totalAssessments)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-totalAssessments)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  }}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })} indicator="dot" />} />
                <Area dataKey="totalAssessments" type="natural" fill="url(#fillTotalAssessments)" stroke="var(--color-totalAssessments)" stackId="a" />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="w-full max-w-5xl">
          <CardHeader>
            <CardTitle>Votes Per Question</CardTitle>
            <CardDescription>
              Showing the number of votes for each option per question
            </CardDescription>
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 mt-4 border rounded"
            />
          </CardHeader>
          <CardContent>
            {filteredQuestionVotes.map((questionVote) => (
              <div key={questionVote.question} className="mb-8">
                <h3 className="text-xl font-semibold mb-4">{questionVote.question}</h3>
                <ChartContainer config={questionVotesChartConfig}>
                  <BarChart
                    data={questionVote.options}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    width={600}
                    height={300}
                    className="w-full"
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="text" />
                    <YAxis />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                    <Bar dataKey="count" fill="var(--color-count)" radius={8}>
                      <LabelList dataKey="count" position="top" className="fill-foreground" fontSize={12} />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
