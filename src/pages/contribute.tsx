import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { PrismaClient, Identity } from '@prisma/client';
import debounce from 'lodash/debounce';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

type ContributeProps = {
  identities: Identity[];
};

type IdentityVotesType = {
  [key: string]: number;
};

const Contribute = ({ identities }: ContributeProps) => {
  const [identityList, setIdentityList] = useState(identities);
  const [newIdentity, setNewIdentity] = useState('');
  const [identityVotes, setIdentityVotes] = useState<IdentityVotesType>(
    identities.reduce((acc, identity) => ({ ...acc, [identity.name]: identity.votes }), {})
  );

  const [newQuestion, setNewQuestion] = useState('');
  const [newOption1, setNewOption1] = useState('');
  const [newOption2, setNewOption2] = useState('');
  const [selectedIdentitiesOption1, setSelectedIdentitiesOption1] = useState<string[]>([]);
  const [selectedIdentitiesOption2, setSelectedIdentitiesOption2] = useState<string[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    sortIdentitiesByVotes();
  }, [identityVotes]);

  const sortIdentitiesByVotes = () => {
    const sortedIdentities = [...identityList].sort((a, b) => identityVotes[b.name] - identityVotes[a.name]);
    setIdentityList(sortedIdentities);
  };

  const debouncedUpdateVotes = useCallback(
    debounce(async (identity, newVotes) => {
      try {
        await axios.post('/api/update-identity-votes', { name: identity, votes: newVotes });
      } catch (error) {
        console.error('Error updating votes:', error);
      }
    }, 500),
    []
  );

  const handleVote = (identity: string, vote: number) => {
    const votedIdentities = JSON.parse(localStorage.getItem('votedIdentities') || '{}');

    if (votedIdentities[identity] === vote) {
      alert('You have already voted this way for this identity in this session.');
      return;
    }

    const newVotes = identityVotes[identity] + vote;
    setIdentityVotes({ ...identityVotes, [identity]: newVotes });
    debouncedUpdateVotes(identity, newVotes);

    votedIdentities[identity] = vote;
    localStorage.setItem('votedIdentities', JSON.stringify(votedIdentities));
  };

  const handleNewIdentity = async () => {
    if (newIdentity && !identityList.some(identity => identity.name === newIdentity)) {
      try {
        const response = await axios.post('/api/identities', { name: newIdentity });
        const newIdentityData = response.data;
        setIdentityList([...identityList, newIdentityData]);
        setIdentityVotes({ ...identityVotes, [newIdentityData.name]: 0 });
        setNewIdentity('');

        toast({
          title: 'Success',
          description: `Identity "${newIdentityData.name}" added successfully.`,
        });
      } catch (error) {
        console.error('Error adding identity:', error);
      }
    }
  };

  const handleNewQuestion = async () => {
    if (newQuestion && newOption1 && newOption2 && (selectedIdentitiesOption1.length > 0 || selectedIdentitiesOption2.length > 0)) {
      const identityIdsOption1 = selectedIdentitiesOption1.map(identity => {
        const identityIndex = identityList.findIndex(id => id.name === identity);
        return identityList[identityIndex].id;
      });

      const identityIdsOption2 = selectedIdentitiesOption2.map(identity => {
        const identityIndex = identityList.findIndex(id => id.name === identity);
        return identityList[identityIndex].id;
      });

      const option1Scores = identityIdsOption1.map(id => ({ identityId: id, score: 1 }));
      const option2Scores = identityIdsOption2.map(id => ({ identityId: id, score: 1 }));

      try {
        await axios.post('/api/questions', {
          text: newQuestion,
          option1: newOption1,
          option2: newOption2,
          option1Scores,
          option2Scores
        });

        setNewQuestion('');
        setNewOption1('');
        setNewOption2('');
        setSelectedIdentitiesOption1([]);
        setSelectedIdentitiesOption2([]);

        toast({
          title: 'Success',
          description: 'Question added successfully.',
        });
      } catch (error) {
        console.error('Error adding question:', error);
      }
    } else {
      alert('Please fill out all fields and select at least one identity for each option.');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 space-y-8">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Submit a Question</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className='text-foreground'>Submit a new question to be included in our assessments, along with two answer options and the identities they affect.</CardDescription>
            <h2 className='pt-4'>Step 1. Write down your question</h2>
            <p className='text-muted-foreground text-sm mb-2'>{'We recommend asking questions in a story-telling format with context to avoid cognitive bias and provide respondents with a complete picture'}</p>
            <Input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="mb-4 text-gray-900 h-64 mt-4"
              placeholder="Enter your question"
            />
            <h2>Step 2. Enter Options for this question</h2>
            <p className='text-muted-foreground text-sm mb-2'>{'This question should have exactly two options, each option should represent a specific identity behind this person. For example if answer "I like eating chips" an identity would be a "Chips lover"'}</p>
            <Input
              value={newOption1}
              onChange={(e) => setNewOption1(e.target.value)}
              className="mb-2 text-gray-900"
              placeholder="Enter first option"
            />
            <div className="mb-2">
              <span className="font-semibold">Affects Identities for Option 1:</span>
              <div className="flex flex-wrap">
                {identityList.map((identity) => (
                  <label key={identity.id} className="flex items-center mr-2">
                    <Checkbox
                      id={`option1-${identity.id}`}
                      checked={selectedIdentitiesOption1.includes(identity.name)}
                      onCheckedChange={(checked) => {
                        setSelectedIdentitiesOption1((prev) =>
                          checked ? [...prev, identity.name] : prev.filter((id) => id !== identity.name)
                        );
                      }}
                      className="mr-1"
                    />
                    <span className="text-foreground">{identity.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <Input
              value={newOption2}
              onChange={(e) => setNewOption2(e.target.value)}
              className="mb-2 text-gray-900"
              placeholder="Enter second option"
            />
            <div className="mb-4">
              <span className="font-semibold">Affects Identities for Option 2:</span>
              <div className="flex flex-wrap">
                {identityList.map((identity) => (
                  <label key={identity.id} className="flex items-center mr-2">
                    <Checkbox
                      id={`option2-${identity.id}`}
                      checked={selectedIdentitiesOption2.includes(identity.name)}
                      onCheckedChange={(checked) => {
                        setSelectedIdentitiesOption2((prev) =>
                          checked ? [...prev, identity.name] : prev.filter((id) => id !== identity.name)
                        );
                      }}
                      className="mr-1"
                    />
                    <span className="text-foreground">{identity.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <Button onClick={handleNewQuestion} className="w-full">
              Add Question
            </Button>
          </CardContent>
        </Card>
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Add New Identities</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Identities</CardDescription>
            <ul>
              {identityList.map((identity) => (
                <li key={identity.id} className="flex justify-between items-center mb-2">
                  <span>{identity.name}</span>
                  <div>
                    <Button onClick={() => handleVote(identity.name, 1)} className="mr-2">
                      Upvote ({identityVotes[identity.name]})
                    </Button>
                    <Button variant="destructive" onClick={() => handleVote(identity.name, -1)}>
                      Downvote
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex mt-4">
              <Input
                value={newIdentity}
                onChange={(e) => setNewIdentity(e.target.value)}
                className="flex-grow text-gray-900"
                placeholder="Propose new identity"
              />
              <Button onClick={handleNewIdentity} className="ml-2">
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const prisma = new PrismaClient();
  const identities = await prisma.identity.findMany();

  return {
    props: { identities },
  };
};

export default Contribute;
