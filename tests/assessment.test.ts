import { describe, expect, it } from 'vitest';
import { scoreAssessment } from '../src/data/assessments/score';
import { foundationsAssessment } from '../src/data/assessments/foundations';
import { frontendAssessment } from '../src/data/assessments/frontend';
import { devopsAssessment } from '../src/data/assessments/devops';
import { masterGraph } from '../src/data/skill-graphs/master-graph';

describe('scoreAssessment', () => {
  it('marks high confidence and correct answers as demonstrated', () => {
    const result = scoreAssessment({
      bank: foundationsAssessment,
      graph: masterGraph,
      answers: [
        { questionId: 'foundations-conf-binary', value: 5 },
        { questionId: 'foundations-conf-git', value: 4 },
        { questionId: 'foundations-mcq-http-method', value: 'b' },
        { questionId: 'foundations-mcq-complexity', value: 'b' },
        { questionId: 'foundations-conceptual-process', value: 'b' },
        { questionId: 'foundations-scenario-tls', value: 'b' },
        { questionId: 'foundations-code-reading-loop', value: 'c' },
        { questionId: 'foundations-mcq-dns', value: 'b' },
      ],
    });

    expect(result.demonstrated).toContain('FOUNDATIONS-BINARY');
    expect(result.demonstrated).toContain('FOUNDATIONS-HTTP');
    expect(result.missing).not.toContain('FOUNDATIONS-BINARY');
    expect(result.skillScores['FOUNDATIONS-BINARY']).toBe(1);
  });

  it('classifies low confidence as missing and mid confidence as uncertain', () => {
    const result = scoreAssessment({
      bank: foundationsAssessment,
      graph: masterGraph,
      answers: [
        { questionId: 'foundations-conf-binary', value: 1 },
        { questionId: 'foundations-conf-git', value: 3 },
      ],
    });

    expect(result.missing).toContain('FOUNDATIONS-BINARY');
    expect(result.uncertain).toContain('FOUNDATIONS-GIT');
  });

  it('treats wrong MCQ answers as missing evidence for mapped skills', () => {
    const result = scoreAssessment({
      bank: frontendAssessment,
      graph: masterGraph,
      answers: [{ questionId: 'frontend-mcq-semantic', value: 'a' }],
    });

    expect(result.missing).toEqual(
      expect.arrayContaining(['FRONTEND-HTML-SEMANTICS', 'FRONTEND-A11Y']),
    );
    expect(result.demonstrated).not.toContain('FRONTEND-HTML-SEMANTICS');
  });

  it('returns a deterministic recommendedStartId from learning order', () => {
    const a = scoreAssessment({
      bank: devopsAssessment,
      graph: masterGraph,
      goalSkillIds: ['DEVOPS-KUBERNETES'],
      answers: [
        { questionId: 'devops-conf-linux', value: 2 },
        { questionId: 'devops-conf-k8s', value: 1 },
        { questionId: 'devops-mcq-docker', value: 'b' },
      ],
    });
    const b = scoreAssessment({
      bank: devopsAssessment,
      graph: masterGraph,
      goalSkillIds: ['DEVOPS-KUBERNETES'],
      answers: [
        { questionId: 'devops-conf-linux', value: 2 },
        { questionId: 'devops-conf-k8s', value: 1 },
        { questionId: 'devops-mcq-docker', value: 'b' },
      ],
    });

    expect(a.recommendedStartId).toBeTruthy();
    expect(a.recommendedStartId).toBe(b.recommendedStartId);
    expect(a.demonstrated).toEqual(b.demonstrated);
    expect(a.uncertain).toEqual(b.uncertain);
    expect(a.missing).toEqual(b.missing);
  });

  it('includes missing prerequisites for advanced goals', () => {
    const result = scoreAssessment({
      bank: devopsAssessment,
      graph: masterGraph,
      goalSkillIds: ['DEVOPS-KUBERNETES'],
      answers: [{ questionId: 'devops-conf-k8s', value: 1 }],
    });

    expect(result.missingPrerequisites.length).toBeGreaterThan(0);
    expect(result.missingPrerequisites).toContain('DEVOPS-DOCKER');
  });
});
