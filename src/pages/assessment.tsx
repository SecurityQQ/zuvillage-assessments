import { useState, useEffect } from 'react';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { PrismaClient, Identity } from '@prisma/client';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type AssessmentProps = {
  identities: Identity[];
  userId: string; // Assume userId is passed as a prop
};

type Option = {
  text: string;
  points: ScoreType;
};

type Question = {
  question: string;
  options: Option[];
};

type ScoreType = {
  [key: string]: number;
};

const Assessment = ({ identities, userId }: AssessmentProps) => {
  const [identityList] = useState(identities);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<ScoreType>(
    identities.reduce((acc, identity) => ({ ...acc, [identity.name]: 0 }), {})
  );
  const [answersHistory, setAnswersHistory] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [endOfAssessment, setEndOfAssessment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  useEffect(() => {
    const fetchInitialQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/generate-questions');
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching initial questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialQuestions();
  }, []);

  const handleAnswer = (points: ScoreType) => {
    const newScores = { ...scores };
    for (const [key, value] of Object.entries(points)) {
      newScores[key] += value;
    }
    setScores(newScores);
    setAnswersHistory([...answersHistory, { question: questions[currentQuestion].question, points }]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setEndOfAssessment(true);
    }
  };

  const handleGenerateQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/generate-questions');
      const generatedQuestions = response.data;
      setQuestions([...questions, ...generatedQuestions]);
      setEndOfAssessment(false);
      setCurrentQuestion(currentQuestion + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueAssessment = () => {
    handleGenerateQuestions();
  };

  const handleGetResults = async () => {
    setShowResults(true);
    await saveResults();
  };

  const saveResults = async () => {
    try {
      await axios.post('/api/save-assessment', {
        userId,
        scores,
        answersHistory,
      });
    } catch (error) {
      console.error('Error saving assessment results:', error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
        <div className="bg-card p-6 rounded-lg shadow-lg max-w-lg w-full mb-4">
          {showDisclaimer ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">ZuVillage Rationality Assessment</h2>
              <p className="mb-4 text-muted-foreground">
                {"You will be asked a series of rationality questions. Questions are contributed by the ZuVillage community. Everyone can add a question, and we will randomly shuffle these questions. Based on your answers, you will receive an independent result on how rational you are, based on both professional and community assessments. You can request more questions if you find them useful or finish at any time."}
              </p>
              <Button onClick={() => setShowDisclaimer(false)} className="w-full">
                Start Assessment
              </Button>
            </div>
          ) : showResults ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Results</h2>
              {Object.entries(scores).map(([badge, score]) => (
                <div key={badge} className="mb-2">
                  <span className="font-semibold">{badge}:</span> {score}
                </div>
              ))}
            </div>
          ) : endOfAssessment ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">End of Assessment</h2>
              <Button onClick={handleContinueAssessment} className="w-full mb-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  'More Questions'
                )}
              </Button>
              <Button onClick={handleGetResults} className="w-full" disabled={isLoading}>
                Get Results
              </Button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-4">{questions[currentQuestion]?.question}</h2>
              <div className="flex flex-col space-y-2">
                {questions[currentQuestion]?.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(option.points)}
                    className="w-full h-full flex-grow flex items-center justify-center overflow-hidden text-center"
                    disabled={isLoading}
                  >
                    <span className="whitespace-normal">{option.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const prisma = new PrismaClient();
  const identities = await prisma.identity.findMany();

  return {
    props: { 
      identities, 
      userId: context.params?.userId || 'your-user-id' // Replace 'your-user-id' with the actual user ID from the context or session
    },
  };
};

export default Assessment;
