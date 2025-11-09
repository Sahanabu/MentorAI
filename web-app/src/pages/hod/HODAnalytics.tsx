import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/layout/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/layout/ui/card";
import { Button } from "@/components/layout/ui/button";
import { Badge } from "@/components/layout/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/layout/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/layout/ui/select";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, ComposedChart, ScatterChart, Scatter } from "recharts";
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, Activity, Target, Users, AlertTriangle, Brain, Download, Filter, Calendar } from "lucide-react";

const HODAnalytics = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "hod") {
      navigate("/login");
    }
  }, [navigate]);

  // Mock analytics data
  const performanceTrends = [
    { month: "Jan", avgCGPA: 7.8, attendance: 85, passRate: 92 },
    { month: "Feb", avgCGPA: 8.0, attendance: 87, passRate: 94 },
    { month: "Mar", avgCGPA: 8.1, attendance: 86, passRate: 93 },
    { month: "Apr", avgCGPA: 8.2, attendance: 88, passRate: 95 },
    { month: "May", avgCGPA: 8.3, attendance: 89, passRate: 96 },
    { month: "Jun", avgCGPA: 8.2, attendance: 87, passRate: 94 },
  ];

  const riskPredictionData = [
    { semester: "Sem 3", lowRisk: 65, mediumRisk: 25, highRisk: 10 },
    { semester: "Sem 4", lowRisk: 70, mediumRisk: 20, highRisk: 10 },
    { semester: "Sem 5", lowRisk: 68, mediumRisk: 22, highRisk: 10 },
    { semester: "Sem 6", lowRisk: 72, mediumRisk: 18, highRisk: 10 },
    { semester: "Sem 7", lowRisk: 75, mediumRisk: 15, highRisk: 10 },
    { semester: "Sem 8", lowRisk: 78, mediumRisk: 12, highRisk: 10 },
  ];

  const subjectCorrelationData = [
    { subject: "Data Structures", attendance: 85, marks: 78, correlation: 0.75 },
    { subject: "Algorithms", attendance: 82, marks: 75, correlation: 0.72 },
    { subject: "Database", attendance: 88, marks: 82, correlation: 0.78 },
    { subject: "Web Dev", attendance: 90, marks: 85, correlation: 0.82 },
    { subject: "AI/ML", attendance: 78, marks: 72, correlation: 0.68 },
    { subject: "Networks", attendance: 86, marks: 80, correlation: 0.76 },
  ];

  const placementAnalytics = [
    { year: "2020", placed: 78, avgPackage: 6.5, companies: 45 },
    { year: "2021", placed: 82, avgPackage: 7.2, companies: 52 },
    { year: "2022", placed: 85, avgPackage: 8.5, companies: 58 },
    { year: "2023", placed: 92, avgPackage: 9.2, companies: 65 },
    { year: "2024", placed: 87, avgPackage: 9.8, companies: 62 },
  ];

  const aiInsights = [
    {
      title: "Performance Prediction Accuracy",
      value: "94.2%",
      trend: "up",
      description: "AI model accuracy in predicting student performance"
    },
    {
      title: "Risk Detection Rate",
      value: "89.7%",
      trend: "up",
      description: "Early identification of at-risk students"
    },
    {
      title: "Intervention Success Rate",
      value: "76.3%",
      trend: "up",
      description: "Effectiveness of mentoring interventions"
    },
    {
      title: "Dropout Prevention",
      value: "15.2%",
      trend: "up",
      description: "Reduction in potential dropout cases"
    }
  ];

  const predictiveMetrics = [
    { metric: "Next Semester CGPA", current: 8.2, predicted: 8.4, confidence: 87 },
    { metric: "Pass Rate", current: 94, predicted: 95, confidence: 92 },
    { metric: "Placement Rate", current: 87, predicted: 89, confidence: 78 },
    { metric: "At-Risk Students", current: 45, predicted: 38, confidence: 83 },
  ];

  const cohortAnalysis = [
    { cohort: "2020-24", strength: 120, graduated: 115, placed: 105, avgCGPA: 8.1 },
    { cohort: "2021-25", strength: 118, graduated: 0, placed: 0, avgCGPA: 8.3 },
    { cohort: "2022-26", strength: 115, graduated: 0, placed: 0, avgCGPA: 8.2 },
    { cohort: "2023-27", strength: 110, graduated: 0, placed: 0, avgCGPA: 8.4 },
  ];

  return (
    <DashboardLayout role="hod">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Advanced Analytics</h1>
            <p className="text-muted-foreground">Deep insights and predictive analytics for department management</p>
          </div>
          <div className="flex items-center gap-4">
            <Select defaultValue="current-semester">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-semester">Current Semester</SelectItem>
                <SelectItem value="last-semester">Last Semester</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* AI Insights Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {aiInsights.map((insight, index) => (
            <Card key={index} className="border-primary/20 bg-gradient-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{insight.value}</p>
                    <p className="text-sm text-muted-foreground">{insight.title}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${insight.trend === 'up' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                    {insight.trend === 'up' ? (
                      <TrendingUp className="w-5 h-5 text-success" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{insight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="predictive">Predictive</TabsTrigger>
            <TabsTrigger value="correlation">Correlation</TabsTrigger>
            <TabsTrigger value="placement">Placement</TabsTrigger>
            <TabsTrigger value="cohort">Cohort Analysis</TabsTrigger>
          </TabsList>

          {/* Performance Analytics */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Performance Trends
                  </CardTitle>
                  <CardDescription>Multi-metric performance analysis over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={performanceTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                      <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)"
                        }}
                      />
                      <Bar yAxisId="left" dataKey="avgCGPA" fill="hsl(var(--primary))" name="Avg CGPA" />
                      <Line yAxisId="right" type="monotone" dataKey="attendance" stroke="hsl(var(--success))" strokeWidth={3} name="Attendance %" />
                      <Line yAxisId="right" type="monotone" dataKey="passRate" stroke="hsl(var(--warning))" strokeWidth={3} name="Pass Rate %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-primary" />
                    Risk Prediction Trends
                  </CardTitle>
                  <CardDescription>Risk level distribution across semesters</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={riskPredictionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="semester" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)"
                        }}
                      />
                      <Area type="monotone" dataKey="lowRisk" stackId="1" stroke="hsl(var(--success))" fill="hsl(var(--success))" name="Low Risk" />
                      <Area type="monotone" dataKey="mediumRisk" stackId="1" stroke="hsl(var(--warning))" fill="hsl(var(--warning))" name="Medium Risk" />
                      <Area type="monotone" dataKey="highRisk" stackId="1" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" name="High Risk" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Predictive Analytics */}
          <TabsContent value="predictive" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Predictive Metrics
                </CardTitle>
                <CardDescription>AI-powered predictions for key department metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {predictiveMetrics.map((metric, index) => (
                    <div key={index} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-foreground">{metric.metric}</h4>
                        <Badge variant="outline" className="text-xs">
                          {metric.confidence}% confidence
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Current</p>
                          <p className="text-2xl font-bold text-foreground">{metric.current}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Predicted</p>
                          <p className="text-2xl font-bold text-primary">{metric.predicted}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Change</span>
                          <span>{((metric.predicted - metric.current) / metric.current * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(metric.predicted / (metric.current + metric.predicted) * 2) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Correlation Analysis */}
          <TabsContent value="correlation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Attendance-Performance Correlation
                </CardTitle>
                <CardDescription>Relationship between attendance and academic performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart data={subjectCorrelationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="attendance" name="Attendance %" stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="marks" name="Average Marks" stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)"
                      }}
                      labelFormatter={(value) => `Attendance: ${value}%`}
                      formatter={(value, name) => [value, name]}
                    />
                    <Scatter name="Average Marks" dataKey="marks" fill="hsl(var(--primary))" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Placement Analytics */}
          <TabsContent value="placement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Placement Trends & Analytics
                </CardTitle>
                <CardDescription>Year-wise placement statistics and salary trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={placementAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                    <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)"
                      }}
                    />
                    <Bar yAxisId="left" dataKey="placed" fill="hsl(var(--primary))" name="Students Placed" />
                    <Line yAxisId="right" type="monotone" dataKey="avgPackage" stroke="hsl(var(--success))" strokeWidth={3} name="Avg Package (LPA)" />
                    <Line yAxisId="left" type="monotone" dataKey="companies" stroke="hsl(var(--warning))" strokeWidth={2} name="Companies" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cohort Analysis */}
          <TabsContent value="cohort" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Cohort Analysis
                </CardTitle>
                <CardDescription>Performance tracking across different student batches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Cohort</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Strength</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Graduated</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Placed</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Avg CGPA</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Placement Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cohortAnalysis.map((cohort, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 font-medium text-foreground">{cohort.cohort}</td>
                          <td className="py-3 px-4 text-muted-foreground">{cohort.strength}</td>
                          <td className="py-3 px-4 text-muted-foreground">{cohort.graduated || '-'}</td>
                          <td className="py-3 px-4 text-muted-foreground">{cohort.placed || '-'}</td>
                          <td className="py-3 px-4 font-medium text-foreground">{cohort.avgCGPA}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="h-2 bg-muted rounded-full flex-1 max-w-[100px]">
                                <div
                                  className="h-full bg-gradient-primary rounded-full"
                                  style={{ width: cohort.graduated ? `${(cohort.placed / cohort.graduated * 100)}%` : '0%' }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {cohort.graduated ? `${((cohort.placed / cohort.graduated) * 100).toFixed(0)}%` : '-'}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Export Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Export Analytics</CardTitle>
            <CardDescription>Download detailed reports and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button className="h-auto p-4 flex flex-col items-center gap-2">
                <Download className="w-6 h-6" />
                <span>Performance Report</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Download className="w-6 h-6" />
                <span>Risk Analysis</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Download className="w-6 h-6" />
                <span>Placement Data</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Download className="w-6 h-6" />
                <span>Custom Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HODAnalytics;
