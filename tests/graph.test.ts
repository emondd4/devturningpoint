import { describe, expect, it } from 'vitest';
import {
  buildRoadmap,
  getAllPrerequisiteAncestors,
  getDirectPrerequisites,
  getMissingPrerequisites,
  suggestLearningOrder,
  validateGraph,
} from '../src/utils/graph';
import { masterGraph } from '../src/data/skill-graphs/master-graph';
import rawJson from '../src/data/skill-graphs/master-graph.json';
import { scoreAssessment } from '../src/data/assessments/score';
import { devopsAssessment } from '../src/data/assessments/devops';

describe('master skill graph', () => {
  it('has at least 80 nodes and many requires edges', () => {
    expect(masterGraph.nodes.length).toBeGreaterThanOrEqual(80);
    const requires = masterGraph.edges.filter((e) => e.type === 'requires');
    expect(requires.length).toBeGreaterThan(50);
  });

  it('passes validateGraph with no issues', () => {
    expect(validateGraph(masterGraph)).toEqual([]);
  });

  it('mirrors master-graph.json', () => {
    expect(masterGraph.nodes).toEqual(rawJson.nodes);
    expect(masterGraph.edges).toEqual(rawJson.edges);
  });

  it('computes docker prerequisites', () => {
    expect(getDirectPrerequisites(masterGraph, 'DEVOPS-DOCKER')).toContain('DEVOPS-LINUX');
    const ancestors = getAllPrerequisiteAncestors(masterGraph, 'DEVOPS-KUBERNETES');
    expect(ancestors).toContain('DEVOPS-DOCKER');
    expect(ancestors).toContain('DEVOPS-LINUX');
  });

  it('finds missing prerequisites for React', () => {
    const missing = getMissingPrerequisites(masterGraph, 'FRONTEND-REACT', [
      'FRONTEND-JAVASCRIPT',
    ]);
    expect(missing).toContain('FRONTEND-TYPESCRIPT');
  });

  it('orders learning without cycles', () => {
    const order = suggestLearningOrder(masterGraph, [
      'FRONTEND-REACT',
      'FRONTEND-TYPESCRIPT',
      'FRONTEND-JAVASCRIPT',
      'FRONTEND-HTML',
    ]);
    expect(order.indexOf('FRONTEND-HTML')).toBeLessThan(order.indexOf('FRONTEND-JAVASCRIPT'));
    expect(order.indexOf('FRONTEND-JAVASCRIPT')).toBeLessThan(order.indexOf('FRONTEND-TYPESCRIPT'));
  });

  it('builds roadmap for backend goals', () => {
    const roadmap = buildRoadmap({
      graph: masterGraph,
      knownSkillIds: ['FOUNDATIONS-FUNCTIONS', 'FRONTEND-TYPESCRIPT', 'FOUNDATIONS-HTTP'],
      goalSkillIds: ['BACKEND-NESTJS'],
    });
    expect(roadmap.ordered.length).toBeGreaterThan(0);
    expect(roadmap.ordered).not.toContain('FRONTEND-TYPESCRIPT');
  });

  it('builds a roadmap that puts Docker before Kubernetes goals', () => {
    const roadmap = buildRoadmap({
      graph: masterGraph,
      knownSkillIds: [
        'DEVOPS-LINUX',
        'FOUNDATIONS-GIT',
        'FOUNDATIONS-OS-PERMISSIONS',
        'FOUNDATIONS-PROCESSES',
        'FOUNDATIONS-TCP-IP',
        'FOUNDATIONS-DNS',
        'FOUNDATIONS-HTTPS-TLS',
      ],
      goalSkillIds: ['DEVOPS-KUBERNETES'],
    });
    expect(roadmap.ordered).toContain('DEVOPS-DOCKER');
    expect(roadmap.ordered.indexOf('DEVOPS-DOCKER')).toBeLessThan(
      roadmap.ordered.indexOf('DEVOPS-KUBERNETES'),
    );
  });
});

describe('assessment scoring (graph suite)', () => {
  it('scores a strong devops learner', () => {
    const score = scoreAssessment(devopsAssessment, {
      'devops-conf-linux': 5,
      'devops-conf-k8s': 4,
      'devops-mcq-docker': 'a',
      'devops-mcq-compose': 'a',
      'devops-conceptual-cicd': 'a',
      'devops-scenario-proxy': 'a',
      'devops-code-reading-dockerfile': 'a',
      'devops-mcq-aws': 'a',
    });
    expect(score.demonstrated.length).toBeGreaterThan(0);
    expect(score.missing).not.toContain('DEVOPS-DOCKER');
  });

  it('marks beginner gaps', () => {
    const score = scoreAssessment(devopsAssessment, {
      'devops-conf-linux': 1,
      'devops-conf-k8s': 1,
      'devops-mcq-docker': 'b',
      'devops-mcq-compose': 'b',
      'devops-conceptual-cicd': 'b',
      'devops-scenario-proxy': 'b',
      'devops-code-reading-dockerfile': 'b',
      'devops-mcq-aws': 'b',
    });
    expect(score.missing.length + score.uncertain.length).toBeGreaterThan(0);
  });
});
