import {asClass, asFunction, createContainer, InjectionMode} from 'awilix';
import {DecisionsController} from '@/controllers/decisions.controller.js';
import {ArchitectureDecisionsController} from '@/controllers/architecture-decisions.controller.js';
import {EvaluateDecisionsService} from '@/services/decisions/evaluate-decisions.service.js';
import {GenerateArchitectureDecisionService} from '@/services/architecture-decisions/generate-architecture-decision.service.js';
import type {DecisionProvider} from '@/services/decisions/decision-provider.js';
import type {ArchitectureDecisionGenerator} from '@/services/architecture-decisions/architecture-decision-generator.js';
import type {ArchitectureDecisionRepository} from '@/integrations/storage/architecture-decision-repository.js';
import {OpenAIDecisionsProvider} from '@/integrations/openai/openai-decisions.provider.js';
import {createArchitectureDecisionGeneratorProvider} from '@/integrations/openai/architecture-decision-provider.factory.js';
import {createArchitectureDecisionRepository} from '@/integrations/storage/architecture-decision-repository.factory.js';

export interface AppCradle {
    decisionProvider: DecisionProvider;
    evaluateDecisionsService: EvaluateDecisionsService;
    decisionsController: DecisionsController;
    architectureDecisionRepository: ArchitectureDecisionRepository;
    architectureDecisionGenerator: ArchitectureDecisionGenerator;
    generateArchitectureDecisionService: GenerateArchitectureDecisionService;
    architectureDecisionsController: ArchitectureDecisionsController;
}

export function createAppContainer() {
    return createContainer<AppCradle>({
        injectionMode: InjectionMode.CLASSIC,
    }).register({
        decisionProvider: asClass(OpenAIDecisionsProvider).singleton(),
        evaluateDecisionsService: asClass(EvaluateDecisionsService).singleton(),
        decisionsController: asClass(DecisionsController).singleton(),
        architectureDecisionRepository: asFunction(createArchitectureDecisionRepository).singleton(),
        architectureDecisionGenerator: asFunction(createArchitectureDecisionGeneratorProvider).singleton(),
        generateArchitectureDecisionService: asClass(GenerateArchitectureDecisionService).singleton(),
        architectureDecisionsController: asClass(ArchitectureDecisionsController).singleton(),
    });
}

export type AppContainer = ReturnType<typeof createAppContainer>;
