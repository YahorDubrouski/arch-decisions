import {asClass, asFunction, createContainer, InjectionMode} from 'awilix';
import {RecommendationsController} from '@/controllers/recommendations.controller.js';
import {ArchitectureDecisionsController} from '@/controllers/architecture-decisions.controller.js';
import {JobsController} from '@/controllers/jobs.controller.js';
import {EvaluateRecommendationsService} from '@/services/recommendations/evaluate-recommendations.service.js';
import {GenerateArchitectureDecisionService} from '@/services/architecture-decisions/generate-architecture-decision.service.js';
import {EnqueueArchitectureJobService} from '@/services/jobs/enqueue-architecture-job.service.js';
import {GetArchitectureJobService} from '@/services/jobs/get-architecture-job.service.js';
import type {RecommendationProvider} from '@/services/recommendations/recommendation-provider.js';
import type {ArchitectureDecisionGenerator} from '@/services/architecture-decisions/architecture-decision-generator.js';
import type {ArchitectureDecisionRepository} from '@/integrations/storage/architecture-decision-repository.js';
import {createRecommendationProvider} from '@/integrations/openai/recommendation-provider.factory.js';
import {createArchitectureDecisionGeneratorProvider} from '@/integrations/openai/architecture-decision-provider.factory.js';
import {createArchitectureDecisionRepository} from '@/integrations/storage/architecture-decision-repository.factory.js';

export interface AppCradle {
    recommendationProvider: RecommendationProvider;
    evaluateRecommendationsService: EvaluateRecommendationsService;
    enqueueArchitectureJobService: EnqueueArchitectureJobService;
    getArchitectureJobService: GetArchitectureJobService;
    recommendationsController: RecommendationsController;
    jobsController: JobsController;
    architectureDecisionRepository: ArchitectureDecisionRepository;
    architectureDecisionGenerator: ArchitectureDecisionGenerator;
    generateArchitectureDecisionService: GenerateArchitectureDecisionService;
    architectureDecisionsController: ArchitectureDecisionsController;
}

export function createAppContainer() {
    return createContainer<AppCradle>({
        injectionMode: InjectionMode.CLASSIC,
    }).register({
        recommendationProvider: asFunction(createRecommendationProvider).singleton(),
        evaluateRecommendationsService: asClass(EvaluateRecommendationsService).singleton(),
        enqueueArchitectureJobService: asClass(EnqueueArchitectureJobService).singleton(),
        getArchitectureJobService: asClass(GetArchitectureJobService).singleton(),
        recommendationsController: asClass(RecommendationsController).singleton(),
        jobsController: asClass(JobsController).singleton(),
        architectureDecisionRepository: asFunction(createArchitectureDecisionRepository).singleton(),
        architectureDecisionGenerator: asFunction(createArchitectureDecisionGeneratorProvider).singleton(),
        generateArchitectureDecisionService: asClass(GenerateArchitectureDecisionService).singleton(),
        architectureDecisionsController: asClass(ArchitectureDecisionsController).singleton(),
    });
}

export type AppContainer = ReturnType<typeof createAppContainer>;
