import Link from 'next/link';
import { useState } from 'react';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [isLoadingAssessment, setIsLoadingAssessment] = useState(false);
  const [isLoadingContribute, setIsLoadingContribute] = useState(false);

  const handleAssessmentClick = () => {
    setIsLoadingAssessment(true);
  };

  const handleContributeClick = () => {
    setIsLoadingContribute(true);
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
        <div className="bg-card p-6 rounded-lg shadow-lg max-w-lg w-full mb-4">
          <h2 className="text-2xl font-bold mb-4">Welcome to ZuVillage Rationality Assessment</h2>
          <p className="text-lg text-muted-foreground mb-4">Ask and Answer Hard Questions about Rationality. Evaluate your rationality and see how you align with our core identities.</p>
          <div className="mb-4">
            <Link href="/assessment">
              <Button
                onClick={handleAssessmentClick}
                className="w-full h-auto mb-2"
                disabled={isLoadingAssessment}
              >
                {isLoadingAssessment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  'Take the ZuVillage Rationality Assessment'
                )}
              </Button>
            </Link>
            <div className="flex flex-row justify-center">
              <p className="mb-4 justify-center">or</p>
              </div>
              <p className="text-lg text-muted-foreground mb-4">Submit a new question or propose a new identity</p>
            <Link href="/contribute">
              <Button
                onClick={handleContributeClick}
                className="w-full h-auto mb-2"
                disabled={isLoadingContribute}
              >
                {isLoadingContribute ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  'Add Questions'
                )}
              </Button>
            </Link>
            
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
